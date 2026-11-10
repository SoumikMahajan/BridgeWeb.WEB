namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class AllPoHistoryDetails
    {
        public long? PurchaseOrderID { get; set; }
        public long? FldID { get; set; }
        public DateTime? OperationON { get; set; }
        public DateTime? OperationONShow { get; set; }
        public long? OperationBY { get; set; }
        public string? version { get; set; }
        public string? Mode { get; set; }
        public string? User { get; set; }
    }
}
