using Intuit.Ipp.Core;
using Intuit.Ipp.DataService;
using Intuit.Ipp.QueryFilter;
using Intuit.Ipp.Security;
using Newtonsoft.Json;
using System.Net;

namespace BridgeWeb.WEB.Extensions
{
    public static class FetchDataFromQBO
    {
        public static async Task<T> UsingHttpClient<T>(string Query, string AccessToken,string Key,string? QboBaseUrl)
        {
            string encodedQuery = WebUtility.UrlEncode(Query);
            string searchQuery = string.Format("{0}/v3/company/{1}/query?query={2}", QboBaseUrl, Key, encodedQuery);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + AccessToken);

            var queryResponse = await client.GetStringAsync(searchQuery);

            var dyn = JsonConvert.DeserializeObject(queryResponse);
            var Acc = ((Newtonsoft.Json.Linq.JContainer)((Newtonsoft.Json.Linq.JContainer)dyn).First).First;
            var Acc2 = ((Newtonsoft.Json.Linq.JContainer)((Newtonsoft.Json.Linq.JContainer)Acc).First).First;
            string jsonString = JsonConvert.SerializeObject(Acc2);

            var data = JsonConvert.DeserializeObject<List<T>>(jsonString).FirstOrDefault();
            return data;
        }

        public static Task<T> UsingQueryService<T>(string Query, string AccessToken, string Key, string? QboBaseUrl)
        {
            var validator = new OAuth2RequestValidator(AccessToken);
            var serviceContext = new ServiceContext(Key, IntuitServicesType.QBO, validator);
            serviceContext.IppConfiguration.BaseUrl.Qbo = QboBaseUrl;
            var queryService = new QueryService<T>(serviceContext);
            var response = queryService.ExecuteIdsQuery(Query).FirstOrDefault();
            return Task.FromResult(response);
        }

        public static Task<T> AddUsingQueryService<T>(this T data, string AccessToken, string Key, string QboBaseUrl)
            where T : Intuit.Ipp.Data.IEntity
        {
            var validator = new OAuth2RequestValidator(AccessToken);
            var serviceContext = new ServiceContext(Key, IntuitServicesType.QBO, validator);
            serviceContext.IppConfiguration.BaseUrl.Qbo = QboBaseUrl;
            var service = new DataService(serviceContext);
            T t = service.Add(data);
            return Task.FromResult(t);
        }

        public static Task<T> UpdateUsingQueryService<T>(this T data, string AccessToken, string Key, string QboBaseUrl)
            where T : Intuit.Ipp.Data.IEntity
        {
            var validator = new OAuth2RequestValidator(AccessToken);
            var serviceContext = new ServiceContext(Key, IntuitServicesType.QBO, validator);
            serviceContext.IppConfiguration.BaseUrl.Qbo = QboBaseUrl;
            var service = new DataService(serviceContext);
            T t = service.Update(data);
            return Task.FromResult(t);
        }

        public static Task<bool> DeleteUsingQueryService<T>(this T data, string AccessToken, string Key, string QboBaseUrl)
            where T : Intuit.Ipp.Data.IEntity
        {
            var validator = new OAuth2RequestValidator(AccessToken);
            var serviceContext = new ServiceContext(Key, IntuitServicesType.QBO, validator);
            serviceContext.IppConfiguration.BaseUrl.Qbo = QboBaseUrl;
            var service = new DataService(serviceContext);
            service.Delete(data);
            return Task.FromResult(true);
        }
    }
}
