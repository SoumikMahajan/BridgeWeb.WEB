namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetGroupsEditDto
    {
        public long ProjectId { get; set; }
        public long GroupId { get; set; }
        public string? GroupName { get; set; }
        public string? SectionIds { get; set; }
    }
}
