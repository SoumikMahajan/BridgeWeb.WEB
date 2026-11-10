using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLIExpediteHistoryDTO
    {
        public long FLdId { get; set; }
        public string Status { get; set; } = string.Empty;
        public long POLineItemID { get; set; }
        public string ExpediteNote { get; set; } = string.Empty;
        public string ReceivedQty { get; set; } = string.Empty;
        public DateTime? ReceivedDate { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public DateTime? ArrivalDate { get; set; }
    }
}
