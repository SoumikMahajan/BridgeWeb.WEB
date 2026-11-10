using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ReportAccessPermissionDto
    {
        public bool? IsBudgetReportActive { get; set; }
        public bool? IsPurchaseReportActive { get; set; }

        public bool? IsStatusReportActive { get; set; }

        public bool? IsAccountReportActive { get; set; }
    }
}
