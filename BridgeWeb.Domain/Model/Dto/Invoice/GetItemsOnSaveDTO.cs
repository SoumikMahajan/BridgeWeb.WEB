using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class GetItemsOnSaveDTO
    {
        public string? PONumber { get; set; }
        public long? POLineItemID { get; set; }
        public string? TotalID { get; set; }
        public long? ProjectID { get; set; }
        public long? BudgetSectionID { get; set; }
        public long? LineItemID { get; set; }
        public long? ItemOrder { get; set; }
        public string? Item { get; set; }
        public string? ItemDescription { get; set; }
        public string? SpecNum { get; set; }
        public string? ItemDtldDesc { get; set; }
        public decimal? Extended { get; set; }
        public string? ReceivedQuantity { get; set; }
        public string? Vendor { get; set; }
        public decimal? Quantity { get; set; }
        public long? UOMID { get; set; }
        public string? UOM { get; set; }
        public decimal? Cost { get; set; }
        public string? Note { get; set; }
        public bool? ToWarehouse { get; set; }
        public string? CommitAmountAdjust { get; set; }
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public bool? Status { get; set; }
        public bool? Spacing { get; set; }
        public string? Header { get; set; }
        public decimal? BudgetlineItemAmount { get; set; }
        public decimal? POlineItemAmount { get; set; }
        public string? POLIModel { get; set; }
        public string? CommittedBudgetCost { get; set; }


    }
}
