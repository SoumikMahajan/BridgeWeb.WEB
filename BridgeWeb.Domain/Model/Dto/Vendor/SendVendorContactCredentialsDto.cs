using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public  class SendVendorContactCredentialsDto
    {
        public string? Email { get; set; }
        public string? Subject { get; set; }
        public string? CurrUrl { get; set; }
        public string? mailBody { get; set; }
    }
}
