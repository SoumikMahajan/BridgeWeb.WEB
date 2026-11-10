using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class SelectedVendorIdDTO
    {
        public long ID { get; set; }
        public long? ProjectID { get; set; }
        public long? Vendor_ID { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
    }
}
