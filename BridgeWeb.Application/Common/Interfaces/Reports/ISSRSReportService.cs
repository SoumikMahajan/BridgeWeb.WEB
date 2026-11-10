using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.Reports
{
    public interface ISSRSReportService
    {
        Task<byte[]?> GetReportAsync(string reportName, Dictionary<string, string> parameters, string exportFormat);
        //Task<string> GetReportAsDifferentFormatAsync(string reportName, Dictionary<string, string> parameters);
    }
}
