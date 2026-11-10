using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class StateUpdateDto
    {
        public long StateID { get; set; }
        public string? State { get; set; }
        public string? StateCode { get; set; }
        public long CountryCode { get; set; }
        public bool Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
