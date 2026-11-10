using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectUserApprovalDto
    {
        //public int? NumOfUserToAprv_PO { get; set; }
        public int? NumOfUserToAprv_Budget { get; set; }
        //public int? NumOfAssignedUserToAprv_Budget { get; set; }
        //public int? NumOfAssignedUserToAprv_PO { get; set; }
        //public long? NumOfReqFabrication_PO { get; set; }
        public long? ProjectId { get; set; }
        public string? ProjectName { get; set; }
    }
}
