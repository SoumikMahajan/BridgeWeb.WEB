using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class BankAccountInEditProjectDto
    {
        public long Fld_ID { get; set; }
        public string? Bank_Account { get; set; }
        public string? Desc { get; set; }
        public string? Currency { get; set; }
        public string? CurrencyCode { get; set; }

        public string? IsSelected { get; set; }
    }
}
