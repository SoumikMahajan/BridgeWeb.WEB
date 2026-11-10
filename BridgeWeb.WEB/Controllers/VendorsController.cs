using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Application.Common.Interfaces.Vendor;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Model.Dto.SystemUserType;
using BridgeWeb.Domain.Model.Dto.Vendor;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    //[ServiceFilter(typeof(GlobalExceptionRedirection))]
    public class VendorsController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogService _logService;
        private readonly ISystemAdminRepository _systemAdminRepository;
        private readonly IVendorRepository _vendorRepository;

        public VendorsController(IWebHostEnvironment webHostEnvironment, ILogService logService, ISystemAdminRepository systemAdminRepository, IVendorRepository vendorRepository)
        {
            _webHostEnvironment = webHostEnvironment;
            _logService = logService;
            _systemAdminRepository = systemAdminRepository;
            _vendorRepository = vendorRepository;
        }

        #region:: Add Vendor
        [Authorize]
        public async Task<IActionResult> AddVendor()
        {
            var VendorResponse = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();
            var currResponse = await _vendorRepository.GetAllCurrencyOnAddVendor<APIResponse>();
            var ClassificationResponse = await _vendorRepository.GetAllClassificationsOnAddVendor<APIResponse>();
            var Countryresponse = await _systemAdminRepository.GetAllCountryOnStatesTabAsync<APIResponse>();

            var mmm = new MultipleModel();

            mmm.vendorTermsList = VendorResponse.UnwrapResultOrDefault<List<VendorTermsDto>>();
            mmm.currencyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();
            mmm.classificationsList = ClassificationResponse.UnwrapResultOrDefault<List<ClassificationsDto>>();
            mmm.CountryList = Countryresponse.UnwrapResultOrDefault<List<CountryDto>>();
            
            return View(mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllStatesOnAddVendorByCountryId(string CountryId)
        {
            if (!long.TryParse(CountryId, out long parsedCountryId))
                return ApiResponseService.BadRequestResponse("Invalid Country Id.");

            var response = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(parsedCountryId);

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }


        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddParentVendor(ParentVendorCreateDto createDto)
        {
            if (string.IsNullOrWhiteSpace(createDto.ParentVendorName))
                return ApiResponseService.BadRequestResponse("ParentVendorName Can not null or empty");

            var response = await _vendorRepository.IsParentVendorExists<APIResponse>(createDto.ParentVendorName);

            if (response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            var serializedData = JsonConvert.SerializeObject(createDto);
            TempData["PARENTVENDORDETAILS"] = serializedData;
            HttpContext.Session.SetString("PARENTVENDORDETAILS", serializedData);

            return ApiResponseService.SuccessResponse(response!.Result);
        }

        [Authorize]
        public async Task<IActionResult> VendorContactsForNewParentVendor()
        {
            MultipleModel mmm = new MultipleModel();
            List<StateDto> stateList = new();
            List<SystemPermissionList> systemPermissionLists = new();

            var serializedData = HttpContext.Session.GetString("PARENTVENDORDETAILS");
            if (!string.IsNullOrEmpty(serializedData))
            {
                // Deserialize the JSON string back to the ParentVendorCreateDto object
                ParentVendorCreateDto createDto = JsonConvert.DeserializeObject<ParentVendorCreateDto>(serializedData) ?? new();

                if (createDto.State != 0)
                {
                    var StateResponce = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(Convert.ToInt64(createDto.Country));

                    stateList = StateResponce.UnwrapResultOrDefault<List<StateDto>>();

                }
                mmm.parentVendorCreateDto = createDto;

            }

            var Countryresponse = await _systemAdminRepository.GetAllCountryOnStatesTabAsync<APIResponse>();
            var systempermissionResult = await _vendorRepository.GetSystemPermissionForVendor<APIResponse>(0);

            mmm.CountryList = Countryresponse.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.StateList = stateList;
            mmm.systemPermissionLists = systemPermissionLists;
            mmm.venndorSystemPermissionList = systempermissionResult.UnwrapResultOrDefault<List<VenndorSystemPermissionDto>>();
            return View(mmm);

        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateVendorContactForNew(VendorCreateDto vendorCreateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var request = HttpContext.Request;
            vendorCreateDto.CurrentUrl = $"{request.Scheme}://{request.Host}";
            vendorCreateDto.Fax ??= "";

            var serializedData = HttpContext.Session.GetString("PARENTVENDORDETAILS");

            if (string.IsNullOrEmpty(serializedData))
                return ApiResponseService.InternalServerResponse("Session Expired, Please fill the Parent Vendor details again.");

            var createDto = JsonConvert.DeserializeObject<ParentVendorCreateDto>(serializedData) ?? new();
            createDto.CreatedBy = userId;

            // Validate IsSystemUser value
            if (vendorCreateDto.IsSystemUser != 0 && vendorCreateDto.IsSystemUser != 1)
                return ApiResponseService.BadRequestResponse("Invalid system user type.");

            if (vendorCreateDto.IsSystemUser == 1)
            {
                var emailExistsResponse = await _vendorRepository.IsEmailExists<APIResponse>(vendorCreateDto.Email ?? "");

                if (!emailExistsResponse.IsSuccess)
                    return ApiResponseService.BadRequestResponse(emailExistsResponse.Result?.ToString() ?? "Email already exists.");
            }

            var createVendorAndParentVendorDto = new CreateVendorAndParentVendorDto
            {
                ParentVendorCreateDto = createDto,
                VendorCreateDto = vendorCreateDto
            };

            var vendorSaveResponse = await _vendorRepository.SaveAllVendorDeatils<APIResponse>(createVendorAndParentVendorDto);

            if (!vendorSaveResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(vendorSaveResponse.ErrorMessages?.FirstOrDefault() ?? "Unable to save vendor details.");

            HttpContext.Session.Remove("PARENTVENDORDETAILS");

            return ApiResponseService.SuccessResponse(vendorSaveResponse.Result);

        }
        #endregion

        #region::VendorList

        [Authorize]
        public IActionResult VendorList()
        {
            return View();

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAllVendorTableBind([FromBody] VendorListRequestDto request)
        {
            var VendorListResponse = await _vendorRepository.GetAllVendorList<APIResponse>(request);

            if (VendorListResponse == null || !VendorListResponse.IsSuccess || VendorListResponse.Result == null)
            {
                return Json(new
                {
                    draw = request.Draw,
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<object>()
                });
            }

            var result = JsonConvert.DeserializeObject<DataTableResponse<ParentVendorListDto>>(Convert.ToString(VendorListResponse.Result)!) ?? new();

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = result.RecordsTotal,
                recordsFiltered = result.RecordsFiltered,
                data = result.Data
            });


        }

        #endregion

        #region::Vendor Edit

        [Authorize]
        [PageAuthorization("16")]
        public async Task<IActionResult> EditVendor(int vendorid)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            var checkAccess = await _vendorRepository.CheckAuthority<APIResponse>(15, Convert.ToInt32(userId));
            var checkAccess1 = await _vendorRepository.CheckAuthority<APIResponse>(16, Convert.ToInt32(userId));

            if (checkAccess.Result?.ToString() == "0" && checkAccess1.Result?.ToString() == "0")
                return RedirectToAction("dashboard", "Home");


            var parentResponse = await _vendorRepository.GetAllParentVendorDetails<APIResponse>(vendorid);
            var parentVendorsDto = parentResponse.UnwrapResultOrDefault<ParentVendorsDto>();
            var stateresponce = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(parentVendorsDto.Country);
            var Remit_stateresponce = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(Convert.ToInt64(parentVendorsDto.R_Country));
            var VendorResponse = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();
            var currResponse = await _vendorRepository.GetAllCurrencyOnAddVendor<APIResponse>();
            var ClassificationResponse = await _vendorRepository.GetAllSelectedClassificationVendor<APIResponse>(vendorid);
            var Countryresponse = await _systemAdminRepository.GetAllCountryOnStatesTabAsync<APIResponse>();


            DateTime fromDate = new DateTime(DateTime.Now.Year, 1, 1);
            DateTime toDate = DateTime.Today;

            var ytdDetails = await _vendorRepository.GetYTDForVendor<APIResponse>(vendorid, fromDate, toDate); 

            var mmm = new MultipleModel();
            mmm.vendorTermsList = VendorResponse.UnwrapResultOrDefault<List<VendorTermsDto>>();
            mmm.currencyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();
            mmm.classificationsList = ClassificationResponse.UnwrapResultOrDefault<List<ClassificationsDto>>();
            mmm.CountryList = Countryresponse.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.parentVendorDto = parentVendorsDto;
            mmm.StateList = stateresponce.UnwrapResultOrDefault<List<StateDto>>(); 
            mmm.Remit_StateList = Remit_stateresponce.UnwrapResultOrDefault<List<StateDto>>();
            mmm.YTDPurchaseOrderWithCurrCodeDTO = ytdDetails.UnwrapResultOrDefault<YTDPurchaseOrderWithCurrCodeDTO>();


            return View(mmm);
        }
        [Authorize]
        public async Task<IActionResult> VendorContactListing(string vendorId, string active)
        {
            MultipleModel mmm = new MultipleModel();
            if (active == null || active == "All")
            {
                active = "null";
            }

            var ResponcevendorContact = await _vendorRepository.GetVendorContactByParentVendorId<APIResponse>(long.Parse(vendorId), active);

            mmm.VendorContactUpdateDto = ResponcevendorContact.UnwrapResultOrDefault<List<VendorListDto>>();
            return PartialView("~/Views/Vendors/_partialVendorContactListing.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> DeleteVendorContact(string vendorId)
        {
            if (!long.TryParse(vendorId, out long parsedVendorId))
            {
                return ApiResponseService.BadRequestResponse("Invalid vendor Id.");
            }

            var response = await _vendorRepository.DeleteVendorContact<APIResponse>(parsedVendorId);

            if(response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> VendorContactTableBind(string parentvendorid)
        {
            MultipleModel mmm = new MultipleModel();

            var VendorListResponse = await _vendorRepository.GetcontactVendorDetails<APIResponse>(Convert.ToInt32(parentvendorid));

            mmm.parentVendorsList = VendorListResponse.UnwrapResultOrDefault<List<ParentVendorsDto>>(); ;
            return PartialView("~/Views/Vendors/_partialGetContactVendorListTable.cshtml", mmm);

        }

        public async Task<IActionResult> ProjectListinEditVendor(long vendorId, DateTime FromDate, DateTime ToDate)
        {
            MultipleModel mm = new();

            var response = await _vendorRepository.GetProjetListInEditVendor<APIResponse>(vendorId, FromDate, ToDate);

            mm.ProjectListinVendor = response.UnwrapResultOrDefault<List<ProjectYTDListInVendorDTO>>();

            return PartialView("~/Views/Vendors/_partialProjectListinEditVendor.cshtml", mm);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateParentVendor(UpdateParentVendorDto updateDto)
        {
            var result = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            updateDto.UpdatedBy = userId;

            var VendorUpdateData = await _vendorRepository.UpdateVendor<APIResponse>(updateDto);
            
            if(VendorUpdateData == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!VendorUpdateData.IsSuccess)
                return ApiResponseService.BadRequestResponse(VendorUpdateData.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(VendorUpdateData.Result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> ActiveInActiveVendorContact(string vendorId, bool active)
        {
            if(!long.TryParse(vendorId, out long parsedVendorId))
                return ApiResponseService.BadRequestResponse("Invalid vendor Id.");

            var response = await _vendorRepository.UpdateActiveStatus<APIResponse>(parsedVendorId, active);
            
            if(response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: Contact List
        [Authorize]
        public IActionResult ContactList()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetPartialContactList([FromBody] VendorContactListRequestDto request)
        {
            request.UserID = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _vendorRepository.GetVendorContactList<APIResponse>(request);

            if (response == null || !response.IsSuccess || response.Result == null)
            {
                return Json(new
                {
                    draw = request.Draw,
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<object>()
                });
            }

            var result = JsonConvert.DeserializeObject<DataTableResponse<VendorContactDto>>(Convert.ToString(response.Result)!) ?? new();

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = result.RecordsTotal,
                recordsFiltered = result.RecordsFiltered,
                data = result.Data
            });
        }

        [Authorize]
        [PageAuthorization("16")]
        public async Task<IActionResult> EditVendorContact(string vendorId)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            var checkAccess = await _vendorRepository.CheckAuthority<APIResponse>(15, Convert.ToInt32(userId));
            var checkAccess1 = await _vendorRepository.CheckAuthority<APIResponse>(16, Convert.ToInt32(userId));

            if (checkAccess.Result?.ToString() == "0" && checkAccess1.Result?.ToString() == "0")
                return RedirectToAction("dashboard", "Home");


            //get vendor details 
            var response = await _vendorRepository.GetVendorDetailsByVendorId<APIResponse>(long.Parse(vendorId));
            var vendorDetails = response.UnwrapResultOrDefault<VendorDto>(); 
            // get all country
            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();
            //get state based on id
            var stateRespose = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(vendorDetails.Country);
            var result = await _vendorRepository.GetSecurityForVendor<APIResponse>(vendorDetails.Vendor_ID);

            if (vendorDetails.CreatedBy == null)
            {
                vendorDetails.CreatedBy = 4;
            }

            var systemUserResponse = await _vendorRepository.GetSystemuserDetailsByCreatedBy<APIResponse>((long)vendorDetails.CreatedBy);

            var mm = new MultipleModel();
            mm.VendorDto = vendorDetails;
            mm.CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>();
            mm.StateList = stateRespose.UnwrapResultOrDefault<List<StateDto>>();
            mm.venndorSystemPermissionList = result.UnwrapResultOrDefault<List<VenndorSystemPermissionDto>>();
            mm.systemUsersDTOs = systemUserResponse.UnwrapResultOrDefault<List<SystemUsersDTO>>();


            return View(mm);
        }
        [Authorize]
        public async Task<IActionResult> GetAllContactAddress(string vendorId)
        {
            MultipleModel mm = new();

            var contactAddressResponse = await _vendorRepository.GetContactAddressByVendorId<APIResponse>(Convert.ToInt64(vendorId));
            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();

            mm.ContactAddressesListDto = contactAddressResponse.UnwrapResultOrDefault<List<ContactAddressesDto>>(); ;
            mm.CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>(); ;

            return PartialView("~/Views/Vendors/_partialGetAllContactAddress.cshtml", mm);

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddNewContactAddress(ContactAddressCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            createDto.CreatedBy = userId;

            var responce = await _vendorRepository.AddNewVendorContactAddress<APIResponse>(createDto);

            if(responce == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if(!responce.IsSuccess)
                return ApiResponseService.BadRequestResponse(responce.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(responce.Result);

        }


        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateContactAddress(UpdateVendorContactAddress UpdateAddressDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            UpdateAddressDto.UpdatedBy = userId;

            var responce = await _vendorRepository.UpdateVendorContactAddress<APIResponse>(UpdateAddressDto);
            if(responce == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!responce.IsSuccess)
                return ApiResponseService.BadRequestResponse(responce.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(responce.Result);

        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteContactAddress(string addressId)
        {
            if(!long.TryParse(addressId, out long parsedAddressId))
                return ApiResponseService.BadRequestResponse("Invalid address Id.");

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var responce = await _vendorRepository.DeleteVendorContactAddress<APIResponse>(parsedAddressId, userId);
            
            if(responce == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if(!responce.IsSuccess)
                return ApiResponseService.BadRequestResponse(responce.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(responce.Result);
        }

        [Authorize]
        public string generateVcard(Vcard vc)
        {
            // Get the root path to the wwwroot folder
            string webRootPath = _webHostEnvironment.WebRootPath;

            // Get the full path to the Assets/SystemTermsFiles folder

            string cname = vc.FN + " " + vc.LN;
            //string path = Server.MapPath("~/Assets/VendorFiles/" + cname + "_contact.vcf"); //@"D:\AppServ\Example.vcf";
            string path = Path.Combine(webRootPath, "Assets/VendorFiles/" + cname + "_contact.vcf");
            if (!System.IO.File.Exists(path))
            {
                using (System.IO.File.Open(path, FileMode.OpenOrCreate))
                {
                }
            }
            string ext = "";
            if (vc.EXT == "" || vc.EXT == null)
            {
                ext = "";
            }
            else
            {
                ext = "(" + vc.EXT + ")";
            }
            string[] lines = {      "BEGIN:VCARD",
                            "FN:" + vc.FN + " " + vc.LN,
                            "TITLE:" + vc.TITLE,
                            "ORG:" + vc.ORG,
                            "ADR;WORK:;;" + vc.ADR + ";" + vc.CITY + ";" + vc.STATE + ";" + vc.POSTALCODE + ";" + vc.COUNTRY,
                            "TEL;Work;VOICE;:" + ext + vc.PHONE,
                            "TEL;Cell:" + vc.Cell,
                            "TEL;Work;FAX:" + vc.FAX,
                            "EMAIL;Internet:" + vc.EMAIL,
                            "END:VCARD"};
            System.IO.File.WriteAllLines(path, lines);
            return Convert.ToString(cname + "_contact.vcf");
        }

        [Authorize]
        public async Task<IActionResult> sendFinalMailCredentials(SendVendorContactCredentialsDto sendVendorContactCredentialsDto)
        {
            sendVendorContactCredentialsDto.CurrUrl = "string";
            var fullUrl = $"{Request.Scheme}://{Request.Host}";
            sendVendorContactCredentialsDto.CurrUrl = fullUrl;
            var sendEmail = await _vendorRepository.SendVendorContactDetails<APIResponse>(sendVendorContactCredentialsDto);
            
            if(sendEmail == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!sendEmail.IsSuccess)
                return ApiResponseService.BadRequestResponse(sendEmail.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(sendEmail.Result);

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateVendorContact(UpdateVendorContactDto updateVendorContactDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            updateVendorContactDto.UpdatedBy = userId;
            if (updateVendorContactDto.Fax == null)
            {
                updateVendorContactDto.Fax = "";
            }
            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            updateVendorContactDto.CurrentUrl = currentUrl;

            var UpdatevendorResponse = await _vendorRepository.UpdateVendorContact<APIResponse>(updateVendorContactDto);
            
            if(UpdatevendorResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if(!UpdatevendorResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(UpdatevendorResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(UpdatevendorResponse.Result);
        }
        [Authorize]
        public async Task<IActionResult> ActiveInActiveonClick(string vendorId, string mode)
        {
            if(!long.TryParse(vendorId, out long parsedVendorId))
                return ApiResponseService.BadRequestResponse("Invalid vendor Id.");

            var response = await _vendorRepository.ActiveInActiveOnClick<APIResponse>(parsedVendorId, mode);
            
            if(response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region:: Add New Vendor Contact

        [Authorize]
        public async Task<IActionResult> AddNewVendorContact(int ParentVendorid)
        {
            var currResponse = await _vendorRepository.GetAllCurrencyOnAddVendor<APIResponse>();
            var Countryresponse = await _systemAdminRepository.GetAllCountryOnStatesTabAsync<APIResponse>();
            var systempermissionResult = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(6);
            var ParentvendorDetails = await _vendorRepository.GetParentVendorById<APIResponse>(Convert.ToInt64(ParentVendorid));
            var parentVendorDto = ParentvendorDetails.UnwrapResultOrDefault<ParentVendorsDto>(); 

            var stateList = new List<StateDto>();

            if (parentVendorDto.Country != 0)
            {
                var StateResponce = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(parentVendorDto.Country);
                stateList = StateResponce.UnwrapResultOrDefault<List<StateDto>>();
            }

            var mmm = new MultipleModel();
            mmm.currencyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();
            mmm.CountryList = Countryresponse.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.StateList = stateList;
            mmm.systemPermissionLists = systempermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>(); ;
            mmm.parentVendorDto = parentVendorDto;

            return View(mmm);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertNewVendorContact(VendorCreateDto vendorCreateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            vendorCreateDto.CreatedBy = userId;


            var request = HttpContext.Request;
            vendorCreateDto.CurrentUrl = $"{request.Scheme}://{request.Host}";
            vendorCreateDto.Fax ??= "";


            if (vendorCreateDto.IsSystemUser != 0 && vendorCreateDto.IsSystemUser != 1)
                return ApiResponseService.BadRequestResponse("Invalid system user type.");

            // Validate email only for system users
            if (vendorCreateDto.IsSystemUser == 1)
            {
                var emailExistsResponse = await _vendorRepository.IsEmailExists<APIResponse>(vendorCreateDto.Email ?? "");

                if (emailExistsResponse is null)
                    return ApiResponseService.InternalServerResponse("Unable to validate email.");

                if (!emailExistsResponse.IsSuccess)
                    return ApiResponseService.BadRequestResponse(emailExistsResponse.ErrorMessages?.FirstOrDefault() ?? emailExistsResponse.Result?.ToString() ?? "Email validation failed.");
            }

            var vendorSaveResponse = await _vendorRepository.CreateNewVendorContactDeatils<APIResponse>(vendorCreateDto);

            if (vendorSaveResponse is null)
                return ApiResponseService.InternalServerResponse("Unable to save vendor contact.");

            if (!vendorSaveResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(vendorSaveResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(vendorSaveResponse.Result);
    
        }


        #endregion

        #region :: Merge Vendor
        [Authorize]
        public async Task<IActionResult> MergeVendors(string ParentVendorId)
        {

            var ParentVendorResponse = await _vendorRepository.GetParentVendorDetails<APIResponse>(long.Parse(ParentVendorId));
            var vendorMerge = ParentVendorResponse.UnwrapResultOrDefault<MergeVendorContactDto>();

            var currResponse = await _systemAdminRepository.GetCurrencyById<APIResponse>((long)vendorMerge.CurrCode!);
            var currencymerge = currResponse.UnwrapResultOrDefault<CurrencyDto>();

            var mm = new MultipleModel();
            mm.mergeVendorContactDto = vendorMerge;
            mm.currencyDto = currencymerge;

            return View(mm);
        }
        [Authorize]
        public async Task<IActionResult> VendorListforMerge(string currCode, string ParentVendorId, string isChecked)
        {
            MultipleModel mm = new();
            var vendorListResponse = await _vendorRepository.GetVendorListForMerge<APIResponse>(long.Parse(currCode), ParentVendorId, isChecked);
            mm.mergeVendorContactDtosList = vendorListResponse.UnwrapResultOrDefault<List<MergeVendorContactDto>>();
            return PartialView("~/Views/Vendors/_partialVendorListForMerge.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> VendorListbind(string currCode, string ParentVendorId, string isChecked)
        {
            if(!long.TryParse(currCode, out long parsedCurrCode))
                return ApiResponseService.BadRequestResponse("Invalid currency code.");

            var vendorListResponse = await _vendorRepository.GetVendorListForMerge<APIResponse>(parsedCurrCode, ParentVendorId, isChecked);
            
            if(vendorListResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to retrieve vendor list.");
            if(!vendorListResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(vendorListResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(vendorListResponse.Result);
        }
        [Authorize]
        public async Task<IActionResult> VendorMerge(string vendorId, string MergeId, long UpdateBy)
        {           
            if(!long.TryParse(vendorId, out long parsedVendorId))
                return ApiResponseService.BadRequestResponse("Invalid vendor Id.");

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            UpdateBy = userId;
            var result = await _vendorRepository.MergeVendor<APIResponse>(parsedVendorId, MergeId, UpdateBy);
            
            if(result == null)
                return ApiResponseService.InternalServerResponse("Unable to process the merge operation.");
            if(!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }
        #endregion


    }
}
