using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class SystemLevelPermission
    {
        public string? userType { get; set; }
        public List<GroupType> groupTypes { get; set; } = new ();
    }

    public class Permission
    {
        public int fldID { get; set; }
        public string? description { get; set; }
        public string? isSelected { get; set; }
    }
    public class GroupType
    {
        public string? groupType { get; set; }
        public List<Permission> permission { get; set; } = new();
    }
}
