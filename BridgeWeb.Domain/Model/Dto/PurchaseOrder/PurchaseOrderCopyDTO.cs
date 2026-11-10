using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class PurchaseOrderCopyDTO
    {
        public long PurchaseOrderID { get; set; }
        public long Vendor_ID { get; set; }
        public long Project_ID { get; set; }
        public long Buyer_ID { get; set; }
        public long ShipMethod { get; set; }
        public decimal ConversionRate { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? CheckBackDate { get; set; }
        public string? FOB { get; set; }
        public string? Freight { get; set; }
        public string? ShipTo { get; set; }
        public long? VendorCO { get; set; }
        public string? InvoiceTo { get; set; }
        public long? Terms { get; set; }
        public string? Address1 { get; set; }
        public string? Remarks { get; set; }
        public string? Notes { get; set; }
        public string? CurrencyCode { get; set; }
        public long? CurrencyId { get; set; }

    }
}
