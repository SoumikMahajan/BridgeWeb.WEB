using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class POApprovalGetDataDto
    {
        public long RowNumber { get; set; }
        public long LevelID { get; set; }
        public int Assigned { get; set; }
        public int ApprovalLevel { get; set; }
        public string Name { get; set; } = string.Empty;
        public long FldID { get; set; }
        public long ProjectId { get; set; }
        public string ApprovalStage { get; set; } = string.Empty;
        public int NoUserAprvPO { get; set; }
    }
}
