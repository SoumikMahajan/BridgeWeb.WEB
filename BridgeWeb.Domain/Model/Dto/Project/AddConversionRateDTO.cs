using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class AddConversionRateDTO
    {
        public long? ProjectID { get; set; }
        public long? CurrencyID { get; set; }
        public string? ConversionRate { get; set; }
    }
}
