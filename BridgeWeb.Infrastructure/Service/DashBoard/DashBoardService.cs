using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.DashBoard;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.DashBoard;
using BridgeWeb.Domain.Utility;
using Intuit.Ipp.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BridgeWeb.Infrastructure.Service.DashBoard
{
    public class DashBoardService : IDashBoardService
    {
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;

        public DashBoardService(IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            _httpContextAccessor = httpContextAccessor;
            var hostName = _httpContextAccessor.HttpContext?.Request.Host.Host
                ?? throw new InvalidOperationException("HttpContext or Host is not available");

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            _bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        public async Task<T> GetAllProjectsOnDashBoardAsync<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-dashboard-header-content/{UserId}",
            });
        }

        public async Task<T> GetDashboardProjectTaskAsync<T>(long UserID, long ProjectID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-dashboard-task-list-header/{UserID}/{ProjectID}",
            });
        }
        public async Task<T> GetIndividualProjectTaskDataAsync<T>(long UserID, long ProjectID, string actionName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-individual-project-task-data/{UserID}/{ProjectID}/{actionName}",
            });
        }
        public async Task<T> GetBudgetApprovalHistoryAsync<T>(string ProjectID, string SectionID, string GroupID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-budget-approval-history/{ProjectID}/{SectionID}/{GroupID}",
            });
        }
        public async Task<T> ChangViewStatusDashboardAsync<T>(string ProjectId, string VendorId, string Number, string Mode, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/change-view-status/{ProjectId}/{VendorId}/{Number}/{Mode}/{UserId}",
            });
        }
        public async Task<T> GetIncompletePoHistoryAsync<T>(string POID, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-po-approval-history/{POID}/{UserID}",
            });
        }
        public async Task<T> GetIncompletePoOverCommitedAsync<T>(string POID, string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-po-over-commited/{POID}/{ProjectId}",
            });
        }
        public async Task<T> GetProjectUserTypeOnDashboardAsync<T>(long POItemApprovalID, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/project-user-type-on-dashboard/{POItemApprovalID}/{UserID}",
            });
        }
        public async Task<T> PostApprovePOSendToVendorDismissTaskAsync<T>(string PoIds, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/approve-po-send-to-vendor-dismiss-task/{PoIds}/{UserID}",
            });
        }

        public async Task<T> VendorMailSendDashboardAsync<T>(VendorMailSendDashboardDTO model)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = model,
                Url = _bridgeUrl + $"/api/DashboardAPI/send-vendor-mail-dashboard",
            });
        }
        public async Task<T> AcceptVendorPODashboardAsync<T>(string Poids, string Comment, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,               
                Url = _bridgeUrl + $"/api/DashboardAPI/accept-vendor-po-on-dashboard/{Poids}/{Comment}/{UserID}",
            });
        }
        public async Task<T> POCommitOnDashboardAsync<T>(string Poid, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/po-commit-on-dashboard/{Poid}/{UserID}",
            });
        }
        public async Task<T> VendorMailSendPDFASync<T>(VendorMailSendPDFDashboardDTO model)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = model,
                Url = _bridgeUrl + $"/api/DashboardAPI/vendor-mail-send-pdf-on-dashboard",
                ContentType = SD.ContentType.MultipartFormData
            });
        }

        public async Task<T> ApprovePOBatchOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/DashboardAPI/approve-po-batch-on-dashboard/{UserID}/{ManagerID}/{POID}/{Comment}",
            });
        }
        public async Task<T> PostPoApprovalFilePath<T>(RequestPoApprovalFilePathDTO req)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/DashboardAPI/po-approval-save-files",
                Data = req,
            });
        }
        public async Task<T> CheckApprovarMailSendForNextLevelAsync<T>(string POID, string UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/check-approvar-mail-send-for-next-level-dashboard/{POID}/{UserID}",
            });
        }
        public async Task<T> RejectPOOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/DashboardAPI/reject-po--on-dashboard/{UserID}/{ManagerID}/{POID}/{Comment}",
            });
        }
        public async Task<T> CommentPOOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/DashboardAPI/comment-po--on-dashboard/{UserID}/{ManagerID}/{POID}/{Comment}",
            });
        }
        public async Task<T> ApproveBudget<T>(ApproveBudgetPostDTO approveBudgetPostDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = approveBudgetPostDTO,
                Url = _bridgeUrl + $"/api/DashboardAPI/approve-budget-dashboard",
            });
        }
        public async Task<T> CompleteRejectedTaskDashboardAsync<T>(string poids, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-rejected-task-dashboard/{poids}/{UserId}",
            });
        }
        public async Task<T> CompleteRejectedBudgetTaskDashboard<T>(string budgetIds, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-rejected-budget-task-dashboard/{budgetIds}/{UserId}",
            });
        }
        public async Task<T> CompletePoCommentTaskDashboardAsync<T>(string poids, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-po-comment-dashboard/{poids}/{UserId}",
            });
        }
        public async Task<T> CompletePoAcceptTaskDashboardAsync<T>(string poids, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-po-accept-dashboard/{poids}/{UserId}",
            });
        }
        public async Task<T> CompleteChangeStatusTaskDashboardAsync<T>(string poids, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-change-fab-status-dashboard/{poids}/{UserId}",
            });
        }
        public async Task<T> CompletePoCheckBackTaskDashboardAsync<T>(string poids, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/complete-po-checkback-dashboard/{poids}/{UserId}",
            });
        }
        public async Task<T> PODetailsandFileToshow<T>(string POIDs)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-podetails-pofiles-for-download-in-dashboard/{POIDs}",
            });
        }
        public async Task<T> CheckTerms<T>(string poids)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/check-terms-in-dashboard/{poids}",
            });
        }

        public async Task<T> RejectBudget<T>(ApproveBudgetPostDTO approveBudgetPostDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = approveBudgetPostDTO,
                Url = _bridgeUrl + $"/api/DashboardAPI/reject-budget-in-dashboard",
            });
        }

        public async Task<T> GetGroupById<T>(string GroupID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-group-by-id/{GroupID}",
            });
        }
        public async Task<T> UpdatePassWord<T>(UpdatePasswordparamsDTO updatePasswordparamsDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data=updatePasswordparamsDTO,
                Url = _bridgeUrl + $"/api/HomeAPI/update-password",
            });
        }

        public async Task<T> SendMailForPOApprovalBatch_NewAsync<T>(string CurrentUrl, string TempEmailID, string USERNAME, string POS, string PROJECTNAME)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/send-mail-for-po-approval-batch-new?CurrentUrl={CurrentUrl}&TempEmailID={TempEmailID}&USERNAME={USERNAME}&POS={POS}&PROJECTNAME={PROJECTNAME}",
            });
        }
        public async Task<T> GetApprovalHistoryOnDashboard<T>(string ProjectID, string GroupID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/DashboardAPI/get-approval-history-in-dashboard/{ProjectID}/{GroupID}",
            });
        }
    }
}
