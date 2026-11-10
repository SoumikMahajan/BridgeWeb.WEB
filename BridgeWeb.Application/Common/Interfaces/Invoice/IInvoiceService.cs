using BridgeWeb.Domain.Model.Dto.Invoice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.Invoice
{
    public interface IInvoiceService
    {
        #region ::Enter Invoice
        Task<T> GetAllparentVendorListInEnterInvoice<T>();
        Task<T> GetAllProjectList<T>(string VendorId);
        Task<T> GetVendorTerms<T>(string VendorId);
        Task<T> GetProjectAccountBasedOnProject<T>(string ProjectId);
        Task<T> GetPOSelector<T>(string VendorId, string ProjectId);
        Task<T> GetVendorAddressEnterInvoice<T>(string VendorId,string UserId);
        Task<T> GetPOLineItemSelectorBasedOnPO<T>(string poids);
        Task<T> GetInvoiceDataforSelectedPOLI<T>(string poids);
        Task<T> AddNewTerms<T>(TermsManagementDTO termsManagementDTO);
        Task<T> GetPreviousInvoice<T>(string POLIId);
        Task<T> SaveInvoice<T>(SaveInvoiceDTO saveInvoiceDTO);
        Task<T> SaveBulkInvoiceItems<T>(List<InvoiceItemsCreateInvoiceEntryDTO> InvoiceItemsCreateInvoiceEntryDTO);

        #endregion

        #region :: Invoice Search
        Task<T> GetAllParentVendor<T>();
        Task<T> GetAllProjectNameInvoice<T>(long UserId);
        Task<T> GetProjectNameWithVendor<T>(VendorIdDTO vendorIdDTO);
        Task<T> GetInvoiceSearcList<T>(InvoiceListDataGetDTO invoiceListDataGetDTO);

        #endregion

        #region :: Payment Search
        Task<T> GetAllVendorList<T>();
        Task<T> GetPaymentSearchAdvance<T>(PaymentSearchDTO paymentSearchDTO);
        Task<T> GetPaymentType<T>();
        Task<T> GetBankAccountsInManualSearch<T>();
        Task<T> GetPaymentSearchAdvanceOnRedirect<T>(string PaymentNumber);
        Task<T> GetPaymentDetailsByPaymentId<T>(string PaymentId);
        Task<T> GetBankAccountDetailsBasedOnProject<T>(string ManualPaymentID);
        Task<T> GetPaymentItemDetails<T>(string ManualPaymentID);
        Task<T> GetPaymentHistory<T>(long ManualPaymentID);
        Task<T> GetPaymentUpdateDetails<T>(string FLDId);
        Task<T> GetItemUpdateDetails<T>(string FLDId);
        Task<T> VoidPayment<T>(string PaymentId);
        Task<T> ReversePayment<T>(string PaymentId, long UserId);
        Task<T> UpdatePaymentMainDetails<T>(ManualPaymentUpdateDTO manualPaymentUpdateDTO);
        Task<T> UpdatePaymentItemDetails<T>(List<ManualPaymentItemsUpdateDTO> manualPaymentItemsUpdateDTOs, string UserID);
        Task<T> DeletePayment<T>(string PaymentId, long userId);
        Task<T> GetInvoiceDetails<T>(string PaymentId);
        Task<T> GetPaymentItemDetailsByPaymentId<T>(string PaymentId);
        Task<T> PopulateBankAccount<T>(string PaymentId);

        #endregion

        #region :: Enter Invoice Without items
        Task<T> GetVendorListInvoiceTax<T>();
        Task<T> GetProjectList_Tax<T>(string VendorId);
        Task<T> GetPOSelector_Tax<T>(string VendorId, string ProjectId);
        Task<T> SaveInvoiceWihtoutItems_Tax<T>(SaveInvoiceDTO saveInvoiceDTO);

        #endregion

        #region :: Enter Credit Note
        Task<T> VendorListinCN<T>();
        Task<T> ProjectDDinCN<T>(string VendorId);
        Task<T> GetProjectAccountinCN<T>(string ProjectId);
        Task<T> GetPOSelectorinCN<T>(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO);
        Task<T> GetPOItemsinCN<T>(string POID);
        Task<T> GetItemDetailsinCN<T>(string POLIIDS);
        Task<T> GetItemDetailsonSaveinCN<T>(string POLIDS);
        Task<T> InsertInvoiceinCN<T>(SaveInvoiceDTO saveInvoiceDTO);
        Task<T> InsertInvoiceItemsinCN<T>(List<InvoiceItemsInCN> invoiceItemsInCNs);
        Task<T> UpdatePOLineItemsinCN<T>(List<UpdatePOLineIteminCNDTO> updatePOLineIteminCNDTOs);

        #endregion

        #region :: Manual Payment

        Task<T> GetProjectListinMP<T>();
        Task<T> GetAllPaymentType<T>();
        Task<T> GetCurrency<T>(string ProjectId);
        Task<T> GetProjectAccountinMP<T>(string ProjectId);
        Task<T> GetLastPaymentType<T>(string BankAccount);
        Task<T> GetPaymentNumberForALl<T>(string PaymentType, string BankAccountId);
        Task<T> GetAllInvoiceListinMP<T>(string ProjectId, string Currcode);
        Task<T> CheckItemStatusMP<T>(string InvoiceNumber);
        Task<T> CheckPaymentNumberMP<T>(string PaymentNumber, string PaymentType, string BankAccountID);
        Task<T> SaveManualPayment<T>(ManualPaymentSaveDTO manualPaymentSaveDTO);
        Task<T> SaveManualPaymentItem<T>(ManualPaymentItemSaveDTO manualPaymentItemSaveDTO);
        Task<T> GetBankAccountByManuelPaymentId<T>(string ManualPaymentID);
        Task<T> GetManualPaymentByPaymentId<T>(string ManualPaymentID);
        Task<T> GetInvoiceAccountForQBO<T>(string InvoiceID);
        Task<T> CheckInvoiceAccount<T>(string AccountID);
        Task<T> GetParentVendorDetails<T>(string Name, string Currency);
        Task<T> GetAllInvoiceAccounts<T>(string InvoiceId);

        #endregion

        #region :: Invoice Edit
        Task<T> GetInvoiceEditDetials<T>(string invoiceid);
        Task<T> GetPOSelectorInvEdit<T>(string VendorId, string ProjectId,string InvoiceId);
        Task<T> GetPOLISelectorInvEdit<T>(string poids, string invoiceid);
        Task<T>GetInvoiceItemonPageLoad<T>(string invoiceid);
        Task<T> GetInvoceItemsonClick<T>(string poli, string invoiceid);
        Task<T> CheckInvoiceVoidPayment<T>(string invoiceid);
        Task<T>IsInvoiceTax<T>(string invoiceid);
        Task<T> UpdateInvoice<T>(UpdateInvoiceDTO updateInvoiceDTO);
        Task<T> VoidInvoice<T>(string InvoiceId, long UserId);
        Task<T> DeleteInvoice<T>(string InvoiceId,long UserId);


        #endregion

        #region :: Credit Note Edit

        Task<T> GetCreditNote<T>(string invoiceid);
        Task<T> UpdateCreditNote<T>(CreditNoteUpdateDTO creditNoteUpdateDTO);
        Task<T> GetPOItemsinCNEdit<T>(string POID, string InvoiceId);
        Task<T> GetInvoiceItemInCNEdit<T>(string POLIID, string InvoiceId);
        Task<T> GetPOSelectorinCNEdit<T>(GetPOInCreditNoteParamsDTO getPOInCreditNoteParamsDTO);

        #endregion
    }
}
