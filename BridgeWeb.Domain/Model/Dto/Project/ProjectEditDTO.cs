using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto.Project
{
    public class ProjectEditDTO
    {
        public long ProjectID { get; set; }
        public long? ProjectNumber { get; set; }
        public string? ProjectName { get; set; }
        public string? LegalName { get; set; }
        public string? InvoiceAddress { get; set; }
        public string? InvoiceCity { get; set; }
        public int? InvoiceState { get; set; }
        public string? InvoicePostalCode { get; set; }
        public long? InvoiceCountry { get; set; }
        public int? NumOfUserToAprv_Budget { get; set; }
        public int? NumOfUserToAprv_PO { get; set; }
        public long? NumOfUserToAprv_POITEMS { get; set; }
        public long? ClientID { get; set; }
        public long? ManagerID { get; set; }
        public string? DevelopmentInfo { get; set; }
        public string? HotelAddress { get; set; }
        public string? HotelCity { get; set; }
        public long? HotelState { get; set; }
        public string? HotelPostalCode { get; set; }
        public string? HotelCountry { get; set; }
        public string? ProjectScope { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerAddress { get; set; }
        public string? OwnerCity { get; set; }
        public long? OwnerState { get; set; }
        public string? OwnerPostalCode { get; set; }
        public string? OwnerCountry { get; set; }
        public string? OwnerContact { get; set; }
        public string? OwnerNotes { get; set; }
        public string? OwnerFax { get; set; }
        public string? OwnerEmail { get; set; }
        public string? OwnerMobile { get; set; }
        public string? AccountingContact { get; set; }
        public string? AccountingTelephone { get; set; }
        public string? AccountingFax { get; set; }
        public string? AccountingEmail { get; set; }
        public string? FederalID { get; set; }
        public DateTime? ProjectCreatedDate { get; set; }
        public decimal? GSTHST { get; set; }
        public string? GSTHSTTYPE { get; set; }
        public decimal PST { get; set; }
        public string? PSTTYPE { get; set; }
        public string? StateTax { get; set; }
        public string? STATETAXTYPE { get; set; }
        public long? CurrCode { get; set; }
        public DateTime InstallDate { get; set; }
        public DateTime ProjectCompletionDate { get; set; }
        public DateTime WarehouseRequiredDate { get; set; }
        public DateTime OpeningDate { get; set; }
        public string? InstallationScheduleFile { get; set; }
        public string? OwnerReportingRequirement { get; set; }
        public string? TermsFile { get; set; }
        public string? ProjectFile { get; set; }
        public string? ProjectComments { get; set; }
        public string? PurchaseOrderComment { get; set; }
        public string? AccountPhoneExtension { get; set; }
        public string? OwnerPhoneExtension { get; set; }
        public long? NumOfUserToAprvPerlevel { get; set; }
        public string? DefaultTermsFile { get; set; }
        public bool? IsClosed { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public long? UpdatedBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? DeletedDate { get; set; }

        public bool? IsSupporter { get; set; }
    }
}
