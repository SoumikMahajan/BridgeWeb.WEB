using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Invoice;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Invoice;
using BridgeWeb.Domain.Model.Dto.Vendor;
using BridgeWeb.Domain.Utility;
using Intuit.Ipp.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BridgeWeb.Infrastructure.Service.Invoice
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IHttpClientFactory _clientFactory;
        private string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;
        public InvoiceService(IHttpClientFactory clientFactory, IBaseService baseService, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _baseService = baseService;
            _httpContextAccessor = httpContextAccessor;
            var hostName = _httpContextAccessor.HttpContext?.Request.Host.Host
                 ?? throw new InvalidOperationException("HttpContext or Host is not available");

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        #region :: Enter Invoice
        public async Task<T> GetAllparentVendorListInEnterInvoice<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-parent-vendor-enter-invoice",
            });
        }

        public async Task<T> GetAllProjectList<T>(string VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-all-project-list-enter-invoice/{VendorId}",
            });
        }

        public async Task<T> GetVendorTerms<T>(string VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-term-based-on-vendorid/{VendorId}",
            });
        }
        public async Task<T> GetProjectAccountBasedOnProject<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-project-acount-enter-invoice/{ProjectId}",
            });
        }
        public async Task<T> GetPOSelector<T>(string VendorId, string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-selector/{VendorId}/{ProjectId}",
            });
        }

        public async Task<T> GetVendorAddressEnterInvoice<T>(string VendorId,string UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-vendor-address-enter-invoice/{VendorId}/{UserId}",
            });
        }

        public async Task<T> GetPOLineItemSelectorBasedOnPO<T>(string poids)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-lineitem-selector-based-on-po/{poids}",
            });
        }

        public async Task<T> GetInvoiceDataforSelectedPOLI<T>(string poids)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-data-for-selected-poli/{poids}",
            });
        }
        public async Task<T> AddNewTerms<T>(TermsManagementDTO termsManagementDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = termsManagementDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/add-new-vendor-terms",
            });
        }

        public async Task<T> GetPreviousInvoice<T>(string POLIId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-previous-invoices/{POLIId}",
            });
        }

        public async Task<T> SaveInvoice<T>(SaveInvoiceDTO saveInvoiceDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = saveInvoiceDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/save-invoice",
            });
        }
        public async Task<T> SaveBulkInvoiceItems<T>(List<InvoiceItemsCreateInvoiceEntryDTO> InvoiceItemsCreateInvoiceEntryDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = InvoiceItemsCreateInvoiceEntryDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/create-invoice-items",
            });
        }

        #endregion

        #region ::Invoice Search
        public async Task<T> GetAllParentVendor<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-parent-vendor",
            });
        }
        public async Task<T> GetAllProjectNameInvoice<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-project-name-in-invoice/" + UserId,
            });
        }
        public async Task<T> GetProjectNameWithVendor<T>(VendorIdDTO vendorIdDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data= vendorIdDTO,
                Url = bridgeUrl + "/api/InvoiceAPI/get-project-name-with-selected-vendor-id",
            });

        }
        public async Task<T> GetInvoiceSearcList<T>(InvoiceListDataGetDTO invoiceListDataGetDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = invoiceListDataGetDTO,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-invoice-on-search"
            });
        }

        #endregion

        #region :: Payment Search
        public async Task<T> GetAllVendorList<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-parent-vendor-for-payment"
            });
        }
        public async Task<T> GetPaymentSearchAdvance<T>(PaymentSearchDTO paymentSearchDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = paymentSearchDTO,
                Url = bridgeUrl + "/api/InvoiceAPI/get-payment-details-advanced"
            });
        }

        public async Task<T> GetPaymentType<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-payment-type-manual-search"
            });
        }
        public async Task<T> GetBankAccountsInManualSearch<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-bank-accounts-manual-search"
            });
        }

        public async Task<T> GetPaymentSearchAdvanceOnRedirect<T>(string PaymentNumber)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payment-details-advanced-on-page-redirect/{PaymentNumber}"
            });
        }
        public async Task<T> GetPaymentDetailsByPaymentId<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payment-details-by-paymentid/{PaymentId}"
            });
        }
        public async Task<T> GetBankAccountDetailsBasedOnProject<T>(string ManualPaymentID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-bank-account-based-on-project/{ManualPaymentID}"
            });
        }
        public async Task<T> GetPaymentItemDetails<T>(string ManualPaymentID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payement-items/{ManualPaymentID}"
            });
        }
        public async Task<T> GetPaymentHistory<T>(long ManualPaymentID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/view-history-payment-item?PaymentID={ManualPaymentID}"
            });
        }
        public async Task<T> GetPaymentUpdateDetails<T>(string FLDId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payment-change-details/{FLDId}"
            });
        }
        public async Task<T> GetItemUpdateDetails<T>(string FLDId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-item-changed-details/{FLDId}"
            });
        }

        public async Task<T> VoidPayment<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + $"/api/InvoiceAPI/void-payment-details/{PaymentId}"
            });
        }

        public async Task<T> ReversePayment<T>(string PaymentId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + $"/api/InvoiceAPI/reverse-payment/{PaymentId}/{UserId}"
            });
        }

        public async Task<T> UpdatePaymentMainDetails<T>(ManualPaymentUpdateDTO manualPaymentUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = manualPaymentUpdateDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/update-payment-main-details"
            });
        }

        public async Task<T> UpdatePaymentItemDetails<T>(List<ManualPaymentItemsUpdateDTO> manualPaymentItemsUpdateDTOs, string UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = manualPaymentItemsUpdateDTOs,
                Url = bridgeUrl + $"/api/InvoiceAPI/update-payment-item-details/{UserID}"
            });
        }

        public async Task<T> DeletePayment<T>(string PaymentId, long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + $"/api/InvoiceAPI/delete-payment/{PaymentId}/{userId}"
            });
        }

        public async Task<T> GetInvoiceDetails<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-details/{PaymentId}"
            });
        }

        public async Task<T> GetPaymentItemDetailsByPaymentId<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payment-item-details-by-paymentid/{PaymentId}"
            });
        }
        
        public async Task<T> PopulateBankAccount<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/populate-bank-account/{PaymentId}"
            });
        }
        
        public async Task<T> GetAllInvoiceAccounts<T>(string InvoiceId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-all-invoice-accounts/{InvoiceId}"
            });
        }


        #endregion

        #region :: Enter Invoice without Items

        public async Task<T> GetVendorListInvoiceTax<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-vendor-list-enter-invoice-without-items",
            });
        }

        public async Task<T> GetProjectList_Tax<T>(string VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-projectlist-inv-tax/{VendorId}",
            });
        }

        public async Task<T> GetPOSelector_Tax<T>(string VendorId, string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-selector-invoice-without-items/{VendorId}/{ProjectId}",
            });
        }
        public async Task<T> SaveInvoiceWihtoutItems_Tax<T>(SaveInvoiceDTO saveInvoiceDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = saveInvoiceDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/save-invoice-without-items-tax",
            });
        }

        #endregion

        #region :: Enter Credit Note
        public async Task<T> VendorListinCN<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-vendor-in-credit-note"
            });
        }

        public async Task<T> ProjectDDinCN<T>(string VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-project-list-credit-note/{VendorId}"
            });
        }

        public async Task<T> GetProjectAccountinCN<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-project-account-credit-note/{ProjectId}"
            });
        }

        public async Task<T> GetPOSelectorinCN<T>(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = getPOInCreditNoteParamsDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-in-credit-note"
            });
        }

        public async Task<T> GetPOItemsinCN<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-items-in-cn/{POID}"
            });
        }

        public async Task<T> GetItemDetailsinCN<T>(string POLIIDS)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-items-in-cn/{POLIIDS}"
            });
        }
        public async Task<T> GetItemDetailsonSaveinCN<T>(string POLIDS)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-items-on-save-invoice-in-cn/{POLIDS}"
            });
        }

        public async Task<T> InsertInvoiceinCN<T>(SaveInvoiceDTO saveInvoiceDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = saveInvoiceDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/insert-invoice-in-cn"
            });
        }
        public async Task<T> InsertInvoiceItemsinCN<T>(List<InvoiceItemsInCN> invoiceItemsInCNs)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = invoiceItemsInCNs,
                Url = bridgeUrl + $"/api/InvoiceAPI/insert-invoice-items-in-cn"
            });
        }
        public async Task<T> UpdatePOLineItemsinCN<T>(List<UpdatePOLineIteminCNDTO> updatePOLineIteminCNDTOs)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updatePOLineIteminCNDTOs,
                Url = bridgeUrl + $"/api/InvoiceAPI/update-poli-in-cn"
            });
        }
        #endregion

        #region ::Manual Payment
        public async Task<T> GetProjectListinMP<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-project-name-in-mp"
            });
        }

        public async Task<T> GetAllPaymentType<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/InvoiceAPI/get-all-payment-type"
            });
        }

        public async Task<T> GetCurrency<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-currency-based-on-project/{ProjectId}"
            });
        }

        public async Task<T> GetProjectAccountinMP<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-all-project-account-in-mp/{ProjectId}"
            });
        }

        public async Task<T> GetLastPaymentType<T>(string BankAccount)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-last-payment-mode/{BankAccount}"
            });

        }

        public async Task<T> GetPaymentNumberForALl<T>(string PaymentType, string BankAccountId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-payment-number-for-all/{PaymentType}/{BankAccountId}"
            });
        }

        public async Task<T> GetAllInvoiceListinMP<T>(string ProjectId, string Currcode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-all-invoice-list-by-vendor2/{ProjectId}/{Currcode}"
            });
        }

        public async Task<T> CheckItemStatusMP<T>(string InvoiceNumber)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/check-invoice-status-mp/{InvoiceNumber}"
            });

        }

        public async Task<T> CheckPaymentNumberMP<T>(string PaymentNumber, string PaymentType, string BankAccountID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/check-payment-number-mp/{PaymentNumber}/{PaymentType}/{BankAccountID}"
            });
        }

        public async Task<T> SaveManualPayment<T>(ManualPaymentSaveDTO manualPaymentSaveDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = manualPaymentSaveDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/save-manual-payment"
            });
        }

        public async Task<T> SaveManualPaymentItem<T>(ManualPaymentItemSaveDTO manualPaymentItemSaveDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = manualPaymentItemSaveDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/save-manual-payement-items"
            });
        }

        public async Task<T> GetBankAccountByManuelPaymentId<T>(string ManualPaymentID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/InvoiceAPI/get-bank-account-based-on-project/{ManualPaymentID}"
            });
        }
        
        public async Task<T> GetManualPaymentByPaymentId<T>(string ManualPaymentID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/InvoiceAPI/get-manual-payment-by-payment-id/{ManualPaymentID}"
            });
        }

        public async Task<T> GetInvoiceAccountForQBO<T>(string InvoiceID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/InvoiceAPI/get-invoice-account-for-qbo/{InvoiceID}"
            });
        }

        public async Task<T> CheckInvoiceAccount<T>(string AccountID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/InvoiceAPI/check-invoice-account/{AccountID}"
            });
        }

        public async Task<T> GetParentVendorDetails<T>(string Name, string Currency)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/InvoiceAPI/get-parent-vendor-details/{Name}/{Currency}"
            });
        }

        #endregion

        #region ::Invoice Edit
        public async Task<T> GetInvoiceEditDetials<T>(string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-all-invoice-details-for-invoice-edit/{invoiceid}"
            });
        }
        public async Task<T> GetPOSelectorInvEdit<T>(string VendorId, string ProjectId, string InvoiceId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-selector-inv-edit/{VendorId}/{ProjectId}/{InvoiceId}"
            });
        }

        public async Task<T> GetPOLISelectorInvEdit<T>(string poids, string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-li-selector-inv-edit/{poids}/{invoiceid}"
            });
        }

        public async Task<T> GetInvoiceItemonPageLoad<T>(string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-items-inv-edit/{invoiceid}"
            });
        }

        public async Task<T> GetInvoceItemsonClick<T>(string poli, string invoiceid) {

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-items-on-click/{poli}/{invoiceid}"
            });
        }
        public async Task<T> CheckInvoiceVoidPayment<T>(string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/check-void-payment/{invoiceid}"
            });
        }

        public async Task<T> IsInvoiceTax<T>(string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/is-invoice-tax/{invoiceid}"
            });
        }
        public async Task<T> UpdateInvoice<T>(UpdateInvoiceDTO updateInvoiceDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= updateInvoiceDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/update-invoice"
            });
        }

        public async Task<T> VoidInvoice<T>(string InvoiceId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + $"/api/InvoiceAPI/void-invoice/{InvoiceId}/{UserId}"
            });
        }
        public async Task<T> DeleteInvoice<T>(string InvoiceId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + $"/api/InvoiceAPI/delete-invoice/{InvoiceId}/{UserId}"
            });
        }

        #endregion

        #region :: Edit Credit Note
        public async Task<T> GetCreditNote<T>(string invoiceid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-credit-note/{invoiceid}"
            });
        }

        public async Task<T> UpdateCreditNote<T>(CreditNoteUpdateDTO creditNoteUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= creditNoteUpdateDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/update-creditnote"
            });
        }
        public async Task<T> GetPOItemsinCNEdit<T>(string POID,string InvoiceId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-items-in-cn-edit/{POID}/{InvoiceId}"
            });
        }
        public async Task<T> GetInvoiceItemInCNEdit<T>(string POLIID, string InvoiceId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-invoice-items-in-cn-edit/{POLIID}/{InvoiceId}"
            });
        }

        public async Task<T> GetPOSelectorinCNEdit<T>(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = getPOInCreditNoteParamsDTO,
                Url = bridgeUrl + $"/api/InvoiceAPI/get-po-in-credit-note-edit"
            });
        }

        #endregion
    }
}
