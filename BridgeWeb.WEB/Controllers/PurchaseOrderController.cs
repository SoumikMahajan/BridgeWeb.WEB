using BridgeWeb.Application.Common.Interfaces.Budget;
using BridgeWeb.Application.Common.Interfaces.Expedite;
using BridgeWeb.Application.Common.Interfaces.PurchasedOrder;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Budget;
using BridgeWeb.Domain.Model.Dto.Expedite;
using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using BridgeWeb.WEB.Extensions;
using Intuit.Ipp.Core.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO.Compression;
using System.Security.Claims;
using System.Text;

namespace BridgeWeb.WEB.Controllers
{
    [Authorize]
    //[ServiceFilter(typeof(GlobalExceptionRedirection))]
    public class PurchaseOrderController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IPurchaseOrderService _purchaseOrderService;
        private readonly IBudgetService _budgetService;
        private readonly IExpediteService _expediteService;
        public PurchaseOrderController(IWebHostEnvironment webHostEnvironment, IPurchaseOrderService purchaseOrderService, IBudgetService budgetService, IExpediteService expediteService)
        {
            _webHostEnvironment = webHostEnvironment;
            _purchaseOrderService = purchaseOrderService;
            _budgetService = budgetService;
            _expediteService = expediteService;
        }

        private long GetUserId()
        {
            return Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        }

        #region :: Create Purchased Order
        public async Task<IActionResult> CreatePurchaseOrder(int POIDCopy)
        {
            var mm = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var purchaseOrderCopyDTO = new PurchaseOrderCopyDTO();
            if (POIDCopy != 0)
            {
                ViewData["IsCopyPO"] = "1";
                var response = await _purchaseOrderService.POCopy<APIResponse>(Convert.ToString(POIDCopy));
                purchaseOrderCopyDTO = response.UnwrapResultOrDefault<PurchaseOrderCopyDTO>();
            }
            else
            {
                ViewData["IsCopyPO"] = "0";
            }

            var (t1, t2, t3, t4) = (
                _budgetService.GetProjectList<APIResponse>(userId),
                _purchaseOrderService.GetAllVendor<APIResponse>(),
                _purchaseOrderService.GetAllActiveTerms<APIResponse>(),
                _purchaseOrderService.GetAllShipment<APIResponse>()
            );

            await Task.WhenAll(t1, t2, t3, t4);

            var projectData = t1.Result;
            var vendorData = t2.Result;
            var activeTermsData = t3.Result;
            var shipmentsData = t4.Result;

            //mm.ProjectSelectList = JsonConvert.DeserializeObject<List<ProjectListDto>>(projectData.Result.ToString());
            mm.dropDownListDTOs = projectData.UnwrapResultOrDefault<List<DropDownListDTO>>();

            mm.VendorDDList = vendorData.UnwrapResultOrDefault<List<VendorDDListDto>>();

            mm.ActiveTermsDDList = activeTermsData.UnwrapResultOrDefault<List<ActiveTermsDDListDto>>();

            mm.ShipmentDDList = shipmentsData.UnwrapResultOrDefault<List<ShipmentDDListDto>>();
            mm.BuyerDDList = new();
            mm.PurchaseOrderCopy = purchaseOrderCopyDTO;
            return View(mm);
        }
        public async Task<IActionResult> GetAllBuyerWithDefault(long VendorId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            userId = VendorId == 0 ? userId : VendorId;

            var buyerWithDefaultData = await _purchaseOrderService.GetAllBuyerWithDefault<APIResponse>(userId);

            if (buyerWithDefaultData is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!buyerWithDefaultData.IsSuccess)
                return ApiResponseService.BadRequestResponse(buyerWithDefaultData.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(buyerWithDefaultData.Result);
        }
        public async Task<IActionResult> GetAllAddressListWithDefault(long ProjectId, long VendorId)
        {
            var data = await _purchaseOrderService.GetAllAddressListWithDetails<APIResponse>(ProjectId, VendorId);

            if(data is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!data.IsSuccess)
                return ApiResponseService.BadRequestResponse(data.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(data.Result);
        }
        public async Task<IActionResult> GetAllVendorForPurchaseOrderByProjectId(long ProjectId)
        {
            var buyerWithDefaultData = await _purchaseOrderService.GetAllVendorForPurchaseOrderByProjectId<APIResponse>(ProjectId);

            if(buyerWithDefaultData is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!buyerWithDefaultData.IsSuccess)
                return ApiResponseService.BadRequestResponse(buyerWithDefaultData.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(buyerWithDefaultData.Result);
        }

        public async Task<IActionResult> GetShipToAndInvoiceTo(long ProjectId)
        {
            var buyerWithDefaultData = await _purchaseOrderService.GetShipToAndInvoiceTo<APIResponse>(ProjectId);
            
            if(buyerWithDefaultData is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!buyerWithDefaultData.IsSuccess)
                return ApiResponseService.BadRequestResponse(buyerWithDefaultData.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(buyerWithDefaultData.Result);
        }

        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SavePurchaseOrder(SavePurchaseOrderDto orderDto)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            orderDto.UserId = userId;

            var data = await _purchaseOrderService.SavePurchaseOrder<APIResponse>(orderDto);

            if(data is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!data.IsSuccess)
                return ApiResponseService.BadRequestResponse(data.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(data.Result);
        }

        public async Task<IActionResult> GetProjectApproversById(long ProjectId)
        {
            var data = await _purchaseOrderService.GetProjectApproversById<APIResponse>(ProjectId);
            
            if(data is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!data.IsSuccess)
                return ApiResponseService.BadRequestResponse(data.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(data.Result);
        }


        #endregion

        #region :: PO Search
        public async Task<IActionResult> POList(string id, string VendorID, string Status, string projectId)
        {
            var mm = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var projectData = await _purchaseOrderService.GetAllProjectOnPoList<APIResponse>(userId);

            mm.dropDownListDTOs = projectData.UnwrapResultOrDefault<List<DropDownListDTO>>();

            ViewData["ProjectIdFromUrl"] = projectId;
            ViewData["VendorID"] = VendorID;
            ViewData["Status"] = Status;
            if (id != null)
            {
                ViewData["poidprev"] = id;
            }
            string purchasOrderID = Request.Query.ContainsKey("poid") ? Request.Query["poid"].ToString() : "";
            ViewData["POID"] = purchasOrderID;
            ViewData["usertype"] = await GetUserType(userId);
            return View(mm);
        }
        public async Task<IActionResult> LoadInitialPOListData(string PoId, string VendorName, string ItemSpc)
        {
            var mm = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            //PoId = PoId ?? "405";           

            if (!string.IsNullOrEmpty(PoId))
            {
                var QueryBuilder = new StringBuilder();

                QueryBuilder.Append($" AND PurchaseOrderID in ({PoId})");
                if (!string.IsNullOrEmpty(VendorName))
                {
                    QueryBuilder.Append($" AND ParentVendor_ID like '%{VendorName}%'");
                }
                if (!string.IsNullOrEmpty(ItemSpc))
                {
                    QueryBuilder.Append($" AND ( POLineItemID like '%{ItemSpc}%' OR SpecNum like '%{ItemSpc}%')");
                }
                var query = QueryBuilder.ToString();

                var PurchaseOrderFilteredDto = new PurchaseOrderFilteredDto
                {
                    UserId = userId.ToString(),
                    Query = query,
                    OrderNumber = PoId,
                };
                var data = await _purchaseOrderService.GetFilteredPurchaseOrders<APIResponse>(PurchaseOrderFilteredDto);

                var response = data.UnwrapResultOrDefault<List<PurchaseOrderFilteredViewDto>>();
                mm.purchaseOrderFilteredViews = response;
            }
            else
            {
                mm.purchaseOrderFilteredViews = new List<PurchaseOrderFilteredViewDto>();
            }

            TempData["usertype"] = await GetUserType(userId);
            TempData["poEditPermission"] = await GetPoEditPermissionByUserId(userId);

            return PartialView("~/Views/PurchaseOrder/_partialPOListTable.cshtml", mm);
        }
        public async Task<IActionResult> DeletedPOList()
        {
            var mm = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            //var projectData = await _unitOfWork.ProjectService.GetAllProjectList<APIResponse>(userId);
            //mm.ProjectSelectList = projectData.IsSuccess == true && projectData.Result != null
            //    ? JsonConvert.DeserializeObject<List<ProjectListDto>>(projectData.Result.ToString()!) ?? new()
            //    : new List<ProjectListDto>();
            var data = await _budgetService.GetProjectList<APIResponse>(userId);

            mm.dropDownListDTOs = data.UnwrapResultOrDefault<List<DropDownListDTO>>();

            ViewData["usertype"] = await GetUserType(userId);
            return View(mm);
        }

        public async Task<IActionResult> GetAllVendorListByProjectIds(string ProjectIds)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var data = await _purchaseOrderService.GetAllVendorListByProjectIds<APIResponse>(userId, ProjectIds);

            if(data is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!data.IsSuccess)
                return ApiResponseService.BadRequestResponse(data.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(data.Result);
        }
        public async Task<IActionResult> GetAllSectionListByProjectIds(string ProjectIds)
        {
            var data = await _purchaseOrderService.GetAllSectionListByProjectIds<APIResponse>(ProjectIds);
            
            if(data is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");

            if (!data.IsSuccess)
                return ApiResponseService.BadRequestResponse(data.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(data.Result);
        }
        public async Task<string> GetPriority()
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.GetPriority<APIResponse>(userId);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<IActionResult> GetFilteredPurchaseOrders(string ProjectNumber, string OrderNumber, string ProjectSectionNumber, string Remarks, string Item_Spec, string ProjectVendorNumber)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var mm = new MultipleModel();
            var PurchaseOrderFilteredDto = new PurchaseOrderFilteredDto
            {
                UserId = userId.ToString(),
                ProjectNumber = ProjectNumber,
                OrderNumber = OrderNumber,
                ProjectSectionNumber = ProjectSectionNumber,
                Remarks = Remarks ?? "",
                Item_Spec = Item_Spec ?? "",
                ProjectVendorNumber = ProjectVendorNumber
            };

            var data = await _purchaseOrderService.GetFilteredPurchaseOrders<APIResponse>(PurchaseOrderFilteredDto);

            mm.purchaseOrderFilteredViews = data.UnwrapResultOrDefault<List<PurchaseOrderFilteredViewDto>>();

            TempData["usertype"] = await GetUserType(userId);
            TempData["poEditPermission"] = await GetPoEditPermissionByUserId(userId);

            return PartialView("~/Views/PurchaseOrder/_partialPOListTable.cshtml", mm);
        }
        public async Task<IActionResult> GetPoDetailsForApproval(string PoIds)
        {
            var response = await _purchaseOrderService.GetPoDetailsForApproval<APIResponse>(PoIds);
            
            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetPOMailTemplate()
        {
            var response = await _purchaseOrderService.GetPOMailTemplate<APIResponse>();

            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetVendorIdFromMailPOIds(string PoIds)
        {
            var response = await _purchaseOrderService.GetVendorIdFromMailPOIds<APIResponse>(PoIds);
            
            if(response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetPoDetailsForDownload(string PoIds)
        {
            var response = await _purchaseOrderService.GetPoDetailsForDownload<APIResponse>(PoIds);

            if (response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> GetPoFilesToDownload(string PoIds)
        {
            var response = await _purchaseOrderService.GetPoFilesToDownload<APIResponse>(PoIds);
            if (response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> GetPoTermsFiles(string PoIds)
        {
            var response = await _purchaseOrderService.GetPoTermsFiles<APIResponse>(PoIds);
            if (response is null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }


        public async Task<IActionResult> SendVendorMail(string _SelfCC, string _MailBody, string _MailSubject, string _MailId, string _vendorId, string _PoidList)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var poidList = new List<long>(
                        _PoidList.Split(',')
                                    .Select(p => long.Parse(p.Trim()))
                                    .ToList()
            );

            var currentUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}";

            var emailDetails = new VendorEmailDetailsDto
            {
                UserId = userId,
                SelfCC = _SelfCC,
                MailBody = _MailBody,
                MailSubject = _MailSubject,
                MailId = _MailId,
                VendorId = long.Parse(_vendorId),
                PoidList = poidList,
                CurrentUrl = currentUrl
            };

            var response = await _purchaseOrderService.SendVendorMail<APIResponse>(emailDetails);
            
            if(response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if(!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> DeletePO(long PoId)
        {
            var response = await _purchaseOrderService.DeletePO<APIResponse>(PoId);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> CheckInvoiceExist(long PoId)
        {
            var response = await _purchaseOrderService.CheckInvoiceExist<APIResponse>(PoId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public IActionResult InsertToFolder(string attachments = "", bool IsPoPdfChecked = false, bool IsTermsChecked = false)
        {

            char[] delimiters = new char[] { '^' };
            string[] attachmentsArr = attachments.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            string userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value).ToString();
            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{userId}_TempFolder");

            if (Directory.Exists(tempFolder))
            {
                Directory.Delete(tempFolder, true);

            }
            Directory.CreateDirectory(tempFolder);
            if (IsTermsChecked)
            {
                Directory.CreateDirectory(tempFolder + "/Attachments");
            }
            if (IsPoPdfChecked)
            {
                Directory.CreateDirectory(tempFolder + "/PO");
            }

            //foreach (var a in attachmentsArr)
            //{
            //    string tmpFile = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "ProjectFiles", a);
            //    System.IO.File.Copy(tmpFile, tempFolder + "/Attachments/" + a, true);
            //}
            return Ok("Insert Folder successfully.");
        }
        public async Task<IActionResult> InsertTerms(string poids)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value).ToString();

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{userId}_TempFolder");

            var result = await _purchaseOrderService.GetFormattedTermFiles<APIResponse>(poids);

            if (!result.IsSuccess)
                return BadRequest("Failed to fetch term files.");

            var dict = new Dictionary<string, string>();
            string jsonString = JsonConvert.SerializeObject(result);
            var jsonObject = JObject.Parse(jsonString);

            if (!jsonObject.TryGetValue("Result", out var resultToken) || resultToken is null)
                return BadRequest("Result data not found.");

            var data = resultToken.ToObject<List<string>>();

            if (data is null || data.Count == 0)
                return Ok("No terms to insert.");

            foreach (var item in data)
            {
                if (string.IsNullOrWhiteSpace(item))
                    continue;

                string[] c = { "^" };
                string[] values = item.Split(c, StringSplitOptions.RemoveEmptyEntries);

                string FileName;
                string filename1;
                if (values.Length == 4)
                {
                    FileName = values[0] + "~~" + values[1];
                    filename1 = values[3];
                }
                else
                {
                    FileName = values[0];
                    filename1 = values[2];
                }
                if (dict.ContainsKey(filename1))
                    dict[filename1] = dict[filename1] + "^" + FileName;
                else
                    dict[filename1] = FileName;
            }

            foreach (var pair in dict)
            {
                string temp = pair.Value;
                string outname = pair.Key;
                string[] c2 = { "^" };
                string[] values2 = temp.Split(c2, StringSplitOptions.RemoveEmptyEntries);
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
                                Console.WriteLine("File not found: " + tmpfilename);
                            }

                            //System.IO.File.Copy(tmpfilename, tempFolder + "/Attachments/" + Convert.ToString(i) + "." + outname, true);
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
                        //System.IO.File.Copy(tmpfilename, tempFolder + "/Attachments/" + outname, true);
                        if (System.IO.File.Exists(tmpfilename))
                        {
                            System.IO.File.Copy(tmpfilename, Path.Combine(tempFolder, "Attachments", outname), true);
                        }
                        else
                        {
                            Console.WriteLine("File not found: " + tmpfilename);
                        }
                    }
                }
            }

            return Ok("Terms files inserted successfully.");
        }


        public string DownloadZipFile(string folderName = "DATE")
        {
            string userid = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value).ToString();
            string tempFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", $"{userid}_TempFolder");
            string startPath = tempFolder;
            int day = DateTime.Now.Day;
            string day1 = "";
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


            DeleteIfEmpty(Path.Combine(tempFolder, "Attachments"));
            DeleteIfEmpty(Path.Combine(tempFolder, "PO"));

            if (System.IO.File.Exists(zipPath))
            {
                System.IO.File.Delete(zipPath);
            }

            ZipFile.CreateFromDirectory(startPath, zipPath);
            Directory.Delete(tempFolder, true);

            var downloadZipPath = Url.Content($"~/Assets/GeneratedZipFiles/{filename}");

            return downloadZipPath;
        }


        private static void DeleteIfEmpty(string directoryPath)
        {
            if (!Directory.Exists(directoryPath))
                return;

            if (!Directory.EnumerateFileSystemEntries(directoryPath).Any())
            {
                Directory.Delete(directoryPath, recursive: false);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendForBatchApproval(string PoIds, bool MailSend)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var currentUrl = $"{HttpContext.Request.Scheme} :// {HttpContext.Request.Host}";

            var batchApprovalDto = new BatchApprovalDto()
            {
                UserId = userId,
                PoIds = PoIds,
                MailSend = MailSend,
                CurrentUrl = currentUrl
            };

            var response = await _purchaseOrderService.SendForBatchApproval<APIResponse>(batchApprovalDto);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetPoDeletedList(string ProjectNumber, string VendorNumber, string Item_Spec)
        {
            var filterModel = new DeletedPoFilterDto
            {
                ProjectNumber = ProjectNumber,
                VendorNumber = VendorNumber,
                Item_Spec = Item_Spec ?? ""
            };
            var response = await _purchaseOrderService.GetDeletedPoList<APIResponse>(filterModel);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> RecyclePO(long PoId)
        {
            var response = await _purchaseOrderService.RecyclePO<APIResponse>(PoId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }

        private async Task<string> GetUserType(long UserId)
        {
            var response = await _purchaseOrderService.GetUserTypeByUserId<APIResponse>(UserId);
            if (response.IsSuccess && response.Result != null)
            {
                return response.Result.ToString()!;
            }
            return "";
        }
        private async Task<string> GetPoEditPermissionByUserId(long UserId)
        {
            var response = await _purchaseOrderService.GetPoEditPermissionByUserId<APIResponse>(UserId);
            if (response.IsSuccess && response.Result != null)
            {
                return response.Result.ToString()!;
            }
            return "";
        }

        #endregion

        #region :: PO History
        public async Task<IActionResult> ViewPOHistory(string PoId)
        {
            ViewBag.POId = PoId;

            var mm = new MultipleModel();
            var response = await _purchaseOrderService.GetPOHistoryDetails<APIResponse>(PoId);
            mm.POHistoryDetails = response.UnwrapResultOrDefault<List<POHistoryDetails>>();
            return View(mm);
        }

        public async Task<IActionResult> GetPoHistoryLineItemDetails(string PoId, string Flid)
        {
            var mm = new MultipleModel();
            var response = await _purchaseOrderService.GetPoHistoryLineItems<APIResponse>(PoId, Flid);

            mm.POLineItems_POHistoryDetails = response.UnwrapResultOrDefault<List<POLineItems_POHistory>>();

            return PartialView("_partialPoHistoryLineItemDetails", mm);
        }

        public async Task<IActionResult> GetAllHistory(string PoId, string Version)
        {
            var mm = new MultipleModel();
            var response = await _purchaseOrderService.GetAllHistory<APIResponse>(PoId, Version);
            var result = response.UnwrapResultOrDefault<List<AllPoHistoryDetails>>();

            mm.AllPoHistoryDetails = result;
            return PartialView("/Views/PurchaseOrder/_partialAllPoHistoryList.cshtml", mm);
        }

        public async Task<IActionResult> HistoryDetailsByFldID(string FldID)
        {
            var mm = new MultipleModel();
            var response = await _purchaseOrderService.HistoryDetailsByFldID<APIResponse>(FldID);
            mm.singlePOHistoryDetailsDTOs = response.UnwrapResultOrDefault<List<SinglePOHistoryDetailsDTO>>();
            if (mm.singlePOHistoryDetailsDTOs.Count == 1)
            {
                mm.singlePOHistoryDetailsDTOs.Add(new SinglePOHistoryDetailsDTO());
            }
            return PartialView("_partialPOHistoryDetails", mm);
        }

        public async Task<IActionResult> ItemHistoryDetailsByFldID(string FldID)
        {
            var mm = new MultipleModel();
            var response = await _purchaseOrderService.POItemHistoryDetailsBYFldid<APIResponse>(FldID);
            mm.POSingleHistoryDetails = response.UnwrapResultOrDefault<List<POSingleHistoryDetails>>();
            if (mm.POSingleHistoryDetails.Count == 1)
            {
                mm.POSingleHistoryDetails.Add(new POSingleHistoryDetails());
            }

            return PartialView("_partialSingleHistoryDetails", mm);
        }

        [HttpPost]
        public async Task<IActionResult> GetPOApprovalHistoryForPohistoryPage([FromBody] POHistoryRequestDTO request)
        {
            var mm = new MultipleModel();

            var response = await _purchaseOrderService.GetPOApprovalHistoryForPohistoryPage<APIResponse>(request);

            mm.POApprovalsBackupDTO = response.UnwrapResultOrDefault<List<POApprovalsBackupDTO>>();

            return PartialView("_partialPOHistoryPOApprovalHistory", mm);
        }


        [HttpPost]
        public async Task<IActionResult> GetPOApprovalHistoryForPohistoryPage2([FromBody] POHistoryRequestDTO request)
        {
            var mm = new MultipleModel();

            var response = await _purchaseOrderService.GetPOApprovalHistoryForPohistoryPage2<APIResponse>(request);

            mm.POApprovalsBackupDTO = response.UnwrapResultOrDefault<List<POApprovalsBackupDTO>>();

            return PartialView("_partialPOHistoryPOApprovalHistory", mm);
        }

        #endregion

        #region :: PO Edit

        [PageAuthorization("11")]
        public async Task<IActionResult> POEdit(string POId)
        {
            ViewBag.POId = long.Parse(POId);
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            MultipleModel model = new MultipleModel();

            var (t1, t2, t3) = (
                _purchaseOrderService.CheckAuthorityForPOEdit<APIResponse>(userId),
                _purchaseOrderService.PurchaseOrderRequiredDetails<APIResponse>(long.Parse(POId), userId),
                _purchaseOrderService.GetPOCalcualtedInvoiceTax<APIResponse>(POId)
            );
            await Task.WhenAll(t1, t2, t3);

            var checkAuthResponse = t1.Result;
            var response = t2.Result;
            var calcualtedResponse = t3.Result;

            ViewBag.IsEditable = Convert.ToString(checkAuthResponse.Result);

            var requiredPODetailsDTO = response.UnwrapResultOrDefault<RequiredPODetailsDTO>();

            var pOInvoiceCalculation = calcualtedResponse.UnwrapResultOrDefault<POInvoiceCalculationDTO>();

            model.RequiredPODetails = requiredPODetailsDTO;
            model.POInvoiceCalculation = pOInvoiceCalculation;
            TempData["IsCommited"] = requiredPODetailsDTO.IsCommitted.ToString();

            return View(model);
        }
        public async Task<IActionResult> PODetails(string POID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var response = await _purchaseOrderService.GetPOById<APIResponse>(userId, long.Parse(POID));

            var getPODetailsDTO = response.UnwrapResultOrDefault<GetPODetailsDTO>();

            var isCommitted = getPODetailsDTO?.IsCommited; //store the iscommitted

            var buyerTask = _purchaseOrderService.GetBuyerDetails<APIResponse>();
            var shipmentTask = _purchaseOrderService.GetAllShipment<APIResponse>();
            var termsTask = _purchaseOrderService.GetAllActiveTerms<APIResponse>();
            var taxTask = _purchaseOrderService.GetCalculatedTax<APIResponse>(POID);

            var vendorListTask = !isCommitted.GetValueOrDefault()
                ? _purchaseOrderService.GetVendorListNew<APIResponse>()
                : Task.FromResult(new APIResponse());

            var vendorCoTask = !isCommitted.GetValueOrDefault()
                ? _purchaseOrderService.GetShipmentVendorCo<APIResponse>(POID)
                : Task.FromResult(new APIResponse());

            await Task.WhenAll(buyerTask, shipmentTask, termsTask, taxTask, vendorListTask, vendorCoTask);

            // ── Unpack results ──
            var buyerDetails = buyerTask.Result;
            var shipmentmethodResponse = shipmentTask.Result;
            var termResponse = termsTask.Result;
            var calulatedTaxResponse = taxTask.Result;
            var vendorListResponse = vendorListTask.Result;
            var vendorCoResponse = vendorCoTask.Result;


            var buyerList = buyerDetails.UnwrapResultOrDefault<List<BuyerDetailsDTO>>();


            var shipmentList = shipmentmethodResponse.UnwrapResultOrDefault<List<ShipmentDDListDto>>();


            var ActivetermsList = termResponse.UnwrapResultOrDefault<List<ActiveTermsDDListDto>>();

            var vendorList = vendorListResponse.UnwrapResultOrDefault<List<VendorLIstNewDTO>>();

            var vendorCoList = vendorCoResponse.UnwrapResultOrDefault<List<VendorCoListDTO>>();

            var data = JsonConvert.SerializeObject(calulatedTaxResponse.Result);

            MultipleModel mm = new()
            {
                GetPODetails = getPODetailsDTO ?? new(),
                calculatedTax = data,
                VendorListNew = vendorList,
                BuyerDetailsDD = buyerList,
                ShipmentDDList = shipmentList,
                ActiveTermsDDList = ActivetermsList,
                VendorCoList = vendorCoList
            };

            return PartialView("~/Views/PurchaseOrder/_partialPODetails.cshtml", mm);
        }

        public async Task<IActionResult> POTax(string POID)
        {
            var response = await _purchaseOrderService.GetTaxByPOID<APIResponse>(POID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> InvoiceDataonPageLoad(string POID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.GetInvoiceDatainPOEdit<APIResponse>(userId, long.Parse(POID));

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> VendorCoAddress(string VendorCoId)
        {
            var response = await _purchaseOrderService.GetVendorAddress<APIResponse>(VendorCoId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> AddressList(string VendorID, string ProjectID)
        {
            MultipleModel mm = new MultipleModel();
            if (VendorID == null)
            {
                VendorID = "0";
            }
            var response = await _purchaseOrderService.GetAddressListVendorCo<APIResponse>(long.Parse(VendorID), long.Parse(ProjectID));

            mm.AddressListVendorCo = response.UnwrapResultOrDefault<List<AddressListDTO>>();

            return PartialView("~/Views/PurchaseOrder/_partialChangeAddressList.cshtml", mm);
        }

        public async Task<IActionResult> POTaxUpdate(POTaxUpdateDTO pOTaxUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOTaxUpdateDTO.UserId = userId;
            var response = await _purchaseOrderService.POTaxUpdate<APIResponse>(pOTaxUpdateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> POFilesToExposeUpdate(string File)
        {
            var response = await _purchaseOrderService.POFileToExposeUpdate<APIResponse>(File);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<string> UpdateComment(CommentUpdateDTO commentUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            commentUpdateDTO.UserId = userId;
            var response = await _purchaseOrderService.UpdatePOComment<APIResponse>(commentUpdateDTO);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> POExpediteNote(string POID)
        {
            MultipleModel mm = new();
            var response = await _purchaseOrderService.GetPOExpediteNoteByPoid<APIResponse>(long.Parse(POID));

            var POeditNoteList = response.UnwrapResultOrDefault<List<POExpediteNoteDTO>>();

            mm.POExpediteNoteList = POeditNoteList;

            return PartialView("~/Views/PurchaseOrder/_partialPOExpediteNoteList.cshtml", mm);
        }
        public async Task<IActionResult> POCommentsAttachments(string POID)
        {

            var commentresponse = await _purchaseOrderService.GetPOComments<APIResponse>(POID);
            var POFilesresponse = await _purchaseOrderService.GetPOFileToShow<APIResponse>(POID);
            var response = await _purchaseOrderService.GetPOLevelFileList<APIResponse>(POID);

            var mm = new MultipleModel();
            mm.POLevelFileList = response.UnwrapResultOrDefault<List<POLevelFileListDTO>>();
            mm.POcomments = commentresponse.UnwrapResultOrDefault<POCommentDTO>();
            mm.POFIles = POFilesresponse.UnwrapResultOrDefault<List<POFIlesDTO>>();

            return PartialView("~/Views/PurchaseOrder/_partialPOCommentAttachments.cshtml", mm);
        }


        [HttpPost]
        public async Task<IActionResult> POCommentsAttachmentsSave(POCommentsAttachmentsSaveDTO pOCommentsAttachmentsSaveDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOCommentsAttachmentsSaveDTO.UserId = userId;

            var result = new APIResponse();
            string fname = string.Empty;
            string allfilename = string.Empty;
            var fileName = string.Empty;
            string actualFileName = string.Empty;
            string webRootPath = _webHostEnvironment.WebRootPath;

            if (Request.Form.Files.Count > 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    string ext = string.Empty;
                    var file = Request.Form.Files[i];
                    actualFileName = Path.GetFileName(file.FileName);
                    pOCommentsAttachmentsSaveDTO.ActualFileName.Add(actualFileName);
                    ext = Path.GetExtension(file.FileName);
                    fname = Path.GetFileNameWithoutExtension(file.FileName);
                    fname = fname.Replace("'", "`");
                    fileName = fname + "_" + pOCommentsAttachmentsSaveDTO.POId + "(" + DateTime.Now.Ticks.ToString() + "_" + "PO" + ")" + ext;
                    allfilename = string.IsNullOrWhiteSpace(allfilename) ? fileName : $"{allfilename},{fileName}";
                    pOCommentsAttachmentsSaveDTO.FileName.Add(fileName);

                    string folderPath = Path.Combine(webRootPath, "Assets/ProjectFiles");

                    if (!Directory.Exists(folderPath))
                    {
                        //return CreateErrorResponse(result, "Directory does not exist.", System.Net.HttpStatusCode.NotFound);
                        return ApiResponseService.NotFoundResponse("Directory does not exist!!!");
                    }
                    try
                    {
                        FileInfo fileInfo = new FileInfo(Path.Combine(folderPath, fileName));
                        using (FileStream stream = fileInfo.OpenWrite())
                        {
                            file.CopyTo(stream);
                        }
                    }
                    catch (Exception ex)
                    {

                        //return CreateErrorResponse(result, $"File upload failed: {ex.Message}", System.Net.HttpStatusCode.InternalServerError);
                        return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                    }



                }
            }

            var response = await _purchaseOrderService.UpdatePOCommentsAndAttachments<APIResponse>(pOCommentsAttachmentsSaveDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);

        }

        public async Task<IActionResult> SavePOExpediteNotesFromPOPage(POExpediteNoteCreateDTO pOExpediteNoteCreateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOExpediteNoteCreateDTO.UserId = userId;
            var response = await _purchaseOrderService.SavePOExpediteNotes<APIResponse>(pOExpediteNoteCreateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> SaveUpdatedPOExpediteNotesFromPOPage(POExpediteNoteUpdateDTO POExpediteNoteUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            POExpediteNoteUpdateDTO.UserId = userId;
            var response = await _purchaseOrderService.SaveUpdatedPOExpediteNotes<APIResponse>(POExpediteNoteUpdateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> DeletePOExpediteNotesFromPOPage(string FldID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.DeletePOExpediteNote<APIResponse>(FldID, userId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> DeletePOLevelFileList(string FldID, string FileName)
        {
            string fullPath = string.Empty;
            var result = new APIResponse();

            if (!string.IsNullOrEmpty(FileName) || string.IsNullOrWhiteSpace(FileName) || FileName != "undefined" || FileName != "null")
            {
                try
                {
                    fullPath = Path.Combine(_webHostEnvironment.WebRootPath, "Assets", "ProjectFiles", FileName);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);

                    }
                }
                catch (Exception ex)
                {

                    //return CreateErrorResponse(result, $"File deletion failed {ex.Message}", System.Net.HttpStatusCode.InternalServerError);
                    return ApiResponseService.InternalServerResponse($"File deletion failed {ex.Message}");
                }

            }
            var response = await _purchaseOrderService.DeletePOLevelFileList<APIResponse>(FldID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> SetExposedPOLevelFileList(string FldId)
        {
            var response = await _purchaseOrderService.SetExposedPOLevelFileList<APIResponse>(FldId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetAllPOLineItems(string POID)
        {
            MultipleModel mm = new MultipleModel();
            var projectID = TempData["ProjectID"] as string;
            var isCommitted = TempData["IsCommited"] as string;

            var response = await _purchaseOrderService.GetAllPOLineItems<APIResponse>(POID);
            var calculatedTaxResponse = await _purchaseOrderService.GetPOCalculatedTax<APIResponse>(POID);


            mm.POLineItemList = response.UnwrapResultOrDefault<List<GetAllPOLineItemsDTO>>();
            mm.GetPOCalculatedTax = calculatedTaxResponse.UnwrapResultOrDefault<POCalculatedTaxDTO>();
            mm.isCommitted = isCommitted == "True" ? "1" : "0";

            return PartialView("~/Views/PurchaseOrder/_partialPOLineItemsTable.cshtml", mm);
        }
        public async Task<IActionResult> GetPOLineItemByPOLineItemsId(string POLineItemId, string POID)
        {
            var response = await _purchaseOrderService.GetPOLineItemsByPoLineItemId<APIResponse>(POLineItemId, POID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<string> GetPOLineItemsonExpand(string POLineItemId, string POID)
        {
            var response = await _purchaseOrderService.GetAllPOLineItemsonExpand<APIResponse>(POLineItemId, POID);
            return JsonConvert.SerializeObject(response);
        }
        public async Task<IActionResult> GetInvoiceAmountForPOLineItem(string POLineItemId)
        {
            var response = await _purchaseOrderService.CheckPOITEMTOTALLValue<APIResponse>(POLineItemId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> SaveUpdatedPOLineItem(POLineItemUpdateDTO pOLineItemUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOLineItemUpdateDTO.UserId = userId;
            var response = await _purchaseOrderService.UpdatePOLineItemsOnExpand<APIResponse>(pOLineItemUpdateDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> UpdateQuantityandCostPOLineItem(POLineItemUpdateCostandQuantityDTO pOLineItemUpdateCostandQuantityDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOLineItemUpdateCostandQuantityDTO.UserId = userId;
            var response = await _purchaseOrderService.UpdatePOLineItemCostAndQuantity<APIResponse>(pOLineItemUpdateCostandQuantityDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [HttpPost]
        public async Task<IActionResult> SaveAllPoItems([FromBody] List<POLineItemUpdateDTO> POLineItemData)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            POLineItemData = POLineItemData.Select(x =>
            {
                x.UserId = userId;
                return x;
            }).ToList();

            var response = await _purchaseOrderService.SaveAllPOLineItems<APIResponse>(POLineItemData);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);

        }
        public async Task<IActionResult> SavePOandSendForApproval(SendForApprovalUpdateDTO sendForApprovalUpdateDTO)
        {
            var request = HttpContext.Request;
            var currentUrl = $"{request.Scheme}://{request.Host}";
            sendForApprovalUpdateDTO.currentUrl = currentUrl;
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            sendForApprovalUpdateDTO.UpdatedBy = userId;

            var response = await _purchaseOrderService.SaveSendForApproval<APIResponse>(sendForApprovalUpdateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> CancelSendApproval(string POID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.CancelSendApproval<APIResponse>(POID, userId);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> RequiredPODetailsForCommits(string POId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.PurchaseOrderRequiredDetails<APIResponse>(long.Parse(POId), userId);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> MoveNextOrPrevious(MoveNextOrPrevDTO moveNextOrPrevDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            moveNextOrPrevDTO.UserID = userId;
            var response = await _purchaseOrderService.MoveNextOrPrevious<APIResponse>(moveNextOrPrevDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> UpdateCheckbackandNote(CheckBackDateandNoteUpdateDTO checkBackDateandNoteUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            checkBackDateandNoteUpdateDTO.UserId = userId;
            var response = await _purchaseOrderService.SavePOUpdatecheckbackdateandNote<APIResponse>(checkBackDateandNoteUpdateDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> GetPODataForCountZero(string POID)
        {
            var response = await _purchaseOrderService.GetPODataForCountZero<APIResponse>(POID);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> CheckItemsonCommit(string POID)
        {
            var response = await _purchaseOrderService.checkItemForCommit<APIResponse>(POID);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [HttpPost]
        public async Task<IActionResult> CreditNoteModal()
        {
            string requestBody = string.Empty;
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                requestBody = await reader.ReadToEndAsync();
            }
            MultipleModel mm = new MultipleModel();

            var obj = JsonConvert.DeserializeObject<POLIInCreditNoteDTO>(requestBody) ?? new();

            var totalInvoiceAmountDTOs = obj.InvoiceAmountData ?? new();
            var pOLIInCreditNoteGetDTO = new POLIInCreditNoteGetDTO
            {
                POLineItemID = obj.POLineItemID,
                ProjectId = obj.ProjectId,
                POID = obj.POID
            };

            var vResponse = await _purchaseOrderService.GetVendorDetailsinCreditNote<APIResponse>(Convert.ToString(obj.POID));
            var PAResponse = await _purchaseOrderService.GetProjectAccountName<APIResponse>(obj.ProjectId);
            var LIResponse = await _purchaseOrderService.GetLIinCN<APIResponse>(pOLIInCreditNoteGetDTO);

            mm.TotalInvoiceDataDTo = totalInvoiceAmountDTOs;
            mm.ProjectAccountInCN = PAResponse.UnwrapResultOrDefault<List<ProjectAccountGetDTO>>();
            mm.POLIinCN = LIResponse.UnwrapResultOrDefault<List<POLineItemandTaxesinCreditNoteDTO>>();
            mm.VendorDetailsInCN = vResponse.UnwrapResultOrDefault<VendorInCNDTO>();

            return PartialView("~/Views/PurchaseOrder/_partialCreditNoteModal.cshtml", mm);
        }
        public async Task<IActionResult> POCommit(CommitPODTO commitPODTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            commitPODTO.UpdatedBy = userId;
            var response = await _purchaseOrderService.CommitPO<APIResponse>(commitPODTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> InsertInvoice(InvoiceCreateDTO invoiceCreateDTO)
        {
            var response = await _purchaseOrderService.CreateInvoice<APIResponse>(invoiceCreateDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        [HttpPost]
        public async Task<IActionResult> AddPOLIinInvoiceItems([FromBody] List<InvoiceItemsCreateDTO> invoiceItemsCreateDTOs)
        {
            var response = await _purchaseOrderService.AddLIToInvoice<APIResponse>(invoiceItemsCreateDTOs);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> POReviseCheckNew(string POID)
        {
            var response = await _purchaseOrderService.CheckRevisePO<APIResponse>(POID);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> PORevise(POReviseDTO pOReviseDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOReviseDTO.UserId = userId;
            var response = await _purchaseOrderService.RevisePO<APIResponse>(pOReviseDTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdatePODetailsNew(SavePODTO savePODTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            savePODTO.UpdatedBy = userId;
            var response = await _purchaseOrderService.UpdatePODetailsNew<APIResponse>(savePODTO);
            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> ExpediteModal(string POLineItemId, string POID)
        {
            MultipleModel mm = new();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var longPOLineItemId = long.Parse(POLineItemId);
            var longPOID = long.Parse(POID);

            var response = await _purchaseOrderService.GetPORequiredDate<APIResponse>(longPOLineItemId, longPOID);

            var statusResponse = await _purchaseOrderService.GetPOLIStatus<APIResponse>(longPOLineItemId);

            var expediteQtyResponce = await _expediteService.GetTotalAndReceivedQtyOfExpediteNoteByLineItemIdAsync<APIResponse>(longPOLineItemId);
            var expediteQty = new SingleResultDTO
            {
                Result = expediteQtyResponce.Result?.ToString()
            };
            mm.singleResultDTO = expediteQty;
            mm.RequiredPODate = response.UnwrapResultOrDefault<RequiredPODateDTO>();
            mm.POLIStatusList = statusResponse.UnwrapResultOrDefault<List<POLIStatusDTO>>();
            ViewBag.POLIID = POLineItemId;

            return PartialView("~/Views/PurchaseOrder/_partialExpediteModal.cshtml", mm);
        }
        public async Task<IActionResult> POLIExpediteHistory(string POLineItemId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            MultipleModel mm = new();

            var response = await _purchaseOrderService.GetPOLIExpediteHistory<APIResponse>(long.Parse(POLineItemId));
            var pOLIExpediteHistoryDTOs = response.UnwrapResult<List<POLIExpediteHistoryDTO>>();

            if (pOLIExpediteHistoryDTOs == null || pOLIExpediteHistoryDTOs.Count == 0)
            {
                return Content("");
            }

            mm.POLIExpediteHistoryList = pOLIExpediteHistoryDTOs;

            var responsePermission = await _expediteService.GetHiddenField<APIResponse>(userId);
            mm.expediteHiddenFields = responsePermission.UnwrapResultOrDefault<HiddenFieldDto>();

            return PartialView("~/Views/PurchaseOrder/_partialPOLIExpediteHistorytable.cshtml", mm);
        }
        //public async Task<IActionResult> GetPOExpediteNoteInExpediteHistory(string POID)
        //{
        //    MultipleModel mm = new();
        //    List<POExpediteNoteDTO> POeditNoteList = new();
        //    var response = await _unitOfWork.PurchaseOrderService.GetPOExpediteNote<APIResponse>(POID);

        //    POeditNoteList = response.IsSuccess ?
        //        JsonConvert.DeserializeObject<List<POExpediteNoteDTO>>(Convert.ToString(response.Result))
        //        : new List<POExpediteNoteDTO>();

        //    mm.POExpediteNoteList = POeditNoteList;
        //    return PartialView("~/Views/PurchaseOrder/_paritalPOExpNoteinExpHistory.cshtml", mm);
        //}
        public async Task<IActionResult> SavePOLIExpNoteinExpModal(SaveLINoteDetailsDTO saveLINoteDetailsDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            saveLINoteDetailsDTO.UserID = userId;
            saveLINoteDetailsDTO.ItemStatus = saveLINoteDetailsDTO.ItemStatus ?? 0;
            saveLINoteDetailsDTO.ArrivalDate = saveLINoteDetailsDTO.ArrivalDate ?? "";
            saveLINoteDetailsDTO.Note = saveLINoteDetailsDTO.Note ?? "";
            saveLINoteDetailsDTO.ReceiveQty = saveLINoteDetailsDTO.ReceiveQty ?? 0;
            saveLINoteDetailsDTO.ReceiveDate = saveLINoteDetailsDTO.ReceiveDate ?? "";
            saveLINoteDetailsDTO.Reference = saveLINoteDetailsDTO.Reference ?? "";

            var response = await _purchaseOrderService.SavePOLIExpNoteinExpModal<APIResponse>(saveLINoteDetailsDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);

        }
        public async Task<IActionResult> SavePOExpediteNote(SavePOExpediteNoteCreateDTO savePOExpediteNoteCreateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            savePOExpediteNoteCreateDTO.UserId = userId;
            var response = await _purchaseOrderService.SavePOExpediteNote<APIResponse>(savePOExpediteNoteCreateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> SavePOExpediteNoteAllFull(SaveExpediteNoteFullDTO saveExpediteNoteFullDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            saveExpediteNoteFullDTO.UserID = userId;
            var response = await _purchaseOrderService.SavePOExpediteNoteAllFull<APIResponse>(saveExpediteNoteFullDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetPOCommittedDetails(string POLineItemID)
        {
            MultipleModel mm = new MultipleModel();

            var response = await _purchaseOrderService.GetCommitedPOLIDetails<APIResponse>(long.Parse(POLineItemID));

            mm.CommittedPOLIDetailsDTO = response.UnwrapResultOrDefault<List<CommittedPOLIDetailsDTO>>();

            return PartialView("~/Views/PurchaseOrder/_partialCommittedPODetails.cshtml", mm);
        }

        public async Task<IActionResult> HiddenPO(string POID, bool status)
        {
            var response = await _purchaseOrderService.HidePOFromVendor<APIResponse>(long.Parse(POID), status);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> SortPOLineItem(SortPOLineItemDTO sortPOLineItemDTO)
        {
            var response = await _purchaseOrderService.SortPOLineItemOrder<APIResponse>(sortPOLineItemDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> CheckInvoiceTotal(string POLIID)
        {
            var response = await _purchaseOrderService.CheckInvoiceTotal<APIResponse>(long.Parse(POLIID));

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> MakeItemZero(string POLineitemID)
        {
            var response = await _purchaseOrderService.MakeItemZero<APIResponse>("single", POLineitemID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> DeletePOLineItemsSingle(string POLineItemID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _purchaseOrderService.DeleteLineItemSingle<APIResponse>(POLineItemID, userId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> CheckItemInvoiceMultiple(string POLineItemIDs)
        {
            var response = await _purchaseOrderService.CheckItemInvoiceMultiple<APIResponse>(POLineItemIDs);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> DeleteMultiplePOLineItem(DeleteMultiplePOLineItemDTO deleteMultiplePOLineItemDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            deleteMultiplePOLineItemDTO.UseId = userId;
            var response = await _purchaseOrderService.DeletePOLineItemMultiple<APIResponse>(deleteMultiplePOLineItemDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);

        }

        public async Task<IActionResult> AddItemsToPOModal(string POID, string PONumber, string ProjectID)
        {
            ViewBag.POID = POID;
            MultipleModel mm = new();
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

            var response = await _purchaseOrderService.SectionListinAddPOLI<APIResponse>(POID, userId);
            var AllUOMResponse = await _budgetService.GetAllUOMInBudgetDetails<APIResponse>();
            var taxResponse = await _purchaseOrderService.GetTaxFromPO<APIResponse>(POID);
            var ItemApprovalResponse = await _purchaseOrderService.GetAprrovalType<APIResponse>();


            mm.SectionListInAddPOLI = response.UnwrapResultOrDefault<List<SectionListDDinPOLIDTO>>();
            mm.AllOUMDetailsListInBudgetDetails = AllUOMResponse.UnwrapResultOrDefault<List<AllOUMDetailsDTO>>();
            mm.TaxDataFromPO = taxResponse.UnwrapResultOrDefault<TaxDataFromPODTO>();
            mm.ProjectID = ProjectID;
            mm.dropDownListDTOs = ItemApprovalResponse.UnwrapResultOrDefault<List<DropDownListDTO>>();

            return PartialView("~/Views/PurchaseOrder/_partialAddPOLImodal.cshtml", mm);
        }

        public async Task<IActionResult> AddLIToList(string LineItemId)
        {
            var response = await _purchaseOrderService.GetAllLIDetails<APIResponse>(LineItemId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> PO_GetRequiredAndAssignedApprovers(string POID)
        {
            var response = await _purchaseOrderService.GetPO_GetRequiredAndAssignedApprovers<APIResponse>(POID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> CheckVendorConfirm(string POID)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
            var response = await _purchaseOrderService.CheckVendorConfirmation<APIResponse>(POID, userId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);

        }

        public async Task<IActionResult> ConfirmPOForVendor(ConfirmPOForVendorParams confirmPOForVendorParams)
        {
            confirmPOForVendorParams.Comment = confirmPOForVendorParams.Comment is null ? string.Empty : confirmPOForVendorParams.Comment;
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            confirmPOForVendorParams.UserId = userId;
            var response = await _purchaseOrderService.ConfirmPOForVendor<APIResponse>(confirmPOForVendorParams);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #region :: Fabrication       

        public async Task<IActionResult> GetFabricationApprovalList()
        {
            var ItemApprovalResponse = await _purchaseOrderService.GetAprrovalType<APIResponse>();

            if (ItemApprovalResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!ItemApprovalResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(ItemApprovalResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(ItemApprovalResponse.Result);
        }

        public async Task<IActionResult> CheckIsManager(string PurchaseOrderID)
        {
            var UserId = GetUserId();
            var IsManagerResponse = await _purchaseOrderService.IsManagerAsync<APIResponse>(PurchaseOrderID, UserId);

            if (IsManagerResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!IsManagerResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(IsManagerResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(IsManagerResponse.Result);

        }

        public async Task<IActionResult> GetFabricationItems(string POLineitemID, string ProjectID, string PurchaseOrderID, string IsManager, string UserType)
        {
            var UserId = GetUserId();
            var mm = new MultipleModel();

            var fabItemListResponse = await _purchaseOrderService.GetFabItemAsync<APIResponse>(POLineitemID, UserId.ToString(), PurchaseOrderID, ProjectID);

            mm.FabricationDataDTO = fabItemListResponse.UnwrapResultOrDefault<List<FabricationDataDTO>>();
            mm.IsManager = IsManager;
            mm.UserType = UserType;

            return PartialView("~/Views/PurchaseOrder/_partialFabricationItemList.cshtml", mm);
        }

        public async Task<IActionResult> GetFabIndvHistoryById(string PoLineItemApprovalID)
        {

            var UserId = GetUserId();
            var fabhistoryItemListResponse = await _purchaseOrderService.GetFabIndvHistoryAsync<APIResponse>(PoLineItemApprovalID, UserId.ToString());

            var fabHistoryItemList = fabhistoryItemListResponse.UnwrapResultOrDefault<List<FabricationHistoryDTO>>();

            var processedHistoryList = fabHistoryItemList.Select(item => new FabricationHistoryViewModel
            {
                HistoryID = item.HistoryID,
                ActionType = item.ActionType,
                Comment = item.Comment,
                FileNamePhysical = item.FileNamePhysical,
                FileNameToShow = item.FileNameToShow,
                ShowDate = item.ShowDate,
                Username = item.Username,
                ManagerName = item.ManagerName,
                CheckAuthority = item.CheckAuthority,
                RejectedOne = item.RejectedOne,
                POLineItemID = item.POLineItemID,
                WebRootPath = _webHostEnvironment.WebRootPath,
            }).ToList();

            var mm = new MultipleModel
            {
                FabricationHistoryDTO = processedHistoryList
            };

            return PartialView("~/Views/PurchaseOrder/_partialFabricationHistory.cshtml", mm);
        }

        [HttpPost]
        public async Task<IActionResult> FabApprovalItemValidation([FromForm] FabApprovalItemValidationDTO model)
        {
            var response = await _purchaseOrderService.FabApprovalItemValidationAsync<APIResponse>(model);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewFabrication([FromBody] List<CreateFabricationDTO> createModelList)
        {
            var UserId = GetUserId();

            createModelList.ForEach(item => item.UserId = UserId);

            var response = await _purchaseOrderService.NewFabricationCreateAsync<APIResponse>(createModelList);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> GetUsersOnFabrication(string Mode, string ApprovalID, string ProjectID)
        {
            var UserId = GetUserId().ToString();
            var FabUserResponse = await _purchaseOrderService.GetFabApprovalUsers<APIResponse>(Mode, ApprovalID, ProjectID, UserId);

            if (FabUserResponse == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!FabUserResponse.IsSuccess)
                return ApiResponseService.BadRequestResponse(FabUserResponse.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(FabUserResponse.Result);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateDescItemApproval(long ApprovalID, string desc)
        {
            var result = await _purchaseOrderService.UpdateFabricationDesAsync<APIResponse>(ApprovalID, desc);

            if (result == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!result.IsSuccess)
                return ApiResponseService.BadRequestResponse(result.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(result.Result);
        }


        [HttpPost]
        public async Task<IActionResult> AddPOApprovalItem([FromForm] AddFabItemDataDTO model)
        {
            model.ActionDate ??= string.Empty;
            model.Comment ??= string.Empty;
            model.FileNames ??= string.Empty;
            var currentUrl = $"{Request.Scheme}://{Request.Host}";

            var userid = GetUserId().ToString();
            var result = new APIResponse();
            string webRootPath = _webHostEnvironment.WebRootPath;
            string uploadPath = Path.Combine(webRootPath, "Assets/Approvals");

            if (model.ActionByProjectManager != "0")
            {
                string tmp = "";
                tmp = userid;
                model.ActionBy = model.ActionByProjectManager;
                model.ActionByProjectManager = tmp;
            }
            else
            {
                model.ActionBy = userid;
            }

            model.CurrentUrl = currentUrl;

            var response = await _purchaseOrderService.AddPOApprovalItemAsync<APIResponse>(model);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");

            var dto = JsonConvert.DeserializeObject<SingleResultDTO>(
                response?.Result?.ToString() ?? string.Empty
            );

            var FID = dto?.Result;

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            if (model.Files is not null)
            {
                foreach (var file in model.Files)
                {
                    try
                    {
                        var fileNameWithoutExt = Path.GetFileNameWithoutExtension(file.FileName);
                        var fileExtension = Path.GetExtension(file.FileName);
                        var newFileName = $"{FID}_{fileNameWithoutExt}{fileExtension}";
                        var filePath = Path.Combine(uploadPath, newFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                    }
                    catch (Exception ex)
                    {
                        //return CreateErrorResponse(result, $"File upload failed: {ex.Message}", System.Net.HttpStatusCode.InternalServerError);
                        return ApiResponseService.InternalServerResponse($"File upload failed: {ex.Message}");
                    }
                }
            }



            result.StatusCode = System.Net.HttpStatusCode.OK;
            result.IsSuccess = true;

            return ApiResponseService.SuccessResponse(result.Result);

        }

        public async Task<IActionResult> CheckCurrPathIdAndStatus(string POLineItemApprovalID)
        {
            var response = await _purchaseOrderService.CheckCurrPathIdAndStatusAsync<APIResponse>(POLineItemApprovalID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> DeleteFabHistory(string HistoryId, string POLineItemID)
        {
            var response = await _purchaseOrderService.DeleteFabricationHistoryAsync<APIResponse>(HistoryId, POLineItemID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> FabApprovalItemValidationOnAddPoLineItem(long ProjectID)
        {
            var response = await _purchaseOrderService.FabApprovalItemValidationOnAddPoLineItemAsync<APIResponse>(ProjectID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        #endregion

        public async Task<IActionResult> UpdatePOLIExpeditenote(POLineItemExpediteNoteUpdateDTO pOLineItemExpediteNoteUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOLineItemExpediteNoteUpdateDTO.CreatedBy = userId;
            pOLineItemExpediteNoteUpdateDTO.POLineItemExpediteNote = string.IsNullOrWhiteSpace(pOLineItemExpediteNoteUpdateDTO.POLineItemExpediteNote) ? string.Empty : Uri.UnescapeDataString(pOLineItemExpediteNoteUpdateDTO.POLineItemExpediteNote);

            var response = await _purchaseOrderService.UpdatePOLIExpediteNote<APIResponse>(pOLineItemExpediteNoteUpdateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> UpdatePOExpeditenote(POExpNoteUpdateDTO pOExpNoteUpdateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOExpNoteUpdateDTO.UserID = userId;
            pOExpNoteUpdateDTO.Note = Uri.UnescapeDataString(pOExpNoteUpdateDTO.Note ?? "");
            var response = await _purchaseOrderService.EditPOExpediteNote<APIResponse>(pOExpNoteUpdateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> DeletePOLIExpNote(string FldID)
        {
            var response = await _purchaseOrderService.DeletePOLIExpNote<APIResponse>(FldID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        public async Task<IActionResult> DeletePOExpNote(string FldID)
        {
            var response = await _purchaseOrderService.DeletePOExpNote<APIResponse>(FldID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        #endregion

        #region :: Add PO LineItem
        public async Task<IActionResult> AddItemsToPO(string POID, string PONumber, string ProjectID)
        {
            ViewData["POIDTOSHOW"] = PONumber;
            ViewBag.POID = POID;

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";

            var response = await _purchaseOrderService.SectionListinAddPOLI<APIResponse>(POID, userId);
            var AllUOMResponse = await _budgetService.GetAllUOMInBudgetDetails<APIResponse>();
            var taxResponse = await _purchaseOrderService.GetTaxFromPO<APIResponse>(POID);

            var mm = new MultipleModel();

            mm.SectionListInAddPOLI = response.UnwrapResultOrDefault<List<SectionListDDinPOLIDTO>>();
            mm.AllOUMDetailsListInBudgetDetails = AllUOMResponse.UnwrapResultOrDefault<List<AllOUMDetailsDTO>>();
            mm.TaxDataFromPO = taxResponse.UnwrapResultOrDefault<TaxDataFromPODTO>();
            mm.ProjectID = ProjectID;

            return View(mm);
        }
        public async Task<IActionResult> LineItemDropDownList(string POID, string SectionId)
        {
            var response = await _purchaseOrderService.GetLineItemListInPOLI<APIResponse>(POID, SectionId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> SelectedLineItemDetails(string LineItemId)
        {
            var response = await _purchaseOrderService.GetSelectedLineItemDetails<APIResponse>(LineItemId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> LoadAutoTagData(string LineItemID)
        {
            var response = await _purchaseOrderService.LoadAutoTagData<APIResponse>(LineItemID);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        public async Task<IActionResult> GetAllApprovalType()
        {
            var response = await _purchaseOrderService.GetAprrovalType<APIResponse>();

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddLineItems(POLineItemCreateDTO pOLineItemCreateDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            pOLineItemCreateDTO.UserId = userId;
            var response = await _purchaseOrderService.AddnewPOLineItems<APIResponse>(pOLineItemCreateDTO);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }

        [HttpPost]
        public async Task<IActionResult> AddPOLineItemMulti([FromBody] List<AddNewPOLIParamsDTO> addNewPOLIParamsDTOs)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
            var response = await _purchaseOrderService.AddPOLIMulti<APIResponse>(addNewPOLIParamsDTOs, userId);

            if (response == null)
                return ApiResponseService.InternalServerResponse("Unable to process the request.");
            if (!response.IsSuccess)
                return ApiResponseService.BadRequestResponse(response.ErrorMessages?.FirstOrDefault() ?? "Operation failed.");
            return ApiResponseService.SuccessResponse(response.Result);
        }
        #endregion
    }
}
