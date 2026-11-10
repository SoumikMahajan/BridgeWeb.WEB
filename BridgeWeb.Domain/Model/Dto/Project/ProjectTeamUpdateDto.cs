using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectTeamUpdateDto
    {
        public long Fldid { get; set; }
        public long UsertypeID { get; set; }
        public long UpdatedBy { get; set; }

        public string? priorities_on_list { set; get; }
    }
}
