using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class DashboardPOAcceptedDTO
    {
        public long POID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public string Insertdate { get; set; } = string.Empty;
        public string DateofInsert { get; set; } = string.Empty;
        public string ParentVendorName { get; set; } = string.Empty;
        public long? ParentVendor_ID { get; set; }
        public string Cname { get; set; } = string.Empty;
        public long? Vendor_ID { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string GeneratedPOID { get; set; } = string.Empty;
        public string CheckingDate { get; set; } = string.Empty;
        public int? NumberofData { get; set; }
        public string LatestDate { get; set; } = string.Empty;
        public long? ProjectId { get; set; }

        [NotMapped]
        public List<IncompletePOOverCommitedDTO> OverCommitedList { get; set; } = new();
    }
}
