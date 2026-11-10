using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class CheckBackDateandNoteUpdateDTO
    {
        public long PurchaseOrderID { get; set; }
        public DateTime? CheckBackDate { get; set; }
        public string? Notes { get; set; }
        public bool IsClicked { get; set; }
        public long UserId { get; set; }

    }
}
