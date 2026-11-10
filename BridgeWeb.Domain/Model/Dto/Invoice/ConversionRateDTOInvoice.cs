using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class ConversionRateDTOInvoice
    {
        public decimal? Remaining { get; set; }
        public long? POID { get; set; }
        public decimal? ConversionRate { get; set; }
    }
}
