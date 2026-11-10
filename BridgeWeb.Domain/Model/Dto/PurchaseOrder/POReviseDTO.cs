using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POReviseDTO
    {
        public  long POID { get; set; }
        public bool IsNewVersion { get; set; }
        public long UserId { get; set; }
    }
}
