using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class FabGroupOnPathDto
    {
        public long FLID { get; set; }
        public long LevelID { get; set; }
        public string? GroupName { get; set; }
    }
}
