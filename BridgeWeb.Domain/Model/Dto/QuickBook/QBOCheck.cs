namespace BridgeWeb.Domain.Model.Dto.QuickBook
{
    public class QBOCheck
    {
        public string? Bank { get; set; } = string.Empty;
        public string? Checknumber { get; set; } = string.Empty;
        public string? Memo { get; set; } = string.Empty;
        public string? Paymentdate { get; set; } = string.Empty;
        public string? Total { get; set; } = string.Empty;
        public string? VendorID { get; set; } = string.Empty;
        public string? VendorCurrency { get; set; } = string.Empty;
        public string? BankCurr { get; set; } = string.Empty;
        public string? ExchangeRate { get; set; } = string.Empty;
        public string? BridgeVendorID { get; set; } = string.Empty;
        public string? BridgePaymentID { get; set; } = string.Empty;
        public string? Type { get; set; } = string.Empty;
        public string? MailingAddress { get; set; } = string.Empty;
        public List<Lineitemsqbo>? Items { get; set; } = new();

    }

    public class Lineitemsqbo
    {
        public string? AccountId { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Total { get; set; } = string.Empty;
    }
}
