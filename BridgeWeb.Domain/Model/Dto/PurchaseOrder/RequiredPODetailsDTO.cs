using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public  class RequiredPODetailsDTO
    {
        public string? GeneratedPONumber { get; set; }
        public string? VendorName { get; set; }
        public bool IsHidden { get; set; }
        public bool IsCommitted {  get; set; }
        public bool IsSentForApproval { get; set; }
        public bool IsApproved { get; set;}
        public int LineItemCount { get; set; }
        public string? Remarks { get; set; }
        public bool CreatePOPermission { get; set; }
        public long? ProjectId {  get; set; }
        public long? Currency {  get; set; }
        public long? UserType { get; set; }
        public int? approveForVendor { get; set; }
        public bool? IsConfirmed { get; set; }

    }
}
