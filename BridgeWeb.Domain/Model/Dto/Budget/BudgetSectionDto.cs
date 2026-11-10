namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetSectionDto
    {
        public long? BudgetSectionID { get; set; }
        public string? Name { get; set; }
        public string? Sectionnumber { get; set; }
        public decimal? LineItemCount { get; set; }
        public double? Cost { get; set; }
        public long? SectionOrder { get; set; }
    }
}
