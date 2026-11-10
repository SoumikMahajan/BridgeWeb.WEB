using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POFIlesDTO
    {
        public string? Filename { get; set; }
        public long FldId { get; set; }
        public bool IsExposed { get; set; } 
    }
}
