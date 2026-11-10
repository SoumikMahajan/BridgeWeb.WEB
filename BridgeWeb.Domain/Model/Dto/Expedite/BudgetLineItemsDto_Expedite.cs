namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class BudgetLineItemsDto_Expedite
    {
        public string ItemNumber { get; set; } = string.Empty;
        public string? SpecNum { get; set; }
        public string? ItemDescription { get; set; }
        public long? LineItemID { get; set; }
        public List<PoItems_Expedite>? Description { get; set; }
    }
}
