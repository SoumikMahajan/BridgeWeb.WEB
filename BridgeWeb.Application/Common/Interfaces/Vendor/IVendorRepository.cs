using BridgeWeb.Domain.Model.Dto.Vendor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Application.Common.Interfaces.Vendor
{
    public interface IVendorRepository
    {
        #region :: Add Vendor
        Task<T> GetAllCurrencyOnAddVendor<T>();
        Task<T> GetAllClassificationsOnAddVendor<T>();
        Task<T> IsParentVendorExists<T>(string ParentVendorName);
        Task<T> IsEmailExists<T>(string Email);
        Task<T> SaveAllVendorDeatils<T>(CreateVendorAndParentVendorDto createDto);
        Task<T> GetSystemPermissionForVendor<T>(long UserId);
        #endregion

        #region::Vendor List

        Task<T> GetAllVendorList<T>(VendorListRequestDto request);
        Task<T> CheckAuthority<T>(int SecurityID, int userId);
        Task<T> SendVendorContactDetails<T>(SendVendorContactCredentialsDto sendVendorContactCredentialsDto);
        Task<T> ActiveInActiveOnClick<T>(long vendorId,string mode);

        #endregion

        #region:: Vendor Edit

        Task<T> GetAllSelectedClassificationVendor<T>(int parentVemdorId);
        Task<T> GetAllParentVendorDetails<T>(int parentVemdorId);
        Task<T> GetcontactVendorDetails<T>(int parentVemdorId);

        Task<T> UpdateVendor<T>(UpdateParentVendorDto updateDto);
        Task<T> GetSecurityForVendor<T>(long UserId);
        Task<T> UpdateActiveStatus<T>(long vendorId, bool active);
        Task<T> DeleteVendorContact<T>(long vendorId);

        Task<T> GetYTDForVendor<T>(long ParentVendorId, DateTime FromDate, DateTime ToDate);

        Task<T> GetProjetListInEditVendor<T>(long ParentVendorId, DateTime FromDate, DateTime ToDate);


        #endregion

        #region :: VendorContact
        Task<T> GetVendorContactList<T>(VendorContactListRequestDto request);
        Task<T> GetFilteredVendorContactList<T>(string isActive,long UserId);
        Task<T> GetParentVendorById<T>(long ParentVendorid);

        Task<T> GetContactAddressByVendorId<T>(long vendorId);
        Task<T> GetVendorContactByParentVendorId<T>(long parentVendorId,string active);
        Task<T> GetVendorDetailsByVendorId<T>(long vendorId);
        Task<T> GetUserTypeByVendorId<T>(long vendorId);
        Task<T> GetSystemuserDetailsByCreatedBy<T>(long CreatedBy);

        Task<T> UpdateVendorContact<T>(UpdateVendorContactDto updateDto);

        Task<T> UpdateVendorContactAddress<T>(UpdateVendorContactAddress updateDto);
        Task<T> DeleteVendorContactAddress<T>(long AddressId,long UserId);
        Task<T> AddNewVendorContactAddress<T>(ContactAddressCreateDto createDto);

       
        #endregion

        #region:: Add New Contact
        Task<T> CreateNewVendorContactDeatils<T>(VendorCreateDto createDto);
        #endregion

        #region :: Merge Vendor
        Task<T> GetParentVendorDetails<T>(long parentVendorId);
        Task<T> GetVendorListForMerge<T>(long currCode, string ParentVendorId, string isChecked);
        Task<T> MergeVendor<T>(long vendorId, string MergeId,long UpdatedBy);

        #endregion
    }
}
