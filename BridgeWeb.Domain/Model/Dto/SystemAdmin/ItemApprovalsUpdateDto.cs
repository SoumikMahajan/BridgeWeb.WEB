using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ItemApprovalsUpdateDto
    {
        public long ItemApprovalID { get; set; }
        public string? ItemName { get; set; }
        public string? ItemShortName { get; set; }
        public string? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
