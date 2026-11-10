using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class ReorderItemListingDTO
    {
        public long POLineItemID { get; set; }
        public string? ItemDescription { get; set; }
        public string? isDisabled { get; set; }
    }
}
