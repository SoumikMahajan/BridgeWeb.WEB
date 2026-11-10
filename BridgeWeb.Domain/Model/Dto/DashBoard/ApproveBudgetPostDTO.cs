using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class ApproveBudgetPostDTO
    {
        public string? ProjectID { get; set; }
        public string? Comment { get; set; }
        public string?  ManagerID { get; set; }
        public string? GroupID { get; set; }
        public string? UserId { get; set; }
    }
}
