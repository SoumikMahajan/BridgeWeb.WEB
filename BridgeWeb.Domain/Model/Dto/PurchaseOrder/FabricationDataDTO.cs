namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class FabricationDataDTO
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
        public string Description { get; set; } = string.Empty;
        public string SpecNum { get; set; } = string.Empty;
        public string InserttDate { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public DateTime? ActionDate { get; set; }
        public string ShowDate { get; set; } = string.Empty;
        public string ActionType { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public long? ItemID { get; set; }
        public long? InsertByID { get; set; }
        public string ItemDescription { get; set; } = string.Empty;
        public string LineItemNumber { get; set; } = string.Empty;
        public string LatestStatus { get; set; } = string.Empty;
        public long? FabPathId { get; set; }
        public long? POLineItemID { get; set; }
        public long? LevelID { get; set; }
        public string TotalNumberOfApproval { get; set; } = string.Empty;
        public string NumberToApprovPO { get; set; } = string.Empty;
        public string TotalNumberOfLevelApproval { get; set; } = string.Empty;
        public string NumberToApprovedLevel { get; set; } = string.Empty;
        //public List<FabricationHistoryDTO>? History { get; set; } = new();
        public List<FabAllowedActionDTO> AllowdAction { get; set; } = new();
        public List<DropDownListDTO> FabPathList { get; set; } = new();
    }

    public class FabAllowedActionDTO
    {
        public long? fldid { get; set; }
        public string actiontype { get; set; } = string.Empty;
    }

    public class FabricationHistoryDTO
    {
        public long HistoryID { get; set; }
        public DateTime? ActionDate { get; set; }
        public string ShowDate { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public string ActionType { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FileNameToShow { get; set; } = string.Empty;
        public string FileNamePhysical { get; set; } = string.Empty;
        public long? ActionByID { get; set; }
        public string ManagerName { get; set; } = string.Empty;
        public long? POLineItemID { get; set; }
        public long? CheckAuthority { get; set; }
        public int? RejectedOne { get; set; }
    }

}
