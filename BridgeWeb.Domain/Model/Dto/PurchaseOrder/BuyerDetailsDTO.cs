using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class BuyerDetailsDTO
    {
        public long BuyerId { get; set; }
        public string? Name { get; set; }
    }
}
