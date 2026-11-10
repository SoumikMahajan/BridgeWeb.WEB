using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace BridgeWeb.Domain.Model.Dto.PurchaseOrder
{
    public class FabricationHistoryViewModel
    {
        public long HistoryID { get; set; }
        public DateTime? ActionDate { get; set; }
        public string? ShowDate { get; set; }
        public string? Comment { get; set; }
        public string? ActionType { get; set; }
        public string? Username { get; set; }
        public string? FileNameToShow { get; set; }
        public string? FileNamePhysical { get; set; }
        public long? ActionByID { get; set; }
        public string? ManagerName { get; set; }
        public long? POLineItemID { get; set; }
        public long? CheckAuthority { get; set; }
        public int? RejectedOne { get; set; }

        public string? WebRootPath { get; set; }

        // Computed Properties for cleaner views
        public string Action => ActionType switch
        {
            "Add Comment" => "Commented",
            "Approve" => "Approved",
            "Reject" => "Rejected",
            "Send" => "Sent",
            "Receive" => "Received",
            _ => ActionType ?? ""
        };

        public string Color => Action switch
        {
            "Rejected" => "red",
            "Amended" => "#a6320f",
            _ => "green"
        };

        public string DeleteIcon
        {
            get
            {
                if (CheckAuthority == 1)
                {
                    return RejectedOne == 1
                        ? $"<i title='Delete History' data-id='{HistoryID}' class='fa-regular fa-trash-can pointer me-2 deleteHistory' style='opacity: 0.5;cursor: not-allowed;'></i>"
                        : $"<i title='Delete History' data-item='{POLineItemID}' data-id='{HistoryID}' class='fa-regular fa-trash-can pointer me-2 deleteHistory' style='cursor:pointer;'></i>";
                }
                return "";
            }
        }

        public string FileHtml
        {
            get
            {
                if (string.IsNullOrEmpty(WebRootPath) || string.IsNullOrEmpty(FileNamePhysical) || string.IsNullOrEmpty(FileNameToShow))
                    return "";

                var physicalFiles = FileNamePhysical.Split("^^^");
                var displayFiles = FileNameToShow.Split("^^^");
                var fname = Path.Combine(WebRootPath, "Assets", "Approvals");

                return string.Join(", ", physicalFiles.Select((file, index) =>
                {
                    var furl = Uri.EscapeDataString(file).Replace("#", "%23");
                    var fshow = index < displayFiles.Length ? displayFiles[index] : "Unknown File";
                    var filepath = $"/Assets/Approvals/{furl}";                    
                    return $"<u><a target='_blank' href='{filepath}'>{fshow}</a></u>";
                }));
            }
        }

        public string FinalUsername
        {
            get
            {
                var filesToShow = Action switch
                {
                    "Rejected" => FileHtml,
                    "Amended" => FileHtml,
                    _ => ""
                };

                if (string.IsNullOrWhiteSpace(ManagerName))
                {
                    return $"<span style='color:{Color};'><strong>{Username}</strong>&nbsp;{filesToShow}</span>";
                }
                else
                {
                    return $"<span style='color:{Color};'><strong>{ManagerName}</strong></span> On behalf of <span style='color:green'><strong>{Username}</strong>&nbsp;{filesToShow}</span>";
                }
            }
        }
    }
}
