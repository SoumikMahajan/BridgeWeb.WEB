using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class TaxDataFromPODTO
    {
        public string? GSTHST { get; set; }
        public string? PST { get; set; }
        public string? StateTax { get; set; }
    }
    
    

}
