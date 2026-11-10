using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class ProjectSectionForCopyBudget
    {
        public long budgetSectionId { get; set; }
        public string? sectionName { get; set; }
        public long lineItemCount { get; set; }
        public float cost { get; set; }
        public long sectionOrder { get; set; }
        public string? sectionNumber { get; set; }
    }
}