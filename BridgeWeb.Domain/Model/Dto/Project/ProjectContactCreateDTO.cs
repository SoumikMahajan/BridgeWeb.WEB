using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectContactCreateDTO
    {
        public long ProjectContact_ID { get; set; }
        public string? ContactName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public long? State { get; set; }
        public long? Country { get; set; }
        public string? Telephone { get; set; }
        public string? Extension { get; set; }
        public string? MobilePhone { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public string? ZIPCode { get; set; }

        public long? ContactType_ID { get; set; }
        public long? ProjectID { get; set; }
        public long? Status { get; set; }

        public long? CreatedBy { get; set; }
    }
}
