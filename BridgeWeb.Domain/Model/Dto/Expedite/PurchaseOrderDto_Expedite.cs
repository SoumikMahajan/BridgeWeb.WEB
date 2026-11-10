namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class PurchaseOrderDto_Expedite
    {
        public long? PoNumber { get; set; }
        public string? Buyer { get; set; }
        public long? Terms { get; set; }
        public string? Currency { get; set; }
        public decimal ConversionRate { get; set; }
        public string? FOB { get; set; }
        public string? ArrivalDate { get; set; }
        public string? CheckBackDate { get; set; }
        public int? POStatus { get; set; }
        public int? NumOfUserToAprv_PO { get; set; }
        public string? ShipTo { get; set; }
        public string? ShipMethod { get; set; }
        public string? Freight { get; set; }
        public string? Remarks { get; set; }
        public string? Confirmation { get; set; }
        public string? TotalPOID { get; set; }
        public bool IsCommited { get; set; }
        public bool IsVendorSent { get; set; }
        public string? VendorCO { get; set; }
        public string? PONOTESTATUS { get; set; }

        public List<POLineItemsDto_Expedite>? PoLineItems { get; set; } = new List<POLineItemsDto_Expedite>();
    }
}