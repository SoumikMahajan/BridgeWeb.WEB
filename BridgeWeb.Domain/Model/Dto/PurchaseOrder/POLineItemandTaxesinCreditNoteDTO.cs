using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLineItemandTaxesinCreditNoteDTO
    {
        public long? POLineItemID { get; set; }
        public string? POLineItemNumber { get; set; }
        public string? Description { get; set; }
        public string? PONumber { get; set; }
        public long? PurchaseOrderID { get; set; }
        public decimal? Total { get; set; }
        public decimal? GSTHST { get; set; }
        public string? GSTHSTType { get; set; }
        public decimal? PST { get; set; }
        public string? PSTType { get; set; }
        public decimal? StateTax { get; set; }
        public string? StateTaxType { get; set; }
        //public decimal? TotalTax1 { get; set; }
        //public decimal? TotalTax2 { get; set; }
        //public decimal? TotalTax3 { get; set; }
        //public decimal? TotalAmount { get; set; }
        public decimal? Amount { get; set; }
        public decimal? SubTotal { get; set; }

    }
}
