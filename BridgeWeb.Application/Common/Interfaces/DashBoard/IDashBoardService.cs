using BridgeWeb.Domain.Model.Dto.DashBoard;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.DashBoard
{
    public interface IDashBoardService
    {
        Task<T> GetAllProjectsOnDashBoardAsync<T>(long UserId);
        Task<T> GetDashboardProjectTaskAsync<T>(long UserID,long ProjectID);
        Task<T> GetIndividualProjectTaskDataAsync<T>(long UserID, long ProjectID, string actionName);
        Task<T> GetBudgetApprovalHistoryAsync<T>(string ProjectID, string SectionID, string GroupID);
        Task<T> ChangViewStatusDashboardAsync<T>(string ProjectId, string VendorId, string Number, string Mode, long UserId);
        Task<T> GetIncompletePoHistoryAsync<T>(string POID, long UserID);
        Task<T> GetIncompletePoOverCommitedAsync<T>(string POID, string ProjectId);
        Task<T> GetProjectUserTypeOnDashboardAsync<T>(long POItemApprovalID, long UserID);
        Task<T> PostApprovePOSendToVendorDismissTaskAsync<T>(string PoIds, long UserID);
        Task<T> VendorMailSendDashboardAsync<T>(VendorMailSendDashboardDTO model);
        Task<T> AcceptVendorPODashboardAsync<T>(string Poids,string Comment, long UserID);
        Task<T> POCommitOnDashboardAsync<T>(string Poid, long UserID);
        Task<T> VendorMailSendPDFASync<T>(VendorMailSendPDFDashboardDTO model);
        Task<T> ApprovePOBatchOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment);
        Task<T> PostPoApprovalFilePath<T>(RequestPoApprovalFilePathDTO req);
        Task<T> CheckApprovarMailSendForNextLevelAsync<T>(string POID, string UserID);
        Task<T> RejectPOOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment);
        Task<T> CommentPOOnDashboard<T>(string UserID, string ManagerID, string POID, string Comment);
        Task<T> ApproveBudget<T>(ApproveBudgetPostDTO approveBudgetPostDTO);
        Task<T> CompleteRejectedTaskDashboardAsync<T>(string poids, long UserId);
        Task<T> CompletePoCommentTaskDashboardAsync<T>(string poids, long UserId);
        Task<T> CompletePoAcceptTaskDashboardAsync<T>(string poids, long UserId);
        Task<T> CompleteChangeStatusTaskDashboardAsync<T>(string poids, long UserId);
        Task<T> CompletePoCheckBackTaskDashboardAsync<T>(string poids, long UserId);
        Task<T> PODetailsandFileToshow<T>(string POIDs);
        Task<T> CheckTerms<T>(string poids);
        Task<T> RejectBudget<T>(ApproveBudgetPostDTO approveBudgetPostDTO);
        Task<T> GetGroupById<T>(string GroupID);

        // Update Password
        Task<T> UpdatePassWord<T>(UpdatePasswordparamsDTO updatePasswordparamsDTO);
        Task<T> SendMailForPOApprovalBatch_NewAsync<T>(string CurrentUrl, string TempEmailID, string USERNAME, string POS, string PROJECTNAME);
        Task<T> CompleteRejectedBudgetTaskDashboard<T>(string budgetIds,  long UserId);
        Task<T> GetApprovalHistoryOnDashboard<T>(string ProjectID, string GroupID);

    }
}
