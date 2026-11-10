using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class InvoiceEditDetailsDTO
    {
        public long? VendorId { get; set; }
        public string? Name { get; set; }
        public string? Currency { get; set; }
        public string? POCount { get; set; }
        public long? ProjectID { get; set; }
        public string? ProjectName { get; set; }
        public decimal? Subtotal { get; set; }
        public int? Cnt { get; set; }
        public long? Terms { get; set; }
        public string? POID { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? InvoiceAmount { get; set; }
        public string? Memo { get; set; }
        public decimal? Exrate { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? TotalInvoice { get; set; }
        public decimal? InvoiceSubTotal { get; set; }
        public string? InvoiceNumberVendor { get; set; }
        public string? Taxn1 { get; set; }
        public string? Taxn2 { get; set; }
        public string? Taxn3 { get; set; }
        public string? InvoiceNumber { get; set; }
        public long? InvoiceTerms { get; set; }
    }
}
