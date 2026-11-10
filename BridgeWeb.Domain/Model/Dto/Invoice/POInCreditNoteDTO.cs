using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
   public class POInCreditNoteDTO
    {
        public long? PurchaseOrderID { get; set; }
        public string? PONUMBER { get; set; }
        public decimal? InvoiceCost { get; set; }
        public decimal? TotalPOCOST { get; set; }
        public string? CurrencyCode { get; set; }

    }
}
