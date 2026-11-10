namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class InvoiceHistoryDto
    {
        public DateOnly Date { get; set; }
        public string? UserName { get; set; }
        public string? EventName { get; set; }
        public TimeOnly Time { get; set; }

        //public string Date { get; set; }
        //public string Username { get; set; }
        //public string event_name { get; set; }
        //public string Time { get; set; }
    }
}
