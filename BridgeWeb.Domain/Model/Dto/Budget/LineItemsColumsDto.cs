using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class LineItemsColumsDto
    {
        public string? DESCRIPTION { get; set; }
        public string? SPEC { get; set; }
        public string? MODEL { get; set; }
        public string? VENDOR { get; set; }
        public string? CATEGORY { get; set; }
        public string? QUANTITY { get; set; }
        public string? UOM { get; set; }
        public string? COST { get; set; }
        public string? NOTES { get; set; }
        public string? TAXABLE { get; set; }        
    }
}
