using Microsoft.AspNetCore.Http;

namespace BridgeWeb.Domain.Utility
{
    public class FormFileHelper
    {
        public static async Task<IFormFile> GetFormFileFromPathAsync(string filePath, string fieldName = "file")
        {
            byte[] fileBytes = await File.ReadAllBytesAsync(filePath);
            var memoryStream = new MemoryStream(fileBytes);
            var fileName = Path.GetFileName(filePath);
            var contentType = MimeTypeHelper.GetMimeType(fileName);

            var formFile = new FormFile(memoryStream, 0, fileBytes.Length, fieldName, fileName);
            formFile.Headers = new HeaderDictionary();
            formFile.ContentType = contentType;

            return formFile;
        }

    }
}
