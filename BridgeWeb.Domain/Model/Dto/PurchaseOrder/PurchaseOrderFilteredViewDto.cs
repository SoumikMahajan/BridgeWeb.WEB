namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class PurchaseOrderFilteredViewDto
    {
        public long? UserID { get; set; }
        public double? TotalPOCost { get; set; }
        public long? ProjectUserTypeId { get; set; }
        public string InvoiceStatus { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string IsVendorCO { get; set; } = string.Empty;
        public bool? IsVendorSent { get; set; }
        public string Permission { get; set; } = string.Empty;
        public bool? IsConfirmed { get; set; }
        public string VendorEmail { get; set; } = string.Empty;
        public string PCStaff { get; set; } = string.Empty;
        public string PurchaseOrderID { get; set; } = string.Empty;
        public string PurchaseOrderID_New { get; set; } = string.Empty;
        public string POno3 { get; set; } = string.Empty;
        public string ProjectNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string CheckBackDate { get; set; } = string.Empty;
        public string Commited { get; set; } = string.Empty;
        public string IsDeleted { get; set; } = string.Empty;
        public long? ParentVendorID { get; set; }
        public long? Project_ID { get; set; }
        public string ShipDate { get; set; } = string.Empty;
        public string ArrivalDate { get; set; } = string.Empty;
        public string IsVendor { get; set; } = string.Empty;
        public bool? IsCommited { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsSentForApproval { get; set; }
        public long? IsAllowSentForApproval { get; set; }
        public string ShowSendForApproval { get; set; } = string.Empty;
    }
}
