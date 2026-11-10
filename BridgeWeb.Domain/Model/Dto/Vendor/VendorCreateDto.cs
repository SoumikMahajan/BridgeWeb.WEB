using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Vendor
{
    public class VendorCreateDto
    {
        public string? ContactFirstname { get; set; }
        public string? ContactLastname { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Address1 { get; set; }
        //public string? Address2 { get; set; }
        public long? ParentVendor_ID { get; set; }
        //public bool? IsActive { get; set; }
        public long? Country { get; set; }
        public long? State { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? City { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Phone { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Extension { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? ZipCode { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Fax { get; set; }
        public string? ContactTitle { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Email { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Website { get; set; }
        public long? IsHidden { get; set; }
        //public long? User_ID { get; set; }
        //public long? IsVendorLoginSent { get; set; }
        public long? IsSystemUser { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? Mobile { get; set; }
        //public long? BridgeSupporter { get; set; }
        public long? CreatedBy { get; set; }
        public string? priorities_on_list { set; get; }
        public string? CurrentUrl { get; set; }

    }
}
