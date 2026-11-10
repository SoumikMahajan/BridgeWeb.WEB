using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public  class ProjectYTDListInVendorDTO
    {
        public string? ProjectName { get; set; }
        public long ProjectNumber { get; set; }
        public long ProjectId { get; set; }
        public decimal Total { get; set; }

        public string? CurrencyCode { get; set; }
    }
}
