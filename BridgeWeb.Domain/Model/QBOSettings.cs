namespace BridgeWeb.Domain.Model
{
    public class QBOSettings
    {
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public string? RedirectUrl { get; set; }
        public string? QboBaseUrl { get; set; } = string.Empty;
        public string? Environment { get; set; }
        public string? DiscoveryUrl { get; set; }
        public string? AuthorizeUrl { get; set; }
        public string? TokenEndpoint { get; set; }
        public string? RevocationEndpoint { get; set; }
        public string? IssuerEndpoint { get; set; }
        public string? UserInfoEndpoint { get; set; }
    }
}
