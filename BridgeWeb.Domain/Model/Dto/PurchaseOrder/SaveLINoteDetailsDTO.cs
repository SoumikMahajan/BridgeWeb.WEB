using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class SaveLINoteDetailsDTO
    {
        public long POLineItemID { get; set; }
        public long? ItemStatus { get; set; }
        public string? ArrivalDate { get; set; }
        public string? Note { get; set; }
        public decimal? ReceiveQty { get; set; }
        public string? ReceiveDate { get; set; }
        public string? Reference { get; set; }
        public long? POID { get; set; }
        public bool isUpdateAll { get; set; }
        public long UserID { get; set; }

    }
}
