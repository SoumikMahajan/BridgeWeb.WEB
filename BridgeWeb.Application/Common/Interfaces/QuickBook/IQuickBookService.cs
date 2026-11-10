using BridgeWeb.Domain.Model.Dto.QuickBook;
using Intuit.Ipp.OAuth2PlatformClient;

namespace BridgeWeb.Application.Common.Interfaces.QuickBook
{
    public interface IQuickBookService
    {
        Task<T> DeleteQBOPayments<T>(string PaymentId);
        Task<DiscoveryResponse> DiscoveryResponseAsync();
        Task<string> GenerateCSRFTokenAsync();
        Task<T> GetAccountDetailsByAccountId<T>(string accountId);
        Task<string> GetAuthorizeURLAsync();
        Task<TokenResponse> GetBearerTokenAsync(string Code);
        Task<T> GetCompanyId<T>();
        Task<T> GetQBOPaymentsByPaymentId<T>(string paymentId);
        Task<T> GetToken<T>();
        Task<TokenResponse> RefreshTokenAsync(string RefreshToken);
        Task<T> SaveCompanyId<T>(string CompanyId);
        Task<T> SaveToken<T>(QuickBookTokenDto tokenDto);
        Task<T> UpdateAccountsQBS<T>(List<Account> accounts);
        Task<T> UpdatePaymentForQBOSend<T>(QBPPaymentRequestDto updateModel);
        Task<T> UpdateQBOPayments<T>(string PaymentId, string CheckNumber, string PrintStatus);
    }
}
