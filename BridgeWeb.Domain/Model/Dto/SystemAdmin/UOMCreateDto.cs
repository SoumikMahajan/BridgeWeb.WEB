using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class UOMCreateDto
    {
        public string? UOM { get; set; }
        public long? CreatedBy_ID { get; set; }
    }
}
