using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteApproveVendorPODTO
    {
        public long PurchaseOrderID { get; set; }
        public string? Totalid { get; set; }
        public long? ProjectID { get; set; }
        public long? ProjectNumber { get; set; }
        public string? ContactFirstname { get; set; }
        public string? Contactname { get; set; }
        public long? ContactID { get; set; }
        public string? ParentVendorName { get; set; }
        public long? ParentvendorID { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? CEmail { get; set; }
        public string? Remarks { get; set; }
        public int? SentCounter { get; set; }
        public string? ApprovalDate { get; set; }
        public long? IsSystemUser { get; set; }
        public string? DateofInsert { get; set; }
        public string? GeneratedPOID { get; set; }
        public string? RemarksNew { get; set; }
        public string? CheckingDate { get; set; }
        public int? NumberofData { get; set; }
        public string? LatestDate { get; set; }
        public List<IncompletePOOverCommitedDTO> OverCommitedList { get; set; } = new();
    }
}
