using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class InvoiceListDTO
    {
        [Key]
        public long InvoiceNumber { get; set; }
        public string? InvoiceDate { get; set; }
        public string? InvoiceNumberVendor {  get; set; }
        public string? LegalName { get; set; }
        public decimal? Subtotal { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? TotalInvoice { get; set; }
        public long? ProjectNumber { get; set; }
        public string? ProjectName {  get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? Exrate {  get; set; }
        public double? Paymenttotal { get; set; }

    }
}
