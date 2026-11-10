using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class NewsortlineitemsForShiftDTO
    {
        public string prev {  get; set; } = string.Empty;
        public string current { get; set; } = string.Empty;
        public string prevItemOrder { get; set; } = string.Empty;
        public string currItemOrder { get; set; } = string.Empty;
        public long SectionId { get; set; }
        public string keycode { get; set; } = string.Empty;
    }
}
