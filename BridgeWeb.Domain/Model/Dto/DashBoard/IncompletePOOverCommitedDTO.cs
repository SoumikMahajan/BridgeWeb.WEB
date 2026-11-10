using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompletePOOverCommitedDTO
    {
        public long POLineItemID { get; set; }
        public decimal? BudgetAmount { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal? CommitedCost { get; set; }
        public string ItemNumber { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public decimal? Rate { get; set; }
        public string Sectionnumber { get; set; } = string.Empty;
        public string NAME { get; set; } = string.Empty;

        public List<CommittedPOLIDetailsDTO> commitedPO { get; set; } = new();
    }
}
