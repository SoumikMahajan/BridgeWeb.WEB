using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class CreateFabricationDTO
    {
        public string? POLineItemID { get; set; }
        public string? ItemApprovalID { get; set; }
        public string? ItemApprovalDesc { get; set; }
        public string? ProjectId { get; set; }
        public long? UserId { get; set; }
    }
}
