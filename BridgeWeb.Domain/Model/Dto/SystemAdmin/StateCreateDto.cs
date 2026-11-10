using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class StateCreateDto
    {
        public string? State { get; set; }
        public string? StateCode { get; set; }
        public long CountryCode { get; set; }
        public long? CreatedBy { get; set; }
    }
}
