namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLineItemUpdateDTO
    {
        public long POLineItemID { get; set; }
        public long? POID { get; set; }
        public decimal? Cost { get; set; }
        public decimal? Quantity { get; set; }
        public bool? Tag { get; set; }
        public string? Tagging { get; set; } = string.Empty;
        public long? UOMID { get; set; }
        public string? ItemDtldDesc { get; set; }
        public int? changed { get; set; }
        public long? UserId { get; set; }
        public int? IsShown { get; set; }
        public bool? NoState { get; set; }
        public bool? NoGSHT { get; set; }
        public bool? NoPST { get; set; }
    }
}
