using BridgeWeb.Infrastructure.Service;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Net;
using System.Security.Authentication;

namespace BridgeWeb.WEB.Extensions
{
    public static class ExceptionHandlerExtensions
    {
        public static void ConfigureGlobalExceptionHandler(this WebApplication app)
        {
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    var exception = context.Features.Get<IExceptionHandlerPathFeature>()?.Error;

                    if (exception != null)
                    {
                        var helper = context.RequestServices.GetRequiredService<ExceptionHandlingHelper>();
                        await helper.HandleExceptionAsync(context, exception);
                    }
                });
            });
        }
    }
}
