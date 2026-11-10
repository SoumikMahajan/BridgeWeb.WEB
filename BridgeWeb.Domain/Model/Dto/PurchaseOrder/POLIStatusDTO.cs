using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLIStatusDTO
    {
        public long FLDId { get; set; }
        public string? POLineItemStatus { get; set; }
        public string? selected { get; set; }
    }
}
