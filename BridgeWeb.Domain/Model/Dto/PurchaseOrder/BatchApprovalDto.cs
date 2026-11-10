namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class BatchApprovalDto
    {
        public long UserId { get; set; }
        public string? PoIds { get; set; }
        public bool MailSend { get; set; }
        public string? CurrentUrl { get; set; }
    }
}
