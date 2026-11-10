using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class GetAllInvListByVendor2DTO
    {
        public string? Currency { get; set; }
        public string? ParentVendorName { get; set; } //Legal name
        public long? InvoiceNumber { get; set; }
        public string? InvoiceNumberVendor { get; set; }
        public string? InvoiceDate { get; set; }
        public string? Terms { get; set; }
        public decimal? TotalInvoice { get; set; }
        public decimal? Paid { get; set; }
        public decimal? Exrate { get; set; }
        public long? ParentVendor_ID { get; set; }


    }
}
