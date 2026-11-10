using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class LoginRequestDTO
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Hostname { get; set; }   
    }
}
