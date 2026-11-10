using BridgeWeb.Infrastructure.Service;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace BridgeWeb.WEB.Extensions
{
    public class MyActionFilterAttribute : ActionFilterAttribute
    {
        private readonly IWebHostEnvironment _env;
        public MyActionFilterAttribute(IWebHostEnvironment env)
        {
            _env = env;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                return;
            if (context.HttpContext.Request.Path == "/")
                return;

            try
            {
                var userId = Convert.ToInt64(context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                PageVisitLogger.Enqueue(new PageVisitEntry(userId,context.HttpContext.Request.GetDisplayUrl().ToLower(),DateTime.Now));
            }
            catch (Exception)
            {

                throw;
            }
            
        }
    }
}
