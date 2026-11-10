using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.SystemAdmin;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.SystemAdmin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace BridgeWeb.WEB.Controllers
{
    public class AboutController : Controller
    {
        private IUnitOfWork _unitOfWork;
        private readonly ISystemAdminRepository _systemAdminRepository;
        public AboutController(IUnitOfWork unitOfWork, ISystemAdminRepository systemAdminRepository)
        {
            _unitOfWork = unitOfWork;
            _systemAdminRepository = systemAdminRepository;
        }

        public IActionResult AccessibleCustomerServicePlan()
        {
            return View();
        }

        public IActionResult PrivacyPolicy()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<string> SendFeedbackMail([FromForm] FeedbackDTO feedbackDTO)
        {
            var result = string.Empty;

            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

            feedbackDTO.UserId = userId;

            var response = await _systemAdminRepository.PostUserFeedBack<APIResponse>(feedbackDTO);

            result = JsonConvert.SerializeObject(response);

            return result;
        }
    }
}
