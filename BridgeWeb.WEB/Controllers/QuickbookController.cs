using BridgeWeb.Application.Common.Interfaces;
using BridgeWeb.Application.Common.Interfaces.Invoice;
using BridgeWeb.Application.Common.Interfaces.QuickBook;
using BridgeWeb.Domain.Model;
using BridgeWeb.Domain.Model.Dto.Invoice;
using BridgeWeb.Domain.Model.Dto.QuickBook;
using BridgeWeb.WEB.Extensions;
using Intuit.Ipp.Data;
using Intuit.Ipp.Exception;
using Intuit.Ipp.OAuth2PlatformClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace BridgeWeb.WEB.Controllers;

[Authorize]
//[ServiceFilter(typeof(GlobalExceptionRedirection))]
public class QuickbookController : Controller
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly QBOSettings _settings;
    private readonly IQuickBookService _quickBookService;
    private readonly IInvoiceService _invoiceService;
    private readonly ILogService _logService;

    public QuickbookController(IHttpContextAccessor contextAccessor, IOptions<QBOSettings> options, IQuickBookService quickBookService, IInvoiceService invoiceService, ILogService logService)
    {
        _contextAccessor = contextAccessor;
        _settings = options.Value;
        _quickBookService = quickBookService;
        _invoiceService = invoiceService;
        _logService = logService;
    }

    [HttpGet]
    public async Task<IActionResult> Authentication()
    {
        var state = Request.Query["state"];
        var code = Request.Query["code"].ToString();
        var realmId = Request.Query["realmId"].ToString();
        var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

        if (state.Count > 0 && !string.IsNullOrEmpty(code))
        {
            await _logService.LogCustomAsync("Quickbook call received:- Code: " + code + ", RealmId: " + realmId + ", UserId: " + userId);
            await GetAuthTokens(code, realmId, userId);
            return View();
        }
        else
        {
            var authorizeUrl = await _quickBookService.GetAuthorizeURLAsync();
            await _logService.LogCustomAsync("Redirecting to Quickbook authorization URL: " + authorizeUrl);
            return Redirect(authorizeUrl);
        }
    }

    //[HttpGet]
    //public async Task<string> CheckValidity()
    //{
    //    try
    //    {
    //        var accessToken = await GetAccessToken();
    //        string query = "select * from CompanyInfo";
    //        string uri = await GenerateUri(query);

    //        using var client = new HttpClient();

    //        client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
    //        client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
    //        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    //        var res = await client.GetStringAsync(uri);
    //        dynamic? data = JsonConvert.DeserializeObject<dynamic>(res);
    //        string companyName = data?.QueryResponse.CompanyInfo[0].CompanyName!;

    //        var aPIResponse = await _quickBookService.GetToken<APIResponse>();
    //        var apiDataString = aPIResponse.Result?.ToString();
    //        dynamic? apiData = JsonConvert.DeserializeObject<dynamic>(apiDataString!);
    //        string WriteDate = apiData?.writeDate!;

    //        return $"{companyName},{WriteDate}";
    //    }
    //    catch (Exception ex)
    //    {
    //        await _logService.LogExceptionErrorAsync(ex);
    //        return "INVALID";
    //    }
    //}

    [HttpGet]
    public async Task<IActionResult> CheckValidity()
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                return Ok(new
                {
                    IsSuccess = false,
                    RequireAuthentication = true,
                    Message = tokenResponse.ErrorMessages.FirstOrDefault()
                });
            }

            string accessToken = tokenResponse.Result.ToString();


            string query = "select * from CompanyInfo";
            string uri = await GenerateUri(query);

            using var client = new HttpClient();

            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var res = await client.GetStringAsync(uri);
            dynamic data = JsonConvert.DeserializeObject(res)!;

            string companyName = data.QueryResponse.CompanyInfo[0].CompanyName;

            var apiResponse = await _quickBookService.GetToken<APIResponse>();
            var apiDataString = apiResponse.Result?.ToString();
            dynamic apiData = JsonConvert.DeserializeObject(apiDataString)!;

            string writeDate = apiData.writeDate;

            return Ok(new
            {
                IsSuccess = true,
                RequireAuthentication = false,
                CompanyName = companyName,
                WriteDate = writeDate
            });
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);

            return Ok(new
            {
                IsSuccess = false,
                RequireAuthentication = true,
                Message = ex.Message
            });
        }
    }

    public async Task<TokenResponse> RefreshToken(string RefreshToken)
    {
        var tokenResponse = await _quickBookService.RefreshTokenAsync(RefreshToken);
        var tokenDto = new QuickBookTokenDto
        {
            accessToken = tokenResponse.AccessToken,
            accessTokenSecret = tokenResponse.IdentityToken,
            RefreshToken = tokenResponse.RefreshToken,
            TokenType = tokenResponse.TokenType,
            AccessTokenExpire = DateTime.Now.AddSeconds(tokenResponse.AccessTokenExpiresIn),
            RefreshTokenExpire = DateTime.Now.AddSeconds(tokenResponse.RefreshTokenExpiresIn),
            TokenEndpoint = _settings.TokenEndpoint,
            WriteDate = DateTime.Now,
        };

        await _quickBookService.SaveToken<APIResponse>(tokenDto);

        //var claims = new List<Claim>();

        //if (HttpContext.Session.Get("realmId") != null)
        //{
        //    claims.Add(new Claim("realmId", Encoding.UTF8.GetString(HttpContext.Session.Get("realmId")!)));
        //}

        //if (!string.IsNullOrWhiteSpace(tokenResponse.AccessToken))
        //{
        //    claims.Add(new Claim("access_token", tokenResponse.AccessToken));
        //    claims.Add(new Claim("access_token_expires_at", (DateTime.Now.AddSeconds(tokenResponse.AccessTokenExpiresIn)).ToString()));
        //}

        //if (!string.IsNullOrWhiteSpace(tokenResponse.RefreshToken))
        //{
        //    claims.Add(new Claim("refresh_token", tokenResponse.RefreshToken));
        //    claims.Add(new Claim("refresh_token_expires_at", (DateTime.Now.AddSeconds(tokenResponse.RefreshTokenExpiresIn)).ToString()));
        //}

        //var existingIdentity = (ClaimsIdentity)HttpContext.User.Identity;
        //existingIdentity.AddClaims(claims);
        //var qboAuthClaimsPrincipal = new ClaimsPrincipal(existingIdentity);

        //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        //var authProperties = new AuthenticationProperties
        //{
        //    IsPersistent = true,
        //    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(6)
        //};

        //await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, qboAuthClaimsPrincipal, authProperties);

        return tokenResponse;
    }

    public async Task<int> GetAccounts()
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                return 0;
            }

            string accessToken = tokenResponse.Result.ToString();


            const string query = "select * from Account";
            string uri = await GenerateUri(query);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var queryResponse = await client.GetStringAsync(uri);
            var data = JsonConvert.DeserializeObject<QueryResponseDto>(queryResponse);
            var accountCount = data.QueryResponse.Account.Count;

            return accountCount;
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            return 0;
        }
    }

    public async Task<string> UpdateAccountsQBS()
    {
        var apiResponse = new APIResponse();
        var accountCount = await GetAccounts();
        if (accountCount == 0)
        {
            apiResponse.IsSuccess = false;
            apiResponse.ErrorMessages = new List<string> { "No account found!." };
            return JsonConvert.SerializeObject(apiResponse);
        }

        var tokenResponse = await GetAccessToken();

        if (!tokenResponse.IsSuccess)
        {
            apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }

        string accessToken = tokenResponse.Result.ToString();

        if (accountCount < 1000)
        {
            string query = "Select * from Account WHERE Active IN ( True, False ) MaxResults 1000";
            string uri = await GenerateUri(query);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var queryResponse = await client.GetStringAsync(uri);
            var data = JsonConvert.DeserializeObject<QueryResponseDto>(queryResponse);
            var accountList = data.QueryResponse.Account;

            var response = await _quickBookService.UpdateAccountsQBS<APIResponse>(accountList);

            apiResponse.IsSuccess = true;
            apiResponse.Result = "SUCCESS";
            return JsonConvert.SerializeObject(apiResponse);
        }
        else
        {
            for (int i = 1; i <= accountCount; i = i + 1000)
            {
                string query = $"Select * from Account STARTPOSITION {i} MAXRESULTS 1000";
                string uri = await GenerateUri(query);

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
                client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

                var queryResponse = await client.GetStringAsync(uri);
                var data = JsonConvert.DeserializeObject<QueryResponseDto>(queryResponse);
                var accountList = data.QueryResponse.Account;

                var response = await _quickBookService.UpdateAccountsQBS<APIResponse>(accountList);
            }

            apiResponse.IsSuccess = true;
            apiResponse.Result = "SUCCESS";
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> GetAccountDetailsById(string accountId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();

            var accountResponse = await _quickBookService.GetAccountDetailsByAccountId<APIResponse>(accountId);
            var QBid = 0;
            if (accountResponse.Result != null)
            {
                var accountDataString = accountResponse.Result.ToString();
                dynamic accountData = JsonConvert.DeserializeObject<dynamic>(accountDataString);
                QBid = accountData.qBid;
            }
            string query = $"select * from Account where Id = '{QBid}'";
            string uri = await GenerateUri(query);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var queryResponse = await client.GetStringAsync(uri);
            var data = JsonConvert.DeserializeObject<QueryResponseDto>(queryResponse);
            var account = data.QueryResponse.Account.First();

            if (account != null)
            {
                if (account.CurrentBalance > 0)
                {
                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100)
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
                else
                {
                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = "-" + string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100) + ""
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
            }
            else
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> CheckBankAccount(string accountId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();

            var accountResponse = await _quickBookService.GetAccountDetailsByAccountId<APIResponse>(accountId);
            var QBid = 0;
            if (accountResponse.Result != null)
            {
                var accountDataString = accountResponse.Result.ToString();
                dynamic accountData = JsonConvert.DeserializeObject<dynamic>(accountDataString);
                QBid = accountData.qBid;
            }
            string query = $"select * from Account where Id = '{QBid}'";
            string uri = await GenerateUri(query);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("ContentType", "application/json;charset=UTF-8");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var queryResponse = await client.GetStringAsync(uri);
            var data = JsonConvert.DeserializeObject<QueryResponseDto>(queryResponse);
            var account = data.QueryResponse.Account.First();

            if (account != null)
            {
                if (account.CurrentBalance > 0)
                {
                    var balance = string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100);
                    var QboId = account.Id;
                    var currency = account.CurrencyRef.name;
                    var result = $"{balance}({currency})^^^{QBid}";
                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = result
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
                else
                {
                    var balance = "-" + string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100);
                    var QboId = account.Id;
                    var currency = account.CurrencyRef.name;
                    var result = $"{balance}({currency})^^^{QBid}";
                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = result
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
            }
            else
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> SyncPaymentNumber(string PaymentId, decimal Amount)
    {
        try
        {
            var purchase = new Purchase();
            var vendor = new Vendor();
            var deposit = new Deposit();
            var purchaseInfoResponse = new List<PurchaseInfoDto>();
            var QboIdList = new List<string>();
            var syncTokenList = new List<string>();
            var paymentResponse = await _quickBookService.GetQBOPaymentsByPaymentId<APIResponse>(PaymentId);
            if (paymentResponse.Result != null)
            {
                var accountDataString = paymentResponse.Result.ToString();
                dynamic accountData = JsonConvert.DeserializeObject<dynamic>(accountDataString);
                foreach (var item in accountData)
                {
                    QboIdList.Add(item.qboid.ToString());
                    syncTokenList.Add(item.syncToken.ToString());
                }
            }

            if (Amount > 0)
            {
                var index = 0;
                foreach (var qboId in QboIdList)
                {
                    purchase = await GetPurchaseByQboId(qboId);

                    if (purchase is null)
                    {
                        purchaseInfoResponse.Add(new PurchaseInfoDto());
                        _ = await UpdateQboPayments(PaymentId, "", "");
                        continue;
                    }
                    string status = "Active";
                    if (purchase.statusSpecified)
                    {
                        status = purchase.status.ToString();
                    }
                    string syncToken = purchase.SyncToken;
                    var entityRef = purchase.EntityRef.Value.ToString();
                    vendor = await GetVendorById(entityRef);
                    string Checknumber = purchase.DocNumber == null ? "N/A" : purchase.DocNumber.ToString();
                    _ = await UpdateQboPayments(PaymentId, Checknumber, Convert.ToString(purchase.PrintStatus));
                    var purchaseModel = new PurchaseInfoDto
                    {
                        QBOID = purchase.Id,
                        Total = purchase.TotalAmt.ToString(),
                        SyncToken = purchase.SyncToken.ToString(),
                        Status = status,
                        SystemToken = syncTokenList[index++],
                        QboToken = purchase.SyncToken.ToString(),
                        Vendor = vendor.DisplayName.ToString(),
                        CheckNumber = Checknumber
                    };
                    purchaseInfoResponse.Add(purchaseModel);
                }
            }
            else
            {
                var index = 0;
                foreach (var qboId in QboIdList)
                {
                    deposit = await GetDepositsByQboId(qboId);
                    if (deposit is null)
                    {
                        var deleteMessage = await DeleteQboPayments(PaymentId);
                        //var purchaseModelEmpty = new PurchaseInfoDto();
                        //purchaseInfoResponse.Add(purchaseModelEmpty);
                        _ = await UpdateQboPayments(PaymentId, "", "");
                        continue;
                    }
                    string status = string.Empty;
                    if (deposit.statusSpecified)
                    {
                        status = deposit.status.ToString();
                    }

                    string syncToken = deposit.SyncToken.ToString();
                    string CheckNumber = string.Empty;
                    var PrivateNote = string.Empty;

                    if (deposit.PrivateNote is not null)
                    {
                        PrivateNote = deposit.PrivateNote;
                    }
                    if (!PrivateNote.Contains('|'))
                    {
                        CheckNumber = PrivateNote.Trim() == "" ? "N/A" : deposit.PrivateNote.ToString();
                    }
                    else
                    {
                        CheckNumber = PrivateNote.Split('|')[0];
                    }

                    _ = await UpdateQboPayments(PaymentId, CheckNumber, "");
                    var purchaseModel = new PurchaseInfoDto
                    {
                        QBOID = deposit.Id,
                        Total = deposit.TotalAmt.ToString(),
                        SyncToken = deposit.SyncToken.ToString(),
                        Status = status,
                        SystemToken = syncTokenList[index++],
                        QboToken = deposit.SyncToken.ToString(),
                        Vendor = "",
                        CheckNumber = CheckNumber
                    };
                    purchaseInfoResponse.Add(purchaseModel);
                }
            }

            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = purchaseInfoResponse
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = ex.Message
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> CheckInvoiceAccount(string AccountId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();

            var accountResponse = await _quickBookService.GetAccountDetailsByAccountId<APIResponse>(AccountId);
            var QBid = 0;
            if (accountResponse.Result != null)
            {
                var accountDataString = accountResponse.Result.ToString();
                dynamic accountData = JsonConvert.DeserializeObject<dynamic>(accountDataString);
                QBid = accountData.qBid;
            }

            if (QBid == 0)
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string query = $"select * from Account where Id = '{QBid}'";
            var key = await GetRealmId();

            var account = await FetchDataFromQBO.UsingQueryService<Intuit.Ipp.Data.Account>(query, accessToken, key, _settings.QboBaseUrl);

            if (account != null)
            {
                if (account.CurrentBalance > 0)
                {
                    var balance = string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100);
                    var QboId = account.Id;
                    var currency = account.CurrencyRef.name;

                    var result = $"{balance}({currency})^^^{QboId}";

                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = result
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
                else
                {
                    var balance = "-" + string.Format("{0:#.00}", Convert.ToDecimal(account.CurrentBalance * 100) / 100);
                    var QboId = account.Id;
                    var currency = account.CurrencyRef.name;

                    var result = $"{balance}({currency})^^^{QboId}";

                    var apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = result
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }
            }
            else
            {
                var apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> CheckVendor(string Name, string VendorName, string Curr)
    {
        try
        {
            var apiResponse = new APIResponse();

            VendorName = VendorName.Replace("'", "\'");
            string Query = $"select * from Vendor where DisplayName = '{VendorName}'";

            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();


            var key = await GetRealmId();
            var vendor = await FetchDataFromQBO.UsingQueryService<Vendor>(Query, accessToken, key, _settings.QboBaseUrl);

            if (vendor != null)
            {
                var vvc = new Vendor();
                vvc.Id = vendor.Id;
                vvc.SyncToken = vendor.SyncToken;
                vvc.DisplayName = vendor.DisplayName;
                vvc.PrintOnCheckName = VendorName;

                var parentVendorResponse = await _invoiceService.GetParentVendorDetails<APIResponse>(Name, Curr);

                var vsname = string.Empty;

                if (parentVendorResponse.IsSuccess && parentVendorResponse.Result != null)
                {
                    var parentVendorDetails = JsonConvert.DeserializeObject<ParentVendorDetailsDto>(parentVendorResponse.Result.ToString()!) ?? new();

                    vsname = parentVendorDetails.LegalName;

                    var physicalAddress = new PhysicalAddress
                    {
                        Country = parentVendorDetails.Country,
                        City = parentVendorDetails.R_City,
                        PostalCode = parentVendorDetails.R_ZipCode,
                        CountrySubDivisionCode = parentVendorDetails.State,
                        Line1 = parentVendorDetails.R_address
                    };
                    vvc.BillAddr = physicalAddress;

                    var telephoneNumber = new TelephoneNumber
                    {
                        Default = true,
                        DefaultSpecified = true,
                        DeviceType = TelephoneDeviceTypeEnum.Fax.ToString(),
                        FreeFormNumber = parentVendorDetails.Fax
                    };
                    vvc.Fax = telephoneNumber;

                    var primaryNumber = new TelephoneNumber
                    {
                        Default = true,
                        DefaultSpecified = true,
                        FreeFormNumber = parentVendorDetails.Phone,
                        DeviceType = TelephoneDeviceTypeEnum.LandLine.ToString()
                    };
                    vvc.PrimaryPhone = primaryNumber;
                    vvc.Notes = "";

                    var AlternatePhone = new TelephoneNumber
                    {
                        Default = true,
                        DefaultSpecified = true,
                        DeviceType = TelephoneDeviceTypeEnum.Mobile.ToString(),
                        FreeFormNumber = parentVendorDetails.Phone2
                    };
                    vvc.AlternatePhone = AlternatePhone;

                    var emailAddress = new EmailAddress
                    {
                        Address = parentVendorDetails.Email
                    };
                    vvc.PrimaryEmailAddr = emailAddress;

                    var webSiteAddress = new WebSiteAddress
                    {
                        URI = string.IsNullOrWhiteSpace(parentVendorDetails.Website)
                                ? null
                                : ValidateUrl(parentVendorDetails.Website)
                    };
                    vvc.WebAddr = webSiteAddress;

                    Term trms = await GetTermAsync(parentVendorDetails.Terms);

                    if (trms == null && !string.IsNullOrEmpty(parentVendorDetails.Terms))
                    {
                        var ntrm = new Term
                        {
                            Name = parentVendorDetails.Terms,
                            AnyIntuitObjects = [10],
                            ItemsElementName = [ItemsChoiceType.DueDays]
                        };

                        var term = await ntrm.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl);
                        var rf = new ReferenceType
                        {
                            Value = term.Id
                        };
                        vvc.TermRef = rf;
                    }
                    else if (!string.IsNullOrEmpty(parentVendorDetails.Terms))
                    {
                        var rf = new ReferenceType
                        {
                            Value = trms.Id
                        };
                        vvc.TermRef = rf;
                    }
                }

                vvc.CompanyName = vsname;
                vvc.PrintOnCheckName = vsname;
                VendorName = VendorName.Replace("\\'", "'");
                vvc.DisplayName = VendorName;

                if (vendor.CurrencyRef.Value == Curr)
                {
                    var vendorResponse = await vvc.UpdateUsingQueryService(accessToken, key, _settings.QboBaseUrl);
                    apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = vendorResponse.Id
                    };
                }
                else
                {
                    TempData["TempVend"] = vvc;
                    apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = "0"
                    };
                }
            }
            else
            {
                apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    [HttpPost]
    public async Task<string> SaveVendor(string Name, string VendorName, string Curr)
    {
        try
        {
            var apiResponse = new APIResponse();

            var parentVendorResponse = await _invoiceService.GetParentVendorDetails<APIResponse>(Name, Curr);

            Vendor vendor = new Vendor();
            var vsname = string.Empty;
            if (parentVendorResponse.IsSuccess && parentVendorResponse.Result != null)
            {
                var parentVendorDetails = JsonConvert.DeserializeObject<ParentVendorDetailsDto>(parentVendorResponse.Result.ToString()!) ?? new();
                vsname = parentVendorDetails.LegalName;

                var physicalAddress = new PhysicalAddress
                {
                    Country = parentVendorDetails.Country,
                    City = parentVendorDetails.R_City,
                    PostalCode = parentVendorDetails.R_ZipCode,
                    CountrySubDivisionCode = parentVendorDetails.State,
                    Line1 = parentVendorDetails.R_address
                };
                vendor.BillAddr = physicalAddress;

                var telephoneNumber = new TelephoneNumber
                {
                    Default = true,
                    DefaultSpecified = true,
                    DeviceType = TelephoneDeviceTypeEnum.Fax.ToString(),
                    FreeFormNumber = parentVendorDetails.Fax
                };
                vendor.Fax = telephoneNumber;

                var primaryNumber = new TelephoneNumber
                {
                    Default = true,
                    DefaultSpecified = true,
                    FreeFormNumber = parentVendorDetails.Phone,
                    DeviceType = TelephoneDeviceTypeEnum.LandLine.ToString()
                };
                vendor.PrimaryPhone = primaryNumber;

                vendor.Notes = parentVendorDetails.Note;

                var AlternatePhone = new TelephoneNumber
                {
                    Default = true,
                    DefaultSpecified = true,
                    DeviceType = TelephoneDeviceTypeEnum.Mobile.ToString(),
                    FreeFormNumber = parentVendorDetails.Phone2
                };
                vendor.AlternatePhone = AlternatePhone;

                var emailAddress = new EmailAddress
                {
                    Address = parentVendorDetails.Email
                };
                vendor.PrimaryEmailAddr = emailAddress;

                var webSiteAddress = new WebSiteAddress
                {
                    URI = ValidateUrl(parentVendorDetails.Website ?? "")
                };
                vendor.WebAddr = webSiteAddress;

                var key = await GetRealmId();

                var tokenResponse = await GetAccessToken();

                if (!tokenResponse.IsSuccess)
                {
                    apiResponse = new APIResponse
                    {
                        IsSuccess = false,
                        Result = "INVALID"
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }

                string accessToken = tokenResponse.Result.ToString();

                if (!string.IsNullOrEmpty(key))
                {
                    try
                    {
                        string termsQuery = $"select * from Term where Name = '{parentVendorDetails.Terms}'";
                        var terms = await FetchDataFromQBO.UsingQueryService<Term>(termsQuery, accessToken, key, _settings.QboBaseUrl);
                        if (terms == null && !string.IsNullOrEmpty(parentVendorDetails.Terms))
                        {
                            var ntrm = new Term
                            {
                                Name = parentVendorDetails.Terms,
                                AnyIntuitObjects = [10],
                                ItemsElementName = [ItemsChoiceType.DueDays]
                            };
                            var term = await ntrm.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl!);
                            var rf = new ReferenceType
                            {
                                Value = term.Id
                            };
                            vendor.TermRef = rf;
                        }
                        else if (!string.IsNullOrEmpty(parentVendorDetails.Terms))
                        {
                            var rf = new ReferenceType
                            {
                                Value = terms.Id
                            };
                            vendor.TermRef = rf;
                        }
                    }
                    catch (Exception ex)
                    {
                        apiResponse = new APIResponse
                        {
                            IsSuccess = false,
                            Result = $"INVALID^^^{ex.Message}"
                        };
                        await _logService.LogExceptionErrorAsync(ex);
                        return JsonConvert.SerializeObject(apiResponse);
                    }
                }
            }

            vendor.DisplayName = VendorName;
            vendor.CompanyName = vsname;
            vendor.PrintOnCheckName = vsname;
            vendor.CurrencyRef = new ReferenceType
            {
                Value = Curr
            };

            try
            {
                var key = await GetRealmId();
                var tokenResponse = await GetAccessToken();

                if (!tokenResponse.IsSuccess)
                {
                    apiResponse = new APIResponse
                    {
                        IsSuccess = false,
                        Result = "INVALID"
                    };
                    return JsonConvert.SerializeObject(apiResponse);
                }

                string accessToken = tokenResponse.Result.ToString();

                Vendor v = await vendor.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl!);

                apiResponse = new APIResponse
                {
                    IsSuccess = true,
                    Result = v.Id
                };
            }
            catch (IdsException ex)
            {
                apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = $"INVALID^^^{ex.InnerException.Message}"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = $"INVALID^^^{ex.Message}"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    [HttpPost]
    public async Task<string> CheckandSaveVendor(string Curr)
    {
        try
        {
            var apiResponse = new APIResponse();

            var vvc = (Vendor)TempData["TempVend"];
            var PurchaseCountQuery = "Select * from Purchase";
            var PurchaseQuery = "Select * from Purchase MaxResults 1000";
            var key = await GetRealmId();

            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();


            if (!string.IsNullOrEmpty(key))
            {
                var purchaseListForCount = await FetchDataFromQBO.UsingHttpClient<List<Purchase>>(PurchaseCountQuery, accessToken, key, _settings.QboBaseUrl);
                var poCount = purchaseListForCount.Count;
                if (poCount < 1000)
                {
                    var PurchaseList = await FetchDataFromQBO.UsingHttpClient<List<Purchase>>(PurchaseQuery, accessToken, key, _settings.QboBaseUrl);
                    foreach (var purchase in PurchaseList)
                    {
                        if (purchase.EntityRef != null && purchase.EntityRef.Value == vvc.Id)
                        {
                            apiResponse = new APIResponse
                            {
                                IsSuccess = true,
                                Result = "0"
                            };
                            break;
                        }
                    }
                }
                else
                {
                    for (int i = 1; i <= poCount; i++)
                    {
                        string query = $"Select * from Purchase STARTPOSITION {i} MAXRESULTS 1000";
                        var PurchaseList = await FetchDataFromQBO.UsingHttpClient<List<Purchase>>(query, accessToken, key, _settings.QboBaseUrl);
                        foreach (var purchase in PurchaseList)
                        {
                            if (purchase.EntityRef != null && purchase.EntityRef.Value == vvc.Id)
                            {
                                apiResponse = new APIResponse
                                {
                                    IsSuccess = true,
                                    Result = "0"
                                };
                                break;
                            }
                        }
                    }
                }

                var vvc2 = new Vendor();
                vvc2 = vvc;

                vvc.Active = false;
                vvc.ActiveSpecified = true;
                _ = await vvc.UpdateUsingQueryService(accessToken, key, _settings.QboBaseUrl);

                vvc2.CurrencyRef = new ReferenceType
                {
                    Value = Curr
                };
                vvc2.Active = true;
                vvc2.ActiveSpecified = true;
                vvc2.Id = null;

                var v = await vvc2.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl);

                if (apiResponse.Result.ToString() == "0")
                {
                    apiResponse = new APIResponse
                    {
                        IsSuccess = true,
                        Result = v.Id
                    };
                }
            }
            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    [HttpPost]
    public async Task<string> SenddataToQBO([FromBody] QBOCheck Check, [FromQuery] string? UpdatedId)
    {
        try
        {
            var apiResponse = new APIResponse();
            var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);         
            
            var key = await GetRealmId();
            if (string.IsNullOrEmpty(key))
            {
                apiResponse.IsSuccess = false;
                apiResponse.Result = "INVALID";
                return JsonConvert.SerializeObject(apiResponse);
            }

            var tokenResponse = await GetAccessToken();
            if (!tokenResponse.IsSuccess)
            {
                apiResponse = new APIResponse
                {
                    IsSuccess = false,
                    Result = "INVALID"
                };
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();

            if (Convert.ToDecimal(Check.Total) < 0)
            {
                var de = new Deposit();

                if (!string.IsNullOrEmpty(UpdatedId))
                {
                    string query = $"select * from deposit where id = '{UpdatedId}'";

                    var deposit = await FetchDataFromQBO.UsingQueryService<Deposit>(query, accessToken, key, _settings.QboBaseUrl);

                    de.Id = deposit.Id;
                    de.SyncToken = deposit.SyncToken;
                    de.MetaData = deposit.MetaData;
                    de.sparse = false;
                    de.DocNumber = Check.Checknumber;
                    if (!string.IsNullOrEmpty(Check.Memo))
                    {
                        de.PrivateNote = Check.Checknumber + " | " + Check.Memo;
                    }
                    else
                    {
                        de.PrivateNote = Check.Checknumber;
                    }
                    de.TotalAmt = 0 - Convert.ToDecimal(Check.Total);
                    for (int i = 0; i < deposit.Line.Count(); i++)
                    {
                        deposit.Line[i].Amount = 0 - Convert.ToDecimal(Check.Items[i].Total);
                        deposit.Line[i].Description = Check.Items[i].Description;

                        DepositLineDetail jd = new DepositLineDetail();
                        jd.AccountRef = new ReferenceType();
                        jd.AccountRef.Value = Check.Items[0].AccountId;

                        jd.Entity = new ReferenceType();
                        jd.Entity.Value = Check.VendorID;
                        jd.CheckNum = Check.Checknumber;

                        jd.PaymentMethodRef = new ReferenceType();
                        jd.PaymentMethodRef.Value = PaymentMethodEnum.Check.ToString();

                        deposit.Line[i].AnyIntuitObject = jd;
                    }
                    de.CurrencyRef = new ReferenceType();
                    de.CurrencyRef.Value = Check.BankCurr;

                    de.HomeTotalAmtSpecified = true;
                    de.Line = deposit.Line;
                    de.TxnDate = Convert.ToDateTime(Check.Paymentdate);
                    de.TxnDateSpecified = true;

                    de.DepositToAccountRef = new ReferenceType();
                    de.DepositToAccountRef.Value = Check.Bank;

                    de.domain = "QBO";

                    Deposit d = await de.UpdateUsingQueryService(accessToken, key, _settings.QboBaseUrl!);

                    if (string.IsNullOrEmpty(Check.Checknumber))
                    {
                        Check.Checknumber = "N/A";
                    }

                    var updateModel = new QBPPaymentRequestDto
                    {
                        Mode = "UPDATE",
                        PaymentId = Check.BridgePaymentID,
                        VendorId = Check.BridgeVendorID,
                        CheckNumber = Check.Checknumber,
                        Amount = Check.Total,
                        UserId = userId.ToString(),
                        QBOId = d.Id,
                        SyncToken = d.SyncToken,
                    };

                    apiResponse = await _quickBookService.UpdatePaymentForQBOSend<APIResponse>(updateModel);
                }
                else
                {
                    de.DocNumber = Check.Checknumber;
                    if (!string.IsNullOrEmpty(Check.Memo))
                    {
                        de.PrivateNote = Check.Checknumber + " | " + Check.Memo;
                    }
                    else
                    {
                        de.PrivateNote = Check.Checknumber;
                    }

                    Line[] ln = new Line[2];

                    int tmp = 0;
                    decimal amounttotal = 0;
                    string invoicenumbers = "";
                    foreach (var l in Check.Items ?? new())
                    {
                        amounttotal += Convert.ToDecimal(l.Total);
                        invoicenumbers += invoicenumbers == "" ? l.Description : " , " + l.Description;
                    }
                    ln[tmp] = new Line();
                    ln[tmp].Amount = 0 - Convert.ToDecimal(Check.Total);
                    ln[tmp].AmountSpecified = true;

                    var jd = new DepositLineDetail
                    {
                        AccountRef = new ReferenceType()
                        {
                            Value = Check.Items[0].AccountId
                        },
                        Entity = new ReferenceType()
                        {
                            Value = Check.VendorID
                        },
                        CheckNum = Check.Checknumber,
                        PaymentMethodRef = new ReferenceType()
                        {
                            Value = PaymentMethodEnum.Check.ToString()
                        }
                    };

                    ln[tmp].Description = invoicenumbers;
                    ln[tmp].AnyIntuitObject = jd;
                    ln[tmp].DetailType = LineDetailTypeEnum.DepositLineDetail;
                    ln[tmp].DetailTypeSpecified = true;
                    tmp++;

                    ln[tmp] = new Line();
                    ln[tmp].Amount = 0 - Convert.ToDecimal(amounttotal);
                    ln[tmp].AmountSpecified = true;

                    var jd1 = new DepositLineDetail
                    {
                        AccountRef = new ReferenceType()
                        {
                            Value = Check.Bank
                        },
                        Entity = new ReferenceType()
                        {
                            Value = Check.VendorID
                        },
                    };

                    ln[tmp].AnyIntuitObject = jd1;
                    ln[tmp].DetailTypeSpecified = true;

                    de.CurrencyRef = new ReferenceType();
                    de.CurrencyRef.Value = Check.BankCurr!.ToString();
                    de.HomeTotalAmt = 0 - Convert.ToDecimal(Check.Items[0].Total);
                    de.HomeTotalAmtSpecified = true;
                    de.Line = ln;
                    de.TxnDate = Convert.ToDateTime(Check.Paymentdate);
                    de.TxnDateSpecified = true;
                    de.DepositToAccountRef = new ReferenceType();
                    de.DepositToAccountRef.Value = Check.Bank;

                    Deposit d = await de.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl!);

                    var updateModel = new QBPPaymentRequestDto
                    {
                        Mode = "INSERT",
                        PaymentId = Check.BridgePaymentID,
                        VendorId = Check.BridgeVendorID,
                        CheckNumber = Check.Checknumber,
                        Amount = Check.Total,
                        UserId = userId.ToString(),
                        QBOId = d.Id,
                        SyncToken = d.SyncToken,
                    };

                    apiResponse = await _quickBookService.UpdatePaymentForQBOSend<APIResponse>(updateModel);
                }

                if (!apiResponse.IsSuccess)
                {
                    apiResponse.IsSuccess = false;
                    apiResponse.Result = "INVALID";
                    return JsonConvert.SerializeObject(apiResponse);
                }
                else
                {
                    apiResponse.IsSuccess = true;
                    apiResponse.Result = "SUCCESS";
                    return JsonConvert.SerializeObject(apiResponse);
                }
            }
            else
            {
                Purchase pur = new Purchase();
                pur.PaymentType = PaymentTypeEnum.Check;
                pur.PaymentTypeSpecified = true;

                /*Payee info*/
                pur.EntityRef = new ReferenceType();
                pur.EntityRef.Value = Check.VendorID;

                /*check number*/
                if (Check.Type == "Cheque" && (Check.Checknumber == "N/A" || Check.Checknumber == "To be printed"))
                {
                    pur.PrintStatus = PrintStatusEnum.NeedToPrint;
                    pur.PrintStatusSpecified = true;
                }
                else
                {
                    pur.DocNumber = Check.Checknumber;
                }

                /*Memo for check*/
                pur.PrivateNote = Check.Memo;
                pur.TotalAmt = Convert.ToDecimal(Check.Total);
                pur.TotalAmtSpecified = true;

                /*Payment account(Bank account)*/
                pur.AccountRef = new ReferenceType();
                pur.AccountRef.Value = Check.Bank;

                pur.TxnDate = Convert.ToDateTime(Check.Paymentdate);
                pur.TxnDateSpecified = true;
                PhysicalAddress pa = new PhysicalAddress();
                pa.Line1 = Check.MailingAddress;
                pur.RemitToAddr = pa;

                /*Line items assignment. At least one item is mandatory*/
                Line[] ln = new Line[Check.Items!.Count];
                int tmp = 0;
                foreach (var l in Check.Items)
                {
                    ln[tmp] = new Line();
                    ln[tmp].Amount = Convert.ToDecimal(l.Total);
                    ln[tmp].AmountSpecified = true;

                    ln[tmp].DetailType = LineDetailTypeEnum.AccountBasedExpenseLineDetail;
                    ln[tmp].DetailTypeSpecified = true;

                    ln[tmp].Description = l.Description;
                    AccountBasedExpenseLineDetail aaa = new AccountBasedExpenseLineDetail();
                    aaa.AccountRef = new ReferenceType();
                    aaa.AccountRef.Value = l.AccountId;

                    ln[tmp].Id = Convert.ToString(tmp + 1);
                    ln[tmp].AnyIntuitObject = aaa;

                    tmp++;
                }

                pur.GlobalTaxCalculation = GlobalTaxCalculationEnum.NotApplicable;
                pur.GlobalTaxCalculationSpecified = true;
                pur.Line = ln;

                if (!string.IsNullOrEmpty(UpdatedId))
                {
                    string query = $"select * from purchase where id = '{UpdatedId}'";

                    var purchase = await FetchDataFromQBO.UsingQueryService<Purchase>(query, accessToken, key, _settings.QboBaseUrl);
                    if(purchase is not null)
                    {
                        pur.SyncToken = purchase.SyncToken;
                        pur.Id = purchase.Id;
                        Purchase p = await pur.UpdateUsingQueryService(accessToken, key, _settings.QboBaseUrl!);
                        pur.Id = p.Id;

                        apiResponse = await _quickBookService.UpdateQBOPayments<APIResponse>(Check.BridgePaymentID ?? "", pur.DocNumber ?? "", pur.PrintStatus.ToString());

                    }
                    else
                    {
                        apiResponse.IsSuccess = false;
                        apiResponse.Result = "INVALID";
                    }
                }
                else
                {
                    Purchase p = await pur.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl!);
                    pur.Id = p.Id;
                    pur.SyncToken = p.SyncToken;

                    var updateModel = new QBPPaymentRequestDto
                    {
                        Mode = "INSERT",
                        PaymentId = Check.BridgePaymentID,
                        VendorId = Check.BridgeVendorID,
                        CheckNumber = string.IsNullOrWhiteSpace(Check.Checknumber) ? "N/A" : Check.Checknumber,
                        Amount = Check.Total,
                        UserId = userId.ToString(),
                        QBOId = pur.Id,
                        SyncToken = pur.SyncToken,
                    };

                    apiResponse = await _quickBookService.UpdatePaymentForQBOSend<APIResponse>(updateModel);
                }

                if (!apiResponse.IsSuccess)
                {
                    apiResponse.IsSuccess = false;
                    apiResponse.Result = "INVALID";
                    return JsonConvert.SerializeObject(apiResponse);
                }
                else
                {
                    apiResponse.IsSuccess = true;
                    apiResponse.Result = "SUCCESS";
                    return JsonConvert.SerializeObject(apiResponse);
                }

            }

        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);

            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    //[HttpPost]
    //public async Task<string> SenddataToQBO([FromBody] QBOCheck Check,[FromQuery] string? UpdatedId )
    //{
    //    try
    //    {
    //        var apiResponse = new APIResponse();
    //        var userId = Convert.ToInt64(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
    //        var de = new Deposit();
    //        var key = await GetRealmId();
    //        var accessToken = await GetAccessToken();

    //        if (string.IsNullOrEmpty(UpdatedId))
    //        {
    //            de.DocNumber = Check.Checknumber;
    //            if (!string.IsNullOrEmpty(Check.Memo))
    //            {
    //                de.PrivateNote = Check.Checknumber + " | " + Check.Memo;
    //            }
    //            else
    //            {
    //                de.PrivateNote = Check.Checknumber;
    //            }

    //            Line[] ln = new Line[2];

    //            int tmp = 0;
    //            decimal amounttotal = 0;
    //            string invoicenumbers = "";
    //            foreach (var l in Check.Items ?? new ())
    //            {
    //                amounttotal += Convert.ToDecimal(l.Total);
    //                invoicenumbers += invoicenumbers == "" ? l.Description : " , " + l.Description;
    //            }
    //            ln[tmp] = new Line();
    //            ln[tmp].Amount = 0 - Convert.ToDecimal(Check.Total);
    //            ln[tmp].AmountSpecified = true;

    //            var jd = new DepositLineDetail
    //            {
    //                AccountRef = new ReferenceType()
    //                {
    //                    Value = Check.Items[0].AccountId
    //                },
    //                Entity = new ReferenceType()
    //                {
    //                    Value = Check.VendorID
    //                },
    //                CheckNum = Check.Checknumber,
    //                PaymentMethodRef = new ReferenceType()
    //                {
    //                    Value = PaymentMethodEnum.Check.ToString()
    //                }
    //            };

    //            ln[tmp].Description = invoicenumbers;
    //            ln[tmp].AnyIntuitObject = jd;
    //            ln[tmp].DetailType = LineDetailTypeEnum.DepositLineDetail;
    //            ln[tmp].DetailTypeSpecified = true;
    //            tmp++;

    //            ln[tmp] = new Line();
    //            ln[tmp].Amount = 0 - Convert.ToDecimal(amounttotal);
    //            ln[tmp].AmountSpecified = true;

    //            var jd1 = new DepositLineDetail
    //            {
    //                AccountRef = new ReferenceType()
    //                {
    //                    Value = Check.Bank
    //                },
    //                Entity = new ReferenceType()
    //                {
    //                    Value = Check.VendorID
    //                },
    //            };

    //            ln[tmp].AnyIntuitObject = jd1;
    //            ln[tmp].DetailTypeSpecified = true;

    //            de.CurrencyRef = new ReferenceType();
    //            de.CurrencyRef.Value = Check.BankCurr!.ToString();
    //            de.HomeTotalAmt = 0 - Convert.ToDecimal(Check.Items[0].Total);
    //            de.HomeTotalAmtSpecified = true;
    //            de.Line = ln;
    //            de.TxnDate = Convert.ToDateTime(Check.Paymentdate);
    //            de.TxnDateSpecified = true;
    //            de.DepositToAccountRef = new ReferenceType();
    //            de.DepositToAccountRef.Value = Check.Bank;

    //            Deposit d = await de.AddUsingQueryService(accessToken, key, _settings.QboBaseUrl!);

    //            var updateModel = new QBPPaymentRequestDto
    //            {
    //                Mode = "INSERT",
    //                PaymentId = Check.BridgePaymentID,
    //                VendorId = Check.BridgeVendorID,
    //                CheckNumber = Check.Checknumber,
    //                Amount = Check.Total,
    //                UserId = userId.ToString(),
    //                QBOId = d.Id,
    //                SyncToken = d.SyncToken,
    //            };

    //            apiResponse = await _quickBookService.UpdatePaymentForQBOSend<APIResponse>(updateModel);
    //        }
    //        else
    //        {
    //            string query = $"select * from deposit where id = '{UpdatedId}'";

    //            if (!string.IsNullOrEmpty(key))
    //            {
    //                var deposit = await FetchDataFromQBO.UsingQueryService<Deposit>(query, accessToken, key, _settings.QboBaseUrl);
    //                de.Id = deposit.Id;
    //                de.SyncToken = deposit.SyncToken;
    //                de.MetaData = deposit.MetaData;
    //                de.sparse = false;
    //                de.DocNumber = Check.Checknumber;
    //                if (!string.IsNullOrEmpty(Check.Memo))
    //                {
    //                    de.PrivateNote = Check.Checknumber + " | " + Check.Memo;
    //                }
    //                else
    //                {
    //                    de.PrivateNote = Check.Checknumber;
    //                }
    //                de.TotalAmt = 0 - Convert.ToDecimal(Check.Total);
    //                for (int i = 0; i < deposit.Line.Count(); i++)
    //                {
    //                    deposit.Line[i].Amount = 0 - Convert.ToDecimal(Check.Items[i].Total);
    //                    deposit.Line[i].Description = Check.Items[i].Description;

    //                    DepositLineDetail jd = new DepositLineDetail();
    //                    jd.AccountRef = new ReferenceType();
    //                    jd.AccountRef.Value = Check.Items[0].AccountId;

    //                    jd.Entity = new ReferenceType();
    //                    jd.Entity.Value = Check.VendorID;
    //                    jd.CheckNum = Check.Checknumber;

    //                    jd.PaymentMethodRef = new ReferenceType();
    //                    jd.PaymentMethodRef.Value = PaymentMethodEnum.Check.ToString();

    //                    deposit.Line[i].AnyIntuitObject = jd;
    //                }
    //                de.CurrencyRef = new ReferenceType();
    //                de.CurrencyRef.Value = Check.BankCurr;

    //                de.HomeTotalAmtSpecified = true;
    //                de.Line = deposit.Line;
    //                de.TxnDate = Convert.ToDateTime(Check.Paymentdate);
    //                de.TxnDateSpecified = true;

    //                de.DepositToAccountRef = new ReferenceType();
    //                de.DepositToAccountRef.Value = Check.Bank;

    //                de.domain = "QBO";

    //                Deposit d = await de.UpdateUsingQueryService(accessToken, key, _settings.QboBaseUrl!);

    //                var updateModel = new QBPPaymentRequestDto
    //                {
    //                    Mode = "UPDATE",
    //                    PaymentId = Check.BridgePaymentID,
    //                    VendorId = Check.BridgeVendorID,
    //                    CheckNumber = Check.Checknumber,
    //                    Amount = Check.Total,
    //                    UserId = userId.ToString(),
    //                    QBOId = d.Id,
    //                    SyncToken = d.SyncToken,
    //                };

    //                apiResponse = await _quickBookService.UpdatePaymentForQBOSend<APIResponse>(updateModel);
    //            }
    //        }


    //        if (apiResponse.IsSuccess && apiResponse.Result!.ToString() == "FAILED")
    //        {
    //            apiResponse = new APIResponse
    //            {
    //                IsSuccess = false,
    //                Result = "INVALID"
    //            };
    //            return JsonConvert.SerializeObject(apiResponse);
    //        }
    //        else
    //        {
    //            apiResponse = new APIResponse
    //            {
    //                IsSuccess = true,
    //                Result = "SUCCESS"
    //            };
    //            return JsonConvert.SerializeObject(apiResponse);
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        await _logService.LogExceptionErrorAsync(ex);

    //        var apiResponse = new APIResponse
    //        {
    //            IsSuccess = false,
    //            Result = "INVALID"
    //        };
    //        return JsonConvert.SerializeObject(apiResponse);
    //    }
    //}

    public async Task<string> ChangePayment(string PaymentId, string Status)
    {
        try
        {
            var apiResponse = new APIResponse();

            var key = await GetRealmId();

            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Result = "INVALID";
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();

            string query = $"select * from Purchase where id='{PaymentId}'";

            var purchase = await FetchDataFromQBO.UsingQueryService<Purchase>(query, accessToken, key, _settings.QboBaseUrl);
            if (purchase != null)
            {
                purchase.TotalAmt = 0;
                purchase.TotalAmtSpecified = true;
                for (int a = 0; a < purchase.Line.Length; a++)
                {
                    purchase.Line[a].Amount = 0;
                    purchase.Line[a].AmountSpecified = true;
                }
                _ = await FetchDataFromQBO.UpdateUsingQueryService(purchase, accessToken, key, _settings.QboBaseUrl!);
            }

            apiResponse.IsSuccess = true;
            apiResponse.Result = "Success";
            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    public async Task<string> DeletePayment(string PaymentId, string mode)
    {
        try
        {
            var apiResponse = new APIResponse();

            var key = await GetRealmId();

            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Result = "INVALID";
                return JsonConvert.SerializeObject(apiResponse);
            }

            string accessToken = tokenResponse.Result.ToString();


            string query = $"select * from Purchase where id='{PaymentId}'";
            string result = string.Empty;
            var purchase = await FetchDataFromQBO.UsingQueryService<Purchase>(query, accessToken, key, _settings.QboBaseUrl);
            if (purchase != null)
            {
                purchase.TotalAmt = 0;
                purchase.TotalAmtSpecified = true;
                for (int a = 0; a < purchase.Line.Length; a++)
                {
                    purchase.Line[a].Amount = 0;
                    purchase.Line[a].AmountSpecified = true;
                }

                if (mode == "GET")
                {
                    if (purchase.PrintStatus == PrintStatusEnum.NotSet)
                    {
                        result = "Success";
                    }
                    else
                    {
                        result = "Failed";
                    }
                }
                else
                {
                    if (purchase.PrintStatus == PrintStatusEnum.NotSet)
                    {
                        await FetchDataFromQBO.DeleteUsingQueryService(purchase, accessToken, key, _settings.QboBaseUrl!);
                        result = "Success";
                    }
                    else
                    {
                        result = "Failed";
                    }
                }
            }

            apiResponse.IsSuccess = true;
            apiResponse.Result = result;
            return JsonConvert.SerializeObject(apiResponse);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = "INVALID"
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }


    #region :: PRIVATE METHODS
    private async Task<Deposit?> GetDepositsByQboId(string QboId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();

            if (!tokenResponse.IsSuccess)
            {
                return null;
            }

            string accessToken = tokenResponse.Result.ToString();

            var key = await GetRealmId();
            string query = $"select * from Deposit where id='{QboId}'";
            var response = await FetchDataFromQBO.UsingQueryService<Deposit>(query, accessToken, key, _settings.QboBaseUrl);
            return response;
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            return null;
        }
    }

    private async Task<Purchase?> GetPurchaseByQboId(string QboId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();
            if (!tokenResponse.IsSuccess)
            {
                return null;
            }

            string accessToken = tokenResponse.Result.ToString();

            var key = await GetRealmId();
            string query = $"select * from Purchase where id='{QboId}'";
            var response = await FetchDataFromQBO.UsingQueryService<Purchase>(query, accessToken, key, _settings.QboBaseUrl);
            return response;
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            return null;
        }
    }

    private async Task<Vendor?> GetVendorById(string VendorId)
    {
        try
        {
            var tokenResponse = await GetAccessToken();
            if (!tokenResponse.IsSuccess)
            {
                return null;
            }

            string accessToken = tokenResponse.Result.ToString();
            var key = await GetRealmId();
            string query = $"select * from Vendor where id='{VendorId}'";
            var response = await FetchDataFromQBO.UsingQueryService<Vendor>(query, accessToken, key, _settings.QboBaseUrl);
            return response;
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            return null;
        }
    }

    private async System.Threading.Tasks.Task GetAuthTokens(string code, string realmId, long userId)
    {
        

        try
        {
            if (!string.IsNullOrEmpty(realmId))
            {
                HttpContext.Session.Set("realmId", Encoding.UTF8.GetBytes(realmId));
                HttpContext.Session.Set("code", Encoding.UTF8.GetBytes(code));
            }
            var tokenResponse = await _quickBookService.GetBearerTokenAsync(code);
         
            var tokenDto = new QuickBookTokenDto
            {
                accessToken = tokenResponse.AccessToken,
                accessTokenSecret = tokenResponse.IdentityToken,
                RefreshToken = tokenResponse.RefreshToken,
                TokenType = tokenResponse.TokenType,
                AccessTokenExpire = DateTime.Now.AddSeconds(tokenResponse.AccessTokenExpiresIn),
                RefreshTokenExpire = DateTime.Now.AddSeconds(tokenResponse.RefreshTokenExpiresIn),
                TokenEndpoint = _settings.TokenEndpoint,
                WriteDate = DateTime.Now,
                CreatedDate = DateTime.Now,
                CreatedBy = userId,
                IsActive = true,
                IsDelete = false,
                RealmId = realmId
            };



            await _quickBookService.SaveToken<APIResponse>(tokenDto);
            //await _quickBookService.SaveCompanyId<APIResponse>(realmId);
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);
            throw;
        }
        

        //var claims = new List<Claim>();

        //if (HttpContext.Session.Get("realmId") != null)
        //{
        //    claims.Add(new Claim("realmId", Encoding.UTF8.GetString(HttpContext.Session.Get("realmId")!)));
        //}

        //if (!string.IsNullOrWhiteSpace(tokenResponse.AccessToken))
        //{
        //    claims.Add(new Claim("access_token", tokenResponse.AccessToken));
        //    claims.Add(new Claim("access_token_expires_at", (DateTime.Now.AddSeconds(tokenResponse.AccessTokenExpiresIn)).ToString()));
        //}

        //if (!string.IsNullOrWhiteSpace(tokenResponse.RefreshToken))
        //{
        //    claims.Add(new Claim("refresh_token", tokenResponse.RefreshToken));
        //    claims.Add(new Claim("refresh_token_expires_at", (DateTime.Now.AddSeconds(tokenResponse.RefreshTokenExpiresIn)).ToString()));
        //}

        //var existingIdentity = (ClaimsIdentity)HttpContext.User.Identity;
        //existingIdentity.AddClaims(claims);
        //var qboAuthClaimsPrincipal = new ClaimsPrincipal(existingIdentity);

        //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        //var authProperties = new AuthenticationProperties
        //{
        //    IsPersistent = true,
        //    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(6)
        //};

        //await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, qboAuthClaimsPrincipal, authProperties);

    }

    private async Task<string> GetRealmId()
    {
        var companyIdResponse = await _quickBookService.GetCompanyId<APIResponse>();
        if (companyIdResponse?.Result is null)
            throw new InvalidOperationException("CompanyId not found.");

        return companyIdResponse.Result.ToString()!;
    }

    private async Task<string> GenerateUri(string Query)
    {
        var key = await GetRealmId();
        string encodedQuery = WebUtility.UrlEncode(Query);

        string uri = string.Format("{0}/v3/company/{1}/query?query={2}", _settings.QboBaseUrl, key, encodedQuery);
        return uri;
    }

    //private async Task<string> GetAccessToken()
    //{
    //    var aPIResponse = await _quickBookService.GetToken<APIResponse>();
    //    if (aPIResponse?.Result is null)
    //        throw new InvalidOperationException("Token response is empty.");

    //    var apiDataString = aPIResponse.Result.ToString();

    //    if (string.IsNullOrWhiteSpace(apiDataString))
    //        throw new InvalidOperationException("Token response string is empty.");


    //    var apiData = JsonConvert.DeserializeObject<dynamic>(apiDataString);

    //    if (apiData?.refreshToken == null)
    //        throw new InvalidOperationException("Refresh token not found.");

    //    string refreshToken = apiData.refreshToken;

    //    var tokenResponse = await RefreshToken(refreshToken);

    //    return tokenResponse.AccessToken;
    //}

    private async Task<APIResponse> GetAccessToken()
    {
        await _logService.LogCustomAsync("First GetAccessToken method called.");
        var response = new APIResponse();

        try
        {
            var apiResponse = await _quickBookService.GetToken<APIResponse>();

            if (apiResponse?.Result == null)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add("Token response is empty.");
                return response;
            }

            var apiDataString = apiResponse.Result.ToString();

            if (string.IsNullOrWhiteSpace(apiDataString))
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add("Token response string is empty.");
                return response;
            }

            dynamic apiData = JsonConvert.DeserializeObject(apiDataString)!;

            if (apiData?.refreshToken == null)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages.Add("Refresh token not found.");
                return response;
            }

            string refreshToken = apiData.refreshToken;

            var tokenResponse = await RefreshToken(refreshToken);

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = tokenResponse.AccessToken;

            return response;
        }
        catch (Exception ex)
        {
            await _logService.LogExceptionErrorAsync(ex);

            response.IsSuccess = false;
            response.StatusCode = HttpStatusCode.InternalServerError;
            response.ErrorMessages.Add(ex.Message);

            return response;
        }
    }

    private async Task<string> UpdateQboPayments(string PaymentId, string CheckNumber, string PrintStatus)
    {
        var updateResponse = await _quickBookService.UpdateQBOPayments<APIResponse>(PaymentId, CheckNumber, PrintStatus);
        if (updateResponse.Result != null)
        {
            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = updateResponse.Result.ToString()
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
        else
        {
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = updateResponse.Result?.ToString()
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    private async Task<string> DeleteQboPayments(string PaymentId)
    {
        var updateResponse = await _quickBookService.DeleteQBOPayments<APIResponse>(PaymentId);
        if (updateResponse.Result != null)
        {
            var apiResponse = new APIResponse
            {
                IsSuccess = true,
                Result = updateResponse.Result.ToString()
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
        else
        {
            var apiResponse = new APIResponse
            {
                IsSuccess = false,
                Result = updateResponse.Result?.ToString()
            };
            return JsonConvert.SerializeObject(apiResponse);
        }
    }

    private async Task<Term?> GetTermAsync(string Terms)
    {
        try
        {
            string Query = $"select * from Term where Name ='{Terms}'";
            var key = await GetRealmId();
            var tokenResponse = await GetAccessToken();
            if (!tokenResponse.IsSuccess)
            {
                return null;
            }
            string accessToken = tokenResponse.Result.ToString();
            var data = await FetchDataFromQBO.UsingHttpClient<Term>(Query, accessToken, key, _settings.QboBaseUrl);
            if (data != null)
            {
                return data;
            }
            data = await FetchDataFromQBO.UsingQueryService<Term>(Query, accessToken, key, _settings.QboBaseUrl);
            return data;
        }
        catch
        {
            return null;
        }
    }

    private static string ValidateUrl(string Url)
    {
        if (!Url.Contains("http://") && !Url.Contains("https://"))
        {
            Url = "http://" + Url;
        }
        if (Uri.IsWellFormedUriString(Url, UriKind.Absolute))
        {
            return Url;
        }
        else
        {
            return "";
        }
    }

    #endregion
}
