using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentUpdateDetailsDTO
    {
        public DateTime? PaymentDate { get; set; }
        public string? PaymentTypename { get; set; }
        public string? PaymentNumber { get; set; }
        public decimal? TotalPayment { get; set; }
        public string? Memo { get; set; }
        public string? BankAccount { get; set; }
        public decimal? ConversionRate { get; set; }
    }
}
