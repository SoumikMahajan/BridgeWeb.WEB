using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class POItemSelectorInvEditDTO
    {
        public string? TotalID { get; set; }
        public long? POLineItemID { get; set; }
        public string? SpecNum { get; set; }
        public string? ItemDescription { get; set; }
        public decimal? Quantity { get; set; }
        public double? Amount { get; set; }
        public double? AmountRemaining { get; set; }
        public double? PercentPaid { get; set; }
        public string? PONumber { get; set; }
        public string? CurrencyCode { get; set; }
        public long? PurchaseOrderID { get; set; }
        public string? Selected { get; set; }
    }
}
