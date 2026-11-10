using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class SystemUserByUserTypeDto
    {
        public long? UserTypeID { get; set; }
        public string? Usertype { get; set; }
        public long? ClientID { get; set; }
        public string? FullName { get; set; }
    }
}
