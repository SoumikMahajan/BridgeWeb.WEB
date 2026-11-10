namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class PoItems_Expedite
    {
        public long POLineItemID { get; set; }
        public string? POID { get; set; }
        public long? VendorID { get; set; }
        public string? VendorName { get; set; }
        public string? VendorCO { get; set; }
        public string? SpecNum { get; set; }
        public long? Buyer_ID { get; set; }
        public string? BuyerName { get; set; }
        public string? Terms { get; set; }
        public long? CurrCode { get; set; }
        public string? Currency { get; set; }
        public string? Conv { get; set; }
        public string? FOB { get; set; }
        public string? ArrivalDate { get; set; }
        public string? CheckBackDate { get; set; }
        public string? ItemStatus { get; set; }
        public string? Inv { get; set; }
        public string? ShipMethod { get; set; }
        public decimal? Qty { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public string? ShipTo { get; set; }
        public string? Remarks { get; set; }
        public int? Approved { get; set; }
        public int? NumOfUserToAprv_PO { get; set; }
        public string? Freight { get; set; }
        public string? STATUS { get; set; }
        public string? Statusdate { get; set; }
        public string? Statustype { get; set; }
        public string? ActionType { get; set; }
        public string? IsCommitted { get; set; }
        public int? cnt { get; set; }
    }
}
