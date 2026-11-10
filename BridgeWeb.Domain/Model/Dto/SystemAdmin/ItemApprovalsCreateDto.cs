using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ItemApprovalsCreateDto
    {
        public string? ItemName { get; set; }
        public string? ItemShortName { get; set; }
        public long? CreatedBy { get; set; }
    }
}
