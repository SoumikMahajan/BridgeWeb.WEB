using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class FeedbackDTO
    {
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? Page { get; set; }
        public long UserId { get; set; }
    }
}
