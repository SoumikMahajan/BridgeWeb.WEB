using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class PODetailsandPOFilesDTO
    {
        public List<PODetails> PODetailsList { get; set; } = new List<PODetails>();
        public List<FilesToshow> FilesToshowList { get; set; } = new List<FilesToshow>();
        public class PODetails
        {
            public string? PONumber { get; set; }
            public long? PurchaseOrderID { get; set; }
            public string? ParentVendorName { get; set; }
            public string? ContactName { get; set; }
            public string? Remarks { get; set; }
        }
        public class FilesToshow
        {
            public string? FileName { get; set; }
        }
   }
}
