namespace BridgeWeb.Domain.Model.Dto.Expedite
{
    public class HiddenFieldDto
    {
        public string HdnIsAllowEditHistory { get; set; } = string.Empty;
        public long HdnUserType { get; set; }
        public string HdnIsVendor { get; set; } = string.Empty;
        public string HdnEditPermission { get; set; } = string.Empty;
        public string HdnAddPermission { get; set; } = string.Empty;
    }
}
