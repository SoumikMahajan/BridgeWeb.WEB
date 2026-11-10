namespace BridgeWeb.Domain.Model.Dto.MenuBuild
{
    public class MenuBuildDto
    {
        public string MainMenu { get; set; } = string.Empty;
        public string SubMenu { get; set; } = string.Empty;
        public string PageUrl { get; set; } = string.Empty;
        public long? Order { get; set; }
        public long? subMenuFldId { get; set; }
    }
}
