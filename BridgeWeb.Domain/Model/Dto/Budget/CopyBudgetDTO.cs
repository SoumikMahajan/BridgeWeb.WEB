using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class CopyBudgetDTO
    {
        public long ProjectId {  get; set; }
        public long SectionId { get; set; }
        public long SourceProjectId { get; set; }
        public long SourceSectionId { get; set; }
        public long VersionId { get; set; }

        public long CreatedById { get; set; }
    }
}
