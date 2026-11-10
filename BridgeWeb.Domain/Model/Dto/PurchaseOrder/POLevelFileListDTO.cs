using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POLevelFileListDTO
    {
        public long? FldID { get; set; }
        public string? Filename { get; set; }
        public string? ActualFileName { get; set; }

        public DateTime? dateuploaded { get; set; }
        public bool? isExposed { get; set; }


    }
}
