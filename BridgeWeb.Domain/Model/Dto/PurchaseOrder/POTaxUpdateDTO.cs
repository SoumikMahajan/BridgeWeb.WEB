using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POTaxUpdateDTO
    {
        public long POID { get; set; }
        public decimal? GSTHST { get; set; }
        public string? GSTHSTType { get; set; }
        public decimal? PST { get; set; }
        public string? PSTType { get; set; }
        public decimal? StateTax { get; set; }
        public string? StateTaxType { get; set; }

        public string? GSTHSTName { get; set; }
        public string? PSTName { get; set; }
        public string? StateTaxName { get; set; }
        
        public long UserId { get; set; }
    }
}
