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
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace BridgeWeb.Infrastructure.Service
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        private IHttpContextAccessor _contextAccessor;
        private readonly IBaseService _baseService;
        private readonly IOptions<QBOSettings> _options;
        private readonly IOptions<SSRSSettings> _settings;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public IUserRepository User { get; private set; }
        public IUserPageVisitedLastService UserPageVisitedLastService { get; private set; }
        public ISystemAdminRepository SystemadminRepo { get; private set; }
        public IVendorRepository VendorRepo { get; private set; }
        public IProjectService ProjectService { get; private set; }

        public IBudgetService BudgetService { get; private set; }
        public IQuickBookService QuickBookService { get; private set; }

        public IPurchaseOrderService PurchaseOrderService { get; private set; }

        public IInvoiceService InvoiceService { get; private set; }
        public ISSRSReportService SSRSReportService { get; private set; }
        public IReportService ReportService { get; private set; }

        public IExpediteService ExpediteService { get; private set; }
        public IDashBoardService DashBoardService { get; private set; }

        public IExcelPostProcessor ExcelPostProcessor { get; private set; }

        public UnitOfWork(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor contextAccessor, IBaseService baseService, IOptions<QBOSettings> options, IOptions<SSRSSettings> settings, ILogService logService, IWebHostEnvironment webHostEnvironment)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
            _contextAccessor = contextAccessor;
            _baseService = baseService;
            _options = options;
            _settings = settings;
            _logService = logService;
            _webHostEnvironment = webHostEnvironment;

            User = new UserRepository(_clientFactory, _configuration, _baseService, _contextAccessor);

            UserPageVisitedLastService = new UserPageVisitedLastService(_clientFactory, _configuration, _baseService, _contextAccessor);
            SystemadminRepo = new SystemAdminService(_clientFactory, _configuration, _baseService, _contextAccessor);
            VendorRepo = new VendorService(_clientFactory, _configuration, _baseService, _contextAccessor);
            ProjectService = new ProjectService(_clientFactory, _configuration, _baseService, _contextAccessor);
            BudgetService = new BudgetService(_configuration, _baseService, _contextAccessor);
            QuickBookService = new QuickBookService(_options, _baseService, _configuration, _logService);
            PurchaseOrderService = new PurchaseOrderService(_configuration, _baseService, _contextAccessor);
            InvoiceService = new InvoiceService(_clientFactory, _baseService, _contextAccessor, _configuration);
            SSRSReportService = new SsrsReportService(_clientFactory, _settings, _logService);
            ReportService = new ReportService(_configuration, _baseService, _contextAccessor);
            ExpediteService = new ExpediteService(_configuration, _contextAccessor, _baseService);
            DashBoardService = new DashBoardService(_configuration, _baseService, _contextAccessor);
            ExcelPostProcessor = new ExcelPostProcessor(_webHostEnvironment);
        }
    }
}
