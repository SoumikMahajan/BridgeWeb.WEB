using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ClassificationUpdateDto
    {
        public long Classification_ID { get; set; }
        public string? Classification { get; set; }
        public string? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
