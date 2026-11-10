using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.SystemAdmin
{
    public class SystemUsersUpdateDto
    {
        public long FldID { get; set; }
        public string? Firstname { get; set; }
        public string? Middlename { get; set; }
        public string? Lastname { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? UserPassword { get; set; }
        public long Usertype { get; set; }
        public bool Isbuyer { get; set; }
        public int? DefaultbuyerID { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public long? State { get; set; }
        public string? ContactNumber { get; set; }
        public string? Extension { get; set; }
        public bool? Isactive { get; set; }
        public DateTime? Createtime { get; set; }
        public DateTime? Lastlogin { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyTitle { get; set; }
        public long? IsPasswordReset { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public string? Token { get; set; }
        //public List<PrioritiesOnListDto> PrioritiesOnListDto { get; set; }
        public string? priorities_on_list { set; get; }
        public int? UserId { get; set; }

        public string? sendLoginCredential { get; set; }

        public string? CurrentUrl { get; set; }
        public bool? IsMFAEnabled { get; set; }
    }
}
