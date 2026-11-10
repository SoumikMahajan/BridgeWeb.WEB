using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorContactDto
    {
        public long Vendor_ID { get; set; }
        public long? ParentVendor_ID { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string? Address1 { get; set; }
        public string? ParentVendorName { get; set; }
        public int IsActive { get; set; }

        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }

        public string? Phone { get; set; }

        public string? ZipCode { get; set; }
        public string? Fax { get; set; }
        public string? ContactTitle { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public long? IsHidden { get; set; }
        public long? UserId { get; set; }
        public long? IsSystemUser { get; set; }
        public long? Contact_ID { get; set; }
        public string? Classifications { get; set; }
    }
}
