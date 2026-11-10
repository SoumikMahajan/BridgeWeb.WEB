using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class ContactTypesDto
    {
        public long ContactTypeID { get; set; }
        public string? ContactType { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
