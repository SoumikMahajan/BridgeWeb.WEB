namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POHistoryDetails
    {
        public long FldID { get; set; }
        public long? PurchaseOrderID { get; set; }
        public string? PurchaseOrderNumber1 { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public string? VendorName { get; set; }
        public string? ProjectName { get; set; }
        public string? BuyerName { get; set; }
        public string? ShipMethod { get; set; }
        public decimal? ConversionRate { get; set; }
        public string? ArrivalDate { get; set; }
        public string? CheckBackDate { get; set; }
        public string? FOB { get; set; }
        public string? Freight { get; set; }
        public string? ShipTo { get; set; }
        public string? VendorCOName { get; set; }
        public string? InvoiceTo { get; set; }
        public string? Address1 { get; set; }
        public bool? IsCommited { get; set; }
        public bool? IsDeleted { get; set; }
        public long? IsPrinted { get; set; }
        public bool? Revision { get; set; }
        public long? Terms { get; set; }
        public bool? IsConfirmed { get; set; }
        public bool? IsReceivedComplete { get; set; }
        public bool? IsReceivedPartial { get; set; }
        public bool? IsActive { get; set; }
        public string? DateAdded { get; set; }
        public string? AddedByName { get; set; }
        public decimal? GSTHST { get; set; }
        public string? GSTHSTType { get; set; }
        public decimal? PST { get; set; }
        public string? PSTType { get; set; }
        public decimal? StateTax { get; set; }
        public string? StateTaxType { get; set; }
        public string? Remarks { get; set; }
        public string? Version { get; set; }
        public string? InsertDate { get; set; }
        public long? InsertBY { get; set; }
        public string? LevelStatus { get; set; }
    }

}
