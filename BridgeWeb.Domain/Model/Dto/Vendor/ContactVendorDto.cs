using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class ContactVendorDto
    {
        public long VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? ParentVendorName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address1 { get; set; }
        public bool? IsActive { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? PostalCode { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? IsHidden { get; set; }
        public long? UserId { get; set; }
        public string? IsSystemUser { get; set; }
        public string? IsVendorLoginSent { get; set; }
        public string? Username { get; set; }
        public string? Mobile { get; set; }
        public string? Extension { get; set; }
    }
}
