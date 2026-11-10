using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class CountryUpdateDto
    {
        public long CountryID { get; set; }
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public string? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
