using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class TermsUpdateDto
    {
        public long TermID { get; set; }
        public string? Terms { get; set; }
        public bool? Status { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
