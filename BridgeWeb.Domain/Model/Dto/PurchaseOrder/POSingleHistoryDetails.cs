namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POSingleHistoryDetails
    {
        public string? ItemDescription { get; set; }
        public string? SpecNum { get; set; }
        public string? Vendor { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public string? Note { get; set; }
        public string? Tagging { get; set; }
        public string? ItemDtldDesc { get; set; }
        public string? UOM { get; set; }
        public string? TotalID { get; set; }
    }
}
