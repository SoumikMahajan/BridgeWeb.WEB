using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ShipmentUpdateDto
    {
        public long ShipID { get; set; }
        public string? ShipMethod { get; set; }
        public bool? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
