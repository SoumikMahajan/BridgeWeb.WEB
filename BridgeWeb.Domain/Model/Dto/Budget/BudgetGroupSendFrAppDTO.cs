using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetGroupSendFrAppDTO
    {
        public long? ProjectID { get; set; }
        public string? SectionID { get; set; }
        public string? IsNewVersion { get; set; }
        public bool? Sendmail { get; set; }
        public string? CurrentUrl { get; set; }
        public long userId { get; set; }
    }
}
