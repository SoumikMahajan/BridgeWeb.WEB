using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class InvoiceItemsCreateDTO
    {
        public string? PurchaseOrderNumber { get; set; }
        public long? POLineItemID { get; set; }
        public string? POLineItemNumber { get; set; }
        public string? Description { get; set; }
        public decimal? LineItemTotal { get; set; }
        public long? InvoiceID { get; set; }
    }
}
