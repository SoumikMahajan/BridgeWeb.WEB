using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class InCompleteBudgetHstDTO
    {
        public long FldID { get; set; }
        public long? GroupID { get; set; }
        public string? ManagerName { get; set; }
        public long? ManagerID { get; set; }
        public long? Approved { get; set; }
        public long? Rejected { get; set; }
        public string? Comment { get; set; }
        public long? resend { get; set; }
        public string? resendon { get; set; }
        public string? InsertDate { get; set; }
        public string? UserName { get; set; }
        public string? Version { get; set; }
        public long? RevokePermission { get; set; }
        public string? Groupname { get; set; }
    }
}
