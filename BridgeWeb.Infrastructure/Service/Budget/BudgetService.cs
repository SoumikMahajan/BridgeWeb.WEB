using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Budget;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Budget;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static System.Collections.Specialized.BitVector32;

namespace BridgeWeb.Infrastructure.Service.Budget
{
    public class BudgetService : IBudgetService
    {
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;

        public BudgetService(IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
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

        #region ::Budget Summary
        public async Task<T> GetProjectList<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/Get-All-Projects/" + UserId,
            });
        }

        public async Task<T> GetBudgetGroups<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/Get-Budget-Groups/" + ProjectId,
            });
        }

        public async Task<T> GetAllProjectSection<T>(long ProjectId, string SearchNumber, string SearchName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/BudgetAPI/Get-All-Project-Section/{ProjectId}?SearchNumber={SearchNumber}&SearchName={SearchName}",
            });
        }

        public async Task<T> GetProjectDetailsCostTotal<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/BudgetAPI/Get-Project-Details-Cost-Total/{ProjectId}",
            });
        }

        public async Task<T> GetBudgetSection<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/BudgetAPI/Get-Budget-Section/{ProjectId}",
            });
        }

        public async Task<T> GetApprovalGroupByGroupId<T>(long GroupId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/BudgetAPI/Get-Approval-Group-By-GroupId/{GroupId}",
            });
        }

        public async Task<T> RemoveSection<T>(long SectionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.DELETE,
                Url = _bridgeUrl + $"/api/BudgetAPI/Remove-Section/{SectionId}",
            });
        }

        public async Task<T> EditSection<T>(BudgetSectionEditDto budgetSectionEdit)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Data = budgetSectionEdit,
                Url = _bridgeUrl + $"/api/BudgetAPI/Edit-Section/{budgetSectionEdit.BudgetId}",
            });
        }

        public async Task<T> AddSection<T>(BudgetSectionEditDto budgetSectionEditDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = budgetSectionEditDto,
                Url = _bridgeUrl + $"/api/BudgetAPI/Add-Section",
            });
        }

        public async Task<T> AddGroup<T>(BudgetGroupAddDto groupsAddModel)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = groupsAddModel,
                Url = _bridgeUrl + $"/api/BudgetAPI/Add-Group",
            });
        }

        public async Task<T> EditGroup<T>(BudgetGroupsEditDto budgetGroupsEditDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Data = budgetGroupsEditDto,
                Url = _bridgeUrl + $"/api/BudgetAPI/Edit-Group",
            });
        }

        public async Task<T> DeleteGroup<T>(BudgetGroupsEditDto budgetGroupsEditDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.DELETE,
                Data = budgetGroupsEditDto,
                Url = _bridgeUrl + $"/api/BudgetAPI/Delete-Group",
            });
        }

        public async Task<T> SortSection<T>(SortSectionDto sortSectionDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = sortSectionDto,
                Url = _bridgeUrl + $"/api/BudgetAPI/Sort-Section",
            });
        }
        #endregion

        #region ::Budget Details
        public async Task<T> GetAllProjectNameinBudgetDetails<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,               
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-project-name/" + UserId,
            });
        }
        public async Task<T> GetAllBudgetHistory<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-history-for-budget/" + ProjectId,
            });
        }
        public async  Task<T> GetAllChangeLI<T>(long FldID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-changed-LI/" + FldID,
            });
        }
       
        public async Task<T> GetChangedBS<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-changed-bs/" + FldId,
            });
        }
        public async Task<T> GetAllProjectSection<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-Project-section-budget-details/" + ProjectId,
            });
        }
        public async Task<T> GetAllApprovalHistory<T>(string ProjectId, string SectionID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-approval-history-in-budget-section/" + ProjectId + "/" + SectionID,
            });
        }
        public async Task<T> GetAllUOMInBudgetDetails<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-UOM-in-Budget-details"
            });
        }
        public async Task<T> AddNewLineItems<T>(BRIDGE_LineITemsCreateDTO bRIDGE_LineITemsCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= bRIDGE_LineITemsCreateDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/add-new-line-items"
            });
        }
        public async Task<T> GetAllVersionNameinBudgetDetials<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-version-name-by-project-id/"+ ProjectId,
            });
        }
      
        public async Task<T> EditVersionNameInBudgetDetails<T>(long VersionId, string VersionName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/edit-version-in-budget-details/" + VersionId +"/"+ VersionName,
            });
        }
        public async Task<T> DeleteVersionInBudgetDetails<T>(long VersionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/delete-version-in-budget-details/" + VersionId ,
            });
        }
        public async Task<T> GetLineItemsinBudgetDetails<T>(long BudgetSectionId, long VersionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-lineItems-in-budget-details/" + BudgetSectionId+"/"+ VersionId,
            });
        }
        public async Task<T> UpdateAdjustInBudgetDetails<T>(long AdjustedAmount, long LineItemID, string flag, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/update-adjust-in-budget-details/" + AdjustedAmount + "/" + LineItemID +"/" + flag + "/" + UserId,
            });
        }
        public async Task<T> UpdateNote<T>(long LineItemId, string? Note)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/edit-notes-in-budget-details/" + LineItemId + "/" + Note,
            });
        }
        public async Task<T> CheckLockInBudget<T>(long ProjectId, long SectionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/check-lock-in-budget-details/" + ProjectId + "/" + SectionId,
            });
        }

        public async Task<T> CheckStatus<T>(EditStatusCheckDTO editStatusCheckDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = editStatusCheckDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/get-status-for-budget-edit"
            });
        }
        public async Task<T> UpdateLineItems<T>(LineItemsUpdateDTO lineItemsUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = lineItemsUpdateDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/edit-line-items-update-in-budget-details"
            });
        }
        public async Task<T> LockUnlockBudget<T>(LockUnlockLineItemDTO lockUnlockLineItemDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = lockUnlockLineItemDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/lock-unlock-budget"
            });
        }

        public async Task<T> GetAllLineItemsFileFromExcelAsync<T>(List<LineItemsExcelDataDTO> lineItemsColumsDtos)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = lineItemsColumsDtos,
                Url = _bridgeUrl + "/api/BudgetAPI/insert-lineitems-from-excel"
            });
        }
        public async Task<T> GetNavAndLineItems<T>(long LineItemID, long BudgetSectionID, string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
               
                Url = _bridgeUrl + "/api/BudgetAPI/get-nav-line-items/"+ LineItemID+"/"+ BudgetSectionID+"/"+ mode,
            });
        }
        public async Task<T> DeleteMultipleLineItems<T>(string LineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,

                Url = _bridgeUrl + "/api/BudgetAPI/delete-multiple-line-items/" + LineItemID ,
            });
        }
        public async Task<T> DeleteLineItems<T>(long LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,

                Url = _bridgeUrl + "/api/BudgetAPI/delete-line-items/" + LineItemId,
            });
        }
        public async Task<T> GetAllPreviousProjectSection<T>(long ProjectId, long VersionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,

                Url = _bridgeUrl + "/api/BudgetAPI/get-all-previous-section/" + ProjectId+"/"+ VersionId,
            });
        }
        public async Task<T> LockBudget<T>(LockUnlockBudgetDTO lockUnlockBudgetDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = lockUnlockBudgetDTO ,
                Url = _bridgeUrl + "/api/BudgetAPI/lock-budget-in-budget-details",
            });
        }
        public async Task<T> UnlockBudget<T>(LockUnlockBudgetDTO lockUnlockBudgetDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = lockUnlockBudgetDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/unlock-budget-in-budget-details",
            });
        }
        public async Task<T> GetAllLineItemsByProjectForExportExcelAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/export-lineitem-to-excel/" + ProjectId
            });
        }
        public async Task<T> PO_GetRequiredAndAssignedApprovers_Budget<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/po-get-required-and-assigned-approvers-budget/" + ProjectId
            });
        }

        public async Task<T> GetGroupForApprovalAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-group-for-approval/" + ProjectId
            });
        }

        public async Task<T> AddSaveAndSendFrApprvlAsync<T>(BudgetGroupSendFrAppDTO budgetGroupSendFrAppDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = budgetGroupSendFrAppDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/save-send-budget-group"
            });
        }

        public async Task<T> GetManagerForBudget<T>(long ProjectId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-manager-for-budget/" + ProjectId + "/" + UserId
            });
        }

        public async Task<T> ChangeTaxable<T>(long LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/update-taxable-for-lineItems/" + LineItemId,
            });
        }

        public async Task<T> ChangeSpacing<T>(long LineItemId, long Spacing, long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + "/api/BudgetAPI/update-spacing-for-lineItems/" + LineItemId + "/" + Spacing + "/" + userId,
            });
        }

        public async Task<T> GetProjectSectionForCopyBudget<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/BudgetAPI/get-all-project-section-for-copy-budget/" + ProjectId,
            });
        }
        public async Task<T> CopyBudget<T>(CopyBudgetDTO copyBudgetDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= copyBudgetDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/copy-budget",
            });
        }
        public async Task<T> GetApprovalStatusForSentBudget<T>(long ProjectId, long SectionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
              
                Url = _bridgeUrl + "/api/BudgetAPI/get-approval-status-for-sent-budget/"+ProjectId +"/"+SectionId,
            });
        }
        public async Task<T> NewSortLineItemForShift<T>(NewsortlineitemsForShiftDTO newsortlineitemsForShiftDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= newsortlineitemsForShiftDTO,
                Url = _bridgeUrl + "/api/BudgetAPI/new-sort-line-items-for-shift",
            });
        }
        public async Task<T> GetApprovalStatus<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,

                Url = _bridgeUrl + "/api/BudgetAPI/get-approval-status/" + ProjectId ,
            });
        }
        #endregion
    }
}
