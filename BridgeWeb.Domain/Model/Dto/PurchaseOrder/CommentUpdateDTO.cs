using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class CommentUpdateDTO
    {
        public string? Comment { get; set; }
        public long POId { get; set; }

        public long UserId { get; set; }
    }
}
