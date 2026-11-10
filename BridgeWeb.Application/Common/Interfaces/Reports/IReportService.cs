using BridgeWeb.Domain.Model.Dto.Report;

namespace BridgeWeb.Application.Common.Interfaces.Reports
{
    public interface IReportService
    {
        Task<T> GetFabGroupCountForProjectAsync<T>(string ProjectId);
        Task<T> GETReportDesignContentAsync<T>(RptHeaderDTO rptHeaderDTO);
        Task<T> GETReportDesignContentAsyncForReportWarm<T>(RptHeaderDTO rptHeaderDTO);
        Task<T> GetProjectFrReportAsync<T>(long UserId);
        Task<T> GetSectionVendorFrReportAsync<T>(string ProjectIds, long UserId);
        //Task<T> GetApprovalTypeForReportAsync<T>();
        //Task<T> GetApprovalStatusForReportAsync<T>();
        //Task<T> GetBankAccountDetailsForReportAsync<T>();
        //Task<T> GetPaymentDetailsForReportAsync<T>();
        Task<T> GetParamDetailsForPOReportAsync<T>(string PurchaseOrderID, string userId);
        Task<T> GetPoDetailsNameForPOReportAsync<T>(string PurchaseOrderID);
        Task<T> GetDeletedPoDetailsNameForPOReportAsync<T>(string PurchaseOrderID);
        Task<T> GetTermsAndConditionPOReportAsync<T>(string PurchaseOrderID,string Mode);
        //Task<T> GetMenuOrderReportAsync<T>(long UserId);
        Task<T> GetReportDataAsync<T>(long UserId);

    }
}
