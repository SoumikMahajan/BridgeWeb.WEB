using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLIInCreditNoteDTO
    {
        public string? POLineItemID { get; set; }
        public long POID { get; set; }
        public long ProjectId { get; set; }

        public List<TotalInvoiceAmountDTO>? InvoiceAmountData { get; set; }
    }
}
