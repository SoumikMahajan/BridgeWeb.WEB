namespace BridgeWeb.Domain.Model.Dto.Report;

public class ExcelPostProcessContextDTO
{
    public string FilePath { get; set; } = string.Empty;
    public string ReportType { get; set; } = string.Empty;
    public Dictionary<string, string> Parameters { get; set; } = new();
}
