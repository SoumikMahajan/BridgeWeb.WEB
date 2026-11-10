using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class UpdatePOLineIteminCNDTO
    {
        public long? POLineItemID { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Cost { get; set; }
        public long UserId { get; set; }
    }
}
