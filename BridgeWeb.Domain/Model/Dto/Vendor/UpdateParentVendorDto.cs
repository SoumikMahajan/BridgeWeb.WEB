using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class UpdateParentVendorDto
    {
        public long ParentVendor_ID { get; set; }
        public string? ParentVendorName { get; set; }
        public string? LegalName { get; set; }
        public long? CurrCode { get; set; }
        public string? Address1 { get; set; }
        public long? Country { get; set; }
        public long? State { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public string? Note { get; set; }
        public long? Terms_ID { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? R_Country { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? R_State { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? R_City { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? R_ZipCode { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? R_Address { get; set; }
        public string? Minority_own_business { get; set; }
        public string? Woman_own_business { get; set; }
        public bool? R_Flag { get; set; }
        public bool? BridgeSupporter { get; set; }
        public string? ClassificationList { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; } 
    }
}
