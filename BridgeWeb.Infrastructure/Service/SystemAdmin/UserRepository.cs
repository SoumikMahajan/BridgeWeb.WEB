using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.OTPDTO;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BridgeWeb.Infrastructure.Service.SystemAdmin
{
    public class UserRepository : IUserRepository
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;
        public UserRepository(IHttpClientFactory clientFactory, IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            _clientFactory = clientFactory;
            _httpContextAccessor = httpContextAccessor;
            var hostName = _httpContextAccessor.HttpContext?.Request.Host.Host
                ?? throw new InvalidOperationException("HttpContext or Host is not available"); ;

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        public async Task<T> LoginAsync<T>(LoginRequestDTO obj)
        {
            return await _baseService.SendAsync<T>(new APIRequest()
            {
                ApiType = SD.ApiType.POST,
                Data = obj,
                Url = bridgeUrl + "/api/HomeAPI/login"
            }, withBearer: false);
        }

        public async Task<T> GetUserLastVisitedPageUrl<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest()
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/HomeAPI/get-user-lastvisited-pageurl-with-user-details/" + userId
            });
        }

        public async Task<T> PageAuthorizationAsync<T>(long userId, string role)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/HomeAPI/page-authorization/" + userId + "/" + role,
            });
        }
        public async Task<T> GenerateNewTokenAsync<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/HomeAPI/generate-new-token/" + userId,
            }, withBearer: false);
        }

        public Task<T> CreateAsync<T>(SystemUsersCreateDTO systemusersCreateDTO)
        {
            throw new NotImplementedException();
        }

        public Task<T> DeleteAsync<T>(int id)
        {
            throw new NotImplementedException();
        }

        public Task<T> GetAllAsync<T>()
        {
            throw new NotImplementedException();
        }

        public Task<T> GetAsync<T>(int id)
        {
            throw new NotImplementedException();
        }

        public Task<T> UpdateAsync<T>(SystemUsersUpdateDto systemusersUpdateDTO)
        {
            throw new NotImplementedException();
        }

        public async Task<T> ForgetPasswordMailSendasync<T>(ForgetPasswordDto forgetPasswordDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = forgetPasswordDto,
                Url = bridgeUrl + "/api/HomeAPI/Forget-Password-Mail-Send"
            });
        }

        public async Task<T> ResetPasswordAsync<T>(ResetPasswordDto resetPasswordDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = resetPasswordDto,
                Url = bridgeUrl + "/api/HomeAPI/Reset-Password"
            });
        }

        public async Task<T> UserActivation<T>(string Token)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = bridgeUrl + "/api/HomeAPI/User-Activation/" + Token,
            });
        }

        public async Task<T> MenuBuildAsync<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/HomeAPI/menu-build/" + UserId,
            });
        }
        public async Task<T> GetUserPreference<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = bridgeUrl + "/api/HomeAPI/get-user-preferences/" + userId,
            });
        }
        public async Task<T> UpdateUserPreferenceAsync<T>(List<UserPreferenceDto> preference,long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = preference,
                Url = bridgeUrl + "/api/HomeAPI/set-user-preferences/" + UserId,
            });
        }
        public async Task<T> SendOTPasync<T>(OTPRequestDTO oTPRequestDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = oTPRequestDTO,
                Url = bridgeUrl + "/api/HomeAPI/send-otp/",
            });
        }
        public async Task<T> VerifyOtpAsync<T>(OTPRequestDTO oTPRequestDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = oTPRequestDTO,
                Url = bridgeUrl + "/api/HomeAPI/verify-otp/",
            });
        }
    }
}
