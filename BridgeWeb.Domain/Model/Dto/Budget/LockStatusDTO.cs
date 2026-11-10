using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class LockStatusDTO
    {
        public long isBudgetLocked { get; set; }
        public long isBudgetApproved { get; set; }
        public long isSentForApproval { get; set; }
        public string? currentVersion { get; set; }
        public long versionNumber { get; set; }
        public long budgetChanged { get; set; }
    }
}
