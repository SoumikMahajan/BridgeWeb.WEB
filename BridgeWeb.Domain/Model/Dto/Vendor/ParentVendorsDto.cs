using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class ParentVendorsDto
    {
        public long ParentVendor_ID { get; set; }
        public string ParentVendorName { get; set; } = string.Empty;
        public string LegalName { get; set; } = string.Empty;
        public string ShortName { get; set; } = string.Empty;
        public long? CurrCode { get; set; }
        public string Address1 { get; set; } = string.Empty;
        public string Address2 { get; set; } = string.Empty;
        public bool? IsActive { get; set; } = true;
        public long? Country { get; set; }
        public long? State { get; set; }
        public string City { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Fax { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Phone2 { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public bool? BridgeSupporter { get; set; } = false;
        public long? CreatedBy { get; set; }
        public long? Terms_ID { get; set; }
        public string R_Country { get; set; } = string.Empty;
        public string R_State { get; set; } = string.Empty;
        public string R_City { get; set; } = string.Empty;
        public string R_ZipCode { get; set; } = string.Empty;
        public bool R_Flag { get; set; } = new();
        public string R_Address { get; set; } = string.Empty;
        public string Minority_own_business { get; set; } = string.Empty;
        public string Woman_own_business { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsDelete { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
        public string CreatedByName { get; set; } = string.Empty;

    }
}
