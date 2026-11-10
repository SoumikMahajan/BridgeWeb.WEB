using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.SystemAdmin
{
    public interface IUserPageVisitedLastService
    {
        Task<T> GetAllAsync<T>();
        Task<T> GetAsync<T>(int id);
        Task<T> CreateAsync<T>(UserPageVisitedLastCreateDTO model);
    }
}
