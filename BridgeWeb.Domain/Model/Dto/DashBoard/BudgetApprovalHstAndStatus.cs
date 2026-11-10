using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class BudgetApprovalHstAndStatus
    {
        public List<BudgetApprovalHstDTO> budgetApprovalHstDTOs { get; set; } = new();
        public List<BudgetSendApprovalStatusDTO> budgetSendApprovalStatusDTOs { get; set; } = new();
    }
    public class BudgetApprovalHstDTO
    {
        public long? Version { get; set; }
        public string? Versionname { get; set; }
        public string? Approver { get; set; }
        public string? CreatedDate { get; set; }
        public string? Status { get; set; }
        public string? Comment { get; set; }
        public string? ApprovedByName { get; set; }
        public string? GroupName { get; set; }
    }

    public class BudgetSendApprovalStatusDTO
    {
        public string? ManagerName { get; set; }
        public string? UserName { get; set; }
        public long? Approved { get; set; }
        public int? NumOfUserToAprv_Budget { get; set; }
        public int? AlreadyApproved { get; set; }
        public string? SentForApprovalDate { get; set; }
        public string? DateWhenBudgetApproved { get; set; }
        public string? UserApprovedDate { get; set; }
    }
}
