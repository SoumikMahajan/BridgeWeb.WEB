using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public  class ManualPaymentItemSaveDTO
    {
        public string? InvoiceID { get; set; }
        public string? vl { get; set; }
        public string? ManualPaymentID { get; set; }
        public string?UserId { get; set; }

    }
}
