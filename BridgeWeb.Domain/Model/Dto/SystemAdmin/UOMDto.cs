using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class UOMDto
    {
        public long UOM_ID { get; set; }
        public string? UOM { get; set; }
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public long? Status { get; set; }
        public long? IsDefault { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
