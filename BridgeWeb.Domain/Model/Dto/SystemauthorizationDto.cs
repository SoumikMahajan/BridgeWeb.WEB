using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto
{
    public class SystemauthorizationDto
    {
        public long Fldid { get; set; }
        public string? Item { get; set; }
        public string? Description { get; set; }
        public string? GroupType { get; set; }
        public long? GroupOrder { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsDelete { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
    }
}
