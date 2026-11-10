using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteProjectDTO
    {
        public long? ProjectId { get; set; }
        public string ProjectDetail { get; set; } = string.Empty;
        public string Items { get; set; } = string.Empty;
    }
}
