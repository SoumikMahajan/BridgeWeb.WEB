using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLIInCreditNoteGetDTO
    {
        public string? POLineItemID { get; set; }
        public long POID { get; set; }
        public long ProjectId { get; set; }
    }
}
