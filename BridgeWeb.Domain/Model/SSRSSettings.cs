using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model
{
    public class SSRSSettings
    {
        public string? ReportServerUrl { get; set; }
        public string? ReportPath { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Domain { get; set; }
    }
}
