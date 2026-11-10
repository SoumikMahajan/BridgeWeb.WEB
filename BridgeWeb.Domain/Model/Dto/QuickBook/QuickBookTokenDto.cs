namespace BridgeWeb.Domain.Model.Dto.QuickBook
{
    public class QuickBookTokenDto
    {
        public string? accessToken { get; set; }
        public string? accessTokenSecret { get; set; }
        public string? RefreshToken { get; set; }
        public string TokenType { get; set; } = "bearer";
        public DateTime? AccessTokenExpire { get; set; }
        public DateTime? RefreshTokenExpire { get; set; }
        public string? TokenEndpoint { get; set; }
        public DateTime? WriteDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDelete { get; set; } = false;
        public string? RealmId { get; set; }
    }
}
