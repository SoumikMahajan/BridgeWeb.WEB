namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorListRequestDto
    {
        public int Draw { get; set; }
        public string? Search { get; set; }
        public int Start { get; set; } = 0;
        public int Length { get; set; } = 50;
        public string? SortColumn { get; set; } = "ParentVendorName";
        public string? SortDirection { get; set; } = "ASC";
        public Dictionary<string, string>? ColumnFilters { get; set; }
    }
}
