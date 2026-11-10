using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Report
{
    public class POReportParamDTO
    {
        public string? InvoiceTo { get; set; }
        public string? ShipTo { get; set; }
        public string? ProjectNumber { get; set; }
        public string? PurchaseOrderID { get; set; }
        public string? ContactName { get; set; }
        public string? ContactAddress { get; set; }
        public string? Fax { get; set; }
        public string? VNote { get; set; }
        public string? IssueDate { get; set; }
        public string? Terms { get; set; }
        public string? ArrivalDate { get; set; }
        public string? Remarks { get; set; }
        public string? FOB { get; set; }
        public string? SpecialShippingInstructions { get; set; }
        public string? ShipMethod { get; set; }
        public string? Comment { get; set; }
        public string? Currency { get; set; }
        public string? CurrencyCode { get; set; }
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
        public string? ProjectName { get; set; }
        public string? LegalName { get; set; }
        public string? UserEmail { get; set; }
    }
}
