using BridgeWeb.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace BridgeWeb.Infrastructure.Service
{
    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly SemaphoreSlim _logSemaphore = new(1, 1);
        private const int MaxWaitTimeMs = 5000;
        private const string LogDirectory = @"C:\Logs\";
        public LogService(ILogger<LogService> logger, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogExceptionErrorAsync(Exception ex)
        {

            var logFile = GetLogFilePath();
            EnsureDirectoryExists(LogDirectory);

            if (!await _logSemaphore.WaitAsync(MaxWaitTimeMs))
            {
                _logger.LogWarning("LogService timeout (LogCustomAsync): could not acquire file lock.");
                return;
            }

            try
            {
                if (!File.Exists(logFile))
                {
                    await using var _ = File.Create(logFile);
                }

                await using var txtWriter = new StreamWriter(logFile, append: true);
                await LogAsync(ex, txtWriter);
            }
            finally
            {
                _logSemaphore.Release();
            }
        }

        private async Task LogAsync(Exception ex, TextWriter txtWriter)
        {
            var userId = GetUserIdFromClaims(_httpContextAccessor.HttpContext?.User!);

            await txtWriter.WriteLineAsync($"\r\nLog Entry For Web Sln: {DateTime.Now:D} {DateTime.Now:T}");
            await txtWriter.WriteLineAsync($"  :[LoggedInUser]: {userId}");
            await txtWriter.WriteLineAsync($"  :[Error]: {ex.Message}");

            var stackTrace = ex.StackTrace?.Split(new[] { Environment.NewLine }, StringSplitOptions.None);

            await txtWriter.WriteLineAsync($"  :[StackTrace]: {string.Join(Environment.NewLine, stackTrace!)}");
            await txtWriter.WriteLineAsync("---------------------------------------------------------------------------------------------");
        }

        public async Task LogCustomAsync(string message)
        {
            var logFile = GetLogFilePath();
            EnsureDirectoryExists(LogDirectory);

            if (!await _logSemaphore.WaitAsync(MaxWaitTimeMs))
            {
                _logger.LogWarning("LogService timeout (LogCustomAsync): could not acquire file lock.");
                return;
            }
            try
            {
                if (!File.Exists(logFile))
                {
                    await using var _ = File.Create(logFile);
                }
                await using var txtWriter = new StreamWriter(logFile, append: true);
                var userId = GetUserIdFromClaims(_httpContextAccessor.HttpContext?.User!);

                await txtWriter.WriteLineAsync($"\r\nLog Entry For Web Sln: {DateTime.Now:D} {DateTime.Now:T}");
                await txtWriter.WriteLineAsync($" :[LoggedInUser]: {userId}");
                await txtWriter.WriteLineAsync(" :");
                await txtWriter.WriteLineAsync($" :{message}");
                await txtWriter.WriteLineAsync("---------------------------------------------------------------------------------------------");
            }
            finally
            {
                _logSemaphore.Release();
            }

        }

        public async Task ReportErrorLogAsync(string responseContent, HttpResponseHeaders headers, string requestUrl)
        {
            var logFile = GetLogFilePath();
            EnsureDirectoryExists(LogDirectory);

            if (!await _logSemaphore.WaitAsync(MaxWaitTimeMs))
            {
                _logger.LogWarning("LogService timeout (LogCustomAsync): could not acquire file lock.");
                return;
            }
            try
            {
                if (!File.Exists(logFile))
                {
                    await using var _ = File.Create(logFile);
                }


                var userId = GetUserIdFromClaims(_httpContextAccessor.HttpContext?.User!);

                await using var txtWriter = new StreamWriter(logFile, append: true);
                await txtWriter.WriteLineAsync($"\r\nLog Entry For Web Sln: {DateTime.Now:D} {DateTime.Now:T}");
                await txtWriter.WriteLineAsync($":[LoggedInUser]: {userId}");
                await txtWriter.WriteLineAsync($"Request URL: {requestUrl}");
                await txtWriter.WriteLineAsync("Response Headers:");

                foreach (var header in headers)
                {
                    await txtWriter.WriteLineAsync($"  {header.Key}: {string.Join("; ", header.Value)}");
                }

                await txtWriter.WriteLineAsync("Response Content:");
                await txtWriter.WriteLineAsync(responseContent);
                await txtWriter.WriteLineAsync("---------------------------------------------------------------------------------------------");
            }
            finally
            {
                _logSemaphore.Release();
            }
        }

        private void EnsureDirectoryExists(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }

        private string GetLogFilePath()
        {
            return Path.Combine(LogDirectory, $"Log-{DateTime.Now:MM-dd-yyyy}.txt");
        }

        private long GetUserIdFromClaims(ClaimsPrincipal user)
        {
            var userIdClaim = user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            return long.TryParse(userIdClaim, out var id) ? id : 0;
        }

    }

}
