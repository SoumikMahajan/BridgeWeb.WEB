using BridgeWeb.Domain.Model.Dto.Report;

namespace BridgeWeb.Application.Common.Interfaces.Reports;

public interface IExcelPostProcessor
{
    Task ProcessAsync(ExcelPostProcessContextDTO context);
}
