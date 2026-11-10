using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace BridgeWeb.WEB.Extensions
{
    public class PageAuthorizationFilter : IAsyncActionFilter
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userRole;
        private readonly IUserRepository _userRepository;

        public PageAuthorizationFilter(IHttpContextAccessor httpContextAccessor, string userRole, IUserRepository userRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRole = userRole;
            _userRepository = userRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext Context, ActionExecutionDelegate next)
        {
            var user = Context.HttpContext.User;

            if (!user.Identity?.IsAuthenticated ?? true)
            {
                Context.Result = new RedirectToActionResult("Index", "Home", null);
                return;
            }

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null || !long.TryParse(userIdClaim.Value, out var userId))
            {
                Context.Result = new RedirectToActionResult("UnauthorizedAccess", "Home", null);
                return;
            }

            //var userId = Convert.ToInt64(user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            //userId = 11804;
            var authorize = await _userRepository.PageAuthorizationAsync<APIResponse>(userId, _userRole);

            if (authorize.Result is true)
            {
                await next();
            }
            else
            {
                // Redirect to UnauthorizedAccess page               
                Context.Result = new RedirectToActionResult("UnauthorizedAccess", "Home", null);
            }
        }
    }
}
