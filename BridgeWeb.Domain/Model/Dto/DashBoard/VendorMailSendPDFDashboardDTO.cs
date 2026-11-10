using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class VendorMailSendPDFDashboardDTO
    {
        public string? Mailsubject { get; set; }
        public string? Mailbody { get; set; }
        public string? Poids { get; set; }
        public string? Project_ID { get; set; }
        public string? Addcc { get; set; }
        public string? VendorId { get; set; }
        public string? Email { get; set; }
        public string? CurrentUrl { get; set; }
        public long UserId { get; set; }
        //public IFormFile? ZipFile { get; set; }
        public List<IFormFile>? ZipFile { get; set; }
    }
}
