using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectCommentByProjectIdDto
    {
        public long CommentId { get; set; }
        public string? Comment { get; set; }
        public string? CreatedDate { get; set; }
    }
}
