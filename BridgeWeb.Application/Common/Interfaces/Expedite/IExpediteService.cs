using BridgeWeb.Domain.Model.Dto.Expedite;

namespace BridgeWeb.Application.Common.Interfaces.Expedite
{
    public interface IExpediteService
    {
        Task<T> GetAllBudgetItemsByBudgetSectionId<T>(long BudgetSectionId);
        Task<T> GetAllPoItemStatus<T>();
        Task<T> GetHiddenField<T>(long UserId);
        Task<T> LoadBudgetSectionPart<T>(string ProjectId);
        Task<T> LoadVendorPart<T>(long UserId, string ProjectId);
        Task<T> LoadVendorPartWithQuery<T>(long UserId, string ProjectId, string Query, string Flag);
        Task<T> MakeDropdown<T>(long UserId, string Mode, long PID);
        Task<T> PurchaseOrderByContactId<T>(long UserId, string VendorId, string ProjectId, string Query);
        Task<T> PurchaseOrderLineItemsByPurchaseOrderId<T>(string PurchaseOrderId, string Query);
        Task<T> CheckFrieght<T>(string POLIID);
        Task<T> GetUserEditPermission<T>(string UserId);
        Task<T> AddOnlyPOExpediteNote<T>(SavePOExpediteNoteExpPageDTO savePOExpediteNoteExpPageDTO);
        Task<T> GetPoLineitemStatusModified<T>(string PolineItemId);
        Task<T> GetAllProjectListForExepediteAsync<T>(long UserId);
        Task<T> GetTotalAndReceivedQtyOfExpediteNoteByLineItemIdAsync<T>(long LineItemId);
    }
}
