namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompletePoDTO
    {
        public long PurchaseOrderID { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public long? ProjectID { get; set; }
        public string Items { get; set; } = string.Empty;
    }
}
