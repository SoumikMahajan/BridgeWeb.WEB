using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteVendorConfirmDTO
    {
        public long POID { get; set; }
        public string? parentvendorname { get; set; }
        public long? ParentVendor_ID { get; set; }
        public string? Cname { get; set; }
        public long? Vendor_ID { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Remarks { get; set; }
        public string? GeneratedPOID { get; set; }
        public string? ArrivedDate { get; set; }
        public string? DateofInsert { get; set; }
        public string? CheckingDate { get; set; }
        public int? NumberofData { get; set; }
        public string? LatestDate { get; set; }
        public long? ProjectID { get; set; }
    }
}
