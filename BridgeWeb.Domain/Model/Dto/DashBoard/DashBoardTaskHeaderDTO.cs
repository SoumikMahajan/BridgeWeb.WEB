namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class DashBoardTaskHeaderDTO
    {
        public string TaskName { get; set; } = string.Empty;
        public int? NumberofData { get; set; }
        public string CheckingDate { get; set; } = string.Empty;
        public string LatestDate { get; set; } = string.Empty;
        public int? Count { get; set; }
        public long? projectid { get; set; }
        public long? projectnumber { get; set; }
        public string? projectname { get; set; }
    }
}
