using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class VendorTermsCreateDto
    {
        public string? Terms { get; set; }
        public string? Status { get; set; }
        public long? CreatedBy { get; set; }
    }
}
