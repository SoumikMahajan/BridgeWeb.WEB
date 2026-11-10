using BridgeWeb.Domain.Model.Dto.SystemAdmin;

namespace BridgeWeb.Domain.Model.Dto.Report
{
    public class ReportDataDto
    {
        public List<ItemApprovalsDto> ApprovalTypes { get; set; } = new();
        public List<POLineItemActionTypeDTO> ApprovalStatuses { get; set; } = new();
        public List<BankAccountDto> BankAccounts { get; set; } = new();
        public List<PaymentTypeDto> PaymentTypes { get; set; } = new();
        public List<ReportProjectListDTO>? ProjectListForReport { get; set; } = new();
        public string MenuOrder { get; set; } = string.Empty;
        public string ActiveTab { get; set; } = string.Empty;
    }
}
