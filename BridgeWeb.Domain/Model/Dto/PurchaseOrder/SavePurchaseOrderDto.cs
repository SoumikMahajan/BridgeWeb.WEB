namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SavePurchaseOrderDto
    {
        public long? Project { get; set; }
        public long? Vendor { get; set; }
        public long? Buyer { get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? CnvRate { get; set; }
        public long? PaymentSchedule { get; set; }
        public long? ShipVia { get; set; }
        public string? ShipingInstruction { get; set; }
        public string? FOB { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime? CheckBackDate { get; set; }
        public string? Referance { get; set; }
        public string? ShipTo { get; set; }
        public long? VendorCO { get; set; }
        public string? InvoiceTo { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public long UserId { get; set; }
    }
}
