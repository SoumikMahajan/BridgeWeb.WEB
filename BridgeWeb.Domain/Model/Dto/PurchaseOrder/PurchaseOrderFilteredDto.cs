namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class PurchaseOrderFilteredDto
    {
        public string UserId { get; set; } = "0";
        public string ProjectNumber { get; set; } = "0";
        public string ProjectSectionNumber { get; set; } = "0";
        public string OrderNumber { get; set; } = "0";
        public string Remarks { get; set; } = "0";
        public string Item_Spec { get; set; } = string.Empty;
        public string ProjectVendorNumber { get; set; } = string.Empty;

        public string Query { get; set; } = null!;
    }
}
