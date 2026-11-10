using BridgeWeb.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BridgeWeb.Infrastructure.Service
{
    public class ReportWarmUpService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _warmUpUrl;

        public ReportWarmUpService(IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _httpClientFactory = httpClientFactory;
            var baseUrl = configuration["WebUrl:BaseUrl"];
            _warmUpUrl = $"{baseUrl}/Reports/WarmUpReport";
        }

        #region :: This process only for report warm up after application start and every 24 hours continuously while the app runs

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Startup delay
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);

            // Run immediately first time
            await ExecuteWarmUp(stoppingToken);

            // Repeat every 24 hours
            using var timer = new PeriodicTimer(TimeSpan.FromHours(24));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await ExecuteWarmUp(stoppingToken);
            }  
        }

        private async Task ExecuteWarmUp(CancellationToken stoppingToken)
        {
            try
            {
                await WriteLogAsync($"[WarmUp] Triggering report warm-up at - {_warmUpUrl}");

                var client = _httpClientFactory.CreateClient("WarmUpClient");

                var response = await client.GetAsync(_warmUpUrl, stoppingToken);

                if (response.IsSuccessStatusCode)
                {
                    await WriteLogAsync("[WarmUp] Report warm-up completed successfully");
                }
                else
                {
                    await WriteLogAsync($"[WarmUp] Failed with status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                await WriteLogAsync($"[WarmUp] Error during warm-up - {ex}");
            }
        }

        private async Task WriteLogAsync(string message)
        {
            using var scope = _serviceProvider.CreateScope();

            var logService =
                scope.ServiceProvider.GetRequiredService<ILogService>();

            await logService.LogCustomAsync(message);
        }

        #endregion


        #region :: This process only for first time project cold start

        //public Task StartAsync(CancellationToken cancellationToken)
        //{
        //    _ = Task.Run(async () =>
        //    {
        //        await Task.Delay(5000, cancellationToken);

        //        try
        //        {
        //            //var addresses = _server.Features.Get<IServerAddressesFeature>()?.Addresses;
        //            //var baseUrl = addresses?.FirstOrDefault() ?? "https://localhost:7180";

        //            using var client = new HttpClient();
        //            client.Timeout = TimeSpan.FromMinutes(5);

        //            var baseUrl = _configuration["WebUrl:BaseUrl"];
        //            var warmUpUrl = $"{baseUrl}/Reports/WarmUpReport";

        //            // Create a scope to resolve scoped services
        //            using (var scope = _serviceProvider.CreateScope())
        //            {
        //                var logService = scope.ServiceProvider.GetRequiredService<LogService>();
        //                await logService.LogCustomAsync($"[WarmUp] Triggering report warm-up at - {warmUpUrl}");
        //            }

        //            var response = await client.GetAsync(warmUpUrl, cancellationToken);

        //            using (var scope = _serviceProvider.CreateScope())
        //            {
        //                var logService = scope.ServiceProvider.GetRequiredService<LogService>();

        //                if (response.IsSuccessStatusCode)
        //                {
        //                    await logService.LogCustomAsync("[WarmUp] Report warm-up completed successfully");
        //                }
        //                else
        //                {
        //                    await logService.LogCustomAsync($"[WarmUp] Failed with status code: {response.StatusCode}");
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            using var scope = _serviceProvider.CreateScope();
        //            var logService = scope.ServiceProvider.GetRequiredService<LogService>();
        //            await logService.LogCustomAsync($"[WarmUp] Error during warm-up - {ex}");
        //        }
        //    }, cancellationToken);

        //    return Task.CompletedTask;
        //}

        //public Task StopAsync(CancellationToken cancellationToken)
        //{
        //    return Task.CompletedTask;
        //}

        #endregion
    }
}
