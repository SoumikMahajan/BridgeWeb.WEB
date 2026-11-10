using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Report
{
    public class RptDesignDTO
    {
        public string? ProjectName { get; set; }
        public string? HeaderContent { get; set; }
        public string? CurrCode { get; set; }
        public string? ProjectSelFlag { get; set; }
        public RptDesignTaxDTO? rptDesignTaxDTO { get; set; }
        public string? HeaderContentFab { get; set; }
    }
}
