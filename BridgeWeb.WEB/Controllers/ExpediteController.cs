using BridgeWeb.Application.Common.Interfaces.Expedite;
using BridgeWeb.Application.Common.Interfaces.PurchasedOrder;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Expedite;
using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace BridgeWeb.WEB.Controllers
{
    [Authorize]
    //[ServiceFilter(typeof(GlobalExceptionRedirection))]
    public class ExpediteController : Controller
    {
        private readonly IExpediteService _expediteService;
        private readonly IPurchaseOrderService _purchaseOrderService;

        public ExpediteController(IExpediteService expediteService, IPurchaseOrderService purchaseOrderService)
        {
            _expediteService = expediteService;
            _purchaseOrderService = purchaseOrderService;
        }

        [PageAuthorization("17,18")]
        public async Task<IActionResult> Home()
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var multiModel = new MultipleModel();

            var data = await _expediteService.GetAllProjectListForExepediteAsync<APIResponse>(userId);
            multiModel.dropDownListDTOs = data.UnwrapResultOrDefault<List<DropDownListDTO>>();

            var statusData = await _expediteService.GetAllPoItemStatus<APIResponse>();
            multiModel.status_Expedites = statusData.UnwrapResultOrDefault<List<PoLineItemStatus_Expedite>>();


            var response = await _expediteService.GetHiddenField<APIResponse>(userId);
            multiModel.expediteHiddenFields = response.UnwrapResultOrDefault<HiddenFieldDto>();

            return View(multiModel);
        }

        [HttpPost]
        public async Task<IActionResult> LoadVendorPart(string ProjectId)
        {
            var model = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _expediteService.LoadVendorPart<APIResponse>(userId, ProjectId);

            model.vendorListDtos_Expedite = response.UnwrapResultOrDefault<List<VendorListDto_Expedite>>();

            return PartialView("_LoadVendorPart", model);
        }

        [HttpPost]
        public async Task<string> VendorPartCount(string ProjectId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _expediteService.LoadVendorPart<APIResponse>(userId, ProjectId);
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        public async Task<IActionResult> LoadVendorPartWithQuery(string ProjectId, string Query, string Flag)
        {
            string pattern = @"(\d{2}/\d{2}/\d{4})";
            string replacement = "CONVERT(DATETIME, '$1', 103)";
            string output = Regex.Replace(Query, pattern, replacement);

            string decodedQuery = WebUtility.UrlDecode(output);
            var model = new MultipleModel();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _expediteService.LoadVendorPartWithQuery<APIResponse>(userId, ProjectId, decodedQuery, Flag);

            var result = response.UnwrapResultOrDefault<List<VendorListDto_Expedite>>();
            model.vendorListDtos_Expedite = result;

            return PartialView("_LoadVendorPart", model);
        }

        [HttpPost]
        public async Task<string> LoadVendorPartWithQueryCount(string ProjectId, string Query, string Flag)
        {
            string pattern = @"(\d{2}/\d{2}/\d{4})";
            string replacement = "CONVERT(DATETIME, '$1', 103)";
            string output = Regex.Replace(Query, pattern, replacement);
            string decodedQuery = WebUtility.UrlDecode(output);

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var response = await _expediteService.LoadVendorPartWithQuery<APIResponse>(userId, ProjectId, decodedQuery, Flag);
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        public async Task<IActionResult> GetPurchaseOrdersByContactID(string VendorId, string ProjectId, string Query)
        {
            string decodedQuery = string.Empty;
            if (!string.IsNullOrEmpty(Query))
            {
                string pattern = @"(\d{2}/\d{2}/\d{4})";
                string replacement = "CONVERT(DATETIME, '$1', 103)";
                string output = Regex.Replace(Query, pattern, replacement);
                decodedQuery = WebUtility.UrlDecode(output);
            }


            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var checkAuthResponse = await _purchaseOrderService.CheckAuthorityForPOEdit<APIResponse>(userId);
            ViewBag.IsEditable = Convert.ToString(checkAuthResponse.Result);

            var response = await _expediteService.PurchaseOrderByContactId<APIResponse>(userId, VendorId, ProjectId, decodedQuery);
            var result = response.UnwrapResultOrDefault<List<PurchaseOrderDto_Expedite>>();

            return PartialView("_SecondLevelAccVendor", result);
        }

        [HttpPost]
        public async Task<IActionResult> LoadBudgetSectionPart(string ProjectId)
        {
            var model = new MultipleModel();
            var response = await _expediteService.LoadBudgetSectionPart<APIResponse>(ProjectId);

            var result = response.UnwrapResultOrDefault<List<ProjectSectionDto_Expedite>>();
            model.projectSectionDto_Expedites = result;
            return PartialView("_LoadBudgetSectionPart", model);
        }

        [HttpPost]
        public async Task<string> LoadBudgetSectionPartCount(string ProjectId)
        {
            var response = await _expediteService.LoadBudgetSectionPart<APIResponse>(ProjectId);
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        public async Task<IActionResult> GetAllBudgetItemsByBudgetSectionId(long BudgetSectionId)
        {
            var response = await _expediteService.GetAllBudgetItemsByBudgetSectionId<APIResponse>(BudgetSectionId);
            var result = response.UnwrapResultOrDefault<List<BudgetLineItemsDto_Expedite>>();

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            var checkAuthResponse = await _purchaseOrderService.CheckAuthorityForPOEdit<APIResponse>(userId);
            ViewBag.IsEditable = Convert.ToString(checkAuthResponse.Result);

            return PartialView("_SecondLevelAccBudgetSection", result);
        }

        [HttpPost]
        public async Task<string> MakeDropdown(string Mode, long PID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var apiResponse = await _expediteService.MakeDropdown<APIResponse>(userId, Mode, PID);
            return JsonConvert.SerializeObject(apiResponse);
        }

        [HttpGet]
        public async Task<string> CheckFrieght(string POLineItemId)
        {
            var response = await _expediteService.CheckFrieght<APIResponse>(POLineItemId);
            return JsonConvert.SerializeObject(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetPOExpediteNoteInExpedite(string POLineItemID)
        {

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            MultipleModel mm = new();

            var response = await _purchaseOrderService.GetPOExpediteNote<APIResponse>(POLineItemID);
            var POeditNoteList = response.UnwrapResultOrDefault<List<POExpediteNoteDTO>>();
            if (POeditNoteList == null || POeditNoteList.Count == 0)
            {
                return Content("");
            }
            mm.POExpediteNoteList = POeditNoteList;

            var responsePermission = await _expediteService.GetHiddenField<APIResponse>(userId);
            mm.expediteHiddenFields = responsePermission.UnwrapResultOrDefault<HiddenFieldDto>();

            return PartialView("~/Views/Expedite/_paritalPOExpNoteinExp.cshtml", mm);


            //var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            //MultipleModel mm = new();
            //PermissionDto permissionDto = new PermissionDto();

            //if (string.IsNullOrEmpty(permission) || string.IsNullOrEmpty(permission))
            //{
            //    var permissionResponse = await _unitOfWork.ExpediteService.GetUserEditPermission<APIResponse>(userId);

            //    permissionDto = permissionResponse.IsSuccess ?
            //                    JsonConvert.DeserializeObject<PermissionDto>(Convert.ToString(permissionResponse.Result))
            //                    : new PermissionDto() { IsSelected = 0 };


            //}

            //List<POExpediteNoteDTO> POeditNoteList = new();

            //var response = await _unitOfWork.PurchaseOrderService.GetPOExpediteNote<APIResponse>(POLineItemID);

            //POeditNoteList = response.IsSuccess ?
            //    JsonConvert.DeserializeObject<List<POExpediteNoteDTO>>(Convert.ToString(response.Result))
            //    : new List<POExpediteNoteDTO>();

            //mm.POExpediteNoteList = POeditNoteList;

            //mm.Permission = string.IsNullOrEmpty(permission) || string.IsNullOrEmpty(permission) ? permissionDto :
            //    new PermissionDto { IsSelected = Convert.ToInt64(permission) };

            //return PartialView("~/Views/Expedite/_paritalPOExpNoteinExp.cshtml", mm);
        }

        public async Task<string> SavePOExpediteNoteOnly(SavePOExpediteNoteExpPageDTO savePOExpediteNoteExpPageDTO)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            savePOExpediteNoteExpPageDTO.UserId = userId;
            var response = await _expediteService.AddOnlyPOExpediteNote<APIResponse>(savePOExpediteNoteExpPageDTO);
            return JsonConvert.SerializeObject(response);
        }

        public async Task<IActionResult> ExpediteModal(string POLineItemId, string POID)
        {
            MultipleModel mm = new MultipleModel();

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var longPOLineItemId = long.Parse(POLineItemId);
            var longPOID = long.Parse(POID);


            var response = await _purchaseOrderService.GetPORequiredDate<APIResponse>(longPOLineItemId, longPOID);
            var requiredPODateDTO = response.UnwrapResultOrDefault<RequiredPODateDTO>();

            var statusResponse = await _purchaseOrderService.GetPOLIStatus<APIResponse>(longPOLineItemId);
            var pOLIStatusDTOs = statusResponse.UnwrapResultOrDefault<List<POLIStatusDTO>>();

            var expediteQtyResponce = await _expediteService.GetTotalAndReceivedQtyOfExpediteNoteByLineItemIdAsync<APIResponse>(longPOLineItemId);
            var expediteQty = new SingleResultDTO
            {
                Result = expediteQtyResponce.Result?.ToString()
            };

            mm.singleResultDTO = expediteQty;


            var responsePermission = await _expediteService.GetHiddenField<APIResponse>(userId);
            mm.expediteHiddenFields = responsePermission.UnwrapResultOrDefault<HiddenFieldDto>();

            mm.RequiredPODate = requiredPODateDTO;
            mm.POLIStatusList = pOLIStatusDTOs;
            ViewBag.POLIID = POLineItemId;

            return PartialView("~/Views/Expedite/_partialExpediteModalinExpPage.cshtml", mm);
        }
        public async Task<IActionResult> POLIExpediteHistory(string POLineItemId)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            MultipleModel mm = new MultipleModel();

            //PermissionDto permissionDto = new PermissionDto();
            //var permissionResponse = await _unitOfWork.ExpediteService.GetUserEditPermission<APIResponse>(userId);
            //permissionDto = permissionResponse.IsSuccess ?
            //                JsonConvert.DeserializeObject<PermissionDto>(Convert.ToString(permissionResponse.Result))
            //                : new PermissionDto() { IsSelected = 0 };
            //mm.Permission = permissionDto;

            var response = await _purchaseOrderService.GetPOLIExpediteHistory<APIResponse>(long.Parse(POLineItemId));
            var pOLIExpediteHistoryDTOs = response.UnwrapResult<List<POLIExpediteHistoryDTO>>();
            if (pOLIExpediteHistoryDTOs == null || pOLIExpediteHistoryDTOs.Count == 0)
            {
                return Content("");
            }
            mm.POLIExpediteHistoryList = pOLIExpediteHistoryDTOs;

            var responsePermission = await _expediteService.GetHiddenField<APIResponse>(userId);
            mm.expediteHiddenFields = responsePermission.UnwrapResultOrDefault<HiddenFieldDto>();

            return PartialView("~/Views/Expedite/_partialPOLIExpediteHistorytableinExpPage.cshtml", mm);
        }

        [HttpGet]
        public async Task<IActionResult> GetPONoteInExpediteOnly(long POID)
        {
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            MultipleModel mm = new();

            var response = await _purchaseOrderService.GetPOExpediteNoteByPoid<APIResponse>(POID);

            var POeditNoteList = response.UnwrapResultOrDefault<List<POExpediteNoteDTO>>();

            mm.POExpediteNoteList = POeditNoteList;


            var responsePermission = await _expediteService.GetHiddenField<APIResponse>(userId);
            mm.expediteHiddenFields = responsePermission.UnwrapResultOrDefault<HiddenFieldDto>();

            return PartialView("~/Views/Expedite/_paritalPOExpNoteinExpOnly.cshtml", mm);
        }

        public async Task<string> GetPOLineItemStatusByProjectID(string PoLineItemId)
        {
            var response = await _expediteService.GetPoLineitemStatusModified<APIResponse>(PoLineItemId);
            return JsonConvert.SerializeObject(response);
        }
    }
}