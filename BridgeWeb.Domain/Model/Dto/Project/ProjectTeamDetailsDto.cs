using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectTeamDetailsDto
    {
        public string? Username { get; set; }
        public long? TeammemberID { get; set; }
        public long? SystemUserID { get; set; }
        public string? Email { get; set; }
        public long? ProjectusertypeID { get; set; }
        public string? UsertypeName { get; set; }
        public long? POItemApprover { get; set; }
        public long? POApprover { get; set; }
        public long? BudgetApprover { get; set; }
    }
}
