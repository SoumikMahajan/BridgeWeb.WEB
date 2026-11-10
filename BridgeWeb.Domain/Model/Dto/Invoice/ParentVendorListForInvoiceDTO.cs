using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class ParentVendorListForInvoiceDTO
    {
        public long? Vendor_ID { get; set; }
        public string? NAME { get; set; }
        public string? Currency { get; set; }
        public string? POCount { get; set; }

    }
}
