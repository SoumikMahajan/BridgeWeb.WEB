using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class BankAccountDTO
    {
        public long FldId { get; set; }
        public string? BankAccount { get; set; }
        public string? Description { get; set; }
        public string? CurrenCode { get; set; }
        public string? Currency { get; set; }
        public int? IsSelected { get; set; }

    }
}
