using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorListDto
    {
        public long VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? ParentVendorName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address1 { get; set; }
        public bool? IsActive { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public long? Country { get; set; }
        public long? State { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Extension { get; set; }
        public string? ZipCode { get; set; }
        public string? Fax { get; set; }
        public long? IsHidden { get; set; }
        public long? User_ID { get; set; }
        public long? IsVendorLoginSent { get; set; }
        public long? IsSystemUser { get; set; }
        public string? Username { get; set; }
        public string? Mobile { get; set; }
    }
}
