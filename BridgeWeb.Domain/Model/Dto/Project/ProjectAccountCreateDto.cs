using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectAccountCreateDto
    {
        public long ProjectID { get; set; }
        public string? AccountNumber { get; set; }
        public string? Description { get; set; }
       
        public long? CreatedBy { get; set; }
    }
}
