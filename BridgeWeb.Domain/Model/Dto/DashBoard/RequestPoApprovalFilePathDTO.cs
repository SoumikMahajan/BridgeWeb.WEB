namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class RequestPoApprovalFilePathDTO
    {
        public string ApprovalId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long LoggedInUserId { get; set; }
    }
}