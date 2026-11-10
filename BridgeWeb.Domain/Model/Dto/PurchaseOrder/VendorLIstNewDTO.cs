using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class VendorLIstNewDTO
    {
        public long VendorId {  get; set; }
        public string? VendorName { get; set; }

        public long? CurrCode { get; set; }
        public string? CurrencyCode { get; set; }

    }
}
