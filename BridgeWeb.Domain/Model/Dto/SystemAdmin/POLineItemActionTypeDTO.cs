namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class POLineItemActionTypeDTO
    {
        public long FldID { get; set; }
        public string? ActionType { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
