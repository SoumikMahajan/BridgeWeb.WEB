using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentItemListDTO
    {
        public long? invoicenumber { get; set; }
        public long? fldid { get; set; }
        public string? invoicenumbervendor { get; set; }
        public string? InvoiceDate { get; set; }
        public string? terms { get; set; }
        public decimal? AmountOwing { get; set; }
        public decimal? InvoiceAmountPaid { get; set; }
        public string? currencycode { get; set; }
        public string? parentvendorname { get; set; }
        public decimal? exrate { get; set; }
        public long? parentvendor_id { get; set; }
        public string? legalname { get; set; }

    }
}
