using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
   public class DeleteMultiplePOLineItemDTO
    {
        public string? POLIToMakeZero { get; set; }
        public string? POLIToDelete { get; set; }
        public long UseId { get; set; }
    }
}
