using Microsoft.AspNetCore.Mvc;

namespace BridgeWeb.WEB.Extensions
{
    public class PageAuthorizationAttribute : TypeFilterAttribute
    {
        public PageAuthorizationAttribute(string role) : base(typeof(PageAuthorizationFilter))
        {
            Arguments = new object[] { role };
        }
    }
}
