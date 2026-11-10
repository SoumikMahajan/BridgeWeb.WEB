using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Utility;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Text;
using static BridgeWeb.Domain.Utility.SD;

namespace BridgeWeb.Infrastructure.Service
{
    public class ApiMessageRequestBuilder : IApiMessageRequestBuilder
    {
        public HttpRequestMessage Build(APIRequest apiRequest)
        {

            if (apiRequest is null)
                throw new ArgumentNullException(nameof(apiRequest));

            if (string.IsNullOrWhiteSpace(apiRequest.Url))
                throw new ArgumentException("Url cannot be null or empty.", nameof(apiRequest.Url));

            if (!Uri.TryCreate(apiRequest.Url, UriKind.Absolute, out var uri))
                throw new ArgumentException("Invalid Url format.", nameof(apiRequest.Url));

            HttpRequestMessage message = new();
            if (apiRequest.ContentType == ContentType.MultipartFormData)
            {
                message.Headers.Add("Accept", "*/*");
            }
            else
            {
                message.Headers.Add("Accept", "application/json");
            }
            message.RequestUri = new Uri(apiRequest.Url);

            //if (apiRequest.Data != null)
            //{
            //    message.Content = new StringContent(JsonConvert.SerializeObject(apiRequest.Data),
            //        Encoding.UTF8, "application/json");
            //}

            if (apiRequest.ContentType == ContentType.MultipartFormData)
            {
                if (apiRequest.Data is null)
                    throw new ArgumentNullException(nameof(apiRequest.Data));

                var content = new MultipartFormDataContent();

                foreach (var prop in apiRequest.Data.GetType().GetProperties())
                {
                    var value = prop.GetValue(apiRequest.Data);
                    //if the file is IFormFile type
                    if (value is IFormFile file)
                    {
                        if (file != null)
                        {
                            var fileContent = new StreamContent(file.OpenReadStream());
                            var mimeType = MimeTypeHelper.GetMimeType(file.FileName);
                            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(mimeType);
                            content.Add(fileContent, prop.Name, file.FileName);
                        }
                    }
                    else if (value is IEnumerable<IFormFile> fileList)
                    {
                        foreach (var formFile in fileList)
                        {
                            if (formFile != null)
                            {
                                var fileContent = new StreamContent(formFile.OpenReadStream());
                                var mimeType = MimeTypeHelper.GetMimeType(formFile.FileName);
                                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(mimeType);

                                content.Add(fileContent, prop.Name, formFile.FileName);
                            }
                        }
                    }
                    //IF the file is byte format
                    else if (value is byte[] byteArray && byteArray.Length > 0)
                    {
                        var byteArrayContent = new ByteArrayContent(byteArray);
                        byteArrayContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
                        content.Add(byteArrayContent, prop.Name, "file.pdf");
                    }
                    else
                    {
                        content.Add(new StringContent(value?.ToString() ?? string.Empty), prop.Name);
                    }
                }

                message.Content = content;
            }
            else
            {
                if (apiRequest.Data != null)
                {
                    message.Content = new StringContent(JsonConvert.SerializeObject(apiRequest.Data),
                        Encoding.UTF8, "application/json");
                }
            }



            switch (apiRequest.ApiType)
            {
                case SD.ApiType.POST:
                    message.Method = HttpMethod.Post;
                    break;
                case SD.ApiType.PUT:
                    message.Method = HttpMethod.Put;
                    break;
                case SD.ApiType.DELETE:
                    message.Method = HttpMethod.Delete;
                    break;
                default:
                    message.Method = HttpMethod.Get;
                    break;

            }

            return message;
        }

    }


}
