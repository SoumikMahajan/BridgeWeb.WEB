using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BridgeWeb.Domain.Model.Dto.Project;

namespace BridgeWeb.Application.Common.Interfaces.Project
{
    public interface IProjectService
    {

        #region:: Create Project
        Task<T> GetAllCountryOnProjectAsync<T>();
        Task<T> GetAllUserByTypeIdAsync<T>(string userTypeID);
        Task<T> GetProjectContactsAsync<T>();
        Task<T> GetAllStateByCountryId<T>(long countryId);
        Task<T> CreateProjectAsync<T>(ProjectCreateDto createDto);
        Task<T> UpdateFilePathAsync<T>(string projectid, string mode,string allfilename);
        Task<T> GetVendorInCreateProject<T>();
        Task<T> GetClassificationforFilter<T>();
        Task<T> POCommentinCreateProject<T>();

        #endregion

        #region:: Project List
        Task<T> GetAllProjectList<T>(ProjectTableBindDTO request);
        Task<T> DeleteProjectInProjectList<T>(long projectId);
        #endregion

        #region:: Edit Project
        Task<T> GetUserTypeNew<T>(long userId);
        Task<T> GetUserSecurityList<T>(long userId);
        Task<T> getAllUserByTypeID<T>(string userTypeId);
        Task<T> GetProjectContact<T>();
        Task<T> GetAssignProjectPermission<T>(long ProjectId, long userId);
        Task<T> GetProjectDetailsById<T>(long ProjectId);
        Task<T> GetTotalPOList<T>(long ProjectId);
        Task<T>SelectReportAccessPermisson<T>(long ProjectId);

        Task<T> GetProjectConversionRate<T>(long projectId);
        Task<T> GetProjectAccountDetails<T>(long projectId);
        Task<T> GetProjectComment<T>(long projectId);
        Task<T> GetPOFilestoShow<T>(long ProjectId);

        Task<T> GetProjectContact<T>(long projectId);
        Task<T> GetAllStates<T>();
        Task<T>GetBankAccountByProjectId<T>(long projectId);
        Task<T> GetUploadedFiles<T>(long ProjectId);

        Task<T> AddNewProjectBankAccount<T>(CreateNewProjectBankAccount createNewProjectBankAccount);

        Task<T> GetPTDPurchaseOrderList<T>(long ProjectId, DateTime FromDate, DateTime ToDate);
        Task<T>DeleteProjectAttachements<T>(string fileName, long ProjectId, string mode, long fldId );

        Task<T> GetProjectAccountDetailsByFldId<T>(long FldId);

        Task<T> UpdateProjectAccountDetails<T>(ProjectAccountUpdateDTO projectAccountUpdateDTO);
        Task<T> DeleteProjectAccount<T>(long FldId);
        Task<T> DeleteProjectBank<T>(long FldId, long ProjectId);
        Task<T> CreateProjectAccount<T>(ProjectAccountCreateDto projectAccountCreateDto);
        Task<T> DeleteprojectConversionRate<T>(long FldId);
        Task<T> AddFileInProjectEdit<T>(long ProjectId, string mode, string FileName, long UpdatedBy);

        Task<T> GetSelectedVendorInProjectEdit<T>(long ProjectId);

        Task<T> GetAllVendorListinProjectEdit<T>(long ProjectId);

        Task<T> CreateProjectCommentinEditProject<T>(long ProjectId, string comment, long CreatedBy);
        Task<T> DeleteProjectcomment<T>(long ProjectId, long CommentId);

        Task<T> UpdateProject<T>(ProjectEditUpdateDTO projectEditUpdateDTO);

        Task<T> SelectedPOFile<T>(long ProjectId, string FileName);
        Task<T> AddNewProjectConversionRate<T>(AddConversionRateDTO addConversionRateDTO);
        Task<T> GetPOInProjectEdit<T>(string VendorId, string ProjectId);
        

        #endregion

        #region :: Edit Project Contact
        Task<T> GetProjectContactDetails<T>(long ProjectId);
        Task<T> GetAllContactTypes<T>();
        Task<T> DeleteProjectContact<T>(long ProjectContactId);

        Task<T> UpdateProjectContact<T>(ProjectContactUpdateDTO projectContactUpdateDTO);
        
        #endregion

        #region:: Add Project Contact
        Task<T> CreateProjectContact<T>(ProjectContactCreateDTO projectContactCreateDTO);
        #endregion

        #region:: Project Team
        Task<T> GetProjectUserApprovalNoAsync<T>(long ProjectId);
        Task<T> GetAllProjectManagerAsync<T>(long ProjectId);
        Task<T> GetProjectTeamDetailsByProjectIdAsync<T>(long ProjectId);
        Task<T> ChangeProjectManagerAsync<T>(long ProjectId,long ManagerId, long UpdatedBy);
        Task<T> ChangeBudgetApprovalNumberAsync<T>(long ProjectId, int BudgetApproverNumber, long UpdatedBy);
        Task<T> GetTeamMemberPermissionListAsync<T>(long ProjectMemberId);
        Task<T> GetProjectUserType<T>();
        Task<T> AddDeletePOApproversAsync<T>(long ProjectId,long ProjectUserId, long flag,long UserId);
        Task<T> AddDeleteBudgetApproversAsync<T>(long ProjectId, long ProjectUserId, long flag, long UserId);
        Task<T> AddDeletePOLineItemApproverAsync<T>(long ProjectId, long ProjectUserId, long flag, long UserId);
        Task<T> DeleteProjectMemberAsync<T>(long ProjectId, long ProjectUserId, long UserId);
        Task<T> UpdateProjectTeamMembersById<T>(ProjectTeamUpdateDto projectTeamUpdateDto);
        Task<T> ProjectUserList<T>(long UserTypeId);
        Task<T> GetSystemPermissionForUserList<T>(long FldId);
        Task<T> GetProjectFabApprovalLevelAsync<T>(long ProjectId);
        Task<T> FabEditUserLevelAsync<T>(int LevelId, long ProjectUserId, int flag,long userId,long ProjectId);
        Task<T> ChangeFABApprovernumberAsync<T>(int LevelId, int number, long userId, long ProjectId);
        Task<T> FABDeleteLevelAsync<T>(int LevelId, long userId, long ProjectId);
        Task<T> AddProjectMemberFromuserList<T>(ProjectTeamMemberCreateDTO projectTeamMemberCreateDTO);
        Task<T> AddPOApprovalLevelForMember<T>(long ProjectId, long UserId);
        Task<T> AddNewfabricationLevelAsync<T>(long ProjectId, long UserId);
        Task<T> UpdateFabApprovalGroupnameAsync<T>(List<FabGroupModelDto> fabGroups, long UserId);
        Task<T> GetAllFabPathListAsync<T>(long ProjectId);
        Task<T> GetAllFabGroupOnFabPath<T>(long ProjectId);
        //Task<T> CheckIsDublicatePathNameAsync<T>(long ProjectId,string ApprovalPathName);
        Task<T> FabPathDetailsByIdAsync<T>(long ProjectId,long PathId);
        Task<T> AddFabApprovalPathAsync<T>(AddFabApprovalPathDto upsertDto);
        Task<T> DeleteFabApprovalPathAsync<T>(long ProjectId, long FabPathId, long UserId);

        Task<T> GetProjectPOApprovalLevelAsync<T>(long ProjectId);
        Task<T> CheckPoApprovalMemeberExistsInProject<T>(long ProjectId);
        Task<T> POEditUserLevelAsync<T>(int LevelId, long ProjectUserId, int flag, long userId, long ProjectId);
        Task<T> ChangePOApprovernumberAsync<T>(int LevelId, int number, long userId, long ProjectId);
        Task<T> PODeleteLevelAsync<T>(int LevelId, long userId, long ProjectId);
        Task<T> AddNewPOLevelAsync<T>(long ProjectId, long UserId);

        #endregion
    }
}
