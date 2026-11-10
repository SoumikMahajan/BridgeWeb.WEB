using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SectionListDDinPOLIDTO
    {
        public long SectionID {  get; set; }
        public string? SectionName { get; set; }
        public string? SectionNumber { get; set; }
        public string? Selected { get; set; }
        public long ProjectId { get; set; }
    }
}
