using BridgeWeb.Application.Common.Interfaces.Budget;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Budget;
using BridgeWeb.Domain.Model.Dto.DashBoard;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Data;
using System.Drawing;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    //[ServiceFilter(typeof(GlobalExceptionRedirection))]
    public class BudgetController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IBudgetService _budgetService;

        public BudgetController(IWebHostEnvironment webHostEnvironment, IBudgetService budgetService)
        {
            _webHostEnvironment = webHostEnvironment;
            _budgetService = budgetService;
        }

        #region :: Budget Summary
        [Authorize]
        [PageAuthorization("7")]
        public async Task<IActionResult> BudgetSummary()
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var multiModel = new MultipleModel();

            var data = await _budgetService.GetProjectList<APIResponse>(userId);

            multiModel.dropDownListDTOs = data.UnwrapResultOrDefault<List<DropDownListDTO>>();

            return View(multiModel);
        }
        [Authorize]
        public async Task<IActionResult> GetAllProjectSection(long ProjectId, string SearchNumber, string SearchName)
        {
            var data = await _budgetService.GetAllProjectSection<APIResponse>(ProjectId, SearchNumber, SearchName);
            var budgetSectionListDto = data.UnwrapResultOrDefault<List<BudgetSectionDto>>();
            return PartialView("_BudgetSummaryTable", budgetSectionListDto);
        }
        [Authorize]
        public async Task<IActionResult> GetBudgetGroups(long ProjectId)
        {
            var data = await _budgetService.GetBudgetGroups<APIResponse>(ProjectId);
            //var budgetGroupListDto = new List<BudgetGroupDto>();
            var groupedData = new Dictionary<string, List<string>>();
            var budgetGroupListDto = data.UnwrapResultOrDefault<List<BudgetGroupDto>>();

            if (budgetGroupListDto.Count > 0)
            {
                groupedData = budgetGroupListDto
                        .GroupBy(g => new { g.GroupID, g.Groupname })
                        .ToDictionary(
                            g => $"{g.Key.GroupID}~{g.Key.Groupname}",
                            g => g.Select(x => $"{x.Sectionnumber}-{x.Name}").ToList()
                        );
            }

            return PartialView("_BudgetGroups", groupedData);
        }
        [Authorize]
        public async Task<string> GetProjectDetailsCostTotal(long ProjectId)
        {
            var data = await _budgetService.GetProjectDetailsCostTotal<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> GetBudgetSection(long ProjectId)
        {
            var data = await _budgetService.GetBudgetSection<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> GetApprovalGroupByGroupId(long GroupId)
        {
            var data = await _budgetService.GetApprovalGroupByGroupId<APIResponse>(GroupId);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> RemoveSection(long BudgetId)
        {
            var data = await _budgetService.RemoveSection<APIResponse>(BudgetId);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> EditSection(long BudgetId, string SectionNumber, string SectionName, long ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var editDTO = new BudgetSectionEditDto
            {
                UserId = userId,
                BudgetId = BudgetId,
                SectionNumber = SectionNumber,
                SectionName = SectionName,
                ProjectId = ProjectId
            };
            var data = await _budgetService.EditSection<APIResponse>(editDTO);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> AddSection(long ProjectId, string SectionNumber, string SectionName)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var addDTO = new BudgetSectionEditDto
            {
                UserId = userId,
                SectionNumber = SectionNumber,
                SectionName = SectionName,
                ProjectId = ProjectId
            };
            var data = await _budgetService.AddSection<APIResponse>(addDTO);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> AddGroup(long ProjectId, bool IsDefault, string GroupName, string SectionIds)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var groupsAddModel = new BudgetGroupAddDto
            {
                UserId = userId,
                ProjectId = ProjectId,
                IsDefault = IsDefault,
                GroupName = GroupName,
                SectionIds = SectionIds
            };
            var data = await _budgetService.AddGroup<APIResponse>(groupsAddModel);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> EditGroup(long GroupId, string GroupName, string SectionIds, long ProjectId)
        {
            var groupsEditModel = new BudgetGroupsEditDto
            {
                ProjectId = ProjectId,
                GroupId = GroupId,
                GroupName = GroupName,
                SectionIds = SectionIds
            };
            var data = await _budgetService.EditGroup<APIResponse>(groupsEditModel);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> DeleteGroup(long ProjectId, long GroupId, string GroupName, string SectionIds)
        {
            var groupsEditModel = new BudgetGroupsEditDto
            {
                ProjectId = ProjectId,
                GroupId = GroupId,
                GroupName = GroupName,
                SectionIds = SectionIds
            };
            var data = await _budgetService.DeleteGroup<APIResponse>(groupsEditModel);
            return JsonConvert.SerializeObject(data);
        }
        [Authorize]
        public async Task<string> SortSection(long ProjectId, int PreviousIndex, int PresentIndex, int NextIndex)
        {
            var UserId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var sortSectionDto = new SortSectionDto
            {
                ProjectId = ProjectId,
                PreviousIndex = PreviousIndex,
                PresentIndex = PresentIndex,
                UserId = UserId,
            };
            var data = await _budgetService.SortSection<APIResponse>(sortSectionDto);
            return JsonConvert.SerializeObject(data);
        }

        #endregion

        #region ::Budget Details

        [Authorize]
        [PageAuthorization("7")]
        public async Task<IActionResult> Lineitems(long? ProjectId)
        {
            MultipleModel mm = new();

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _budgetService.GetAllProjectNameinBudgetDetails<APIResponse>(userId);
            var ProjectList = response.UnwrapResultOrDefault<List<ProjectDropDownListDTO>>();

            var AllUOMResponse = await _budgetService.GetAllUOMInBudgetDetails<APIResponse>();
            var allUOMDetailsList = AllUOMResponse.UnwrapResultOrDefault<List<AllOUMDetailsDTO>>();

            mm.ProjectNameDropDown = ProjectList;
            mm.AllOUMDetailsListInBudgetDetails = allUOMDetailsList;
            //    mm.SelectedProjectID = ProjectId.HasValue
            //? ProjectId.Value
            //: (ProjectList.FirstOrDefault()?.ProjectID ?? 0);
            mm.SelectedProjectID = ProjectId ?? 0;

            return View(mm);
        }
        [Authorize]
        public async Task<IActionResult> AllBudgetHistoryTable(string ProjectId)
        {
            MultipleModel mm = new();
            //List<BudgetHistoryDTO> budgetHistoryList = new List<BudgetHistoryDTO>();
            var response = await _budgetService.GetAllBudgetHistory<APIResponse>(long.Parse(ProjectId));
            var budgetHistoryList = response.UnwrapResultOrDefault<List<BudgetHistoryDTO>>();

            mm.BudgetHistoryList = budgetHistoryList;

            return PartialView("~/Views/Budget/_partialAllBudgetHistoryTable.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetChangedLI(string FldID)
        {
            MultipleModel mm = new MultipleModel();
            var response = await _budgetService.GetAllChangeLI<APIResponse>(long.Parse(FldID));

            var changedLIList = response.UnwrapResultOrDefault<List<ChangedLIDTO>>();

            mm.ChangedLIlist = changedLIList;
            return PartialView("~/Views/Budget/_partialChangeLIlist.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetChangedBS(string FldID)
        {
            MultipleModel mm = new MultipleModel();
            var response = await _budgetService.GetChangedBS<APIResponse>(long.Parse(FldID));

            var changedBSList = response.UnwrapResultOrDefault<List<LOG_BudgetSectionDTO>>();

            mm.ChangedBSList = changedBSList;
            return PartialView("~/Views/Budget/_partialGetChangedBS.cshtml", mm);
        }

        [Authorize]
        public async Task<IActionResult> GetAllProjectSectioninBudgetDetails(string ProjectId, string VersionId)
        {
            MultipleModel mm = new MultipleModel();
            //List<SectionListDTO> SectionList = new List<SectionListDTO>();
            //List<PreviousSectionListDTO> previousSectionListDTOs = new List<PreviousSectionListDTO>();
            if (ProjectId == "undefined" || ProjectId == "null")
            {
                ProjectId = "0";
            }
            if (VersionId == "0" || VersionId == "undefined" || VersionId == "null")
            {
                var response = await _budgetService.GetAllProjectSection<APIResponse>(long.Parse(ProjectId));

                var SectionList = response.UnwrapResultOrDefault<List<SectionListDTO>>();

                mm.SectionList = SectionList;

                return PartialView("~/Views/Budget/_partialProjectSection.cshtml", mm);
            }
            else
            {
                var response = await _budgetService.GetAllPreviousProjectSection<APIResponse>(long.Parse(ProjectId), long.Parse(VersionId));
                var previousSectionListDTOs = response.UnwrapResultOrDefault<List<PreviousSectionListDTO>>();

                mm.PreviousSectionList = previousSectionListDTOs;
                return PartialView("~/Views/Budget/_partialPreviousSectionList.cshtml", mm);
            }
        }

        [Authorize]
        public async Task<IActionResult> GetApprovalHistoryTable(string ProjectId, string SectionId, string GroupId)
        {

            if (SectionId == "undefined")
            {
                SectionId = "0";
            }

            MultipleModel mm = new MultipleModel();

            var response = await _budgetService.GetAllApprovalHistory<APIResponse>(ProjectId, SectionId);

            var approvalHistory = response.UnwrapResultOrDefault<BudgetApprovalHstAndStatus>();

            mm.budgetApprovalHstAndStatus = approvalHistory;

            return PartialView("~/Views/Home/_partialDashboardBudgetApprovalHistory.cshtml", mm);

            //MultipleModel mm = new();
            //List<ApprovalHistoryListDTO> ApprovalHistoryList = new List<ApprovalHistoryListDTO>();
            //if (SectionId == "undefined")
            //{
            //    SectionId = "0";
            //}

            //var response = await _unitOfWork.BudgetService.GetAllApprovalHistory<APIResponse>(long.Parse(ProjectId), long.Parse(SectionId), long.Parse(GroupId));
            //if (response.IsSuccess)
            //{
            //    ApprovalHistoryList = JsonConvert.DeserializeObject<List<ApprovalHistoryListDTO>>(Convert.ToString(response.Result));
            //}
            //else
            //{
            //    ApprovalHistoryList = new List<ApprovalHistoryListDTO>();
            //}
            //mm.ApprovalHistoryList = ApprovalHistoryList;
            //return PartialView("~/Views/Budget/_partialApprovalHistoryList.cshtml", mm);
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<string> AddNewLineItems(BRIDGE_LineITemsCreateDTO bRIDGE_LineITemsCreateDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            bRIDGE_LineITemsCreateDTO.ItemOrder = 0;
            bRIDGE_LineITemsCreateDTO.Taxable = Convert.ToBoolean(bRIDGE_LineITemsCreateDTO.Taxable);
            bRIDGE_LineITemsCreateDTO.nonfreight = Convert.ToBoolean(bRIDGE_LineITemsCreateDTO.nonfreight);
            bRIDGE_LineITemsCreateDTO.Item = string.Empty;
            bRIDGE_LineITemsCreateDTO.CreatedBy_ID = userId;
            var response = await _budgetService.AddNewLineItems<APIResponse>(bRIDGE_LineITemsCreateDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> GetVersionDetailsByProjectName(string ProjectId)
        {
            MultipleModel mm = new MultipleModel();
            //List<VersionnameDTO> versionNameList = new List<VersionnameDTO>();
            if (ProjectId == "undefined" || ProjectId == "null")
            {
                ProjectId = "0";
            }
            var response = await _budgetService.GetAllVersionNameinBudgetDetials<APIResponse>(long.Parse(ProjectId));
            var versionNameList = response.UnwrapResultOrDefault<List<VersionnameDTO>>();

            mm.VersionNameList = versionNameList;
            return PartialView("~/Views/Budget/_PartialGetVersionDetailsByProjectName.cshtml", mm);
        }

        [Authorize]
        public async Task<string> UpdateVersion(string VersionId, string VersionName)
        {
            string data = string.Empty;
            var response = await _budgetService.EditVersionNameInBudgetDetails<APIResponse>(long.Parse(VersionId), VersionName);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> LineItemschecksheet()
        {
            string webRootPath = _webHostEnvironment.WebRootPath;

            string sheetNames = string.Empty;
            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];
                string Fileext = Path.GetExtension(file.FileName);

                if (Fileext == ".xlsx")
                {
                    string folderPath = Path.Combine(webRootPath, "Assets/ImportedFiles");

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string fileLocation = Path.Combine(folderPath, file.FileName);

                    // Check if file exists and delete it if so
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }

                    // Save the new file
                    using (var stream = new FileStream(fileLocation, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    //System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                    //using var excelStream = new FileStream(fileLocation, FileMode.Open, FileAccess.Read);
                    //using var reader = ExcelDataReader.ExcelReaderFactory.CreateReader(excelStream);

                    //sheetNames = string.Join(",", reader.AsDataSet().Tables.Cast<DataTable>().Select(table => table.TableName));

                    using (var package = new ExcelPackage(new FileInfo(fileLocation)))
                    {
                        sheetNames = string.Join(",", package.Workbook.Worksheets.Select(ws => ws.Name));
                    }
                }
            }

            return PartialView("~/Views/Budget/_partialListOfExcelSheetForUploadLineItems.cshtml", sheetNames);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UploadLineItems(string sectionId, string selectedSheet)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var result = new APIResponse();
            string webRootPath = _webHostEnvironment.WebRootPath;
            List<AllOUMDetailsDTO> allUOMDetailsList = new();
            List<LineItemsExcelDataDTO> lineItemsList = new();

            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];
                string fileExt = Path.GetExtension(file.FileName);

                if (fileExt == ".xlsx")
                {
                    string folderPath = Path.Combine(webRootPath, "Assets/ImportedFiles");

                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    string fileLocation = Path.Combine(folderPath, file.FileName);

                    // Delete the file if it already exists
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }

                    // Save the new file
                    using (var stream = new FileStream(fileLocation, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Read the Excel file using EPPlus
                    using (var package = new ExcelPackage(new FileInfo(fileLocation)))
                    {
                        var worksheet = package.Workbook.Worksheets[selectedSheet];
                        if (worksheet == null)
                        {
                            //return CreateErrorResponse(result, "Selected sheet not found", System.Net.HttpStatusCode.NotFound);
                            return ApiResponseService.NotFoundResponse("Selected sheet not found");
                        }

                        // Validate column headers
                        var expectedColumns = new Dictionary<int, string>
                        {
                            { 1, "DESCRIPTION" },
                            { 2, "SPEC" },
                            { 3, "MODEL" },
                            { 4, "VENDOR" },
                            { 5, "CATEGORY" },
                            { 6, "QUANTITY" },
                            { 7, "UOM" },
                            { 8, "COST" },
                            { 9, "NOTES" },
                            { 10, "TAXABLE" }
                        };

                        for (int col = 1; col <= expectedColumns.Count; col++)
                        {
                            string actualColumnName = worksheet.Cells[1, col].Text.Trim().ToUpper();
                            if (!expectedColumns.TryGetValue(col, out var expectedColumnName) || actualColumnName != expectedColumnName)
                            {
                                //return CreateErrorResponse(result, $"{expectedColumnName} column is Invalid", System.Net.HttpStatusCode.BadRequest);
                                return ApiResponseService.BadRequestResponse($"{expectedColumnName} column is Invalid");
                            }
                        }

                        // Get all UOM details
                        var allUOMResponse = await _budgetService.GetAllUOMInBudgetDetails<APIResponse>();
                        if (allUOMResponse.IsSuccess && allUOMResponse.Result != null)
                        {
                            allUOMDetailsList = allUOMResponse.UnwrapResultOrDefault<List<AllOUMDetailsDTO>>();
                        }
                        else
                        {
                            //return CreateErrorResponse(result, "No UOM Found!", System.Net.HttpStatusCode.NotFound);
                            return ApiResponseService.NotFoundResponse("No UOM Found!");
                        }

                        //var res = allUOMDetailsList.ToDictionary(u => u.UOM_ID.ToString(), u => u.UOM);
                        //var res = allUOMDetailsList
                        //        .GroupBy(u => u.UOM?.Trim().ToUpper())
                        //        .ToDictionary(g => g.Key, g => g.First().UOM_ID.ToString());

                        var res = allUOMDetailsList
                            .Where(u => !string.IsNullOrWhiteSpace(u.UOM))
                            .GroupBy(u => u.UOM!.Trim().ToUpper())
                            .ToDictionary(g => g.Key, g => g.First().UOM_ID.ToString());

                        // Read data rows
                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            string itemDesc = worksheet.Cells[row, 1].Value?.ToString()?.Trim() ?? "";
                            if (string.IsNullOrEmpty(itemDesc))
                            {
                                //return CreateErrorResponse(result, "The Item Description cell may not be blank", System.Net.HttpStatusCode.BadRequest);
                                return ApiResponseService.BadRequestResponse("The Item Description cell may not be blank");
                            }

                            string spec = worksheet.Cells[row, 2].Value?.ToString()?.Trim() ?? "";
                            string model = worksheet.Cells[row, 3].Value?.ToString()?.Trim() ?? "";
                            string vendor = worksheet.Cells[row, 4].Value?.ToString()?.Trim() ?? "";
                            string header = worksheet.Cells[row, 5].Value?.ToString()?.Trim() ?? "";

                            object quantityVal = worksheet.Cells[row, 6].Value;
                            double quantity = 0;
                            if (quantityVal != null && !string.IsNullOrWhiteSpace(quantityVal.ToString()))
                            {
                                if (!double.TryParse(quantityVal.ToString(), out quantity))
                                {
                                    //return CreateErrorResponse(result, "Quantity cell must be numeric.", System.Net.HttpStatusCode.BadRequest);
                                    return ApiResponseService.BadRequestResponse("Quantity cell must be numeric.");
                                }
                            }

                            string uom = worksheet.Cells[row, 7].Value?.ToString()?.Trim().ToUpper() ?? "EACH";
                            if (!res.TryGetValue(uom, out string? uomId))
                            {
                                //return CreateErrorResponse(result, $"Invalid UOM: {uom}", System.Net.HttpStatusCode.BadRequest);
                                return ApiResponseService.BadRequestResponse($"Invalid UOM: {uom}");
                            }

                            object costVal = worksheet.Cells[row, 8].Value;
                            double cost = 0;
                            if (costVal != null && !string.IsNullOrWhiteSpace(costVal.ToString()))
                            {
                                if (!double.TryParse(costVal.ToString(), out cost))
                                {
                                    //return CreateErrorResponse(result, "Cost cell must be a valid floating-point number.", System.Net.HttpStatusCode.BadRequest);
                                    return ApiResponseService.BadRequestResponse("Cost cell must be a valid floating-point number.");
                                }
                            }


                            string notes = worksheet.Cells[row, 9].Value?.ToString()?.Trim() ?? "";
                            string taxableStr = worksheet.Cells[row, 10].Value?.ToString()?.Trim() ?? "";
                            bool isTaxable = taxableStr.ToUpper() == "YES" || taxableStr.ToUpper() == "Y";


                            // Create DTO
                            var lineItemsExcelDataDTO = new LineItemsExcelDataDTO
                            {
                                ItemDescription = itemDesc,
                                SpecNum = spec,
                                Vendor = vendor,
                                Quantity = (decimal)quantity,
                                UOMID = long.Parse(uomId),
                                Cost = (decimal)cost,
                                Note = notes,
                                ToWarehouse = false,
                                BudgetSectionID = long.Parse(sectionId),
                                CreatedBy_ID = userId,
                                Header = header,
                                Taxable = isTaxable,
                                Model = model
                            };

                            lineItemsList.Add(lineItemsExcelDataDTO);
                        }
                    }
                }
                else
                {
                    //return CreateErrorResponse(result, "Invalid File Upload. Only Excel (.xlsx) files are supported", System.Net.HttpStatusCode.BadRequest);
                    return ApiResponseService.BadRequestResponse("Invalid File Upload. Only Excel (.xlsx) files are supported");
                }
            }
            else
            {
                //return CreateErrorResponse(result, "No file found", System.Net.HttpStatusCode.BadRequest);
                return ApiResponseService.BadRequestResponse("No file found");
            }

            var response = await _budgetService.GetAllLineItemsFileFromExcelAsync<APIResponse>(lineItemsList);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        [HttpPost]
        public async Task<IActionResult> ExportFile(string ProjectId,string ProjectName)
        {
            try
            {
                var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                ProjectName = Uri.UnescapeDataString(ProjectName);

                // Prevent invalid filename characters
                var safeProjectName = string.Join("_", ProjectName.Split(Path.GetInvalidFileNameChars()));

                var fileName = $"{safeProjectName}_{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx";

                var response = await _budgetService.GetAllLineItemsByProjectForExportExcelAsync<APIResponse>(Convert.ToInt64(ProjectId));

                var lineItemList = response.UnwrapResultOrDefault<List<ExportLineItemDTO>>();

                using var package = new ExcelPackage();

                var xlWorkSheet = package.Workbook.Worksheets.Add("Budget");

                double? tot = 0;
                double? sectot = 0;

                double totcommit = 0;
                double sectotcommit = 0;

                int cl = 1;
                int rw = 1;

                string currsec = string.Empty;

                // Header Row
                xlWorkSheet.Cells[rw, cl++].Value = "Item Number";
                xlWorkSheet.Cells[rw, cl++].Value = "Description";
                xlWorkSheet.Cells[rw, cl++].Value = "Spec Num";
                xlWorkSheet.Cells[rw, cl++].Value = "Model";
                xlWorkSheet.Cells[rw, cl++].Value = "Vendor";
                xlWorkSheet.Cells[rw, cl++].Value = "Category";
                xlWorkSheet.Cells[rw, cl++].Value = "Quantity";
                xlWorkSheet.Cells[rw, cl++].Value = "UOM";
                xlWorkSheet.Cells[rw, cl++].Value = "Cost";
                xlWorkSheet.Cells[rw, cl++].Value = "Total";
                xlWorkSheet.Cells[rw, cl++].Value = "Commit";
                xlWorkSheet.Cells[rw, cl++].Value = "Remaining";
                xlWorkSheet.Cells[rw, cl++].Value = "Adjust";
                xlWorkSheet.Cells[rw, cl++].Value = "Variance";
                xlWorkSheet.Cells[rw, cl++].Value = "Taxable";

                using (ExcelRange rng = xlWorkSheet.Cells["A1:O1"])
                {
                    rng.Style.Font.Bold = true;

                    rng.Style.Fill.PatternType =
                        ExcelFillStyle.Solid;

                    rng.Style.Fill.BackgroundColor.SetColor(
                        Color.FromArgb(119, 146, 168));

                    rng.Style.Font.Color.SetColor(Color.White);
                }

                rw++;

                foreach (var item in lineItemList)
                {
                    cl = 1;

                    if (currsec != item.Sectionnumber)
                    {
                        currsec = item.Sectionnumber ?? string.Empty;

                        xlWorkSheet.Cells[rw, cl].Value =
                            $"{item.Sectionnumber}-{item.Name}";

                        using (ExcelRange rng =
                               xlWorkSheet.Cells[rw, 1, rw, 15])
                        {
                            rng.Style.Font.Bold = true;

                            rng.Style.Fill.PatternType =
                                ExcelFillStyle.Solid;

                            rng.Style.Fill.BackgroundColor.SetColor(
                                Color.FromArgb(97, 188, 212));

                            rng.Style.Font.Color.SetColor(Color.White);
                        }

                        rw++;
                    }

                    cl = 1;

                    xlWorkSheet.Cells[rw, cl++].Value = item.TotalID;
                    xlWorkSheet.Cells[rw, cl++].Value = item.ItemDescription;
                    xlWorkSheet.Cells[rw, cl++].Value = item.SpecNum;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Model;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Vendor;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Header;
                    xlWorkSheet.Cells[rw, cl++].Value = Convert.ToDouble(item.Quantity);

                    xlWorkSheet.Cells[rw, cl++].Value = item.UOM;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Cost;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Total;

                    tot += item.Total;
                    sectot += item.Total;

                    xlWorkSheet.Cells[rw, cl++].Value = Convert.ToDouble(item.Commit);

                    totcommit += Convert.ToDouble(item.Commit);
                    sectotcommit += Convert.ToDouble(item.Commit);

                    xlWorkSheet.Cells[rw, cl++].Value = item.Remaining;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Adjust;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Variance;
                    xlWorkSheet.Cells[rw, cl++].Value = item.Taxable;

                    rw++;
                }

                // Number Formatting
                for (int i = 7; i <= 14; i++)
                {
                    xlWorkSheet.Column(i).Style.Numberformat.Format = "##,###,###,###0.00";
                }

                // Column Widths
                xlWorkSheet.Column(1).Width = 15;
                xlWorkSheet.Column(2).Width = 30;
                xlWorkSheet.Column(5).Width = 30;

                // Totals Header
                xlWorkSheet.Cells[rw, 10].Value = "Amount";
                xlWorkSheet.Cells[rw, 11].Value = "Commit";

                xlWorkSheet.Cells[rw, 10].Style.Font.Bold = true;
                xlWorkSheet.Cells[rw, 11].Style.Font.Bold = true;

                xlWorkSheet.Cells[rw, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                xlWorkSheet.Cells[rw, 11].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                // Totals Formula
                xlWorkSheet.Cells[rw + 1, 10].Formula = $"SUM(J2:J{rw - 1})";

                xlWorkSheet.Cells[rw + 1, 11].Formula = $"SUM(K2:K{rw - 1})";

                // Dynamic Width
                var totText = Convert.ToString(tot) ?? string.Empty;

                xlWorkSheet.Column(10).Width =
                    totText.Length + 2 < 10
                        ? 12
                        : totText.Length + 7;

                var commitText = Convert.ToString(totcommit) ?? string.Empty;

                xlWorkSheet.Column(11).Width =
                    commitText.Length + 2 < 10
                        ? 12
                        : commitText.Length + 7;

                // Optional
                xlWorkSheet.View.FreezePanes(2, 1);

                using var stream = new MemoryStream();

                await package.SaveAsAsync(stream);

                stream.Position = 0;

                return File(stream.ToArray(),"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [Authorize]
        public async Task<string> DeleteVersion(string VersionId)
        {
            string data = string.Empty;
            var response = await _budgetService.DeleteVersionInBudgetDetails<APIResponse>(long.Parse(VersionId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<IActionResult> GetLineItemsinBudgetDetails(string BudgetSectionId, string VersionId, string ProjectId)
        {
            MultipleModel mm = new MultipleModel();

            LockStatusDTO lockStatusDTO = new LockStatusDTO();
            BudgetSectionId = string.IsNullOrEmpty(BudgetSectionId) ? "0" : BudgetSectionId;
            var response = await _budgetService.GetLineItemsinBudgetDetails<APIResponse>(long.Parse(BudgetSectionId), long.Parse(VersionId));
            var lineItemsList = response.UnwrapResultOrDefault<List<GetLineItemsDTO>>();


            if (VersionId == "0")
            {
                var checkStatus = await _budgetService.CheckLockInBudget<APIResponse>(long.Parse(ProjectId), long.Parse(BudgetSectionId));
                lockStatusDTO = checkStatus.UnwrapResultOrDefault<LockStatusDTO>();
            }
            mm.LockStatus = lockStatusDTO;
            mm.GetLineItemsList = lineItemsList;
            if (VersionId == "0")
            {
                return PartialView("~/Views/Budget/_partialGetLineItemsTable.cshtml", mm);
            }
            else
            {
                return PartialView("~/Views/Budget/_partialGetLineITemsByBudgetSectionId_VersionId.cshtml", mm);
            }
        }

        [Authorize]
        public async Task<string> UpdateAdjust(long AdjustedAmount, long LineItemID, string flag)
        {
            var UserId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            string data = string.Empty;
            var response = await _budgetService.UpdateAdjustInBudgetDetails<APIResponse>(AdjustedAmount, LineItemID, flag, UserId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> GetAllUOMinBudgetDetails()
        {
            string data = string.Empty;
            var response = await _budgetService.GetAllUOMInBudgetDetails<APIResponse>();
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> UpdateNoteInBudgetDetailsLineItems(string LineItemId, string Note)
        {
            string data = string.Empty;
            Note = string.IsNullOrEmpty(Note) ? "0" : Note;
            var response = await _budgetService.UpdateNote<APIResponse>(long.Parse(LineItemId), Note);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> CheckLock(string ProjectId, string SectionId)
        {
            string data = string.Empty;
            var response = await _budgetService.CheckLockInBudget<APIResponse>(long.Parse(ProjectId), long.Parse(SectionId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> CheckStatus(EditStatusCheckDTO editStatusCheckDTO)
        {
            string data = string.Empty;
            var response = await _budgetService.CheckStatus<APIResponse>(editStatusCheckDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        [PageAuthorization("8")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateLineItems(LineItemsUpdateDTO lineItemsUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            lineItemsUpdateDTO.CreatedBy_ID = userId;
            var response = await _budgetService.UpdateLineItems<APIResponse>(lineItemsUpdateDTO);

            if (!response.IsSuccess)
                return ApiResponseService.InternalServerResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);

        }

        [Authorize]
        public async Task<string> LockUnlockBudget(LockUnlockLineItemDTO lockUnlockLineItemDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            lockUnlockLineItemDTO.CreatedById = userId;
            var response = await _budgetService.LockUnlockBudget<APIResponse>(lockUnlockLineItemDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }
        [Authorize]
        public async Task<string> GetNavAndLineItems(string LineItemID, string BudgetSectionId, string mode)
        {
            string data = string.Empty;
            var response = await _budgetService.GetNavAndLineItems<APIResponse>(long.Parse(LineItemID), long.Parse(BudgetSectionId), mode);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteMultipleLineItems(string LineItemId)
        {
            string data = string.Empty;
            var response = await _budgetService.DeleteMultipleLineItems<APIResponse>(LineItemId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> DeleteLineItems(string LineItemId)
        {
            string data = string.Empty;
            var response = await _budgetService.DeleteLineItems<APIResponse>(long.Parse(LineItemId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        //public async Task<IActionResult> GetAllPreviousSection(string ProjectId, string VersionId)
        //{
        //    MultipleModel mm = new MultipleModel();
        //    List<PreviousSectionListDTO> previousSectionListDTOs = new List<PreviousSectionListDTO>();
        //    var response = await _unitOfWork.BudgetService.GetAllPreviousProjectSection<APIResponse>(long.Parse(ProjectId), long.Parse(VersionId));
        //    if (response.IsSuccess)
        //    {
        //        previousSectionListDTOs = JsonConvert.DeserializeObject<List<PreviousSectionListDTO>>(Convert.ToString(response.Result));
        //    }
        //    else
        //    {
        //        previousSectionListDTOs = new List<PreviousSectionListDTO>();
        //    }
        //    mm.PreviousSectionList = previousSectionListDTOs;
        //    return PartialView("~/Views/Budget/_partialPreviousSectionList.cshtml", mm);
        //}
        [Authorize]
        public async Task<string> LockBudget(LockUnlockBudgetDTO lockUnlockBudgetDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            lockUnlockBudgetDTO.UserId = userId;
            lockUnlockBudgetDTO.VersionName = string.Empty;
            var response = await _budgetService.LockBudget<APIResponse>(lockUnlockBudgetDTO);
            data = JsonConvert.SerializeObject(response);

            return data;
        }

        [Authorize]
        public async Task<string> UnlockBudget(LockUnlockBudgetDTO lockUnlockBudgetDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            lockUnlockBudgetDTO.UserId = userId;
            if (string.IsNullOrEmpty(lockUnlockBudgetDTO.VersionName) || string.IsNullOrWhiteSpace(lockUnlockBudgetDTO.VersionName))
            {
                lockUnlockBudgetDTO.VersionName = string.Empty;
            }

            var response = await _budgetService.UnlockBudget<APIResponse>(lockUnlockBudgetDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> GetApprovalStatus(string ProjectId)
        {
            string data = string.Empty;
            var response = await _budgetService.PO_GetRequiredAndAssignedApprovers_Budget<APIResponse>(long.Parse(ProjectId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> GetBudgetApprovalStatus(string ProjectId)
        {
            string data = string.Empty;
            var response = await _budgetService.GetApprovalStatus<APIResponse>(long.Parse(ProjectId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }
        [Authorize]
        public async Task<IActionResult> GetGroupForApproval(string ProjectId)
        {
            MultipleModel mm = new MultipleModel();

            var response = await _budgetService.GetGroupForApprovalAsync<APIResponse>(long.Parse(ProjectId));
            var BudgetGroupList = response.UnwrapResultOrDefault<List<BudgeApprovalGroupDTO>>();
            mm.BudgeApprovalGroupListDTO = BudgetGroupList;

            return PartialView("~/Views/Budget/_PartialBudgetGroupModalPopUp.cshtml", mm);
        }

        [Authorize]
        public async Task<string> GetManagerForBudget(string ProjectId)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _budgetService.GetManagerForBudget<APIResponse>(long.Parse(ProjectId), userId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> ChangeTaxable(string LineItemId)
        {
            string data = string.Empty;
            var response = await _budgetService.ChangeTaxable<APIResponse>(long.Parse(LineItemId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> ChangeSpacing(string LineItemId, long Spacing)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _budgetService.ChangeSpacing<APIResponse>(long.Parse(LineItemId), Spacing, userId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> GetProjectNameForCopyBudget()
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _budgetService.GetAllProjectNameinBudgetDetails<APIResponse>(userId);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        //public async Task<IActionResult> GetProjectSectionForBudgetCopy(string ProjectId, int flag)
        //{
        //    MultipleModel model = new MultipleModel();
        //    List<ProjectSectionForCopyBudget> sectionForCopy = new List<ProjectSectionForCopyBudget>();
        //    var response = await _unitOfWork.BudgetService.GetProjectSectionForCopyBudget<APIResponse>(long.Parse(ProjectId));

        //    if (response.IsSuccess)
        //    {
        //        sectionForCopy = JsonConvert.DeserializeObject<List<ProjectSectionForCopyBudget>>(Convert.ToString(response.Result));
        //    }
        //    else
        //    {
        //        sectionForCopy = new List<ProjectSectionForCopyBudget>();
        //    }
        //    model.ProjectSectionForCopyBudget = sectionForCopy;
        //    model.flag = flag;
        //    return PartialView("~/Views/Budget/_partialProjectSectionForCopyBudget", model);
        //}
        [Authorize]
        public async Task<string> GetProjectSectionForBudgetCopy(string ProjectId)
        {
            string data = string.Empty;
            var response = await _budgetService.GetProjectSectionForCopyBudget<APIResponse>(long.Parse(ProjectId));
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        [HttpPost]
        public async Task<string> SaveAndSendFrApprvl(BudgetGroupSendFrAppDTO budgetGroupSendFrAppDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var currentUrl = $"{Request.Scheme}://{Request.Host}";
            budgetGroupSendFrAppDTO.CurrentUrl = currentUrl;
            budgetGroupSendFrAppDTO.userId = userId;

            var response = await _budgetService.AddSaveAndSendFrApprvlAsync<APIResponse>(budgetGroupSendFrAppDTO);

            var data = JsonConvert.SerializeObject(response);

            return data;
        }

        [Authorize]
        public async Task<string> CopyBudget(CopyBudgetDTO copyBudgetDTO)
        {
            string data = string.Empty;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            copyBudgetDTO.CreatedById = userId;
            var response = await _budgetService.CopyBudget<APIResponse>(copyBudgetDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }

        [Authorize]
        public async Task<string> GetApprovalStatusForSentBudget(string ProjectId, string SectionId)
        {
            string data = string.Empty;
            var respose = await _budgetService.GetApprovalStatusForSentBudget<APIResponse>(long.Parse(ProjectId), long.Parse(SectionId));
            data = JsonConvert.SerializeObject(respose);
            return data;
        }

        [Authorize]
        public async Task<string> NewSortLineItemForShift(NewsortlineitemsForShiftDTO newsortlineitemsForShiftDTO)
        {
            string data = string.Empty;
            var response = await _budgetService.NewSortLineItemForShift<APIResponse>(newsortlineitemsForShiftDTO);
            data = JsonConvert.SerializeObject(response);
            return data;
        }
        #endregion
    }
}