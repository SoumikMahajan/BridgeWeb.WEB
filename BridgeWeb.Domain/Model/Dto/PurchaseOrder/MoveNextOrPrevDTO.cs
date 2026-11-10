using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class MoveNextOrPrevDTO
    {
        public long POID { get; set; }
        public DateTime? CheckBackDate { get; set; }
        public string? Notes { get; set; }
        public long UserID {  get; set; }
        public bool IsClicked { get; set; }
        public string? Mode { get; set; }
    }
}
