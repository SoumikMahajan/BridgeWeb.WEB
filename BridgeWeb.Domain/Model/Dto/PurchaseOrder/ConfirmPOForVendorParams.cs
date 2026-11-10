using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class ConfirmPOForVendorParams
    {
        public string? POID { get; set; }
        public string? Comment { get; set; }
        public string? UserId { get; set; }

    }
}
