namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class VendorListDto_Expedite
    {
        public long VendorID { get; set; }
        public string? VendorCommonName { get; set; }
        public string? ContactName { get; set; }
        public string? Title { get; set; }
        public string? City { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Email { get; set; }
        public int? POCount { get; set; }
        public long? IsSelected { get; set; }
    }
}
