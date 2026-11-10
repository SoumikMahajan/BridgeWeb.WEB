namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class VendorDDListDto
    {
        public long VendorId { get; set; }
        public string? VendorName { get; set; }
        public long CurrCode { get; set; }
        public string? CurrencyCode { get; set; }
    }
}
