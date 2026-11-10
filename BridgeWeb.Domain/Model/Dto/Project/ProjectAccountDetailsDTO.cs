using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectAccountDetailsDTO
    {
        public long FldID { get; set; }
        public long ProjectID { get; set; }
        public string? AccountNumber { get; set; }
        public long IsActive { get; set; }
        public string? Description { get; set; }
    }
}
