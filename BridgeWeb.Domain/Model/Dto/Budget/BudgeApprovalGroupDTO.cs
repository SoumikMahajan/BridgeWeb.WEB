using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgeApprovalGroupDTO
    {
        public string? Groupname { get; set; }
        public string? Sectionnumber { get; set; }
        public string? Name { get; set; }
        public long? FldID { get; set; }
        public int? Issentforapproval { get; set; }
    }
}
