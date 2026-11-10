using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.DashBoard;
using BridgeWeb.Application.Common.Interfaces.PurchasedOrder;
using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.DashBoard;
using BridgeWeb.Domain.Model.Dto.MenuBuild;
using BridgeWeb.Domain.Model.Dto.OTPDTO;
using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using BridgeWeb.Domain.Model.Dto.Report;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Utility;
using BridgeWeb.WEB.Extensions;
using Intuit.Ipp.Core.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.IO.Compression;
using System.Net;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    public class HomeController : Controller
    {
        private IHttpContextAccessor _httpContextAccessor;
        private readonly ITokenProvider _tokenProvider;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogService _logService;
        private readonly IUserRepository _userRepository;
        private readonly IDashBoardService _dashboardService;
        private readonly IPurchaseOrderService _purchaseOrderService;
        private readonly IReportService _reportService;
        private readonly IUserPageVisitedLastService _userPageVisitedLastService;
        private readonly ISSRSReportService _ssrsReportService;

        public HomeController(IHttpContextAccessor httpContextAccessor, ITokenProvider tokenProvider, IWebHostEnvironment webHostEnvironment, ILogService logService, IUserRepository userRepository, IDashBoardService dashBoardService, IPurchaseOrderService purchaseOrderService, IReportService reportService, IUserPageVisitedLastService userPageVisitedLastService, ISSRSReportService ssrsReportService)
        {
            _httpContextAccessor = httpContextAccessor;
            _tokenProvider = tokenProvider;
            _webHostEnvironment = webHostEnvironment;
            _logService = logService;
            _userRepository = userRepository;
            _dashboardService = dashBoardService;
            _purchaseOrderService = purchaseOrderService;
            _reportService = reportService;
            _userPageVisitedLastService = userPageVisitedLastService;
            _ssrsReportService = ssrsReportService;
        }

        #region :: Global Action
        private T Deserialize<T>(object? result) where T : new()
        {
            var json = Convert.ToString(result);

            if (string.IsNullOrWhiteSpace(json))
                return new T();

            return JsonConvert.DeserializeObject<T>(json) ?? new T();
        }

        #endregion

        private long GetUserId()
        {
            return Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        }

        //[Authorize]
        public async Task<IActionResult> Index()
        {
            var userId = GetUserId();

            if (userId > 0)
            {
                _tokenProvider.ClearToken();

                var response = await _userRepository.GenerateNewTokenAsync<APIResponse>(userId);
                var model = response.UnwrapResultOrDefault<LoginResponseDTO>();

                if (!string.IsNullOrEmpty(model.AccessToken))
                {
                    await GenerateMainToken(model);

                    _tokenProvider.SetToken(model.AccessToken);
                }

                if (!string.IsNullOrEmpty(model.UserLastPage))
                {
                    return Redirect(model.UserLastPage.ToString());
                }
            }

            return View();
        }

        public IActionResult Error(string? message = null)
        {
            ViewBag.ErrorMessage = string.IsNullOrWhiteSpace(message)
                ? "An unknown error occurred." : message;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequestDTO obj)
        {
            //var test = _unitOfWork.TokenProvider.GetToken();
            await HttpContext.SignOutAsync();
            _tokenProvider.ClearToken();

            var hostname = HttpContext.Request.Host.Host;
            obj.Hostname = $"{hostname}";

            var response = await _userRepository.LoginAsync<APIResponse>(obj);

            if(response == null)
                return ApiResponseService.InternalServerResponse("Login service is currently unavailable. Please try again later.");

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Login failed. Please check your credentials and try again.");

            var model = response.UnwrapResultOrDefault<LoginResponseDTO>();

            var isPasswordResetComplete = model.systemUserDto?.IsPasswordReset != 0 && model.systemUserDto?.IsPasswordReset is not null;
            if (isPasswordResetComplete && model.systemUserDto?.IsMFAEnabled == false)
            {
                if (!string.IsNullOrEmpty(model.AccessToken))
                {
                    await GenerateMainToken(model);
                    _tokenProvider.SetToken(model.AccessToken);
                }
            }
            else
            {
                HttpContext.Session.SetString("userEmail", model.systemUserDto?.Email ?? "");
            }

            // Log the login attempt
            var customLog = $"Login Attempt - Username: {obj.UserName}, " +
                            $"Success: {response?.IsSuccess ?? false}";
            await _logService.LogCustomAsync(customLog);

            return ApiResponseService.SuccessResponse(response!.Result);
        }

        private async Task GenerateMainToken(LoginResponseDTO model)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(model.AccessToken);

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.Name, jwt.Claims.FirstOrDefault(u => u.Type == "unique_name")?.Value ?? string.Empty));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, jwt.Claims.FirstOrDefault(u => u.Type == "nameid")?.Value ?? string.Empty));
            identity.AddClaim(new Claim(ClaimTypes.Role, jwt.Claims.FirstOrDefault(u => u.Type == "role")?.Value ?? string.Empty));
            identity.AddClaim(new Claim("roleId", jwt.Claims.FirstOrDefault(u => u.Type == "roleId")?.Value ?? string.Empty));
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                //ExpiresUtc = DateTimeOffset.UtcNow.AddHours(4)
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(6)
            };
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);
            //await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }

        public async Task<IActionResult> Logout()
        {
            _tokenProvider.ClearToken();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SetUserUrl(string currentlocation)
        {
            var userId = GetUserId();
            UserPageVisitedLastCreateDTO obj = new();
            obj.UserID = Convert.ToInt64(userId);
            obj.PageUrl = currentlocation;

            var response = await _userPageVisitedLastService.CreateAsync<APIResponse>(obj);

            if(response == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(response.Result);

        }

        [Authorize]
        public async Task<IActionResult> MenuBuilder()
        {
            MultipleModel mm = new MultipleModel();
            var userId = GetUserId();

            var response = await _userRepository.MenuBuildAsync<APIResponse>(userId);

            var menuList = response.UnwrapResultOrDefault<List<MenuBuildDto>>();

            mm.menuBuildList = menuList;

            return PartialView("~/Views/Shared/_partialTopNavbar.cshtml", mm);

        }


        [Authorize]
        public IActionResult UnauthorizedAccess()
        {
            return View();
        }

        [HttpGet]
        public IActionResult ForgetPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgetPassword(string Email)
        {
            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            var forgetPasswordDto = new ForgetPasswordDto
            {
                Email = Email,
                CurrentUrl = currentUrl
            };
            var response = await _userRepository.ForgetPasswordMailSendasync<APIResponse>(forgetPasswordDto);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public IActionResult ResetPassword(string? Token = null)
        {
            var Email = HttpContext.Session.GetString("userEmail");
            if (Token == null && Email == null)
            {
                HttpContext.Session.Remove("userEmail");
                HttpContext.Session.Remove("token");

                return RedirectToAction("Index");
            }
            if (Token != null)
            {
                HttpContext.Session.SetString("token", Token);
                HttpContext.Session.Remove("userEmail");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<string> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var Email = HttpContext.Session.GetString("userEmail") ?? "";
            var Token = HttpContext.Session.GetString("token") ?? "";

            if (Token == null && Email == null)
            {
                APIResponse aPIResponse = new()
                {
                    ErrorMessages = new List<string>()
                    {
                        "Bad request"
                    },
                    Result = null!,
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                };
                return JsonConvert.SerializeObject(aPIResponse);
            }
            resetPasswordDto.Token = Token;
            resetPasswordDto.UserName = Email;
            var response = await _userRepository.ResetPasswordAsync<APIResponse>(resetPasswordDto);
            HttpContext.Session.Remove("userEmail");
            HttpContext.Session.Remove("token");
            var data = JsonConvert.SerializeObject(response);
            return data;
        }

        public async Task<IActionResult> UserActivation(string Token)
        {
            _tokenProvider.ClearToken();
            await HttpContext.SignOutAsync();
            try
            {
                var response = await _userRepository.UserActivation<APIResponse>(Token);
                if (response.IsSuccess && response.Result != null)
                {
                    ViewBag.FullName = response.Result.ToString();
                    ViewBag.Error = null!;
                }
                else
                {
                    ViewBag.Error = response.ErrorMessages.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
            }
            return View();
        }

        #region :: DashBoard

        [Authorize]
        public IActionResult Dashboard()
        {
            var userRoleId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == "roleId")?.Value);
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "";

            ViewData["UserRoleId"] = userRoleId;
            ViewData["UserName"] = userName.ToUpper();
            return View();
        }

        [Authorize]
        public async Task<IActionResult> GetDashboardHeaderTop()
        {
            MultipleModel mm = new MultipleModel();
            var userId = GetUserId();

            var response = await _dashboardService.GetAllProjectsOnDashBoardAsync<APIResponse>(userId);

            var projectList = response.UnwrapResultOrDefault<List<DashBoardHeaderDTO>>();

            mm.dashBoardHeaderDTO = projectList;

            return PartialView("~/Views/Home/_partialDashBoardProjectsList.cshtml", mm);

        }

        [Authorize]
        public async Task<IActionResult> GetDashboardProjectTask(long ProjectID)
        {
            MultipleModel mm = new MultipleModel();
            var userId = GetUserId();

            var response = await _dashboardService.GetDashboardProjectTaskAsync<APIResponse>(userId, ProjectID);

            var taskList = response.UnwrapResultOrDefault<List<DashBoardTaskHeaderDTO>>();

            mm.dashBoardTaskHeaderDTO = taskList;

            return PartialView("~/Views/Home/_partialDashBoardProjectTaskList.cshtml", mm);

        }

        [Authorize]
        public async Task<IActionResult> BuildIncompletePONew(long ProjectID, string actionName)
        {
            MultipleModel mm = new MultipleModel();
            var userId = GetUserId();

            var response = new APIResponse();

            if (actionName == "buildIncompletePONew")
            {
                response = await _dashboardService.GetIndividualProjectTaskDataAsync<APIResponse>(userId, ProjectID, actionName);
            }

            var incomplePoList = response.UnwrapResultOrDefault<List<IncompletePoDTO>>();

            var checkAuthResponse = await _purchaseOrderService.CheckAuthorityForPOEdit<APIResponse>(userId);
            ViewBag.IsEditable = Convert.ToString(checkAuthResponse.Result);

            mm.incompletePoDTO = incomplePoList;

            return PartialView("~/Views/Home/_partialDashBoardIndvTaskListDetails.cshtml", mm);

        }
        [Authorize]
        public async Task<IActionResult> BuildIncompleteProjectNew(long ProjectID, string actionName)
        {
            MultipleModel mm = new MultipleModel();
            var userId = GetUserId();

            var response = new APIResponse();

            if (actionName == "buildIncompleteProjectNew")
            {
                response = await _dashboardService.GetIndividualProjectTaskDataAsync<APIResponse>(userId, ProjectID, actionName);
            }

            mm.incompleteProjectDTO = response.UnwrapResultOrDefault<List<IncompleteProjectDTO>>();

            return PartialView("~/Views/Home/_partialincompleproject.cshtml", mm);

        }

        [Authorize]
        public async Task<IActionResult> BuildIndvProjectTaskListData(long ProjectID, string actionName)
        {
            var userId = GetUserId();
            var userRoleId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == "roleId")?.Value);
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;


            var mm = new MultipleModel
            {
                DashboardActionName = actionName,
                UserRoleid = userRoleId,
                UserId = userId,
                UserName = userName ?? ""
            };

            var response = await _dashboardService.GetIndividualProjectTaskDataAsync<APIResponse>(userId, ProjectID, actionName);

            var deserializers = new Dictionary<string, Action<object>>
            {
                ["buildIncompletePONew"] = result => mm.incompletePoDTO = Deserialize<List<IncompletePoDTO>>(result),
                ["buildIncompleteProjectNew"] = result => mm.incompleteProjectDTO = Deserialize<List<IncompleteProjectDTO>>(result),
                ["buildIncompleteVendorNew"] = result => mm.imcompleteVendorDTO = Deserialize<List<IncompleteVendorDTO>>(result),
                ["buildBudgetApprovalsNew"] = result => mm.incompleteBudgetDTO = Deserialize<List<IncompleteBudgetDTO>>(result),
                ["buildPOApprovalsNew"] = result => mm.incompleteTaskPoDTO = Deserialize<List<IncompleteTaskPoDTO>>(result),
                ["buildFabApprovalsNew"] = result => mm.incompleteFabDTO = Deserialize<List<IncompleteFabDTO>>(result),
                ["buildapprovedpotasknew"] = result => mm.incompleteApproveVendorPO = Deserialize<List<IncompleteApproveVendorPODTO>>(result),
                ["buildPOAcceptTasknew"] = result => mm.dashboardPOAccepted = Deserialize<List<DashboardPOAcceptedDTO>>(result),
                ["buildPORejectTasknew"] = result => mm.incompletePoReject = Deserialize<List<IncompletePoRejectDTO>>(result),
                ["buildBudgetRejectTasknew"] = result => mm.incompleteBudgetReject = Deserialize<List<IncompleteBudgetRejecDTO>>(result),
                ["buildPOCheckBackTasknew"] = result => mm.incompletePoCheckBack = Deserialize<List<IncompletePoCheckBackDTO>>(result),
                ["buildChangeStatustask"] = result => mm.fabApprovalStatusDashboard = Deserialize<List<FabApprovalStatusDashboardDTO>>(result),
                ["buildPOACTask"] = result => mm.dashBoardPoApprovalComments = Deserialize<List<DashBoardPoApprovalCommentsDTO>>(result),
                ["buildVendorConfirmationTasknew"] = result => mm.incompleteVendorConfirm = Deserialize<List<IncompleteVendorConfirmDTO>>(result)
            };

            if (response.IsSuccess && deserializers.TryGetValue(actionName, out var assignModel))
            {
                assignModel(response.Result ?? "");
            }

            var checkAuthResponse = await _purchaseOrderService.CheckAuthorityForPOEdit<APIResponse>(userId);
            ViewBag.IsEditable = Convert.ToString(checkAuthResponse.Result);

            return PartialView("~/Views/Home/_partialDashBoardIndvTaskListDetails.cshtml", mm);
        }


        [Authorize]
        public async Task<IActionResult> GetBudgetApprovalHistory(string ProjectID, string SectionID, string GroupID)
        {
            var userId = GetUserId();

            MultipleModel mm = new MultipleModel();

            var response = await _dashboardService.GetBudgetApprovalHistoryAsync<APIResponse>(ProjectID, SectionID, GroupID);

            var approvalHistory = response.UnwrapResultOrDefault<BudgetApprovalHstAndStatus>();

            mm.budgetApprovalHstAndStatus = approvalHistory;

            return PartialView("~/Views/Home/_partialDashboardBudgetApprovalHistory.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> ChangViewStatusDashboard(string ProjectId, string VendorId, string Number, string Mode)
        {
            var UserId = GetUserId();
            MultipleModel mm = new MultipleModel();

            var response = await _dashboardService.ChangViewStatusDashboardAsync<APIResponse>(ProjectId, VendorId, Number, Mode, UserId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetPOApprovalHistory(string LevelApprovalStatus, string POID)
        {
            var userId = GetUserId();

            MultipleModel mm = new MultipleModel();
            ViewData["LevelApprovalStatus"] = LevelApprovalStatus;

            var PoHistoryResponce = await _dashboardService.GetIncompletePoHistoryAsync<APIResponse>(POID, userId);

            var PoHistory = PoHistoryResponce.UnwrapResultOrDefault<List<IncompletePoHistoryDTO>>();

            mm.incompletePoHistoryDTO = PoHistory;

            return PartialView("~/Views/Home/_partialDashboardPOApprovalHistory.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetPOOverCommited(string POID, string ProjectId)
        {
            MultipleModel mm = new MultipleModel();

            var PoCommitedResponce = await _dashboardService.GetIncompletePoOverCommitedAsync<APIResponse>(POID, ProjectId);

            var PoCommited = PoCommitedResponce.UnwrapResultOrDefault<List<IncompletePOOverCommitedDTO>>();

            mm.incompletePOOverCommitedDTO = PoCommited;

            return PartialView("~/Views/Home/_PartialDashbordPOOverCommitedModal.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetProjectUserTypeOnDashboard(long POItemApprovalID)
        {
            var userId = GetUserId();
            var usertypeResponse = await _dashboardService.GetProjectUserTypeOnDashboardAsync<APIResponse>(POItemApprovalID, userId);

            if (usertypeResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if (!usertypeResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(usertypeResponse.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(usertypeResponse.Result);
        }

        [Authorize]
        public async Task<IActionResult> GetFabIndvHistoryOnDashboard(string PoLineItemApprovalID)
        {
            var UserId = GetUserId();
            var fabhistoryItemListResponse = await _purchaseOrderService.GetFabIndvHistoryAsync<APIResponse>(PoLineItemApprovalID, UserId.ToString());

            var fabHistoryItemList = fabhistoryItemListResponse.UnwrapResultOrDefault<List<FabricationHistoryDTO>>();

            var mm = new MultipleModel
            {
                fabricationHistoryDashboard = fabHistoryItemList
            };

            return PartialView("~/Views/Home/_partialDashboardFabricationHistory.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> ApprovePOSendToVendorDismissTask(string PoIds)
        {
            var UserId = GetUserId();
            MultipleModel mm = new MultipleModel();

            var response = await _dashboardService.PostApprovePOSendToVendorDismissTaskAsync<APIResponse>(PoIds, UserId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> VendorMailSendDashboard(VendorMailSendDashboardDTO model)
        {

            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            model.CurrentUrl = currentUrl;

            var UserId = GetUserId();
            model.UserId = UserId;


            var response = await _dashboardService.VendorMailSendDashboardAsync<APIResponse>(model);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to update user page information at the moment. Please try again later.");

            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Failed to update user page information.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [Authorize]
        public async Task<string> CompleteVendorConfirmation(string Poids, string Comment)
        {
            var UserId = GetUserId();
            if (string.IsNullOrEmpty(Comment))
            {
                Comment = "EMPTY";
            }
            var errors = new List<string>();
            var response = await _dashboardService.AcceptVendorPODashboardAsync<APIResponse>(Poids, Comment, UserId);

            if (!response.IsSuccess)
            {
                errors.Add($"AcceptVendorPODashboard failed: {response.ErrorMessages}");
            }
            else
            {
                foreach (var poid in Poids.Split(","))
                {
                    var commitResponse = await _dashboardService.POCommitOnDashboardAsync<APIResponse>(poid, UserId);
                    if (!commitResponse.IsSuccess)
                    {
                        errors.Add($"POCommit failed for POID {poid}: {commitResponse.ErrorMessages}");
                    }
                }
            }

            if (errors.Any())
            {
                response.IsSuccess = false;
                response.ErrorMessages = errors;
            }
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> VendorMailSendPDF(VendorMailSendDashboardDTO model)
        {

            if (string.IsNullOrEmpty(model.Project_ID))
            {
                return ApiResponseService.BadRequestResponse("Project_ID can not be null or empty");
            }

            if (string.IsNullOrEmpty(model.Poid))
            {
                return ApiResponseService.BadRequestResponse("Poid can not be null or empty");
            }

            APIResponse VendorPdfMailResponse = new();

            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            model.CurrentUrl = currentUrl;

            var UserId = GetUserId();
            model.UserId = UserId;

            var VendorList = JsonConvert.DeserializeObject<List<string>>(model.MailContactMap ?? "") ?? new();

            foreach (var vendor in VendorList)
            {
                var parts = vendor.Split('^');
                var vendorId = parts[0];
                var email = parts[1];


                var insertToFolder = InsertToFolder(UserId, "");

                if (insertToFolder != "Success")
                    return ApiResponseService.InternalServerResponse(insertToFolder);

                var insertTerms = await InsertTerms(model.Project_ID, UserId);

                if (insertTerms != "Success")
                    return ApiResponseService.InternalServerResponse(insertTerms);

                foreach (var item in model.Poid.Split(","))
                {
                    var Poid = item;

                    var IsCommitPO = await _dashboardService.POCommitOnDashboardAsync<APIResponse>(Poid, UserId);

                    if (IsCommitPO == null)
                        return ApiResponseService.InternalServerResponse("Unable to process the request.");
                    if (!IsCommitPO.IsSuccess)
                        return ApiResponseService.BadRequestResponse(IsCommitPO.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

                    var POReportFilePath = await PurchaseOrderReportGeneration(Poid, "0");
                    if (POReportFilePath != "Success")
                        return ApiResponseService.InternalServerResponse("Succesfully done PO commit but can not generate purchase order report and accept vendor!");

                    var CompleteVendorConfirm = await _dashboardService.AcceptVendorPODashboardAsync<APIResponse>(Poid, "EMPTY", UserId);
                    if (!CompleteVendorConfirm.IsSuccess)
                        return ApiResponseService.InternalServerResponse("Succesfully done PO commit and generate purchase order report but error on accept vendor!");
                }

                var ZipFileName = DownloadZipFile(UserId);

                if (ZipFileName.StartsWith("Error"))
                    return ApiResponseService.InternalServerResponse(ZipFileName);

                var zipFilePaths = new List<string>();

                zipFilePaths.Add(Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "GeneratedZipFiles", ZipFileName));
                //zipFilePaths.Add(Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "BRIDGE DOWNLOAD-2025.05.01.zip"));

                var zipFiles = new List<IFormFile>();
                foreach (var path in zipFilePaths)
                {
                    if (System.IO.File.Exists(path))
                    {
                        zipFiles.Add(await FormFileHelper.GetFormFileFromPathAsync(path));
                    }
                }

                var vendorMailSendPDF = new VendorMailSendPDFDashboardDTO
                {
                    Mailsubject = model.Mailsubject,
                    Mailbody = model.Mailsubject,
                    Poids = model.Poid,
                    Project_ID = model.Project_ID,
                    Addcc = model.Addcc,
                    VendorId = vendorId,
                    Email = email,
                    CurrentUrl = currentUrl,
                    UserId = UserId,
                    ZipFile = zipFiles
                };

                VendorPdfMailResponse = await _dashboardService.VendorMailSendPDFASync<APIResponse>(vendorMailSendPDF);
            }

            return ApiResponseService.SuccessResponse(VendorPdfMailResponse.Result);
        }

        //private static async Task<IFormFile> GetFormFileFromPathAsync(string filePath)
        //{
        //    byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        //    var memoryStream = new MemoryStream(fileBytes);
        //    var fileName = Path.GetFileName(filePath);
        //    var contentType = MimeTypeHelper.GetMimeType(fileName);

        //    var formFile = new FormFile(memoryStream, 0, fileBytes.Length, "File", Path.GetFileName(filePath))
        //    {
        //        Headers = new HeaderDictionary(),
        //        ContentType = contentType
        //    };

        //    return formFile;
        //}

        private string InsertToFolder(long UserId, string attachments = "")
        {
            char[] delimiters = new char[] { '^' };
            string[] attachmentsArr = attachments.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{UserId}_TempFolder");

            if (Directory.Exists(tempFolder))
            {
                Directory.Delete(tempFolder, true);
            }
            Directory.CreateDirectory(tempFolder);
            Directory.CreateDirectory(tempFolder + "/Attachments");
            Directory.CreateDirectory(tempFolder + "/PO");

            foreach (var a in attachmentsArr)
            {
                try
                {
                    string srcFile = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "ProjectFiles", a);
                    string destFile = Path.Combine(tempFolder, "Attachments", a);

                    if (System.IO.File.Exists(srcFile))
                    {
                        System.IO.File.Copy(srcFile, destFile, true);
                    }
                    else
                    {
                        return $"Error: Attachment file not found: {a}";
                    }
                }
                catch (Exception fileEx)
                {
                    return $"Error copying file {a}: {fileEx.Message}";
                }

            }
            return "Success";
        }

        private async Task<string> InsertTerms(string ProjectId, long UserId)
        {
            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{UserId}_TempFolder");
            var result = await _purchaseOrderService.GetFormattedTermFiles<APIResponse>(ProjectId);

            if (!result.IsSuccess)
            {
                return $"Error: Failed to fetch formatted term files. {result.ErrorMessages?.FirstOrDefault()}";
            }

            var dict = new Dictionary<string, string>();

            string jsonString = JsonConvert.SerializeObject(result);
            var jsonObject = JObject.Parse(jsonString);

            if (!jsonObject.TryGetValue("Result", out var resultToken) || resultToken is null)
            {
                return "Error: Result data not found.";
            }

            var data = resultToken.ToObject<List<string>>();

            if (data == null || data.Count == 0)
            {
                return "Error: No term files returned.";
            }

            foreach (var item in data)
            {
                string[] values = item.Split("^", StringSplitOptions.RemoveEmptyEntries);

                string FileName;
                string filename1;
                if (values.Length == 4)
                {
                    FileName = $"{values[0]}~~{values[1]}";
                    filename1 = values[3];
                }
                else
                {
                    FileName = values[0];
                    filename1 = values[2];
                }
                if (dict.ContainsKey(filename1))
                    dict[filename1] += $"^{FileName}";
                else
                    dict[filename1] = FileName;
            }

            foreach (var pair in dict)
            {

                string[] values2 = pair.Value.Split("^", StringSplitOptions.RemoveEmptyEntries);
                string outname = pair.Key;

                if (values2.Length > 1)
                {
                    int i = 1;
                    foreach (var f in values2)
                    {
                        if (f.Contains("~~"))
                        {
                            var filename = f.Replace("~~", "^");
                            string tmpfilename = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "SystemTermsFiles", filename);
                            System.IO.File.Copy(tmpfilename, tempFolder + "/Attachments/" + Convert.ToString(i) + "." + outname, true);
                        }
                        else
                        {
                            string tmpfilename = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "TermsConditionFiles", f);
                            if (System.IO.File.Exists(tmpfilename))
                            {
                                System.IO.File.Copy(tmpfilename, Path.Combine(tempFolder, "Attachments", Convert.ToString(i) + "." + outname), true);
                            }
                            else
                            {
                                //Console.WriteLine("File not found: " + tmpfilename);
                                return $"Error: File not found - {tmpfilename}";
                            }
                        }

                        i++;
                    }
                }
                else
                {
                    if (values2[0].Contains("~~"))
                    {
                        var filename = values2[0].Replace("~~", "^");
                        string tmpfilename = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "SystemTermsFiles", filename);
                        System.IO.File.Copy(tmpfilename, Path.Combine(tempFolder, "Attachments", outname), true);
                    }
                    else
                    {
                        string tmpfilename = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "TermsConditionFiles", values2[0]);
                        if (System.IO.File.Exists(tmpfilename))
                        {
                            System.IO.File.Copy(tmpfilename, Path.Combine(tempFolder, "Attachments", outname), true);
                        }
                        else
                        {
                            //Console.WriteLine("File not found: " + tmpfilename);
                            return $"Error: File not found - {tmpfilename}";
                        }
                    }
                }
            }

            return "Success";
        }

        private string DownloadZipFile(long UserId, string folderName = "DATE")
        {
            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{UserId}_TempFolder");
            string startPath = tempFolder;
            int day = DateTime.Now.Day;
            string day1 = string.Empty;
            if (day < 10)
            {
                day1 = "0" + day.ToString();
            }
            else
            {
                day1 = day.ToString();
            }

            int month = DateTime.Now.Month;
            string month1 = "";
            if (month < 10)
            {
                month1 = "0" + month.ToString();
            }
            else
            {
                month1 = month.ToString();
            }

            string datestr = DateTime.Now.Year + "." + month1 + "." + day1;
            if (folderName != "DATE")
            {
                datestr = Guid.NewGuid().ToString();
            }

            string filename = $"BRIDGE DOWNLOAD-{datestr}.zip";
            string zipPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "GeneratedZipFiles", filename);

            if (Directory.GetFiles(tempFolder + "/Attachments").Count() == 0)
            {
                Directory.Delete(tempFolder + "/Attachments");
            }
            if (Directory.GetFiles(tempFolder + "/PO").Count() == 0)
            {
                Directory.Delete(tempFolder + "/PO");
            }
            if (System.IO.File.Exists(zipPath))
            {
                System.IO.File.Delete(zipPath);
            }

            if (Directory.Exists(startPath))
            {
                ZipFile.CreateFromDirectory(startPath, zipPath);
                Directory.Delete(tempFolder, true);
            }
            else
            {
                return $"Error: Temp folder not found for UserId {UserId}.";
            }

            //var downloadZipPath = filename;

            return filename;
        }

        [Authorize]
        public async Task<string> PurchaseOrderReportGeneration(string PurchaseOrderID, string showImageFlag)
        {
            var UserId = GetUserId();
            var userName = Convert.ToString(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value) ?? "";

            var reportName = "PurchaseOrder";

            string reportFolderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{UserId}_TempFolder", "PO");

            string fileName = await GetFileNameForPOReport(PurchaseOrderID);

            var reportPoparam = await FetchPOReportParams(PurchaseOrderID, UserId);
            if (reportPoparam == null)
            {
                return $"Error: Failed to fetch report parameters.";
            }

            string absoluteUri = GetPurchaseOrderImagePath();

            var parameters = GenerateReportParameters(reportPoparam, userName, UserId, PurchaseOrderID, showImageFlag, "Y", absoluteUri);

            string filePath = Path.Combine(reportFolderPath, fileName);
            string exportFormat = "PDF";

            var pdfFileData = await _ssrsReportService.GetReportAsync(reportName, parameters, exportFormat);

            if (pdfFileData == null)
            {
                return JsonConvert.SerializeObject(ApiResponseService.InternalServerResponse("Failed to generate the report."));
            }

            await WriteFile(filePath, pdfFileData);

            return "Success";

        }

        private async Task<string> GetFileNameForPOReport(string purchaseOrderID)
        {
            var response = await _reportService.GetPoDetailsNameForPOReportAsync<APIResponse>(purchaseOrderID);

            if (!response.IsSuccess && response.Result == null)
                return "PurchaseOrder.pdf";

            //var poNameDto = JsonConvert.DeserializeObject<SingleResultDTO>(response.Result?.ToString()!) ?? new SingleResultDTO();

            var safeName = response.Result!.ToString() ?? "PurchaseOrder";

            char[] invalidChars = Path.GetInvalidFileNameChars().Concat(Path.GetInvalidPathChars()).ToArray();

            return $"{new string(
                safeName.Where(c => !invalidChars.Contains(c)).ToArray()
            )}.pdf";
        }

        private async Task<POReportParamDTO?> FetchPOReportParams(string purchaseOrderID, long userId)
        {
            var response = await _reportService.GetParamDetailsForPOReportAsync<APIResponse>(purchaseOrderID, userId.ToString());

            var result = response.UnwrapResultOrDefault<POReportParamDTO>();

            return result;
        }
        private string GetPurchaseOrderImagePath()
        {
            string imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "PURCHASE-ORDER-PROOF-ONLY.png");
            return System.IO.File.Exists(imagePath) ? new Uri(imagePath).AbsoluteUri : "";
        }

        private async Task WriteFile(string filePath, byte[] data)
        {
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            await System.IO.File.WriteAllBytesAsync(filePath, data);
        }

        private Dictionary<string, string> GenerateReportParameters(POReportParamDTO reportPoparam, string userName, long userId, string purchaseOrderID, string showImageFlag, string isCommited, string absoluteUri)
        {
            return new Dictionary<string, string>
            {
                { "InvoiceTo", reportPoparam.InvoiceTo?.Replace("\n", "<br>") ?? "" },
                { "ShipTo", reportPoparam.ShipTo ?? "" },
                { "ProjectNumber", reportPoparam.ProjectNumber ?? "" },
                { "PurchaseOrderID", reportPoparam.PurchaseOrderID ?? "" },
                { "ContactAddress", reportPoparam.ContactAddress ?? "" },
                { "Fax", reportPoparam.Fax ?? "" },
                { "VNote", reportPoparam.VNote ?? "" },
                { "IssueDate", reportPoparam.IssueDate ?? "" },
                { "Terms", reportPoparam.Terms ?? "" },
                { "ArrivalDate", reportPoparam.ArrivalDate ?? "" },
                { "Remarks", reportPoparam.Remarks ?? "" },
                { "SpecialShippingInstructions", reportPoparam.SpecialShippingInstructions ?? "" },
                { "ContactName", reportPoparam.ContactName ?? "" },
                { "FOB", reportPoparam.FOB ?? "" },
                { "UserName", userName },
                { "UserMailID", reportPoparam.UserEmail ?? "" },
                { "ShipMethod", reportPoparam.ShipMethod ?? "" },
                { "Comment", reportPoparam.Comment ?? "" },
                { "Currency", reportPoparam.Currency ?? "" },
                { "PurchaseOrderImage", (showImageFlag == "1" || isCommited == "N") ? absoluteUri : string.Empty },
                { "BuyerName", reportPoparam.BuyerName ?? "" },
                { "BuyerEmail", reportPoparam.BuyerEmail ?? "" },
                { "ProjectName", reportPoparam.ProjectName ?? "" },
                { "CurrencyCode", reportPoparam.CurrencyCode ?? "" },
                { "LegalName", reportPoparam.LegalName ?? "" },
                { "mode", "DATASET" },
                { "UserId", userId.ToString() },
                { "POID", purchaseOrderID }
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<string> ApprovePOBatch()
        {
            if (!Request.Form.TryGetValue("POID", out var poId) ||
                !Request.Form.TryGetValue("UserID", out var userId))
            {
                return JsonConvert.SerializeObject(
                    ApiResponseService.BadRequestResponse("Required form values are missing.")
                );
            }

            Request.Form.TryGetValue("Comment", out var comment);

            string POID = poId.ToString();
            string UserID = userId.ToString();
            string Comment = string.IsNullOrWhiteSpace(comment)
                ? "EMPTY"
                : comment.ToString();

            var LoggedInUserId = GetUserId();

            string ManagerID = "";

            if (UserID != "0")
            {
                ManagerID = LoggedInUserId.ToString();
            }
            else
            {
                UserID = LoggedInUserId.ToString();
                ManagerID = "0";
            }

            var approvedPoResponce = await _dashboardService.ApprovePOBatchOnDashboard<APIResponse>(UserID, ManagerID, POID, Comment);
            if (approvedPoResponce.IsSuccess == false)
            {
                return JsonConvert.SerializeObject(approvedPoResponce);
            }

            await _logService.LogCustomAsync($"Approved Purchased Order ID :- {POID} , UserId :- {UserID}");

            var result = approvedPoResponce.Result?.ToString() ?? "";


            string filname = string.Empty;

            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {

                    var file = Request.Form.Files[i];

                    string fname = Path.GetFileNameWithoutExtension(file.FileName);
                    string ext = Path.GetExtension(file.FileName);
                    fname = fname.Replace(",", "_");
                    fname = $"{result}_{fname}{ext}";

                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets/POApprovals");

                    FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fname));
                    using (FileStream stream = fileInfo.OpenWrite())
                    {
                        file.CopyTo(stream);
                        filname += filname == "" ? fname : "$$$$" + fname;
                    }
                }

            }

            if (filname != "")
            {
                var requestPoApprovalFilePathDTO = new RequestPoApprovalFilePathDTO
                {
                    ApprovalId = result,
                    FileName = filname,
                    LoggedInUserId = LoggedInUserId
                };
                await _dashboardService.PostPoApprovalFilePath<APIResponse>(requestPoApprovalFilePathDTO);
            }

            var nextLevelMailResponce = await _dashboardService.CheckApprovarMailSendForNextLevelAsync<APIResponse>(POID, UserID);

            //var json = JsonConvert.SerializeObject(nextLevelMailResponce);

            return JsonConvert.SerializeObject(nextLevelMailResponce);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> RejectPO()
        {

            if (!Request.Form.TryGetValue("UserID", out var userId) ||
                !Request.Form.TryGetValue("POID", out var poId) ||
                !Request.Form.TryGetValue("Comment", out var comment))
            {
                return ApiResponseService.BadRequestResponse("Required form values are missing.");
            }

            string UserID = userId.ToString();
            string POID = poId.ToString();
            string Comment = comment.ToString();

            var LoggedInUserId = GetUserId();

            string ManagerID = "";

            if (UserID != "0")
            {
                ManagerID = LoggedInUserId.ToString();
            }
            else
            {
                UserID = LoggedInUserId.ToString();
                ManagerID = "0";
            }

            var RejectPoResponce = await _dashboardService.RejectPOOnDashboard<APIResponse>(UserID, ManagerID, POID, Comment);

            if (RejectPoResponce == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!RejectPoResponce.IsSuccess)
                return ApiResponseService.BadRequestResponse(RejectPoResponce.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");


            var result = RejectPoResponce.Result?.ToString() ?? "";


            string filname = string.Empty;

            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {

                    var file = Request.Form.Files[i];

                    string fname = Path.GetFileNameWithoutExtension(file.FileName);
                    string ext = Path.GetExtension(file.FileName);
                    fname = fname.Replace(",", "_");
                    fname = $"{result}_{fname}.{ext}";

                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets/POApprovals");

                    FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fname));
                    using (FileStream stream = fileInfo.OpenWrite())
                    {
                        file.CopyTo(stream);
                        filname += filname == "" ? fname : "$$$$" + fname;
                    }
                }

            }

            if (filname != "")
            {
                var requestPoApprovalFilePathDTO = new RequestPoApprovalFilePathDTO
                {
                    ApprovalId = result,
                    FileName = filname,
                    LoggedInUserId = LoggedInUserId
                };
                await _dashboardService.PostPoApprovalFilePath<APIResponse>(requestPoApprovalFilePathDTO);
            }

            return ApiResponseService.SuccessResponse(RejectPoResponce.Result);
        }

        [Authorize]
        public async Task<string> SendMailForPOApprovalBatch_New(string TempEmailID, string USERNAME, string POS, string PROJECTNAME)
        {
            var request = HttpContext.Request;
            var CurrentUrl = $"{request.Scheme}://{request.Host}";

            var response = await _dashboardService.SendMailForPOApprovalBatch_NewAsync<APIResponse>(CurrentUrl, TempEmailID, USERNAME, POS, PROJECTNAME);
            return JsonConvert.SerializeObject(response);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CommentPO()
        {
            if (!Request.Form.TryGetValue("UserID", out var userId) ||
                !Request.Form.TryGetValue("POID", out var poId) ||
                !Request.Form.TryGetValue("Comment", out var comment))
            {
                return ApiResponseService.BadRequestResponse("Required form values are missing.");
            }

            string UserID = userId.ToString();
            string POID = poId.ToString();
            string Comment = comment.ToString();

            var LoggedInUserId = GetUserId();

            string ManagerID = "";

            if (UserID != "0")
            {
                ManagerID = LoggedInUserId.ToString();
            }
            else
            {
                UserID = LoggedInUserId.ToString();
                ManagerID = "0";
            }

            var RejectPoResponce = await _dashboardService.CommentPOOnDashboard<APIResponse>(UserID, ManagerID, POID, Comment);

            if (RejectPoResponce == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!RejectPoResponce.IsSuccess)
                return ApiResponseService.BadRequestResponse(RejectPoResponce.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");


            var result = RejectPoResponce.Result?.ToString() ?? "";


            string filname = string.Empty;

            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {

                    var file = Request.Form.Files[i];

                    string fname = Path.GetFileNameWithoutExtension(file.FileName);
                    string ext = Path.GetExtension(file.FileName);
                    fname = fname.Replace(",", "_");
                    fname = $"{result}_{fname}.{ext}";

                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets/POApprovals");

                    FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fname));
                    using (FileStream stream = fileInfo.OpenWrite())
                    {
                        file.CopyTo(stream);
                        filname += filname == "" ? fname : "$$$$" + fname;
                    }
                }

            }

            if (filname != "")
            {
                var requestPoApprovalFilePathDTO = new RequestPoApprovalFilePathDTO
                {
                    ApprovalId = result,
                    FileName = filname,
                    LoggedInUserId = LoggedInUserId
                };
                await _dashboardService.PostPoApprovalFilePath<APIResponse>(requestPoApprovalFilePathDTO);
            }

            return ApiResponseService.SuccessResponse(RejectPoResponce.Result);
        }

        [Authorize]
        public async Task<string> ApproveBudget(ApproveBudgetPostDTO approveBudgetPostDTO)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (approveBudgetPostDTO.ManagerID != "0")
            {
                userId = approveBudgetPostDTO.ManagerID;
                approveBudgetPostDTO.ManagerID = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            approveBudgetPostDTO.UserId = userId;
            var response = await _dashboardService.ApproveBudget<APIResponse>(approveBudgetPostDTO);
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        public async Task<string> CompleteRejectedTaskDashboard(string poids)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompleteRejectedTaskDashboardAsync<APIResponse>(poids, userId);
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        public async Task<string> CompleteRejectedBudgetTaskDashboard(string budgetIds)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompleteRejectedBudgetTaskDashboard<APIResponse>(budgetIds, userId);
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        public async Task<string> CompletePoCommentTaskDashboard(string poids)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompletePoCommentTaskDashboardAsync<APIResponse>(poids, userId);
            return JsonConvert.SerializeObject(response);
        }
        [Authorize]
        public async Task<string> CompletePoAcceptTaskDashboard(string poids)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompletePoAcceptTaskDashboardAsync<APIResponse>(poids, userId);
            return JsonConvert.SerializeObject(response);
        }
        [Authorize]
        public async Task<string> CompleteChangeStatusTaskDashboard(string poids)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompleteChangeStatusTaskDashboardAsync<APIResponse>(poids, userId);
            return JsonConvert.SerializeObject(response);
        }
        [Authorize]
        public async Task<string> CompletePoCheckBackTaskDashboard(string poids)
        {
            var userId = GetUserId();
            var response = await _dashboardService.CompletePoCheckBackTaskDashboardAsync<APIResponse>(poids, userId);
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        public async Task<IActionResult> PODetailsandFilesToshow(string POID)
        {
            MultipleModel mm = new();

            var response = await _dashboardService.PODetailsandFileToshow<APIResponse>(POID);
            var pODetailsandPOFilesDTO = response.UnwrapResultOrDefault<PODetailsandPOFilesDTO>();

            var response1 = await _dashboardService.CheckTerms<APIResponse>(POID);
            var checktermsDTO = response1.UnwrapResultOrDefault<List<checktermsDTO>>();

            mm.PODetailsandPOFilesDTO = pODetailsandPOFilesDTO;
            mm.ChecktermsDTOList = checktermsDTO;
            return PartialView("~/Views/Home/_partialPODetailsAndFiles.cshtml", mm);
        }

        [Authorize]
        public async Task<string> RejectBudget(ApproveBudgetPostDTO approveBudgetPostDTO)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (approveBudgetPostDTO.ManagerID != "0")
            {
                userId = approveBudgetPostDTO.ManagerID;
                approveBudgetPostDTO.ManagerID = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            approveBudgetPostDTO.UserId = userId;
            var response = await _dashboardService.RejectBudget<APIResponse>(approveBudgetPostDTO);
            return JsonConvert.SerializeObject(response);
        }

        [Authorize]
        public async Task<IActionResult> GetGroupById(string GroupId)
        {
            MultipleModel mm = new();
            var response = await _dashboardService.GetGroupById<APIResponse>(GroupId);

            mm.BudgetGroupListDashboard = response.UnwrapResultOrDefault<List<BudgetGroupGetByIdDTO>>();

            return PartialView("~/Views/Home/_PartialBudgetGroupModal.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetApprovalHistoryTableInDashboard(string ProjectId, string SectionId, string GroupId)
        {

            if (SectionId == "undefined" || SectionId == null)
            {
                SectionId = "0";
            }

            MultipleModel mm = new MultipleModel();

            var response = await _dashboardService.GetApprovalHistoryOnDashboard<APIResponse>(ProjectId, GroupId);

            mm.budgetApprovalHstAndStatus = response.UnwrapResultOrDefault<BudgetApprovalHstAndStatus>();

            return PartialView("~/Views/Home/_partialDashboardBudgetApprovalHistory.cshtml", mm);

        }
        #endregion

        #region ::MySettings
        public async Task<IActionResult> MySettings()
        {
            return View();
        }

        public async Task<string> UpdatepassWord(UpdatePasswordparamsDTO updatePasswordparamsDTO)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            updatePasswordparamsDTO.UserID = userId;
            var response = await _dashboardService.UpdatePassWord<APIResponse>(updatePasswordparamsDTO);

            return JsonConvert.SerializeObject(response);
        }
        #endregion

        #region :: OTP Verification Page

        public async Task<IActionResult> OTPVerification(string UserId)
        {
            ViewBag.UserId = UserId;
            return View();
        }
        public async Task<string> SendOTP(string UserId)
        {
            OTPRequestDTO oTPRequestDTO = new();
            oTPRequestDTO.UserId = Convert.ToInt64(UserId);
            var fullUrl = $"{Request.Scheme}://{Request.Host}";
            oTPRequestDTO.CurrentUrl = fullUrl;

            var response = await _userRepository.SendOTPasync<APIResponse>(oTPRequestDTO);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<string> verifyotp(OTPRequestDTO OTPRequestDTO)
        {
            var hostname = HttpContext.Request.Host.Host;
            OTPRequestDTO.Hostname = $"{hostname}";
            await HttpContext.SignOutAsync();
            _tokenProvider.ClearToken();

            var response = await _userRepository.VerifyOtpAsync<APIResponse>(OTPRequestDTO);
            var model = new LoginResponseDTO();

            if (response.IsSuccess && response.Result != null)
            {
                model = response.UnwrapResultOrDefault<LoginResponseDTO>();

                if (string.IsNullOrEmpty(model.AccessToken))
                {
                    return JsonConvert.SerializeObject(response);
                }

                await GenerateMainToken(model);
                _tokenProvider.SetToken(model.AccessToken);
            }
            return JsonConvert.SerializeObject(response);
        }
        #endregion

        [Authorize]
        public async Task<string> GetUserPreferences()
        {
            var userId = GetUserId();
            var response = await _userRepository.GetUserPreference<APIResponse>(userId);
            return JsonConvert.SerializeObject(response);

        }

        [Authorize]
        [HttpPost]
        public async Task<string> SetUserPreferences([FromBody] List<UserPreferenceDto> preferences)
        {
            var userId = GetUserId();
            var response = await _userRepository.UpdateUserPreferenceAsync<APIResponse>(preferences, userId);
            return JsonConvert.SerializeObject(response);

        }
    }
}
