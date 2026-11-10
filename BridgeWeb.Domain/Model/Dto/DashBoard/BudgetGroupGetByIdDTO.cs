using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class BudgetGroupGetByIdDTO
    {
        public string? GroupName { get; set; }
        public string? SectionNumber { get; set; }
        public string? Name { get; set; }
        public long? GroupId { get; set; }

    }
}
