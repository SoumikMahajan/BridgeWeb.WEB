using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class MergeVendorContactDto
    {
        public long ParentVendor_ID { get; set; }
        public string? ParentVendorName { get; set; }
        public string? LegalName { get; set; }
        public string? Currency { get; set; }
        public long? CurrCode { get; set; }

        public string? contacts { get; set; }
       
    }
}
