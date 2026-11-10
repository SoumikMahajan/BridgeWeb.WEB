using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VenndorSystemPermissionDto
    {
        public long? security_id { get; set; }
        public string? priority_name { get; set; }
        public long? is_selected { get; set; }
        public string GroupType { get; set; } = string.Empty;
    }
}
