using BridgeWeb.Domain.Model.Dto.PurchaseOrder;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteFabDTO
    {
        public long ItemApprovalID { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ParentVendorName { get; set; } = string.Empty;
        public long? ParentVendor_ID { get; set; }
        public long? Vendor_ID { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public long? PurchaseOrderID { get; set; }
        public string TotalPOID { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string SpecNum { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string InserttDate { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public DateTime? ActionDate { get; set; }
        public string ShowDate { get; set; } = string.Empty;
        public string ActionType { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public long? ItemID { get; set; }
        public long? InsertByID { get; set; }
        public string ItemDescription { get; set; } = string.Empty;
        public string CheckingDate { get; set; } = string.Empty;
        public string LineItemNumber { get; set; } = string.Empty;
        public string LatestStatus { get; set; } = string.Empty;
        public long? Project_ID { get; set; }
        public int? NumberofData { get; set; }
        public long? POLineItemID { get; set; }
        public long? PolineItemApprovalID { get; set; }
        //public int? TotalNumberAlreadyApproved { get; set; }
        //public int? NoOfApproval { get; set; }
        public long? LevelID { get; set; }
        public long? FabPathId { get; set; }
        public List<FabAllowedActionDTO> AllowdAction { get; set; } = new();
        public List<DropDownListDTO> FabPathList { get; set; } = new();
        public string IsManager { get; set; } = string.Empty;
        public string TotalNumberOfApproval { get; set; } = string.Empty;
        public string NumberToApprovPO { get; set; } = string.Empty;
        public string TotalNumberOfLevelApproval { get; set; } = string.Empty;
        public string NumberToApprovedLevel { get; set; } = string.Empty;
    }
}
