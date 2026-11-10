namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ResetPasswordDto
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }
        public string? Token { get; set; }
    }
}
