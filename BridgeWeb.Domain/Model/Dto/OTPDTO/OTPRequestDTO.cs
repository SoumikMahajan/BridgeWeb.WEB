using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.OTPDTO
{
    public class OTPRequestDTO
    {
        public long UserId { get; set; }
        public string? CurrentUrl { get; set; }
        public string? OTP { get; set; }
        public string? Hostname { get; set; }

    }
}
