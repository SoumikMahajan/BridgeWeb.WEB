using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POHistoryRequestDTO
    {
        public string? PoId { get; set; }
        public string? Version { get; set; }
    }
}
