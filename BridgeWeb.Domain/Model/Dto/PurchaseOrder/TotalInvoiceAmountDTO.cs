using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class TotalInvoiceAmountDTO
    {
        public string? poLineItemId { get; set; }
        public decimal? totalInv { get; set; }
        public decimal? poCost {  get; set; }
        public decimal? amount { get; set; }
    }
}
