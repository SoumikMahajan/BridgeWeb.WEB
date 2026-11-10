using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectConversionRateDTO
    {
        public long FldID { get; set; }
        public long ProjectID { get; set; }
        public long CurrencyID { get; set; }
        public string? Currcode { get; set; }
        public string? ConversionRate { get; set; }
        public DateTime InsertDate { get; set; }
    }
}
