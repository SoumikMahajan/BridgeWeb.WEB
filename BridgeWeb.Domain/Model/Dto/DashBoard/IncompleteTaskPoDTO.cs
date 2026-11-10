using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.DashBoard
{
    public class IncompleteTaskPoDTO
    {
        public string? parentvendorname { get; set; }
        public string? ContactName { get; set; }
        public string? phone { get; set; }
        public string? email { get; set; }
        public long? parentvendor_id { get; set; }
        public long? vendor_id { get; set; }
        public string? POID { get; set; }
        public long? projectnumber { get; set; }
        public long? projectid { get; set; }
        public int? numofusertoaprv_po { get; set; }
        public int? AlreadyApproved { get; set; }
        //public string? onbehalfof { get; set; }
        public long? levelid { get; set; }
        public string? projectname { get; set; }
        public string? ownername { get; set; }
        public string? UserName { get; set; }      
        public long purchaseorderid { get; set; }
        public string? remarks { get; set; }
        public decimal? PTA { get; set; }
        public string? CheckingDate { get; set; }
        public int? NumberofData { get; set; }
        public string? Currency { get; set; }
        public int? clientorvendorCount { get; set; }
        public string? LatestDate { get; set; }
        //public string? History { get; set; }
        public string? ArrivedDate { get; set; }
        public string? DateofInsert { get; set; }
        public string? OnBehalfOf2 { get; set; }
        //public string? Overcommitted { get; set; }
        public string? LevelStatus { get; set; }
        public string LevelApprovalStatus { get; set; } = string.Empty;
        public List<DropDownListDTO> onbehalfof { get; set; } = new();
        public List<IncompletePOOverCommitedDTO> OverCommitedList { get; set; } = new();
    }
}
