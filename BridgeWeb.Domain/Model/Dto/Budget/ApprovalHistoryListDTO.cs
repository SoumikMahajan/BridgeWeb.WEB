using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class ApprovalHistoryListDTO
    {
        public long? Version { get; set; }
        public string? VersionName { get; set; }
        public string? Approver { get; set; }
        public string? CreatedDate { get; set; }
        public string? Status { get; set; }
        public string? Comment { get; set; }
        public string? ApprovedByName { get; set; }
        public string? GroupName { get; set; }

    }
}
