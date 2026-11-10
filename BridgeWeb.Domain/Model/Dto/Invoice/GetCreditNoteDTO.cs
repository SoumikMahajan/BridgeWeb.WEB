using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class GetCreditNoteDTO
    {
        public long? InvoiceNumber { get; set; }
        public string? InvoiceNumberVendor { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? InvoiceAmount { get; set; }
        public long? Terms { get; set; }
        public string? Memo { get; set; }
        public long? ProjectAccount { get; set; }
        public decimal? Subtotal { get; set; }
        public long? VendorId { get; set; }
        public string? POID { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? TotalInvoice { get; set; }
        public decimal? Exrate { get; set; }
        public decimal? Invoicedtotal { get; set; }
        public string? ParentVendorName { get; set; }
        public long? ParentVendor_ID { get; set; }
        public string? ProjectName { get; set; }
        public long? ProjectID { get; set; }
        public string? VendorCurr { get; set; }
        public string? ProjectCurr { get; set; }
    }
}
