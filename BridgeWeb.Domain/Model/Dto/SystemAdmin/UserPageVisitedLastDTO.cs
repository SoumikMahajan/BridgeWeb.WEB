using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class UserPageVisitedLastDTO
    {
        public long ID { get; set; }
        public long UserID { get; set; }
        public string? PageUrl { get; set; }
        public DateTime? Insertdate { get; set; }
    }
}
