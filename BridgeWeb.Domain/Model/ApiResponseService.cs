using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace BridgeWeb.Domain.Model;

public static class ApiResponseService
{
    private static ContentResult ToJsonResult(APIResponse response)
    {
        return new ContentResult
        {
            Content = JsonConvert.SerializeObject(response),
            ContentType = "application/json",
            StatusCode = (int)response.StatusCode
        };
    }

    public static IActionResult SuccessResponse(object? result) =>
        ToJsonResult(new APIResponse
        {
            StatusCode = HttpStatusCode.OK,
            IsSuccess = true,
            Result = result
        });

    public static IActionResult BadRequestResponse(string errorMessage) =>
        ToJsonResult(new APIResponse
        {
            StatusCode = HttpStatusCode.BadRequest,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        });

    public static IActionResult NotFoundResponse(string errorMessage) =>
        ToJsonResult(new APIResponse
        {
            StatusCode = HttpStatusCode.NotFound,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        });

    public static IActionResult InternalServerResponse(string errorMessage) =>
        ToJsonResult(new APIResponse
        {
            StatusCode = HttpStatusCode.InternalServerError,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        });

    public static APIResponse Success(object? result) =>
        new APIResponse
        {
            StatusCode = HttpStatusCode.OK,
            IsSuccess = true,
            Result = result
        };

    public static APIResponse BadRequest(string errorMessage) =>
        new APIResponse
        {
            StatusCode = HttpStatusCode.BadRequest,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        };

    public static APIResponse NotFound(string errorMessage) =>
        new APIResponse
        {
            StatusCode = HttpStatusCode.NotFound,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        };

    public static APIResponse InternalServer(string errorMessage) =>
        (new APIResponse
        {
            StatusCode = HttpStatusCode.InternalServerError,
            IsSuccess = false,
            ErrorMessages = new List<string> { errorMessage }
        });
}

//public class ApiResponseService
//{
//    public static APIResponse SuccessResponse(object result)
//    {
//        return new APIResponse
//        {
//            StatusCode = HttpStatusCode.OK,
//            IsSuccess = true,
//            Result = result is string ? result.ToString() : result
//        };
//    }

//    public static APIResponse NotFoundResponse(string errorMessage)
//    {
//        return new APIResponse
//        {
//            StatusCode = HttpStatusCode.NotFound,
//            IsSuccess = false,
//            ErrorMessages = new List<string> { errorMessage }
//        };
//    }

//    public static APIResponse BadRequestResponse(string errorMessage)
//    {
//        return new APIResponse
//        {
//            StatusCode = HttpStatusCode.BadRequest,
//            IsSuccess = false,
//            ErrorMessages = new List<string> { errorMessage }
//        };
//    }

//    public static APIResponse InternalServerResponse(string errorMessage)
//    {
//        return new APIResponse
//        {
//            StatusCode = HttpStatusCode.InternalServerError,
//            IsSuccess = false,
//            ErrorMessages = new List<string> { errorMessage }
//        };
//    }

//    public ActionResult<APIResponse> ErrorResponse(string errorMessage)
//    {
//        return new APIResponse
//        {
//            IsSuccess = false,
//            ErrorMessages = new List<string> { errorMessage }
//        };
//    }
//}
