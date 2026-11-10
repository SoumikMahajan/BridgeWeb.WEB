using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class POSelectorListDTO
    {
        public string? terms { get; set; }
        public long? vendor_id { get; set; }
        public long? projectid { get; set; }
        public string? totalid { get; set; }
        public long? poid { get; set; }
        public decimal? total { get; set; }
        public decimal? remaining { get; set; }
        public double? tax1 { get; set; }
        public double? tax2 { get; set; }
        public double? tax3 { get; set; }
        public string? currencycode { get; set; }
        public decimal? CR { get; set; }
        public double? Tax { get; set; }


    }
}
