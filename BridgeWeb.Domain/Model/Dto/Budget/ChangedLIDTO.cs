using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class ChangedLIDTO
    {
        public  string? Itemnumber {  get; set; }
        public long? ItemOrder { get; set; }
        public string? Item {  get; set; }
        public string? ItemDescription { get; set; }
        public string? model {  get; set; }
        public string? SpecNum { get; set; }
        public string? Vendor {  get; set; }
        public decimal? Quantity { get; set; }
        public string? UOM { get; set; }
        public decimal? Cost { get; set; }
        public string? Note { get; set; }
        public bool? Spacing { get; set; }
        public string? Header { get; set; }
        public decimal? Adjust { get; set; }
        public bool? Taxable { get; set; }
        public bool? nonfreight {  get; set; }
    }
}
