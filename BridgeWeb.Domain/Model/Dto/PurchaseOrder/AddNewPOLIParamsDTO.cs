using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class AddNewPOLIParamsDTO
    {
        public long? POID { get; set; }
        public string? LineitemID { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public long? UOMID { get; set; }
        public string? Tag { get; set; }
        public string? Model { get; set; }
        //public long? UserId { get; set; }
        public string? ItemApprovalID { get; set; }

    }
}
