using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class VendorInCNDTO
    {
        public long ParentVendorID { get; set; }
        public string? ParentVendorName { get; set; }
        public long? ProjectId { get; set; }
        public string? Project {  get; set; }
    }
}
