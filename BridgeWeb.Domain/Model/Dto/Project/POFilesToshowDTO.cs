using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class POFilesToshowDTO
    {
        public long FldID { get; set; }
        public long ProjectID { get; set; }
        public string? FileName { get; set; }
        public bool IsExposed { get; set; }
    }
}
