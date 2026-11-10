using BridgeWeb.Domain.Model;
using Intuit.Ipp.OAuth2PlatformClient;

namespace BridgeWeb.Domain.Utility
{
    public static class OAuthClientProvider
    {
        public static OAuth2Client CreateOAuthClient(QBOSettings _settings)
        {
            var auth2Client = new OAuth2Client(_settings.ClientId,
                                                        _settings.ClientSecret,
                                                        _settings.RedirectUrl,
                                                        _settings.Environment);
            return auth2Client;
        }
    }
}
