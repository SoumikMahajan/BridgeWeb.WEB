using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ItemApprovalsDto
    {
        public long ItemApprovalID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ItemShortName { get; set; } = string.Empty;
        public long? IsActive { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
