using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class SaveMailTemplateDto
    {
        public string? MailBody { get; set; }
        public string? Subject { get; set; }
        public long? UpdatedBy { get; set; }
        public string? mode { get; set; }
    }
}
