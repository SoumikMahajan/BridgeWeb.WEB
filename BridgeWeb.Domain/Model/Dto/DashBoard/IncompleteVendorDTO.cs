using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteVendorDTO
    {
        public long VendorId { get; set; }
        public string VContactName { get; set; } = string.Empty;
        public long? ProjectID { get; set; }
        public long? ProjectNumber { get; set; }
        public string Items { get; set; } = string.Empty;
    }
}
