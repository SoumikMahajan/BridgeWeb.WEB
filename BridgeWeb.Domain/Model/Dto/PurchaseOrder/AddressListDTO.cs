using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class AddressListDTO
    {
        public int IsDefault { get; set; }

        public string? Address1 { get; set; }

        public string? TabHeader { get; set; }
    }
}
