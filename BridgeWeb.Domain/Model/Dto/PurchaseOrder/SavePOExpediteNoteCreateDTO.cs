using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SavePOExpediteNoteCreateDTO
    {
        public long POLineItemID { get; set; }
        public string? Note { get; set; }

        public long UserId { get; set; }
    }
}
