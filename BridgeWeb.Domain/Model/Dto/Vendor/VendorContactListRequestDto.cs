using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorContactListRequestDto
    {        
        public int Draw { get; set; }       
        public string? Search { get; set; }       
        public int Start { get; set; } = 0;
        public int Length { get; set; } = 50;
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
        public int? IsActive { get; set; }
        public long? IsHidden { get; set; }
        public long? UserID { get; set; }
        public Dictionary<string, string>? ColumnFilters { get; set; }
    }
}
