using BridgeWeb.Application.Common.Interfaces.Invoice;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Budget;
using BridgeWeb.Domain.Model.Dto.Invoice;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    [Authorize]
    public class InvoiceController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IInvoiceService _invoiceService;
        private readonly ISystemAdminRepository _systemAdminRepository;
        public InvoiceController(IWebHostEnvironment webHostEnvironment, IInvoiceService invoiceService, ISystemAdminRepository systemAdminRepository)
        {
            _webHostEnvironment = webHostEnvironment;
            _invoiceService = invoiceService;
            _systemAdminRepository = systemAdminRepository;
        }

        #region ::Enter Invoice
        public async Task<IActionResult> InvoiceEntry()
        {
            var mm = new MultipleModel();

            var (t1, t2) = (
                _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>(),
                _invoiceService.GetAllparentVendorListInEnterInvoice<APIResponse>()
            );
            await Task.WhenAll(t1, t2);

            var response = t1.Result;
            var vendorListResponse = t2.Result;

            //var response = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();
            var vendorTerms = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<VendorTermsDto>>(Convert.ToString(response.Result)!) ?? new()
                : new List<VendorTermsDto>();

            //var vendorListResponse = await _invoiceService.GetAllparentVendorListInEnterInvoice<APIResponse>();
            var parentVendorList = vendorListResponse.IsSuccess == true && vendorListResponse.Result != null
                ? JsonConvert.DeserializeObject<List<ParentVendorListForInvoiceDTO>>(Convert.ToString(vendorListResponse.Result)!) ?? new()
                : new List<ParentVendorListForInvoiceDTO>();


            mm.vendorTermsList = vendorTerms;
            mm.ParentVendorListEnterInvoice = parentVendorList;

            return View(mm);
        }
        public async Task<IActionResult> ProjectDDBasedonVendor(string VendorId)
        {
            MultipleModel mm = new();
            var projectList = new List<ProjectListEnterInvoiceDTO>();
            var response = await _invoiceService.GetAllProjectList<APIResponse>(VendorId);

            projectList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<ProjectListEnterInvoiceDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ProjectListEnterInvoiceDTO>();

            mm.ProjectListEnterInvoice = projectList;

            return PartialView("~/Views/Invoice/_partialProjectDropDown.cshtml", mm);
        }
        public async Task<string> Vendorterms(string VendorId)
        {
            var response = await _invoiceService.GetVendorTerms<APIResponse>(VendorId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> ProjectAccount(string ProjectId)
        {
            var response = await _invoiceService.GetProjectAccountBasedOnProject<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> POSelector(string VendorId, string ProjectId)
        {
            MultipleModel mm = new();
            var POSelectorList = new List<POSelectorListDTO>();
            var response = await _invoiceService.GetPOSelector<APIResponse>(VendorId, ProjectId);

            POSelectorList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<POSelectorListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POSelectorListDTO>();

            mm.POSelectorList = POSelectorList;

            return PartialView("~/Views/Invoice/_partialPOSelectorTable.cshtml", mm);

        }

        [HttpPost]
        public IActionResult ConversionrateForProject([FromBody] List<ConversionRateDTOInvoice> conversionRateDTOInvoices)
        {
            var result = (from CR in conversionRateDTOInvoices
                          group CR by new { CR.ConversionRate, CR.Remaining } into g
                          select new
                          {
                              totalAfterConvert = g.Sum(x => x.Remaining * x.ConversionRate),
                              totalBeforeConvert = g.Sum(x => x.Remaining)
                          }).FirstOrDefault();

            if (result is null)
                return ApiResponseService.NotFoundResponse("Data is null");

            return ApiResponseService.SuccessResponse(result);

        }
        public async Task<string> GetVendorAddress(string VendorID)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
            var response = await _invoiceService.GetVendorAddressEnterInvoice<APIResponse>(VendorID, userId);

            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> POLineItemSelectorBasedonPO(string poids)
        {
            MultipleModel mm = new();
            var poliselectorList = new List<POLineItemSelectorBasedOnPODTO>();

            var response = await _invoiceService.GetPOLineItemSelectorBasedOnPO<APIResponse>(poids);

            poliselectorList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<POLineItemSelectorBasedOnPODTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POLineItemSelectorBasedOnPODTO>();

            mm.POLineItemSelectorList = poliselectorList;

            return PartialView("~/Views/Invoice/_partialPOLISelectortable.cshtml", mm);
        }
        public async Task<IActionResult> GetInvoiceDataAfterSelecting(string poids, string percent)
        {
            MultipleModel mm = new();
            var invoiceDataForSelectedPOLIlist = new List<InvoiceDataForSelectedPOLIDTO>();

            var response = await _invoiceService.GetInvoiceDataforSelectedPOLI<APIResponse>(poids);

            invoiceDataForSelectedPOLIlist = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<InvoiceDataForSelectedPOLIDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<InvoiceDataForSelectedPOLIDTO>();

            mm.InvoiceDataForSelectedPOLI = invoiceDataForSelectedPOLIlist;
            ViewBag.Percent = percent;

            return PartialView("~/Views/Invoice/_partialInvoiceItemTableBasedonSelectedPOLI.cshtml", mm);
        }
        public async Task<string> TermsManagement(TermsManagementDTO termsManagementDTO)
        {
            var response = await _invoiceService.AddNewTerms<APIResponse>(termsManagementDTO);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> PreviousInvoices(string POLIId)
        {
            MultipleModel mm = new MultipleModel();

            var response = await _invoiceService.GetPreviousInvoice<APIResponse>(POLIId);
            var previousInvoiceList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<PreviousInvoiceDTO>>(Convert.ToString(response.Result)!)
                : new List<PreviousInvoiceDTO>();

            mm.PreviousInvoiceList = previousInvoiceList ?? new();

            return PartialView("~/Views/Invoice/_partialPreviousInvoicetbl.cshtml", mm);
        }
        [ValidateAntiForgeryToken]
        public async Task<string> SaveInvoice(SaveInvoiceDTO saveInvoiceDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            saveInvoiceDTO.UserId = userId;
            saveInvoiceDTO.IsCCRefund = false;
            var reponse = await _invoiceService.SaveInvoice<APIResponse>(saveInvoiceDTO);
            return JsonConvert.SerializeObject(reponse);
        }
        [HttpPost]
        public async Task<string> SaveInvoiceItems([FromBody] List<InvoiceItemsCreateInvoiceEntryDTO> invoiceItemsCreateInvoiceEntryDTOs)
        {
            if (invoiceItemsCreateInvoiceEntryDTOs == null || invoiceItemsCreateInvoiceEntryDTOs.Count == 0)
            {
                return JsonConvert.SerializeObject(
                    ApiResponseService.BadRequestResponse("Invoice items are required.")
                );
            }

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            invoiceItemsCreateInvoiceEntryDTOs[0].UserId = userId;
            var response = await _invoiceService.SaveBulkInvoiceItems<APIResponse>(invoiceItemsCreateInvoiceEntryDTOs);
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        public IActionResult ConversionrateForProject_Tax([FromBody] List<ConversionRateDTOInvoice> conversionRateDTOInvoices)
        {
            var result = (from CR in conversionRateDTOInvoices
                          group CR by new { CR.ConversionRate, CR.Remaining } into g
                          select new
                          {
                              totalAfterConvert = g.Sum(x => x.Remaining * x.ConversionRate),
                              totalBeforeConvert = g.Sum(x => x.Remaining)
                          }).FirstOrDefault();

            if (result is null)
                return ApiResponseService.NotFoundResponse("Data is null");

            return ApiResponseService.SuccessResponse(result);

        }

        #endregion

        #region :: Enter Invoice Without items
        public async Task<IActionResult> InvoiceEntry_Tax()
        {
            var mm = new MultipleModel();

            var (t1, t2) = (
                _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>(),
                _invoiceService.GetVendorListInvoiceTax<APIResponse>()
            );

            await Task.WhenAll(t1, t2);
            var response = t1.Result;
            var vendorListResponse = t2.Result;

            var vendorTerms = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<VendorTermsDto>>(Convert.ToString(response.Result)!) ?? new()
                : new List<VendorTermsDto>();

            var parentVendorList = vendorListResponse.IsSuccess == true && vendorListResponse.Result != null ?
                JsonConvert.DeserializeObject<List<ParentVendorListForInvoiceDTO>>(Convert.ToString(vendorListResponse.Result)!) ?? new()
                : new List<ParentVendorListForInvoiceDTO>();

            mm.vendorTermsList = vendorTerms;
            mm.ParentVendorListEnterInvoice = parentVendorList;

            return View(mm);
        }

        public async Task<IActionResult> ProjectListonVendorDDChange(string VendorId)
        {
            MultipleModel mm = new();
            var projectList = new List<ProjectListEnterInvoiceDTO>();

            var response = await _invoiceService.GetProjectList_Tax<APIResponse>(VendorId);

            projectList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<ProjectListEnterInvoiceDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ProjectListEnterInvoiceDTO>();

            mm.ProjectListEnterInvoice = projectList;

            return PartialView("~/Views/Invoice/_partialProjectListInvoiceWithoutItems.cshtml", mm);
        }

        public async Task<IActionResult> GetPoselector_Tax(string VendorId, string ProjectId)
        {
            MultipleModel mm = new();
            List<POSelectorListDTO> POSelectorList = new List<POSelectorListDTO>();

            var response = await _invoiceService.GetPOSelector_Tax<APIResponse>(VendorId, ProjectId);

            POSelectorList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<POSelectorListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POSelectorListDTO>();

            mm.POSelectorList = POSelectorList;
            return PartialView("~/Views/Invoice/_partialGetPoSelector_Tax.cshtml", mm);
        }

        public async Task<string> SaveInvoice_Tax(SaveInvoiceDTO saveInvoiceDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            saveInvoiceDTO.UserId = userId;
            saveInvoiceDTO.IsCCRefund = false;
            var reponse = await _invoiceService.SaveInvoiceWihtoutItems_Tax<APIResponse>(saveInvoiceDTO);
            return JsonConvert.SerializeObject(reponse);
        }

        #endregion

        #region ::Invoice Search 
        public async Task<IActionResult> invoicesearch(string id)
        {
            if (id == null)
            {
                ViewData["poidhdn"] = "";
            }
            else
            {
                ViewData["poidhdn"] = id;
            }
            MultipleModel mm = new MultipleModel();
            var response = await _invoiceService.GetAllParentVendor<APIResponse>();

            var parentVendorListInvoiceDTOs = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<ParentVendorListInvoiceDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new();

            mm.ParentVendorListInvoice = parentVendorListInvoiceDTOs;
            return View(mm);
        }

        //public async Task<IActionResult>VendorListing()
        //{
        //    MultipleModel mm = new MultipleModel();
        //    List<ParentVendorListInvoiceDTO> parentVendorListInvoiceDTOs = new List<ParentVendorListInvoiceDTO>();
        //    var response = await _unitOfWork.InvoiceService.GetAllParentVendor<APIResponse>();
        //    if (response.IsSuccess)
        //    {
        //        parentVendorListInvoiceDTOs = JsonConvert.DeserializeObject<List<ParentVendorListInvoiceDTO>>(Convert.ToString(response.Result));
        //    }
        //    else
        //    {
        //        parentVendorListInvoiceDTOs = new List<ParentVendorListInvoiceDTO>();
        //    }
        //    mm.ParentVendorListInvoice = parentVendorListInvoiceDTOs;
        //    return PartialView("~/Views/Invoice/_partialVendorListing.cshtml", mm);
        //}
        [HttpPost]
        public async Task<IActionResult> ProjectListDropdown([FromBody] VendorIdDTO vendorIdDTO)
        {
            MultipleModel mm = new MultipleModel();
            var ProjectList = new List<ProjectDropDownListDTO>();
            if (vendorIdDTO.VendorId == "0")
            {
                var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                var response = await _invoiceService.GetAllProjectNameInvoice<APIResponse>(userId);

                ProjectList = response.IsSuccess == true && response.Result != null
                    ? JsonConvert.DeserializeObject<List<ProjectDropDownListDTO>>(Convert.ToString(response.Result)!) ?? new()
                    : new();

                mm.ProjectNameDropDown = ProjectList;

                return PartialView("~/Views/Invoice/_partialProjectNameDropDown.cshtml", mm);
            }
            else
            {
                var response = await _invoiceService.GetProjectNameWithVendor<APIResponse>(vendorIdDTO);

                ProjectList = response.IsSuccess == true && response.Result != null
                    ? JsonConvert.DeserializeObject<List<ProjectDropDownListDTO>>(Convert.ToString(response.Result)!)
                    : new();

                mm.ProjectNameDropDown = ProjectList ?? new();
                return PartialView("~/Views/Invoice/_projectDropDownForVendorId.cshtml", mm);
            }
        }
        [HttpPost]
        public async Task<IActionResult> SearchInvoiceList([FromBody] InvoiceListDataGetDTO invoiceListDataGetDTO)
        {
            MultipleModel mm = new MultipleModel();
            invoiceListDataGetDTO.Mode = string.Empty;

            if (invoiceListDataGetDTO.InvoiceNumber == null)
            {
                invoiceListDataGetDTO.InvoiceNumber = string.Empty;
            }
            if (invoiceListDataGetDTO.Todate == null)
            {
                invoiceListDataGetDTO.Todate = string.Empty;
            }
            if (invoiceListDataGetDTO.Fromdate == null)
            {
                invoiceListDataGetDTO.Fromdate = string.Empty;
            }
            if (invoiceListDataGetDTO.ProjectID == null)
            {
                invoiceListDataGetDTO.ProjectID = string.Empty;
            }
            if (invoiceListDataGetDTO.VendorID == null)
            {
                invoiceListDataGetDTO.VendorID = string.Empty;
            }

            var response = await _invoiceService.GetInvoiceSearcList<APIResponse>(invoiceListDataGetDTO);

            var invoiceLists = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<InvoiceListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new();

            mm.InvoiceList = invoiceLists;
            return PartialView("~/Views/Invoice/_partialInvoiceList.cshtml", mm);
        }

        #endregion

        #region ::Payement Search 

        public string setFormanualsearch(string id)
        {
            TempData["setterformanualsearch"] = id;
            return "";
        }

        public async Task<IActionResult> ManualPaymentSearch()
        {
            var prevdata = Convert.ToString(TempData["setterformanualsearch"]);
            ViewData["prevdata"] = prevdata;

            MultipleModel mm = new();

            var (t1, t2, t3) = (
                _invoiceService.GetAllVendorList<APIResponse>(),
                _invoiceService.GetPaymentType<APIResponse>(),
                _invoiceService.GetBankAccountsInManualSearch<APIResponse>()
            );

            await Task.WhenAll(t1, t2, t3);

            var response = t1.Result;
            var paymentTypeResponse = t2.Result;
            var baresponse = t3.Result;

            mm.PaymentVendorList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<PaymentVendorLIstDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<PaymentVendorLIstDTO>();


            mm.PaymentTypesList = paymentTypeResponse.IsSuccess == true && paymentTypeResponse.Result != null
                ? JsonConvert.DeserializeObject<List<PaymentTypeDTO>>(Convert.ToString(paymentTypeResponse.Result)!) ?? new()
                : new List<PaymentTypeDTO>();

            mm.BankAccountMSList = baresponse.IsSuccess == true && baresponse.Result != null ?
                JsonConvert.DeserializeObject<List<BankAccountDTO>>(Convert.ToString(baresponse.Result)!) ?? new()
                : new List<BankAccountDTO>();

            return View(mm);
        }

        //Get Payment in Advanced action in the old solution.
        public async Task<IActionResult> PaymentSearchTable(PaymentSearchDTO paymentSearchDTO)
        {
            MultipleModel mm = new MultipleModel();
            var paymentDetailsAdvancedLists = new List<PaymentDetailsAdvancedList>();
            if (paymentSearchDTO.todate == null)
            {
                paymentSearchDTO.todate = string.Empty;
            }
            if (paymentSearchDTO.fromdate == null)
            {
                paymentSearchDTO.fromdate = string.Empty;
            }

            if (paymentSearchDTO.VendorID == null)
            {
                paymentSearchDTO.VendorID = string.Empty;
            }
            if (paymentSearchDTO.PaymentNumber == null)
            {
                paymentSearchDTO.PaymentNumber = string.Empty;
            }
            if (paymentSearchDTO.BankAccountID == null || paymentSearchDTO.BankAccountID == "0")
            {
                paymentSearchDTO.BankAccountID = string.Empty;
            }

            if (string.IsNullOrEmpty(paymentSearchDTO.previousPN) || string.IsNullOrWhiteSpace(paymentSearchDTO.previousPN))
            {
                var response = await _invoiceService.GetPaymentSearchAdvance<APIResponse>(paymentSearchDTO);
                paymentDetailsAdvancedLists = response.IsSuccess == true && response.Result != null
                    ? JsonConvert.DeserializeObject<List<PaymentDetailsAdvancedList>>(Convert.ToString(response.Result)!) ?? new()
                    : new List<PaymentDetailsAdvancedList>();
            }
            else
            {
                var response = await _invoiceService.GetPaymentSearchAdvanceOnRedirect<APIResponse>(paymentSearchDTO.previousPN);
                paymentDetailsAdvancedLists = response.IsSuccess == true && response.Result != null
                    ? JsonConvert.DeserializeObject<List<PaymentDetailsAdvancedList>>(Convert.ToString(response.Result)!) ?? new()
                    : new List<PaymentDetailsAdvancedList>();
            }

            mm.PaymentDetailsAdvanced = paymentDetailsAdvancedLists;
            return PartialView("~/Views/Invoice/_partialPaymentSearchTable.cshtml", mm);

            //}
            //else
            //{
            //    var response = await _unitOfWork.InvoiceService.GetPaymentSearchAdvanceOnRedirect<APIResponse>(paymentSearchDTO.previousPN);

            //    paymentDetailsAdvancedLists = response.IsSuccess ?
            //        JsonConvert.DeserializeObject<List<PaymentDetailsAdvancedList>>(Convert.ToString(response.Result))
            //        : new List<PaymentDetailsAdvancedList>();

            //    mm.PaymentDetailsAdvanced = paymentDetailsAdvancedLists;
            //    return PartialView("~/Views/Invoice/_partialPaymentSearchOnRedirect.cshtml", mm);
            //}

        }
        //for redirect from Invoice Search
        public async Task<IActionResult> EditPaymentModal(string PaymentId)
        {

            var (t1, t2, t3) = (
                _invoiceService.GetPaymentDetailsByPaymentId<APIResponse>(PaymentId),
                _invoiceService.GetPaymentType<APIResponse>(),
                _invoiceService.GetBankAccountDetailsBasedOnProject<APIResponse>(PaymentId)
            );

            await Task.WhenAll(t1, t2, t3);
            var PaymentDetailResponse = t1.Result;
            var paymentTypeResponse = t2.Result;
            var bankDetailsResponse = t3.Result;

            var manualPaymentDetaisGetDTO = PaymentDetailResponse.IsSuccess == true && PaymentDetailResponse.Result != null ?
                JsonConvert.DeserializeObject<ManualPaymentDetaisGetDTO>(Convert.ToString(PaymentDetailResponse.Result)!) ?? new()
                : new ManualPaymentDetaisGetDTO();

            var paymentTypeDTOs = paymentTypeResponse.IsSuccess == true && paymentTypeResponse.Result != null ?
                JsonConvert.DeserializeObject<List<PaymentTypeDTO>>(Convert.ToString(paymentTypeResponse.Result)!) ?? new()
                : new List<PaymentTypeDTO>();

            var bankAccountDetailsListDTOs = bankDetailsResponse.IsSuccess == true && bankDetailsResponse.Result != null ?
                JsonConvert.DeserializeObject<List<BankAccountDetailsListDTO>>(Convert.ToString(bankDetailsResponse.Result)!) ?? new()
                : new List<BankAccountDetailsListDTO>();

            MultipleModel mm = new()
            {
                ManulPaymentDetails = manualPaymentDetaisGetDTO,
                PaymentTypesList = paymentTypeDTOs,
                BankAccountDetailsLists = bankAccountDetailsListDTOs
            };

            return PartialView("~/Views/Invoice/_partialEditPaymentModal.cshtml", mm);
        }
        public async Task<IActionResult> PaymentItemTable(string ManualPaymentID)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPaymentItemDetails<APIResponse>(ManualPaymentID);

            var paymentItemLists = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<PaymentItemListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<PaymentItemListDTO>();

            mm.PaymentItemList = paymentItemLists;

            return PartialView("~/Views/Invoice/_partialPaymentItemDetailsTable.cshtml", mm);
        }
        public async Task<IActionResult> PaymentHistory(long ManualPaymentID)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPaymentHistory<APIResponse>(ManualPaymentID);

            var paymentHistoryList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<PaymentHistoryDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<PaymentHistoryDTO>();

            mm.PaymentHistoryList = paymentHistoryList;

            return PartialView("~/Views/Invoice/_partialPaymentHistoryTable.cshtml", mm);
        }
        public async Task<IActionResult> PaymentUpdateandItemUpdateDetails(string FldID, string mode)
        {
            MultipleModel mm = new MultipleModel();
            var paymentupdateDetailsList = new List<PaymentUpdateDetailsDTO>();
            var paymentItemUpdateDetailsList = new List<PaymentItemUpdateDetailsDTO>();

            if (mode == "paymentupdatedetails")
            {
                var response = await _invoiceService.GetPaymentUpdateDetails<APIResponse>(FldID);

                paymentupdateDetailsList = response.IsSuccess == true && response.Result != null
                    ? JsonConvert.DeserializeObject<List<PaymentUpdateDetailsDTO>>(Convert.ToString(response.Result)!) ?? new()
                    : new List<PaymentUpdateDetailsDTO>();
            }

            else
            {
                var response = await _invoiceService.GetItemUpdateDetails<APIResponse>(FldID);

                paymentItemUpdateDetailsList = response.IsSuccess == true && response.Result != null
                     ? JsonConvert.DeserializeObject<List<PaymentItemUpdateDetailsDTO>>(Convert.ToString(response.Result)!) ?? new()
                    : new List<PaymentItemUpdateDetailsDTO>();

            }

            ViewBag.Mode = mode;
            mm.PaymentUpdateDetailsList = paymentupdateDetailsList;
            mm.PaymentItemUpdateDetailsList = paymentItemUpdateDetailsList;

            return PartialView("~/Views/Invoice/_partialPaymentUpdateandPaymentItemUdpateTable.cshtml", mm);
        }
        public async Task<string> VoidPayment(string ManualPaymentId)
        {
            var response = await _invoiceService.VoidPayment<APIResponse>(ManualPaymentId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> ReversePayment(string PaymentId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _invoiceService.ReversePayment<APIResponse>(PaymentId, userId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> UpdatePaymentMainDetails(ManualPaymentUpdateDTO manualPaymentUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            manualPaymentUpdateDTO.UserId = userId;
            var response = await _invoiceService.UpdatePaymentMainDetails<APIResponse>(manualPaymentUpdateDTO);
            return JsonConvert.SerializeObject(response);
        }
        [HttpPost]
        public async Task<string> UpdatePaymentItemDetails([FromBody] List<ManualPaymentItemsUpdateDTO> manualPaymentItemsUpdateDTOs)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";

            var response = await _invoiceService.UpdatePaymentItemDetails<APIResponse>(manualPaymentItemsUpdateDTOs, userId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> Deletepayment(string ManualPaymentId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _invoiceService.DeletePayment<APIResponse>(ManualPaymentId, userId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<IActionResult> GetInvoiceDetails(string PaymentId)
        {
            var response = await _invoiceService.GetInvoiceDetails<APIResponse>(PaymentId);
            
            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetPaymentItemDetailsByPaymentId(string PaymentId)
        {
            var response = await _invoiceService.GetPaymentItemDetailsByPaymentId<APIResponse>(PaymentId);
            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> PopulateBankAccount(string PaymentId)
        {
            var response = await _invoiceService.PopulateBankAccount<APIResponse>(PaymentId);

            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetAllInvoiceAccounts(string InvoiceId)
        {
            var response = await _invoiceService.GetAllInvoiceAccounts<APIResponse>(InvoiceId);
            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        #region :: Enter Credit Note
        public async Task<IActionResult> CreditNoteEntry()
        {
            MultipleModel mm = new();

            var response = await _invoiceService.VendorListinCN<APIResponse>();
            var vendorinCNList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<VendorInCreditNoteDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<VendorInCreditNoteDTO>();

            mm.VendorListinECN = vendorinCNList;

            return View(mm);
        }
        public async Task<IActionResult> ProjectDDinCN(string VendorId)
        {
            MultipleModel mm = new();
            var response = await _invoiceService.ProjectDDinCN<APIResponse>(VendorId);

            var projectList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<ProjectListEnterInvoiceDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ProjectListEnterInvoiceDTO>();

            mm.ProjectListEnterInvoice = projectList;

            return PartialView("~/Views/Invoice/_partialProjectDDinCN.cshtml", mm);


        }

        public async Task<string> ProjectAccountinCN(string ProjectId)
        {
            var response = await _invoiceService.GetProjectAccountinCN<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> POSelectorinCN(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO)
        {
            MultipleModel mm = new();
            var response = await _invoiceService.GetPOSelectorinCN<APIResponse>(getPOInCreditNoteParamsDTO);
            var POInCNList = response.IsSuccess == true && response.Result != null
                            ? JsonConvert.DeserializeObject<List<POInCreditNoteDTO>>(Convert.ToString(response.Result)!) ?? new()
                            : new List<POInCreditNoteDTO>();

            mm.POInCreditNoteList = POInCNList;

            return PartialView("~/Views/Invoice/_partialPOSelectorInCN.cshtml", mm);
        }
        public async Task<IActionResult> POItemsinCN(string poids)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOItemsinCN<APIResponse>(poids);

            var POitemList = response.IsSuccess == true && response.Result != null
                            ? JsonConvert.DeserializeObject<List<POIteminCNDTO>>(Convert.ToString(response.Result)!) ?? new()
                            : new List<POIteminCNDTO>();

            mm.POItemListinCN = POitemList;

            return PartialView("~/Views/Invoice/_partialPOIteminCN.cshtml", mm);
        }

        public async Task<IActionResult> GetInvIteminCN(string POLIIDS)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetItemDetailsinCN<APIResponse>(POLIIDS);

            var itemDetailsList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<ItemDetialsinCNDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ItemDetialsinCNDTO>();

            mm.ItemDetailsinCNList = itemDetailsList;

            return PartialView("~/Views/Invoice/_partialInvItemDetailsinCN.cshtml", mm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetItemsDetailsonSave([FromBody] GetItemsDataonSaveinCNparamsDTO getItemsDataonSaveinCNparamsDTO)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetItemDetailsonSaveinCN<APIResponse>(getItemsDataonSaveinCNparamsDTO.POLIDS ?? "");

            var itemmsonSaveList = response.IsSuccess == true && response.Result != null
               ? JsonConvert.DeserializeObject<List<GetItemsOnSaveDTO>>(Convert.ToString(response.Result)!) ?? new()
               : new List<GetItemsOnSaveDTO>();

            mm.ItemDetailsonSave = itemmsonSaveList;
            mm.POLIData = getItemsDataonSaveinCNparamsDTO.POLIData;

            return PartialView("~/Views/Invoice/_partialItemDetailsonSaveDTO.cshtml", mm);
        }

        public async Task<string> SaveInvoiceInCn(SaveInvoiceDTO saveInvoiceDTO)
        {
            if (saveInvoiceDTO == null)
            {
                return JsonConvert.SerializeObject(
                    ApiResponseService.BadRequestResponse("Invoice are required.")
                );
            }

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            saveInvoiceDTO.UserId = userId;
            var response = await _invoiceService.InsertInvoiceinCN<APIResponse>(saveInvoiceDTO);

            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        public async Task<string> SaveInvoiceItemsinCN([FromBody] List<InvoiceItemsInCN> invoiceItemsInCNs)
        {
            if (invoiceItemsInCNs == null || invoiceItemsInCNs.Count == 0)
            {
                return JsonConvert.SerializeObject(
                    ApiResponseService.BadRequestResponse("Invoice items are required.")
                );
            }

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            invoiceItemsInCNs[0].UserId = userId;
            var response = await _invoiceService.InsertInvoiceItemsinCN<APIResponse>(invoiceItemsInCNs);

            return JsonConvert.SerializeObject(response);
        }
        [HttpPost]
        public async Task<string> UpdatePOLineItem([FromBody] List<UpdatePOLineIteminCNDTO> updatePOLineIteminCNDTOs)
        {
            var UserId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            foreach (var item in updatePOLineIteminCNDTOs)
            {
                item.UserId = UserId;
            }
            var response = await _invoiceService.UpdatePOLineItemsinCN<APIResponse>(updatePOLineIteminCNDTOs);

            return JsonConvert.SerializeObject(response);
        }
        #endregion

        #region :: Enter Credit Note without items

        public async Task<IActionResult> CreditEntry_Tax()
        {
            var mm = new MultipleModel();

            var response = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();
            var vendorTerms = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<VendorTermsDto>>(Convert.ToString(response.Result)!) ?? new()
                : new List<VendorTermsDto>();

            var vendorListResponse = await _invoiceService.GetVendorListInvoiceTax<APIResponse>();
            var parentVendorList = vendorListResponse.IsSuccess == true && vendorListResponse.Result != null
                ? JsonConvert.DeserializeObject<List<ParentVendorListForInvoiceDTO>>(Convert.ToString(vendorListResponse.Result)!) ?? new()
                : new List<ParentVendorListForInvoiceDTO>();

            mm.vendorTermsList = vendorTerms;
            mm.ParentVendorListEnterInvoice = parentVendorList;

            return View(mm);
        }

        public async Task<IActionResult> ProjectListinCreditEntry_Tax(string VendorId)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetProjectList_Tax<APIResponse>(VendorId);

            var projectList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<ProjectListEnterInvoiceDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ProjectListEnterInvoiceDTO>();

            mm.ProjectListEnterInvoice = projectList;

            return PartialView("~/Views/Invoice/_partialProjectDDCN_Tax.cshtml", mm);
        }

        public async Task<IActionResult> GetPoselectorCN_Tax(string VendorId, string ProjectId)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOSelector_Tax<APIResponse>(VendorId, ProjectId);

            var POSelectorList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<POSelectorListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POSelectorListDTO>();

            mm.POSelectorList = POSelectorList;
            return PartialView("~/Views/Invoice/_partialGetPoSelector_Tax.cshtml", mm);
        }

        #endregion

        #region :: ManualPayment

        public async Task<IActionResult> ManualPayment()
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetProjectListinMP<APIResponse>();
            var projectList = response.IsSuccess == true && response.Result != null
               ? JsonConvert.DeserializeObject<List<ProjectListinMP>>(Convert.ToString(response.Result)!) ?? new()
               : new List<ProjectListinMP>();

            var ptReponse = await _invoiceService.GetAllPaymentType<APIResponse>();
            var paymentTypeList = ptReponse.IsSuccess == true && ptReponse.Result != null
               ? JsonConvert.DeserializeObject<List<PaymentTypeGetDTO>>(Convert.ToString(ptReponse.Result)!) ?? new()
               : new List<PaymentTypeGetDTO>();

            mm.ProjectListinMP = projectList;
            mm.PaymentTypeList = paymentTypeList;

            return View(mm);
        }

        public async Task<string> GetCurrency(string ProjectId)
        {
            var response = await _invoiceService.GetCurrency<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> GetProjectAccountinMP(string ProjectId)
        {
            var response = await _invoiceService.GetProjectAccountinMP<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> GetAllpaymentNumber(string BankAccount)
        {
            var response = await _invoiceService.GetLastPaymentType<APIResponse>(BankAccount);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> GetPaymentNumberForAll(string PaymentType, string BankAccountId)
        {
            var response = await _invoiceService.GetPaymentNumberForALl<APIResponse>(PaymentType, BankAccountId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<IActionResult> GetAllInvoiceListByVendor2(string ProjectId, string Currcode)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetAllInvoiceListinMP<APIResponse>(ProjectId, Currcode);

            var GetAllInvListByVendor2DTO = response.IsSuccess == true && response.Result != null
               ? JsonConvert.DeserializeObject<List<GetAllInvListByVendor2DTO>>(Convert.ToString(response.Result)!) ?? new()
               : new List<GetAllInvListByVendor2DTO>();

            mm.GetAllInvoiceListinMP = GetAllInvListByVendor2DTO;

            return PartialView("~/Views/Invoice/_partialInvoiceSelectortblinMP.cshtml", mm);
        }

        public async Task<string> CheckItemStatus(string Invoicenumber)
        {
            var response = await _invoiceService.CheckItemStatusMP<APIResponse>(Invoicenumber);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> CheckPaymentNumber(string PaymentNumber, string PaymentType, string BankAccountID)
        {
            var response = await _invoiceService.CheckPaymentNumberMP<APIResponse>(PaymentNumber, PaymentType, BankAccountID);
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<string> SaveManualPayment(ManualPaymentSaveDTO manualPaymentSaveDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            manualPaymentSaveDTO.UserId = userId;
            var response = await _invoiceService.SaveManualPayment<APIResponse>(manualPaymentSaveDTO);

            return JsonConvert.SerializeObject(response);
        }

        public async Task<string> SavePaymentItem(ManualPaymentItemSaveDTO manualPaymentItemSaveDTO)
        {
            var userID = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            manualPaymentItemSaveDTO.UserId = userID;
            var response = await _invoiceService.SaveManualPaymentItem<APIResponse>(manualPaymentItemSaveDTO);

            return JsonConvert.SerializeObject(response);
        }

        public async Task<IActionResult> PopulateEditModalDataByPaymentId(string ManualPaymentId)
        {

            var (t1, t2, t3, t4) = (
                _invoiceService.GetBankAccountDetailsBasedOnProject<APIResponse>(ManualPaymentId),
                _invoiceService.GetPaymentDetailsByPaymentId<APIResponse>(ManualPaymentId),
                _invoiceService.GetPaymentItemDetails<APIResponse>(ManualPaymentId),
                _invoiceService.GetPaymentType<APIResponse>()
            );

            await Task.WhenAll(t1, t2, t3, t4);
            var bankDetailsResponse = t1.Result;
            var paymentDetailsResponse = t2.Result;
            var paymentItemDetailsResponse = t3.Result;
            var paymentTypeResponse = t4.Result;

            MultipleModel mm = new();

            mm.BankAccountDetailsLists = bankDetailsResponse.UnwrapResultOrDefault<List<BankAccountDetailsListDTO>>();
            mm.ManulPaymentDetails = paymentDetailsResponse.UnwrapResultOrDefault<ManualPaymentDetaisGetDTO>();
            mm.PaymentTypesList = paymentTypeResponse.UnwrapResultOrDefault<List<PaymentTypeDTO>>();
            mm.PaymentItemList = paymentItemDetailsResponse.UnwrapResultOrDefault<List<PaymentItemListDTO>>();

            return PartialView("_partialEditPaymentModalBody", mm);


            //var mm = new MultipleModel();

            ////TODO : Fetch Bank Account Details
            //var bankDetailsResponse = await _invoiceService.GetBankAccountDetailsBasedOnProject<APIResponse>(ManualPaymentId);
            //var bankAccountDetailsListDTOs = bankDetailsResponse.IsSuccess ?
            //    JsonConvert.DeserializeObject<List<BankAccountDetailsListDTO>>(Convert.ToString(bankDetailsResponse.Result)!) ?? new()
            //    : new List<BankAccountDetailsListDTO>();

            ////TODO : Fetch Payment Details By Payment Id
            //var paymentDetailResponse = await _invoiceService.GetPaymentDetailsByPaymentId<APIResponse>(ManualPaymentId);
            //var manualPaymentDetails = paymentDetailResponse.IsSuccess ?
            //    JsonConvert.DeserializeObject<ManualPaymentDetaisGetDTO>(Convert.ToString(paymentDetailResponse.Result)!) ?? new()
            //    : new ManualPaymentDetaisGetDTO();


            //var response = await _invoiceService.GetPaymentItemDetails<APIResponse>(ManualPaymentId);

            //var paymentItemLists = response.IsSuccess ?
            //    JsonConvert.DeserializeObject<List<PaymentItemListDTO>>(Convert.ToString(response.Result)!) ?? new()
            //    : new List<PaymentItemListDTO>();

            //var paymentTypeResponse = await _invoiceService.GetPaymentType<APIResponse>();
            //var paymentTypeDTOs = paymentTypeResponse.IsSuccess == true && paymentTypeResponse.Result != null ?
            //    JsonConvert.DeserializeObject<List<PaymentTypeDTO>>(Convert.ToString(paymentTypeResponse.Result)!) ?? new()
            //    : new List<PaymentTypeDTO>();


            //mm.PaymentItemList = paymentItemLists;
            //mm.ManulPaymentDetails = manualPaymentDetails;
            //mm.BankAccountDetailsLists = bankAccountDetailsListDTOs;
            //mm.PaymentTypesList = paymentTypeDTOs;
            //return PartialView("_partialEditPaymentModalBody", mm);
        }

        public async Task<string> GetInvoiceAccountForQBO(string InvoiceId)
        {
            var response = await _invoiceService.GetInvoiceAccountForQBO<APIResponse>(InvoiceId);

            if (response != null && response.IsSuccess)
            {
                return JsonConvert.SerializeObject(response.Result);
            }

            return JsonConvert.SerializeObject("");
        }

        public async Task<string> CheckInvoiceAccount(string AccountId)
        {
            var response = await _invoiceService.CheckInvoiceAccount<APIResponse>(AccountId);
            if (response != null && response.IsSuccess)
            {
                return JsonConvert.SerializeObject(response.Result);
            }
            return JsonConvert.SerializeObject("");
        }

        #endregion

        #region ::Invoice Edit

        public async Task<IActionResult> InvoiceEdit(string invoiceId)
        {
            //check invoice calling 
            var res = await IsInvoiceTax(invoiceId);
            if (res != 'A')
            {
                if (res == 'B')
                {
                    return RedirectToAction("InvoiceEdit_TAX", new { invoiceid = invoiceId });
                }
                else
                {
                    /// return RedirectToAction("CreditEdit_TAX/" + id);
                    return RedirectToAction("InvoiceEdit_TAX", new { invoiceid = invoiceId });


                }
            }

            MultipleModel mm = new();


            var response = await _invoiceService.GetInvoiceEditDetials<APIResponse>(invoiceId);

            var invoiceEditDetailsDTO = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<InvoiceEditDetailsDTO>(Convert.ToString(response.Result)!) ?? new()
                : new InvoiceEditDetailsDTO();

            var termsResponse = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();

            var vendorTerms = termsResponse.IsSuccess == true && termsResponse.Result != null
                ? JsonConvert.DeserializeObject<List<VendorTermsDto>>(Convert.ToString(termsResponse.Result)!) ?? new()
                : new List<VendorTermsDto>();

            var voidpaymentstatus = await _invoiceService.CheckInvoiceVoidPayment<APIResponse>(invoiceId);
            var checkInvoiceVoidPaymentDTO = voidpaymentstatus.IsSuccess == true && voidpaymentstatus.Result != null
                ? JsonConvert.DeserializeObject<CheckInvoiceVoidPaymentDTO>(Convert.ToString(voidpaymentstatus.Result)!) ?? new()
                : new CheckInvoiceVoidPaymentDTO();

            mm.InvoiceEditDetails = invoiceEditDetailsDTO;
            mm.vendorTermsList = vendorTerms;
            mm.CheckInvoiceVoidPayment = checkInvoiceVoidPaymentDTO;

            return View(mm);
        }
        public async Task<IActionResult> POSelectorInvoiceEdit(string VendorId, string ProjectId, string InvoiceNumber, string POID)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOSelectorInvEdit<APIResponse>(VendorId, ProjectId, InvoiceNumber);

            var POSelectorList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<POSelectorListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POSelectorListDTO>();

            mm.POSelectorList = POSelectorList;
            ViewBag.POID = POID;
            return PartialView("~/Views/Invoice/_partialPOSelectorTableInvEdit.cshtml", mm);

        }
        public async Task<IActionResult> POLineItemSelectorBasedonPOInvEdit(string poids, string invoiceid, bool clicked)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOLISelectorInvEdit<APIResponse>(poids, invoiceid);

            var poliselectorList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<POItemSelectorInvEditDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POItemSelectorInvEditDTO>();

            //mm.POLineItemSelectorList = poliselectorList;
            mm.POItemSelectorinvEdit = poliselectorList;
            ViewBag.Clicked = clicked;

            return PartialView("~/Views/Invoice/_partialPOLISelectortableInvEdit.cshtml", mm);
        }
        public async Task<IActionResult> GetInvoiceItemInvEdit(string Invoiceid)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetInvoiceItemonPageLoad<APIResponse>(Invoiceid);
            var invoiceDataForSelectedPOLIlist = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<InvoiceItemsonLoadDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<InvoiceItemsonLoadDTO>();


            mm.InvoiceItemsonLoad = invoiceDataForSelectedPOLIlist;

            return PartialView("~/Views/Invoice/_partialInvoiceItemTableinInvEdit.cshtml", mm);
        }
        public async Task<IActionResult> GetInvoiceDataAfterSelectingInvEdit(string poli, string percent, string InvoiceId)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetInvoceItemsonClick<APIResponse>(poli, InvoiceId);

            var invoiceDataForSelectedPOLIlist = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<InvoiceDataBasedOnPOLIInvEdit>>(Convert.ToString(response.Result)!) ?? new()
                : new List<InvoiceDataBasedOnPOLIInvEdit>();

            mm.InvoiceItemsOnClick = invoiceDataForSelectedPOLIlist;
            ViewBag.Percent = percent;

            return PartialView("~/Views/Invoice/_partialInvoiceItemTableOnClick.cshtml", mm);
        }
        public async Task<char> IsInvoiceTax(string invoiceid)
        {
            var response = await _invoiceService.IsInvoiceTax<APIResponse>(invoiceid);
            var isInvoiceTaxCheckDTO = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<IsInvoiceTaxCheckDTO>(Convert.ToString(response.Result)!) ?? new()
                : new IsInvoiceTaxCheckDTO();

            char result = 'A';

            var NoOfItems = isInvoiceTaxCheckDTO.NoOfItems;

            decimal? Amount = isInvoiceTaxCheckDTO.InvoiceAmount;

            if (NoOfItems > 0)
            {
                result = 'A';
            }
            else if (NoOfItems == 0 && Amount > 0)
            {
                result = 'B';
            }
            else
            {
                result = 'C';
            }
            return result;
        }
        public async Task<string> UpdateInvoice(UpdateInvoiceDTO updateInvoiceDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            updateInvoiceDTO.UserId = userId;
            var response = await _invoiceService.UpdateInvoice<APIResponse>(updateInvoiceDTO);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> VoidInvoice(string invoiceId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _invoiceService.VoidInvoice<APIResponse>(invoiceId, userId);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> DeleteInvoice(string invoiceId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _invoiceService.DeleteInvoice<APIResponse>(invoiceId, userId);
            return JsonConvert.SerializeObject(response);
        }

        #endregion

        #region :: Invoice Edit Tax

        public async Task<IActionResult> InvoiceEdit_TAX(string invoiceid)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetInvoiceEditDetials<APIResponse>(invoiceid);
            var invoiceEditDetailsDTO = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<InvoiceEditDetailsDTO>(Convert.ToString(response.Result)!) ?? new()
                : new InvoiceEditDetailsDTO();

            var termsResponse = await _systemAdminRepository.GetAllInvoiceTermsAsync<APIResponse>();
            var vendorTerms = termsResponse.IsSuccess == true && termsResponse.Result != null
                ? JsonConvert.DeserializeObject<List<VendorTermsDto>>(Convert.ToString(termsResponse.Result)!) ?? new()
                : new List<VendorTermsDto>();

            var voidpaymentstatus = await _invoiceService.CheckInvoiceVoidPayment<APIResponse>(invoiceid);
            var checkInvoiceVoidPaymentDTO = voidpaymentstatus.IsSuccess == true && voidpaymentstatus.Result != null
                ? JsonConvert.DeserializeObject<CheckInvoiceVoidPaymentDTO>(Convert.ToString(voidpaymentstatus.Result)!) ?? new()
                : new CheckInvoiceVoidPaymentDTO();

            mm.InvoiceEditDetails = invoiceEditDetailsDTO;
            mm.vendorTermsList = vendorTerms;
            mm.CheckInvoiceVoidPayment = checkInvoiceVoidPaymentDTO;

            return View(mm);
        }
        public async Task<IActionResult> GetPoselector_EditTax(string VendorId, string ProjectId, string invoicepoid)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOSelector_Tax<APIResponse>(VendorId, ProjectId);

            var POSelectorList = response.IsSuccess == true && response.Result != null
                ? JsonConvert.DeserializeObject<List<POSelectorListDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<POSelectorListDTO>();

            mm.POSelectorList = POSelectorList;
            ViewBag.POID = invoicepoid;
            return PartialView("~/Views/Invoice/_partialGetPoSelector_EditTax.cshtml", mm);
        }

        #endregion

        #region :: Edit Credit Note
        public async Task<IActionResult> EditCreditNote(string invoiceId)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetCreditNote<APIResponse>(invoiceId);

            var getCreditNoteDTO = response.IsSuccess == true && response.Result != null ?
                               JsonConvert.DeserializeObject<GetCreditNoteDTO>(Convert.ToString(response.Result)!) ?? new()
                               : new GetCreditNoteDTO();


            mm.GetCreditNote = getCreditNoteDTO;

            ViewBag.InvoiceId = invoiceId;
            return View(mm);
        }
        public async Task<IActionResult> POSelectorinCNEdit(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO, string poids)
        {
            MultipleModel mm = new();
            var response = await _invoiceService.GetPOSelectorinCNEdit<APIResponse>(getPOInCreditNoteParamsDTO);
            var POInCNList = response.IsSuccess == true && response.Result != null
                            ? JsonConvert.DeserializeObject<List<POInCreditNoteDTO>>(Convert.ToString(response.Result)!) ?? new()
                            : new List<POInCreditNoteDTO>();

            mm.POInCreditNoteList = POInCNList;
            ViewBag.POID = poids;

            return PartialView("~/Views/Invoice/_partialPOSelectorInCNEdit.cshtml", mm);
        }
        public async Task<IActionResult> POItemsinCNEdit(string poids, string InvoiceId, bool clicked)
        {
            MultipleModel mm = new();

            var response = await _invoiceService.GetPOItemsinCNEdit<APIResponse>(poids, InvoiceId);

            var POitemList = response.IsSuccess == true && response.Result != null
                            ? JsonConvert.DeserializeObject<List<POIteminCNDTO>>(Convert.ToString(response.Result)!) ?? new()
                            : new List<POIteminCNDTO>();

            mm.POItemListinCN = POitemList;
            ViewBag.Clicked = clicked;

            return PartialView("~/Views/Invoice/_partialPOIteminCNEdit.cshtml", mm);
        }

        public async Task<string> UpdateCreditNote(CreditNoteUpdateDTO creditNoteUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            creditNoteUpdateDTO.UserId = userId;
            var response = await _invoiceService.UpdateCreditNote<APIResponse>(creditNoteUpdateDTO);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> GetInvIteminCNEdit(string POLIIDS, string InvoiceId, bool clicked)
        {
            MultipleModel mm = new();
            var response = await _invoiceService.GetInvoiceItemInCNEdit<APIResponse>(POLIIDS, InvoiceId);

            var itemDetailsList = response.IsSuccess == true && response.Result != null ?
                JsonConvert.DeserializeObject<List<ItemDetialsinCNDTO>>(Convert.ToString(response.Result)!) ?? new()
                : new List<ItemDetialsinCNDTO>();

            mm.ItemDetailsinCNList = itemDetailsList;
            ViewBag.Clicked = clicked;

            return PartialView("~/Views/Invoice/_partialInvItemDetailsinCNEdit.cshtml", mm);
        }

        #endregion
    }
}
