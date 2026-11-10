using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Channels;

namespace BridgeWeb.Infrastructure.Service;

public record PageVisitEntry(long UserId, string Url, DateTime Timestamp);

public class PageVisitLogger : BackgroundService
{
    private readonly Channel<PageVisitEntry> _channel;
    private readonly string _logDirectory;

    // static accessor so filter can enqueue without DI
    private static PageVisitLogger? _instance;
    public static void Enqueue(PageVisitEntry entry) =>
        _instance?._channel.Writer.TryWrite(entry);

    public PageVisitLogger(IConfiguration configuration)
    {
        _logDirectory = configuration.GetValue<string>("UserVisitedLogSettings:UserPageVisitedDirectory")
            ?? @"C:\Logs\UserPageVisited";

        _channel = Channel.CreateBounded<PageVisitEntry>(
            new BoundedChannelOptions(2000)
            {
                FullMode = BoundedChannelFullMode.DropOldest
            });
        _instance = this;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Directory.CreateDirectory(_logDirectory);

        await foreach (var entry in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                var path = Path.Combine(_logDirectory, $"{entry.UserId}.csv");
                await File.AppendAllTextAsync(
                    path,
                    $"{entry.Url},{entry.Timestamp:yyyy-MM-dd HH:mm:ss}{Environment.NewLine}",
                    stoppingToken);
            }
            catch { }
        }
    }
}
