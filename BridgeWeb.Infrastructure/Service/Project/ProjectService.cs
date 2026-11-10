using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Project;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Project;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BridgeWeb.Infrastructure.Service.Project
{
    public class ProjectService : IProjectService
    {
        private readonly IHttpClientFactory _clientFactory;
        private string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;

        public ProjectService(IHttpClientFactory clientFactory, IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            _clientFactory = clientFactory;            
            _httpContextAccessor = httpContextAccessor;
            var hostName = _httpContextAccessor.HttpContext?.Request.Host.Host
                 ?? throw new InvalidOperationException("HttpContext or Host is not available"); ;

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        #region:: Create Project

        public async Task<T> GetAllCountryOnProjectAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-country-on-project",
            });
        }

        public async Task<T> GetAllUserByTypeIdAsync<T>(string userTypeID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-user-by-typeid/" + userTypeID,
            });
        }

        public async Task<T> GetProjectContactsAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-contacts",
            });
        }

        public async Task<T> GetAllStateByCountryId<T>(long countryId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-states-by-countryid-on-project-page/" + countryId,
            });
        }
        public async Task<T> GetVendorInCreateProject<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-vendor-details-for-project-creation"
            });
        }
        public async Task<T> GetClassificationforFilter<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-classificationlist-for-filter-dropdown"
            });
        }
        public async Task<T> POCommentinCreateProject<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-po-comments-for-create-project"
            });
        }

        public async Task<T> CreateProjectAsync<T>(ProjectCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/ProjectAPI/create-new-project",
            });
        }
        public async Task<T> UpdateFilePathAsync<T>(string projectid, string mode, string allfilename)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/upload-project-files/" + projectid + "/" + mode + "/" + allfilename,
            });
        }


        #endregion

        #region:: Project List
        public async Task<T> GetAllProjectList<T>(ProjectTableBindDTO request)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-project-list/",
                Data = request
            });
        }
        public async Task<T> DeleteProjectInProjectList<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/delete-project-list-by-id/" + projectId
            });
        }


        #endregion

        #region:: Edit Project
        public async Task<T> GetUserTypeNew<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-userTypeId-by-userId/" + userId

            });
        }
        public async Task<T> GetUserSecurityList<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-User-Security-List/" + userId

            });
        }
        public async Task<T> getAllUserByTypeID<T>(string userTypeId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-user-by-type-id-inProjectEdit/" + userTypeId

            });
        }

        public async Task<T> GetProjectContact<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-contact"

            });
        }
        public async Task<T> GetAssignProjectPermission<T>(long ProjectId, long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-report-access-permission-ByProject/" + ProjectId + "/" + userId
            });
        }
        public async Task<T> GetProjectDetailsById<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-projectDetails/" + projectId
            });
        }
        public async Task<T> GetTotalPOList<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/total-PO-list/" + ProjectId
            });
        }
        public async Task<T> SelectReportAccessPermisson<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/select-report-access-permission/" + ProjectId

            });
        }
        public async Task<T> GetProjectConversionRate<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-currency-rate-conversion/" + projectId
            });
        }
        public async Task<T> GetProjectAccountDetails<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-account-details/" + projectId
            });
        }
        public async Task<T> GetProjectComment<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-projects-comments/" + projectId
            });
        }
        public async Task<T> GetPOFilestoShow<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-files-to-include/" + ProjectId
            });
        }
        public async Task<T> GetProjectContact<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-contact-details/" + projectId
            });
        }
        public async Task<T> GetAllStates<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-state"
            });
        }
        public async Task<T> GetBankAccountByProjectId<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-bank-accountdetails-by-ProjectId/" + projectId
            });
        }
        public async Task<T> GetUploadedFiles<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-files-to-include/" + ProjectId
            });
        }
        public async Task<T> AddNewProjectBankAccount<T>(CreateNewProjectBankAccount createNewProjectBankAccount)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createNewProjectBankAccount,

                Url = bridgeUrl + "/api/ProjectAPI/add-new-account-in-ProjectEdit"
            });
        }
        public async Task<T> DeleteProjectAttachements<T>(string fileName, long ProjectId, string mode, long fldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/delete-project-files/" + fileName + "/" + ProjectId + "/" + mode + "/" + fldId,
            });

        }
        public async Task<T> GetProjectAccountDetailsByFldId<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,


                Url = bridgeUrl + "/api/ProjectAPI/get-Project-account-by-fldId/" + FldId
            });
        }
        public async Task<T> UpdateProjectAccountDetails<T>(ProjectAccountUpdateDTO projectAccountUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,

                Data=projectAccountUpdateDTO,   
                Url = bridgeUrl + "/api/ProjectAPI/update-project-account-details"
            });
        }

        public async Task<T> DeleteProjectAccount<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/delete-project-account/" + FldId
            });
        }
        public async Task<T> DeleteProjectBank<T>(long FldId,long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/ProjectAPI/delete-project-bank?FldId={FldId}&ProjectId={ProjectId}"
            });
        }
        public async Task<T> CreateProjectAccount<T>(ProjectAccountCreateDto projectAccountCreateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = projectAccountCreateDto,

                Url = bridgeUrl + "/api/ProjectAPI/create-project-account"
            });
        }
        public async Task<T> DeleteprojectConversionRate<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/delete-project-conversion-rate/" + FldId
            });

        }
        public async Task<T> UpdateProjectTeamMembersById<T>(ProjectTeamUpdateDto projectTeamUpdateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = projectTeamUpdateDto,

                Url = bridgeUrl + "/api/ProjectAPI/update-project-team-member"
            });
        }
        public async Task<T> AddFileInProjectEdit<T>(long ProjectId, string mode, string FileName, long UpdatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/update-file-in-project-edit/" + ProjectId + "/" + mode + "/" + FileName + "/" + UpdatedBy,
            });
        }
        public async Task<T> GetSelectedVendorInProjectEdit<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,


                Url = bridgeUrl + "/api/ProjectAPI/get-selected-vendors-in-edit-Project/" + ProjectId,
            });
        }
        public async Task<T> GetAllVendorListinProjectEdit<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,


                Url = bridgeUrl + "/api/ProjectAPI/get-all-vendors-in-edit-project/"+ ProjectId
            });

        }
        public async Task<T> CreateProjectCommentinEditProject<T>(long ProjectId, string comment, long CreatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/Add-project-comment/" + ProjectId+"/"+comment+"/"+CreatedBy,
            });
        }
        public async Task<T> DeleteProjectcomment<T>(long ProjectId, long CommentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,


                Url = bridgeUrl + "/api/ProjectAPI/delete-project-comment/" + ProjectId + "/" + CommentId,
            });
        }
        public async Task<T> UpdateProject<T>(ProjectEditUpdateDTO projectEditUpdateDTO)
        {  
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= projectEditUpdateDTO,
               Url = bridgeUrl + "/api/ProjectAPI/update-project",
            });
        }
        public async Task<T> SelectedPOFile<T>(long ProjectId, string FileName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/select-pofiles-exists/"+ ProjectId+"/"+ FileName,
            });
        }
        public async Task<T> AddNewProjectConversionRate<T>(AddConversionRateDTO addConversionRateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= addConversionRateDTO,
                Url = bridgeUrl + "/api/ProjectAPI/add-new-project-conversion-rate",
            });
        }
        public async Task<T> GetPOInProjectEdit<T>(string VendorId, string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + $"/api/ProjectAPI/get-po-from-project-page/{VendorId}/{ProjectId}",
            });

        }
        #endregion

        #region ::Edit Project Contact
        public async Task<T> GetProjectContactDetails<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-Contact-Id/" + ProjectId
            });
        }
        public async Task<T> GetAllContactTypes<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-contact-types-in-project"
            });
        }
        public async Task<T> DeleteProjectContact<T>(long ProjectContactId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/delete-project-contact/" + ProjectContactId
            });
        }

        public async Task<T> UpdateProjectContact<T>(ProjectContactUpdateDTO projectContactUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = projectContactUpdateDTO,
                Url = bridgeUrl + "/api/ProjectAPI/update-project-contact"
            });
        }
        #endregion

        #region:: Add Project Contact
        public async Task<T> CreateProjectContact<T>(ProjectContactCreateDTO projectContactCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = projectContactCreateDTO,
                Url = bridgeUrl + "/api/ProjectAPI/Add-Project-contact"
            });
        }
        public async Task<T> GetPTDPurchaseOrderList<T>(long ProjectId, DateTime FromDate, DateTime ToDate)
        {
            string fromDateString = FromDate.ToString("yyyy-MM-dd");
            string toDateString = ToDate.ToString("yyyy-MM-dd");
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,

                Url = bridgeUrl + "/api/ProjectAPI/get-PTD-Purchases-by-ProjectId/" + ProjectId + "/" + fromDateString + "/" + toDateString,
            });

        }
        #endregion

        #region:: Project Team

        public async Task<T> GetProjectUserApprovalNoAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-user-approver-number/" + ProjectId,
            });
        }

        public async Task<T> GetAllProjectManagerAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-project-manager/" + ProjectId,
            });
        }

        public async Task<T> GetProjectTeamDetailsByProjectIdAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-team-member/" + ProjectId,
            });
        }

        public async Task<T> ChangeProjectManagerAsync<T>(long ProjectId,long ManagerId, long UpdatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/update-project-manager/" + ProjectId + "/" + ManagerId + "/" + UpdatedBy,
            });
        }

        public async Task<T> ChangeBudgetApprovalNumberAsync<T>(long ProjectId, int BudgetApproverNumber, long UpdatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/ProjectAPI/update-budget-approval-number/" + ProjectId + "/" + BudgetApproverNumber + "/" + UpdatedBy,
            });
        }
        public async Task<T> GetTeamMemberPermissionListAsync<T>(long ProjectMemberId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-security-for-vendor/" + ProjectMemberId,
            });
        }

        public async Task<T> GetProjectUserType<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-project-user-type",
            });
        }

        public async Task<T> AddDeletePOApproversAsync<T>(long ProjectId, long ProjectUserId, long flag, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/add-delete-po-approval/" + ProjectId + "/" + ProjectUserId + "/" + flag + "/" + UserId,
            });
        }

        public async Task<T> AddDeleteBudgetApproversAsync<T>(long ProjectId, long ProjectUserId, long flag, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/add-delete-budget-approval/" + ProjectId + "/" + ProjectUserId + "/" + flag + "/" + UserId,
            });
        }

        public async Task<T> AddDeletePOLineItemApproverAsync<T>(long ProjectId, long ProjectUserId, long flag, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/add-delete-polineitem-approval/" + ProjectId + "/" + ProjectUserId + "/" + flag + "/" + UserId,
            });
        }

        public async Task<T> DeleteProjectMemberAsync<T>(long ProjectId, long ProjectUserId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/delete-project-member/" + ProjectId + "/" + ProjectUserId + "/" + UserId,
            });
        }

        public async Task<T> ProjectUserList<T>(long UserTypeId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-user-for-add/" + UserTypeId,
            });
        }
        public async Task<T> GetSystemPermissionForUserList<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-systempermission-for-userList/" + FldId,
            });
        }

        public async Task<T> GetProjectFabApprovalLevelAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/fab-approval-level/" + ProjectId,
            });
        }

        public async Task<T> FabEditUserLevelAsync<T>(int LevelId, long ProjectUserId, int flag, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/edit-fab-user-level/" + LevelId + "/" + ProjectUserId + "/" + flag + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> ChangeFABApprovernumberAsync<T>(int LevelId, int number, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/change-fab-approver-number/" + LevelId + "/" + number + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> FABDeleteLevelAsync<T>(int LevelId, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/delete-fab-approver-level/" + LevelId + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> AddProjectMemberFromuserList<T>(ProjectTeamMemberCreateDTO projectTeamMemberCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = projectTeamMemberCreateDTO,
                Url = bridgeUrl + "/api/ProjectAPI/Add-Project-Member-From-User-List",
            });
        }
        public async Task<T> AddPOApprovalLevelForMember<T>(long ProjectId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,

                Url = bridgeUrl + "/api/ProjectAPI/add-po-approval-level/" + ProjectId + "/" + UserId,
            });
        }

        public async Task<T> AddNewfabricationLevelAsync<T>(long ProjectId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/add-new-fab-approver-level/" + ProjectId + "/" + UserId,
            });
        }

        public async Task<T> UpdateFabApprovalGroupnameAsync<T>(List<FabGroupModelDto> fabGroups, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = fabGroups,
                Url = bridgeUrl + "/api/ProjectAPI/update-fab-group-name/" + UserId,
            });
        }

        public async Task<T> GetAllFabPathListAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-fab-path-list/" + ProjectId,
            });
        }

        public async Task<T> GetAllFabGroupOnFabPath<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/get-all-grp-on-fab-path/" + ProjectId,
            });
        }

        //public async Task<T> CheckIsDublicatePathNameAsync<T>(long ProjectId,string ApprovalPathName)
        //{
        //    return await _baseService.SendAsync<T>(new APIRequest
        //    {
        //        ApiType = SD.ApiType.GET,
        //        Url = bridgeUrl + "/api/ProjectAPI/check-is-same-fabpathname-exists/" + ProjectId + "/" + ApprovalPathName,
        //    });
        //}

        public async Task<T> FabPathDetailsByIdAsync<T>(long ProjectId,long PathId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/fab-path-details-by-id/" + ProjectId + "/" + PathId,
            });
        }

        public async Task<T> AddFabApprovalPathAsync<T>(AddFabApprovalPathDto upsertDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = upsertDto,
                Url = bridgeUrl + "/api/ProjectAPI/add-fab-approval-path"
            });
        }

        public async Task<T> DeleteFabApprovalPathAsync<T>(long ProjectId, long FabPathId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/delete-fab-path/" + ProjectId + "/" + FabPathId + "/" + UserId,
            });
        }

        public async Task<T> GetProjectPOApprovalLevelAsync<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/po-approval-level/" + ProjectId,
            });
        }
        public async Task<T> CheckPoApprovalMemeberExistsInProject<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/check-po-approval-memeber-exists-in-Project/" + ProjectId,
            });
        }

        public async Task<T> POEditUserLevelAsync<T>(int LevelId, long ProjectUserId, int flag, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/edit-po-user-level/" + LevelId + "/" + ProjectUserId + "/" + flag + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> ChangePOApprovernumberAsync<T>(int LevelId, int number, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/change-po-approver-number/" + LevelId + "/" + number + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> PODeleteLevelAsync<T>(int LevelId, long userId, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/delete-po-approver-level/" + LevelId + "/" + userId + "/" + ProjectId,
            });
        }

        public async Task<T> AddNewPOLevelAsync<T>(long ProjectId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/ProjectAPI/add-new-po-approver-level/" + ProjectId + "/" + UserId,
            });
        }

        #endregion
    }
}
