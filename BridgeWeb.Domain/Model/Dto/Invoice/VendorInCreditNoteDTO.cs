using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Invoice
{
    public class VendorInCreditNoteDTO
    {
        public string? ParentVendorname { get; set; }
        public long? ParentVendorId { get; set; }
        public string? Currency { get; set; }
    }
}
