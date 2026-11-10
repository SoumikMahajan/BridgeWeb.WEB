using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class AddFabItemDataDTO
    {
        public string? POLineItemApprovalID { get; set; }
        public string? ActionType { get; set; }
        public string? ActionDate { get; set; } = string.Empty;
        public string? Comment { get; set; } = string.Empty;
        public string? ActionByProjectManager { get; set; }
        public string? ProjectID { get; set; }
        public string? FabPathGrpName { get; set; }
        public string? ApprovalPathID { get; set; }
        public string? POLineItemID { get; set; }
        public string? FileNames { get; set; }
        public List<IFormFile>? Files { get; set; }
        public string? FabPathApprovalID { get; set; }
        public string? ActionBy { get; set; }
        public string? CurrentUrl { get; set; }        
    }
}
