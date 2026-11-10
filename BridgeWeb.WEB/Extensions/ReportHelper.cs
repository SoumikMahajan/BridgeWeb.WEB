namespace BridgeWeb.WEB.Extensions
{
    public static class ReportHelper
    {
        public static string GetFileExtension(string exportFormat)
        {
            return exportFormat?.ToUpper() switch
            {
                "PDF" => "pdf",
                "EXCEL" => "xls",
                "EXCELOPENXML" => "xlsx",
                _ => "pdf"
            };
        }
    }
}
