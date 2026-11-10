using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Report;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BridgeWeb.Infrastructure.Service.Reports
{
    public class ReportService : IReportService
    {
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;
        public ReportService(IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            var hostName = httpContextAccessor.HttpContext?.Request.Host.Host
                ?? throw new InvalidOperationException("HttpContext or Host is not available"); ;

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            _bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        public async Task<T> GetFabGroupCountForProjectAsync<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-fab-group-count-for-project/" + ProjectId,
            });
        }

        public async Task<T> GETReportDesignContentAsync<T>(RptHeaderDTO rptHeaderDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = rptHeaderDTO,
                Url = _bridgeUrl + "/api/ReportsAPI/get-report-design-content",
            });
        }

        public async Task<T> GETReportDesignContentAsyncForReportWarm<T>(RptHeaderDTO rptHeaderDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = rptHeaderDTO,
                Url = _bridgeUrl + "/api/ReportsAPI/get-report-design-content-for-report-warmup",
            }, withBearer: false);
        }

        public async Task<T> GetProjectFrReportAsync<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-list-of-project-report/" + UserId,
            });
        }

        public async Task<T> GetSectionVendorFrReportAsync<T>(string ProjectIds, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-section-vendor-list-for-report/" + ProjectIds + "/" + UserId,
            });
        }

        //public async Task<T> GetApprovalTypeForReportAsync<T>()
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = _bridgeUrl + "/api/ReportsAPI/get-approval-type-for-report",
        //    });
        //}

        //public async Task<T> GetApprovalStatusForReportAsync<T>()
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = _bridgeUrl + "/api/ReportsAPI/get-approval-status-for-report",
        //    });
        //}
        //public async Task<T> GetBankAccountDetailsForReportAsync<T>()
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = _bridgeUrl + "/api/ReportsAPI/get-bank-account-details-for-report",
        //    });
        //}
        //public async Task<T> GetPaymentDetailsForReportAsync<T>()
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = _bridgeUrl + "/api/ReportsAPI/get-payment-details-for-report",
        //    });
        //}
        public async Task<T> GetParamDetailsForPOReportAsync<T>(string PurchaseOrderID, string userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-param-details-for-poreport/" + PurchaseOrderID + "/" + userId,
            });
        }
        public async Task<T> GetPoDetailsNameForPOReportAsync<T>(string PurchaseOrderID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-podetails-name-for-poreport/" + PurchaseOrderID,
            });
        }
        public async Task<T> GetDeletedPoDetailsNameForPOReportAsync<T>(string PurchaseOrderID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-deleted-podetails-name-for-poreport/" + PurchaseOrderID,
            });
        }
        public async Task<T> GetTermsAndConditionPOReportAsync<T>(string PurchaseOrderID, string Mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-terms-condition-for-poreport/" + PurchaseOrderID + "/" + Mode,
            });
        }

        //public async Task<T> GetMenuOrderReportAsync<T>(long UserId)
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = _bridgeUrl + "/api/ReportsAPI/get-menu-order-report/" + UserId,
        //    });
        //}
        public async Task<T> GetReportDataAsync<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/ReportsAPI/get-report-data-related-item-list/" + UserId,
            });
        }
    }
}
