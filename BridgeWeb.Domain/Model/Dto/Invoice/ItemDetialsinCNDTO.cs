using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class ItemDetialsinCNDTO
    {
        public long? POLineItemID { get; set; }
        public string? POLineItemNumber { get; set; }
        public string? Description { get; set; }
        public string? PONumber { get; set; }
        public long? PurchaseOrderID { get; set; }
        public decimal? total { get; set; }
        public string? PSTType { get; set; }
        public decimal? PST { get; set; }
        public string? GSTHSTType { get; set; }
        public decimal? GSTHST { get; set; }
        public string? StateTaxType { get; set; }
        public decimal? StateTax { get; set; }

    }
}
