using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POInvoiceCalculationDTO
    {
        public decimal? TotalInvoiceAmount { get; set; }

        public decimal? TotalInvoiceTax { get;  set; }
    }
}
