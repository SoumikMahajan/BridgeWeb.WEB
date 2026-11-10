using System;
using System.Collections.Generic;
using System.Text;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class FabApprovalItemValidationDTO
    {
        public long PoLineItemId { get; set; }
        public string? desc { get; set; } = string.Empty;
        public long ItemApprovalId { get; set; }
        public long ProjectID { get; set; }
    }
}
