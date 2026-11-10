using BridgeWeb.Domain.Model.Dto.OTPDTO;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;

namespace BridgeWeb.Application.Common.Interfaces.SystemAdmin
{
    public interface IUserRepository
    {
        Task<T> LoginAsync<T>(LoginRequestDTO objToCreate);
        Task<T> GetAllAsync<T>();
        Task<T> GetAsync<T>(int id);
        Task<T> CreateAsync<T>(SystemUsersCreateDTO systemusersCreateDTO);
        Task<T> UpdateAsync<T>(SystemUsersUpdateDto systemusersUpdateDTO);
        Task<T> DeleteAsync<T>(int id);
        Task<T> GetUserLastVisitedPageUrl<T>(long userId);
        Task<T> PageAuthorizationAsync<T>(long userId, string role);
        Task<T> GenerateNewTokenAsync<T>(long userId);
        Task<T> ForgetPasswordMailSendasync<T>(ForgetPasswordDto forgetPasswordDto);
        Task<T> ResetPasswordAsync<T>(ResetPasswordDto resetPasswordDto);
        Task<T> UserActivation<T>(string Token);
        Task<T> MenuBuildAsync<T>(long UserId);
        Task<T> GetUserPreference<T>(long userId);
        Task<T> UpdateUserPreferenceAsync<T>(List<UserPreferenceDto> preference, long UserId);
        Task<T> SendOTPasync<T>(OTPRequestDTO oTPRequestDTO);
        Task<T> VerifyOtpAsync<T>(OTPRequestDTO oTPRequestDTO);
    }
}
