using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class BuyerDDListDto
    {
        public long BuyerId { get; set; }
        public string BuyerName { get; set; } = "";
        public string IsDefaultBuyer { get; set; } = "";
    }
}
