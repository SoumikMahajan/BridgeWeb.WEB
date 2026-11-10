using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto
{
    public class ProjectusertypeDto
    {
        public long Fldid { get; set; }
        public string? UsertypeID { get; set; }
        public string? Usertype { get; set; }
        public bool Isactive { get; set; } = true;
        public DateTime CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool IsDelete { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
    }
}
