namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetSectionEditDto
    {
        public long UserId { get; set; }
        public long BudgetId { get; set; }
        public string? SectionNumber { get; set; }
        public string? SectionName { get; set; }
        public long ProjectId { get; set; }
    }
}
