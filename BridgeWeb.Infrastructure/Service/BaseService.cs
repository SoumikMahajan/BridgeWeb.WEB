using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace BridgeWeb.Infrastructure.Service;

public class BaseService : IBaseService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ITokenProvider _tokenProvider;
    private readonly IApiMessageRequestBuilder _apiMessageRequestBuilder;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _bridgeUrl;

    public APIResponse apiResponse { get; set; }


    public BaseService(
        IHttpClientFactory httpClientFactory,
        ITokenProvider tokenProvider,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor,
        IApiMessageRequestBuilder apiMessageRequestBuilder)
    {
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _tokenProvider = tokenProvider ?? throw new ArgumentNullException(nameof(tokenProvider));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _apiMessageRequestBuilder = apiMessageRequestBuilder ?? throw new ArgumentNullException(nameof(apiMessageRequestBuilder));

        apiResponse = new();

        var httpContext = _httpContextAccessor.HttpContext
            ?? throw new InvalidOperationException("HttpContext is not available");

        var hostName = httpContext.Request.Host.Host;
        var configKey = hostName.Contains("localhost")
            ? "ServiceUrls:BridgeAPI"
            : "LiveServerServiceUrls:BridgeAPI";

        _bridgeUrl = configuration.GetValue<string>(configKey)
            ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing");
    }

    public async Task<T> SendAsync<T>(APIRequest apiRequest, bool withBearer = true)
    {
        ArgumentNullException.ThrowIfNull(apiRequest);
        try
        {
            var client = _httpClientFactory.CreateClient("NewBridgeAPI");

            using var response = await SendWithAccessTokenAsync(client, apiRequest, withBearer);

            var finalApiResponse = new APIResponse { IsSuccess = false };

            try
            {
                switch (response.StatusCode)
                {
                    case HttpStatusCode.NotFound:
                        var contentNf = await response.Content.ReadAsStringAsync();
                        finalApiResponse = string.IsNullOrWhiteSpace(contentNf)
                            ? new APIResponse { IsSuccess = false, ErrorMessages = new List<string> { "Not Found" } }
                            : JsonConvert.DeserializeObject<APIResponse>(contentNf) ?? new APIResponse { IsSuccess = false };
                        break;

                    case HttpStatusCode.Forbidden:
                        finalApiResponse.ErrorMessages = new List<string> { "Access Denied" };
                        break;

                    case HttpStatusCode.Unauthorized:
                        finalApiResponse.ErrorMessages = new List<string> { "Unauthorized" };
                        break;

                    //case HttpStatusCode.InternalServerError:
                    //    finalApiResponse.ErrorMessages = new List<string> { "Internal Server Error" };
                    //    break;

                    case HttpStatusCode.UnsupportedMediaType:
                        finalApiResponse.ErrorMessages = new List<string> { "Unsupported Media Type" };
                        break;

                    default:
                        var apiContent = await response.Content.ReadAsStringAsync();

                        finalApiResponse = JsonConvert.DeserializeObject<APIResponse>(apiContent) ?? new APIResponse { IsSuccess = false };
                        break;
                }
            }
            catch (Exception ex)
            {
                finalApiResponse.ErrorMessages = new List<string> { "Error Encountered", ex.Message };
            }

            if (finalApiResponse is T directResult)
                return directResult;

            if (finalApiResponse.Result is null)
                return Activator.CreateInstance<T>()!;

            if (finalApiResponse.Result is JToken jToken)
                return jToken.ToObject<T>() ?? Activator.CreateInstance<T>()!;

            if (finalApiResponse.Result is T primitiveResult)
                return primitiveResult;

            var fallbackJson = JsonConvert.SerializeObject(finalApiResponse.Result);
            return JsonConvert.DeserializeObject<T>(fallbackJson) ?? Activator.CreateInstance<T>()!;

        }
        catch (AuthException) { throw; }
        catch (Exception ex)
        {
            var errorResponse = new APIResponse
            {
                ErrorMessages = new List<string> { ex.Message },
                IsSuccess = false
            };

            if (errorResponse is T fallback)
                return fallback;

            return Activator.CreateInstance<T>()!;
        }
    }

    private async Task<HttpResponseMessage> SendWithAccessTokenAsync(HttpClient httpClient, APIRequest apiRequest, bool withBearer = true)
    {
        string? accessToken = null;

        if (withBearer)
        {
            var tokenDto = _tokenProvider.GetToken();
            accessToken = tokenDto?.AccessToken;
        }

        try
        {
            using var request = CreateRequest(apiRequest, accessToken);

            var response = await httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
                return response;

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                response.Dispose();

                var newAccessToken = await RefreshTokenAsync(httpClient);

                using var retryRequest = CreateRequest(apiRequest, newAccessToken);

                return await httpClient.SendAsync(retryRequest);
            }

            return response;
        }
        catch (AuthException)
        {
            throw;
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
        {
            var newAccessToken = await RefreshTokenAsync(httpClient);

            using var retryRequest = CreateRequest(apiRequest, newAccessToken);

            return await httpClient.SendAsync(retryRequest);
        }
    }

    private HttpRequestMessage CreateRequest(APIRequest apiRequest, string? accessToken = null)
    {
        var request = _apiMessageRequestBuilder.Build(apiRequest);

        if (!string.IsNullOrWhiteSpace(accessToken))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        return request;
    }

    private async Task<string> RefreshTokenAsync(HttpClient httpClient)
    {
        var httpContext = _httpContextAccessor.HttpContext;

        if (httpContext is null || httpContext.User.Identity?.IsAuthenticated != true)
        {
            if (httpContext is not null)
            {
                await httpContext.SignOutAsync();
            }
            _tokenProvider.ClearToken();
            throw new AuthException();
        }

        var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
        {
            await httpContext.SignOutAsync();
            _tokenProvider.ClearToken();
            throw new AuthException();
        }

        using var refreshRequest = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri($"{_bridgeUrl}/api/HomeAPI/generate-new-token/{userId}")
        };

        refreshRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await httpClient.SendAsync(refreshRequest);

        var content = await response.Content.ReadAsStringAsync();

        var apiResponse = JsonConvert.DeserializeObject<APIResponse>(content);

        if (apiResponse?.IsSuccess != true || apiResponse.Result is null)
        {
            await httpContext.SignOutAsync();
            _tokenProvider.ClearToken();
            throw new AuthException();
        }


        var model = JsonConvert.DeserializeObject<LoginResponseDTO>(Convert.ToString(apiResponse.Result)!);

        if (string.IsNullOrWhiteSpace(model?.AccessToken))
        {
            await httpContext.SignOutAsync();
            _tokenProvider.ClearToken();
            throw new AuthException();
        }

        // Sign in with new token
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(model.AccessToken);

        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
        identity.AddClaim(new Claim(ClaimTypes.Name,
            jwt.Claims.FirstOrDefault(u => u.Type == "unique_name")?.Value ?? string.Empty));
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier,
            jwt.Claims.FirstOrDefault(u => u.Type == "nameid")?.Value ?? string.Empty));
        identity.AddClaim(new Claim(ClaimTypes.Role,
            jwt.Claims.FirstOrDefault(u => u.Type == "role")?.Value ?? string.Empty));
        identity.AddClaim(new Claim("roleId",
            jwt.Claims.FirstOrDefault(u => u.Type == "roleId")?.Value ?? string.Empty));

        var principal = new ClaimsPrincipal(identity);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(6)
        };

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            authProperties);

        _tokenProvider.SetToken(model.AccessToken);
        return model.AccessToken;
    }
}

//public class BaseService : IBaseService
//{
//    private readonly IHttpClientFactory _httpClientFactory;
//    private readonly ITokenProvider _tokenProvider;
//    private readonly IApiMessageRequestBuilder _apiMessageRequestBuilder;
//    private readonly IHttpContextAccessor _httpContextAccessor;
//    private readonly string _bridgeUrl;

//    public APIResponse apiResponse { get; set; }


//    public BaseService(
//        IHttpClientFactory httpClientFactory,
//        ITokenProvider tokenProvider,
//        IConfiguration configuration,
//        IHttpContextAccessor httpContextAccessor,
//        IApiMessageRequestBuilder apiMessageRequestBuilder)
//    {
//        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
//        _tokenProvider = tokenProvider ?? throw new ArgumentNullException(nameof(tokenProvider));
//        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
//        _apiMessageRequestBuilder = apiMessageRequestBuilder ?? throw new ArgumentNullException(nameof(apiMessageRequestBuilder));

//        apiResponse = new();

//        var httpContext = _httpContextAccessor.HttpContext
//            ?? throw new InvalidOperationException("HttpContext is not available");

//        var hostName = httpContext.Request.Host.Host;
//        var configKey = hostName.Contains("localhost")
//            ? "ServiceUrls:BridgeAPI"
//            : "LiveServerServiceUrls:BridgeAPI";

//        _bridgeUrl = configuration.GetValue<string>(configKey)
//            ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing");
//    }

//    public async Task<T> SendAsync<T>(APIRequest apiRequest, bool withBearer = true)
//    {
//        ArgumentNullException.ThrowIfNull(apiRequest);
//        try
//        {
//            var client = _httpClientFactory.CreateClient("NewBridgeAPI");
//            var messageFactory = () => _apiMessageRequestBuilder.Build(apiRequest);

//            var httpResponseMessage = await SendWithAccessTokenAsync(client, messageFactory, withBearer);

//            var finalApiResponse = new APIResponse { IsSuccess = false };

//            try
//            {
//                switch (httpResponseMessage.StatusCode)
//                {
//                    case HttpStatusCode.NotFound:
//                        var contentNf = await httpResponseMessage.Content.ReadAsStringAsync();
//                        finalApiResponse = string.IsNullOrWhiteSpace(contentNf)
//                            ? new APIResponse { IsSuccess = false, ErrorMessages = new List<string> { "Not Found" } }
//                            : JsonConvert.DeserializeObject<APIResponse>(contentNf) ?? new APIResponse { IsSuccess = false };
//                        break;

//                    case HttpStatusCode.Forbidden:
//                        finalApiResponse.ErrorMessages = new List<string> { "Access Denied" };
//                        break;

//                    case HttpStatusCode.Unauthorized:
//                        finalApiResponse.ErrorMessages = new List<string> { "Unauthorized" };
//                        break;

//                    case HttpStatusCode.InternalServerError:
//                        finalApiResponse.ErrorMessages = new List<string> { "Internal Server Error" };
//                        break;

//                    case HttpStatusCode.UnsupportedMediaType:
//                        finalApiResponse.ErrorMessages = new List<string> { "Unsupported Media Type" };
//                        break;

//                    default:
//                        var apiContent = await httpResponseMessage.Content.ReadAsStringAsync();
//                        finalApiResponse = JsonConvert.DeserializeObject<APIResponse>(apiContent) ?? new APIResponse { IsSuccess = false };
//                        finalApiResponse.IsSuccess = true;
//                        break;
//                        //finalApiResponse.IsSuccess = true;
//                        //finalApiResponse = JsonConvert.DeserializeObject<APIResponse>(apiContent) ?? new APIResponse { IsSuccess = false };
//                        //break;
//                }
//            }
//            catch (Exception ex)
//            {
//                finalApiResponse.ErrorMessages = new List<string> { "Error Encountered", ex.Message };
//            }

//            if (finalApiResponse is T result)
//                return result;
//            var token = JToken.FromObject(finalApiResponse.Result ?? new object());
//            return token.ToObject<T>() ?? Activator.CreateInstance<T>()!;

//            //var serialized = JsonConvert.SerializeObject(finalApiResponse);
//            //var returnObj = JsonConvert.DeserializeObject<T>(serialized);
//            //return returnObj ?? Activator.CreateInstance<T>();


//        }
//        catch (AuthException){ throw; }
//        catch (Exception ex)
//        {
//            var errorResponse = new APIResponse
//            {
//                ErrorMessages = new List<string> { ex.Message },
//                IsSuccess = false
//            };

//            if (errorResponse is T fallback)
//                return fallback;

//            return Activator.CreateInstance<T>()!;

//            //var serialized = JsonConvert.SerializeObject(dto);
//            //var response = JsonConvert.DeserializeObject<T>(serialized);
//            //return response ?? Activator.CreateInstance<T>();
//        }
//    }

//    private async Task<HttpResponseMessage> SendWithAccessTokenAsync(
//        HttpClient httpClient,
//        Func<HttpRequestMessage> httpRequestMessageFactory,
//        bool withBearer = true)
//    {
//        if (!withBearer)
//        {
//            return await httpClient.SendAsync(httpRequestMessageFactory());
//        }

//        var tokenDto = _tokenProvider.GetToken();
//        if (tokenDto?.AccessToken is not null)
//        {
//            httpClient.DefaultRequestHeaders.Authorization =
//                new AuthenticationHeaderValue("Bearer", tokenDto.AccessToken);
//        }

//        try
//        {
//            var response = await httpClient.SendAsync(httpRequestMessageFactory());

//            if (response.IsSuccessStatusCode)
//                return response;

//            if (response.StatusCode == HttpStatusCode.Unauthorized)
//            {
//                await RefreshTokenAndRetry(httpClient);
//                return await httpClient.SendAsync(httpRequestMessageFactory());
//            }

//            return response;
//        }
//        catch (AuthException)
//        {
//            throw;
//        }
//        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
//        {
//            await RefreshTokenAndRetry(httpClient);
//            return await httpClient.SendAsync(httpRequestMessageFactory());
//        }
//    }

//    private async Task RefreshTokenAndRetry(HttpClient httpClient)
//    {
//        var httpContext = _httpContextAccessor.HttpContext;

//        if (httpContext is null || httpContext.User.Identity?.IsAuthenticated != true)
//        {
//            if (httpContext is not null)
//            {
//                await httpContext.SignOutAsync();
//            }
//            _tokenProvider.ClearToken();
//            throw new AuthException();
//        }

//        var userIdClaim = httpContext.User.Claims
//            .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

//        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
//        {
//            await httpContext.SignOutAsync();
//            _tokenProvider.ClearToken();
//            throw new AuthException();
//        }

//        using var message = new HttpRequestMessage
//        {
//            Method = HttpMethod.Get,
//            RequestUri = new Uri($"{_bridgeUrl}/api/HomeAPI/generate-new-token/{userId}")
//        };
//        message.Headers.Add("Accept", "application/json");

//        var response = await httpClient.SendAsync(message);
//        var content = await response.Content.ReadAsStringAsync();
//        var apiResponse = JsonConvert.DeserializeObject<APIResponse>(content);

//        if (apiResponse?.IsSuccess != true || apiResponse.Result is null)
//        {
//            await httpContext.SignOutAsync();
//            _tokenProvider.ClearToken();
//            throw new AuthException();
//        }

//        var model = JsonConvert.DeserializeObject<LoginResponseDTO>(
//            Convert.ToString(apiResponse.Result)!);

//        if (string.IsNullOrEmpty(model?.AccessToken))
//        {
//            await httpContext.SignOutAsync();
//            _tokenProvider.ClearToken();
//            throw new AuthException();
//        }

//        // Sign in with new token
//        var handler = new JwtSecurityTokenHandler();
//        var jwt = handler.ReadJwtToken(model.AccessToken);

//        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
//        identity.AddClaim(new Claim(ClaimTypes.Name,
//            jwt.Claims.FirstOrDefault(u => u.Type == "unique_name")?.Value ?? string.Empty));
//        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier,
//            jwt.Claims.FirstOrDefault(u => u.Type == "nameid")?.Value ?? string.Empty));
//        identity.AddClaim(new Claim(ClaimTypes.Role,
//            jwt.Claims.FirstOrDefault(u => u.Type == "role")?.Value ?? string.Empty));
//        identity.AddClaim(new Claim("roleId",
//            jwt.Claims.FirstOrDefault(u => u.Type == "roleId")?.Value ?? string.Empty));

//        var principal = new ClaimsPrincipal(identity);
//        var authProperties = new AuthenticationProperties
//        {
//            IsPersistent = true,
//            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(6)
//        };

//        await httpContext.SignInAsync(
//            CookieAuthenticationDefaults.AuthenticationScheme,
//            principal,
//            authProperties);

//        _tokenProvider.SetToken(model.AccessToken);
//        httpClient.DefaultRequestHeaders.Authorization =
//            new AuthenticationHeaderValue("Bearer", model.AccessToken);
//    }
//}
