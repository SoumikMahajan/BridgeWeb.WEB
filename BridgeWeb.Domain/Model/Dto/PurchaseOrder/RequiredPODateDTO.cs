using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class RequiredPODateDTO
    {
        public DateTime? ArrivalDate { get; set; }
        public DateTime? PORequiredDate { get; set; }

    }
}
