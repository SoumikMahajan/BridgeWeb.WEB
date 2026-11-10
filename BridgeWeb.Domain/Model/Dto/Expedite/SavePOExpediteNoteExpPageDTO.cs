using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class SavePOExpediteNoteExpPageDTO
    {
        public string? POID { get; set; }
        public string? Note { get; set; }

        public long UserId { get; set; }
    }
}
