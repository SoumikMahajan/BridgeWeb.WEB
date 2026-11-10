using Microsoft.AspNetCore.Mvc;

namespace BridgeWeb.WEB.Extensions
{
    public static class RouteConfig
    {
               
        public static Action<IEndpointRouteBuilder> RegisterRoutes => endpoints =>
        {
            #region :: HOME CONTROLLER
           
            endpoints.MapControllerRoute(
                name: "logout",
                pattern: "Home/Logout",
                defaults: new { controller = "Home", action = "Logout" }
            );
            endpoints.MapControllerRoute(
                name: "dashboard",
                pattern: "Home/Dashboard",
                defaults: new { controller = "Home", action = "Dashboard" }
            );                     
            endpoints.MapControllerRoute(
                name: "menubuild",
                pattern: "Home/MenuBuilder",
                defaults: new { controller = "Home", action = "MenuBuilder" }
            );
            endpoints.MapControllerRoute(
                name: "unauthorized-access",
                pattern: "Home/UnauthorizedAccess",
                defaults: new { controller = "Home", action = "UnauthorizedAccess" }
            );
            endpoints.MapControllerRoute(
                name: "forget-password",
                pattern: "Home/ForgetPassword",
                defaults: new { controller = "Home", action = "ForgetPassword" }
            );
            endpoints.MapControllerRoute(
                name: "reset-password",
                pattern: "Home/ResetPassword/{Token}",
                defaults: new { controller = "Home", action = "ResetPassword" }
            );
            endpoints.MapControllerRoute(
                name: "user-activation",
                pattern: "Home/UserActivation/{Token}",
                defaults: new { controller = "Home", action = "UserActivation" }
            );

            #endregion

            #region :: USER CONTROLLER

            endpoints.MapControllerRoute(
                name: "client-interior-designer",
                pattern: "user/ClientandInteriorDesigner",
                defaults: new { controller = "user", action = "ClientandInteriorDesigner" }
            );
            endpoints.MapControllerRoute(
                name: "state-by-country",
                pattern: "user/getStateByCountryId/{countryId}",
                defaults: new { controller = "user", action = "getStateByCountryId" }
            );

            endpoints.MapControllerRoute(
                name: "create-client",
                pattern: "user/createClientId",
                defaults: new { controller = "user", action = "createClientId" }
            );

            endpoints.MapControllerRoute(
                name: "get-all-system-permission-on-add-client-consultant",
                pattern: "user/GetAllSystemPermissionOptionAddClient_Consultant/{userTypeId}",
                defaults: new { controller = "user", action = "GetAllSystemPermissionOptionAddClient_Consultant" }
            );

            endpoints.MapControllerRoute(
                name: "add-user",
                pattern: "user/AddUser",
                defaults: new { controller = "user", action = "AddUser" }
            );

            endpoints.MapControllerRoute(
                name: "is-buyer-dropdown-bind",
                pattern: "user/IsBuyerDropdownBind/{isbuyer}",
                defaults: new { controller = "user", action = "IsBuyerDropdownBind" }
            );
            endpoints.MapControllerRoute(
                name: "get-all-system-permission",
                pattern: "user/GetAllSystemPermissionOption/{isbuyer}",
                defaults: new { controller = "user", action = "GetAllSystemPermissionOption" }
            );
            endpoints.MapControllerRoute(
                name: "get-all-system-permission",
                pattern: "user/GetAllSystemPermissionOption/{isbuyer}",
                defaults: new { controller = "user", action = "GetAllSystemPermissionOption" }
            );
            endpoints.MapControllerRoute(
                name: "check-email",
                pattern: "user/checkEmail/{email}",
                defaults: new { controller = "user", action = "checkEmail" }
            );
            endpoints.MapControllerRoute(
                name: "userlist",
                pattern: "user/UserList",
                defaults: new { controller = "user", action = "UserList" }
            );
            endpoints.MapControllerRoute(
                name: "bind-edit-popUp",
                pattern: "user/BindEditPopUp/{userId}",
                defaults: new { controller = "user", action = "BindEditPopUp" }
            );
            endpoints.MapControllerRoute(
                name: "get-partial-user-list",
                pattern: "user/GetPartialUserList/{isActivefilter}",
                defaults: new { controller = "user", action = "GetPartialUserList" }
            );
            endpoints.MapControllerRoute(
                name: "toggle-active-deactive",
                pattern: "user/ToggleActiveDeactive/{FldID}",
                defaults: new { controller = "user", action = "ToggleActiveDeactive" }
            );
            endpoints.MapControllerRoute(
                name: "default-buyer-by-uid",
                pattern: "user/DefaultBuyerBYUID/{FldID}",
                defaults: new { controller = "user", action = "DefaultBuyerBYUID" }
            );
            endpoints.MapControllerRoute(
                name: "system-level-permission",
                pattern: "user/SystemLevelPermission",
                defaults: new { controller = "user", action = "SystemLevelPermission" }
            );
            endpoints.MapControllerRoute(
                name: "get-all-system-level-permission-bind",
                pattern: "user/GetAllSystemLevelPermissionBind",
                defaults: new { controller = "user", action = "GetAllSystemLevelPermissionBind" }
            );
            endpoints.MapControllerRoute(
                name: "save-system-level-permission",
                pattern: "user/saveSystemLevelPermission",
                defaults: new { controller = "user", action = "saveSystemLevelPermission" }
            );

            #endregion

            //DEFAULT 
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action}/{id?}",
                defaults: new { controller = "Home", action = "Index" }
            );
        };
    }
}
