using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class CountryCreateDto
    {
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public long? CreatedBy { get; set; }
    }
}
