using BridgeWeb.Domain.Model;

namespace BridgeWeb.Application.Common.Interfaces
{
    public interface IBaseService
    {
        APIResponse apiResponse { get; set; }
        Task<T> SendAsync<T>(APIRequest apiRequest, bool withBearer = true);
    }
}
