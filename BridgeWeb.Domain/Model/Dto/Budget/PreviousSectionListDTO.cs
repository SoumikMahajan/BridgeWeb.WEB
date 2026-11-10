using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class PreviousSectionListDTO
    {
        public long BudgetSectionID { get; set; }
        public string? Name { get; set; }
        public long? SectionOrder { get; set; }
        public string? Sectionnumber { get; set; }
    }
}
