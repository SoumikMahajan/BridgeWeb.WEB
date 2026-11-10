using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class AllOUMDetailsDTO
    {
        public long UOM_ID { get; set; }
        public string? UOM { get; set; }
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public long? Status { get; set; }
    }
}
