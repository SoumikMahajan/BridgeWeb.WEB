$(function () {
    const _BaseURL = window.location.origin;
    const _QueryParameter = window.location.pathname.split('/');
    const actionName = _QueryParameter[2] || '';
    //var QueryParameter = window.location.pathname.split("/");
    //var action_name = !$.isNull($.getactionname()) ? $.getactionname().toLowerCase() : "";
    //var contollername = !$.isNull($.getcontrollername()) ? $.getcontrollername().toLowerCase() : "";

    RememberMeSetEmail();

    function RememberMeSetEmail() {
        if (localStorage.getItem("rememberMe") === "true") {
            $("#email").val(localStorage.getItem("email"));
            $("#password").val(localStorage.getItem("password"));
            $("#remember_pass").prop("checked", true);
        }
    }

    $(document).on("click", "#btnLogin", function () {
        let EmailAddress = $("#email").val().trim();
        let Password = $("#password").val().trim();
        let RememberMe = $("#remember_pass").is(':checked');

        let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

        let formData = {
            UserName: EmailAddress,
            Password: Password
        };

        let IsValid = formValidateForAddMember(formData);

        if (IsValid) {
            $.ajax({
                url: _BaseURL + "/Home/Login",
                type: 'POST',
                data: formData,
                dataType: 'json',
                beforeSend: function (xhr) {
                    $("#btnLogin").prop("disabled", true);
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    let IsSuccess = data.IsSuccess;
                    if (IsSuccess) {
                        let result = data.Result;

                        if (RememberMe) {
                            localStorage.setItem("rememberMe", "true");
                            localStorage.setItem("email", EmailAddress);
                            localStorage.setItem("password", Password);
                        } else {
                            localStorage.removeItem("rememberMe");
                            localStorage.removeItem("email");
                            localStorage.removeItem("password");
                        }

                        var IsPasswordReset = result.systemUserDto.isPasswordReset;
                        if (IsPasswordReset == 0 || IsPasswordReset == null) {
                            window.location.href = `${_BaseURL}/Home/ResetPassword`;
                            return;
                        }
                        var ismfaEnabled = result.systemUserDto.isMFAEnabled;
                        var userId = result.systemUserDto.fldID;
                        if (ismfaEnabled == true) {

                            window.location.href = `${_BaseURL}/Home/OTPVerification?UserId=` + userId;
                            return;
                        }
                        $.notify.success('Success', 'User Login Succesfully');
                        window.location.href = data.Result.userLastPage ? data.Result.userLastPage : `${_BaseURL}/Home/Dashboard`;
                    }
                    else {
                        $.notify.error('Error', 'Username or password is incorrect! Please check your information and try again.');
                        
                    }
                },
                complete: function () {
                    $("#btnLogin").prop("disabled", false);
                    $(".loader").css("display", "none");
                }
            });
        }
    })

    function formValidateForAddMember(formData) {
        let IsValid = true;
        let Title = "";
        let IsSuccess = false;
        if (formData.UserName === "" || formData.UserName === undefined) {
            IsValid = false;
            Title = "Please enter your E-mail";
            $.notify.warning('Caution', Title);
            document.getElementById("email").focus();
        }
        else if (formData.Password === "" || formData.Password === undefined) {
            IsValid = false;
            Title = "Please enter password";
            $.notify.warning('Caution', Title);
            document.getElementById("password").focus();
        }

        return IsValid;
    }

    $(document).on('click', '#forgetPasswordBtn', function () {
        let EmailAddress = $("#email").val().trim();
        let IsValid = true;
        let Title = "";
        let IsSuccess = false;
        if (EmailAddress === "" || EmailAddress === undefined) {
            IsValid = false;
            Title = "Please Enter Your Email Address";
            $.notify.warning('Caution', Title);
            document.getElementById("email").focus();
        }

        let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

        if (IsValid) {
            $.ajax({
                url: _BaseURL + "/Home/ForgetPassword",
                type: 'POST',
                data: { Email: EmailAddress },
                dataType: 'json',
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', 'An e-mail has been sent to you. Please check your e-mail to reset your account password.');

                        setTimeout(function () {
                            window.location.href = `${_BaseURL}/`;
                        }, 2000);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }
    });

    $(document).on("input", "#Password", function (e) {
        let password = $(this).val();
        $("#passwordRequirements").removeClass("d-none");

        // Rules
        let lengthRule = password.length >= 8 && password.length <= 15;
        let upperRule = /[A-Z]/.test(password);
        let lowerRule = /[a-z]/.test(password);
        let digitRule = /\d/.test(password);
        let specialRule = /[\W_]/.test(password);

        // Update UI
        $("#reqLength").toggleClass("valid", lengthRule);
        $("#reqUpper").toggleClass("valid", upperRule);
        $("#reqLower").toggleClass("valid", lowerRule);
        $("#reqDigit").toggleClass("valid", digitRule);
        $("#reqSpecial").toggleClass("valid", specialRule);
    });

    $(document).on("input", "#ConfirmPassword", function (e) {
        let password = $("#Password").val();
        let confirmPassword = $(this).val();

        $("#confirmPasswordMsg").removeClass("d-none");

        if (confirmPassword === "") {
            $("#matchMsg").text("Please enter confirm password")
                .removeClass("valid")
                .addClass("invalid");
        }
        else if (password === confirmPassword) {
            $("#matchMsg").text("Passwords match ✅")
                .removeClass("invalid")
                .addClass("valid");
        }
        else {
            $("#matchMsg").text("Passwords do not match ❌")
                .removeClass("valid")
                .addClass("invalid");
        }
    });


    $(document).on("click", "#btnReset", function (e) {
        e.preventDefault();
        let password = $("#Password").val()?.trim();
        let cnfPassword = $("#ConfirmPassword").val()?.trim();
        let Title = "";
        if (password === '' || password === undefined || password === null) {
            Title = "Please enter Password";
            $.notify.warning('Caution', Title);
            document.getElementById("Password").focus();
            $("#passwordRequirements").removeClass("d-none");
            return;
        }

        //other validation for PassWord
        if (CheckPassword() == false) {
            return;
        }

        //confirmpassword input empty checking
        if (cnfPassword === '' || cnfPassword === undefined || cnfPassword === null) {
            Title = "Please enter Confirm Password";
            $.notify.warning('Caution', Title);
            document.getElementById("ConfirmPassword").focus();
            $("#confirmPasswordMsg").removeClass("d-none");
            return;
        }

        //checking both passwords match
        if (password !== cnfPassword) {
            Title = "Password and Confirm Password is not match!";
            $.notify.warning('Caution', Title);
            document.getElementById("ConfirmPassword").focus();
            $("#confirmPasswordMsg").removeClass("d-none");
            return;
        }
        let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

        let formData = {
            Password: password,
            ConfirmPassword: cnfPassword
        }

        $.ajax({
            url: _BaseURL + "/Home/ResetPassword",
            type: 'POST',
            data: formData,
            dataType: 'json',
            beforeSend: function (xhr) {
                $(".loader").css("display", "flex");
                xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
            },
            success: function (data) {
                $(".loader").css("display", "none");
                if (data.IsSuccess) {
                    $.notify.success('Success', 'Password Reset Succesfully');
                    setTimeout(function () {
                        window.location.href = `${_BaseURL}/`;
                    }, 2000);
                }
                else {
                    $.notify.error('Error', data.ErrorMessages);
                }
            },
            error: function (error) {
                $(".loader").css("display", "none");
                $.notify.error('Error', error);
            }
        });
    })

    function CheckPassword() {
        let password = $("#Password").val().trim();
        //var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,15}$/;

        let IsValid = true;
        //let Title = "";
        //let IsSuccess = false;

        if (password.length > 7 && password.length < 16) {
            if (password.match(decimal)) {
                IsValid = true;
                return IsValid;
            }
            else {
                $.notify.warning('Caution', 'Password must contain atleast one lowercase,one uppercase,one digit and one special character!');
                IsValid = false;
                return IsValid;
            }
        }
        else {
            $.notify.warning('Caution', 'Password must be between 8 to 15 characters!');
            IsValid = false;
            return IsValid;
        }
    }

    $(document).on("click", "#proceedToLogin", function () {
        window.location.href = `${_BaseURL}/`;
    });

    $(document).on('click', '.eyebutton', function () {
        let passwordobj = $('#password');
        let showbtn = $('#showpw');
        let hidebtn = $('#hidepw');
        if (passwordobj.attr('type') === 'password') {
            passwordobj.attr('type', 'text');
            showbtn.addClass('d-none');
            hidebtn.removeClass('d-none');
        }
        else {
            passwordobj.attr('type', 'password');
            hidebtn.addClass('d-none');
            showbtn.removeClass('d-none');
        }
    });

    const _ActionName = actionName.toLocaleLowerCase();
    if (_ActionName === 'otpverification') {
        let countdownInterval;
        let totalTime = 120; // OTP expires after 5 minutes
        let resendGuardTime = 45; // Resend allowed after 45 seconds
        function startTimer() {

            $('#countdown').text("02:00");

            countdownInterval = setInterval(function () {
                // Decrease OTP countdown
                if (totalTime <= 0) {
                    clearInterval(countdownInterval);
                    $('#countdown').hide();
                    $('#otpexpired').removeClass('d-none');
                    $('.otp_inp').prop('disabled', true);
                    $('#verifyotp').addClass('disabled');
                    $('#otptimer').hide();
                    $('#resendbtn').removeClass('disabled');
                    return;
                }

                let minutes = String(Math.floor(totalTime / 60)).padStart(2, '0');
                let seconds = String(totalTime % 60).padStart(2, '0');
                $('#countdown').text(`${minutes}:${seconds}`);
                totalTime--;

                // Decrease resend guard
                //if (resendGuardTime > 0) {
                //		resendGuardTime--;
                //		$('#resendTimer').text(`(${resendGuardTime}s)`);
                //		if (resendGuardTime === 0) {
                //				$('#resendOtpLink').css({ 'pointer-events': 'auto', 'color': '#00b787' });
                //				$('#resendTimer').hide();
                //		}
                //}
            }, 1000);
        }
        sendotp();
        function sendotp() {
            var userid = $('#hdn_userid').val();
            $.ajax({
                url: "/Home/SendOTP",
                data: { UserId: userid },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        startTimer();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                    $('.otp_inp').val('');
                }
            });
        }

        $(document).on('input', '.otp_inp', function () {
            let value = $(this).val();

            value = value.replace(/\D/g, '').slice(0, 1);

            $(this).val(value);

            if (value.length === 1) {
                $(this).next('.otp_inp').trigger('focus');
            }
        });

        $(document).on('keydown', '.otp_inp', function (e) {
            if (e.key === "Backspace" && $(this).val() === '') {
                $(this).prev('.otp_inp').trigger('focus');
            }
        });

        $(document).on('paste', '.otp_inp', function (e) {
            let pastedData = (e.originalEvent.clipboardData || window.clipboardData).getData('Text').trim();

            pastedData = pastedData.replace(/\D/g, '');
            if (pastedData.length === 4) {
                $('.otp_inp').each(function (index) {
                    $(this).val(pastedData.charAt(index));
                });
                $('.otp_inp').last().trigger('focus');
            }

            e.preventDefault();
        });
        function getFullOtp() {
            return $('.otp_inp').map(function () {
                return $(this).val();
            }).get().join('');
        }

        $(document).on('click', '#verifyotp', function () {

            if ($(this).hasClass('disabled')) return;

            var userid = $('#hdn_userid').val();
            let otp = getFullOtp();
            if (otp.length !== 4) {
                $.notify.warning('Caution', 'Please enter all 4 digits.');
                return;
            }
            $.ajax({
                url: "/Home/VerifyOTP",
                data: { UserId: userid, OTP: otp },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', 'OTP Verification Successful.');
                        window.setTimeout(() => {

                            window.location.href = data.Result.userLastPage ? data.Result.userLastPage : `${_BaseURL}/Home/Dashboard`;
                        }, 2000);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                    $(".loader").css("display", "none");

                }
            })

        });

        $(document).on('click', '#resendbtn', function () {

            if ($(this).hasClass('disabled')) return;

            totalTime = 120;
            clearInterval(countdownInterval);
            $('#otpexpired').addClass('d-none');
            $('#otptimer').show();
            $('#countdown').show();
            $('.otp_inp').prop('disabled', false);
            $('#resendbtn').addClass('disabled');
            $('#verifyotp').removeClass('disabled');
            sendotp();
        });

        $(document).on('click', '#cancelbtn', function () {
            window.location.href = "/Home/Index";
        });
    }
});