using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class ManualPaymentItemsUpdateDTO
    {
        public string? FldID { get; set; }
        public string? InvoiceAmount { get; set; }
        //public string? UserId { get; set; }

    }
}
