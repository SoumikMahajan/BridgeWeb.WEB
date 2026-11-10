using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
   public class GetItemsDataonSaveinCNparamsDTO
    {
        public string? POLIDS { get; set; }
        public List<POItemGetAmountinCNDTO> POLIData { get; set; } = new List<POItemGetAmountinCNDTO>();
    }
}
