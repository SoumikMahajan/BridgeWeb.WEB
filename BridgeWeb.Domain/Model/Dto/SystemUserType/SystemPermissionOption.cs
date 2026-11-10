using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemUserType
{
    public class SystemPermissionOption
    {
        public int fldid { get; set; }
        public string? item { get; set; }
        public string? description { get; set; }
        public string? groupType { get; set; }
        public int groupOrder { get; set; }
        public DateTime createdDate { get; set; }
        public object? createdBy { get; set; }
        public object? updateDate { get; set; }
        public object? updatedBy { get; set; }
        public bool isActive { get; set; }
        public bool isDelete { get; set; }
        public object? deletedDate { get; set; }
        public int is_selected { get; set; }
    }
}
