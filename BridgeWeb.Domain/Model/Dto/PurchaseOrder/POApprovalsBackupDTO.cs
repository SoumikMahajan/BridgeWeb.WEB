using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POApprovalsBackupDTO
    {
        public int Approved { get; set; }
        public int Rejected { get; set; }
        public DateTime? InsertDate { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string ManagerName { get; set; } = string.Empty;
        public string FName { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string LevelStatus { get; set; } = string.Empty;
    }
}
