using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class BRIDGE_AssignedUserAuthorizationDto
    {
       
        public long Fldid { get; set; }
        public long UserID { get; set; }
        public long SecurityID { get; set; }
        public long Isselected { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsDelete { get; set; }=false;
    }
}
