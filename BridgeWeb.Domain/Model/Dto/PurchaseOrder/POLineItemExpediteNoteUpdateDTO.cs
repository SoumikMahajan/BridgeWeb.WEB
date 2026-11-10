using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLineItemExpediteNoteUpdateDTO
    {
        public long? FldID { get; set; }
        //public long? POLineItemID { get; set; }
        public long? ItemStatus { get; set; }
        public string? POLineItemExpediteNote { get; set; }
        public decimal? ReceiveQty { get; set; }
        public DateTime? ReceiveDate { get; set; }
        public string? Reference { get; set; }
        public long? CreatedBy { get; set; }
    }
}
