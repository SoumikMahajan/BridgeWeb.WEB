using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SaveExpediteNoteFullDTO
    {
        public long? POID { get; set; }
        public string? Note { get; set; }
        public string? ReceivedQuantity { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string? Reference { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public long? UserID { get; set; }

    }
}
