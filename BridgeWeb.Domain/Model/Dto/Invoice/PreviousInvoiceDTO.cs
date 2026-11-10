using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PreviousInvoiceDTO
    {
        public string? InvoiceDate { get; set; }
        public decimal? InvoiceAmount { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Percent { get; set; }
        public decimal? LineItemTotal { get; set; }

    }
}
