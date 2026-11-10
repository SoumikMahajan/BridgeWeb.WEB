using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Domain.Model;
using Microsoft.Extensions.Options;

namespace BridgeWeb.Infrastructure.Service.Reports
{
    public class SsrsReportService : ISSRSReportService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly SSRSSettings _settings;
        private readonly ILogService _logService;
        public SsrsReportService(IHttpClientFactory clientFactory, IOptions<SSRSSettings> options, ILogService logService)
        {
            _clientFactory = clientFactory;
            _settings = options.Value;
            _logService = logService;
        }
        //public async Task<byte[]> GetReportAsPdfAsync(string reportName, Dictionary<string, string> parameters)
        //{
        //    //byte[] fileBytes = default;
        //    //var reportServerUrl = _settings.ReportServerUrl;
        //    //var reportPath = _settings.ReportPath;
        //    //var username = _settings.Username;
        //    //var password = _settings.Password;
        //    //var domain = _settings.Domain;          

        //    string reportUrl = BuildReportUrl(reportName, parameters);

        //    var client = _clientFactory.CreateClient("SSRSBridgeReport");

        //    //using var client = CreateHttpClient();

        //    var response = await client.GetAsync(reportUrl);

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        LogResponseDetails(response);
        //        return null;
        //    }

        //    return await response.Content.ReadAsByteArrayAsync();
        //}

        public async Task<byte[]?> GetReportAsync(string reportName, Dictionary<string, string> parameters, string exportFormat)
        {
            if (string.IsNullOrWhiteSpace(_settings.ReportPath))
            {
                throw new InvalidOperationException("SSRS ReportPath is not configured.");
            }

            string folderPath = _settings.ReportPath.TrimEnd('/');

            // Decide subfolder based on export format
            string formatFolder = exportFormat?.ToUpper() switch
            {
                "PDF" => "PDF",
                "EXCELOPENXML" => "EXCEL",
                _ => ""
            };

            if (!string.IsNullOrEmpty(formatFolder))
            {
                folderPath = $"{folderPath}/{formatFolder}";
            }

            var reportUrl =$"{_settings.ReportServerUrl}?/{folderPath}/{reportName}" + $"&rs:Format={exportFormat}&rs:ClearSession=true";

            var content = new FormUrlEncodedContent(parameters);

            using HttpClient client = _clientFactory.CreateClient("SSRSBridgeReport");

            var response = new HttpResponseMessage();

            try
            {
                response = await client.PostAsync(reportUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    await LogResponseDetails(response);
                    return null;
                }

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                await _logService.ReportErrorLogAsync(ex.Message, response.Headers, reportUrl);
                return null;
            }
        }

        private async Task LogResponseDetails(HttpResponseMessage response)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            var headers = response.Headers;
            var requestUrl = response.RequestMessage?.RequestUri?.ToString() ?? "";

            await _logService.ReportErrorLogAsync(responseContent, headers, requestUrl);
        }
    }
}
