using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Report;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    [Authorize]
    public class ReportsController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogService _logService;
        private readonly IReportService _reportService;
        private readonly ISSRSReportService _ssrsReportService;
        private readonly IExcelPostProcessor _excelPostProcessor;

        public ReportsController(IWebHostEnvironment webHostEnvironment, ILogService logService, IReportService reportService, ISSRSReportService ssrsReportService, IExcelPostProcessor excelPostProcessor)
        {
            _webHostEnvironment = webHostEnvironment;
            _logService = logService;
            _reportService = reportService;
            _ssrsReportService = ssrsReportService;
            _excelPostProcessor = excelPostProcessor;
        }

        #region :: Global Action For Report

        private string SafeValue(string? value) => value ?? "";

        private long GetUserId()
        {
            return Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        }

        private string GetUserName()
        {
            return Convert.ToString(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value) ?? "";
        }

        private string EnsureDirectoryExists(params string[] paths)
        {
            string directoryPath = Path.Combine(paths);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            return directoryPath;
        }

        private async Task WriteFile(string filePath, byte[] data)
        {
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            await System.IO.File.WriteAllBytesAsync(filePath, data);
        }

        private async Task<RptDesignDTO?> GetReportDesignAsync(RptHeaderDTO rptHeaderDTO)
        {
            var response = await _reportService.GETReportDesignContentAsync<APIResponse>(rptHeaderDTO);

            if (!response.IsSuccess || response.Result == null)
                return null;

            return JsonConvert.DeserializeObject<RptDesignDTO>(Convert.ToString(response.Result)!);
        }

        [AllowAnonymous]
        private async Task<RptDesignDTO?> GetReportDesignAsyncForReportWarmUp(RptHeaderDTO rptHeaderDTO)
        {
            var response = await _reportService.GETReportDesignContentAsyncForReportWarm<APIResponse>(rptHeaderDTO);

            if (!response.IsSuccess || response.Result == null)
                return null;

            return JsonConvert.DeserializeObject<RptDesignDTO>(Convert.ToString(response.Result)!);
        }

        public async Task<APIResponse> GenerateReport(string reportName, string fileName, Dictionary<string, string> parameters, string exportFormat)
        {
            string reportFolderPath = EnsureDirectoryExists("wwwroot", "Assets", "Reports");
            string filePath = Path.Combine(reportFolderPath, fileName);

            var pdfFileData = await _ssrsReportService.GetReportAsync(reportName, parameters, exportFormat);

            if (pdfFileData == null)
                return ApiResponseService.InternalServer("Failed to generate the report.");

            await WriteFile(filePath, pdfFileData);
            return ApiResponseService.Success($"/Assets/Reports/{fileName}");
        }

        private async Task<APIResponse> GenerateAndPostProcessReportAsync(string reportName, string exportFormat, Dictionary<string, string> parameters)
        {
            string extension = ReportHelper.GetFileExtension(exportFormat);
            string fileName = $"{reportName}.{extension}";

            var reportResult = await GenerateReport(
                reportName,
                fileName,
                parameters,
                exportFormat.ToUpper()
            );

            if (!reportResult.IsSuccess)
            {
                return reportResult;
            }

            if (exportFormat.Equals("EXCELOPENXML", StringComparison.OrdinalIgnoreCase))
            {
                var excelUrl = reportResult.Result?.ToString();
                if (!string.IsNullOrWhiteSpace(excelUrl))
                {
                    string excelFilePath = Path.Combine(
                        _webHostEnvironment.WebRootPath,
                        excelUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar)
                    );

                    var context = new ExcelPostProcessContextDTO
                    {
                        FilePath = excelFilePath,
                        ReportType = reportName,
                        Parameters = parameters
                    };

                    await _excelPostProcessor.ProcessAsync(context).ConfigureAwait(false);
                }
            }

            return reportResult;
        }

        //[HttpGet]
        //public async Task<IActionResult> ShowEmbeddedReport()
        //{
        //    // Access all query params
        //    IQueryCollection queryParams = Request.Query;

        //    // Extract reportName and isPdf
        //    string reportName = queryParams["reportName"];
        //    int? isPdf = null;
        //    if (int.TryParse(queryParams["isPdf"], out int parsedPdf))
        //    {
        //        isPdf = parsedPdf;
        //    }

        //    // Filter out reserved keys and build the parameters dictionary
        //    var parameters = queryParams
        //        .Where(kvp => !string.Equals(kvp.Key, "reportName", StringComparison.OrdinalIgnoreCase)
        //                   && !string.Equals(kvp.Key, "isPdf", StringComparison.OrdinalIgnoreCase))
        //        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());


        //    // Decide output format
        //    string format = (isPdf.HasValue && isPdf.Value == 1) ? "PDF" : "HTML4.0";

        //    // Construct SSRS URL
        //    string reportUrl = $"{_settings.ReportServerUrl}?/{_settings.ReportPath}{reportName}&rs:Format={format}";

        //    // Send parameters via POST
        //    var content = new FormUrlEncodedContent(parameters);

        //    using var client = _clientFactory.CreateClient("SSRSBridgeReport");
        //    var response = await client.PostAsync(reportUrl, content);

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        return StatusCode((int)response.StatusCode, "Failed to load report");
        //    }

        //    var reportBytes = await response.Content.ReadAsByteArrayAsync();

        //    if (format == "PDF")
        //    {
        //        return File(reportBytes, "application/pdf", $"{reportName}.pdf");
        //    }
        //    else
        //    {
        //        string htmlContent = System.Text.Encoding.UTF8.GetString(reportBytes);
        //        return Content(htmlContent, "text/html");
        //    }

        //    // Now you have:
        //    // reportName => string
        //    // isPdf => int?
        //    // parameters => Dictionary<string, string> with only SSRS params

        //    // TODO: Generate SSRS report using above values

        //}


        #endregion

        public async Task<IActionResult> Report()
        {
            MultipleModel mm = new();
            var UserId = GetUserId();
            var response = await _reportService.GetReportDataAsync<APIResponse>(UserId);

            var data = response.UnwrapResultOrDefault<ReportDataDto>();
            mm.itemApprovalsList = data.ApprovalTypes;
            mm.itemApprovalsStatusList = data.ApprovalStatuses;
            mm.bankAccountList = data.BankAccounts;
            mm.paymentTypeList = data.PaymentTypes;
            mm.singleResult = data.MenuOrder;
            mm.ReportProjectList = data.ProjectListForReport ?? new();
            mm.ActiveTab = data.ActiveTab;

            return View(mm);
        }

        public async Task<string> GetListOfProjectForReport()
        {
            var userId = GetUserId();

            var responce = await _reportService.GetProjectFrReportAsync<APIResponse>(userId);

            return JsonConvert.SerializeObject(responce);

        }

        public async Task<string> GetSectionVendor(string ProjectIds)
        {
            var UserId = GetUserId();
            var response = await _reportService.GetSectionVendorFrReportAsync<APIResponse>(ProjectIds, UserId);

            return JsonConvert.SerializeObject(response);
        }

        #region :: WarmUp Report on Project StartUp

        [AllowAnonymous]
        public async Task<IActionResult> WarmUpReport()
        {
            string sampleProjectId = "2";
            //string sampleSectionId = null;

            //await _logService.LogCustomAsync("warm-up Start");

            var result = await BudgetReportSummaryReportGenerationForWarmUp(sampleProjectId, null, "PDF");

            //await _logService.LogCustomAsync(result);

            return Ok("Report warm-up completed.");
        }

        [AllowAnonymous]
        private async Task<IActionResult> BudgetReportSummaryReportGenerationForWarmUp(string ProjectId, string? SectionIDs, string exportFormat = "PDF")
        {
            var userName = "WarmUpReport";

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = SafeValue(ProjectId),
                SectionID = SafeValue(SectionIDs),
                ItemStatusFlag = false,
            };

            //var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);

            //RptDesignDTO rptDesignDTO = new RptDesignDTO
            //{
            //    ProjectName = "Sample Project",
            //    HeaderContent = "For Section(s): All",
            //    CurrCode = "152",
            //    ProjectSelFlag = "false",
            //    HeaderContentFab = " and For Status:All",
            //};

            var rptDesignDTO = await GetReportDesignAsyncForReportWarmUp(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");


            var parameters = new Dictionary<string, string>
            {
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "TaxShowStatus", rptDesignDTO.CurrCode!.Split(',').Count() > 1  ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "BudgetSectionID", SafeValue(SectionIDs) },
                { "ProjectID", SafeValue(ProjectId) },
                { "GroupID", "" },
            };

            string extension = ReportHelper.GetFileExtension(exportFormat);

            string fileName = $"BudgetReportByItem.{extension}";

            var result = await GenerateReport("BudgetReportByItem", fileName, parameters, exportFormat.ToUpper());

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);

        }

        #endregion

        #region :: Budget Report

        public async Task<IActionResult> BudgetReportByItemReportGeneration(string ProjectId, string SectionIDs, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = SafeValue(ProjectId),
                SectionID = SafeValue(SectionIDs),
                ItemStatusFlag = false,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");


            var parameters = new Dictionary<string, string>
            {
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "BudgetSectionID", SafeValue(SectionIDs) },
                { "ProjectID", SafeValue(ProjectId) },
                { "GroupID", "" },
            };

            string reportName = exportFormat == "EXCELOPENXML"
                    ? "BudgetReportByItemForExcel"
                    : "BudgetReportByItem";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);

        }

        public async Task<IActionResult> BudgetReportSummaryReportGeneration(string ProjectId, string SectionIDs, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectId,
                SectionID = SafeValue(SectionIDs),
                ItemStatusFlag = false,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "ProjectID", SafeValue(ProjectId) },
                { "BudgetSectionID", SafeValue(SectionIDs) },
            };

            string reportName = exportFormat == "EXCELOPENXML"
                    ? "BudgetReportSummaryForExcel"
                    : "BudgetReportSummary";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Purchase Commitment Report

        public async Task<IActionResult> PurchaseCommitmentReportGeneration(string ProjectId, string SectionIDs, string GroupType, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectId,
                SectionID = SafeValue(SectionIDs),
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1 ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TotalContent", SectionIDs == null ? "Total" : "Subtotal"},
                { "ProjectID", SafeValue(ProjectId) },
                { "BudgetSectionID", SafeValue(SectionIDs) },
                { "UserID", userId.ToString() },
            };

            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = GroupType switch
                {
                    "1" => "PurchaseCommitmentReportForExcel",
                    "2" => "PurchaseCommitmentReport1ForExcel",
                    "3" => "PurchaseCommitmentReport2ForExcel",
                    _ => "PurchaseCommitmentReportForExcel"
                };
            }
            else
            {
                reportName = GroupType switch
                {
                    "1" => "PurchaseCommitmentReport",
                    "2" => "PurchaseCommitmentReport1",
                    "3" => "PurchaseCommitmentReport2",
                    _ => "PurchaseCommitmentReport"
                };
            }

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Commitment Cost Report

        public async Task<IActionResult> CommittedCostReportDetailReportGeneration(string ProjectId, string SectionIDs, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectId,
                SectionID = SafeValue(SectionIDs),
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "User", userName },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1 ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TotalContent", SectionIDs == null ? "Total" : "Subtotal"},
                { "BudgetSectionID", SafeValue(SectionIDs) },
                { "ProjectID", SafeValue(ProjectId) },
                { "UserID", userId.ToString() },
            };

            //string extension = ReportHelper.GetFileExtension(exportFormat);

            //string fileName = $"CommittedCostReportDetail.{extension}";

            //return await GenerateReport("CommittedCostReportDetail", fileName, parameters, exportFormat.ToUpper());

            string reportName = exportFormat == "EXCELOPENXML"
                    ? "CommittedCostReportDetailForExcel"
                    : "CommittedCostReportDetail";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }

        public async Task<IActionResult> CommittedCostReportSummeryReportGeneration(string ProjectId, string SectionIDs, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectId,
                SectionID = SafeValue(SectionIDs),
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "User", userName },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1 ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TotalContent", SectionIDs == null ? "Total" : "Subtotal"},
                { "ProjectID", SafeValue(ProjectId) },
                { "BudgetSectionID", SafeValue(SectionIDs) },
                { "UserID", userId.ToString() },
            };

            string reportName = exportFormat == "EXCELOPENXML"
                    ? "CommittedCostForExcel"
                    : "CommittedCost";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Status Report

        public async Task<IActionResult> ExpeditNoteReportGenerationByVendor(string ProjectID, string SectionID, string VendorID, string Status, string StartDate,
            string EndDate, string order, string NoteStatus, string ReportOption, string ShipTo, string POWoutItems, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(VendorID),
                VendorFlag = true,
                ItemStatus = SafeValue(Status),
                ItemStatusFlag = Status == null ? false : true,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ProjectID", SafeValue(ProjectID) },
                { "SectionID", SafeValue(SectionID) },
                { "VendorID", SafeValue(VendorID) },
                { "Status", SafeValue(Status)    },
                { "StartDate", SafeValue(StartDate) },
                { "EndDate", SafeValue(EndDate) },
                { "order", order },
                { "NoteStatus", NoteStatus },
                { "UserID", userId.ToString() },
                { "ShipTo", SafeValue(ShipTo) },
                { "POWoutItems", POWoutItems },
            };

            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = ReportOption switch
                {
                    "1" => "ExpeditNoteForExcel",
                    "2" => "ExpeditNote1ForExcel",
                    "3" => "ExpeditNote2ForExcel",
                    "4" => "ExpeditNote3ForExcel",
                    "5" => "ExpeditNote4ForExcel",
                    "6" => "ExpeditNote5ForExcel",
                    "7" => "ExpeditNote6ForExcel",
                    "8" => "ExpeditNote7ForExcel",
                    "9" => "ExpeditNote8ForExcel",
                    _ => "ExpeditNoteForExcel"
                };
            }
            else
            {
                reportName = ReportOption switch
                {
                    "1" => "ExpeditNote",
                    "2" => "ExpeditNote1",
                    "3" => "ExpeditNote2",
                    "4" => "ExpeditNote3",
                    "5" => "ExpeditNote4",
                    "6" => "ExpeditNote5",
                    "7" => "ExpeditNote6",
                    "8" => "ExpeditNote7",
                    "9" => "ExpeditNote8",
                    _ => "ExpeditNote"
                };
            }


            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat, parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        public async Task<IActionResult> ApprovalStatusReportGeneration(string ProjectID, string SectionID, string VendorID, string ApprovalType, string ApprovalStatus, string ReportOption, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(VendorID),
                VendorFlag = true
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ProjectID", SafeValue(ProjectID)},
                { "SectionID", SafeValue(SectionID) },
                { "VendorID", SafeValue(VendorID) },
                { "ApprovalType", SafeValue(ApprovalType) },
                { "ApprovalStatus",SafeValue(ApprovalStatus) },
                { "ReportOption", ReportOption},
                { "UserID", userId.ToString() },
            };

            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = ReportOption switch
                {
                    "10" => "ApprovalStatusForExcel",
                    "11" => "ApprovalStatus1ForExcel",
                    "12" => "ApprovalStatus2ForExcel",
                    "13" => "ApprovalStatus3ForExcel",
                    _ => "ApprovalStatusForExcel"
                };
            }
            else
            {
                reportName = ReportOption switch
                {
                    "10" => "ApprovalStatus",
                    "11" => "ApprovalStatus1",
                    "12" => "ApprovalStatus2",
                    "13" => "ApprovalStatus3",
                    _ => "ApprovalStatus"
                };
            }


            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Fabrication Report

        public async Task<IActionResult> FabStatusReportGeneration(string ProjectId, string VendorId, string StatusID, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();

            string Query = "";

            if (StatusID is not null)
            {
                string[] ids = StatusID.Split(',');
                Query = string.Join(" OR ", ids.Select(id => $" itemapprovalstatusid like '%{id}%'"));
            }

            int MaxGroupCnt = 0;

            var groupcount = await _reportService.GetFabGroupCountForProjectAsync<APIResponse>(ProjectId);

            if (!groupcount.IsSuccess)
            {
                return ApiResponseService.InternalServerResponse(groupcount.ErrorMessages?.FirstOrDefault() ?? "Failed to fetch group count.");
            }
            else
            {
                MaxGroupCnt = Convert.ToInt32(groupcount.Result);
            }

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectId,
                VendorId = SafeValue(VendorId),
                StatusId = SafeValue(StatusID),
                VendorFlagFab = true
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            //if (exportFormat == "EXCELOPENXML")
            //{
            //    rptDesignDTO.ProjectName = rptDesignDTO.ProjectName!.Replace("\r\n", ", ");

            //}

            var parameters = new Dictionary<string, string>
            {
                { "ProjectID", ProjectId },
                { "UserID", userId.ToString() },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "User", userName },
                { "VendorID", SafeValue(VendorId) },
                { "Query", Query},
                { "ReportParameterFilter",  rptDesignDTO.HeaderContentFab ?? "" },
            };
            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = "FabricationStatusForExcel";
            }

            if (exportFormat == "PDF")
            {
                reportName = MaxGroupCnt switch
                {
                    1 => "FabricationStatus",
                    2 => "FabricationStatus2",
                    3 => "FabricationStatus3",
                    4 => "FabricationStatus4",
                    5 => "FabricationStatus5",
                    6 => "FabricationStatus6",
                    7 => "FabricationStatus7",
                    _ => "FabricationStatus8"
                };
            }



            string extension = ReportHelper.GetFileExtension(exportFormat);
            string fileName = $"FabReport_For_{rptDesignDTO.ProjectName!.Replace("\r\n", ",")}.{extension}";

            var reportResult = await GenerateReport(reportName, fileName, parameters, exportFormat.ToUpper());



            if (exportFormat == "EXCELOPENXML")
            {
                var excelUrl = reportResult?.Result!.ToString();
                string excelFilePath = Path.Combine(_webHostEnvironment.WebRootPath, excelUrl!.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                var context = new ExcelPostProcessContextDTO
                {
                    FilePath = excelFilePath,
                    ReportType = "Fabrication",
                    Parameters = parameters
                };

                await _excelPostProcessor.ProcessAsync(context).ConfigureAwait(false);
            }

            if (reportResult == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            if (!reportResult.IsSuccess)
                return ApiResponseService.BadRequestResponse(reportResult.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(reportResult.Result);
        }



        #endregion

        #region :: Receiving Report

        public async Task<IActionResult> ReceivingReportSectionReportGeneration(string ProjectID, string SectionID, string VendorID, string order, string option, string Status, string StartDate, string EndDate, string exportFormat = "PDF")
        {
            var userId = GetUserId();
            var userName = GetUserName();


            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(VendorID),
                VendorFlag = true,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>();

            if (option == "1" || option == "2" || option == "3" || option == "4" || option == "5")
            {
                parameters = new Dictionary<string, string>
                {
                    { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                    { "User", userName },
                    { "Projects", rptDesignDTO.ProjectName ?? "" },
                    { "ProjectID", SafeValue(ProjectID) },
                    { "BudgetSectionId", SafeValue(SectionID) },
                    { "VendorID", SafeValue(VendorID) },
                    { "order", order == "0" ? "" : order }
                };
            }
            else
            {
                parameters = new Dictionary<string, string>
                {
                    { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                    { "User", userName },
                    { "Projects", rptDesignDTO.ProjectName ?? "" },
                    { "ProjectID", SafeValue(ProjectID) },
                    { "SectionID", SafeValue(SectionID) },
                    { "VendorID", SafeValue(VendorID) },
                    { "Status", Status == null ? "" : Status},
                    { "StartDate", StartDate == null ? "" : StartDate },
                    { "EndDate", EndDate == null ? "" : EndDate },
                    { "order", order == "0" ? "" : order },
                    { "NoteStatus", "" },
                    { "UserID", userId.ToString() },
                };
            }


            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = option switch
                {
                    "1" => "ReceivingReportSectionForExcel",
                    "2" => "ReceivingReportSection1ForExcel",
                    "3" => "ReceivingReportSection2ForExcel",
                    "4" => "ReceivingReportSection3ForExcel",
                    "5" => "ReceivingReportSection4ForExcel",
                    "6" => "ExpeditNote4_ReceivingForExcel",
                    "7" => "ExpeditNote3_ReceivingForExcel",
                    _ => "ReceivingReportSectionForExcel"
                };
            }
            else
            {
                reportName = option switch
                {
                    "1" => "ReceivingReportSection",
                    "2" => "ReceivingReportSection1",
                    "3" => "ReceivingReportSection2",
                    "4" => "ReceivingReportSection3",
                    "5" => "ReceivingReportSection4",
                    "6" => "ExpeditNote4_Receiving",
                    "7" => "ExpeditNote3_Receiving",
                    _ => "ReceivingReportSection"
                };
            }


            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: PO Report

        public async Task<IActionResult> POReportGenerationDetailsFIlter(string AllProjectID, string ReportType, string GroupTye, string AllVendorID,
            string From_Date, string To_date, string InvoiceStatus, string OrderPattern, string SectionID, string PaymentStatus, string From_DatePayment, string To_DatePayment, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = AllProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(AllVendorID),
                VendorFlag = true,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>();

            parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                { "POTAX1", rptDesignDTO.rptDesignTaxDTO?.POTAX1 ?? "" },
                { "POTAX2", rptDesignDTO.rptDesignTaxDTO?.POTAX2 ?? "" },
                { "POTAX3", rptDesignDTO.rptDesignTaxDTO ?.POTAX3 ?? "" },
                { "INVTAX1", rptDesignDTO.rptDesignTaxDTO ?.INVTAX1 ?? "" },
                { "INVTAX2", rptDesignDTO.rptDesignTaxDTO ?.INVTAX2 ?? "" },
                { "INVTAX3", rptDesignDTO.rptDesignTaxDTO ?.INVTAX3 ?? "" },
                { "ProjectID", AllProjectID },
                { "VendorID", SafeValue(AllVendorID) },
                { "StartDate", SafeValue(From_Date) },
                { "EndDate", SafeValue(To_date) },
                { "InvStatus", InvoiceStatus == "0" ? "" : InvoiceStatus },
                { "SectionIDs", SafeValue(SectionID) },
                { "PStartDate", SafeValue(From_DatePayment) },
                { "PEndDate", SafeValue(To_DatePayment) },
                { "PStatus", PaymentStatus },
            };

            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = (ReportType, GroupTye, OrderPattern) switch
                {
                    ("1", "0", "2") => "PODetailsForExcel",
                    ("1", "0", "1") => "PODetails1ForExcel",
                    ("1", "1", "1") => "PODetails3ForExcel",
                    ("1", "1", "2") => "PODetails2ForExcel",
                    ("1", "1", "3") => "PODetails4ForExcel",
                    ("1", "2", "1") => "PODetails5ForExcel",
                    ("1", "2", "2") => "PODetails6ForExcel",
                    _ => "PODetailsForExcel"
                };
            }
            else
            {
                reportName = (ReportType, GroupTye, OrderPattern) switch
                {
                    ("1", "0", "2") => "PODetails",
                    ("1", "0", "1") => "PODetails1",
                    ("1", "1", "1") => "PODetails3",
                    ("1", "1", "2") => "PODetails2",
                    ("1", "1", "3") => "PODetails4",
                    ("1", "2", "1") => "PODetails5",
                    ("1", "2", "2") => "PODetails6",
                    _ => "PODetails"
                };
            }


            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }


        public async Task<IActionResult> POReportGenerationSummeryFilter(string AllProjectID, string ReportType, string GroupTye, string AllVendorID,
           string From_Date, string To_date, string InvoiceStatus, string OrderPattern, string SectionID, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = AllProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(AllVendorID),
                VendorFlag = true,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>();

            parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                { "POTAX1", rptDesignDTO.rptDesignTaxDTO ?.POTAX1 ?? "" },
                { "POTAX2", rptDesignDTO.rptDesignTaxDTO ?.POTAX2 ?? "" },
                { "POTAX3", rptDesignDTO.rptDesignTaxDTO ?.POTAX3 ?? ""},
                { "INVTAX1", rptDesignDTO.rptDesignTaxDTO ?.INVTAX1 ?? "" },
                { "INVTAX2", rptDesignDTO.rptDesignTaxDTO ?.INVTAX2 ?? "" },
                { "INVTAX3", rptDesignDTO.rptDesignTaxDTO ?.INVTAX3 ?? "" },
                { "ProjectID", AllProjectID },
                { "VendorID", SafeValue(AllVendorID) },
                { "StartDate", SafeValue(From_Date) },
                { "EndDate", SafeValue(To_date) },
                { "InvStatus", InvoiceStatus == "0" ? "" : InvoiceStatus },
                { "SectionIDs", SafeValue(SectionID) },
            };


            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = (ReportType, GroupTye, OrderPattern) switch
                {
                    ("2", "0", "2") => "POReportSummaryForExcel",
                    ("2", "0", "1") => "POReportSummary1ForExcel",
                    ("2", "1", "1") => "POReportSummary2ForExcel",
                    ("2", "1", "2") => "POReportSummary3ForExcel",
                    ("2", "1", "3") => "POReportSummary4ForExcel",
                    ("2", "2", "1") => "POReportSummary5ForExcel",
                    ("2", "2", "2") => "POReportSummary6ForExcel",
                    _ => "POReportSummaryForExcel"
                };
            }
            else
            {
                reportName = (ReportType, GroupTye, OrderPattern) switch
                {
                    ("2", "0", "2") => "POReportSummary",
                    ("2", "0", "1") => "POReportSummary1",
                    ("2", "1", "1") => "POReportSummary2",
                    ("2", "1", "2") => "POReportSummary3",
                    ("2", "1", "3") => "POReportSummary4",
                    ("2", "2", "1") => "POReportSummary5",
                    ("2", "2", "2") => "POReportSummary6",
                    _ => "POReportSummary"
                };
            }



            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);

        }

        #endregion

        #region :: Invoice Report

        public async Task<IActionResult> InvoiceReportGenerationDetailsFIlter(string AllProjectID, string ReportType, string GroupTye, string AllVendorID, string From_Date,
                                                           string To_date, string From_PDate, string To_Pdate, string InvoiceStatus, string OrderPattern, string AllBankAccountID, string SectionID, string paymentMode, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = AllProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(AllVendorID),
                VendorFlag = true,
            };
            string reportName = string.Empty;

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");


            var parameters = new Dictionary<string, string>();



            if (ReportType == "1")
            {
                parameters = new Dictionary<string, string>
                {
                    { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                    { "User", userName },
                    { "Projects", rptDesignDTO.ProjectName ?? "" },
                    { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                    { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                    { "NoteParam","" },
                    { "INVTAX1", rptDesignDTO.rptDesignTaxDTO ?.INVTAX1 ?? "" },
                    { "INVTAX2", rptDesignDTO.rptDesignTaxDTO ?.INVTAX2 ?? "" },
                    { "INVTAX3", rptDesignDTO.rptDesignTaxDTO ?.INVTAX3 ?? "" },
                    { "ProjectID", AllProjectID },
                    { "VendorID", SafeValue(AllVendorID) },
                    { "StartDate", SafeValue(From_Date) },
                    { "EndDate", SafeValue(To_date) },
                    { "BankAC", SafeValue(AllBankAccountID) },
                    { "InvStatus", InvoiceStatus == "0" ? "" : InvoiceStatus },
                    { "SectionIDs", SafeValue(SectionID) },
                    { "pamymentMode", paymentMode == null ? "null" : paymentMode},
                    { "pStartDate", SafeValue(From_PDate) },
                    { "pEndDate", SafeValue(To_Pdate) },
                };

                if (exportFormat == "EXCELOPENXML")
                {
                    reportName = (ReportType, GroupTye, OrderPattern) switch
                    {
                        ("1", "1", "2") => "InvoiceDetailsForExcel",
                        ("1", "1", "1") => "InvoiceDetails1ForExcel",
                        ("1", "2", "2") => "InvoiceDetails2ForExcel",
                        ("1", "2", "1") => "InvoiceDetails3ForExcel",
                        ("1", "2", "3") => "InvoiceDetails4ForExcel",
                        ("1", "3", "2") => "InvoiceDetails5ForExcel",
                        ("1", "3", "1") => "InvoiceDetails6ForExcel",
                        ("1", "3", "3") => "InvoiceDetails7ForExcel",
                        ("1", "4", "2") => "InvoiceDetails8ForExcel",
                        ("1", "4", "3") => "InvoiceDetails9ForExcel",
                        ("1", "4", "1") => "InvoiceDetails10ForExcel",
                        _ => "InvoiceDetailsForExcel"
                    };
                }
                else
                {
                    reportName = (ReportType, GroupTye, OrderPattern) switch
                    {
                        ("1", "1", "2") => "InvoiceDetails",
                        ("1", "1", "1") => "InvoiceDetails1",
                        ("1", "2", "2") => "InvoiceDetails2",
                        ("1", "2", "1") => "InvoiceDetails3",
                        ("1", "2", "3") => "InvoiceDetails4",
                        ("1", "3", "2") => "InvoiceDetails5",
                        ("1", "3", "1") => "InvoiceDetails6",
                        ("1", "3", "3") => "InvoiceDetails7",
                        ("1", "4", "2") => "InvoiceDetails8",
                        ("1", "4", "3") => "InvoiceDetails9",
                        ("1", "4", "1") => "InvoiceDetails10",
                        _ => "InvoiceDetails"
                    };
                }

            }

            if (ReportType == "2")
            {
                parameters = new Dictionary<string, string>
                {
                    { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                    { "User", userName },
                    { "Projects", rptDesignDTO.ProjectName ?? "" },
                    { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                    { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                    { "INVTAX1", rptDesignDTO.rptDesignTaxDTO ?.INVTAX1 ?? "" },
                    { "INVTAX2", rptDesignDTO.rptDesignTaxDTO ?.INVTAX2 ?? "" },
                    { "INVTAX3", rptDesignDTO.rptDesignTaxDTO ?.INVTAX3 ?? "" },
                    { "ProjectID", AllProjectID },
                    { "VendorID", SafeValue(AllVendorID) },
                    { "StartDate", SafeValue(From_Date) },
                    { "EndDate", SafeValue(To_date) },
                    { "BankAC", SafeValue(AllBankAccountID) },
                    { "InvStatus", InvoiceStatus == "0" ? "" : InvoiceStatus },
                    { "SectionIDs", SafeValue(SectionID) },
                    { "pamymentMode", paymentMode == null ? "null" : paymentMode},
                };

                if (exportFormat == "EXCELOPENXML")
                {
                    reportName = (ReportType, GroupTye, OrderPattern) switch
                    {
                        ("2", "1", "2") => "InvoiceSummaryForExcel",
                        ("2", "1", "1") => "InvoiceSummary1ForExcel",
                        ("2", "2", "2") => "InvoiceSummary2ForExcel",
                        ("2", "2", "1") => "InvoiceSummary3ForExcel",
                        ("2", "2", "3") => "InvoiceSummary4ForExcel",
                        ("2", "3", "2") => "InvoiceSummary5ForExcel",
                        ("2", "3", "1") => "InvoiceSummary6ForExcel",
                        ("2", "3", "3") => "InvoiceSummary7ForExcel",
                        ("2", "4", "1") => "InvoiceSummary8ForExcel",
                        ("2", "4", "2") => "InvoiceSummary9ForExcel",
                        ("2", "4", "3") => "InvoiceSummary10ForExcel",
                        _ => "InvoiceSummaryForExcel"
                    };
                }
                else
                {
                    reportName = (ReportType, GroupTye, OrderPattern) switch
                    {
                        ("2", "1", "2") => "InvoiceSummary",
                        ("2", "1", "1") => "InvoiceSummary1",
                        ("2", "2", "2") => "InvoiceSummary2",
                        ("2", "2", "1") => "InvoiceSummary3",
                        ("2", "2", "3") => "InvoiceSummary4",
                        ("2", "3", "2") => "InvoiceSummary5",
                        ("2", "3", "1") => "InvoiceSummary6",
                        ("2", "3", "3") => "InvoiceSummary7",
                        ("2", "4", "1") => "InvoiceSummary8",
                        ("2", "4", "2") => "InvoiceSummary9",
                        ("2", "4", "3") => "InvoiceSummary10",
                        _ => "InvoiceSummary"
                    };
                }


            }

            string extension = ReportHelper.GetFileExtension(exportFormat);
            string fileName = $"{reportName}.{extension}";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: Payment Report

        public async Task<IActionResult> PrintedChequeListReportGeneration(string ProjectID, string SectionID, string VendorID, string BankAccountID, string StartDate, string EndDate, string order, string pamymentMode, string exportFormat = "PDF")
        {
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = ProjectID,
                SectionID = SafeValue(SectionID),
                VendorId = SafeValue(VendorID),
                VendorFlag = true,
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>();

            parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContent ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1  ? "true" : "false" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "ProjectID", ProjectID },
                { "BudgetSectionID", SafeValue(VendorID) },
                { "BankAccountID", SafeValue(BankAccountID) },
                { "VendorID", SafeValue(VendorID) },
                { "StartDate", SafeValue(StartDate) },
                { "EndDate", SafeValue(EndDate) },
                { "order", order },
                { "pamymentMode", pamymentMode == null ? "null" : pamymentMode},
            };

            string reportName = string.Empty;

            if (exportFormat == "EXCELOPENXML")
            {
                reportName = order switch
                {
                    "1" => "PrintedChequeListForExcel",
                    _ => "PrintedChequeList1ForExcel"
                };
            }
            else
            {
                reportName = order switch
                {
                    "1" => "PrintedChequeList",
                    _ => "PrintedChequeList1"
                };
            }

            string extension = ReportHelper.GetFileExtension(exportFormat);
            string fileName = $"{reportName}.{extension}";

            var result = await GenerateAndPostProcessReportAsync(reportName, exportFormat.ToUpper(), parameters);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion


        #region :: Bridge Supporter Report

        public async Task<IActionResult> BridgeSupporterReports(string AllProjectID, string AllVendorID, string From_Date, string To_date, string SendType, string CanSendType, string PaidType, string SupporterAmt)
        {
            var userId = GetUserId();
            var userName = GetUserName();

            RptHeaderDTO rptHeaderDTO = new()
            {
                ProjectId = AllProjectID,
                VendorId = SafeValue(AllVendorID),
                VendorFlag = true
            };

            var rptDesignDTO = await GetReportDesignAsync(rptHeaderDTO);
            if (rptDesignDTO is null)
                return ApiResponseService.InternalServerResponse("Failed to fetch report design content.");

            var parameters = new Dictionary<string, string>
            {
                { "ReportParameterFilter", rptDesignDTO.HeaderContentFab ?? "" },
                { "User", userName },
                { "Projects", rptDesignDTO.ProjectName ?? "" },
                { "ProjectShowFlag", rptDesignDTO.ProjectSelFlag ?? "" },
                { "TaxShowStatus", (rptDesignDTO.CurrCode ?? string.Empty).Split(',').Count() > 1 ? "true" : "false" },
                { "VendorID", AllVendorID is null ? "" : SafeValue(AllVendorID) },
                { "ProjectID", AllProjectID },
                { "Issent", SendType is null ? "" : SendType },
                { "Ispaid", PaidType is null ? "" : PaidType},
                { "Cansend", CanSendType is null ? "" : CanSendType},
                { "Startdate", From_Date is null ? "" : From_Date},
                { "Enddate", To_date is null ? "" : To_date},
                { "SupporterAmt", SupporterAmt is null ? "" : SupporterAmt},
            };

            string reportName = "BridgeSupporter";

            string exportFormat = "PDF";

            var result = await GenerateReport(reportName, $"{reportName}.pdf", parameters, exportFormat);
            if (result == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }

        #endregion

        #region :: PO Report On Polist

        public async Task<IActionResult> PurchaseOrderReportGeneration(string PurchaseOrderID, string showImageFlag, string? IsCommited)
        {
            var userName = GetUserName();
            var userId = GetUserId();

            var reportName = "PurchaseOrder";
            string fileName = await GetFileNameForPOReport(PurchaseOrderID);

            string reportFolderPath = EnsureDirectoryExists("wwwroot", "Assets", "Reports", "BudgetReport");


            var reportPoparam = await FetchPOReportParams(PurchaseOrderID, userId);
            if (reportPoparam == null)
                return ApiResponseService.BadRequestResponse("Failed to fetch report parameters.");

            string absoluteUri = GetPurchaseOrderImagePath();

            //_logService.LogCustom(absoluteUri);

            var parameters = GenerateReportParameters(reportPoparam, userName, userId, PurchaseOrderID, showImageFlag, IsCommited, absoluteUri);

            string filePath = Path.Combine(reportFolderPath, fileName);
            string outputFile = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "Reports", "BudgetReport", fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            if (System.IO.File.Exists(outputFile))
            {
                System.IO.File.Delete(outputFile);
            }

            string exportFormat = "PDF";
            var pdfFileData = await _ssrsReportService.GetReportAsync(reportName, parameters, exportFormat);

            if (pdfFileData == null)
                return ApiResponseService.InternalServerResponse("Failed to generate the report.");

            await WriteFile(filePath, pdfFileData);
            var files = await GetMergedPdfFiles(PurchaseOrderID, filePath, "GET_TNC");
            MergePdfFiles(files, outputFile);

            return ApiResponseService.SuccessResponse($"/Assets/Reports/BudgetReport/{fileName}");
        }

        private async Task<string> GetFileNameForPOReport(string purchaseOrderID)
        {
            var response = await _reportService.GetPoDetailsNameForPOReportAsync<APIResponse>(purchaseOrderID);

            if (!response.IsSuccess && response.Result == null)
            {
                return "PurchaseOrder.pdf";
            }

            //var POName = JsonConvert.DeserializeObject<SingleResultDTO>(response.Result?.ToString()!) ?? new();
            var POName = response.Result!.ToString() ?? "PurchaseOrder";
            char[] invalidChars = Path.GetInvalidFileNameChars().Concat(Path.GetInvalidPathChars()).ToArray();
            var safeName = new string(
                POName
                .Where(c => !invalidChars.Contains(c))
                .ToArray()
            );


            return $"{safeName}.pdf";
        }

        private async Task<string> GetFileNameForDeletedPOReport(string purchaseOrderID)
        {
            var response = await _reportService.GetDeletedPoDetailsNameForPOReportAsync<APIResponse>(purchaseOrderID);

            if (!response.IsSuccess && response.Result == null)
            {
                return "PurchaseOrder.pdf";
            }

            //var POName = JsonConvert.DeserializeObject<SingleResultDTO>(response.Result?.ToString()!) ?? new();
            var POName = response.Result!.ToString() ?? "PurchaseOrder";
            char[] invalidChars = Path.GetInvalidFileNameChars().Concat(Path.GetInvalidPathChars()).ToArray();
            var safeName = new string(
                POName
                .Where(c => !invalidChars.Contains(c))
                .ToArray()
            );


            return $"{safeName}.pdf";
        }

        private async Task<POReportParamDTO?> FetchPOReportParams(string purchaseOrderID, long userId)
        {
            var response = await _reportService.GetParamDetailsForPOReportAsync<APIResponse>(purchaseOrderID, userId.ToString());

            if (!response.IsSuccess || response.Result == null)
            {
                return null;
            }

            return JsonConvert.DeserializeObject<POReportParamDTO>(response.Result?.ToString()!);
        }

        private string GetPurchaseOrderImagePath()
        {
            //Add this image also to Db server path otherwise the image not showing in production server
            string imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "PURCHASE-ORDER-PROOF-ONLY.png");
            return System.IO.File.Exists(imagePath) ? new Uri(imagePath).AbsoluteUri : "";
        }

        private Dictionary<string, string> GenerateReportParameters(POReportParamDTO reportPoparam, string userName, long userId, string purchaseOrderID, string showImageFlag, string? isCommited, string absoluteUri)
        {
            return new Dictionary<string, string>
            {
                { "InvoiceTo", (reportPoparam.InvoiceTo ?? string.Empty).Replace("\n", "<br>") },
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

        private async Task<List<string>> GetMergedPdfFiles(string purchaseOrderID, string generatedPdfFile, string Mode)
        {
            var files = new List<string> { generatedPdfFile };
            var response = await _reportService.GetTermsAndConditionPOReportAsync<APIResponse>(purchaseOrderID, Mode);

            if (!response.IsSuccess && response.Result == null)
            {
                return files;
            }

            var termsFiles = response.UnwrapResultOrDefault<List<SingleResultDTO>>();
            foreach (var file in termsFiles)
            {
                string sanitizedName = Uri.UnescapeDataString(file.Result ?? string.Empty);

                string termsFilePath = file.Result == "SystemTermsFile^TermsandConditions_0.pdf"
                    ? Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "SystemTermsFiles", sanitizedName)
                    : Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "TermsConditionFiles", sanitizedName);

                if (System.IO.File.Exists(termsFilePath) && Path.GetExtension(termsFilePath).ToUpper() == ".PDF")
                {
                    files.Add(termsFilePath);
                }
            }
            return files;
        }

        private void MergePdfFiles(List<string> files, string outputFile)
        {
            using var outputDocument = new PdfDocument();
            foreach (var file in files)
            {
                if (System.IO.File.Exists(file))
                {
                    using var inputDocument = PdfReader.Open(file, PdfDocumentOpenMode.Import);
                    for (int idx = 0; idx < inputDocument.PageCount; idx++)
                    {
                        outputDocument.AddPage(inputDocument.Pages[idx]);
                    }
                }
            }
            outputDocument.Save(outputFile);
        }

        public async Task<string> DeletedPurchaseOrderReportGeneration(string PurchaseOrderID, string showImageFlag, string? IsCommited)
        {
            var userName = GetUserName();
            var userId = GetUserId();

            var reportName = "PurchaseOrder";
            string fileName = await GetFileNameForDeletedPOReport(PurchaseOrderID);

            string reportFolderPath = EnsureDirectoryExists("wwwroot", "Assets", "Reports", "BudgetReport");


            var reportPoparam = await FetchPOReportParams(PurchaseOrderID, userId);
            if (reportPoparam == null)
            {
                return JsonConvert.SerializeObject(ApiResponseService.BadRequestResponse("Failed to fetch report parameters."));
            }

            string absoluteUri = GetDeletedPurchaseOrderImagePath();

            //_logService.LogCustom(absoluteUri);

            var parameters = GenerateReportParametersForDeletedPO(reportPoparam, userName, userId, PurchaseOrderID, showImageFlag, IsCommited, absoluteUri);

            string filePath = Path.Combine(reportFolderPath, fileName);
            string outputFile = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "Reports", "BudgetReport", fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            if (System.IO.File.Exists(outputFile))
            {
                System.IO.File.Delete(outputFile);
            }

            string exportFormat = "PDF";
            var pdfFileData = await _ssrsReportService.GetReportAsync(reportName, parameters, exportFormat);

            if (pdfFileData == null)
            {
                return JsonConvert.SerializeObject(ApiResponseService.InternalServerResponse("Failed to generate the report."));
            }

            await WriteFile(filePath, pdfFileData);

            var files = await GetMergedPdfFiles(PurchaseOrderID, filePath, "GET_DELETED_PO_TNC");
            MergePdfFiles(files, outputFile);

            return JsonConvert.SerializeObject(ApiResponseService.SuccessResponse($"/Assets/Reports/BudgetReport/{fileName}"));
        }

        private string GetDeletedPurchaseOrderImagePath()
        {
            //Add this image also to Db server path otherwise the image not showing in production server
            string imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "PURCHASE-ORDER-DELETED-PO.png");
            return System.IO.File.Exists(imagePath) ? new Uri(imagePath).AbsoluteUri : "";
        }

        private Dictionary<string, string> GenerateReportParametersForDeletedPO(POReportParamDTO reportPoparam, string userName, long userId, string purchaseOrderID, string showImageFlag, string? isCommited, string absoluteUri)
        {
            return new Dictionary<string, string>
            {
                { "InvoiceTo", (reportPoparam.InvoiceTo ?? string.Empty).Replace("\n", "<br>") },
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
                { "PurchaseOrderImage", absoluteUri},
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

        #endregion




    }
}
