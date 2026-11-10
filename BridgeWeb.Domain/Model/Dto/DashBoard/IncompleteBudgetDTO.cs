using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteBudgetDTO
    {
        public long ProjectNumber { get; set; }
        public string? ProjectName { get; set; }
        public int? NumOfUserToAprv_Budget { get; set; }
        public long? ProjectId { get; set; }
        public long? BudgetID { get; set; }
        public int? AlreadyApproved { get; set; }
        public long? IsSentForApproval { get; set; }
        public int? Bissent { get; set; }
        public string? groupname { get; set; }
        public long? GroupID { get; set; }
        public string DateofInsert { get; set; } = string.Empty;
        public string CheckingDate { get; set; } = string.Empty;
        public int? NumberofData { get; set; }
        public string? sectionID { get; set; }
        public string? Budget_Is_Manager { get; set; }
        public List<InCompleteBudgetHstDTO> HistoryList { get; set; } = new();
        public List<DropDownListDTO> BudgetUserList { get; set; } = new();
    }
}
