using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ManagerListDto
    {
        public long? UserId { get; set; }
        public string? UserName { get; set; }
        public int? IsManager { get; set; }
    }
}
