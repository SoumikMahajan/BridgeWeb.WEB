using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class BudgetHistoryDTO
    {
        public long? RowNumber { get; set; }
        public string? Type { get; set; }
        public long? FldID { get; set; }
        public long? AID { get; set; }
        public string? Operation { get; set; }
        public long? OperationBy { get; set; }
        public DateTime? OperationDate { get; set; }
        public long? Version { get; set; }
        public long? ProjectID { get; set; }
        public string? PID { get; set; }
        public string? UserName { get; set; }
    }
}
