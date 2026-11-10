using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class InvoiceItemsCreateInvoiceEntryDTO
    {
        //public long? InvoiceNumber { get; set; }
        //public long? PurchaseOrderID { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public long? POLineItemID { get; set; }
        public string? POLineItemNumber { get; set; }
        public decimal? Percent { get; set; }
        public string? Spec { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? Tax { get; set; }
        public decimal? LineItemTotal { get; set; }
        //public string? ProjectAccountID { get; set; }
        public long? ProjectAccount { get; set; }
        public long? InvoiceID { get; set; } //Important field for setting the relaion with Invoice Table
        public long UserId { get; set; }
    }
}
