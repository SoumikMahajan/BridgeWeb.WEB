using System;
using System.Collections.Generic;
using System.Text;

namespace BridgeWeb.Domain.Model.Dto
{
    public class UserListTableBindDTO
    {
        public int Draw { get; set; }
        public string? Search { get; set; }
        public int Start { get; set; } = 0;
        public int Length { get; set; } = 50;
        public int? IsActive { get; set; }
        public string? SystemUserType { get; set; }
        public bool? Isbuyer { get; set; }
        public string? SortColumn { get; set; } = "FirstName";
        public string? SortDirection { get; set; } = "ASC";
        public Dictionary<string, string>? ColumnFilters { get; set; }
    }
}
