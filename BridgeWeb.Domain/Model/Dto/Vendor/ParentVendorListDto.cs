using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class ParentVendorListDto
    {
        public long? parentvendor_id { get; set; }
        public string? parentvendorname { get; set; }
        public string? legalname {  get; set; }
        public string? Classifications {  get; set; }
        public string? city {  get; set; }
        public string? Country { get; set; }
        public int TotalRecords { get; set; }
        public int FilteredRecords { get; set; }
    }
}
