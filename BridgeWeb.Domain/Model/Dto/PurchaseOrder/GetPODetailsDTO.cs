using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class GetPODetailsDTO
    {
        public long PurchaseOrderID { get; set; }
        public long? Vendor_ID { get; set; }
        public long? Project_ID { get; set; }
        public long? Buyer_ID { get; set; }
        public long? ShipMethod { get; set; }
        public decimal? ConversionRate { get; set; }
        public string? ArrivalDate { get; set; }
        public string? CheckBackDate { get; set; }
        public string? FOB { get; set; }
        public string? Freight { get; set; }
        public string? ShipTo { get; set; }
        public long? VendorCO { get; set; }
        public string? InvoiceTo { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? Address4 { get; set; }
        public bool? IsCommited { get; set; }
        public bool? IsDeleted { get; set; }
        public long? IsPrinted { get; set; }
        public bool? Revision { get; set; }
        public long? Terms { get; set; }
        public bool? IsConfirmed { get; set; }
        public bool? IsReceivedComplete { get; set; }
        public bool? IsReceivedPartial { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? DateAdded { get; set; }
        public long? AddedBy_ID { get; set; }
        public decimal? GSTHST { get; set; }
        public string? GSTHSTType { get; set; }
        public decimal? PST { get; set; }
        public string? PSTType { get; set; }
        public decimal? StateTax { get; set; }
        public string? StateTaxType { get; set; }
        public string? Remarks { get; set; }
        public string? Version { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsSentForApproval { get; set; }
        public string? GSTHSTName { get; set; }
        public string? PSTName { get; set; }
        public string? StateTaxName { get; set; }
        public string? Notes { get; set; }
        public DateTime? CommitedDate { get; set; }
        public bool? IsVendorSent { get; set; }
        public string? GeneratedPONumber { get; set; }
        public string? VendorName { get; set; }

        public string? VendorCareOfName { get; set; }
        public string? Project { get; set; }

        public string? CurrencyCode { get; set; }
        public long? CurrencyId { get; set; }
        public int? Lineitemcount { get; set; }
        public bool? CreatePOPermission { get; set; }

        public bool? IsHidden { get; set; }



    }
}
