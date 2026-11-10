using BridgeWeb.Application.Common.Interfaces.Project;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Application.Common.Interfaces.Vendor;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Project;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.WEB.Extensions;
using Intuit.Ipp.Core.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    public class ProjectController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IProjectService _projectService;
        private readonly ISystemAdminRepository _systemAdminRepository;
        private readonly IVendorRepository _vendorRepository;

        public ProjectController(IWebHostEnvironment webHostEnvironment, IProjectService projectService, ISystemAdminRepository systemAdminRepository, IVendorRepository vendorRepository)
        {
            _webHostEnvironment = webHostEnvironment;
            _projectService = projectService;
            _systemAdminRepository = systemAdminRepository;
            _vendorRepository = vendorRepository;
        }

        #region:: Create Project                       
        [Authorize]
        [PageAuthorization("3")]
        public async Task<IActionResult> CreateProject()
        {

            MultipleModel mmm = new MultipleModel();

            var (t1, t2, t3, t4) = (
                _projectService.GetAllCountryOnProjectAsync<APIResponse>(),
                _vendorRepository.GetAllCurrencyOnAddVendor<APIResponse>(),
                _projectService.GetAllStateByCountryId<APIResponse>(Convert.ToInt64(2)),
                _systemAdminRepository.GetAllInvoiceAddressAsync<APIResponse>()
            );

            await Task.WhenAll(t1, t2, t3, t4);

            var countryResponse = t1.Result;
            var currResponse = t2.Result;
            var stateResponse = t3.Result;
            var invoiceAddressResponce = t4.Result;

            var countryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>();

            var currecyList = currResponse.UnwrapResultOrDefault<List<CurrencyDto>>();

            var stateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>();

            var invoice = invoiceAddressResponce.UnwrapResultOrDefault<List<InvoiceAddressesDto>>();

            mmm.CountryList = countryList;
            mmm.currencyList = currecyList;
            mmm.StateList = stateList;
            mmm.invoiceAddressesList = invoice;

            return View(mmm);

        }

        [Authorize]
        public async Task<string> GetAllStatesOnProjectByCountryId(string CountryId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _projectService.GetAllStateByCountryId<APIResponse>(Convert.ToInt64(CountryId));
            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<string> CreateProject(ProjectCreateDto createDto)
        {
            var result = string.Empty;

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            createDto.CreatedBy = userId;
            var response = await _projectService.CreateProjectAsync<APIResponse>(createDto);

            result = JsonConvert.SerializeObject(response);

            return result;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UploadProjectFiles(string projectid, string mode)
        {
            string message = string.Empty;
            var data = string.Empty;
            var result = new APIResponse();

            var fileName = string.Empty;
            string fname = string.Empty;
            string allfilename = string.Empty;
            string webRootPath = _webHostEnvironment.WebRootPath;


            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    string ext = string.Empty;
                    if (mode == "ISF")
                    {
                        var fileISF = Request.Form.Files[i];
                        ext = Path.GetExtension(fileISF.FileName);
                        fname = Path.GetFileNameWithoutExtension(fileISF.FileName);
                        fname = fname.Replace("'", "`");

                        fileName = fname + "(" + mode + "_" + projectid + "_" + i + ")" + "." + ext;

                        allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";

                        string folderPath = Path.Combine(webRootPath, "Assets/InstallationScheduleFiles");

                        if (!Directory.Exists(folderPath))
                        {
                            return ApiResponseService.InternalServerResponse("Directory does not exist.");
                        }

                        try
                        {
                            FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                            using (FileStream stream = fileInfo.OpenWrite())
                            {
                                fileISF.CopyTo(stream);
                            }
                        }
                        catch (Exception ex)
                        {

                            return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                        }



                    }
                    if (mode == "PF")
                    {
                        var filePF = Request.Form.Files[i];
                        ext = Path.GetExtension(filePF.FileName);
                        fname = Path.GetFileNameWithoutExtension(filePF.FileName);
                        fname = fname.Replace("'", "`");

                        fileName = fname + "(" + mode + "_" + projectid + "_" + i + ")" + "." + ext;
                        allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";

                        string folderPath = Path.Combine(webRootPath, "Assets/ProjectFiles");

                        if (!Directory.Exists(folderPath))
                        {
                            return ApiResponseService.NotFoundResponse("Directory does not exist.");
                        }

                        try
                        {
                            FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                            using (FileStream stream = fileInfo.OpenWrite())
                            {
                                filePF.CopyTo(stream);
                            }
                        }
                        catch (Exception ex)
                        {

                            return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                        }
                    }
                }

                result = await _projectService.UpdateFilePathAsync<APIResponse>(projectid, mode, allfilename);
            }
            else
            {
                result.StatusCode = System.Net.HttpStatusCode.OK;
                result.IsSuccess = true;
                if (mode == "TC")
                {
                    //set default terms and condition file for project Creation.
                    var fileTCPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "SystemTermsFiles");
                    var files = Directory.GetFiles(fileTCPath);
                    string ext = Path.GetExtension(files[0]);
                    string defaultmode = "TC";
                    fname = Path.GetFileNameWithoutExtension(files[0]);
                    fname = fname.Replace("'", "`");
                    fileName = fname.Split('^')[0] + "(" + defaultmode + "_" + projectid + "_" + 0 + ")" + ext;
                    allfilename = fileName;
                    var path = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "TermsConditionFiles", fileName);

                    if (files.Length > 0)
                    {
                        System.IO.File.Copy(files[0], path, true);
                        //call the api 
                        result = await _projectService.UpdateFilePathAsync<APIResponse>(projectid, defaultmode, allfilename);
                    }
                }
            }




            return ApiResponseService.SuccessResponse(result.Result);

        }

        [Authorize]
        public async Task<IActionResult> VendorlistInProject()
        {
            MultipleModel mm = new MultipleModel();

            var(t1, t2) = (
                _projectService.GetVendorInCreateProject<APIResponse>(),
                _projectService.GetClassificationforFilter<APIResponse>()
            );

            await Task.WhenAll(t1, t2);

            var response = t1.Result;
            var classificaitonResult = t2.Result;

            mm.VendorinProjectList = response.UnwrapResultOrDefault<List<VendorListinProjectDto>>(); ;
            mm.classificationsList = classificaitonResult.UnwrapResultOrDefault<List<ClassificationsDto>>(); ;

            return PartialView("~/Views/Project/_partialVendorlistInProject.cshtml", mm);

        }

        [Authorize]
        public async Task<string> classificationList()
        {
            var classificaitonResult = await _projectService.GetClassificationforFilter<APIResponse>();
            string data = JsonConvert.SerializeObject(classificaitonResult.Result);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> POComments()
        {
            MultipleModel mm = new();

            var response = await _projectService.POCommentinCreateProject<APIResponse>();

            mm.ProjectCommentsList = response.UnwrapResultOrDefault<List<ProjectCommentDto>>();

            return PartialView("~/Views/Project/_partialPOComments.cshtml", mm);
        }

        #endregion

        #region:: Project List

        [Authorize]
        [PageAuthorization("5")]
        public async Task<IActionResult> ProjectList()
        {
            //throw new UnauthorizedAccessException("Unauthorized access.");
            return View();
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> ProjectTableBind([FromBody] ProjectTableBindDTO request)
        {
            request.UserID = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _projectService.GetAllProjectList<APIResponse>(request);
            if (response == null || !response.IsSuccess || response.Result == null)
            {
                return Json(new
                {
                    draw = request.Draw,
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<object>()
                });
            }
            var result = JsonConvert.DeserializeObject<DataTableResponse<ProjectListDto>>(Convert.ToString(response.Result)!) ?? new();

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = result.RecordsTotal,
                recordsFiltered = result.RecordsFiltered,
                data = result.Data
            });
        }
        //[Authorize]
        //public async Task<IActionResult> ProjectTableBind()
        //{
        //    var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);


        //    MultipleModel mm = new MultipleModel();

        //    var response = await _unitOfWork.ProjectService.GetAllProjectList<APIResponse>(userId);

        //    var projectList = response.IsSuccess == true && response.Result != null
        //            ? JsonConvert.DeserializeObject<List<ProjectListDto>>(Convert.ToString(response.Result)!) ?? new()
        //            : new();

        //    mm.ProjectListDto = projectList;

        //    return PartialView("~/Views/Project/_partialProjectTableBind.cshtml", mm);
        //}
        [Authorize]
        public async Task<string> DeleteProjectId(string projectId)
        {
            string data = string.Empty;
            var response = await _projectService.DeleteProjectInProjectList<APIResponse>(long.Parse(projectId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }
        #endregion

        #region:: Edit Project
        [Authorize]
        [PageAuthorization("5")]
        public async Task<IActionResult> EditProject(string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            MultipleModel mm = new();
            var projectIdlong = long.Parse(ProjectId);

            var tasks = await Task.WhenAll(
                _projectService.GetUserTypeNew<APIResponse>(userId),
                _systemAdminRepository.GetAllCountryAsync<APIResponse>(),
                _projectService.GetAllStateByCountryId<APIResponse>(Convert.ToInt64(2)),
                _vendorRepository.GetAllCurrencyOnAddVendor<APIResponse>(),
                _projectService.GetProjectDetailsById<APIResponse>(projectIdlong),
                _projectService.GetTotalPOList<APIResponse>(projectIdlong),
                _projectService.SelectReportAccessPermisson<APIResponse>(projectIdlong),
                _projectService.GetProjectConversionRate<APIResponse>(projectIdlong),
                _projectService.GetProjectAccountDetails<APIResponse>(projectIdlong),
                _projectService.GetProjectComment<APIResponse>(projectIdlong),
                _projectService.GetPOFilestoShow<APIResponse>(projectIdlong)
            );

            var getUserType = tasks[0];
            var countryResponse = tasks[1];
            var stateResponse = tasks[2];
            var currencyResponse = tasks[3];
            var projectDetails = tasks[4];
            var POResponse = tasks[5];
            var selectReportAccessResponse = tasks[6];
            var conversionReport = tasks[7];
            var projectAccountResponse = tasks[8];
            var projectCommentResponse = tasks[9];
            var POFilesToShowResponse = tasks[10];

            mm.CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>(); ;
            mm.currencyList = currencyResponse.UnwrapResultOrDefault<List<CurrencyDto>>(); ;
            mm.StateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>();
            mm.ProjectEdit = projectDetails.UnwrapResultOrDefault<ProjectEditDTO>();
            mm.PODetails = POResponse.UnwrapResultOrDefault<PODto>();
            mm.ReportAccessPermissionDto = selectReportAccessResponse.UnwrapResultOrDefault<ReportAccessPermissionDto>();
            mm.ProjectAccountDetailsList = projectAccountResponse.UnwrapResultOrDefault<List<ProjectAccountDetailsDTO>>();
            mm.ProjectConversionRatesList = conversionReport.UnwrapResultOrDefault<List<ProjectConversionRateDTO>>();
            mm.ProjectCommentByProjectIdList = projectCommentResponse.UnwrapResultOrDefault<List<ProjectCommentByProjectIdDto>>();
            mm.POfilestoShowList = POFilesToShowResponse.UnwrapResultOrDefault<List<POFilesToshowDTO>>();


            return View(mm);
        }

        [Authorize]
        public async Task<IActionResult> ProjectContactList(string ProjectId)
        {

            var(t1, t2, t3) = (
                _projectService.GetProjectContact<APIResponse>(long.Parse(ProjectId)),
                _systemAdminRepository.GetAllCountryAsync<APIResponse>(),
                _projectService.GetAllStates<APIResponse>()
            );

            await Task.WhenAll(t1, t2, t3);

            var response = t1.Result;
            var countryResponse = t2.Result;
            var stateResponse = t3.Result;

            MultipleModel mm = new()
            {
                ProjectContactListInProjectEdit = response.UnwrapResultOrDefault<List<ProjectContactInEditProjectDTO>>(),
                CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>(),
                StateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>()
            };

            return PartialView("~/Views/Project/_partialProjectContactList.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> BankAccountDetails(string ProjectId)
        {
            MultipleModel model = new MultipleModel();

            var response = await _projectService.GetBankAccountByProjectId<APIResponse>(long.Parse(ProjectId));

            model.BankAccountDetailsList = response.UnwrapResultOrDefault<List<BankAccountInEditProjectDto>>();

            return PartialView("~/Views/Project/_partialBankAccountDetails.cshtml", model);
        }
        [Authorize]
        public async Task<string> FileUploadDetails(string ProjectId)
        {          
            var resposne = await _projectService.GetUploadedFiles<APIResponse>(long.Parse(ProjectId));
            
            string data = JsonConvert.SerializeObject(resposne);

            return data;
        }

        [Authorize]
        public async Task<string> AddNewProjectBankAccount(CreateNewProjectBankAccount createNewProjectBankAccount)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            createNewProjectBankAccount.InsertedBy = userId;
            var response = await _projectService.AddNewProjectBankAccount<APIResponse>(createNewProjectBankAccount);
            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> getStateByCountryIdInEditProject(string countryId)
        {
            if (countryId == null)
            {
                countryId = "0";
            }
            var stateResponse = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(long.Parse(countryId));
            string data = JsonConvert.SerializeObject(stateResponse);
            return data;

        }

        [Authorize]
        public async Task<string> deleteProjectAttachments(string fileName, string ProjectId, string mode, string fldId)
        {
            string fullPath = string.Empty;
            if (fileName == null)
            {
                fileName = "null";
            }
            if (fldId == null || fldId == "undefined")
            {
                fldId = "0";
            }

            if (mode == "PF")
            {
                fullPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "ProjectFiles", fileName);
            }
            if (mode == "TC")
            {
                fullPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "TermsConditionFiles", fileName);
            }
            if (mode == "ISF")
            {
                fullPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "InstallationScheduleFiles", fileName);
            }
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            var response = await _projectService.DeleteProjectAttachements<APIResponse>(fileName, long.Parse(ProjectId), mode, long.Parse(fldId));
            string data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> GetProjectAccountDetailsByFldId(string fldId)
        {
            MultipleModel mm = new();
            var response = await _projectService.GetProjectAccountDetailsByFldId<APIResponse>(long.Parse(fldId));
            mm.ProjectAccountDetails = response.UnwrapResultOrDefault<ProjectAccountDetailsDTO>(); ;
            return PartialView("~/Views/Project/_partialGetProjectAccountDetailsByFldId.cshtml", mm);
        }

        [Authorize]
        public async Task<string> UpdateProjectAccountDetails(ProjectAccountUpdateDTO projectAccountUpdateDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectAccountUpdateDTO.UpdatedBy = userId;
            var response = await _projectService.UpdateProjectAccountDetails<APIResponse>(projectAccountUpdateDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteProjectAccount(string FldId)
        {
            string data = string.Empty;
            var response = await _projectService.DeleteProjectAccount<APIResponse>(long.Parse(FldId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> DeleteProjectBank(long FldId, long ProjectId)
        {
            var response = await _projectService.DeleteProjectBank<APIResponse>(FldId, ProjectId);

            if(response == null)
                return ApiResponseService.InternalServerResponse("An error occurred while deleting the bank account.");

            if(response.IsSuccess == false)
                return ApiResponseService.InternalServerResponse(response.ErrorMessages.FirstOrDefault() ?? "Failed to delete the bank account.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<string> CreateProjectAccount(ProjectAccountCreateDto projectAccountCreateDto)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectAccountCreateDto.CreatedBy = userId;
            var response = await _projectService.CreateProjectAccount<APIResponse>(projectAccountCreateDto);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteProjectConversionRate(string FldId)
        {
            string data = string.Empty;
            var response = await _projectService.DeleteprojectConversionRate<APIResponse>(long.Parse(FldId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> UploadFileOnEditProject(string ProjectId, string mode, int? InstalledFilesCount = 0, int? TermsCondFilesCount = 0, int? ProjectFilesCount = 0)
        {
            string message = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var fileName = string.Empty;
            string fname = string.Empty;
            string allfilename = string.Empty;
            string webRootPath = _webHostEnvironment.WebRootPath;
            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    string ext = string.Empty;
                    if (mode == "ISF")
                    {
                        var fileISF = Request.Form.Files[i];
                        ext = Path.GetExtension(fileISF.FileName);
                        fname = Path.GetFileNameWithoutExtension(fileISF.FileName);
                        fname = fname.Replace("'", "`");

                        fileName = fname + "(" + mode + "_" + ProjectId + "_" + (InstalledFilesCount + 1) + ")" + ext;
                        //if (allfilename.Trim() == "")
                        //{
                        //    allfilename = fileName;
                        //}
                        //else
                        //{
                        //    allfilename += "," + fileName;
                        //}

                        allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";

                        string folderPath = Path.Combine(webRootPath, "Assets/InstallationScheduleFiles");

                        if (!Directory.Exists(folderPath))
                        {
                            return ApiResponseService.NotFoundResponse("Directory does not exist.");
                        }

                        try
                        {
                            FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                            using (FileStream stream = fileInfo.OpenWrite())
                            {
                                fileISF.CopyTo(stream);
                            }
                        }
                        catch (Exception ex)
                        {

                            return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                        }

                        InstalledFilesCount = InstalledFilesCount + 1;

                    }
                    if (mode == "PF")
                    {
                        var filePF = Request.Form.Files[i];
                        ext = Path.GetExtension(filePF.FileName);
                        fname = Path.GetFileNameWithoutExtension(filePF.FileName);
                        fname = fname.Replace("'", "`");

                        fileName = fname + "(" + mode + "_" + ProjectId + "_" + (ProjectFilesCount + 1) + ")" + ext;
                        allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";

                        string folderPath = Path.Combine(webRootPath, "Assets/ProjectFiles");

                        if (!Directory.Exists(folderPath))
                        {
                            return ApiResponseService.NotFoundResponse("Directory does not exist.");
                        }

                        try
                        {
                            FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                            using (FileStream stream = fileInfo.OpenWrite())
                            {
                                filePF.CopyTo(stream);
                            }
                        }
                        catch (Exception ex)
                        {

                            return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                        }

                        ProjectFilesCount = ProjectFilesCount + 1;
                    }
                    if (mode == "TC")
                    {
                        var filePF = Request.Form.Files[i];
                        ext = Path.GetExtension(filePF.FileName);
                        fname = Path.GetFileNameWithoutExtension(filePF.FileName);
                        fname = fname.Replace("'", "`");

                        fileName = fname + "(" + mode + "_" + ProjectId + "_" + (TermsCondFilesCount + 1) + ")" + ext;
                        allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";

                        string folderPath = Path.Combine(webRootPath, "Assets/TermsConditionFiles");

                        if (!Directory.Exists(folderPath))
                        {
                            return ApiResponseService.NotFoundResponse("Directory does not exist.");
                        }

                        try
                        {
                            FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                            using (FileStream stream = fileInfo.OpenWrite())
                            {
                                filePF.CopyTo(stream);
                            }
                        }
                        catch (Exception ex)
                        {

                            return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                        }

                        TermsCondFilesCount = TermsCondFilesCount + 1;
                    }

                }
            }
            var result = await _projectService.AddFileInProjectEdit<APIResponse>(long.Parse(ProjectId), mode, allfilename, userId);
            
            if(result == null)
                return ApiResponseService.InternalServerResponse("An error occurred while updating the file information.");

            if(!result.IsSuccess)
                return ApiResponseService.InternalServerResponse(result.ErrorMessages.FirstOrDefault() ?? "Failed to update the file information.");

            return ApiResponseService.SuccessResponse(result.Result);

        }

        [Authorize]
        public async Task<string> POFilestoShowUpdate(string ProjectId, string FileName)
        {
            var data = string.Empty;
            var response = await _projectService.SelectedPOFile<APIResponse>(long.Parse(ProjectId), FileName);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> GetVendorDetailsInEditProject(string ProjectId)
        {
            MultipleModel mm = new();

            var(t1,t2) = (
                _projectService.GetAllVendorListinProjectEdit<APIResponse>(long.Parse(ProjectId)),
                _projectService.GetClassificationforFilter<APIResponse>()
            );

            await Task.WhenAll(t1, t2);
            var allVendorResponse = t1.Result;
            var classificaitonResult = t2.Result;

            mm.VendorListinEditProject = allVendorResponse.UnwrapResultOrDefault<List<VendorLIstinEditProjectDto>>(); ;
            mm.classificationsList = classificaitonResult.UnwrapResultOrDefault<List<ClassificationsDto>>(); ;

            return PartialView("~/Views/Project/_partialGetVendorDetailsInEditProject.cshtml", mm);
        }

        [Authorize]
        public async Task<string> AddProjectComment(string ProjectId, string comment)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _projectService.CreateProjectCommentinEditProject<APIResponse>(long.Parse(ProjectId), comment, userId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteProjectComment(string ProjectId, string CommentId)
        {
            string data = string.Empty;
            var response = await _projectService.DeleteProjectcomment<APIResponse>(long.Parse(ProjectId), long.Parse(CommentId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<string> UpdateProject(ProjectEditUpdateDTO projectEditUpdateDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectEditUpdateDTO.UpdatedBy = userId;
            var response = await _projectService.UpdateProject<APIResponse>(projectEditUpdateDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> AddConversionRate(AddConversionRateDTO addConversionRateDTO)
        {
            var response = await _projectService.AddNewProjectConversionRate<APIResponse>(addConversionRateDTO);
            return JsonConvert.SerializeObject(response);
        }

        #endregion

        #region :: Edit Project Contact 
        [Authorize]
        [PageAuthorization("3")]

        public async Task<ActionResult> EditProjectContact(string ProjectContactId)
        {
            MultipleModel mmm = new MultipleModel();
            var response = await _projectService.GetProjectContactDetails<APIResponse>(long.Parse(ProjectContactId));
            var projectContactsDto = response.UnwrapResultOrDefault<ProjectContactsDto>();

            var contactTypeResponse = await _projectService.GetAllContactTypes<APIResponse>();
            var contactList = contactTypeResponse.UnwrapResultOrDefault<List<ContactTypesDto>>();

            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();
            var countryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>();



            var stateResponse = await _systemAdminRepository.GetAllStatesByCountryIdAsync<APIResponse>(projectContactsDto.Country);
            var stateList = stateResponse.UnwrapResultOrDefault<List<StateDto>>();

            mmm.StateList = stateList;
            mmm.contactTypesList = contactList;
            mmm.ProjectDetails = projectContactsDto;
            mmm.CountryList = countryList;

            return View(mmm);
        }
        [Authorize]
        public async Task<string> DeleteProjectContact(string ProjectContactId)
        {
            string data = string.Empty;
            var response = await _projectService.DeleteProjectContact<APIResponse>(long.Parse(ProjectContactId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }
        [Authorize]
        public async Task<string> UpdateProjectContact(ProjectContactUpdateDTO projectContactUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectContactUpdateDTO.UpdatedBy = userId;
          
            var response = await _projectService.UpdateProjectContact<APIResponse>(projectContactUpdateDTO);
            string data = JsonConvert.SerializeObject(response);
            return data;
        }
        [Authorize]
        public async Task<string> getStateByCountryId(string countryId)
        {
            if (countryId == null)
            {
                countryId = "0";
            }
            var stateResponse = await _systemAdminRepository.GetAllStateByCountryAsync<APIResponse>(long.Parse(countryId));
            string data = JsonConvert.SerializeObject(stateResponse);
            return data;
        }
        #endregion

        #region:: Add Project Contact
        [Authorize]
        [PageAuthorization("3")]
        public async Task<IActionResult> AddProjectContact(string ProjectId)
        {
            ViewBag.ProjectId = ProjectId;

            var contactTypeResponse = await _projectService.GetAllContactTypes<APIResponse>();
            var countryResponse = await _systemAdminRepository.GetAllCountryAsync<APIResponse>();

            MultipleModel model = new MultipleModel()
            {
                contactTypesList = contactTypeResponse.UnwrapResultOrDefault<List<ContactTypesDto>>(),
                CountryList = countryResponse.UnwrapResultOrDefault<List<CountryDto>>()
            };

            return View(model);
        }
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<string> CreateProjectContact(ProjectContactCreateDTO projectContactCreateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectContactCreateDTO.CreatedBy = userId;
            var response = await _projectService.CreateProjectContact<APIResponse>(projectContactCreateDTO);
            string data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> POCommentList()
        {
            MultipleModel mm = new();

            var response = await _projectService.POCommentinCreateProject<APIResponse>();

            mm.ProjectCommentsList = response.UnwrapResultOrDefault<List<ProjectCommentDto>>(); ;
            return PartialView("~/Views/Project/_partialPOCommentList.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> PTDPurchaseOrder(string ProjectId, string FromDate, string ToDate)
        {
            MultipleModel mm = new();

            var response = await _projectService.GetPTDPurchaseOrderList<APIResponse>(long.Parse(ProjectId), Convert.ToDateTime(FromDate), Convert.ToDateTime(ToDate));

            mm.PTDPurchaseList = response.UnwrapResultOrDefault<List<PTDPurchasesDTO>>();
            return PartialView("~/Views/Project/_partialPTDPurchaseOrder.cshtml", mm);
        }

        public async Task<string> GetPOfromProjectEdit(string VendorId, string ProjectId)
        {
            var response = await _projectService.GetPOInProjectEdit<APIResponse>(VendorId, ProjectId);
            return JsonConvert.SerializeObject(response);

        }
        #endregion

        #region:: Project Team

        [Authorize]
        [PageAuthorization("5")]
        public async Task<IActionResult> ProjectTeam(string pid, string n)
        {
            MultipleModel mm = new MultipleModel();

            var projectUsertypeResponse = await _projectService.GetProjectUserType<APIResponse>();

            var response = await _projectService.GetProjectUserApprovalNoAsync<APIResponse>(long.Parse(pid));

            var managerListResponse = await _projectService.GetAllProjectManagerAsync<APIResponse>(long.Parse(pid));

            mm.ProjectUserApproval = response.UnwrapResultOrDefault<ProjectUserApprovalDto>();
            mm.ManagerListDtos = managerListResponse.UnwrapResultOrDefault<List<ManagerListDto>>();
            mm.ProjectusertypeList = projectUsertypeResponse.UnwrapResultOrDefault<List<ProjectusertypeDto>>();

            return View(mm);

        }


        [Authorize]
        public async Task<IActionResult> GetProjectTeamMemberList(string ProjectId)
        {
            MultipleModel mm = new MultipleModel();

            var response = await _projectService.GetProjectTeamDetailsByProjectIdAsync<APIResponse>(long.Parse(ProjectId));
            var projectteamList = response.UnwrapResultOrDefault<List<ProjectTeamDetailsDto>>();

            mm.ProjectTeamDetails = projectteamList;


            return PartialView("~/Views/Project/_partialProjectTeamListBind.cshtml", mm);

        }

        [Authorize]
        [HttpPost]
        public async Task<string> ChangeManager(string ProjectId, string ManagerId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.ChangeProjectManagerAsync<APIResponse>(long.Parse(ProjectId), long.Parse(ManagerId), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;
        }

        [Authorize]
        [HttpPost]
        public async Task<string> ChangeBudgetApprovernumber(string ProjectId, string BudgetApproverNumber)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.ChangeBudgetApprovalNumberAsync<APIResponse>(long.Parse(ProjectId), int.Parse(BudgetApproverNumber), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;

        }

        [Authorize]
        public async Task<IActionResult> GetTeamMemberPermission(string TeamMemberId, string UserTypeName)
        {
            MultipleModel mm = new MultipleModel();

            var projectUsertypeResponse = await _projectService.GetProjectUserType<APIResponse>();
            var projectUserTypeList = projectUsertypeResponse.UnwrapResultOrDefault<List<ProjectusertypeDto>>();

            var response = await _projectService.GetTeamMemberPermissionListAsync<APIResponse>(long.Parse(TeamMemberId));
            var projectmemberPermissionList = response.UnwrapResultOrDefault<List<ProjectMemberPermissionDto>>();

            mm.ProjectusertypeList = projectUserTypeList;
            mm.ProjectMemberPermissionDtos = projectmemberPermissionList;

            ViewBag.TeamMemberId = TeamMemberId;
            ViewBag.UserTypeName = UserTypeName;

            return PartialView("~/Views/Project/_partialEditTeamMemberPermissionModel.cshtml", mm);

        }

        [Authorize]
        public async Task<string> AddDeletePOApprovers(string ProjectId, string ProjectUserId, string flag)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.AddDeletePOApproversAsync<APIResponse>(long.Parse(ProjectId), long.Parse(ProjectUserId), long.Parse(flag), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;

        }

        [Authorize]
        public async Task<string> AddDeleteBudgetApprovers(string ProjectId, string ProjectUserId, string flag)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.AddDeleteBudgetApproversAsync<APIResponse>(long.Parse(ProjectId), long.Parse(ProjectUserId), long.Parse(flag), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;

        }

        [Authorize]
        public async Task<string> AddDeletePOLineItemApprover(string ProjectId, string ProjectUserId, string flag)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.AddDeletePOLineItemApproverAsync<APIResponse>(long.Parse(ProjectId), long.Parse(ProjectUserId), long.Parse(flag), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;
        }

        [Authorize]
        public async Task<string> DeleteProjectTeammembers(string ProjectId, string ProjectUserId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.DeleteProjectMemberAsync<APIResponse>(long.Parse(ProjectId), long.Parse(ProjectUserId), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;
        }

        [Authorize]
        public async Task<string> ProjectTeamUpdate(ProjectTeamUpdateDto projectTeamUpdateDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            projectTeamUpdateDto.UpdatedBy = userId;
            var response = await _projectService.UpdateProjectTeamMembersById<APIResponse>(projectTeamUpdateDto);

            string data = JsonConvert.SerializeObject(response);

            return data;
        }

        [Authorize]
        public async Task<string> ProjectUserList(string UserTypeId)
        {
            var response = await _projectService.ProjectUserList<APIResponse>(long.Parse(UserTypeId));

            string data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> PermissionUserList(string FldId)
        {
            MultipleModel mm = new();
            var response = await _projectService.GetSystemPermissionForUserList<APIResponse>(long.Parse(FldId));

            mm.ProjectUserListPermissions = response.UnwrapResultOrDefault<List<ProjectUserListPermission>>();
            return PartialView("~/Views/Project/_partialPermissionUserListInProjectTeam.cshtml", mm);
        }

        [Authorize]
        public async Task<string> AddProjectMemberFromUserlist(ProjectTeamMemberCreateDTO projectTeamMemberCreateDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            projectTeamMemberCreateDTO.CreatedBy = userId;
            var response = await _projectService.AddProjectMemberFromuserList<APIResponse>(projectTeamMemberCreateDTO);
            if (response.IsSuccess == true)
            {
                data = JsonConvert.SerializeObject(response);
            }
            else
            {
                data = JsonConvert.SerializeObject(response);
            }
            return data;


        }

        [Authorize]
        public async Task<string> AddPOApprovalLevelForMemberinAddMember(string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var PODefaultLevelResponse = await _projectService.AddPOApprovalLevelForMember<APIResponse>(long.Parse(ProjectId), userId);
            string data = JsonConvert.SerializeObject(PODefaultLevelResponse);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> FabApprovalLevelSet(string ProjectId)
        {
            MultipleModel mm = new();

            var response = await _projectService.GetProjectFabApprovalLevelAsync<APIResponse>(long.Parse(ProjectId));

            var fabapprovalList = response.UnwrapResultOrDefault<List<FabApprovalGetDataDto>>();

            mm.FabApprovalGetListData = fabapprovalList;

            return PartialView("~/Views/Project/_partialGetAllFabricationApprovalLevel.cshtml", mm);
        }

        [Authorize]
        public async Task<string> FabEditUserLevel(string LevelId, string ProjectUserId, string flag, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.FabEditUserLevelAsync<APIResponse>(int.Parse(LevelId), long.Parse(ProjectUserId), int.Parse(flag), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> ChangeFABApprovernumber(string LevelId, string number, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.ChangeFABApprovernumberAsync<APIResponse>(int.Parse(LevelId), int.Parse(number), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> FABDeleteLevel(string LevelId, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.FABDeleteLevelAsync<APIResponse>(int.Parse(LevelId), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);

            return data;
        }

        [Authorize]
        public async Task<string> AddNewfabricationLevel(string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.AddNewfabricationLevelAsync<APIResponse>(long.Parse(ProjectId), userId);

            var data = JsonConvert.SerializeObject(response);

            return data;
        }


        [Authorize]
        [HttpPost]
        public async Task<string> UpdateFabApprovalGroupname([FromBody] List<FabGroupModelDto> fabGroups)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.UpdateFabApprovalGroupnameAsync<APIResponse>(fabGroups, userId);

            var data = JsonConvert.SerializeObject(response);
            //var data = string.Empty;

            return data;
        }

        [Authorize]
        public async Task<IActionResult> FabPath(string ProjectId)
        {
            MultipleModel mm = new();

            var response = await _projectService.GetAllFabPathListAsync<APIResponse>(long.Parse(ProjectId));

            var allGroupListresponce = await _projectService.GetAllFabGroupOnFabPath<APIResponse>(long.Parse(ProjectId));

            mm.FabApprovalPathNameListData = response.UnwrapResultOrDefault<List<FabApprovalPathNameDto>>();
            mm.FabGroupOnPathListData = allGroupListresponce.UnwrapResultOrDefault<List<FabGroupOnPathDto>>();

            return PartialView("~/Views/Project/_partialGetAllFabricationPath.cshtml", mm);

        }

        //[Authorize]
        //public async Task<string> CheckIsDublicatePathName(string ProjectId,string ApprovalPathName)
        //{
        //    try
        //    {               
        //        var response = await _unitOfWork.ProjectService.CheckIsDublicatePathNameAsync<APIResponse>(long.Parse(ProjectId), ApprovalPathName);
        //        var data = JsonConvert.SerializeObject(response);

        //        return data;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }

        //}

        [Authorize]
        public async Task<string> FabPathDetailsById(string ProjectId, string PathId)
        {
            var response = await _projectService.FabPathDetailsByIdAsync<APIResponse>(long.Parse(ProjectId), long.Parse(PathId));
            var data = JsonConvert.SerializeObject(response);
            return data;

        }

        [Authorize]
        [HttpPost]
        public async Task<string> AddFabApprovalPath(AddFabApprovalPathDto upsertDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            upsertDto.UserId = userId;

            var response = await _projectService.AddFabApprovalPathAsync<APIResponse>(upsertDto);
            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteFabApprovalPath(string ProjectId, string FabPathId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.DeleteFabApprovalPathAsync<APIResponse>(long.Parse(ProjectId), long.Parse(FabPathId), userId);

            var result = JsonConvert.SerializeObject(response);

            return result;
        }

        [Authorize]
        public async Task<IActionResult> PoApprovalLevelSet(string ProjectId)
        {
            MultipleModel mm = new();

            var response = await _projectService.GetProjectPOApprovalLevelAsync<APIResponse>(long.Parse(ProjectId));

            var poapprovalList = response.UnwrapResultOrDefault<List<POApprovalGetDataDto>>();

            mm.POApprovalGetDataListDto = poapprovalList;

            return PartialView("~/Views/Project/_partialGetAllPOApprovalLevel.cshtml", mm);

        }

        [Authorize]
        public async Task<string> CheckPoApprovalTeamExistsByProjectId(string ProjectId)
        {
            var response = await _projectService.CheckPoApprovalMemeberExistsInProject<APIResponse>(long.Parse(ProjectId));
            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> POEditUserLevel(string LevelId, string ProjectUserId, string flag, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.POEditUserLevelAsync<APIResponse>(int.Parse(LevelId), long.Parse(ProjectUserId), int.Parse(flag), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);
            return data;

        }

        [Authorize]
        public async Task<string> ChangePOApprovernumber(string LevelId, string number, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.ChangePOApprovernumberAsync<APIResponse>(int.Parse(LevelId), int.Parse(number), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);
            return data;

        }

        [Authorize]
        public async Task<string> PODeleteLevel(string LevelId, string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.PODeleteLevelAsync<APIResponse>(int.Parse(LevelId), userId, long.Parse(ProjectId));

            var data = JsonConvert.SerializeObject(response);

            return data;

        }

        [Authorize]
        public async Task<string> AddNewPOLevel(string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _projectService.AddNewPOLevelAsync<APIResponse>(long.Parse(ProjectId), userId);

            var data = JsonConvert.SerializeObject(response);

            return data;
        }


        #endregion


    }
}
