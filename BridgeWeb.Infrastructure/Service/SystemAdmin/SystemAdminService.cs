using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BridgeWeb.Infrastructure.Service.SystemAdmin
{
    public class SystemAdminService : ISystemAdminRepository
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;

        public SystemAdminService(IHttpClientFactory clientFactory, IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
        {
            _baseService = baseService;
            _clientFactory = clientFactory;
            _httpContextAccessor = httpContextAccessor;
            var hostName = _httpContextAccessor.HttpContext?.Request.Host.Host
                ?? throw new InvalidOperationException("HttpContext or Host is not available"); ;

            var configKey = hostName.Contains("localhost")
                ? "ServiceUrls:BridgeAPI"
                : "LiveServerServiceUrls:BridgeAPI";

            bridgeUrl = configuration.GetValue<string>(configKey)
                ?? throw new InvalidOperationException($"Configuration key '{configKey}' is missing or null");
        }

        #region::Add Client
        public async Task<T> GetAllCountryAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/GetCountry",
            });
        }

        public async Task<T> GetAllClientUserTypeAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/GetProjectUserType"

            });
        }

        public async Task<T> GetAllStateByCountryAsync<T>(long? countryId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/GetState?countryId={countryId}",
            });
        }

        public async Task<T> SystemUserCreate<T>(SystemusersCreateDto model)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = model,
                Url = $"{bridgeUrl}/api/adduser/create-Client",

            });
        }
        public async Task<T> UpdateInvoiceAddress<T>(InvoiceAddressUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/update-invoice-address"

            });
        }

        public async Task<T> UpdateTersmAndConditionFileName<T>(string FileName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/upload-terms-condition?fileName={Uri.EscapeDataString(FileName)}",
            });
        }

        #endregion

        #region::Add Staff
        public async Task<T> GetAllUserTypeAsync<T>(string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Get-all-systemuser-type?mode={Uri.EscapeDataString(mode)}",
            });
        }

        public async Task<T> GetAllDEFAULTBUYERAsync<T>(string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Get-all-default-buyer?mode={Uri.EscapeDataString(mode)}",
            });
        }

        public async Task<T> GetAllDEFAULTBUYERFORMEAsync<T>(string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Get-all-default-buyer?mode={Uri.EscapeDataString(mode)}",
            });
        }

        public async Task<T> GetAllSystemPermissionAsync<T>(int userType)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Get-all-systemaccess-by-usertype?userType={userType}",
            });
        }



        public async Task<T> AddUserCreate<T>(AddUserCreateDto addUserCreateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = addUserCreateDto,
                Url = $"{bridgeUrl}/api/adduser/Create-User",
            });
        }

        public async Task<T> checkEmailId<T>(string Email)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/check-user-mailid?email={Uri.EscapeDataString(Email)}",
            });
        }


        #endregion

        #region :: All Users

        public async Task<T> GetAllUsersAsync<T>(UserListTableBindDTO userListTableBindDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = userListTableBindDTO,
                Url = $"{bridgeUrl}/api/adduser/getall-systemUsers",
            });
        }

        public async Task<T> GetAlluserDetailsById<T>(int userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Getuser-byId?userId={userId}",
            });
        }

        public async Task<T> GetUserTypeById<T>(long? userTypeId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-usertype-from-Alluser?userTypeId={userTypeId}",
            });
        }


        public async Task<T> UpdateAllUser<T>(SystemUsersUpdateDto systemUsersUpdateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = systemUsersUpdateDto,
                Url = $"{bridgeUrl}/api/adduser/update-all-user-Details",
            });
        }

        public async Task<T> GetAllUsersByFilterAsync<T>(string isActivefilter)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/getall-systemUsers-byfilter?isActivefilter={isActivefilter}",
            });
        }
        public async Task<T> GetSystemPermissionByUserId<T>(long userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-systemPermission-by-UserId?userId={userId}"
            });
        }

        public async Task<T> ToggleActiveUser<T>(long FldID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/adduser/update-active-status-onclick?FldID={FldID}"
            });
        }
        public async Task<T> GetAllSystemUserTypeList<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-systemUserType-in-user-list"
            });
        }
        public async Task<T> DefaultBuyerBYUID<T>(long FldId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/default-buyer-by-user-id?FldId={FldId}"
            });
        }
        #endregion

        #region::System Level Permission

        public async Task<T> GetAllSystemLevelPermission<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/getall-system-level-permission",
            });
        }
        public async Task<T> SaveSystemLevelPermission<T>(int flid, int isselected)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/adduser/save-system-level-permission?flid={flid}&isselected={isselected}",
            });
        }

        #endregion

        #region :: System Admin Activity
        public async Task<T> GetAllInvoiceTermsAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-invoice-terms",
            });
        }
        public async Task<T> GetAllClassificationsAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-classifications",
            });
        }
        public async Task<T> GetAllInvoiceAddressAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-invoice-address",
            });
        }
        public async Task<T> GetAllProjectContactTypesAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-project-contact-types",
            });
        }
        public async Task<T> GetAllPaymentSchedulesAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-payment-schedules",
            });
        }
        public async Task<T> GetAllShipmentMethodAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-shipment-method",
            });
        }
        public async Task<T> GetAllFabApprovalTypesAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-fabapproval-types",
            });
        }
        public async Task<T> GetAllCountryOnSystemAdminActivityAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-country-system-admin-activity",
            });
        }
        public async Task<T> GetAllCountryOnStatesTabAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-country-on-states-tabe",
            });
        }
        public async Task<T> GetAllStatesByCountryIdAsync<T>(long? CountryId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-states-by-countryid?CountryId={CountryId}",
            });
        }
        public async Task<T> GetAllCurrencyOnSystemAdminAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-currency-on-system-admin",
            });
        }

        public async Task<T> GetAllUOMAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-uom",
            });
        }
        public async Task<T> GetAllBankAccountAsync<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-all-bank-account",
            });
        }

        public async Task<T> GetAllVendorTermsById<T>(long InvoiceTermId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-invoice-terms-byid?InvoiceTermId={InvoiceTermId}"
            });
        }
        public async Task<T> GetClassificationsById<T>(long ClassificationID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-classification-by-id?ClassificationID={ClassificationID}"
            });
        }

        public async Task<T> GetProjectTypeById<T>(long ContactTypeID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-project-contact-types-by-id?ContactTypeID={ContactTypeID}"

            });
        }


        public async Task<T> UpdateInvoiceTerms<T>(VendorTermsUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/update-invoice-terms"
            });

        }
        public async Task<T> UpdateClassification<T>(ClassificationUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/update-classification"
            });
        }


        public async Task<T> CreateClassification<T>(ClassificationCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/adduser/create-classification"

            });
        }

        public async Task<T> CreateVendorTerms<T>(VendorTermsCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/adduser/create-invoice-terms"

            });
        }
        public async Task<T> UpdateProjectContactType<T>(ProjectContactUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/update-project-contactType"


            });
        }
        public async Task<T> CreateProjectContactType<T>(ProjectContactTypeCreateDto createDto)
        {

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/adduser/create-projectcontacttype"

            });
        }
        public async Task<T> GetPaymentscheduleById<T>(long TermID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-payment-schedules-by-id?TermID={TermID}"
            });
        }


        public async Task<T> GetGetShipmentMethodId<T>(long ShipID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-shipmentmethod-by-id?ShipID={ShipID}"
            });
        }

        public async Task<T> GetFabApprovalTypesId<T>(long ItemApprovalID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-fabapprovaltypes-by-id?ItemApprovalID={ItemApprovalID}"
            });
        }

        public async Task<T> UpdateShipmentMethod<T>(ShipmentUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/update-shipmentmethod"
            });
        }
        public async Task<T> CreateShipmentMethod<T>(ShipmentCreateDto createDto)
        {

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/adduser/create-shipmentmethod"

            });
        }
        public async Task<T> UpdatePaymentSchedules<T>(TermsUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-payment-schedules"
            });
        }
        public async Task<T> CreatePaymentSchedules<T>(TermsCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-payment-schedules"
            });
        }
        public async Task<T> CreateFabApprovalTypes<T>(ItemApprovalsCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-fabapproval-types"

            });
        }

        public async Task<T> UpdateFabApprovalTypes<T>(ItemApprovalsUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-fabapproval-types"

            });
        }

        public async Task<T> GetCountryById<T>(long CountryID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-country-by-id?CountryID={CountryID}"
            });
        }

        public async Task<T> UpdateCountry<T>(CountryUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-country"
            });
        }
        public async Task<T> CreateCountry<T>(CountryCreateDto createDto)
        {

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-country"
            });
        }


        public async Task<T> GetStateProvById<T>(long StateID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-state-by-stateid?StateID={StateID}"
            });
        }

        public async Task<T> UpdateStateProv<T>(StateUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-state"
            });
        }

        public async Task<T> CreateStateProv<T>(StateCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-state"
            });
        }
        public async Task<T> GetCurrencyById<T>(long CurrencyID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-currency-by-id?CurrencyID={CurrencyID}"


            });
        }

        public async Task<T> UpdateCurrency<T>(CurrencyUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-currency"

            });

        }
        public async Task<T> CreateCurrency<T>(CurrencyCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-currency"
            });
        }

        public async Task<T> GetUomById<T>(long UOMID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-uom-by-id?UOMID={UOMID}"
            });
        }
        public async Task<T> UpdateUOM<T>(UOMUpdateDto updateDto)
        {

            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-uom"
            });

        }

        public async Task<T> GetBankaccountById<T>(long AccountID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-bank-aacount-by-id?AccountID={AccountID}"
            });
        }
        public async Task<T> UpdateBankAccount<T>(BankAccountUpdateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = bridgeUrl + "/api/adduser/update-bank-account"
            });
        }
        public async Task<T> CreateBankAccount<T>(BankAccountCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-bank-account"


            });
        }
        public async Task<T> CreateUOM<T>(UOMCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = bridgeUrl + "/api/adduser/create-uom"


            });
        }

        public async Task<T> getMailContent<T>(string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-mail-content?mode={mode}"
            });
        }
        public async Task<T> getFileSize<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-file-size"
            });
        }
        public async Task<T> updateFileSize<T>(int FileSize)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/adduser/update-file-size?FileSize={FileSize}"
            });
        }

        public async Task<T> SaveMailTemplate<T>(SaveMailTemplateDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/adduser/save-mail-template/"
            });
        }
        public async Task<T> GetInvoiceAddressById<T>(long InvoiceAddressID)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-invoice-address-by-id?InvoiceAddressID={InvoiceAddressID}"
            });


        }
        #endregion

        #region :: Bridge Supporter

        public async Task<T> GetAllProject<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/getall-Project",
            });
        }

        public async Task<T> GetAllVendor<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/getall-vendor",
            });
        }
        public async Task<T> GetAllInvoiceDetails<T>(string projectid, string vendorid, string formdate, string todate, int userid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/getall-invoice?vendorId={vendorid}&projectId={projectid}&fromDate={formdate}&toDate={todate}&userid={userid}",
            });
        }

        public async Task<T> GetInvoiceHistory<T>(string flid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-invoice-history-by-invoiceid?flid={flid}",
            });
        }

        public async Task<T> EventCanSend<T>(int flid, int status, int userid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/can-send-event?flid={flid}&status={status}&userid={userid}",
            });
        }

        public async Task<T> EventIsSent<T>(int flid, int status, int userid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/issent-event?flid={flid}&status={status}&userid={userid}",
            });
        }

        public async Task<T> EventIsPaid<T>(int flid, int status, int userid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/ispaid-event?flid={flid}&status={status}&userid={userid}",
            });
        }
        public async Task<T> UpdateRefNo<T>(int flid, int refid, int userid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/Update-Ref-No?flid={flid}&refid={refid}&userid={userid}",
            });
        }
        public async Task<T> AllBridgeSupporterVendors<T>(string ProjectID, long UserID, string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/adduser/get-bridge-supporter-vendor-list?ProjectID={ProjectID}&UserID={UserID}&mode={mode}",
            });
        }

        #endregion

        #region :: About
        public async Task<T> PostUserFeedBack<T>(FeedbackDTO feedbackDTO)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/adduser/post-user-feedback",
                Data = feedbackDTO
            });
        }

        #endregion
    }
}
