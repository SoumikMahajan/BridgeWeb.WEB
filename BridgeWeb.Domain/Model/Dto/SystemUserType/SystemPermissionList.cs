using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemUserType
{
    public class SystemPermissionList
    {
        public string SystemPermission { get; set; } = string.Empty;
        public List<SystemPermissionOption> SystemPermissionOption { get; set; } = new();
    }
}
