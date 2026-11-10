namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class POLineItemsDto_Expedite
    {
        public string? POLineItemID { get; set; }
        public string? SpecNum { get; set; }
        public string? ItemDescription { get; set; }
        public int? ItemApprovals { get; set; }
        public int? NumOfUserToAprv_PO { get; set; }
        public string? ItemStatus { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public string? Arrivedon { get; set; }
        public string? Invoice { get; set; }
        public decimal? Quantity { get; set; }
        public long? POID { get; set; }
        public string? ActionType { get; set; } // Febrication
        public int? cnt { get; set; }
        public long? RequiredApproved { get; set; }
        public List<FebricationType> FebricationTypes { get; set; } = new();
    }
}
