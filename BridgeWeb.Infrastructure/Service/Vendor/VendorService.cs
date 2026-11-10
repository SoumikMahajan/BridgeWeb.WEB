using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Vendor;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Vendor;
using BridgeWeb.Domain.Utility;
using Intuit.Ipp.Core.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Infrastructure.Service.Vendor
{
    public class VendorService : IVendorRepository
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string bridgeUrl;
        private readonly IBaseService _baseService;
        private IHttpContextAccessor _httpContextAccessor;

        public VendorService(IHttpClientFactory clientFactory, IConfiguration configuration, IBaseService baseService, IHttpContextAccessor httpContextAccessor)
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

        #region :: Add Vendor
        public async Task<T> GetAllCurrencyOnAddVendor<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-all-currency-on-system-addvendor",
            });
        }

        public async Task<T> GetAllClassificationsOnAddVendor<T>()
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-all-classifications-addvendor",
            });
        }

        public async Task<T> IsParentVendorExists<T>(string ParentVendorName)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/VendorAPI/check-parent-vendor-exists?ParentVendorName={Uri.EscapeDataString(ParentVendorName)}",
            });
        }

        public async Task<T> IsEmailExists<T>(string Email)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/VendorAPI/check-email-exists?email={Uri.EscapeDataString(Email)}",
            });
        }
        public async Task<T> SaveAllVendorDeatils<T>(CreateVendorAndParentVendorDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/VendorAPI/create-vendor-contact-new",
                Data = createDto,
            });
        }
        public async Task<T> GetSystemPermissionForVendor<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url= $"{bridgeUrl}/api/VendorAPI/get-security-for-vendor?UserId={UserId}", 
            });
        }
        #endregion

        #region::Vendor List
        public async Task<T> GetAllVendorList<T>(VendorListRequestDto request)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = request,
                Url = $"{bridgeUrl}/api/VendorAPI/get-all-vendorlist",
            });
        }

        public async Task<T> CheckAuthority<T>(int SecurityID, int userId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/check-authority?SecurityID={SecurityID}&userId={userId}",
            });
        }
        public async Task<T> SendVendorContactDetails<T>(SendVendorContactCredentialsDto sendVendorContactCredentialsDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = sendVendorContactCredentialsDto,
                Url = $"{bridgeUrl}/api/VendorAPI/send-credential-details-of-vendor"
            });
        }
        public async Task<T> ActiveInActiveOnClick<T>(long vendorId,string mode)
        {
            return await _baseService.SendAsync<T>(new APIRequest {
                    ApiType= SD.ApiType.POST,
                    Url= $"{bridgeUrl}/api/VendorAPI/active-inactive-onclick?vendorId={vendorId}&mode={Uri.EscapeDataString(mode)}",
            });
        }

        #endregion

        #region::vendor Edit
        public async Task<T> GetAllSelectedClassificationVendor<T>(int parentVemdorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-selected-vendor-classification?parentvendorid={parentVemdorId}",
            });
        }

        public async Task<T> GetAllParentVendorDetails<T>(int parentVemdorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-all-vendordetails-by-vendorid?parentvendorid={parentVemdorId}",
            });
        }

        public async Task<T> GetcontactVendorDetails<T>(int parentVemdorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-contacts-by-vendorid?parentvendorid={parentVemdorId}",
            });
        }

        public async Task<T> UpdateVendor<T>(UpdateParentVendorDto updateDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateDto,
                Url = $"{bridgeUrl}/api/VendorAPI/update-vendor",
            });
        }

        public async Task<T> GetSecurityForVendor<T>(long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-security-for-vendor?UserId={UserId}",
            });
        }
        public async Task<T> UpdateActiveStatus<T>(long vendorId,bool active)
        {
            return await _baseService.SendAsync <T>(new APIRequest
            {
                ApiType= SD.ApiType.POST,
                Url= $"{bridgeUrl}/api/VendorAPI/active-inactive-VendorContact?vendorId={vendorId}&active={active}"
            });
        }
        public async Task<T> DeleteVendorContact<T>(long vendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {   ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/VendorAPI/delete-vendorcontact-from-edit-vendor-page?vendorId={vendorId}",

            });
        }
        public async  Task<T> GetYTDForVendor<T>(long ParentVendorId, DateTime FromDate, DateTime ToDate)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                //Url = bridgeUrl + "/api/VendorAPI/get-total-po-list-for-vendor/" + ParentVendorId+"/"+FromDate+"/"+ToDate,
                Url = $"{bridgeUrl}/api/VendorAPI/get-total-po-list-for-vendor?ParentVendorId={ParentVendorId}&FromDate={FromDate.ToString("yyyy-MM-dd")}&ToDate={ToDate.ToString("yyyy-MM-dd")}",

            });
        }
        public async Task<T>GetProjetListInEditVendor<T>(long ParentVendorId, DateTime FromDate, DateTime ToDate)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-project-details-in-edit-vendor?ParentVendorId={ParentVendorId}&FromDate={FromDate.ToString("yyyy-MM-dd")}&ToDate={ToDate.ToString("yyyy-MM-dd")}",

            });
        }
        #endregion

        #region ::Vendor Contact List
        public async Task<T> GetVendorContactList<T>(VendorContactListRequestDto request)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = request,
                Url = $"{bridgeUrl}/api/VendorAPI/get-all-vendor-contact/"
            });
        }

        public async Task<T> GetParentVendorById<T>(long ParentVendorid)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-parent-vendor-id?ParentVendorid={ParentVendorid}"
            });
        }
        public async Task<T> GetFilteredVendorContactList<T>(string isActive,long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType= SD.ApiType.GET,
                Url= $"{bridgeUrl}/api/VendorAPI/get-filtered-vendor-contact?isActive={isActive}&UserId={UserId}",
            });
        }
        public async Task<T> GetContactAddressByVendorId<T>(long vendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType=SD.ApiType.GET,
                Url= $"{bridgeUrl}/api/VendorAPI/get-contactAddress-by-vendorId?vendorId={vendorId}"

            });
        }
        public async Task<T> GetVendorContactByParentVendorId<T>(long parentVendorId,string active)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-vendorcontact-by-parentVendorId?parentVendorId={parentVendorId}&active={active}"
            });
        }


        public async Task<T> GetVendorDetailsByVendorId<T>(long vendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType=SD.ApiType.GET,
                Url=($"{bridgeUrl}/api/VendorAPI/get-vendor-details-by-vendorId?vendorId={vendorId}")

            });
        }
        public async Task<T> GetUserTypeByVendorId<T>(long vendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {

                ApiType = SD.ApiType.GET,
                Url= $"{bridgeUrl}/api/VendorAPI/get-userTypeId-by-VendorId?vendorId={vendorId}"
            });
        }

        public async Task<T> GetSystemuserDetailsByCreatedBy<T>(long CreatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-systemUserDetails-by-id?CreatedBy={CreatedBy}",

            });
        }

        public async Task<T> UpdateVendorContact<T>(UpdateVendorContactDto updateVendorContactDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateVendorContactDto,
                Url = $"{bridgeUrl}/api/VendorAPI/update-vendor-contact"

            });
        }
        public async Task<T> UpdateVendorContactAddress<T>(UpdateVendorContactAddress updateVendorContactAddress)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = updateVendorContactAddress,
                Url = $"{bridgeUrl}/api/VendorAPI/update-vendorContactAddress"

            });
        }

        public async Task<T> DeleteVendorContactAddress<T>(long AddressId, long UserId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,                
                Url = $"{bridgeUrl}/api/VendorAPI/delete-vendorcontact-address?AddressId={AddressId}&UserId={UserId}"
            });
        }

        public async Task<T> AddNewVendorContactAddress<T>(ContactAddressCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/VendorAPI/add-vendor-contact-address"

            });
        }

      
        #endregion

        #region:: Add New Contact
        public async Task<T> CreateNewVendorContactDeatils<T>(VendorCreateDto createDto)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Data = createDto,
                Url = $"{bridgeUrl}/api/VendorAPI/insert-new-vendor-contact"
            });
        }

        #endregion

        #region :: Merge Vendor
        public async Task<T> GetParentVendorDetails<T>(long parentVendorId)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-ParentVendor-details-for-mergeVendorContact?parentVendorId={parentVendorId}"
            });
        }
        public async Task<T> GetVendorListForMerge<T>(long currCode, string ParentVendorId, string isChecked)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.GET,
                Url = $"{bridgeUrl}/api/VendorAPI/get-vendor-list-for-merge?currCode={currCode}&ParentVendorId={ParentVendorId}&isChecked={isChecked}"
            });
        }
        public async Task<T> MergeVendor<T>(long vendorId, string MergeId, long UpdatedBy)
        {
            return await _baseService.SendAsync<T>(new APIRequest
            {
                ApiType = SD.ApiType.POST,
                Url = $"{bridgeUrl}/api/VendorAPI/merge-vendor-contact?vendorId={vendorId}&MergeId={MergeId}&UpdatedBy={UpdatedBy}"
            });

        }

        #endregion
    }
}
