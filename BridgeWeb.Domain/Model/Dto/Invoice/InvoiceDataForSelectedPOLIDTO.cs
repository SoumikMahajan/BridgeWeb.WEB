using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class InvoiceDataForSelectedPOLIDTO
    {
        public decimal? prevtotal { get; set; }
        public long? POLineItemID { get; set; }
        public string? TotalItemNumber { get; set; }
        public string? TotalPOID { get; set; }
        public decimal? Total { get; set; }
        public long? POID { get; set; }
        public string? SpecNum { get; set; }
        public string? ItemDescription { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? Amount { get; set; }
        //GSTHST
        public decimal? Tax1Val { get; set; }
        public string? Tax1type { get; set; }
        //PST
        public decimal? Tax2Val { get; set; }
        public string? Tax2type { get; set; }
        //StateTax
        public decimal? Tax3Val { get; set; }
        public string? Tax3type { get; set; }
        public string? Tax1Name { get; set; }
        public string? Tax2Name { get; set; }
        public string? Tax3Name { get; set; }
        public decimal? TotalTax1Paid { get; set; }
        public decimal? TotalTax2Paid { get; set; }
        public decimal? TotalTax3Paid { get; set; }
        public bool? IsApplicableTax1 { get; set; } //No GSTHST
        public bool? IsApplicableTax2 { get; set; } //No PST
        public bool? IsApplicableTax3 { get; set; } // No State tax
        public string? ProjectAccounts { get; set; }


    }
}
