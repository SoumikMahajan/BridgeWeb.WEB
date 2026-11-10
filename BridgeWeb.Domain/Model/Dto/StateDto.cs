using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto
{
    public class StateDto
    {
        public long? StateID { get; set; }
        public string? State { get; set; }
        public string? StateCode { get; set; }
        public long? CountryCode { get; set; }
        public bool? Status { get; set; } = true;
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsDelete { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
    }
}
