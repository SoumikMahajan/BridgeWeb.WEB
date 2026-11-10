using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class BankAccountDetailsListDTO
    {
        public long? Fld_ID { get; set; }
        public string? BankAccountName { get; set; }
        public string? CurrencyID { get; set; }
        public string? Bank_Account { get; set; }
    }
}
