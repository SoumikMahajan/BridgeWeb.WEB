using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class LockUnlockBudgetDTO
    {
         public long ProjectId {  get; set; }
         public long SectionId { get; set; }

        public long UserId { get; set; }
        public long? IsBudgetLocked { get; set; }
        public string? IsNewVersion { get; set; }
        public string? VersionName { get; set; }



    }
}
