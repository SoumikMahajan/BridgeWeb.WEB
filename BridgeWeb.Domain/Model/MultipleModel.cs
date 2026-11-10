using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.Budget;
using BridgeWeb.Domain.Model.Dto.DashBoard;
using BridgeWeb.Domain.Model.Dto.Expedite;
using BridgeWeb.Domain.Model.Dto.Invoice;
using BridgeWeb.Domain.Model.Dto.MenuBuild;
using BridgeWeb.Domain.Model.Dto.Project;
using BridgeWeb.Domain.Model.Dto.PurchaseOrder;
using BridgeWeb.Domain.Model.Dto.Report;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Model.Dto.SystemUserType;
using BridgeWeb.Domain.Model.Dto.Vendor;

namespace BridgeWeb.Domain.Model
{
    public class MultipleModel
    {
        #region :: Global
        public List<DropDownListDTO> dropDownListDTOs { get; set; } = new();
        public SingleResultDTO singleResultDTO { get; set; } = new();
        public long UserRoleid { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string singleResult { get; set; } = string.Empty;

        #endregion

        #region:: System Admin
        public List<ProjectusertypeDto> ProjectusertypeList { get; set; } = new();
        public List<CountryDto> CountryList { get; set; } = new();
        public List<StateDto> StateList { get; set; } = new();
        public List<StateDto> Remit_StateList { get; set; } = new();

        public List<SystemauthorizationDto> systemList { get; set; } = new();

        public APIResponse APIResponse { get; set; } = new();
        public List<SystemUsersDTO> systemUsersDTOs { get; set; } = new();
        public SystemUsersDTO systemUserviewDto { get; set; } = new();
        public List<SystemUserTypeDto> systemUserTypesDTOs { get; set; } = new();
        public List<SystemPermissionList> systemPermissionLists { get; set; } = new();
        public AddUserCreateDto addUserCreateDto { get; set; } = new();
        public List<SystemLevelPermission> SystemLevelPermissions { get; set; } = new();
        public List<VendorTermsDto> vendorTermsList { get; set; } = new();
        public VendorTermsDto vendorTermsDto { get; set; } = new();
        public List<ClassificationsDto> classificationsList { get; set; } = new();
        public List<InvoiceAddressesDto> invoiceAddressesList { get; set; } = new();
        public List<ContactTypesDto> contactTypesList { get; set; } = new();
        public List<TermsDto> termsList { get; set; } = new();
        public List<ShipmentDto> shipmentsList { get; set; } = new();
        public List<ItemApprovalsDto> itemApprovalsList { get; set; } = new();
        public List<POLineItemActionTypeDTO> itemApprovalsStatusList { get; set; } = new();
        public List<CurrencyDto> currencyList { get; set; } = new();

        public SystemUsersUpdateDto systemUsersUpdateDto { get; set; } = new();
        public List<UOMDto> uomList { get; set; } = new();
        public List<BankAccountDto> bankAccountList { get; set; } = new();

        public VendorTermsDto VenderTermsViewDataById { get; set; } = new();
        public BankAccountDto BankAccountDto { get; set; } = new();
        public List<InvoiceAddressesDto> InvoiceAddresses { get; set; } = new();
        public List<SystemUserTypeListDTO> SystemUserTypeList { get; set; } = new();
        public List<MenuBuildDto> menuBuildList { get; set; } = new();
        public List<PaymentTypeDto> paymentTypeList { get; set; } = new();

        #endregion

        #region :: Bridge Supporter

        public List<AllProjectDropdownDto> allProjectDropdownDtos { get; set; } = new();
        public List<AllVendorDropdownDto> allVendorDropdownDtos { get; set; } = new();
        public List<InvoiceDetailsDto> invoiceDetailsList { get; set; } = new();
        public List<InvoiceHistoryDto> invoiceHistoryDtos { get; set; } = new();
        public CoustomeFunction coustomeFunction { get; set; } = new();

        #endregion

        #region :: Vendor Page

        public ParentVendorCreateDto parentVendorCreateDto { get; set; } = new();
        public List<ParentVendorListDto> vendorListDtos { get; set; } = new();
        public List<VendorContactDto> VendorContactDto { get; set; } = new();
        public ParentVendorsDto parentVendorDto { get; set; } = new();

        #region::Vendor Edit

        //public ParentVendorsDto ParentVendorsDto { get; set; }
        public List<ContactVendorDto> contactVendorDtos { get; set; } = new();

        public List<ParentVendorsDto> parentVendorsList { get; set; } = new();
        public List<VenndorSystemPermissionDto> venndorSystemPermissionList { get; set; } = new();
        public YTDPurchaseOrderWithCurrCodeDTO YTDPurchaseOrderWithCurrCodeDTO { get; set; } = new();
        public List<ProjectYTDListInVendorDTO> ProjectListinVendor { get; set; } = new();
        #endregion

        #region ::Vendor Contact
        public List<VendorListDto> VendorContactUpdateDto { get; set; } = new();
        public VendorDto VendorDto { get; set; } = new();
        public ContactAddressesDto ContactAddressesDto { get; set; } = new();
        public List<ContactAddressesDto> ContactAddressesListDto { get; set; } = new();
        #endregion

        #region :: Merge Vendor
        public MergeVendorContactDto mergeVendorContactDto { get; set; } = new();
        public CurrencyDto currencyDto { get; set; } = new();
        public List<MergeVendorContactDto> mergeVendorContactDtosList { get; set; } = new();
        #endregion

        #endregion

        #region:: Project
        public ProjectContactsDto projectContactsDto { get; set; } = new();
        public List<ProjectContactsDto> projectContactList { get; set; }= new();

        public SystemUserByUserTypeDto SystemUserByUserTypeDto { get; set; } = new();
        public List<SystemUserByUserTypeDto> SystemUserByUserTypeList { get; set; } = new();

        public List<Dto.Project.ProjectListDto> ProjectListDto { get; set; } = new();
        public CountryDto countryDto { get; set; }  = new();

        public List<VendorListinProjectDto> VendorinProjectList { get; set; } = new();
        public List<ProjectCommentDto> ProjectCommentsList { get; set; } = new();
        public ProjectUserApprovalDto ProjectUserApproval { get; set; } = new();

        public List<ProjectContactsDto> ProjectContactList { get; set; } = new();

        public ProjectEditDTO ProjectEdit { get; set; } = new();

        public PODto PODetails { get; set; } = new();

        public ReportAccessPermissionDto ReportAccessPermissionDto { get; set; } = new();
         
        public List<ProjectConversionRateDTO> ProjectConversionRatesList { get; set; } = new();

        public List<ProjectAccountDetailsDTO> ProjectAccountDetailsList { get; set; } = new();
        public List<ProjectCommentByProjectIdDto> ProjectCommentByProjectIdList { get; set; } = new();

        public List<POFilesToshowDTO> POfilestoShowList { get; set; } = new();
        public List<ProjectContactInEditProjectDTO> ProjectContactListInProjectEdit { get; set; } = new();
        public List<BankAccountInEditProjectDto> BankAccountDetailsList { get; set; } = new();
        public List<ProjectTeamDetailsDto> ProjectTeamDetails { get; set; } = new();
        public List<ManagerListDto> ManagerListDtos { get; set; } = new();
        public List<ProjectMemberPermissionDto> ProjectMemberPermissionDtos { get; set; } = new();
        public ProjectContactsDto ProjectDetails { get; set; } = new();
        public List<PTDPurchasesDTO> PTDPurchaseList { get; set; } = new();
        public ProjectAccountDetailsDTO ProjectAccountDetails { get; set; } = new();

        public List<ProjectUserListPermission> ProjectUserListPermissions { get; set; } = new();
        public List<FabApprovalGetDataDto> FabApprovalGetListData { get; set; } = new();
        public List<FabApprovalPathNameDto> FabApprovalPathNameListData { get; set; } = new();
        public List<FabGroupOnPathDto> FabGroupOnPathListData { get; set; } = new();
        public List<SelectedVendorIdDTO> SelectedVendorIdlist { get; set; } = new();
        public List<VendorLIstinEditProjectDto> VendorListinEditProject { get; set; }   = new();

        public UserSecurity UserSecurity { get; set; } = new();
        public List<POApprovalGetDataDto> POApprovalGetDataListDto { get; set; } = new();

        #endregion

        #region :: Budget

        #region ::Budget Summary
        public List<Dto.Budget.ProjectListDto> ProjectSelectList { get; set; } = new List<Dto.Budget.ProjectListDto>();
        #endregion

        #region ::Budget Details
        public List<ProjectDropDownListDTO> ProjectNameDropDown { get; set; } = new ();
        public List<BudgetHistoryDTO> BudgetHistoryList { get; set; } = new ();

        public List<SectionListDTO> SectionList { get; set; } = new();
        public List<ChangedLIDTO> ChangedLIlist { get; set; } = new();
        public List<ApprovalHistoryListDTO> ApprovalHistoryList { get; set; } = new();

        public List<LOG_BudgetSectionDTO> ChangedBSList { get; set; } = new();

        public List<AllOUMDetailsDTO> AllOUMDetailsListInBudgetDetails { get; set; } = new();

        public List<VersionnameDTO> VersionNameList { get; set; } = new();
        public List<GetLineItemsDTO> GetLineItemsList { get; set; } = new();
        public List<PreviousSectionListDTO> PreviousSectionList { get; set; } = new();
        public LockStatusDTO LockStatus { get; set; } = new();
        public List<BudgeApprovalGroupDTO> BudgeApprovalGroupListDTO { get; set; } = new();
        public int flag { get; set; }
        public List<ProjectSectionForCopyBudget> ProjectSectionForCopyBudget { get; set; } = new();
        #endregion

        #endregion

        #region :: Purchase Order

        public List<VendorDDListDto> VendorDDList { get; set; } = new();
        public List<BuyerDDListDto> BuyerDDList { get; set; } = new();
        public List<ActiveTermsDDListDto> ActiveTermsDDList { get; set; } = new();  
        public List<ShipmentDDListDto> ShipmentDDList { get; set; } = new();
        public List<PurchaseOrderFilteredViewDto> purchaseOrderFilteredViews { get; set; } = new();
        public RequiredPODetailsDTO RequiredPODetails { get; set; } = new();
        public GetPODetailsDTO GetPODetails { get; set; } = new();
        public string calculatedTax { get; set; } = string.Empty;
        public List<VendorLIstNewDTO> VendorListNew { get; set; } = new();
        public List<BuyerDetailsDTO> BuyerDetailsDD { get; set; } = new();
        public  List<VendorCoListDTO> VendorCoList { get; set; } = new();
        public List<POFIlesDTO> POFIles { get; set; } = new();
        public List<AddressListDTO> AddressListVendorCo { get; set; } = new();
        public List<POLevelFileListDTO> POLevelFileList { get; set; } = new();
        public List<POExpediteNoteDTO> POExpediteNoteList { get; set; } = new();
        public POCommentDTO POcomments { get; set; } = new();
        public List<GetAllPOLineItemsDTO> POLineItemList { get; set; } = new();
        public ConversionRateDTO ConvertionRate { get; set; } = new();
        public string isCommitted { get; set; } = string.Empty;
        public POCalculatedTaxDTO GetPOCalculatedTax { get; set; } = new();
        public PurchaseOrderCopyDTO PurchaseOrderCopy { get; set; } = new();
        public POInvoiceCalculationDTO POInvoiceCalculation { get; set; } = new();
        public List<TotalInvoiceAmountDTO> TotalInvoiceDataDTo { get; set; } = new();
        public List<ProjectAccountGetDTO> ProjectAccountInCN { get; set; } = new();
        public List<POLineItemandTaxesinCreditNoteDTO> POLIinCN { get; set; } = new();
        public VendorInCNDTO VendorDetailsInCN { get; set; } = new();
        public RequiredPODateDTO RequiredPODate { get; set; } = new();
        public List<POLIStatusDTO> POLIStatusList { get; set; } = new();
        public List<POLIExpediteHistoryDTO> POLIExpediteHistoryList { get; set; } = new();
        public List<CommittedPOLIDetailsDTO> CommittedPOLIDetailsDTO { get; set; } = new();

        public List<FabricationDataDTO> FabricationDataDTO { get; set; } = new();
        public List<FabricationHistoryViewModel> FabricationHistoryDTO { get; set; } = new();
        public string IsManager { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;

        public List<POHistoryDetails> POHistoryDetails { get; set; } = new();
        public List<POLineItems_POHistory> POLineItems_POHistoryDetails { get; set; } = new();
        public List<AllPoHistoryDetails> AllPoHistoryDetails { get; set; } = new();
        public List<POSingleHistoryDetails> POSingleHistoryDetails { get; set; } = new();
        public List<SinglePOHistoryDetailsDTO> singlePOHistoryDetailsDTOs { get; set; } = new();
        public List<POApprovalsBackupDTO> POApprovalsBackupDTO { get; set; } = new();
        

        #endregion

        #region :: Add PO LI
        public List<SectionListDDinPOLIDTO> SectionListInAddPOLI { get; set; } = new();
        public TaxDataFromPODTO TaxDataFromPO { get; set; } = new();
        public string? ProjectID;

        #endregion

        #region :: SEARCH INVOICE/CREDIT NOTE
        public List<ParentVendorListInvoiceDTO> ParentVendorListInvoice { get; set; } = new();
        public List<InvoiceListDTO> InvoiceList { get; set; } = new();
        #endregion

        #region ::Invoice
        public List<PaymentVendorLIstDTO> PaymentVendorList { get; set; } = new();
        public List<PaymentDetailsAdvancedList> PaymentDetailsAdvanced { get; set; } = new();
        public List<PaymentTypeDTO> PaymentTypesList { get; set; } = new();
        public List<BankAccountDTO> BankAccountMSList { get; set; } = new();
        public ManualPaymentDetaisGetDTO ManulPaymentDetails { get; set; } = new();
        public List<BankAccountDetailsListDTO> BankAccountDetailsLists { get; set; } = new();
        public List<PaymentItemListDTO> PaymentItemList { get; set; } = new();
        public List<PaymentHistoryDTO> PaymentHistoryList { get; set; } = new();
        public List<PaymentUpdateDetailsDTO> PaymentUpdateDetailsList { get; set; } = new();
        public List<PaymentItemUpdateDetailsDTO> PaymentItemUpdateDetailsList { get; set; } = new();
        public List<ParentVendorListForInvoiceDTO> ParentVendorListEnterInvoice { get; set; } = new();
        public List<ProjectListEnterInvoiceDTO> ProjectListEnterInvoice { get; set; } = new();
        public List<POSelectorListDTO> POSelectorList { get; set; } = new();
        public List<POLineItemSelectorBasedOnPODTO> POLineItemSelectorList { get; set; } = new();
        public List<InvoiceDataForSelectedPOLIDTO> InvoiceDataForSelectedPOLI { get; set; } = new();
        public List<PreviousInvoiceDTO> PreviousInvoiceList { get; set; } = new();
        #endregion

        #region :: EXPEDITE
        public HiddenFieldDto expediteHiddenFields { get; set; } = new();
        public List<PoLineItemStatus_Expedite> status_Expedites { get; set; } = new();
        public List<VendorListDto_Expedite> vendorListDtos_Expedite { get; set; } = new();
        public List<ProjectSectionDto_Expedite> projectSectionDto_Expedites { get; set; } = new();
        public PermissionDto Permission { get; set; } = new();
        #endregion

        #region :: Dashboard
        public List<DashBoardHeaderDTO> dashBoardHeaderDTO { get; set; } = new();
        public List<DashBoardTaskHeaderDTO> dashBoardTaskHeaderDTO { get; set; } = new();
        public List<IncompletePoDTO> incompletePoDTO { get; set; } = new();
        public List<IncompleteProjectDTO> incompleteProjectDTO { get; set; } = new();
        public List<IncompleteVendorDTO> imcompleteVendorDTO { get; set; } = new();
        public List<IncompleteBudgetDTO> incompleteBudgetDTO { get; set; } = new();
        public List<BudgetApprovalHstDTO> budgetApprovalHstDTO { get; set; } = new();
        public List<BudgetSendApprovalStatusDTO> budgetSendApprovalStatusDTO { get; set; } = new();
        public BudgetApprovalHstAndStatus budgetApprovalHstAndStatus { get; set; } = new(); 
        public List<IncompleteTaskPoDTO> incompleteTaskPoDTO { get; set; } = new();
        public List<IncompletePoHistoryDTO> incompletePoHistoryDTO { get; set; } = new();
        public List<IncompletePOOverCommitedDTO> incompletePOOverCommitedDTO { get; set; } = new();
        public List<IncompleteFabDTO> incompleteFabDTO { get; set; } = new();
        public List<FabricationHistoryDTO> fabricationHistoryDashboard { get; set; } = new();
        public List<IncompleteApproveVendorPODTO> incompleteApproveVendorPO { get; set; } = new();
        public List<DashboardPOAcceptedDTO> dashboardPOAccepted { get; set; } = new();
        public List<IncompletePoRejectDTO> incompletePoReject { get; set; } = new();
        public List<IncompletePoCheckBackDTO> incompletePoCheckBack { get; set; } = new();
        public List<FabApprovalStatusDashboardDTO> fabApprovalStatusDashboard { get; set; } = new();
        public List<DashBoardPoApprovalCommentsDTO> dashBoardPoApprovalComments { get; set; } = new();
        public List<IncompleteVendorConfirmDTO> incompleteVendorConfirm { get; set; } = new();
        public string DashboardActionName { get; set; } = string.Empty;
        //public List<FilesToshow> FilesToshowsList { get; set; }
        //public List<PODetails> PODetailsList { get; set; }
        public PODetailsandPOFilesDTO PODetailsandPOFilesDTO { get; set; } = new();
        public List<checktermsDTO> ChecktermsDTOList { get; set; } = new();
        public List<BudgetGroupGetByIdDTO> BudgetGroupListDashboard { get; set; } = new();
        public List<IncompleteBudgetRejecDTO>? incompleteBudgetReject { get; set; }
        public long? SelectedProjectID { get; set; }

        #endregion

        #region :: Enter Credit Note
        public List<VendorInCreditNoteDTO> VendorListinECN { get; set; } = new();
        public List<POInCreditNoteDTO> POInCreditNoteList { get; set; } = new();
        public List<POIteminCNDTO> POItemListinCN { get; set; } = new();
        public List<ItemDetialsinCNDTO> ItemDetailsinCNList { get; set; } = new();  
        public List<GetItemsOnSaveDTO> ItemDetailsonSave { get; set; } = new();
        public List<POItemGetAmountinCNDTO> POLIData { get; set; } = new();

        #endregion

        #region :: Manual Payment
        public List<ProjectListinMP> ProjectListinMP { get; set; } = new();
        public List<PaymentTypeGetDTO> PaymentTypeList { get; set; } = new();
        public List<GetAllInvListByVendor2DTO> GetAllInvoiceListinMP { get; set; } = new();
        #endregion

        #region ::Invoice Edit
        public InvoiceEditDetailsDTO InvoiceEditDetails { get; set; } = new();
        public List<POItemSelectorInvEditDTO> POItemSelectorinvEdit { get; set; } = new();
        public List<InvoiceItemsonLoadDTO> InvoiceItemsonLoad { get; set; } = new();
        public List<InvoiceDataBasedOnPOLIInvEdit> InvoiceItemsOnClick { get; set; } = new();
        public CheckInvoiceVoidPaymentDTO CheckInvoiceVoidPayment { get; set; } = new();

        #endregion

        #region :: Edit Credit Note
        public GetCreditNoteDTO GetCreditNote { get; set; } = new();

        #endregion

        #region :: Report
        public List<ReportProjectListDTO> ReportProjectList { get; set; } = new();
        public string ActiveTab { get; set; } = string.Empty;

        #endregion
    }
}