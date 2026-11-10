using static BridgeWeb.Domain.Utility.SD;

namespace BridgeWeb.Domain.Model
{
    public class APIRequest
    {
        public ApiType ApiType { get; set; } = ApiType.GET;
        public string? Url { get; set; }
        public object? Data { get; set; }
        public string? Token { get; set; }

        public ContentType ContentType { get; set; } = ContentType.Json;
    }
}
