using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompletePoHistoryDTO
    {
        public long POHstId { get; set; }
        public string? ManagerName { get; set; }
        public string? Approved { get; set; }
        public string? Rejected { get; set; }
        public string? Comment { get; set; }
        public string? Version { get; set; }
        public string? resendon { get; set; }
        public string? files { get; set; }
        public int? Level { get; set; }
        public string? InsertDate { get; set; }
        public string? UserName { get; set; }
    }
}
