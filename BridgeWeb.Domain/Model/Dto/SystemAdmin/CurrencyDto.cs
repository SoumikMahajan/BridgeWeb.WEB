using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class CurrencyDto
    {
        public long CurrencyID { get; set; }
        public string? Currency { get; set; }
        public string? CurrencyCode { get; set; }
        public long? SortOrder { get; set; }
        public bool? Status { get; set; } = true;
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsDelete { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
    }
}
