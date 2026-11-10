using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto
{
    public class BankAccountUpdateDto
    {
        public long Fld_ID { get; set; }
        public string? Bank_Account { get; set; }
        public string? Desc { get; set; }
        public long? CurrCode { get; set; }
        public bool? IsActive { get; set; }
        public long? UpdatedBy { get; set; }
    }
}
