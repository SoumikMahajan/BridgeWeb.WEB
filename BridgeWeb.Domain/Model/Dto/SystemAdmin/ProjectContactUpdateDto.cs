using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ProjectContactUpdateDto
    {
        public long ContactTypeID { get; set; }
        public string? ContactType { get; set; }
        public string? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
