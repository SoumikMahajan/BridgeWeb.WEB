using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.QuickBook;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.QuickBook;
using BridgeWeb.Domain.Utility;
using Intuit.Ipp.OAuth2PlatformClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace BridgeWeb.Infrastructure.Service.QuickBook
{
    public class QuickBookService : IQuickBookService
    {
        private readonly QBOSettings _settings;
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;
        private readonly ILogService _logService;

        public QuickBookService(IOptions<QBOSettings> options, IBaseService baseService, IConfiguration configuration, ILogService logService)
        {
            _settings = options.Value;
            _baseService = baseService;
            _bridgeUrl = configuration.GetValue<string>("ServiceUrls:BridgeAPI") ?? string.Empty;
            _logService = logService;
        }

        public async Task<TokenResponse> GetBearerTokenAsync(string Code)
        {
            try
            {
                await _logService.LogCustomAsync($"GetBearerTokenAsync called with Code: {Code}");
                var authClient = OAuthClientProvider.CreateOAuthClient(_settings);
                var tokenResponse = await authClient.GetBearerTokenAsync(Code);
                return tokenResponse;
            }
            catch (Exception ex)
            {
                await _logService.LogExceptionErrorAsync(ex);
                throw;
            }
            
        }

        public async Task<TokenResponse> RefreshTokenAsync(string RefreshToken)
        {
            var authClient = OAuthClientProvider.CreateOAuthClient(_settings);
            var tokenResponse = await authClient.RefreshTokenAsync(RefreshToken);
            return tokenResponse;
        }

        public Task<DiscoveryResponse> DiscoveryResponseAsync()
        {
            var authClient = OAuthClientProvider.CreateOAuthClient(_settings);
            var discoveryResponse = authClient.GetDiscoveryDoc();
            return Task.FromResult(discoveryResponse);
        }

        public Task<string> GenerateCSRFTokenAsync()
        {
            var authClient = OAuthClientProvider.CreateOAuthClient(_settings);
            var CSRFTokenResponse = authClient.GenerateCSRFToken();
            return Task.FromResult(CSRFTokenResponse);
        }

        public Task<string> GetAuthorizeURLAsync()
        {
            var scope = new List<OidcScopes>
            {
                OidcScopes.Accounting,
                OidcScopes.OpenId,
                OidcScopes.Address,
                OidcScopes.Email,
                OidcScopes.Phone,
                OidcScopes.Profile
            };
            var authClient = OAuthClientProvider.CreateOAuthClient(_settings);
            var authorizeUrl = authClient.GetAuthorizationURL(scope);
            return Task.FromResult(authorizeUrl);
        }

        public async Task<T> SaveToken<T>(QuickBookTokenDto tokenDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = tokenDto,
                Url = _bridgeUrl + "/api/QuickBookAPI/save-token",
            });
        }

        public async Task<T> GetToken<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + "/api/QuickBookAPI/get-token",
            });
        }

        public async Task<T> UpdateAccountsQBS<T>(List<Account> accounts)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Data = accounts,
                Url = _bridgeUrl + "/api/QuickBookAPI/Update-Accounts-QBS",
            });
        }

        public async Task<T> GetAccountDetailsByAccountId<T>(string accountId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Get-QBS-Account-Details-By-AccountId/{accountId}",
            });
        }

        public async Task<T> SaveCompanyId<T>(string CompanyId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Save-CompanyId/{CompanyId}",
            });
        }

        public async Task<T> GetCompanyId<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Get-CompanyId",
            });
        }

        public async Task<T> GetQBOPaymentsByPaymentId<T>(string paymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Get-QBO-Payments-By-PaymentId/{paymentId}",
            });
        }

        public async Task<T> DeleteQBOPayments<T>(string PaymentId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Delete-QBO-Payments/{PaymentId}",
            });
        }

        public async Task<T> UpdateQBOPayments<T>(string PaymentId, string CheckNumber, string PrintStatus)
        {
            var dto = new
            {
                PaymentId = PaymentId,
                CheckNumber = CheckNumber,
                PrintStatus = PrintStatus
            };

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Update-QBO-Payments",
                Data = dto,
            });
        }

        public async Task<T> UpdatePaymentForQBOSend<T>(QBPPaymentRequestDto updateModel)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.PUT,
                Url = _bridgeUrl + $"/api/QuickBookAPI/Update-Payments-For-QBO-send",
                Data = updateModel,
            });
        }
    }
}