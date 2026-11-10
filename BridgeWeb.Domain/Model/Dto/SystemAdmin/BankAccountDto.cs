using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class BankAccountDto
    {
        //Bridge_BankAccount
        public long Fld_ID { get; set; }
        public string? Bank_Account { get; set; }
        public string? Desc { get; set; }
        public long? CurrCode { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }

        //Bridge_Currency
        public long CurrencyID { get; set; }
        public string? Currency { get; set; }
        public string? CurrencyCode { get; set; }
        public long? SortOrder { get; set; }
        public bool? Status { get; set; } = true;        
    }
}
