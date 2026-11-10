using BridgeWeb.Domain.Model.Dto.Budget;
using Intuit.Ipp.Data;

namespace BridgeWeb.Application.Common.Interfaces.Budget
{
    public interface IBudgetService
    {
        #region ::Budget Summary
        Task<T> AddGroup<T>(BudgetGroupAddDto groupsAddModel);
        Task<T> AddSection<T>(BudgetSectionEditDto budgetSectionEditDto);
        Task<T> DeleteGroup<T>(BudgetGroupsEditDto budgetGroupsEditDto);
        Task<T> EditGroup<T>(BudgetGroupsEditDto budgetGroupsEditDto);
        Task<T> EditSection<T>(BudgetSectionEditDto budgetSectionEdit);
        Task<T> GetAllProjectSection<T>(long ProjectId, string SearchNumber, string SearchName);
        Task<T> GetApprovalGroupByGroupId<T>(long GroupId);
        Task<T> GetBudgetGroups<T>(long ProjectId);
        Task<T> GetBudgetSection<T>(long ProjectId);
        Task<T> GetProjectDetailsCostTotal<T>(long ProjectId);
        Task<T> GetProjectList<T>(long UserId);
        Task<T> RemoveSection<T>(long SectionId);
        Task<T> SortSection<T>(SortSectionDto sortSectionDto);
        #endregion

        #region ::Budget Details
        Task<T> GetAllProjectNameinBudgetDetails<T>(long UserId);
        Task<T> GetAllBudgetHistory<T>(long ProjectId);

        Task<T> GetAllChangeLI<T>(long FldID);
        Task<T> GetAllProjectSection<T>(long ProjectId);

        Task<T> GetAllApprovalHistory<T>(string ProjectId, string SectionID);

        Task<T> GetChangedBS<T>(long FldId);

        Task<T>GetAllUOMInBudgetDetails<T>();
        Task<T> AddNewLineItems<T>(BRIDGE_LineITemsCreateDTO bRIDGE_LineITemsCreateDTO);
        Task<T>GetAllVersionNameinBudgetDetials<T>(long ProjectId);
        Task<T> EditVersionNameInBudgetDetails<T>(long VersionId, string VersionName);
        Task<T> DeleteVersionInBudgetDetails<T>(long VersionId);

        Task<T> GetLineItemsinBudgetDetails<T>(long BudgetSectionId, long VersionId);
        Task<T> UpdateAdjustInBudgetDetails<T>(long AdjustedAmount, long LineItemID,string flag, long UserId);
        Task<T> UpdateNote<T>(long LineItemId, string? Note);
        Task<T> CheckLockInBudget<T>(long ProjectId, long SectionId);
        Task<T> CheckStatus<T>(EditStatusCheckDTO editStatusCheckDTO);
        Task<T>UpdateLineItems<T>(LineItemsUpdateDTO lineItemsUpdateDTO);
        Task<T> LockUnlockBudget<T>(LockUnlockLineItemDTO lockUnlockLineItemDTO);
        Task<T> GetAllLineItemsFileFromExcelAsync<T>(List<LineItemsExcelDataDTO> lineItemsColumsDtos);
        Task<T> GetNavAndLineItems<T>(long LineItemID, long BudgetSectionID, string mode);
        Task<T> DeleteMultipleLineItems<T>(string LineItemID);
        Task<T> DeleteLineItems<T>(long LineItemId);
        Task<T> GetAllPreviousProjectSection<T>(long ProjectId, long VersionId);
        Task<T>LockBudget<T>(LockUnlockBudgetDTO lockUnlockBudgetDTO);
        Task<T> UnlockBudget<T>(LockUnlockBudgetDTO lockUnlockBudgetDTO);
        Task<T> GetAllLineItemsByProjectForExportExcelAsync<T>(long ProjectId);
        Task<T> PO_GetRequiredAndAssignedApprovers_Budget<T>(long ProjectId);
        Task<T> GetGroupForApprovalAsync<T>(long ProjectId);
        Task<T> AddSaveAndSendFrApprvlAsync<T>(BudgetGroupSendFrAppDTO budgetGroupSendFrAppDTO);
        Task<T> GetManagerForBudget<T>(long ProjectId, long UserId);
        Task<T> ChangeTaxable<T>(long LineItemId);
        Task<T> ChangeSpacing<T>(long LineItemId, long Spacing, long userId);
        Task<T> GetProjectSectionForCopyBudget<T>(long ProjectId);

        Task<T> CopyBudget<T>(CopyBudgetDTO copyBudgetDTO);
        Task<T> GetApprovalStatusForSentBudget<T>(long ProjectId, long SectionId);
        Task<T> NewSortLineItemForShift<T>(NewsortlineitemsForShiftDTO newsortlineitemsForShiftDTO);
        Task<T> GetApprovalStatus<T>(long ProjectId);
        #endregion
    }
}
