using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class ExportLineItemDTO
    {
        public string? Name { get; set; }
        public long? SectionOrder { get; set; }
        public long? ItemOrder { get; set; }
        public string? Sectionnumber { get; set; }
        public string? TotalID { get; set; }
        public string? ItemDescription { get; set; }
        public string? SpecNum { get; set; }
        public string? Vendor { get; set; }
        public decimal? Quantity { get; set; }
        public string? UOM { get; set; }
        public double? Cost { get; set; }
        public double? Total { get; set; }
        public string? Note { get; set; }
        public bool? ToWarehouse { get; set; }
        public string? CommitAmountAdjust { get; set; }
        public DateTime? DateCreated { get; set; }
        public long? CreatedBy_ID { get; set; }
        public bool? Status { get; set; }
        public long? Spacing { get; set; }
        public string? Header { get; set; }
        public string? POID { get; set; }
        public decimal? Commit { get; set; }
        public double? Adjust { get; set; }
        public string? Taxable { get; set; }
        public string? Model { get; set; }
        public double? Remaining { get; set; }
        public double? Variance { get; set; }
    }
}
