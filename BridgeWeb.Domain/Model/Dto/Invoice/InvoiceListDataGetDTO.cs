using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class InvoiceListDataGetDTO
    {
        public string? VendorID { get; set; }
        public string? InvoiceNumber { get; set; }  
        public string? ProjectID { get; set; }
        public string? Fromdate { get; set; }
        public string? Todate { get; set; }
        public string? Mode { get; set; }
        public string? POID { get; set; }

    }
}
