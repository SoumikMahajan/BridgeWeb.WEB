using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class SectionListDTO
    {
        public long BudgetSectionID { get; set; }
        public string? Name { get; set; }
        public long LineItemID { get; set; }
        public long LineItemCount { get; set; }
        public long? SectionOrder { get; set; }
        public double? Cost { get; set; }
        public string? Sectionnumber { get; set; }
    }
}
