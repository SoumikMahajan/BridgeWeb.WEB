using System;
using System.Collections.Generic;
using System.Text;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SinglePOHistoryDetailsDTO
    {
        public string? Vendor { get; set; }
        public string? VendorCO { get; set; }
        public string? ShipMethod { get; set; }
        public decimal ConversionRate { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? CheckBackDate { get; set; }

        public string? FOB { get; set; }
        public string? Freight { get; set; }

        public string? Notes { get; set; }
        public string? ShipTo { get; set; }
        public string? InvoiceTo { get; set; }
        public string? Address { get; set; }

        public decimal GSTHST { get; set; }
        public string? GSTHSTName { get; set; }
        public string? GSTHSTType { get; set; }

        public string? PST { get; set; }
        public string? PSTName { get; set; }
        public string? PSTType { get; set; }

        public string? StateTax { get; set; }
        public string? StateTaxName { get; set; }
        public string? StateTaxType { get; set; }
    }
}
