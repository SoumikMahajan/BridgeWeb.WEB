using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
   public class POIteminCNDTO
    {
        public long? POLineItemID { get; set; }
        public long? POID { get; set; }
        public string? PONUMBER { get; set; }
        public string? ItemDescription { get; set; }
        public double? POCost { get; set; }
        public decimal? LineItemTotal { get; set; }
        public string? POLineItemNumber { get; set; }
        public decimal? POCR { get; set; }
        public string? Selected { get; set; }
    }
}
