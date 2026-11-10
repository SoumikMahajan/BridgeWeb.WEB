using BridgeWeb.Domain.Model;

namespace BridgeWeb.Application.Common.Interfaces
{
    public interface IApiMessageRequestBuilder
    {
        HttpRequestMessage Build(APIRequest apiRequest);
    }
}
