using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectCommentDto
    {
        public long? ProjectNumber { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string PurchaseOrderComment { get; set; } = string.Empty;
    }
}
