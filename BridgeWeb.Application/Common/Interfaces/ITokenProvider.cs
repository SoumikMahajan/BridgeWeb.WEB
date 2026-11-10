using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;

namespace BridgeWeb.Application.Common.Interfaces
{
    public interface ITokenProvider
    {
        void SetToken(string AccessTOken);
        TokenDTO? GetToken();
        void ClearToken();
    }
}
