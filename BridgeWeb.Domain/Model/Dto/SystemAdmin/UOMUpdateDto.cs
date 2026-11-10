using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class UOMUpdateDto
    {
        public long UOM_ID { get; set; }
        public string? UOM { get; set; }
        public long? Status { get; set; }
        public long? IsDefault { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
