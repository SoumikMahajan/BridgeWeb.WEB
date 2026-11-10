using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class LockUnlockLineItemDTO
    {
        public long? ProjectID { get; set; }
        public long? SectionID { get; set; }
        public long? IsBudgetLocked { get; set; }
        public string? IsNewVersion { get; set; }
        public string? BudgetVersionName { get; set; }
        public long CreatedById { get; set; }
       
    }
}
