using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Budget;
using BridgeWeb.Application.Common.Interfaces.DashBoard;
using BridgeWeb.Application.Common.Interfaces.Expedite;
using BridgeWeb.Application.Common.Interfaces.Invoice;
using BridgeWeb.Application.Common.Interfaces.Project;
using BridgeWeb.Application.Common.Interfaces.PurchasedOrder;
using BridgeWeb.Application.Common.Interfaces.QuickBook;
using BridgeWeb.Application.Common.Interfaces.Reports;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Application.Common.Interfaces.Vendor;
using BridgeWeb.Domain.Model;
using BridgeWeb.Infrastructure.Service;
using BridgeWeb.Infrastructure.Service.Budget;
using BridgeWeb.Infrastructure.Service.DashBoard;
using BridgeWeb.Infrastructure.Service.Expedite;
using BridgeWeb.Infrastructure.Service.Invoice;
using BridgeWeb.Infrastructure.Service.Project;
using BridgeWeb.Infrastructure.Service.PurchasedOrder;
using BridgeWeb.Infrastructure.Service.QuickBook;
using BridgeWeb.Infrastructure.Service.Reports;
using BridgeWeb.Infrastructure.Service.SystemAdmin;
using BridgeWeb.Infrastructure.Service.Vendor;
using BridgeWeb.WEB.Extensions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using OfficeOpenXml;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Set the EPPlus License Context
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;



// Add services to the container.
builder.Services.AddControllersWithViews(u =>
{
    u.Filters.Add<GlobalExceptionRedirection>();
    u.Filters.Add<MyActionFilterAttribute>();
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 20 * 1024 * 1024; // 20 MB
});



builder.Services
    .AddOptions<QBOSettings>()
    .Bind(builder.Configuration.GetSection("QBOSettings"))
    .Validate(s => !string.IsNullOrWhiteSpace(s.QboBaseUrl),
              "QboBaseUrl must be configured")
    .ValidateOnStart();
builder.Services
    .AddOptions<SSRSSettings>()
    .Bind(builder.Configuration.GetSection("SSRS"))
    .Validate(s => !string.IsNullOrWhiteSpace(s.ReportServerUrl),
              "ReportServerUrl must be configured")
    .ValidateOnStart();

//builder.Services.AddResponseCaching();



//builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient("NewBridgeAPI", client =>
{
    client.Timeout = TimeSpan.FromMinutes(30);
});

builder.Services.AddHttpClient("WarmUpClient", client =>
{
    client.Timeout = TimeSpan.FromMinutes(5);
});

builder.Services.AddHttpClient("SSRSBridgeReport", client =>
{
    client.Timeout = TimeSpan.FromMinutes(10);
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    Credentials = new NetworkCredential(
        builder.Configuration["SSRS:Username"],
        builder.Configuration["SSRS:Password"],
        builder.Configuration["SSRS:Domain"]
    )
});


builder.Services.AddScoped<IBaseService, BaseService>();
builder.Services.AddScoped<ITokenProvider, TokenProvider>();
builder.Services.AddScoped<GlobalExceptionRedirection>();
builder.Services.AddScoped<ExceptionHandlingHelper>();
builder.Services.AddScoped<MyActionFilterAttribute>();
builder.Services.AddSingleton<PageVisitLogger>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<PageVisitLogger>());
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddSingleton<IApiMessageRequestBuilder, ApiMessageRequestBuilder>();
builder.Services.AddScoped<IBudgetService, BudgetService>();
builder.Services.AddScoped<IExpediteService, ExpediteService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<ISystemAdminRepository, SystemAdminService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ISSRSReportService, SsrsReportService>();
builder.Services.AddScoped<IExcelPostProcessor, ExcelPostProcessor>();
builder.Services.AddScoped<IVendorRepository, VendorService>();
builder.Services.AddScoped<IDashBoardService, DashBoardService>();
builder.Services.AddScoped<IUserPageVisitedLastService, UserPageVisitedLastService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IQuickBookService, QuickBookService>();


builder.Services.AddHttpContextAccessor();



builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
              .AddCookie(options =>
              {
                  options.Cookie.Name = "BridgeByTcg";
                  options.Cookie.HttpOnly = true;
                  //options.ExpireTimeSpan = TimeSpan.FromHours(4);
                  options.ExpireTimeSpan = TimeSpan.FromDays(6);
                  options.LoginPath = "/Home/Index";
                  options.AccessDeniedPath = "/Home/UnauthorizedAccess";
                  options.SlidingExpiration = true;

                  options.Events = new CookieAuthenticationEvents
                  {
                      OnRedirectToLogin = context =>
                      {
                          if (context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                          {
                              context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                          }
                          else
                          {
                              context.Response.Redirect(context.RedirectUri);
                          }
                          return Task.CompletedTask;
                      },
                      OnRedirectToAccessDenied = context =>
                      {
                          if (context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                          {
                              context.Response.StatusCode = StatusCodes.Status403Forbidden;
                          }
                          else
                          {
                              context.Response.Redirect(context.RedirectUri);
                          }
                          return Task.CompletedTask;
                      }
                  };
              });

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(4);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHostedService<ReportWarmUpService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.ConfigureGlobalExceptionHandler();

}
else
{
    app.ConfigureGlobalExceptionHandler();
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();


//RouteConfig.RegisterRoutes(app);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
