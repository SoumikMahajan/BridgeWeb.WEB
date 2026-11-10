using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using Microsoft.AspNetCore.Mvc;

namespace BridgeWeb.Application.Common.Interfaces.PurchasedOrder
{
    public interface IPurchaseOrderService
    {
        Task<T> GetAllProjectOnPoList<T>(long UserId);
        Task<T> GetAllActiveTerms<T>();
        Task<T> GetAllAddressListWithDetails<T>(long ProjectId, long VendorId);
        Task<T> GetAllBuyerWithDefault<T>(long VendorId);
        Task<T> GetAllSectionListByProjectIds<T>(string ProjectIds);
        Task<T> GetAllShipment<T>();
        Task<T> GetAllVendor<T>();
        Task<T> GetAllVendorForPurchaseOrderByProjectId<T>(long ProjectId);
        Task<T> GetAllVendorListByProjectIds<T>(long UserId, string ProjectIds);
        Task<T> GetFilteredPurchaseOrders<T>(PurchaseOrderFilteredDto filteredDto);
        Task<T> GetPoDetailsForApproval<T>(string PoIds);
        Task<T> GetPriority<T>(long UserId);
        Task<T> GetShipToAndInvoiceTo<T>(long projectId);
        Task<T> SavePurchaseOrder<T>(SavePurchaseOrderDto orderDto);
        Task<T> GetPoDetailsForDownload<T>(string PoIds);
        Task<T> GetPoFilesToDownload<T>(string PoIds);
        Task<T> GetPOMailTemplate<T>();
        Task<T> GetPoTermsFiles<T>(string PoIds);

        Task<T> GetVendorIdFromMailPOIds<T>(string PoIds);
        Task<T> GetUserTypeByUserId<T>(long UserId);
        Task<T> GetPoEditPermissionByUserId<T>(long UserId);
        Task<T> SendVendorMail<T>(VendorEmailDetailsDto detailsDto);
        Task<T> DeletePO<T>(long PoId);
        Task<T> GetFormattedTermFiles<T>(string PoIds);
        Task<T> SendForBatchApproval<T>(BatchApprovalDto approvalDto);
        Task<T> GetDeletedPoList<T>(DeletedPoFilterDto approvalDto);
        Task<T> RecyclePO<T>(long PoId);
        Task<T> FabApprovalItemValidationAsync<T>(FabApprovalItemValidationDTO model);
        Task<T> FabApprovalItemValidationOnAddPoLineItemAsync<T>(long ProjectID);
        Task<T> IsManagerAsync<T>(string PurchaseOrderID, long UserId);
        Task<T> NewFabricationCreateAsync<T>(List<CreateFabricationDTO> CreateModelList);
        Task<T> GetFabItemAsync<T>(string POLineitemID, string UserId, string PurchaseOrderID, string ProjectID);

        #region ::PO Edit
        Task<T> PurchaseOrderRequiredDetails<T>(long POId, long UserId);
        Task<T> CheckAuthorityForPOEdit<T>(long UserId);
        Task<T> GetPOById<T>(long UserId, long POID);
        Task<T> GetCalculatedTax<T>(string POID);
        Task<T> GetVendorListNew<T>();
        Task<T> GetBuyerDetails<T>();
        Task<T> GetShipmentVendorCo<T>(string POID);
        Task<T> GetTaxByPOID<T>(string POID);
        Task<T> GetPOFileToShow<T>(string POID);
        Task<T> GetPOComments<T>(string POID);
        Task<T> GetInvoiceDatainPOEdit<T>(long UserId, long POID);
        Task<T> GetVendorAddress<T>(string VendorCoId);
        Task<T> GetAddressListVendorCo<T>(long VendorID, long ProjectId);
        Task<T> POTaxUpdate<T>(POTaxUpdateDTO pOTaxUpdateDTO);
        Task<T> POFileToExposeUpdate<T>(string File);
        Task<T> UpdatePOComment<T>(CommentUpdateDTO commentUpdateDTO);
        Task<T>GetPOLevelFileList<T>(string POID);
        Task<T> GetPOExpediteNote<T>(string POLineItemID);
        Task<T> GetPOExpediteNoteByPoid<T>(long POID);
        Task<T> UpdatePOCommentsAndAttachments<T>(POCommentsAttachmentsSaveDTO pOCommentsAttachmentsSaveDTO);
        Task<T> SavePOExpediteNotes<T>(POExpediteNoteCreateDTO pOExpediteNoteCreateDTO);
        Task<T> SaveUpdatedPOExpediteNotes<T>(POExpediteNoteUpdateDTO pOExpediteNoteUpdateDTO);
        Task<T> DeletePOExpediteNote<T>(string Fldid, long UserId);
        Task<T> DeletePOLevelFileList<T>(string FldId);
        Task<T> SetExposedPOLevelFileList<T>(string FldId);
        Task<T> GetAllPOLineItems<T>(string POID);
        Task<T> GetProjectConversionRate<T>(string ProjectId);
        Task<T> GetPOCalculatedTax<T>(string POID);
        Task<T>GetPOCalcualtedInvoiceTax<T>(string POID);
        Task<T>GetPOLineItemsByPoLineItemId<T>(string POLineItemId, string POID);
        Task<T>GetAllPOLineItemsonExpand<T>(string LineItemId,string POID);
        Task<T> CheckPOITEMTOTALLValue<T>(string POLineItemId);
        Task<T> UpdatePOLineItemsOnExpand<T>(POLineItemUpdateDTO pOLineItemUpdateDTO);
        Task<T> UpdatePOLineItemCostAndQuantity<T>(POLineItemUpdateCostandQuantityDTO pOLineItemUpdateCostandQuantityDTO);
        Task<T> SaveAllPOLineItems<T>(List<POLineItemUpdateDTO> pOLineItemUpdateDTOs);
        Task<T>SaveSendForApproval<T>(SendForApprovalUpdateDTO sendForApprovalUpdateDTO);
        Task<T> CancelSendApproval<T>(string POID, long UserID);
        Task<T> MoveNextOrPrevious<T>(MoveNextOrPrevDTO moveNextOrPrevDTO);
        Task<T> POCopy<T>(string POID);
        Task<T> GetVendorDetailsinCreditNote<T>(string POID);
        Task<T> GetProjectAccountName<T>(long ProjectId);
        Task<T> GetLIinCN<T>(POLIInCreditNoteGetDTO pOLIInCreditNoteGetDTO);
        Task<T> CommitPO<T>(CommitPODTO commitPODTO);
        Task<T> CreateInvoice<T>(InvoiceCreateDTO invoiceCreateDTO);
        Task<T>AddLIToInvoice<T>(List<InvoiceItemsCreateDTO> invoiceItemsCreateDTOs);
        Task<T> CheckRevisePO<T>(string POID);
        Task<T> RevisePO<T>(POReviseDTO pOReviseDTO);
        Task<T> SavePOUpdatecheckbackdateandNote<T>(CheckBackDateandNoteUpdateDTO checkBackDateandNoteUpdateDTO);
        Task<T> UpdatePODetailsNew<T>(SavePODTO savePODTO);
        Task<T> GetPORequiredDate<T>(long POLineItemID, long POID);
        Task<T> GetPOLIStatus<T>(long POLIID);
        Task<T> GetPOLIExpediteHistory<T>(long POLIID);
        Task<T> SavePOLIExpNoteinExpModal<T>(SaveLINoteDetailsDTO saveLINoteDetailsDTO);
        Task<T> SavePOExpediteNote<T>(SavePOExpediteNoteCreateDTO savePOExpediteNoteCreateDTO);
        Task<T> SavePOExpediteNoteAllFull<T>(SaveExpediteNoteFullDTO saveExpediteNoteFullDTO);
        Task<T> GetCommitedPOLIDetails<T>(long POLineItemID);
        Task<T> HidePOFromVendor<T>(long POID,bool status);
        Task<T> SortPOLineItemOrder<T>(SortPOLineItemDTO sortPOLineItemDTO);
        Task<T> GetFabIndvHistoryAsync<T>(string PoLineItemApprovalID,string UserId);
        Task<T> GetFabApprovalUsers<T>(string Mode, string ApprovalID, string ProjectId, string UserId);
        Task<T> UpdateFabricationDesAsync<T>(long ApprovalID, string desc);
        Task<T> CheckCurrPathIdAndStatusAsync<T>(string POLineItemApprovalID);
        Task<T> AddPOApprovalItemAsync<T>(AddFabItemDataDTO model);
        Task<T> CheckInvoiceTotal<T>(long POLineItemID);
        Task<T> MakeItemZero<T>(string mode, string POLineItemId);
        Task<T> DeleteLineItemSingle<T>(string POLineItemID, long UserID);
        Task<T> CheckItemInvoiceMultiple<T>(string POLineItemID);
        Task<T> DeletePOLineItemMultiple<T>(DeleteMultiplePOLineItemDTO deleteMultiplePOLineItemDTO);
        Task<T> DeleteFabricationHistoryAsync<T>(string HistoryId, string POLineItemID);
        Task<T> GetAllLIDetails<T>(string LineItemId);
        Task<T> GetPO_GetRequiredAndAssignedApprovers<T>(string POID);
        Task<T> CheckVendorConfirmation<T>(string POID, string UserID);
        Task<T> ConfirmPOForVendor<T>(ConfirmPOForVendorParams confirmPOForVendorParams);
        Task<T> UpdatePOLIExpediteNote<T>(POLineItemExpediteNoteUpdateDTO pOLineItemExpediteNoteUpdateDTO);
        Task<T> EditPOExpediteNote<T>(POExpNoteUpdateDTO pOExpediteNoteUpdateDTO);
        Task<T> DeletePOLIExpNote<T>(string FldId);
        Task<T> DeletePOExpNote<T>(string FldId);
        #endregion

        #region :: PO Add LI
        Task<T> SectionListinAddPOLI<T>(string POID, string UserID);
        Task<T> GetLineItemListInPOLI<T>(string POID,string SectionId);
        Task<T> GetSelectedLineItemDetails<T>(string LineItemId);
        Task<T> LoadAutoTagData<T>(string LineItemId);
        Task<T> GetTaxFromPO<T>(string POID);
        Task<T> GetAprrovalType<T>();
        Task<T> AddnewPOLineItems<T>(POLineItemCreateDTO pOLineItemCreateDTO);
        Task<T> GetPODataForCountZero<T>(string POID);
        Task<T>checkItemForCommit<T>(string POID);
        Task<T> AddPOLIMulti<T>(List<AddNewPOLIParamsDTO> addNewPOLIParamsDTOs, string UserId);
        #endregion

        #region :: PO History

        Task<T> GetPOHistoryDetails<T>(string POID);
        Task<T> GetPoHistoryLineItems<T>(string PoId, string Flid);
        Task<T> GetAllHistory<T>(string POID, string? Version = null);
        Task<T> HistoryDetailsByFldID<T>(string FldID);
        Task<T> POItemHistoryDetailsBYFldid<T>(string FldID);
        Task<T> GetProjectApproversById<T>(long ProjectId);
        Task<T> CheckInvoiceExist<T>(long PoId);
        Task<T> GetPOApprovalHistoryForPohistoryPage<T>(POHistoryRequestDTO request);
        Task<T> GetPOApprovalHistoryForPohistoryPage2<T>(POHistoryRequestDTO request);

        #endregion
    }
}
