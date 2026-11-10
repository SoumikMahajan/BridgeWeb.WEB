namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetGroupAddDto
    {
        public long UserId { get; set; }
        public long ProjectId { get; set; }
        public bool IsDefault { get; set; }
        public string? GroupName { get; set; }
        public string? SectionIds { get; set; }
    }
}
