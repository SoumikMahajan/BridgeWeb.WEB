using BridgeWeb.Domain.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BridgeWeb.WEB.Extensions
{
    public static class APIResponseExtensions
    {
        /// <summary>
        /// Safely unwraps APIResponse.Result into T without double serialization.
        /// Replaces: JsonConvert.DeserializeObject<T>(Convert.ToString(response.Result)!)
        /// </summary>
        public static T? UnwrapResult<T>(this APIResponse response) where T : class
        {
            if (!response.IsSuccess || response.Result is null)
                return null;

            // Newtonsoft stores complex objects as JToken internally
            if (response.Result is JToken jToken)
                return jToken.ToObject<T>();

            // Direct type match (e.g. when T is string or bool)
            if (response.Result is T direct)
                return direct;

            // Last resort only — should rarely hit this path
            var json = JsonConvert.SerializeObject(response.Result);
            return JsonConvert.DeserializeObject<T>(json);
        }

        /// <summary>
        /// Unwraps to a non-nullable T with a default fallback.
        /// </summary>
        public static T UnwrapResultOrDefault<T>(this APIResponse response) where T : class, new()
        {
            return response.UnwrapResult<T>() ?? new T();
        }
    }
}
