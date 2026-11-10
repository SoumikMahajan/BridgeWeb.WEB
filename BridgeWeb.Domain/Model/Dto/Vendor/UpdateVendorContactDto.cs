using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class UpdateVendorContactDto
    {
        public long VendorId { get; set; }
        public string? ContactFirstname { get; set; }
        public string? ContactLastname { get; set; }
        public string? Address1 { get; set; }
        public long? Country { get; set; }
        public long? State { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Extension { get; set; }
        public string? Mobile { get; set; }
        public string? ZipCode { get; set; }
        public string? Fax { get; set; }
        public string? ContactTitle { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public long? IsHidden { get; set; }       
        public long? IsSystemUser { get; set; }
        public long? UpdatedBy { get; set; }
        public string? priorities_on_list { set; get; }
        public string? CurrentUrl { get; set; }
    }
}
