namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class DeletedPoFilterDto
    {
        public string ProjectNumber { get; set; } = string.Empty;
        public string VendorNumber { get; set; } = string.Empty;
        public string Item_Spec { get; set; } = string.Empty;
    }
}
