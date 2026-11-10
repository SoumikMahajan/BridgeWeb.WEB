using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentSearchListDTO
    {
        [Key]
        public long FldID { get; set; }
        public string? PaymentDate { get; set; }
        public long? BankAccountID {  get; set; }
        public string? PaymentNumber {  get; set; }
        public decimal? TotalPayment {  get; set; }
        public string? ParentVendorName { get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? ConvRate { get; set; }
        public string? QBOChecknumbers { get; set; }
        public string? QBOStatus {  get; set; }


    }
}
