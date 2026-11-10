using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class POLineItemSelectorBasedOnPODTO
    {
        public string? TotalID { get; set; }
        public long? POLineItemID { get; set; }
        public string? SpecNum { get; set; }
        public string? ItemDescription { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public decimal?AmountRemaining { get; set; }
        public decimal? PercentPaid { get; set; }
        public string? PONumber { get; set; }
        public string? CurrencyCode { get; set; }
        public long? PurchaseOrderID { get; set; }
        public decimal? ConversionRate { get; set; }
    }
}
