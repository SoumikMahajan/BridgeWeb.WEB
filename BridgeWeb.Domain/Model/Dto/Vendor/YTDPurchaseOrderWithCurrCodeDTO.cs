using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class YTDPurchaseOrderWithCurrCodeDTO
    {
        public string? CurrencyCode { get; set; }
        public decimal Total { get; set; }
    }
}
