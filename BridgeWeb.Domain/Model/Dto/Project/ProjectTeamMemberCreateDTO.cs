using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectTeamMemberCreateDTO
    { public long? SystemUserType { get; set; }
        public long ProjectId { get; set; }

        public long UserId { get; set; }
        public long? ProjectUsertype { get; set; }

        public string? priorities_on_list { set; get; }
        public long? CreatedBy { get; set; }
    }
}
