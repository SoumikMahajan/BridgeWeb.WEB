using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.PurchasedOrder;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BridgeWeb.Infrastructure.Service.PurchasedOrder
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;

        public PurchaseOrderService(IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            var hostName = httpContextAccessor.HttpContext?.Request.Host.Host
                 ?? throw new InvalidOperationException("HttpContext or Host is not available"); ;

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            _bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        #region Create PO and Po List

        public async Task<T> GetAllProjectOnPoList<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/get-all-project-list-for-polist/" + UserId,
            });
        }

        public async Task<T> GetAllVendor<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-All-Vendor-For-Purchase-Order/",
            });
        }
        public async Task<T> GetAllBuyerWithDefault<T>(long VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-All-Buyer-With-Default-For-Purchase-Order/" + VendorId,
            });
        }
        public async Task<T> GetAllActiveTerms<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-All-Active-Terms-For-Purchase-Order/",
            });
        }
        public async Task<T> GetAllShipment<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-All-Shipment-For-Purchase-Order/",
            });
        }
        public async Task<T> GetAllAddressListWithDetails<T>(long ProjectId, long VendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Address-List-For-Purchase-Order/{ProjectId}/{VendorId}"
            });
        }
        public async Task<T> GetAllVendorForPurchaseOrderByProjectId<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-All-Vendor-For-Purchase-Order-By-Project-Id/" + ProjectId,
            });
        }
        public async Task<T> GetShipToAndInvoiceTo<T>(long projectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/PurchaseOrderAPI/Get-ShipTo-And-InvoiceTo/" + projectId,
            });
        }
        public async Task<T> SavePurchaseOrder<T>(SavePurchaseOrderDto orderDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = orderDto,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Save-Purchase-Order"
            });
        }
        public async Task<T> GetAllVendorListByProjectIds<T>(long UserId, string ProjectIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Vendor-DD-List/{UserId}/{ProjectIds}"
            });
        }
        public async Task<T> GetAllSectionListByProjectIds<T>(string ProjectIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Section-DD-List/{ProjectIds}"
            });
        }
        public async Task<T> GetPriority<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Priority/{UserId}"
            });
        }
        public async Task<T> GetFilteredPurchaseOrders<T>(PurchaseOrderFilteredDto filteredDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = filteredDto,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Filtered-Purchased-Orders"
            });
        }
        public async Task<T> GetPoDetailsForApproval<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Details-For-Approval/{PoIds}"
            });
        }
        public async Task<T> GetPOMailTemplate<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Mail-Template"
            });
        }
        public async Task<T> GetVendorIdFromMailPOIds<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-VendorId-From-Mail-PoIds/{PoIds}"
            });
        }
        public async Task<T> GetPoDetailsForDownload<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Details-For-Download/{PoIds}"
            });
        }
        public async Task<T> GetPoFilesToDownload<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Files-To-Download/{PoIds}"
            });
        }
        public async Task<T> GetPoTermsFiles<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Terms-Files/{PoIds}"
            });
        }
        public async Task<T> GetUserTypeByUserId<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-User-Type-By-UserId/{UserId}"
            });
        }
        public async Task<T> GetPoEditPermissionByUserId<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Po-Edit-Permission-By-UserId/{UserId}"
            });
        }
        public async Task<T> SendVendorMail<T>(VendorEmailDetailsDto detailsDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = detailsDto,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Send-Vendor-Mail"
            });
        }
        public async Task<T> DeletePO<T>(long PoId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Delete-PO/{PoId}"
            });
        }

        public async Task<T> CheckInvoiceExist<T>(long PoId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Check-Invoice-Exist/{PoId}"
            });
        }
        public async Task<T> GetFormattedTermFiles<T>(string PoIds)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Formatted-Term-Files/{PoIds}"
            });
        }
        public async Task<T> SendForBatchApproval<T>(BatchApprovalDto approvalDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = approvalDto,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Send-For-Batch-Approval"
            });
        }
        public async Task<T> GetDeletedPoList<T>(DeletedPoFilterDto approvalDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = approvalDto,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Deleted-PoList"
            });
        }

        public async Task<T> RecyclePO<T>(long PoId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Recycle-Po/{PoId}"
            });
        }

        public async Task<T> GetProjectApproversById<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/Get-Project-Approvers-By-Id/{ProjectId}"
            });
        }

        #endregion

        #region :: PO Edit
        public async Task<T> PurchaseOrderRequiredDetails<T>(long POId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-required-details-for-hidden-value/{POId}/{UserId}"
            });

        }
        public async Task<T> CheckAuthorityForPOEdit<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-authority-for-po-edit/{UserId}"
            });
        }

        public async Task<T> GetPOById<T>(long UserId, long POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-by-id/{UserId}/{POID}"
            });

        }

        public async Task<T> GetCalculatedTax<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-calculated-tax/{POID}"
            });
        }
        public async Task<T> GetVendorListNew<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-all-vendornew-in-po-edit"
            });
        }
        public async Task<T> GetBuyerDetails<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-buyer-details"
            });
        }


        public async Task<T> GetShipmentVendorCo<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-shipment-vendor-details/{POID}"
            });
        }
        public async Task<T> GetTaxByPOID<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-tax-by-po-no/{POID}"
            });
        }
        public async Task<T> GetPOFileToShow<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-project-files-to-include-po/{POID}"
            });
        }
        public async Task<T> GetPOComments<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-comments-by-poid/{POID}"
            });
        }
        public async Task<T> GetInvoiceDatainPOEdit<T>(long UserId, long POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-invoice-data-on-poedit/{UserId}/{POID}"
            });
        }

        public async Task<T> GetVendorAddress<T>(string VendorCoId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-vendor-address-poedit/{VendorCoId}"
            });
        }
        public async Task<T> GetAddressListVendorCo<T>(long VendorID, long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/address-list/{VendorID}/{ProjectId}"
            });
        }

        public async Task<T> POTaxUpdate<T>(POTaxUpdateDTO pOTaxUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOTaxUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-updated-tax-po-edit"
            });
        }

        public async Task<T> POFileToExposeUpdate<T>(string File)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,

                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-po-files-to-expose/{File}"
            });
        }

        public async Task<T> UpdatePOComment<T>(CommentUpdateDTO commentUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = commentUpdateDTO,

                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-po-comments"
            });
        }

        public async Task<T> GetPOLevelFileList<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-level-file/{POID}"
            });
        }

        public async Task<T> GetPOExpediteNote<T>(string POLineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-expedite-note/{POLineItemID}"
            });
        }
        public async Task<T> GetPOExpediteNoteByPoid<T>(long POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-expedite-note-by-poid/{POID}"
            });
        }
        public async Task<T> UpdatePOCommentsAndAttachments<T>(POCommentsAttachmentsSaveDTO pOCommentsAttachmentsSaveDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOCommentsAttachmentsSaveDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-po-comments-attachments"
            });
        }
        public async Task<T> SavePOExpediteNotes<T>(POExpediteNoteCreateDTO pOExpediteNoteCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOExpediteNoteCreateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-po-expedite-note"
            });
        }
        public async Task<T> SaveUpdatedPOExpediteNotes<T>(POExpediteNoteUpdateDTO pOExpediteNoteUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOExpediteNoteUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-updated-po-expedite-note"
            });
        }
        public async Task<T> DeletePOExpediteNote<T>(string Fldid, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-po-expedite-note/{Fldid}/{UserId}"
            });
        }

        public async Task<T> DeletePOLevelFileList<T>(string FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-polevel-filelist/{FldId}"
            });
        }
        public async Task<T> SetExposedPOLevelFileList<T>(string FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/set-exposed-po-level-file-list/{FldId}"
            });
        }

        public async Task<T> GetAllPOLineItems<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-all-po-line-items/{POID}"
            });
        }
        public async Task<T> GetProjectConversionRate<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-project-conversion-rate-po-edit/{ProjectId}"
            });
        }

        public async Task<T> GetPOCalculatedTax<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-calculated-tax/{POID}"
            });
        }
        public async Task<T> GetPOCalcualtedInvoiceTax<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-invoice-tax-value/{POID}"
            });
        }
        public async Task<T> GetPOLineItemsByPoLineItemId<T>(string POLineItemId, string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-line-item-by-po-line-item-id/{POLineItemId}/{POID}"
            });
        }

        public async Task<T> GetAllPOLineItemsonExpand<T>(string POLineItemId, string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-all-po-lineitem-on-expand/{POLineItemId}/{POID}"
            });

        }
        public async Task<T> CheckPOITEMTOTALLValue<T>(string POLineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-POITEMTOTALL-value/{POLineItemId}"
            });
        }

        public async Task<T> UpdatePOLineItemsOnExpand<T>(POLineItemUpdateDTO pOLineItemUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOLineItemUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/po-line-item-save-update"
            });
        }

        public async Task<T> UpdatePOLineItemCostAndQuantity<T>(POLineItemUpdateCostandQuantityDTO pOLineItemUpdateCostandQuantityDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOLineItemUpdateCostandQuantityDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-only-cost-and-quantity"
            });
        }
        public async Task<T> SaveAllPOLineItems<T>(List<POLineItemUpdateDTO> pOLineItemUpdateDTOs)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOLineItemUpdateDTOs,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-all-po-lineitems-data"
            });
        }

        public async Task<T> SaveSendForApproval<T>(SendForApprovalUpdateDTO sendForApprovalUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = sendForApprovalUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/send-for-approval-save"
            });
        }
        public async Task<T> CancelSendApproval<T>(string POID, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/cancel-comit-send-PO/{POID}/{UserID}"
            });
        }

        public async Task<T> MoveNextOrPrevious<T>(MoveNextOrPrevDTO moveNextOrPrevDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = moveNextOrPrevDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/move-to-next-previous-PO"
            });
        }
        public async Task<T> POCopy<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-detials-for-copy-po/{POID}"
            });
        }

        public async Task<T> FabApprovalItemValidationAsync<T>(FabApprovalItemValidationDTO model)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/fab-approval-item-validation",
                Data = model
            });
        }

        public async Task<T> IsManagerAsync<T>(string PurchaseOrderID, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/project-is-manager/{PurchaseOrderID}/{UserId}"
            });
        }

        public async Task<T> NewFabricationCreateAsync<T>(List<CreateFabricationDTO> CreateModelList)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = CreateModelList,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/insert-new-fabrication-items"
            });
        }

        public async Task<T> GetFabItemAsync<T>(string POLineitemID, string UserId, string PurchaseOrderID, string ProjectID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-fabrication-items/{POLineitemID}/{UserId}/{PurchaseOrderID}/{ProjectID}"
            });
        }

        public async Task<T> GetFabApprovalUsers<T>(string Mode, string ApprovalID, string ProjectId, string UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-fabusers-for-approval/{Mode}/{ApprovalID}/{ProjectId}/{UserId}"
            });
        }

        public async Task<T> UpdateFabricationDesAsync<T>(long ApprovalID, string desc)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-fabitem-description/{ApprovalID}/{desc}"
            });
        }

        public async Task<T> CheckCurrPathIdAndStatusAsync<T>(string POLineItemApprovalID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-curr-fab-status-path/{POLineItemApprovalID}"
            });
        }

        public async Task<T> FabApprovalItemValidationOnAddPoLineItemAsync<T>(long ProjectID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/fab-approval-item-validation-on-polineitem-addpage/{ProjectID}"
            });
        }

        public async Task<T> AddPOApprovalItemAsync<T>(AddFabItemDataDTO model)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = model,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/add-po-approval-item"
            });
        }

        public async Task<T> CheckInvoiceTotal<T>(long POLineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-item-invoice-total-single/{POLineItemID}"
            });
        }
        public async Task<T> MakeItemZero<T>(string mode, string POLineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/make-zero-po-lineitems/{mode}/{POLineItemId}"
            });
        }
        public async Task<T> DeleteLineItemSingle<T>(string POLineItemID, long UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-po-line-item/{POLineItemID}/{UserID}"
            });
        }

        public async Task<T> CheckItemInvoiceMultiple<T>(string POLineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-item-invoice-total-multiple/{POLineItemID}"
            });
        }

        public async Task<T> DeletePOLineItemMultiple<T>(DeleteMultiplePOLineItemDTO deleteMultiplePOLineItemDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = deleteMultiplePOLineItemDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-multiple-po-line-item"
            });
        }

        public async Task<T> DeleteFabricationHistoryAsync<T>(string HistoryId, string POLineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-fabrication-history/{HistoryId}/{POLineItemID}"
            });
        }

        public async Task<T> GetAllLIDetails<T>(string LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-all-li-details/{LineItemId}"
            });
        }

        public async Task<T> GetPO_GetRequiredAndAssignedApprovers<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/po-get-required-and-assigned-approvers/{POID}"
            });
        }

        public async Task<T> CheckVendorConfirmation<T>(string POID, string UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-vendor-confirm/{POID}/{UserID}"
            });
        }

        public async Task<T> ConfirmPOForVendor<T>(ConfirmPOForVendorParams confirmPOForVendorParams)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = confirmPOForVendorParams,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/confirm-po-for-vendor"
            });
        }

        public async Task<T> UpdatePOLIExpediteNote<T>(POLineItemExpediteNoteUpdateDTO pOLineItemExpediteNoteUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOLineItemExpediteNoteUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-po-li-exp-note"
            });
        }

        public async Task<T> EditPOExpediteNote<T>(POExpNoteUpdateDTO pOExpediteNoteUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOExpediteNoteUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/edit-po-expedite-note"
            });
        }

        public async Task<T> DeletePOLIExpNote<T>(string FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-po-li-exp-note/{FldId}"
            });
        }
        public async Task<T> DeletePOExpNote<T>(string FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/delete-po-exp-note/{FldId}"
            });
        }
        #endregion

        #region :: Add PO LI
        public async Task<T> SectionListinAddPOLI<T>(string POID, string UserID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-project-section-in-add-lineitem-po/{POID}/{UserID}"
            });
        }

        public async Task<T> GetLineItemListInPOLI<T>(string POID, string SectionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-lineitems-in-po-add-line-items/{POID}/{SectionId}"
            });
        }
        public async Task<T> GetSelectedLineItemDetails<T>(string LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-line-items-details/{LineItemId}"
            });
        }
        public async Task<T> LoadAutoTagData<T>(string LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-load-tag-po-lineitem-add/{LineItemId}"
            });
        }
        public async Task<T> GetTaxFromPO<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-taxes-from-PO/{POID}"
            });
        }
        public async Task<T> GetAprrovalType<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-all-item-approval"
            });
        }
        public async Task<T> AddnewPOLineItems<T>(POLineItemCreateDTO pOLineItemCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOLineItemCreateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/add-new-po-lineitem"
            });
        }
        public async Task<T> GetPODataForCountZero<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-data-for-commit/{POID}"
            });
        }
        public async Task<T> checkItemForCommit<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/check-item-po-commit/{POID}"
            });
        }
        public async Task<T> GetVendorDetailsinCreditNote<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-vendor-details-for-credit-note/{POID}"
            });
        }

        public async Task<T> GetProjectAccountName<T>(long ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-project-account-credit-note/{ProjectId}"
            });
        }
        public async Task<T> GetLIinCN<T>(POLIInCreditNoteGetDTO pOLIInCreditNoteGetDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Data = pOLIInCreditNoteGetDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-poline-item-detials-in-credit-note"
            });
        }
        public async Task<T> CommitPO<T>(CommitPODTO commitPODTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = commitPODTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/po-commit"
            });
        }
        public async Task<T> CreateInvoice<T>(InvoiceCreateDTO invoiceCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = invoiceCreateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/insert-invoice-credit-note"
            });
        }
        public async Task<T> AddLIToInvoice<T>(List<InvoiceItemsCreateDTO> invoiceItemsCreateDTOs)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = invoiceItemsCreateDTOs,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/insert-line-items-cn"
            });
        }
        public async Task<T> CheckRevisePO<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/po-revise-check-new/{POID}"
            });
        }
        public async Task<T> RevisePO<T>(POReviseDTO pOReviseDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = pOReviseDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/po-revise-version-create"
            });
        }
        public async Task<T> SavePOUpdatecheckbackdateandNote<T>(CheckBackDateandNoteUpdateDTO checkBackDateandNoteUpdateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = checkBackDateandNoteUpdateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-checkbackdate-note"
            });
        }
        public async Task<T> UpdatePODetailsNew<T>(SavePODTO savePODTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = savePODTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/update-po-details-new"
            });
        }
        public async Task<T> GetPORequiredDate<T>(long POLineItemID, long POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-approval-date/{POLineItemID}/{POID}"
            });
        }
        public async Task<T> GetPOLIStatus<T>(long POLIID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-li-status-by-id/{POLIID}"
            });
        }
        public async Task<T> GetPOLIExpediteHistory<T>(long POLIID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-po-li-expedite-history/{POLIID}"
            });
        }
        public async Task<T> SavePOLIExpNoteinExpModal<T>(SaveLINoteDetailsDTO saveLINoteDetailsDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = saveLINoteDetailsDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-po-li-exp-note-in-exp-modal"
            });
        }

        public async Task<T> SavePOExpediteNote<T>(SavePOExpediteNoteCreateDTO savePOExpediteNoteCreateDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = savePOExpediteNoteCreateDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-po-exp-note-in-exp-modal"
            });
        }
        public async Task<T> SavePOExpediteNoteAllFull<T>(SaveExpediteNoteFullDTO saveExpediteNoteFullDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = saveExpediteNoteFullDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/save-exp-note-full"
            });
        }
        public async Task<T> GetCommitedPOLIDetails<T>(long POLineItemID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,

                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-commited-po-li-details/{POLineItemID}"
            });
        }
        public async Task<T> HidePOFromVendor<T>(long POID, bool status)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/hide-po/{POID}/{status}"
            });
        }

        public async Task<T> SortPOLineItemOrder<T>(SortPOLineItemDTO sortPOLineItemDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = sortPOLineItemDTO,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/sort-po-line-item"
            });
        }

        public async Task<T> GetFabIndvHistoryAsync<T>(string PoLineItemApprovalID, string UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/get-fabrication-history/{PoLineItemApprovalID}/{UserId}"
            });
        }


        public async Task<T> AddPOLIMulti<T>(List<AddNewPOLIParamsDTO> addNewPOLIParamsDTOs, string UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = addNewPOLIParamsDTOs,
                Url = _bridgeUrl + $"/api/PurchaseOrderAPI/add-poli-multiple/{UserId}"
            });
        }

        #endregion

        #region :: PO History

        public async Task<T> GetPOHistoryDetails<T>(string POID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po-history-details/{POID}"
            });
        }

        public async Task<T> GetPoHistoryLineItems<T>(string PoId, string Flid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po-history-details/{PoId}/{Flid}"
            });
        }

        public async Task<T> GetAllHistory<T>(string POID, string? Version = null)
        {
            if (string.IsNullOrEmpty(Version) || string.IsNullOrWhiteSpace(Version))
            {
                return await _baseService.SendAsync<T>(new APIRequest
                {
                    ApiType = SD.ApiType.GET,
                    Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-all-po-history-details/{POID}"
                });
            }
            else
            {
                return await _baseService.SendAsync<T>(new APIRequest
                {
                    ApiType = SD.ApiType.GET,
                    Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-all-po-history-details/{POID}/{Version}"
                });
            }
        }

        public async Task<T> HistoryDetailsByFldID<T>(string FldID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po-history-details-by-fldid/{FldID}"
            });
        }

        public async Task<T> POItemHistoryDetailsBYFldid<T>(string FldID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po-item-details-by-fldid/{FldID}"
            });
        }
        public async Task<T> GetPOApprovalHistoryForPohistoryPage<T>(POHistoryRequestDTO request)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po--approval-history-for-po-history-page",
                Data = request
            });
        }
        public async Task<T> GetPOApprovalHistoryForPohistoryPage2<T>(POHistoryRequestDTO request)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/PurchaseOrderAPI/get-po--approval-history-for-po-history-page2",
                Data = request
            });
        }
        #endregion
    }
}
