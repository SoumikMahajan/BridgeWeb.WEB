using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Budget
{
    public class ProjectDropDownListDTO
    {
        public long? ProjectID { get; set; }
        public long? ProjectNumber { get; set; }
        public string? ProjectName { get; set; }
    }
}
