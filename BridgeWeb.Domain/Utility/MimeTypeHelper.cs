namespace BridgeWeb.Domain.Utility
{
    public class MimeTypeHelper
    {
        public static string GetMimeType(string fileName)
        {
            string mimeType = "application/octet-stream";
            string ext = Path.GetExtension(fileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(ext))
                return mimeType;

            if (ext == ".pdf") mimeType = "application/pdf";
            else if (ext == ".doc") mimeType = "application/msword";
            else if (ext == ".docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (ext == ".xls") mimeType = "application/vnd.ms-excel";
            else if (ext == ".xlsx") mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            else if (ext == ".ppt") mimeType = "application/vnd.ms-powerpoint";
            else if (ext == ".pptx") mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            else if (ext == ".txt") mimeType = "text/plain";
            else if (ext == ".csv") mimeType = "text/csv";
            else if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            else if (ext == ".png") mimeType = "image/png";
            else if (ext == ".gif") mimeType = "image/gif";
            else if (ext == ".bmp") mimeType = "image/bmp";
            else if (ext == ".zip") mimeType = "application/zip";
            else if (ext == ".rar") mimeType = "application/x-rar-compressed";
            else if (ext == ".xml") mimeType = "application/xml";
            else if (ext == ".json") mimeType = "application/json";
            else if (ext == ".html" || ext == ".htm") mimeType = "text/html";
            else if (ext == ".css") mimeType = "text/css";
            else if (ext == ".js") mimeType = "application/javascript";
            else if (ext == ".mp3") mimeType = "audio/mpeg";
            else if (ext == ".mp4") mimeType = "video/mp4";
            else if (ext == ".avi") mimeType = "video/x-msvideo";
            else if (ext == ".mov") mimeType = "video/quicktime";
            else if (ext == ".wmv") mimeType = "video/x-ms-wmv";

            return mimeType;
        }
    }
}
