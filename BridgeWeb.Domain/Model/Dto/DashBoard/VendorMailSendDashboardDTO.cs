using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class VendorMailSendDashboardDTO
    {
        public string? Mailsubject { get; set; }
        public string? Mailbody { get; set; }
        public string? Poid { get; set; }
        public string? Project_ID { get; set; }
        public string? Addcc { get; set; }
        public string? MailContactMap { get; set; }
        public string? CurrentUrl { get; set; }
        public long UserId { get; set; }
    }
}
