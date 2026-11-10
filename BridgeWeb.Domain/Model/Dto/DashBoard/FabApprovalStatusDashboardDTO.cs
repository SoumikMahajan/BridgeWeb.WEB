using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class FabApprovalStatusDashboardDTO
    {
        public string? Username { get; set; }
        public string? Managername { get; set; }
        public string? Comment { get; set; }
        public long? POID { get; set; }
        public string? GeneratedPOID { get; set; }
        public string? ParentVendorName { get; set; }
        public long? ParentVendor_ID { get; set; }
        public string? Cname { get; set; }
        public long? Vendor_ID { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Remarks { get; set; }
        public string? TotalID { get; set; }
        public string? Action { get; set; }
        public string? InsertDate { get; set; }
        public string? FldID { get; set; }
        public long? FabricationLineItem { get; set; }
        public string? Description { get; set; }
        public string? ItemName { get; set; }
        public int? NumberofData { get; set; }
        public string? CheckingDate { get; set; }
        public string? InsertDateWithTime { get; set; }
        public long? ProjectID { get; set; }
    }
}
