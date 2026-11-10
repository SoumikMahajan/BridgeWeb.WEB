using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class DashBoardPoApprovalCommentsDTO
    {
        public string? ActionType { get; set; }
        public string? Username { get; set; }
        public string? Managername { get; set; }
        public string? Comment { get; set; }
        public long? POID { get; set; }
        public string? ParentVendorName { get; set; }
        public long? ParentVendor_ID { get; set; }
        public string? Cname { get; set; }
        public long? Vendor_ID { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Remarks { get; set; }
        public string? Files { get; set; }
        public string? InsertDate { get; set; }
        public long FldID { get; set; }
        public string? LevelStatus { get; set; }
        public string? LevelApprovalStatus { get; set; }
        public string? GeneratedPOID { get; set; }
        public string? CheckingDate { get; set; }
        public int? NumberofData { get; set; }
        public string? LatestDate { get; set; }
        public string? DateofInsert { get; set; }
        public long? ProjectID { get; set; }
        public List<IncompletePOOverCommitedDTO>? OverCommitedList { get; set; } = new();
    }
}
