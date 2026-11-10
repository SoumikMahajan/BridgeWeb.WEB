namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class GetPOInCreditNoteParamsDTO
    {
        public string VendorId { get; set; } = string.Empty;
        public string ProjectId { get; set; } = string.Empty;
        public string? InvoiceId { get; set; }
    }
}
