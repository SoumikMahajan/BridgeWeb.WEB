using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Infrastructure.Service.SystemAdmin
{
    public class UserPageVisitedLastService : IUserPageVisitedLastService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;
        public UserPageVisitedLastService(IHttpClientFactory clientFactory, IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
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

        public Task<T> GetAllAsync<T>()
        {
            throw new NotImplementedException();
        }

        public Task<T> GetAsync<T>(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<T> CreateAsync<T>(UserPageVisitedLastCreateDTO obj)
        {
            return await _baseService.SendAsync<T>(new APIRequest()
            {
                ApiType = SD.ApiType.POST,
                Data = obj,
                Url = bridgeUrl + "/api/HomeAPI/SetUserUrl"
            });
        }
    }
}
