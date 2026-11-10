using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class SortSectionDto
    {
        public long ProjectId { get; set; }
        public int PreviousIndex { get; set; }
        public int PresentIndex { get; set; }
        public long? UserId { get; set; }
    }
}
