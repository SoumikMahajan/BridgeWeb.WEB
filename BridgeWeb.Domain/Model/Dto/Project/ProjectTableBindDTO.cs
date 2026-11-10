using System;
using System.Collections.Generic;
using System.Text;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectTableBindDTO
    {
        public int Draw { get; set; }
        public string? Search { get; set; }
        public int Start { get; set; } = 0;
        public int Length { get; set; } = 50;
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
        //public int? IsActive { get; set; }
        public long? IsClosed { get; set; }
        public long? UserID { get; set; }
        public Dictionary<string, string>? ColumnFilters { get; set; }
    }
}
