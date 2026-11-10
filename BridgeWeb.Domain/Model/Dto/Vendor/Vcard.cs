using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class Vcard
    {
        public string? FN { get; set; }
        public string? LN { get; set; }
        public string? TITLE { get; set; }
        public string? ORG { get; set; }
        public string? EMAIL { get; set; }
        public string? COUNTRY { get; set; }

        public string? ADR { get; set; }
        public string? STATE { get; set; }
        public string? CITY { get; set; }
        public string? POSTALCODE { get; set; }

        public string? PHONE { get; set; }
        public string? EXT { get; set; }
        public string? Cell { get; set; }
        public string? FAX { get; set; }
    }
}
