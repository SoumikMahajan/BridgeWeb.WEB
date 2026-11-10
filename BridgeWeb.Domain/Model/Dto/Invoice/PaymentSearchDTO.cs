using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentSearchDTO
    {
        public string? PaymentTypeID { get; set; }
        public string? BankAccountID { get; set; }
        public string? PaymentNumber { get; set; }
        public string? fromdate { get; set; }
        public string? todate { get; set; }
        public string? VendorID { get; set; }
        public string?previousPN { get; set; }
    }
}
