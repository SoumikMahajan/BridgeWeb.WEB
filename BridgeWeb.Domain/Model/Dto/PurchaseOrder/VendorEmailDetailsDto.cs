using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class VendorEmailDetailsDto
    {
        public long UserId { get; set; }
        public string? SelfCC { get; set; }
        public string? MailBody { get; set; }
        public string? MailSubject { get; set; }
        public string? MailId { get; set; }
        public long VendorId { get; set; }
        public List<long>? PoidList { get; set; }

        public string? CurrentUrl { get; set; }
    }
}
