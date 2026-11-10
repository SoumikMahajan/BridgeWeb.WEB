using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class PTDPurchasesDTO
    {
        public string? ParentVendorName { get; set; }
        public long? ParentVendorID { get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? Total { get; set; }
        public int? conv { get; set; }

    }
}
