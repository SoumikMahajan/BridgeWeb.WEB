using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ShipmentCreateDto
    {
        public string? ShipMethod { get; set; }
        public long? CreatedBy { get; set; }
    }
}
