using BridgeWeb.Domain.Model.Dto;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.SystemAdmin
{
    public interface ISystemAdminRepository
    {
        #region:: Add Client
        Task<T> GetAllCountryAsync<T>();
        Task<T> GetAllClientUserTypeAsync<T>();
        Task<T> GetAllStateByCountryAsync<T>(long? countryId);
        Task<T> SystemUserCreate<T>(SystemusersCreateDto model);

        #endregion

        #region::ADD Staff
        Task<T> GetAllUserTypeAsync<T>(string mode);

        Task<T> GetAllDEFAULTBUYERAsync<T>(string mode);

        Task<T> GetAllDEFAULTBUYERFORMEAsync<T>(string mode);

        Task<T> GetAllSystemPermissionAsync<T>(int userType);

        Task<T> AddUserCreate<T>(AddUserCreateDto addUserCreateDto);
        Task<T> checkEmailId<T>(string Email);        

        #endregion

        #region :: All Users
        Task<T> GetAllUsersAsync<T>(UserListTableBindDTO userListTableBindDTO);
        Task<T> GetAlluserDetailsById<T>(int userId);
        Task<T> GetUserTypeById<T>(long? userTypeId);

        Task<T> UpdateAllUser<T>(SystemUsersUpdateDto systemUsersUpdateDto);

        Task<T> GetAllUsersByFilterAsync<T>(string isActivefilter);
        Task<T> GetSystemPermissionByUserId<T>(long userId);

        Task<T> ToggleActiveUser<T>(long FldID);
        Task<T> GetAllSystemUserTypeList<T>();
        Task<T> DefaultBuyerBYUID<T>(long FldId);

        #endregion

        #region :: System Level Permission
        Task<T> GetAllSystemLevelPermission<T>();
        Task<T> SaveSystemLevelPermission<T>(int flid, int isselected);
        #endregion

        #region :: System Admin Activity
        Task<T> GetAllInvoiceTermsAsync<T>();
        Task<T> GetAllClassificationsAsync<T>();
        Task<T> GetAllInvoiceAddressAsync<T>();
        Task<T> GetAllProjectContactTypesAsync<T>();
        Task<T> GetAllPaymentSchedulesAsync<T>();
        Task<T> GetAllShipmentMethodAsync<T>();
        Task<T> GetAllFabApprovalTypesAsync<T>();
        Task<T> GetAllCountryOnSystemAdminActivityAsync<T>();
        Task<T> GetAllCountryOnStatesTabAsync<T>();
        Task<T> GetAllStatesByCountryIdAsync<T>(long? CountryId);
        Task<T> GetAllCurrencyOnSystemAdminAsync<T>();
        Task<T> GetAllUOMAsync<T>();
        Task<T> GetAllBankAccountAsync<T>();
        Task<T> GetAllVendorTermsById<T>(long InvoiceAddressID);

        Task<T> GetClassificationsById<T>(long ClassificationID);

        Task<T> GetProjectTypeById<T>(long ContactTypeID);


        Task<T> UpdateInvoiceTerms<T>(VendorTermsUpdateDto updateDto);


        Task<T> UpdateClassification<T>(ClassificationUpdateDto updateDto);


        Task<T> CreateClassification<T>(ClassificationCreateDto createDto);

        Task<T> CreateVendorTerms<T>(VendorTermsCreateDto createDto);

        Task<T> UpdateProjectContactType<T>(ProjectContactUpdateDto updateDto);

        Task<T> CreateProjectContactType<T>(ProjectContactTypeCreateDto createDto);


        Task<T> GetPaymentscheduleById<T>(long TermID);

        Task<T> GetGetShipmentMethodId<T>(long ShipID);
        Task<T> GetFabApprovalTypesId<T>(long ItemApprovalID);

        Task<T> UpdateShipmentMethod<T>(ShipmentUpdateDto updateDto);


        Task<T> CreateShipmentMethod<T>(ShipmentCreateDto createDto);


        Task<T> UpdatePaymentSchedules<T>(TermsUpdateDto updateDto);
        Task<T> CreatePaymentSchedules<T>(TermsCreateDto createDto);


        Task<T> CreateFabApprovalTypes<T>(ItemApprovalsCreateDto createDto);

        Task<T> UpdateFabApprovalTypes<T>(ItemApprovalsUpdateDto updateDto);


        Task<T> GetCountryById<T>(long CountryID);

        Task<T> UpdateCountry<T>(CountryUpdateDto updateDto);

        Task<T> CreateCountry<T>(CountryCreateDto createDto);


        Task<T> GetStateProvById<T>(long StateID);
        Task<T> UpdateStateProv<T>(StateUpdateDto updateDto);

        Task<T> CreateStateProv<T>(StateCreateDto createDto);

        Task<T> GetCurrencyById<T>(long CurrencyID);

        Task<T> UpdateCurrency<T>(CurrencyUpdateDto updateDto);
        Task<T> CreateCurrency<T>(CurrencyCreateDto createDto);


        Task<T> GetUomById<T>(long UOMID);

        Task<T> UpdateUOM<T>(UOMUpdateDto updateDto);

        Task<T> CreateUOM<T>(UOMCreateDto createDto);


        Task<T> GetBankaccountById<T>(long AccountID);

        Task<T> UpdateBankAccount<T>(BankAccountUpdateDto updateDto);

        Task<T> CreateBankAccount<T>(BankAccountCreateDto createDto);

        Task<T> getMailContent<T>(string mode);
        Task<T> getFileSize<T>();
        Task<T> updateFileSize<T>(int FileSize);
        Task<T> SaveMailTemplate<T>(SaveMailTemplateDto updateDto);

        Task<T> GetInvoiceAddressById<T>(long InvoiceAddressID);
        Task<T> UpdateInvoiceAddress<T>(InvoiceAddressUpdateDto updateDto);
        Task<T> UpdateTersmAndConditionFileName<T>(string FileName);


        #endregion

        #region:: Bridge Supporter

        Task<T> GetAllProject<T>();
        Task<T> GetAllVendor<T>();
        Task<T> GetAllInvoiceDetails<T>(string projectid, string vendorid, string formdate, string todate, int userid);
        Task<T> GetInvoiceHistory<T>(string flid);
        Task<T> EventCanSend<T>(int flid,int status,int userid);
        Task<T> EventIsSent<T>(int flid, int status, int userid);
        Task<T> EventIsPaid<T>(int flid, int status, int userid);
        Task<T> UpdateRefNo<T>(int flid, int refid, int userid);

        Task<T> AllBridgeSupporterVendors<T>(string ProjectID, long UserID, string mode);

        #endregion

        #region :: About
        Task<T> PostUserFeedBack<T>(FeedbackDTO feedbackDTO);
        #endregion

    }
}
