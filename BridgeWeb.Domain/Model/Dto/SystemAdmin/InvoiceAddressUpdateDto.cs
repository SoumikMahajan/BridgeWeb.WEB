using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class InvoiceAddressUpdateDto
    {
        public long FldID { get; set; }
        public string? InvoiceAddress { get; set; }
        public long? StateID { get; set; }
        public long? CountryID { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
