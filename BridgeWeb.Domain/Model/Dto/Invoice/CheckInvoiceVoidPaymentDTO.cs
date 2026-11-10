using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class CheckInvoiceVoidPaymentDTO
    {
        public decimal? Subtotal { get; set; }
        public int? Count { get; set; }
    }
}
