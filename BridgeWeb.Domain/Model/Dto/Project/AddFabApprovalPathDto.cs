using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class AddFabApprovalPathDto
    {
        public long? FabPathId { get; set; }
        public long? ProjectID { get; set; }
        public string? FabPathName { get; set; }
        public List<ListOfSelectedFabGrpDto>? SeletedGroupList { get; set; }
        public long? UserId { get; set; }
    }

    public class ListOfSelectedFabGrpDto
    {
        public long GrpNameID { get; set; }
        public long LevelID { get; set; }
        public int Ordering { get; set; }
    }
}
