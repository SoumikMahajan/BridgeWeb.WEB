using BridgeWeb.Infrastructure.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Net;
using System.Security.Authentication;

namespace BridgeWeb.WEB.Extensions
{
    public class GlobalExceptionRedirection : IAsyncExceptionFilter
    {
        private readonly ExceptionHandlingHelper _helper;

        public GlobalExceptionRedirection(ExceptionHandlingHelper helper)
        {
            _helper = helper;
        }

        public async Task OnExceptionAsync(ExceptionContext context)
        {
            var exception = context.Exception;

            await _helper.HandleExceptionAsync(context.HttpContext, exception);            

            context.ExceptionHandled = true;
        }
    }
}
