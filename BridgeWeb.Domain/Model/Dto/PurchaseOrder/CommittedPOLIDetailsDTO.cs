namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class CommittedPOLIDetailsDTO
    {
        public string PurchaseOrderID { get; set; } = string.Empty;
        public long? Project_ID { get; set; }
        public string Currency { get; set; } = string.Empty;
        public double? POCost { get; set; }
    }
}
