namespace BridgeWeb.Domain.Model.Dto.QuickBook
{
    public class QBPPaymentRequestDto
    {
        public string? Mode { get; set; }
        public string? PaymentId { get; set; }
        public string? VendorId { get; set; }
        public string? CheckNumber { get; set; }
        public string? Amount { get; set; }
        public string? UserId { get; set; }
        public string? QBOId { get; set; }
        public string? SyncToken { get; set; }
    }
}
