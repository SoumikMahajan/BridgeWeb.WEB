using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POExpNoteUpdateDTO
    {
        public long? FldId { get; set; }
        public string? Note { get; set; }
        public long UserID { get; set; }
    }
}
