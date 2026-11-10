using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
   public class PaymentTypeDTO
    {
        public long FldId { get; set; }
        public string? PayementCode { get; set; }
        public string? PaymentName { get; set; }
    }
}
