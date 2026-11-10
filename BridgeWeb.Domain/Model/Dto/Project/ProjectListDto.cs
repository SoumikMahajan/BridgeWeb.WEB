using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectListDto
    {
        public long ProjectID { get; set; }
        public long? ProjectNumber { get; set; }
        public string? ProjectName { get; set; }
        public string? LegalName { get; set; }
        public string? ProjectManager { get; set; }
        public string? HotelCity { get; set; }
        public long? HotelState { get; set; }
        public string? HotelCountry { get; set; }
        public string? AccountingEmail { get; set; }
        public string? OwnerMobile { get; set; }
        public bool? IsClosed { get; set; }
        public int? Bcount { get; set; }

    }
}
