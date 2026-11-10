using System.Net.Http.Headers;

namespace BridgeWeb.Application.Common.Interfaces
{
    public interface ILogService
    {
        Task LogExceptionErrorAsync(Exception ex);
        Task LogCustomAsync(string message);
        Task ReportErrorLogAsync(string responseContent, HttpResponseHeaders headers, string requestUrl);
    }
}
