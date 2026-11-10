using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Model.Dto.SystemUserType;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    //[ServiceFilter(typeof(GlobalExceptionRedirection))]
    public class UserController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ISystemAdminRepository _systemAdminRepository;
        public UserController(IWebHostEnvironment webHostEnvironment, ISystemAdminRepository systemAdminRepository)
        {
            _webHostEnvironment = webHostEnvironment;
            _systemAdminRepository = systemAdminRepository;
        }


        #region::Add Client and Consultant

        [Authorize]
        public async Task<IActionResult> ClientandInteriorDesigner()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            var response = await _systemAdminRepository.GetAllClientUserTypeAsync<APIResponse>();
            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();
            var systemPermissionResult = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(0);

            MultipleModel model = new MultipleModel();
            model.ProjectusertypeList = response.UnwrapResultOrDefault<List<ProjectusertypeDto>>(); ;
            model.CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>(); ;
            model.systemPermissionLists = systemPermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>(); ;

            return View(model);
        }

        [Authorize]
        public async Task<IActionResult> getStateByCountryId(string countryId)
        {
            if (countryId == null)
            {
                countryId = "0";
            }
            var stateResponse = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(long.Parse(countryId));

            return ApiResponseService.SuccessResponse(stateResponse.Result);
        }

        [Authorize]
        [HttpGet]
        public async Task<string> createClientId(SystemusersCreateDto model)
        {
            APIResponse response = await _systemAdminRepository.SystemUserCreate<APIResponse>(model);
            string data = JsonConvert.SerializeObject(response);
            return data;

        }

        [Authorize]
        public async Task<IActionResult> GetAllSystemPermissionOptionAddClient_Consultant(string userTypeId)
        {
            MultipleModel multimodel = new MultipleModel();

            var result = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(Convert.ToInt32(userTypeId));

            multimodel.systemPermissionLists = result.UnwrapResultOrDefault<List<SystemPermissionList>>();

            return PartialView("~/Views/User/_partialSystempermission.cshtml", multimodel);
        }

        #endregion

        #region::Add User

        [Authorize]
        public async Task<IActionResult> AddUser()
        {

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            MultipleModel model = new MultipleModel();
            var userTypeResult = await _systemAdminRepository.GetAllUserTypeAsync<APIResponse>("USERTYPE");
            var defaultByerResult = await _systemAdminRepository.GetAllDEFAULTBUYERAsync<APIResponse>("DEFAULTBUYER");
            var systempermissionResult = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(0);

            model.systemUserTypesDTOs = userTypeResult.UnwrapResultOrDefault<List<SystemUserTypeDto>>();
            model.systemUsersDTOs = defaultByerResult.UnwrapResultOrDefault<List<SystemUsersDTO>>();
            model.systemPermissionLists = systempermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>();

            return View(model);
        }

        [Authorize]
        public async Task<IActionResult> IsBuyerDropdownBind(string isbuyer)
        {
            MultipleModel mmm = new MultipleModel();

            List<SystemUsersDTO> systemUsersDTOs = new();
            if (isbuyer.ToLower().Trim() == "1")
            {
                var defaultByerResult = await _systemAdminRepository.GetAllDEFAULTBUYERAsync<APIResponse>("DEFAULTBUYERFORME");
                systemUsersDTOs = defaultByerResult.UnwrapResultOrDefault<List<SystemUsersDTO>>();
            }
            else
            {
                var defaultByerResult = await _systemAdminRepository.GetAllDEFAULTBUYERAsync<APIResponse>("DEFAULTBUYER");
                systemUsersDTOs = defaultByerResult.UnwrapResultOrDefault<List<SystemUsersDTO>>();
            }

            mmm.systemUsersDTOs = systemUsersDTOs;
            return PartialView("~/Views/User/_partialDefaultBuyerDropdown.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllSystemPermissionOption(string isbuyer)
        {
            MultipleModel mmm = new MultipleModel();
            var systempermissionResult = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(Convert.ToInt32(isbuyer));
            var systemPermissionLists = systempermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>();

            mmm.systemPermissionLists = systemPermissionLists;

            return PartialView("~/Views/User/_partialSystemAccessOption.cshtml", mmm);

        }

        [Authorize]
        public async Task<IActionResult> GetAllSystemPermissionByUserType(string usertype)
        {
            MultipleModel mmm = new MultipleModel();
            var systempermissionResult = await _systemAdminRepository.GetAllSystemPermissionAsync<APIResponse>(Convert.ToInt32(usertype));
            var systemPermissionLists = systempermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>();

            mmm.systemPermissionLists = systemPermissionLists;
            return PartialView("~/Views/User/_partialSystemAccessOption.cshtml", mmm);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveUser(AddUserCreateDto addUserCreateDto)
        {
            addUserCreateDto.Middlename = " ";
            addUserCreateDto.Token = "0";
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            addUserCreateDto.CreatedBy = userId;

            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            addUserCreateDto.CurrentUrl = currentUrl;
            var response = await _systemAdminRepository.AddUserCreate<APIResponse>(addUserCreateDto);

            //var data = JsonConvert.SerializeObject(response);

            return ApiResponseService.SuccessResponse(response.Result);

        }

        [Authorize]
        public async Task<IActionResult> checkEmail(string email)
        {
            var response = await _systemAdminRepository.checkEmailId<APIResponse>(email);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: All Users

        [Authorize]
        public IActionResult UserList()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UserListTableBind([FromBody] UserListTableBindDTO userListTableBindDTO)
        {
            var userListResponse = await _systemAdminRepository.GetAllUsersAsync<APIResponse>(userListTableBindDTO);
            if (userListResponse == null || !userListResponse.IsSuccess || userListResponse.Result == null)
            {
                return Json(new
                {
                    draw = userListTableBindDTO.Draw,
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<object>()
                });
            }
            var result = userListResponse.UnwrapResultOrDefault<DataTableResponse<SystemUsersDTO>>();

            return Json(new
            {
                draw = userListTableBindDTO.Draw,
                recordsTotal = result.RecordsTotal,
                recordsFiltered = result.RecordsFiltered,
                data = result.Data
            });
        }

        [Authorize]
        public async Task<IActionResult> BindEditPopUp(string userId)
        {
            if (userId == null)
            {
                userId = "0";
            }

            List<StateDto> stateList = new();
            MultipleModel mmm = new MultipleModel();

            var dataResponse = await _systemAdminRepository.GetAlluserDetailsById<APIResponse>(Convert.ToInt32(userId));
            var systemuserData = dataResponse.UnwrapResultOrDefault<SystemUsersDTO>();


            var countryId = systemuserData.Country;
            var userTypeId = systemuserData.Usertype;

            if (countryId != null && countryId != "" && countryId.Trim().Length != 0 && countryId != "undefined")
            {
                var stateResponse = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(long.Parse(countryId));

                stateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>();
            }
            else
            {
                if (string.IsNullOrEmpty(countryId) || countryId == "undefined")
                {
                    countryId = "0";
                }
                var stateResponse = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(long.Parse(countryId));
                stateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>();
            }

            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();
            var response = await _systemAdminRepository.GetUserTypeById<APIResponse>(userTypeId);
            var systemPermissionResult = await _systemAdminRepository.GetSystemPermissionByUserId<APIResponse>(long.Parse(userId));
            var systemUserTypeResponse = await _systemAdminRepository.GetAllSystemUserTypeList<APIResponse>();

            mmm.SystemUserTypeList = systemUserTypeResponse.UnwrapResultOrDefault<List<SystemUserTypeListDTO>>();
            mmm.systemUserviewDto = systemuserData;
            mmm.systemPermissionLists = systemPermissionResult.UnwrapResultOrDefault<List<SystemPermissionList>>();
            mmm.StateList = stateList;
            mmm.CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.ProjectusertypeList = response.UnwrapResultOrDefault<List<ProjectusertypeDto>>();

            return PartialView("~/Views/User/_partialEditPopUp.cshtml", mmm);

        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateUser(SystemUsersUpdateDto systemUsersUpdateDto)
        {
            systemUsersUpdateDto.Middlename = " ";
            systemUsersUpdateDto.Token = "0";
            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            systemUsersUpdateDto.CurrentUrl = currentUrl;
            var userResponse = await _systemAdminRepository.UpdateAllUser<APIResponse>(systemUsersUpdateDto);

            return ApiResponseService.SuccessResponse(userResponse.Result);
        }

        //[Authorize]
        //public async Task<IActionResult> GetPartialUserList(string isActivefilter)
        //{
        //    MultipleModel mmm = new MultipleModel();
        //    var response = new APIResponse();

        //    if (isActivefilter == null)
        //    {
        //        response = await _unitOfWork.SystemadminRepo.GetAllUsersAsync<APIResponse>();
        //    }
        //    else
        //    {
        //        response = await _unitOfWork.SystemadminRepo.GetAllUsersByFilterAsync<APIResponse>(isActivefilter);
        //    }

        //    var systemUsersDTOs = response.IsSuccess == true && response.Result != null
        //        ? JsonConvert.DeserializeObject<List<SystemUsersDTO>>(Convert.ToString(response.Result)!) ?? new()
        //        : new List<SystemUsersDTO>();

        //    mmm.systemUsersDTOs = systemUsersDTOs;
        //    return PartialView("~/Views/User/_partialUserList.cshtml", mmm);
        //}

        [Authorize]
        public async Task<IActionResult> ToggleActiveDeactive(string FldID)
        {
            var response = await _systemAdminRepository.ToggleActiveUser<APIResponse>(long.Parse(FldID));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> DefaultBuyerBYUID(string FldId)
        {
            var response = await _systemAdminRepository.DefaultBuyerBYUID<APIResponse>(long.Parse(FldId));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: System Level permission

        [Authorize]
        public IActionResult SystemLevelPermission()
        {
            return View();
        }

        [Authorize]
        public async Task<IActionResult> GetAllSystemLevelPermissionBind()
        {
            MultipleModel mmm = new MultipleModel();

            var systemLevelpermissionResult = await _systemAdminRepository.GetAllSystemLevelPermission<APIResponse>();

            mmm.SystemLevelPermissions = systemLevelpermissionResult.UnwrapResultOrDefault<List<SystemLevelPermission>>();
            return PartialView("~/Views/User/_partialSystemLevelPermission.cshtml", mmm);

        }

        [Authorize]
        public async Task<IActionResult> saveSystemLevelPermission(string flid, string isselected)
        {
            var response = await _systemAdminRepository.SaveSystemLevelPermission<APIResponse>(Convert.ToInt32(flid), Convert.ToInt32(isselected));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: System Admin Activity

        [Authorize]
        public async Task<IActionResult> SystemAdminActivity()
        {
            MultipleModel mmm = new();

            var currResponse = await _systemAdminRepository.GetAllCurrencyOnSystemAdminAsync<APIResponse>();
            var response = await _systemAdminRepository.GetAllCountryOnStatesTabAsync<APIResponse>();

            mmm.CountryList = response.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.currencyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();

            return View(mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllInvoiceTerms()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();

            mmm.vendorTermsList = response.UnwrapResultOrDefault<List<VendorTermsDto>>();

            return PartialView("~/Views/User/_partialGetAllInvoiceTerms.cshtml", mmm);
        }


        [Authorize]
        public async Task<IActionResult> GetAllClassifications()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllClassificationsAsync<APIResponse>();

            mmm.classificationsList = response.UnwrapResultOrDefault<List<ClassificationsDto>>();
            return PartialView("~/Views/User/_partialGetAllClassifications.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllInvoiceAddress()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllInvoiceAddressAsync<APIResponse>();

            mmm.invoiceAddressesList = response.UnwrapResultOrDefault<List<InvoiceAddressesDto>>();
            return PartialView("~/Views/User/_partialGetAllInvoiceAddress.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllProjectContactTypes()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllProjectContactTypesAsync<APIResponse>();

            mmm.contactTypesList = response.UnwrapResultOrDefault<List<ContactTypesDto>>();
            return PartialView("~/Views/User/_partialGetAllProjectContactType.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllPaymentSchedules()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllPaymentSchedulesAsync<APIResponse>();

            mmm.termsList = response.UnwrapResultOrDefault<List<TermsDto>>();
            return PartialView("~/Views/User/_partialGetAllPaymentSchedules.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllShipmentMethod()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllShipmentMethodAsync<APIResponse>();

            mmm.shipmentsList = response.UnwrapResultOrDefault<List<ShipmentDto>>();
            return PartialView("~/Views/User/_partialGetAllShipmentMethod.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllFabApprovalTypes()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllFabApprovalTypesAsync<APIResponse>();

            mmm.itemApprovalsList = response.UnwrapResultOrDefault<List<ItemApprovalsDto>>();
            return PartialView("~/Views/User/_partialGetAllFabApprovalTypes.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllStatesByCountryId(string CountryId)
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(Convert.ToInt64(CountryId));

            mmm.StateList = response.UnwrapResultOrDefault<List<StateDto>>();
            return PartialView("~/Views/User/_partialGetAllStates.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllCountryOnSystemAdminActivity()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllCountryOnSystemAdminActivityAsync<APIResponse>();

            mmm.CountryList = response.UnwrapResultOrDefault<List<CountryDto>>();
            return PartialView("~/Views/User/_partialGetAllCountries.cshtml", mmm);

        }
        [Authorize]
        public async Task<IActionResult> GetAllCurrencyOnSystemAdmin()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllCurrencyOnSystemAdminAsync<APIResponse>();

            mmm.currencyList = response.UnwrapResultOrDefault<List<CurrencyDto>>();
            return PartialView("~/Views/User/_partialGetAllCurrencies.cshtml", mmm);
        }
        [Authorize]
        public async Task<IActionResult> GetAllUOM()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllUOMAsync<APIResponse>();

            mmm.uomList = response.UnwrapResultOrDefault<List<UOMDto>>();
            return PartialView("~/Views/User/_partialGetAllUom.cshtml", mmm);

        }

        [Authorize]
        public async Task<IActionResult> GetAllBankAccount()
        {
            MultipleModel mmm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllBankAccountAsync<APIResponse>();

            mmm.bankAccountList = response.UnwrapResultOrDefault<List<BankAccountDto>>();
            return PartialView("~/Views/User/_partialGetAllBankAccount.cshtml", mmm);
        }



        [Authorize]
        public async Task<IActionResult> GetAllVendorTermsById(string InvoiceTermId)
        {
            MultipleModel mmm = new MultipleModel();
            var vendorTerms = await _systemAdminRepository.GetAllVendorTermsById<APIResponse>(long.Parse(InvoiceTermId));
            return ApiResponseService.SuccessResponse(vendorTerms.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetAllClassificationById(string ClassificationID)
        {

            var classificationById = await _systemAdminRepository.GetClassificationsById<APIResponse>(long.Parse(ClassificationID));
            return ApiResponseService.SuccessResponse(classificationById.Result);

        }

        [Authorize]
        public async Task<IActionResult> GetAllProjectUserTypeById(string ContactTypeID)
        {

            var projectType = await _systemAdminRepository.GetProjectTypeById<APIResponse>(long.Parse(ContactTypeID));
            return ApiResponseService.SuccessResponse(projectType.Result);

        }

        [Authorize]
        public async Task<IActionResult> UpdateVendorTerms(VendorTermsUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var VendorUdpateData = await _systemAdminRepository.UpdateInvoiceTerms<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(VendorUdpateData.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateClassification(ClassificationUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var classificationResult = await _systemAdminRepository.UpdateClassification<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(classificationResult.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateClassificiation(ClassificationCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            createDto.CreatedBy = userId;
            var response = await _systemAdminRepository.CreateClassification<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateVendorTerms(VendorTermsCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var response = await _systemAdminRepository.CreateVendorTerms<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }


        [Authorize]
        public async Task<IActionResult> UpdateContactType(ProjectContactUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var response = await _systemAdminRepository.UpdateProjectContactType<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateProjectContactType(ProjectContactTypeCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var response = await _systemAdminRepository.CreateProjectContactType<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetAllPaymentSchedulesById(string TermID)
        {
            var result = await _systemAdminRepository.GetPaymentscheduleById<APIResponse>(long.Parse(TermID));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetALlShipmentMethodById(string ShipID)
        {

            var response = await _systemAdminRepository.GetGetShipmentMethodId<APIResponse>(long.Parse(ShipID));
            return ApiResponseService.SuccessResponse(response.Result);
        }


        [Authorize]
        public async Task<IActionResult> GetFabApprovalTypesId(string ItemApprovalID)
        {

            var result = await _systemAdminRepository.GetFabApprovalTypesId<APIResponse>(long.Parse(ItemApprovalID));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdatePaymentSchedule(TermsUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var response = await _systemAdminRepository.UpdatePaymentSchedules<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateShipmentMethod(ShipmentUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var response = await _systemAdminRepository.UpdateShipmentMethod<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }


        [Authorize]
        public async Task<IActionResult> CreateShipmentMethod(ShipmentCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var result = await _systemAdminRepository.CreateShipmentMethod<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateFabApprovalTypes(ItemApprovalsUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }


            var result = await _systemAdminRepository.UpdateFabApprovalTypes<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateFabApprovalTypes(ItemApprovalsCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }


            var result = await _systemAdminRepository.CreateFabApprovalTypes<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }


        [Authorize]
        public async Task<IActionResult> CreatePaymentSchedule(TermsCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }


            var response = await _systemAdminRepository.CreatePaymentSchedules<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetEditModalCountryById(string CountryID)
        {

            var response = await _systemAdminRepository.GetCountryById<APIResponse>(long.Parse(CountryID));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateCountry(CountryUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var response = await _systemAdminRepository.UpdateCountry<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateCountry(CountryCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var result = await _systemAdminRepository.CreateCountry<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetEditModalStateProveById(string StateID)
        {
            var response = await _systemAdminRepository.GetStateProvById<APIResponse>(long.Parse(StateID));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateProvState(StateUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var result = await _systemAdminRepository.UpdateStateProv<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateProvState(StateCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var response = await _systemAdminRepository.CreateStateProv<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);

        }

        [Authorize]
        public async Task<IActionResult> GetCurrencyEditPopupById(string CurrencyID)
        {
            var result = await _systemAdminRepository.GetCurrencyById<APIResponse>(long.Parse(CurrencyID));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateCurrency(CurrencyUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var result = await _systemAdminRepository.UpdateCurrency<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateCurrency(CurrencyCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;
            }

            var result = await _systemAdminRepository.CreateCurrency<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetUOMById(string UOMID)
        {
            var response = await _systemAdminRepository.GetUomById<APIResponse>(long.Parse(UOMID));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateModalUOM(UOMUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }

            var response = await _systemAdminRepository.UpdateUOM<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetBankAccountById(string AccountID)
        {
            var response = await _systemAdminRepository.GetBankaccountById<APIResponse>(long.Parse(AccountID));
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> EditBankAccountModal(string AccountID)
        {
            MultipleModel mmm = new MultipleModel();

            var currResponse = await _systemAdminRepository.GetAllCurrencyOnSystemAdminAsync<APIResponse>();
            var bankAcc = await _systemAdminRepository.GetBankaccountById<APIResponse>(long.Parse(AccountID));

            mmm.currencyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();
            mmm.BankAccountDto = bankAcc.UnwrapResultOrDefault<BankAccountDto>();

            return PartialView("~/Views/User/_partialEditBankAccountModal.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> UpdateBankAccount(BankAccountUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;

            }
            var response = await _systemAdminRepository.UpdateBankAccount<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateBankAccount(BankAccountCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (createDto.CreatedBy == null)
            {
                createDto.CreatedBy = userId;

            }
            var createBankAccount = await _systemAdminRepository.CreateBankAccount<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(createBankAccount.Result);
        }

        [Authorize]
        public async Task<IActionResult> CreateUOM(UOMCreateDto createDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (createDto.CreatedBy_ID == null)
            {
                createDto.CreatedBy_ID = userId;

            }

            var response = await _systemAdminRepository.CreateUOM<APIResponse>(createDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> getMailContent(string mode)
        {
            var result = await _systemAdminRepository.getMailContent<APIResponse>(mode);

            if (result is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> getFileSize()
        {
            var result = await _systemAdminRepository.getFileSize<APIResponse>();
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateFileSize(string FileSize)
        {
            var result = await _systemAdminRepository.updateFileSize<APIResponse>(Convert.ToInt32(FileSize));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveMailTemplate(SaveMailTemplateDto updateDto)
        {
            var result = await _systemAdminRepository.SaveMailTemplate<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public string CheckTermsFileExists()
        {
            string FilePath = string.Empty;

            var result = new APIResponse();

            // Get the root path to the wwwroot folder
            string webRootPath = _webHostEnvironment.WebRootPath;

            // Get the full path to the Assets/SystemTermsFiles folder
            string folderPath = Path.Combine(webRootPath, "Assets/SystemTermsFiles");

            //result = await Task.Run(() =>
            //{

            //});
            if (Directory.Exists(folderPath))
            {
                // Get all the files in the directory
                string[] files = Directory.GetFiles(folderPath);

                if (files.Length > 0)
                {
                    // Assuming you want to get some information from the first file
                    FilePath = Path.GetFileName(files[0]);
                    result.StatusCode = System.Net.HttpStatusCode.OK;
                    result.IsSuccess = true;
                    result.Result = FilePath;
                }
                else
                {
                    FilePath = "No files found.";
                    result.StatusCode = System.Net.HttpStatusCode.NotFound;
                    result.IsSuccess = false;
                    result.ErrorMessages.Add(FilePath);
                }
            }
            else
            {
                FilePath = "Directory does not exist.";
                result.StatusCode = System.Net.HttpStatusCode.NotFound;
                result.IsSuccess = false;
                result.ErrorMessages.Add(FilePath);
            }

            var data = JsonConvert.SerializeObject(result);

            return data;

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UploadSystemTerms()
        {
            string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets/SystemTermsFiles");

            if (!Directory.Exists(folderPath))
            {
                return ApiResponseService.NotFoundResponse("Directory does not exist!!");
            }

            var uploadResult = await ProcessUploadedFiles(folderPath);

            if (!uploadResult.IsSuccess)
            {
                return uploadResult.StatusCode switch
                {
                    HttpStatusCode.BadRequest =>
                        ApiResponseService.BadRequestResponse(uploadResult.ErrorMessages.FirstOrDefault() ?? "Bad Request"),

                    HttpStatusCode.NotFound =>
                        ApiResponseService.NotFoundResponse(uploadResult.ErrorMessages.FirstOrDefault() ?? "Not Found"),

                    _ =>
                        ApiResponseService.InternalServerResponse(uploadResult.ErrorMessages.FirstOrDefault() ?? "Server Error")
                };
            }

            string fileName = uploadResult.Result?.ToString() ?? string.Empty;

            var result = await _systemAdminRepository.UpdateTersmAndConditionFileName<APIResponse>(fileName);

            if (!result.IsSuccess)
            {
                return ApiResponseService.BadRequestResponse("Failed to update database.");
            }

            string filePath = Path.Combine(folderPath, fileName);

            return ApiResponseService.SuccessResponse(filePath);


        }

        private async Task<APIResponse> ProcessUploadedFiles(string folderPath)
        {
            try
            {
                if (Request.Form.Files == null || Request.Form.Files.Count == 0)
                {
                    return ApiResponseService.BadRequest("Please select a PDF file.");
                }

                // Delete existing files
                foreach (string file in Directory.GetFiles(folderPath))
                {
                    System.IO.File.Delete(file);
                }

                string fileName = string.Empty;

                foreach (var uploadedFile in Request.Form.Files)
                {
                    string ext = Path.GetExtension(uploadedFile.FileName);

                    if (!string.Equals(ext, ".pdf", StringComparison.OrdinalIgnoreCase))
                    {
                        return ApiResponseService.BadRequest("Only PDF files are allowed.");
                    }

                    fileName = "SystemTermsFile^TermsandConditions_0.pdf";

                    string filePath = Path.Combine(folderPath, fileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await uploadedFile.CopyToAsync(stream);
                }

                return ApiResponseService.Success(fileName);
            }
            catch (Exception ex)
            {
                return ApiResponseService.BadRequest($"File upload failed. {ex.Message}");
            }
        }

        [Authorize]
        public async Task<IActionResult> EditModalInvoiceAddress(string InvoiceAddressID)
        {
            MultipleModel mmm = new MultipleModel();
            List<StateDto> StateList = new();

            var cList = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();
            var CountryList = cList.UnwrapResultOrDefault<List<CountryDto>>();


            var invAdd = await _systemAdminRepository.GetInvoiceAddressById<APIResponse>(long.Parse(InvoiceAddressID));
            var InvoiceAddressesList = invAdd.UnwrapResultOrDefault<List<InvoiceAddressesDto>>();


            foreach (var items in InvoiceAddressesList)
            {
                var SList = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(items.CountryID);
                StateList = SList.UnwrapResultOrDefault<List<StateDto>>();
            }


            mmm.StateList = StateList;
            mmm.CountryList = cList.UnwrapResultOrDefault<List<CountryDto>>();
            mmm.InvoiceAddresses = InvoiceAddressesList;

            return PartialView("~/Views/User/_partialEditModalInvoiceAddress.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> UpdateInvoiceAddress(InvoiceAddressUpdateDto updateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (updateDto.UpdatedBy == null)
            {
                updateDto.UpdatedBy = userId;
            }
            var response = await _systemAdminRepository.UpdateInvoiceAddress<APIResponse>(updateDto);
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: BridgeSupporter

        [Authorize]
        public async Task<IActionResult> BridgeSupporter()
        {
            MultipleModel mmm = new MultipleModel();
            var allProjectResponse = await _systemAdminRepository.GetAllProject<APIResponse>();
            var allProjectDropdownDtos = allProjectResponse.UnwrapResultOrDefault<List<AllProjectDropdownDto>>();



            var allvendorResponse = await _systemAdminRepository.GetAllVendor<APIResponse>();
            var allVendorDropdownDtos = allvendorResponse.UnwrapResultOrDefault<List<AllVendorDropdownDto>>();

            mmm.allProjectDropdownDtos = allProjectDropdownDtos;
            mmm.allVendorDropdownDtos = allVendorDropdownDtos;

            return View(mmm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllInvoiceDetails(string projectid, string vendorid, string formdate, string todate)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            MultipleModel mmm = new MultipleModel();

            var allInvoiceDetails = await _systemAdminRepository.GetAllInvoiceDetails<APIResponse>(projectid, vendorid, formdate, todate, Convert.ToInt32(userId));
            var invoiceDetailsDtos = allInvoiceDetails.UnwrapResultOrDefault<List<InvoiceDetailsDto>>();

            mmm.invoiceDetailsList = invoiceDetailsDtos;
            return PartialView("~/Views/User/_partialInvoiceTableDataBind.cshtml", mmm);

        }

        [Authorize]
        public async Task<IActionResult> GetInvoiceHistoryDetails(string flid)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            MultipleModel mmm = new MultipleModel();

            var allInvoicehistory = await _systemAdminRepository.GetInvoiceHistory<APIResponse>(flid);
            var invoiceHistoryDtos = allInvoicehistory.UnwrapResultOrDefault<List<InvoiceHistoryDto>>();

            mmm.invoiceHistoryDtos = invoiceHistoryDtos;
            return PartialView("~/Views/User/_partialInvoiceHistory.cshtml", mmm);
        }

        [Authorize]
        public async Task<IActionResult> EventCanSend(string flid, string status)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            string data = string.Empty;
            var result = await _systemAdminRepository.EventCanSend<APIResponse>(Convert.ToInt32(flid), Convert.ToInt32(status), Convert.ToInt32(userId));

            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> EventIsSent(string flid, string status)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            string data = string.Empty;
            var result = await _systemAdminRepository.EventIsSent<APIResponse>(Convert.ToInt32(flid), Convert.ToInt32(status), Convert.ToInt32(userId));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> EventIsPaid(string flid, string status)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            string data = string.Empty;
            var result = await _systemAdminRepository.EventIsPaid<APIResponse>(Convert.ToInt32(flid), Convert.ToInt32(status), Convert.ToInt32(userId));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        [Authorize]
        public async Task<IActionResult> UpdateRefNo(string flid, string refid)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var result = await _systemAdminRepository.UpdateRefNo<APIResponse>(Convert.ToInt32(flid), Convert.ToInt32(refid), Convert.ToInt32(userId));
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Bridge Support Report
        [Authorize]
        public async Task<IActionResult> BridgeSupporterReport()
        {
            MultipleModel mmm = new MultipleModel();

            var allProjectResponse = await _systemAdminRepository.GetAllProject<APIResponse>();
            var allProjectDropdownDtos = allProjectResponse.UnwrapResultOrDefault<List<AllProjectDropdownDto>>();

            mmm.allProjectDropdownDtos = allProjectDropdownDtos;

            return View(mmm);
        }

        public async Task<IActionResult> GetBridgeSupporterVendor(string ProjectIds)
        {
            var UserID = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _systemAdminRepository.AllBridgeSupporterVendors<APIResponse>(ProjectIds, UserID, "GetVendorByProjectIdForBrdgSuprt");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion
    }
}
