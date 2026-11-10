using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class InvoiceDetailsDto
    {
        public string? InvRef { get; set; }
        public string? FldID {  get; set; }
        public int IsSent { get; set; }
        public int IsPaid { get; set; }
        public string? FullyInvoicedDate { get; set; }
        public string? InvoiceNumberVendor { get; set; }
        public string? TotalInvoice {  get; set; }
        public string? LegalName {  get; set; }
        public string? generatedponumber { get; set; }
        public int Cansend { get; set; }
    }

    public class JsonValue<T>
    {
        public string? Status { get; set; }
        public List<T>? Response { get; set; }
    }
}
