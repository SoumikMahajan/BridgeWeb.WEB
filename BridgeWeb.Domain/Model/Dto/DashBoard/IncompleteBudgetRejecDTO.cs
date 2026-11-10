using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteBudgetRejecDTO
    {
        [Key]
        public long FldID { get; set; }
        public long? BudgetID { get; set; }
        public string? BudgetGroupName { get; set; }
        public string? RejectedBy { get; set; }
        public string? Insertdate { get; set; }
        public string? DateofInsert { get; set; }
        public string? Comment { get; set; }
        public string? CheckingDate { get; set; }
        public int? NumberofData { get; set; }
        public string? LatestDate { get; set; }
        public long? ProjectID { get; set; }
        public string? SectionID { get; set; }

        [NotMapped]
        public string? Budget_Is_Manager { get; set; }
        public List<InCompleteBudgetHstDTO>? HistoryList { get; set; } = new();
        public List<DropDownListDTO>? BudgetUserList { get; set; } = new();
    }
}
