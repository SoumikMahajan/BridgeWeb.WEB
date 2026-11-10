using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Expedite;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Expedite;
using BridgeWeb.Domain.Utility;
using Intuit.Ipp.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;

namespace BridgeWeb.Infrastructure.Service.Expedite
{
    public class ExpediteService : IExpediteService
    {
        private readonly string _bridgeUrl;
        private readonly IBaseService _baseService;

        public ExpediteService(IConfiguration configuration, IHttpContextAccessor contextAccessor, IBaseService baseService)
        {
            _baseService = baseService;
            var hostName = contextAccessor.HttpContext?.Request.Host.Host
               ?? throw new InvalidOperationException("HttpContext or Host is not available");

            var configKey = hostName.Contains("localhost")
                            ? "ServiceUrls:BridgeAPI"
                            : "LiveServerServiceUrls:BridgeAPI";

            _bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        public async Task<T> GetAllPoItemStatus<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-Po-Item-Status"
            });
        }

        public async Task<T> GetHiddenField<T>(long UserId)
        {
            int SecurityID = 18;
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-Hidden-Values/{UserId}/{SecurityID}"
            });
        }

        public async Task<T> LoadVendorPart<T>(long UserId, string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-VendorList-By-ProjectId/{UserId}/{ProjectId}"
            });
        }
        
        public async Task<T> LoadVendorPartWithQuery<T>(long UserId, string ProjectId, string Query, string Flag)
        {
            var dto = new
            {
                UserId,
                ProjectId,
                Query,
                Flag
            };
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{_bridgeUrl}/api/Expedite/Get-Vendor-Part",
                Data = dto
            });
        }

        public async Task<T> PurchaseOrderByContactId<T>(long UserId, string VendorId, string ProjectId, string Query)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-Purchase-Order-By-ContactId/{UserId}/{VendorId}/{ProjectId}"
            });
        }

        public async Task<T> PurchaseOrderLineItemsByPurchaseOrderId<T>(string PurchaseOrderId, string Query)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-Purchase-Order-LineItems-By-Purchase-OrderId/{PurchaseOrderId}"
            });
        }

        public async Task<T> LoadBudgetSectionPart<T>(string ProjectId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-All-Sections-By-ProjectId/{ProjectId}"
            });
        }

        public async Task<T> GetAllBudgetItemsByBudgetSectionId<T>(long BudgetSectionId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Get-All-Budget-Items-By-BudgetSectionId/{BudgetSectionId}"
            });
        }

        public async Task<T> MakeDropdown<T>(long UserId, string Mode, long PID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/Make-Dropdown/{UserId}/{PID}/{Mode}"
            });
        }
        public async Task<T> CheckFrieght<T>(string POLIID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/check-frieght/{POLIID}"
            });
        }

        public async Task<T> GetUserEditPermission<T>(string UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/get-user-edit-permission/{UserId}"
            });
        }
        public async Task<T> AddOnlyPOExpediteNote<T>(SavePOExpediteNoteExpPageDTO savePOExpediteNoteExpPageDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data= savePOExpediteNoteExpPageDTO,
                Url = $"{_bridgeUrl}/api/Expedite/save-po-exp-note-in-exp"
            });
        }

        public async Task<T> GetPoLineitemStatusModified<T>(string PolineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/get-poline-item-status-modified/{PolineItemId}"
            });
        }

        public async Task<T> GetAllProjectListForExepediteAsync<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/get-all-project-list-for-exepedite/{UserId}"
            });
        }

        public async Task<T> GetTotalAndReceivedQtyOfExpediteNoteByLineItemIdAsync<T>(long LineItemId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{_bridgeUrl}/api/Expedite/get-total-and-received-qty-expeditenote-by-lineItemid/{LineItemId}"
            });
        }

    }
}
