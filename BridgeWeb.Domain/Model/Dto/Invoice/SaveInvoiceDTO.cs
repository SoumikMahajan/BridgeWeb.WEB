using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class SaveInvoiceDTO
    {
        public string? InvoiceNumberVendor { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? InvoiceAmount { get; set; }
        public long? Terms { get; set; }
        public string? Memo { get; set; }
        public long? ProjectAccount { get; set; }
        public decimal? Subtotal { get; set; }
        public long? VendorId { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? TotalInvoice { get; set; }
        public decimal? Exrate { get; set; }
        public string? POID { get; set; }
        public string? ProjectId { get; set; }
        public long? UserId { get; set; }
        public bool? IsCCRefund { get; set; }

    }
}
