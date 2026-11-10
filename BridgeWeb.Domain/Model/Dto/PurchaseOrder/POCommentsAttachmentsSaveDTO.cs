using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class POCommentsAttachmentsSaveDTO
    {
        public string? Comment { get; set; }
        public long POId { get; set; }

        public long UserId { get; set; }
        public string? File { get; set; }

        public List<string> ActualFileName { get; set; } = new List<string>();
        public List<string> FileName { get; set; } = new List<string>();
    }
}
