using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SaveAllUpdatePOLineItemsDTO
    {
        public List<POLineItemUpdateDTO>? POLineItemData { get; set; }
    }
}
