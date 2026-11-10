using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Report
{
    public class RptHeaderDTO
    {
        public string? ProjectId { get; set; } = string.Empty;
        public string? SectionID { get; set; } = string.Empty;
        public string? VendorId { get; set; } = string.Empty;
        public string? StatusId { get; set; } = string.Empty;
        public bool VendorFlag { get; set; } = false;
        public bool VendorFlagFab { get; set; } = false;
        public string? ItemStatus {  get; set; } = string.Empty; 
        public bool ItemStatusFlag { get; set; } = false;

    }
}
