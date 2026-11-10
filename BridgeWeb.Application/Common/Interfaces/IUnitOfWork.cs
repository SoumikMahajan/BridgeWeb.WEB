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

namespace BridgeWeb.Application.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository User { get; }
        IBudgetService BudgetService { get; }
        IPurchaseOrderService PurchaseOrderService { get; }
        IInvoiceService InvoiceService { get; }
        IDashBoardService DashBoardService { get; }
        IVendorRepository VendorRepo { get; }
        IProjectService ProjectService { get; }
        ISystemAdminRepository SystemadminRepo { get; }
        IQuickBookService QuickBookService { get; }
        ISSRSReportService SSRSReportService { get; }
        IReportService ReportService { get; }
        IExpediteService ExpediteService { get; }
        IUserPageVisitedLastService UserPageVisitedLastService { get; }
        IExcelPostProcessor ExcelPostProcessor { get; }
    }
}
