using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
   public class ProjectListEnterInvoiceDTO
    {
        public long? ProjectID { get; set; }
        public string? ProjectName { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Taxn1 { get; set; }
        public string? Taxn2 { get; set; }
        public string? Taxn3 { get; set; }


    }
}
