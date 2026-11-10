namespace BridgeWeb.Domain.Model.Dto.QuickBook
{
    public class PurchaseInfoDto
    {
        public string QBOID { get; set; } = string.Empty;
        public string Total { get; set; } = string.Empty;
        public string SyncToken { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SystemToken { get; set; } = string.Empty;
        public string QboToken { get; set; } = string.Empty;
        public string Vendor { get; set; } = string.Empty;
        public string CheckNumber { get; set; } = string.Empty;
    }
}
