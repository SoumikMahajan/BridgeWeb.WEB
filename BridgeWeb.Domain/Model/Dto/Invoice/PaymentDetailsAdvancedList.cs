using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentDetailsAdvancedList
    {

        public long FldID { get; set; }
        public string? PaymentDate { get; set; }
        public long? PaymentType { get; set; }
        public string? PaymentTypeName { get; set; }
        public long? BankAccountID { get; set; }
        public string? PaymentNumber { get; set; }
        public decimal? TotalPayment { get; set; }
        public string? QBO { get; set; }
        public string? ParentVendorName { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Bank_Account { get; set; }
        public decimal? ConvRate { get; set; }
        public string? QBOStatus { get; set; }
        public long? CancelID { get; set; }


    }
}
