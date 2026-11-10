using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorDto
    {
        public long Vendor_ID { get; set; }
        public string? ContactFirstname { get; set; }
        public string? ContactLastname { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public long? ParentVendor_ID { get; set; }
        public bool? IsActive { get; set; }
        public long? Country { get; set; }
        public long? State { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Extension { get; set; }
        public string? ZipCode { get; set; }
        public string? Fax { get; set; }
        public string? ContactTitle { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public long? IsHidden { get; set; }
        public long? User_ID { get; set; }
        public long? IsVendorLoginSent { get; set; }
        public long? IsSystemUser { get; set; }
        public string? Mobile { get; set; }
        public long? BridgeSupporter { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
