using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class ManualPaymentUpdateDTO
    {
        public long? ManualPaymentID { get; set; }
        public DateTime? PaymentDate { get; set; }
        public long? PaymentType { get; set; }
        public long? BankAccountID { get; set; }
        public string? PaymentNumber { get; set; }
        public decimal? TotalPayment { get; set; }
        public string? Memo { get; set; }
        public decimal? ConvRate { get; set; }
        public decimal? ConvRate2 { get; set; }
        public long? UserId { get; set; }
    }
}
