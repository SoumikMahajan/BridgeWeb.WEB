using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class BankAccountCreateDto
    {
        public string? Bank_Account { get; set; }
        public string? Desc { get; set; }
        public long? CurrCode { get; set; }
        public bool? IsActive { get; set; }
        public long? CreatedBy { get; set; }
    }
}
