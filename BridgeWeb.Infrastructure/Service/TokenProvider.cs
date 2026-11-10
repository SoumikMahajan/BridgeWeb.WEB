using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;

namespace BridgeWeb.Infrastructure.Service
{
    public class TokenProvider : ITokenProvider
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public TokenProvider(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }
        public void ClearToken()
        {
            _contextAccessor.HttpContext?.Response.Cookies.Delete(SD.AccessToken);
        }

        public TokenDTO? GetToken()
        {

            var context = _contextAccessor.HttpContext;
            if (context is null)
                return null;

            if (context.Items.TryGetValue("AccessToken", out var itemToken) && itemToken is string inMemoryToken && !string.IsNullOrWhiteSpace(inMemoryToken))
            {
                return new TokenDTO { AccessToken = inMemoryToken };
            }

            if (context.Request.Cookies.TryGetValue(SD.AccessToken, out var accessToken) && !string.IsNullOrWhiteSpace(accessToken))
            {
                return new TokenDTO { AccessToken = accessToken };
            }

            return null;            
        }

        public void SetToken(string AccessToken)
        {
            if (string.IsNullOrWhiteSpace(AccessToken))
                return;

            var context = _contextAccessor.HttpContext;
            if (context is null)
                return;

            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(1),
                HttpOnly = true
                //Secure = true,
                //SameSite = SameSiteMode.Strict
            };

            context.Response.Cookies.Append(SD.AccessToken, AccessToken, cookieOptions);
            context.Items["AccessToken"] = AccessToken;
        }
    }
}
