using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLineItemCreateDTO
    {
        public long? POID { get; set; }
        public long LineItemId { get; set; }
        public  string? ItemApprovalID { get; set; }
        public long ProjectId { get; set; }
        public decimal? Quantity { get; set; }
        public long? UOMID { get; set; }
        public decimal? Cost { get; set; }
        public bool? NoStateTax { get; set; }
        public bool? NoGSTHST { get; set; }
        public bool? NoPST { get; set; }
        public string? ItemDtldDesc { get; set; }
        public string? Model { get; set; }
        public bool? Tag { get; set; }
        public string? Tagging { get; set; }
        public string? ItemDescription { get; set; }
        public long UserId { get; set; }


    }
}
