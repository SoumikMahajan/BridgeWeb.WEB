namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class PaymentHistoryDTO
    {
        public long FLDID { get; set; }
        public string? Operation { get; set; }
        public long? OperationBy { get; set; }
        public DateTime? OperationOn { get; set; }
        public string? Area { get; set; }
        public long? ManualPaymentID { get; set; }
        public string? UserName { get; set; }
    }
}
