using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BRIDGE_LineITemsCreateDTO
    {
        public long? ItemOrder { get; set; }
        public string? Item { get; set; }
        public string? ItemDescription { get; set; }
        public long? Itemnumber { get; set; }
        public string? SpecNum { get; set; }
        public string? Vendor { get; set; }
        public decimal? Quantity { get; set; }
        public long? UOMID { get; set; }
        public decimal? Cost { get; set; }
        public string? Note { get; set; }
        public bool? ToWarehouse { get; set; }
        public long? BudgetSectionID { get; set; }
        public long? CreatedBy_ID { get; set; }
        public bool? Status { get; set; }
        public string? Header { get; set; }
        public string? Model { get; set; }
        public string? CommitAmountAdjust { get; set; }
        public bool? Taxable { get; set; }
        public bool? nonfreight { get; set; }
    }
}
