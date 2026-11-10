using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class UpdateVendorContactAddress
    {
        public long FldID { get; set; }
        public string? Tabheader { get; set; }
        public string? Address { get; set; }
        public long? VendorID { get; set; }
        public long? CountryID { get; set; }
        public long? StateID { get; set; }
        public string? PinCode { get; set; }
        public string? City { get; set; }
        public bool? IsDefault { get; set; }

        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public string? Flag {  get; set; }
    }
}
