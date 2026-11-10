using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class VendorListinProjectDto
    {
        public long VendorId { get; set; }

        public string? ContactFirstname { get; set; }
        public string? ContactLastname { get; set; }
        public string? ParentVendorName { get; set; }
        public string? City { get; set; }
        public long? StateId { get; set; }
        public string? CurrencyCode { get; set; }
        public string? State { get; set; }
        public long ParentVendor_ID { get; set; }
        public string? Currency { get; set; }

        public string? Classification { get; set; }
    }
}
