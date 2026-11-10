using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentTypeGetDTO
    {
        public long FldID { get; set; }
        public string? PaymentTypeName { get; set; }
        public bool? IsDefault { get; set; }
        public string? PaymentCode { get; set; }
    }
}
