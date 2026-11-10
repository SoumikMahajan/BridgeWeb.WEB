using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public  class EditStatusCheckDTO
    {
        public long LineItemID { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public bool? nonfreight { get; set; }
    }
}
