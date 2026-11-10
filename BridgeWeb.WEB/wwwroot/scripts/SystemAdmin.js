$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const QueryParameter = window.location.pathname.split("/");
    const action_name = QueryParameter[2].toLocaleLowerCase();
    var flag = 0;
    // #region :: Add Client and Interior Designer
    if (action_name === "clientandinteriordesigner") {
        toggleSecurityPermissions();
        let isDirty = false;

        $(document).on('change keyup', '#create_client_form input, #create_client_form select, #create_client_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });
        function toggleSecurityPermissions() {
            var usertype = $("#user_type").val();
            if (usertype !== "0") {
                $('#security_permissions ').show();
            }
            else {
                $('#security_permissions ').hide();
            }

        }
        $(document).on("change", "#user_type", function () {
            var objdd = $(this).find("option:selected").text();
            var userType = $(this).val();
            systemPermissionforClient_Consultant();
            toggleSecurityPermissions();

            if (userType != "0") {
                $('#usertypeselected ').text(`ADD NEW ${objdd.toUpperCase()}`);
            }
            else {
                $('#usertypeselected').text("ADD NEW USER (Select User Type from DropDown)");
            }

        });
        function systemPermissionforClient_Consultant() {

            var userTypeId = $("#user_type").val();
            if (userTypeId !== "0") {

                $.ajax({
                    url: "/User/GetAllSystemPermissionOptionAddClient_Consultant?userTypeId=" + userTypeId,
                    type: 'GET',
                    contentType: false,
                    processData: false,
                    cache: false,
                    dataType: 'html',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {

                        if (data != '') {
                            $("#security_permissions").show();
                            $("#security_permissions").html('');
                            $("#security_permissions").html(data);
                            function updateHeaderCheckbox($list) {
                                var $checkList = $list.closest('.check_list'); // Find the closest list of checkboxes
                                var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox'); // Find the corresponding header checkbox


                                var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;


                                $headerCheckbox.prop('checked', allChecked);
                            }


                            $('.check_list').each(function () {
                                updateHeaderCheckbox($(this).find('input[type="checkbox"]').first());
                            });
                            $(".loader").css("display", "none");
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }

                    }

                });

            }


        }
        $(document).on("input", "#First_name", function () {
            var uppercaseValue = $(this).val().toUpperCase();
            $(this).val(uppercaseValue);
        });

        $(document).on("input", "#last_name", function () {
            var upperCaseLastName = $(this).val().toUpperCase();
            $(this).val(upperCaseLastName);
        });
        //$('#user_type').change(function () {
        //    toggleSecurityPermissions();

        //});
        $(document).on("change", "#Country", function () {
            countryId = $("#Country").val();
            if (countryId == "0" || countryId == null || countryId == undefined) {
                var stateDropdown = $('#state');
                stateDropdown.empty();
                stateDropdown.append('<option value=""selected>Select a state</option>');
                return false;
            }

            var stateDropdown = $('#state');
            stateDropdown.empty();
            stateDropdown.append('<option value=""selected>Select a state</option>');
            $.ajax({
                url: "/User/getStateByCountryId?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {

                        $.each(data.Result, function (index, state) {

                            stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                            /*  stateDropdown.append('<option value="' + state.StateID + '">' + state.State + '</option>');*/
                            //console.log(state);

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            })

        });

        function shake(element) {
            var interval = 100;
            var distance = 10;
            var times = 4;

            element.css('position', 'relative');

            for (var i = 0; i <= times; i++) {
                element.animate({ left: (i % 2 == 0 ? distance : distance * -1) }, interval);
            }

            element.animate({ left: 0 }, interval);
        }


        $(document).on("click", "#btn_CrtClientOrID", function (e) {

            var divTable = typeof elem === "object" && $(elem).is("input") ? $(elem) : $(".securityoption");
            var userType = $("#user_type ").val();
            var firstName = $("#First_name").val().trim();
            var phone = $("#phone").val().trim();
            var companyName = $("#company_name").val().trim();
            var City = $('#city').val().trim();
            var lastName = $("#last_name").val().trim();
            var phoneExt = $("#phone_ext").val().trim();
            var title = $("#title").val().trim();
            var emailAdd = $("#email_addr").val().trim();
            var address = $("#address").val().trim();
            var countryId = $("#Country ").val();
            var state = $("#state ").val();
            var zipCode = $("#zip_code").val().trim();
            let prioritiesList = [];
            var fd = $.formdata("#create_client_form");
            var mfaenabled = $('#mfaenable')?.is(':checked');
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            fd.append('addUserCreateDto.Firstname', firstName);
            fd.append('addUserCreateDto.Middlename', "");
            fd.append('addUserCreateDto.Lastname', lastName);
            fd.append('addUserCreateDto.Username', "");
            fd.append('addUserCreateDto.Email', emailAdd);
            fd.append('addUserCreateDto.Usertype', userType);
            fd.append('addUserCreateDto.DefaultbuyerID', 0);
            fd.append('addUserCreateDto.Address', address);
            fd.append('addUserCreateDto.City', City);
            fd.append('addUserCreateDto.State', state);
            fd.append('addUserCreateDto.ContactNumber', phone);
            fd.append('addUserCreateDto.Extension', phoneExt);
            fd.append('addUserCreateDto.Country', countryId);
            fd.append('addUserCreateDto.PostalCode', zipCode);
            fd.append('addUserCreateDto.CompanyName', companyName);
            fd.append('addUserCreateDto.CompanyTitle', title);
            fd.append('addUserCreateDto.IsPasswordReset', 0);
            fd.append('addUserCreateDto.mfaenabled', mfaenabled);


            $.each(divTable, function (key, row) {
                var obj = {};
                var $row = $(row);
                var id = $row[0].id;
                let Sp = $("#" + id).data("spid");


                let isSelected = $row[0].checked ? 1 : 0;

                prioritiesList.push({
                    securityid: Sp,
                    isselected: isSelected
                });
                fd.append(`addUserCreateDto.PrioritiesOnListDto[${key}].securityid`, Sp);
                fd.append(`addUserCreateDto.PrioritiesOnListDto[${key}].isselected`, isSelected);

            });

            let formData = {
                Firstname: firstName,
                Middlename: "",
                Lastname: lastName,
                Username: "",
                Email: emailAdd,
                Usertype: userType,
                DefaultbuyerID: 0,
                Address: address,
                City: "",
                State: state,
                ContactNumber: phone,
                Extension: phoneExt,
                Country: countryId,
                PostalCode: zipCode,
                CompanyName: companyName,
                CompanyTitle: title,
                IsPasswordReset: 0,
            };

            var IsValid = formValidationForInput(formData);
            var emailValid = IsEmail(formData.Email);
            if (emailValid === false && formData.Email != "") {
                var title = "Please enter valid Email Address";
                $.notify.warning('Caution', title);
            }
            else if (emailValid === true) {

                if (IsValid) {


                    $.ajax({
                        url: "/User/SaveUser",
                        type: "POST",
                        data: fd,
                        contentType: false,
                        processData: false,
                        async: true,
                        cache: false,
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            $(".loader").css("display", "flex");
                            xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                isDirty = false;
                                $.notify.success('Success', data.Result);
                                window.setTimeout(function () {
                                    window.location.reload();
                                }, 2000);
                            }
                            else {
                                $.notify.success('Success', data.ErrorMessages);
                            }

                        }

                    });
                }


            }
        });
        function IsEmail(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;
            if (!regex.test(email)) {
                return false;
            }
            else {
                return true;
            }
        }

        $(document).on("click", "#uncheck", function (ev) {
            ev.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', false);
            $('input[type="checkbox"].headerCheckbox').prop('checked', false);

        });
        $(document).on("click", "#check", function (event) {
            event.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', true);
            $('input[type="checkbox"].headerCheckbox').prop('checked', true);
        });

        $(document).on("click", ".headerCheckbox", function (e) {
            var isChecked = $(this).is(':checked');
            $(this).closest('.check_hdng').next('.check_list').find('input[type="checkbox"]').each(function () {
                $(this).prop('checked', isChecked);
            });
        });

        $(document).on("click", ".project_check", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            let endIndex = id.length - 1;
            var headerid = id.substring(0, endIndex);

            if (headerid == 'Expediting') {

                if (id == 'Expediting1' && _this[0].checked == true) {
                    $("#Expediting0").prop('checked', true);
                }
                else if (id == 'Expediting1' && _this[0].checked == false) {
                    $("#Expediting0").prop('checked', false);
                }
            }

            var $checkList = $(this).closest('.check_list');
            var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox');
            var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;
            $headerCheckbox.prop('checked', allChecked);

        });

        function formValidationForInput(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Usertype === "0" || formData.Usertype === undefined) {
                IsValid = false;
                Title = "Please select user type";
                $.notify.warning('Caution', Title);
            }
            else if (formData.ContactNumber !== "" && formData.ContactNumber.length > 10) {
                $.notify.warning('Caution', 'Phone number cannot be more than 10 digits');
                return false;
            }

            else if (formData.ContactNumber !== "" && formData.ContactNumber.length < 10) {
                $.notify.warning('Caution', 'Phone number must be 10 digits');
                return false;
            }
            else if (formData.Firstname === "" || formData.Firstname === undefined) {
                IsValid = false;
                Title = "Please enter First Name";
                var inputField = $('#First_name');
                $.notify.warning('Caution', Title);
                $("#First_name").attr("placeholder", "PLEASE ENTER FIRST NAME").trigger('focus');
                shake(inputField);

            }
            else if (formData.Lastname === "" || formData.Lastname === undefined) {
                IsValid = false;
                Title = "Please Enter Last Name";
                var LastName = $('#last_name');
                $.notify.warning('Caution', Title);
                $("#last_name").attr("placeholder", "PLEASE ENTER LAST NAME").trigger('focus');
                shake(LastName);
            }
            else if (formData.Email === "" || formData.Email === undefined) {
                IsValid = false;
                Title = "Please Enter Email";
                var Email = $('#email_addr');
                $.notify.warning('Caution', Title);
                $("#email_addr").attr("placeholder", "PLEASE ENTER EMAIL").trigger('focus');
                shake(Email);

            }

            return IsValid;
        }

        $(document).on("keyup", "#email_addr", function () {
            var email = $("#email_addr").val();
            var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;
            var eaddress = email;
            var rdd = $(this);
            $(rdd).parent().find('.emailexists').remove();
            if (email != '' && reg.test(eaddress) == false) {

                $(this).addClass('errorClass');

                return false;
            }
            if (email == '') {

                $(this).removeClass('errorClass');
                return false;
            }

            $.ajax({
                url: "/User/checkEmail?email=" + email,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(rdd).removeClass('errorClass');
                        $(rdd).parent().find('.emailexists').remove();
                    }
                    else {
                        $(rdd).addClass('errorClass');
                        if ($(rdd).parent().find('.emailexists').length == 0) {
                            $(rdd).prev('label').after('<span class="errorClass emailexists"> (Email Exists) </span>');
                        }
                    }
                    $(".loader").css("display", "none");

                }

            });

        });

    }
    // #endregion

    // #region :: Add User
    if (action_name === "adduser") {
        let isDirty = false;

        $(document).on('change keyup', '#create_user_form input, #create_user_form select, #create_user_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $(document).on("change", "#is_buyer", function () {
            var isbuyer = $("#is_buyer option:selected").val();

            $.ajax({
                url: "/User/IsBuyerDropdownBind?isbuyer=" + isbuyer,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#default_buyer").html('');
                        $("#default_buyer").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }

            });
        });
        function shake(element) {
            var interval = 100;
            var distance = 10;
            var times = 4;

            element.css('position', 'relative');

            for (var i = 0; i <= times; i++) {
                element.animate({ left: (i % 2 == 0 ? distance : distance * -1) }, interval);
            }

            element.animate({ left: 0 }, interval);
        }
        _systemAccessPermissionOptionBind();

        $(document).on("change", "#user_type", function () {
            _systemAccessPermissionOptionBind();
        });

        function _systemAccessPermissionOptionBind() {
            var isbuyer = $("#user_type option:selected").val();
            $.ajax({
                url: "/User/GetAllSystemPermissionOption?isbuyer=" + isbuyer,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        if (isbuyer === "0") {
                            $("#systemaccessOption").hide();
                            $("#systemaccessOption").html('');
                            $("#systemaccessOption").html(data);
                            function updateHeaderCheckbox($list) {
                                var $checkList = $list.closest('.check_list'); // Find the closest list of checkboxes
                                var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox'); // Find the corresponding header checkbox


                                var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;


                                $headerCheckbox.prop('checked', allChecked);
                            }


                            $('.check_list').each(function () {
                                updateHeaderCheckbox($(this).find('input[type="checkbox"]').first());
                            });
                        }
                        else {
                            $("#systemaccessOption").show();
                            $("#systemaccessOption").html('');
                            $("#systemaccessOption").html(data);
                            function updateHeaderCheckbox($list) {
                                var $checkList = $list.closest('.check_list');
                                var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox');


                                var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;


                                $headerCheckbox.prop('checked', allChecked);
                            }


                            $('.check_list').each(function () {
                                updateHeaderCheckbox($(this).find('input[type="checkbox"]').first());
                            });
                        }

                    }
                    $(".loader").css("display", "none");

                }
            });
        }

        $(document).on("click", "#SvaeUser", function () {
            var divTable = typeof elem === "object" && $(elem).is("input") ? $(elem) : $(".systemoption");
            var firstName = $("#First_name").val().trim();
            var lastname = $("#last_name").val().trim();
            var email = $("#email_addr").val().toLowerCase().trim();
            var userType = $("#user_type option:selected").val();
            var defaultbyer = $("#default_buyer option:selected").val();
            let isbuyer = $("#is_buyer option:selected").val();
            let prioritiesList = [];

            var plength = 8;
            var keylist = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var temp = ''
            var isupperchar = false;
            var isnumber = false;
            var islowerchar = false;
            var mfaenabled = $('#mfaenable')?.is(':checked');
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            temp = ''
            while (isupperchar == false || isnumber == false || islowerchar == false) {
                temp = '';
                for (i = 0; i < plength; i++) {
                    var tmp = keylist.charAt(Math.floor(Math.random() * keylist.length));
                    var ccode = tmp.charCodeAt(0);
                    if ((ccode > 64 && ccode < 91)) {
                        isupperchar = true;
                    }
                    else if ((ccode > 96 && ccode < 123)) {
                        islowerchar = true;
                    }
                    else if (ccode > 47 && ccode < 58) {
                        isnumber = true;
                    }
                    temp += tmp;
                }
            }

            var fd = $.formdata("#create_user_form");

            fd.append('addUserCreateDto.Firstname', firstName);
            fd.append('addUserCreateDto.Lastname', lastname);
            fd.append('addUserCreateDto.Username', "");
            fd.append('addUserCreateDto.Email', email);
            fd.append('addUserCreateDto.UserPassword', temp);
            fd.append('addUserCreateDto.Usertype', userType);
            if (isbuyer === "0") {
                fd.append('addUserCreateDto.Isbuyer', false);
            }
            else {
                fd.append('addUserCreateDto.Isbuyer', true);
            }

            fd.append('addUserCreateDto.DefaultbuyerID', defaultbyer);
            fd.append('addUserCreateDto.Token', "");
            fd.append('addUserCreateDto.mfaenabled', mfaenabled);

            $.each(divTable, function (key, row) {
                var obj = {};
                var $row = $(row);
                var id = $row[0].id;
                let sysid = $("#" + id).data("sysid");
                let isSelected = $row[0].checked ? 1 : 0;

                prioritiesList.push({
                    securityid: sysid,
                    isselected: isSelected
                });
                fd.append(`addUserCreateDto.PrioritiesOnListDto[${key}].securityid`, sysid);
                fd.append(`addUserCreateDto.PrioritiesOnListDto[${key}].isselected`, isSelected);

            });
            let formData = {
                Firstname: firstName,
                Middlename: "",
                Lastname: lastname,
                Username: "",
                Email: email,

                Usertype: userType,
                DefaultbuyerID: 0,

            };

            var IsValid = formValidationForAddUser(formData);

            if (IsValid) {
                $.ajax({
                    url: "/User/SaveUser",
                    type: 'POST',
                    data: fd,
                    contentType: false,
                    processData: false,
                    async: true,
                    cache: false,
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            isDirty = false;
                            $.notify.success('Success', data.Result);
                            window.setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }
        });

        $(document).on("keyup", "#email_addr", function () {
            var email = $("#email_addr").val();
            var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;
            var eaddress = email;
            var rdd = $(this);
            $(rdd).parent().find('.emailexists').remove();
            if (email != '' && reg.test(eaddress) == false) {

                $(this).addClass('errorClass');

                return false;
            }
            if (email == '') {

                $(this).removeClass('errorClass');
                return false;
            }

            $.ajax({
                url: "/User/checkEmail?email=" + email,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if ($.parseBool(data.IsSuccess)) {
                        $(rdd).removeClass('errorClass');
                        $(rdd).parent().find('.emailexists').remove();
                    }
                    else {
                        $(rdd).addClass('errorClass');
                        if ($(rdd).parent().find('.emailexists').length == 0) {
                            $(rdd).prev('label').after('<span class="errorClass emailexists"> (Email Exists) </span>');
                        }
                    }
                    $(".loader").css("display", "none");

                },
                error: function (error) {
                    $(rdd).parent().find('.emailexists').remove();
                    $(".loader").css("display", "none");
                    if (xhr.status === 401 || xhr.status === 403)
                        window.location.href = '/Home/Index';

                    let errorMessage = "Something went wrong.";

                    try {
                        // If response is JSON, try to extract 'message' field
                        const response = JSON.parse(xhr.responseText);
                        if (response && response.message) {
                            errorMessage = response.message;
                        } else if (xhr.statusText) {
                            errorMessage = xhr.statusText;
                        }
                    } catch {
                        errorMessage = error || xhr.statusText || "Unknown error occurred.";
                    }

                    $.notify.error('Error', errorMessage);
                    console.error(`[AJAX Error] ${xhr.status}: ${errorMessage}`);
                },

            });
        });

        function formValidationForAddUser(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;

            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;;

            if (formData.Usertype === "" || formData.Usertype === "0") {
                IsValid = false;
                Title = "Please select user type";
                $.notify.warning('Caution', Title);
            }

            else if (formData.Firstname === "" || formData.Firstname === undefined) {
                IsValid = false;
                Title = "Please enter First Name";
                notify(IsSuccess, Title, IsValid);
                $("#First_name").attr("placeholder", "PLEASE ENTER FIRST NAME").trigger('focus');

            }
            else if (formData.Lastname === "" || formData.Lastname === undefined) {
                IsValid = false;
                Title = "Please Enter Last Name";
                $.notify.warning('Caution', Title);
                $("#last_name").attr("placeholder", "PLEASE ENTER LAST NAME").trigger('focus');
            }
            else if (formData.Email === "" || formData.Email === undefined) {
                IsValid = false;
                Title = "Please Enter Email";
                $.notify.warning('Caution', Title);
                $("#email_addr").attr("placeholder", "PLEASE ENTER EMAIL").trigger('focus');
                var element = $("#email_addr");
                shake(element);

            }
            else if (!emailRegex.test(formData.Email)) {
                IsValid = false;
                Title = "Please Enter a Valid Email";
                $.notify.warning('Caution', Title);
                $("#email_addr").val("").attr("placeholder", "PLEASE ENTER VALID EMAIL").trigger('focus');
                var element = $("#email_addr");
                shake(element);
            }

            return IsValid;
        }

        $(document).on("click", "#uncheckall", function (ev) {
            ev.preventDefault();
            $('.project_check.systemoption').prop('checked', false);
            $('.headerCheckbox').prop('checked', false);

        });
        $(document).on("click", "#checkall", function (event) {
            event.preventDefault();
            //$('input[type="checkbox"]').prop('checked', true);
            $('.project_check.systemoption').prop('checked', true);
            $('.headerCheckbox').prop('checked', true);

        });

        $(document).on("click", ".headerCheckbox", function (e) {

            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var _divhtml = $(".systemoption");

            $.each(_divhtml, function (key, val) {
                if (_this[0].checked == true) {
                    $("#" + id + key + "").prop('checked', true);
                }
                else {
                    $("#" + id + key + "").prop('checked', false);
                }
            })

        })
        $(document).on("click", ".project_check", function () {
            var $checkList = $(this).closest('.check_list');
            var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox');
            var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;
            $headerCheckbox.prop('checked', allChecked);
        });




        $(document).on("click", ".systemoption", function (e) {

            var _this = $(e.currentTarget);
            var id = _this[0].id;
            let endIndex = id.length - 1;
            var headerid = id.substring(0, endIndex);

            //This if/else is for read getting automatically checked and unchecked based on Edit Permission.

            if (headerid == 'Expediting') {

                if (id == 'Expediting1' && _this[0].checked == true) {
                    $("#Expediting0").prop('checked', true);
                }
                else if (id == 'Expediting1' && _this[0].checked == false) {
                    $("#Expediting0").prop('checked', false);
                }
            }

            /*This checked the length of li's under header And then counts the li's with input that are checked if both the length of total li's under Header and length of checked  li's input matches
            then only the header is checked else unchecked*/

            let allChecked = $(`input[id^='${headerid}']`).not(`#${headerid}`).length ===
                $(`input[id^='${headerid}']`).not(`#${headerid}`).filter(':checked').length;

            $(`#${headerid}`).prop('checked', allChecked);

        });
    }
    // #endregion

    // #region :: All Users
    if (action_name === "userlist") {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        GetUserList();

        function GetUserList() {
            $("#userList_table thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#userList_table thead");

            let columnFilterValues = {};
            let debounceTimer;
            var IsActive = null;
            var userTypeFilter = null;
            var IsBuyer = null;
            function debounce(fn, delay) {
                return function (...args) {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            var table = $('#userList_table').DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                orderCellsTop: true,
                scrollX: true,
                processing: false,
                serverSide: true,
                destroy: true,
                lengthMenu: [10, 25, 50, 100],
                order: [[2, 'asc']],
                ajax: {
                    url: '/User/UserListTableBind',
                    type: 'POST',
                    contentType: 'application/json',
                    data: function (d) {
                        let sortColumn = null;
                        let sortDirection = null;

                        if (d.order && d.order.length > 0) {
                            sortColumn = d.columns[d.order[0].column].data;
                            sortDirection = d.order[0].dir;
                        }
                        return JSON.stringify({
                            Draw: d.draw,
                            Search: d.search.value,
                            Start: d.start,
                            Length: d.length,
                            IsActive: IsActive,
                            SystemUserType: userTypeFilter,
                            SortColumn: sortColumn,
                            SortDirection: sortDirection,
                            ColumnFilters: columnFilterValues,
                            Isbuyer: IsBuyer
                        });
                    },
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    complete: function () {
                        $(".loader").css("display", "none");
                    }
                },
                columns: [
                    {
                        data: null,
                        title: "Action",
                        orderable: false,
                        render: function (data, type, row) {
                            let updateIcon = `<i class="fa-regular fa-hand-point-right pointer edituserlist " data-bs-toggle="modal"
                                        data-id="${row.fldID}" id="btn-edit"></i>`
                            return `<div class="text-center">${updateIcon}</div>`;
                        }
                    },
                    {
                        data: "Isactive",
                        title: "Activation",
                        orderable: false,
                        render: function (data, type, row) {
                            const iconClass = row.isactive === true ? "fa-check-circle" : "fa-times-circle";
                            return `<i class="fa ${iconClass} acinAc activeUser" style="cursor:pointer;" data-id="${row.fldID}"></i>`;
                        }
                    },
                    {
                        data: "FldID",
                        title: "User ID",
                        render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.fldID}" title="${row.fldID}">${row.fldID}</p>`;
                        }
                    },
                    {
                        data: "Firstname",
                        title: "First Name",
                        render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.firstname}" title="${row.firstname}">${row.firstname}</p>`;
                        }
                    },
                    {
                        data: "LastName",
                        title: "Last Name",
                        render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.lastname}" title="${row.lastname}">${row.lastname}</p>`;
                        }
                    },
                    {
                        data: "Email",
                        title: "E-mail",
                        render: function (data, type, row) {
                            return `<a style="color:#7792a8;" href="mailto:${row.email || ''}">${row.email || ''}</a>`;
                        }
                    },
                    {
                        data: "Usertype",
                        title: "User Type",
                        orderable: false,
                        render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.systemUserType}" title="${row.systemUserType}">${row.systemUserType}</p>`;
                        }
                    },
                    {
                        data: "Isbuyer",
                        title: "Buyer",
                        orderable: false,
                        render: function (data, type, row) {
                            return row.isbuyer ? 'Yes' : 'No';
                        }
                    }
                ],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    {
                        /*targets: 8,*/ // Index of the 'Active' column (starting from 0)
                        visible: false, // Hide the column from both <th> and <td>
                        searchable: true // Keep it searchable
                    },
                    { targets: [0, 1], orderable: false }
                ],
                initComplete: function () {
                    var api = this.api();
                    api.columns().eq(0).each(function (colIdx) {
                        var column = api.column(colIdx);
                        var cell = $(".filters th").eq($(column.header()).index());
                        var title = $(cell).text();

                        if (colIdx === 0) {
                            $(cell).html(
                                '<button type="button" class="porde_list_reset_btn" id="resetUsertable">Reset</button>'
                            );
                        }
                        else if (colIdx === 1) {
                            $(cell).html(`
                        <select class="form-select" id="filterbtn">
                            <option value="" selected>All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    `);
                            $('#filterbtn').on('change', function () {
                                const isActiveVal = this.value;
                                IsActive = isActiveVal === "" ? null : parseInt(isActiveVal);

                                const Val = $("#userTypeFilter option:selected").val();
                                SystemUserType = Val === "" ? null : Val;

                                table.draw();
                            });
                        }
                        else if (colIdx === 6) {
                            $(cell).html(`
                        <select class="form-select" id="userTypeFilter"><option value="">All</option> <option value="Administrator">Administrator</option><option value="Buyer">Buyer</option><option value="Client/Operator">Client/Operator</option> <option value="Consultant">Consultant</option><option value="Accountant">Accountant</option></select>
                    `);
                            $('#userTypeFilter').on('change', function () {
                                const filter = this.value;
                                userTypeFilter = filter === "" ? null : filter;

                                const ActiveVal = $("#filterbtn option:selected").val();
                                IsActive = ActiveVal === "" ? null : parseInt(ActiveVal);
                                table.draw();
                            });
                        }
                        else if (colIdx === 7) {
                            $(cell).html(`<select class="form-select" id="isbuyer"><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select>`)
                            $('#isbuyer').on('change', function () {
                                debugger;
                                const buyer = this.value;
                                IsBuyer = buyer === "" ? null : (buyer === "true");

                                const Val = $("#userTypeFilter option:selected").val();
                                SystemUserType = Val === "" ? null : Val;

                                const ActiveVal = $("#filterbtn option:selected").val();
                                IsActive = ActiveVal === "" ? null : parseInt(ActiveVal);
                                table.draw();
                            });
                        }
                        else {
                            // For other columns, add input elements
                            $(cell).html('<input type="text" id="advSr_' + title + '" class="form-control search" placeholder="🔍 Search..." autocomplete="off" />');

                            $("input", cell).on("input", debounce(function () {

                                var columnName = column.dataSrc();
                                var value = this.value.trim();

                                if (value === "") {
                                    delete columnFilterValues[columnName];
                                }
                                else {
                                    columnFilterValues[columnName] = value;
                                }

                                table.draw();

                            }, 300));
                        }

                    })
                },
                drawCallback: function () {
                    $('html, body').animate({ scrollTop: 0 }, 300);
                }
            });
            // Listen to page length change event
            $('#userList_table').on('length.dt', function (e, settings, len) {
                //SetProjectPreference('DataTable.PageLength', len);
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }
        //function GetUserList() {
        //    $.ajax({
        //        url: '/User/GetPartialUserList',
        //        type: 'GET',
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (data) {
        //            if (data != null) {
        //                $('#partialUserList').html("");
        //                $('#partialUserList').html(data);
        //                UserListDataTable();
        //            }
        //            else {
        //                $.notify.error('Error', 'Something Went Wrong!');
        //                $(".loader").css("display", "none");
        //            }
        //        }
        //    });

        //}

        //function UserListDataTable() {

        //    $("#user_list_table thead tr")
        //        .clone(true)
        //        .addClass("filters")
        //        .appendTo("#user_list_table thead");

        //    var table = $("#user_list_table").DataTable({
        //        "language": {
        //            "lengthMenu": "_MENU_ Entries Per Page"
        //        },
        //        "pageLength": pageLength,
        //        order: [[2, "asc"]],
        //        orderCellsTop: true,
        //        //scrollX: true,
        //        columnDefs: [
        //            { className: "dt-head-nowrap", targets: "_all" },
        //            { className: "dt-center", targets: [1, 2] },
        //            {
        //                targets: 8, // Index of the 'Active' column (starting from 0)
        //                visible: false, // Hide the column from both <th> and <td>
        //                searchable: true // Keep it searchable
        //            },
        //            { targets: [0, 1], orderable: false }
        //        ],
        //        initComplete: function () {
        //            var api = this.api();
        //            // For each column
        //            api
        //                .columns()
        //                .eq(0)
        //                .each(function (colIdx) {
        //                    // Set the header cell to contain the input element
        //                    var cell = $(".filters th").eq(
        //                        $(api.column(colIdx).header()).index()
        //                    );
        //                    var title = $(cell).text();

        //                    if (colIdx === 0) {
        //                        $(cell).html(
        //                            '<button type="button" class="porde_list_reset_btn" id="resetUsertable">Reset</button>'
        //                        );
        //                    }
        //                    else if (colIdx === 1) {
        //                        var select = $(
        //                            '<select class="form-select" id="ddlinactivefilter"><option value="All">All</option><option value="true">Active</option><option value="false">Deactive</option></select>'
        //                        ).appendTo($(cell))
        //                            .on("change", function () {
        //                                var val = $(this).val(); // Get the selected value from dropdown

        //                                if (val === "All") {
        //                                    // Clear search for column 8 when "All" is selected
        //                                    api.column(8).search("").draw();
        //                                } else {
        //                                    // Filter for "true" or "false" (Active or Deactive)
        //                                    var regexVal = $.fn.dataTable.util.escapeRegex(val);
        //                                    api.column(8).search("^" + regexVal + "$", true, false).draw();
        //                                }
        //                            });


        //                    }

        //                    else if (colIdx === 6) {
        //                        var select = $(
        //                            '<select class="form-select"><option value="">All</option> <option value="Administrator">Administrator</option><option value="Buyer">Buyer</option><option value="Client/Operator">Client/Operator</option> <option value="Consultant">Consultant</option><option value="Accountant">Accountant</option></select>'
        //                        )
        //                            .appendTo($(cell))
        //                            .on("change", function () {
        //                                var val = $.fn.dataTable.util.escapeRegex($(this).val());

        //                                api
        //                                    .column(colIdx)
        //                                    .search(val ? "^" + val + "$" : "", true, false)
        //                                    .draw();
        //                            });
        //                    }
        //                    else if (colIdx === 7) {
        //                        var select = $(
        //                            '<select class="form-select"><option value="">All</option><option>Yes</option><option>No</option></select>'
        //                        )
        //                            .appendTo($(cell))
        //                            .on("change", function () {
        //                                var val = $.fn.dataTable.util.escapeRegex($(this).val());

        //                                api
        //                                    .column(colIdx)
        //                                    .search(val ? "^" + val + "$" : "", true, false)
        //                                    .draw();
        //                            });
        //                    }
        //                    else if (colIdx == 8) {
        //                        var select = $(
        //                            '<div style="display:none;"></div>'
        //                        )
        //                            .appendTo($(cell))
        //                    }
        //                    else {
        //                        // For other columns, add input elements
        //                        $(cell).html(
        //                            '<input type="text" class="form-control" placeholder="🔍 Search..." />'
        //                        );
        //                    }

        //                    // On every keypress in this input
        //                    $(
        //                        "input",
        //                        $(".filters th").eq($(api.column(colIdx).header()).index())
        //                    )
        //                        .off("keyup")
        //                        .on("keyup", function () {
        //                            // Get the search value
        //                            $(this).attr("title", $(this).val());
        //                            var regexr = "({search})";

        //                            // Search the column for that value
        //                            api
        //                                .column(colIdx)
        //                                .search(
        //                                    this.value !== ""
        //                                        ? regexr.replace("{search}", "(((" + this.value + ")))")
        //                                        : "",
        //                                    this.value !== "",
        //                                    this.value === ""
        //                                )
        //                                .draw();
        //                        });
        //                });
        //            $(".loader").css("display", "none");
        //        },
        //    });

        //    // Listen to page length change event
        //    $('#user_list_table').on('length.dt', function (e, settings, len) {
        //        //SetProjectPreference('DataTable.PageLength', len);
        //        const preferences = [];
        //        preferences.push({
        //            PreferenceKey: 'DataTable.PageLength',
        //            PreferenceValue: len.toString()
        //        });

        //        SetProjectPreference(preferences);
        //    });
        //}

        $(document).on("click", ".activeUser", function () {
            var userId = $(this).data('id');
            $.ajax({
                url: '/User/ToggleActiveDeactive?FldID=' + userId,
                type: "POST",
                contentType: false,
                processData: false,
                async: true,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        GetUserList();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });

        });

        $(document).on('click', '.edituserlist', function () {
            var userId = $(this).data('id');

            $.ajax({
                url: '/User/BindEditPopUp?userId=' + userId,
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    // Html format of the modal popup
                    $('#editUserContainer').html(data);
                    $('#update_contact_info').modal('show');

                    $('.inSysPerm').each(function () {
                        const relatedOptions = $(this).closest('.check_wrp').find('.soptions');

                        $(this).prop("checked", relatedOptions.length === relatedOptions.filter(':checked').length);
                    });
                    $(document).on("click", ".headerCheckbox", function (e) {
                        var isChecked = $(this).is(':checked');
                        $(this).closest('.check_hdng').next('.check_list').find('input[type="checkbox"]').each(function () {
                            $(this).prop('checked', isChecked);
                        });
                    });
                    $(document).on("click", ".project_check", function () {
                        var $checkList = $(this).closest('.check_list');
                        var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox');
                        var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;
                        $headerCheckbox.prop('checked', allChecked);
                    });

                    $(document).on("change", "#country", function () {
                        countryId = $("#country").val();
                        var stateDropdownEmpty = $('#state');
                        if (countryId == "0") {
                            stateDropdownEmpty.empty();
                            stateDropdownEmpty.append('<option value=""selected>Select a state</option>');
                            return;
                        }
                        $.ajax({
                            url: "/User/getStateByCountryId?countryId=" + countryId,
                            type: "GET",
                            /* data: {cId:countryId},*/
                            dataType: 'json',
                            success: function (data) {
                                if (data.IsSuccess) {

                                    var stateDropdown = $('#state');
                                    stateDropdown.empty();
                                    stateDropdown.append('<option value=""selected>Select a state</option>');
                                    $.each(data.Result, function (index, state) {
                                        stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                                    });
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                }


                            }
                        })

                    });
                    var isDefaultBuyer = $('#hiddenIsBuyer').val();
                    var systemUserType = $('#hiddenSystemUserType').val();
                    if (systemUserType == "4") {
                        $('#defaultbuyer').css('display', 'none');
                        $('#buyerlabel').css('display', 'none');
                        $('#active').css('display', 'none');
                        $('#isbuyerLabel').css('display', 'none');
                    }
                    else {
                        $('#defaultbuyer').css('display', 'block');
                        $('#buyerlabel').css('display', 'block');
                        $('#active').css('display', 'block');
                        $('#isbuyerLabel').css('display', 'block');
                        DefaultBuyerList(isDefaultBuyer, userId, 1);
                    }



                    $(".loader").css("display", "none");

                }
            });
        });
        function DefaultBuyerList(isDefaultBuyer, FldID, flag) {

            $.ajax({
                url: '/User/DefaultBuyerBYUID',
                type: "GET",
                data: { FldId: FldID },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var defaultBuyerDropDown = $('#defaultbuyer');
                    if (data.IsSuccess) {
                        var storedDefaultBuyer = $('#defaultBuyerhidden').val();
                        if (isDefaultBuyer == "1") {
                            defaultBuyerDropDown.empty();
                            defaultBuyerDropDown.append(`<option value="${FldID}">Myself</option>`);
                        }
                        else {
                            defaultBuyerDropDown.empty();
                            defaultBuyerDropDown.append(`<option value="0">None</option>`);
                        }
                        $.each(data.Result, function (index, buyer) {
                            if (flag == 1) {
                                if (storedDefaultBuyer == buyer.fldId) {
                                    defaultBuyerDropDown.append(`<option value="${buyer.fldId}" selected>${buyer.firstName} ${buyer.lastName}</option>`);
                                }
                                else {
                                    defaultBuyerDropDown.append(`<option value="${buyer.fldId}" >${buyer.firstName} ${buyer.lastName}</option>`);
                                }
                            }
                            else {
                                defaultBuyerDropDown.append(`<option value="${buyer.fldId}" >${buyer.firstName} ${buyer.lastName}</option>`);
                            }

                        });

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                    $(".loader").css("display", "none");
                }
            })
        }

        $(document).on('click', '#edituserType', function () {
            $.confirm({
                title: '',
                message: "Are you sure you want to change the User Type? Remember, changing user type will change your selected permissions!",
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    $('#usertype').removeAttr('disabled');
                },
                onCancel: function () {
                    return;
                }
            });
        });

        $(document).on("click", "#unchecked", function (ev) {
            ev.preventDefault();
            //$('input[type="checkbox"]').prop('checked', false);
            $('input.inSysPerm.headerCheckbox, input.project_check.soptions').prop('checked', false);
        });

        $(document).on("click", "#checked", function (event) {
            event.preventDefault();
            //$('input[type="checkbox"]').prop('checked', true);
            $('input.inSysPerm.headerCheckbox, input.project_check.soptions').prop('checked', true);
        });

        $(document).on('input', '#email', function () {
            var currentEmail = $(this).val();
            if (currentEmail == null || currentEmail == "" || currentEmail == " ") {
                return;
            }

            var originalEmail = $('#originalEmail').val();

            if (currentEmail.trim() !== originalEmail.trim()) {
                $('#mfaenabled').prop('checked', false);
            } else {
                $('#mfaenabled').prop('checked', true);
            }
        });

        $(document).on("click", ".soptions", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            let endIndex = id.length - 1;
            var headerid = id.substring(0, endIndex);

            if (headerid == 'Expediting') {

                if (id == 'Expediting1' && _this[0].checked == true) {
                    $("#Expediting0").prop('checked', true);
                }
                else if (id == 'Expediting1' && _this[0].checked == false) {
                    $("#Expediting0").prop('checked', false);
                }
            }

            $('.inSysPerm').each(function () {
                const relatedOptions = $(this).closest('.check_wrp').find('.soptions');
                const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                $(this).prop("checked", allChecked);
            });

        });

        $(document).on('change', '#active', function () {
            var isBuyer = $(this).val();
            var FldID = $('#hiddenFldId').val();
            let flag = parseInt(isBuyer);
            DefaultBuyerList(isBuyer, FldID, flag);
        });

        $(document).on("click", "#resetUsertable", function () {

            GetUserList();
        });

        $(document).on("click", "#updateBtn", function () {
            var divTable = typeof elem === "object" && $(elem).is("input") ? $(elem) : $(".soptions");
            var fldId = $('#btn-edit').data('id');

            var uId = $("#hiddenval").data('id');


            var companyName = $('#companyName').val().trim();
            var companyTitle = $('#companyTitle').val().trim();
            var firstName = $('#firstName').val();
            var lastName = $('#lastName').val().trim();
            var email = $('#email').val().trim();
            var address = $('#address').val().trim();
            var country = $('#country').val();
            var State = $('#state').val();
            var city = $('#city').val().trim();
            var postalCode = $('#postalCode').val().trim();
            var userType = $('#usertype').val();
            var buyer = $('#active').val() == 1 ? true : false;
            let prioritiesList = [];
            var fd = $.formdata("#updateform");
            var loginCredential = "";
            var defaultBuyerId = $('#defaultbuyer').val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            if ($("#send").is(":checked")) {
                loginCredential = "1";
            }
            else {
                loginCredential = "0";
            }

            if (flag == 1) {
                var priorities = $('#systemaccessOption .project_check:checked').map(function () {
                    return $(this).attr('data-sysid');
                }).get().join(',');
            } else {
                var priorities = $('.project_check:checked').map(function () {
                    return $(this).attr('data-partialid');
                }).get().join(',');
            }
            flag = 0;
            var mfaenabled = $('#mfaenabled').is(":checked");

            fd.append('systemUsersUpdateDto.FldID', uId);
            fd.append('systemUsersUpdateDto.Firstname', firstName);
            fd.append('systemUsersUpdateDto.Middlename', "");
            fd.append('systemUsersUpdateDto.Lastname', lastName);
            fd.append('systemUsersUpdateDto.Username', "");
            fd.append('systemUsersUpdateDto.Email', email);
            fd.append('systemUsersUpdateDto.UserPassword', "");
            fd.append('systemUsersUpdateDto.Usertype', userType);
            fd.append('systemUsersUpdateDto.Isbuyer', buyer);
            fd.append('systemUsersUpdateDto.DefaultbuyerID', defaultBuyerId);

            fd.append('systemUsersUpdateDto.Address', address);
            fd.append('systemUsersUpdateDto.City', city);
            fd.append('systemUsersUpdateDto.ContactNumber', "");
            fd.append('systemUsersUpdateDto.Extension', "");
            fd.append('systemUsersUpdateDto.Country', country);
            fd.append('systemUsersUpdateDto.State', State);
            fd.append('systemUsersUpdateDto.PostalCode', postalCode);
            fd.append('systemUsersUpdateDto.CompanyName', companyName);
            fd.append('systemUsersUpdateDto.CompanyTitle', companyTitle);
            fd.append('systemUsersUpdateDto.IsPasswordReset', 0);
            fd.append('systemUsersUpdateDto.priorities_on_list', priorities);
            fd.append('systemUsersUpdateDto.sendLoginCredential', loginCredential);
            fd.append('systemUsersUpdateDto.IsMFAEnabled', mfaenabled);

            let formData = {
                Firstname: firstName,
                Lastname: lastName,
                Email: email

            };
            var isValid = UpdateUserValidation(formData);
            if (!isValid) {
                return;
            }



            $.ajax({
                url: "/User/UpdateUser",
                type: "POST",
                data: fd,
                contentType: false,
                processData: false,
                async: true,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#update_contact_info').modal('hide');
                        setTimeout(function () {
                            GetUserList();
                        }, 3000);
                    }
                    else {
                        Title = data.ErrorMessages;
                        if (Title == 'INVALID^EMAIL') {
                            $.notify.error('Error', 'Please enter a unique Email id.');
                            $('#email').val('');
                            errorfunc('email', 'Please enter valid Email');
                        }
                        else if (Title == 'INVALID^ISBUYER') {
                            $.notify.error('Error', 'Can not update is buyer to NO');
                        }
                        else {
                            $.notify.error('Error', Title);
                        }

                    }

                }
            });

        });
        function UpdateUserValidation(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (formData.Firstname === "" || formData.Firstname === undefined) {
                IsValid = false;
                Title = "Please enter First Name";
                var inputField = $('#firstName');
                $.notify.warning('Caution', Title);
                $("#firstName").attr("placeholder", "PLEASE ENTER FIRST NAME").trigger('focus');
                shake(inputField);

            }
            else if (formData.Lastname === "" || formData.Lastname === undefined) {
                IsValid = false;
                Title = "Please Enter Last Name";
                var LastName = $('#lastName');
                $.notify.warning('Caution', Title);
                $("#lastName").attr("placeholder", "PLEASE ENTER LAST NAME").trigger('focus');
                shake(LastName);
            }
            else if (formData.Email === "" || formData.Email === undefined) {
                IsValid = false;
                Title = "Please Enter Email";
                var Email = $('#email');
                $.notify.warning('Caution', Title);
                $("#email").attr("placeholder", "PLEASE ENTER EMAIL").trigger('focus');
                shake(Email);

            }
            else if (!emailRegex.test(formData.Email)) {
                IsValid = false;
                Title = "Please Enter a Valid Email";
                var $Email = $('#email');
                $.notify.warning('Caution', Title);
                shake($Email);
            }

            return IsValid;
        }
        $(document).on("change", "#ddlinactivefilter", function () {
            var isactivefilter = $("#ddlinactivefilter option:selected").val();
            if (isactivefilter == "All") {
                GetUserList();
            }
            else {
                $.ajax({
                    url: '/User/GetPartialUserList?isActivefilter=' + isactivefilter,
                    type: 'GET',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        var IsSuccess = false;
                        var Title = "";
                        var IsValid = true;

                        if (data != null) {
                            $('#partialUserList').html("");
                            $('#partialUserList').html(data);

                            UserListDataTable();

                            $("#ddlinactivefilter").val(isactivefilter);
                        }
                        else {
                            Title = "Something Went Wrong!";
                            notify(IsSuccess, Title, IsValid);
                        }

                    },
                    error: function (xhr, status, error) {
                        $(".loader").css("display", "none");

                    }
                });
            }

        });

        function shake(element) {
            var interval = 100;
            var distance = 10;
            var times = 4;

            element.css('position', 'relative');

            for (var i = 0; i <= times; i++) {
                element.animate({ left: (i % 2 == 0 ? distance : distance * -1) }, interval);
            }

            element.animate({ left: 0 }, interval);
        }

        $(document).on("change", "#usertype", function (ev) {
            ev.preventDefault();
            _systemAccessPermissionOptionBind();
        })
        function _systemAccessPermissionOptionBind() {
            var userType = $("#usertype option:selected").val();
            $.ajax({
                url: "/User/GetAllSystemPermissionByUserType?usertype=" + userType,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $(".systemPermission").remove();
                        $("#systemaccessOption").css("display", "block");;
                        $("#systemaccessOption").html('');
                        $("#systemaccessOption").html(data);
                        flag = 1;
                        function updateHeaderCheckbox($list) {
                            var $checkList = $list.closest('.check_list'); // Find the closest list of checkboxes
                            var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox'); // Find the corresponding header checkbox


                            var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;


                            $headerCheckbox.prop('checked', allChecked);
                        }


                        $('.check_list').each(function () {
                            updateHeaderCheckbox($(this).find('input[type="checkbox"]').first());
                        });

                        function updateHeaderCheckbox($list) {
                            var $checkList = $list.closest('.check_list');
                            var $headerCheckbox = $checkList.prev('.check_hdng').find('.headerCheckbox');


                            var allChecked = $checkList.find('input[type="checkbox"]').length === $checkList.find('input[type="checkbox"]:checked').length;


                            $headerCheckbox.prop('checked', allChecked);
                        }


                        $('.check_list').each(function () {
                            updateHeaderCheckbox($(this).find('input[type="checkbox"]').first());
                        });


                    }
                    $(".loader").css("display", "none");

                }
            });
        }

        $(document).on("click", "#uncheck", function (ev) {
            ev.preventDefault();
            //$('input[type="checkbox"]').prop('checked', false);
            $('input.inSysPerm.headerCheckbox, input.project_check.securityoption').prop('checked', false);
        });

        $(document).on("click", "#check", function (event) {
            event.preventDefault();
            //$('input[type="checkbox"]').prop('checked', true);
            $('input.inSysPerm.headerCheckbox, input.project_check.securityoption').prop('checked', true);
        });
    }
    // #endregion

    // #region :: System Level Permission
    if (action_name === "systemlevelpermission") {

        _systemLevelPermissionOptionBind();
        function _systemLevelPermissionOptionBind() {

            $.ajax({
                url: "/User/GetAllSystemLevelPermissionBind",
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $("#security_accordian").html('');
                        $("#security_accordian").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });
        }

        $(document).on("click", ".chkScrty", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var flid = $("#" + id + "").data('flid');
            let isselected = _this[0].checked ? 1 : 0;

            $.ajax({
                url: "/User/saveSystemLevelPermission?flid=" + flid + "&isselected=" + isselected,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                }
            });

        });

    }
    // #endregion

    // #region :: System Admin Activity
    if (action_name === "systemadminactivity") {

        function initializeDataTable(selector) {
            const pageLength = parseInt(window._UserPreferences?.["DataTable.PageLength"]) || 50;

            $(selector).DataTable({
                paging: true,
                pageLength: pageLength,
                //lengthChange: true,       
                //lengthMenu: [10, 25, 50, 100],
                orderCellsTop: true,
                scrollCollapse: true,

                scrollY: 400,
                //scrollX: true,
                columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $(`${selector} tbody`).html(
                            '<tr><td colspan="3" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                    tabledata = api.rows().data().toArray();
                }
            });


            $(selector).on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });

        }

        GetAllVendorterms();
        function GetAllVendorterms() {
            $.ajax({
                url: '/User/GetAllInvoiceTerms',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialInvoiceTerms').html("");
                        $('#partialInvoiceTerms').html(data);
                        initializeDataTable("#invoice_term_tabl");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllClassifications() {
            $.ajax({
                url: '/User/GetAllClassifications',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#partialClassification').html("");
                        $('#partialClassification').html(data);
                        initializeDataTable("#classification_tabl");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }
        function GetDefaultSystemTermsFile() {

            $.ajax({
                url: '/User/CheckTermsFileExists',
                type: 'GET',
                dataType: 'JSON',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#showTCFile").show();
                        var timestamp = new Date().getTime();
                        var fileUrl = data.Result + '?v=' + timestamp;
                        var html = '';
                        html = '<p>Files selected :';
                        html += '<span id="fileList">'
                        html += '<a id="delfile" target="_blank" href="../../Assets/SystemTermsFiles/' + fileUrl + '">' + data.Result.split('^')[0] + '</a>';
                        /*html += '<i class="fa-solid fa-trash"></i>';*/
                        html += '</span></p>';
                        $("#FileName").html(html);
                        $('#btn_ChangeTCFile').hide();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                        $("#showTCFile").show();
                    }


                }
            });
        }

        function GetAllInvoiceAddress() {
            $.ajax({
                url: '/User/GetAllInvoiceAddress',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialInvoiceAddress').html("");
                        $('#partialInvoiceAddress').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }
                }
            });
        }

        function GetAllProjectContactType() {
            $.ajax({
                url: '/User/GetAllProjectContactTypes',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialProjectContactType').html("");
                        $('#partialProjectContactType').html(data);
                        initializeDataTable("#invoice_term");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }
        function ProjectContactTypeDataTableBind() {
            $("#invoice_term thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#invoice_term thead");

            var table = $("#invoice_term").DataTable({
                pageLength: pageLength,
                orderCellsTop: true,
                scrollX: true,
                scrollCollapse: true,
                scrollY: 400,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                ],
                initComplete: function () {
                    var api = this.api();

                    // For each column
                    api
                        .columns()
                        .eq(0)
                        .each(function (colIdx) {
                            // Set the header cell to contain the input element
                            var cell = $(".filters th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            if (colIdx === 0) {
                                $(cell).html(
                                    '<button type="button" class="porde_list_reset_btn">Reset</button>'
                                );
                            }
                            else if (colIdx === 1) {
                                var select = $(
                                    '<input type="text" class="form-control"></input>'
                                )
                                    .appendTo($(cell))
                                    .on("change", function () {
                                        var val = $.fn.dataTable.util.escapeRegex($(this).val());

                                        api
                                            .column(colIdx)
                                            .search(val ? "^" + val + "$" : "", true, false)
                                            .draw();
                                    });
                            }


                            // On every keypress in this input
                            $(
                                "input",
                                $(".filters th").eq($(api.column(colIdx).header()).index())
                            )
                                .off("keyup")
                                .on("keyup", function () {
                                    // Get the search value
                                    $(this).attr("title", $(this).val());
                                    var regexr = "({search})";

                                    // Search the column for that value
                                    api
                                        .column(colIdx)
                                        .search(
                                            this.value !== ""
                                                ? regexr.replace("{search}", "(((" + this.value + ")))")
                                                : "",
                                            this.value !== "",
                                            this.value === ""
                                        )
                                        .draw();
                                });
                        });
                },
            });
        }

        function GetAllPaymentSchedules() {
            $.ajax({
                url: '/User/GetAllPaymentSchedules',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialPaymentSchedule').html("");
                        $('#partialPaymentSchedule').html(data);
                        initializeDataTable("#pay_scdl");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllShipmentMethod() {
            $.ajax({
                url: '/User/GetAllShipmentMethod',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialShipmentMethod').html("");
                        $('#partialShipmentMethod').html(data);
                        initializeDataTable("#ship_method_table");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllFabricationApprovalType() {
            $.ajax({
                url: '/User/GetAllFabApprovalTypes',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialFabApprovalType').html("");
                        $('#partialFabApprovalType').html(data);
                        initializeDataTable("#fav_appr_table");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllCountryOnSystemAdminActivity() {
            $.ajax({
                url: '/User/GetAllCountryOnSystemAdminActivity',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#partialCountry').html("");
                        $('#partialCountry').html(data);
                        initializeDataTable("#table_countries");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllCurrencyOnSystemAdmin() {
            $.ajax({
                url: '/User/GetAllCurrencyOnSystemAdmin',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialCurrencies').html("");
                        $('#partialCurrencies').html(data);
                        initializeDataTable("#table_currency");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllUOM() {
            $.ajax({
                url: '/User/GetAllUOM',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#partialUom').html("");
                        $('#partialUom').html(data);
                        initializeDataTable("#fav_uom_table");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetAllBankAccount() {
            $.ajax({
                url: '/User/GetAllBankAccount',
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#partialBankAccount').html("");
                        $('#partialBankAccount').html(data);
                        initializeDataTable("#table_bank_account");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });
        }

        function getStateProv(countryId) {
            $.ajax({
                url: '/User/GetAllStatesByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#partialState').html("");
                        $('#partialState').html(data);
                        initializeDataTable("#table_state");
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });



        };

        function getmailbody(mode) {
            $.ajax({
                url: '/User/getMailContent',
                type: 'GET',
                dataType: 'json',
                data: { mode: mode },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var subject = data.Result.split('!##!')[1];
                        data = decodeURIComponent(data.Result.split('!##!')[0]);
                        if (mode == 'BUDGET') {
                            $('#budgetappmailsubject').val(subject);
                            $('#budgetmailapp').text(data);

                            tinymce.init({
                                selector: "#budgetmailapp",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'POAPP') {
                            $('#poappmailsubject').val(subject);
                            $('#vendormailapp').text(data);

                            tinymce.init({
                                selector: "#vendormailapp",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'PO') {
                            $('#pomailsubject').val(subject);
                            $('#vendormail').text(data);

                            tinymce.init({
                                selector: "#vendormail",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'PASSWORDRESET') {
                            $('#passresetsubject').val(subject);
                            $('#passreset').text(data);

                            tinymce.init({
                                selector: "#passreset",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'NEWUSERMAIL') {
                            $('#newusersubject').val(subject);
                            $('#newusermail').text(data);

                            tinymce.init({
                                selector: "#newusermail",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'NEWCONSULTANTMAIL') {
                            $('#newconsultantmailsubject').val(subject);
                            $('#newconsultantmail').text(data);

                            tinymce.init({
                                selector: "#newconsultantmail",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        if (mode == 'PDFSEND') {
                            $('#pomailsubject_PDF').val(subject);
                            $('#vendormail_PDF').text(data);

                            tinymce.init({
                                selector: "#vendormail_PDF",
                                plugins: "textcolor,fullscreen,image",
                                toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , image_list: [
                                    { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                                ]

                            });
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }


                }
            });
        }

        function GetFileSize() {
            $.ajax({
                url: '/User/getFileSize',
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#changemaxfilesize").val(data.Result[0].filesize.toString());
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });
        }

        function Savemailtemplate(mode) {
            var MailBody = '';
            MailBody = encodeURIComponent(tinyMCE.activeEditor.getContent());
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            var subject = $('#' + mode).val();


            let formData = {
                MailBody: MailBody,
                Subject: subject,
                UpdatedBy: 0,
                mode: mode
            };

            $.ajax({
                url: '/User/SaveMailTemplate',
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
                        $.notify.success('Success', data.Result);
                        //window.location.reload();
                        $(".nav-item .systemTab.active").trigger("click");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }

            });
        }


        $(document).on("change", "#changemaxfilesize", function () {
            var FileSize = $(this).val();
            $.ajax({
                url: '/User/UpdateFileSize',
                type: 'POST',
                data: { FileSize: FileSize },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });

        $(document).on("click", ".savemailtemplate", function () {

            var tabButtonId = $(".nav-link.systemTab.active").attr('id');
            var mode = '';
            if (tabButtonId == 'IsBudgetApprovalTemplate') {
                mode = 'budgetappmailsubject';
            }
            if (tabButtonId == 'IsPOApprovalTemplate') {
                mode = 'poappmailsubject';
            }
            if (tabButtonId == 'IsSendToVendorTemplate') {
                mode = 'pomailsubject';
            }
            if (tabButtonId == 'IsPassResetTemplate') {
                mode = 'passresetsubject';
            }
            if (tabButtonId == 'IsNewUserTemplate') {
                mode = 'newusersubject';
            }
            if (tabButtonId == 'IsItemConsultTemplate') {
                mode = 'newconsultantmailsubject';
            }
            if (tabButtonId == 'IsSendPoVendorTemplate') {
                mode = 'pomailsubject_PDF';
            }

            Savemailtemplate(mode);

        });

        $(document).on("click", ".nav-item .systemTab", function (e) {

            var tabButtonId = $(e.target).attr('id');

            //object mapping
            const tabActions = {
                IsInvoiceTerms: () => GetAllVendorterms(),
                IsClassifications: () => GetAllClassifications(),
                IsTermsCondition: () => GetDefaultSystemTermsFile(),
                IsInvoiceAddress: () => GetAllInvoiceAddress(),
                IsProjectContact: () => GetAllProjectContactType(),
                IsPaymenentSchedule: () => GetAllPaymentSchedules(),
                IsShipmentMethod: () => GetAllShipmentMethod(),
                IsFabricationApprovalType: () => GetAllFabricationApprovalType(),
                IsCountries: () => GetAllCountryOnSystemAdminActivity(),
                IsCurrencies: () => GetAllCurrencyOnSystemAdmin(),
                IsUOM: () => GetAllUOM(),
                IsBankAccount: () => GetAllBankAccount(),
                IsBudgetApprovalTemplate: () => getmailbody('BUDGET'),
                IsPOApprovalTemplate: () => getmailbody('POAPP'),
                IsSendToVendorTemplate: () => getmailbody('PO'),
                IsPassResetTemplate: () => getmailbody('PASSWORDRESET'),
                IsNewUserTemplate: () => getmailbody('NEWUSERMAIL'),
                IsItemConsultTemplate: () => getmailbody('NEWCONSULTANTMAIL'),
                IsSendPoVendorTemplate: () => getmailbody('PDFSEND'),
                IsFileSize: () => GetFileSize()
            };

            const action = tabActions[tabButtonId];
            if (action) {
                action();
            }

        });

        $(document).on("change", "#ddlCountry", function () {
            var CountryId = $(this).val();
            getStateProv(CountryId);

        });

        $(document).on("click", "#editButton", function () {
            var InvoiceTermId = $(this).data('id');
            $.ajax({
                url: "/User/GetAllVendorTermsById?InvoiceTermId=" + InvoiceTermId,
                type: "GET",
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var tempData = JSON.parse(data);

                    $('#id_Invoice').val(InvoiceTermId);

                    $("#exampleModal12").modal('show');
                    $('#exampleModal12').on('shown.bs.modal', function () {
                        $("#invterm1").val(data.Result.terms);
                        if (data.Result.status === "1") {
                            $("#active1 option[value='1']").prop("selected", true);
                        } else {
                            $("#active1 option[value='0']").prop("selected", true);
                        }
                    });
                    $(".loader").css("display", "none");
                }
            });


        });
        $(document).on("click", "#edit_classification", function () {
            var ClassificationID = $(this).data('id');

            $.ajax({
                url: '/User/GetAllClassificationById?ClassificationID=' + ClassificationID,
                type: "GET",
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var classificationData = JSON.parse(data);

                    $('#id_classification').val(ClassificationID);
                    $('#classification_modal').modal('show');
                    $("#invtermClassification").val(data.Result.classification);
                    if (data.Result.status === "1") {
                        $("#active2 option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#active2 option[value='0']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");

                }
            });

        });
        $(document).on("click", "#contactType", function () {
            var ContactTypeID = $(this).data('id');
            $.ajax({
                url: "/User/GetAllProjectUserTypeById?ContactTypeID=" + ContactTypeID,
                type: "GET",
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var contactType = JSON.parse(data);
                    $('#contactType_modal').modal('show');
                    $('#id_contactType').val(ContactTypeID);
                    $('#contactType_modal').on('shown.bs.modal', function () {
                        $('#invtermContactType').val(data.Result.contactType);
                    });
                    $(".loader").css("display", "none");

                }
            });

        });


        $(document).on("click", "#updateVendorTerms", function () {


            var termsData = $('#invterm1').val();
            var termId = $('#editButton').data('id');
            var tId = $('#id_Invoice').val();
            var status = $('#active1 option:selected').val();
            let updateDto = {
                TermID: tId,
                Terms: termsData,
                Status: status
            };

            var isValid = formValidateForUpdateVendor(updateDto);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateVendorTerms",
                    type: "POST",
                    data: updateDto,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $("#exampleModal12").modal('hide');
                            GetAllVendorterms();
                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }

                    }
                });


            }
        });

        $(document).on("click", "#updateClassification", function () {
            var ClassificationID = $('#edit_classification').data('id');

            var cId = $('#id_classification').val();
            var classification = $("#invtermClassification").val();
            var status = $('#active2 option:selected').val();
            let fd = {
                Classification_ID: cId,
                Classification: classification,
                Status: status
            };
            var isValid = formValidateForUpdateClassification(fd);

            if (isValid) {

                $.ajax({
                    url: "/User/UpdateClassification",
                    type: "POST",
                    data: fd,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#classification_modal').modal('hide');
                            GetAllClassifications();
                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });

            }


        });

        $(document).on("click", "#addClassification", function () {

            var classification = $("#classificationInput").val();
            let createDto = {
                Classification: classification
            };
            var isValid = formValidateForUpdateClassification(createDto);
            if (isValid) {

                $.ajax({

                    url: "/User/CreateClassificiation",
                    type: "POST",
                    data: createDto,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#modal5').modal('hide');
                            GetAllClassifications();
                        }

                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }

                    }
                });

            }
        });

        $(document).on("click", "#createInvoice", function () {
            var invoiceTerms = $('#invoiceTermInput').val().trim();

            var status = $('#activeModal').val();
            let createDto = {
                Terms: invoiceTerms,
                Status: status
            };
            var isValid = formValidateForUpdateVendor(createDto);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateVendorTerms",
                    type: "POST",
                    data: createDto,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#addInvoice').modal('hide');
                            GetAllVendorterms();

                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);

                        }
                    }
                });
            }
        });


        $(document).on("click", "#updateContactType", function () {

            var contactType = $('#invtermContactType').val();
            var contactId = $('#contactType').data('id');

            var contacttypeId = $('#id_contactType').val();

            let md = {
                ContactTypeID: contacttypeId,
                ContactType: contactType,
                Status: "1"
            };
            var isValid = formValidateForContactType(md);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateContactType",
                    type: "POST",
                    data: md,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#contactType_modal').modal('hide');
                            GetAllProjectContactType();
                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });

        $(document).on("click", "#addContactType", function () {

            var contactType = $('#cType').val().trim();
            let createDto = {
                ContactType: contactType
            };
            var isValid = formValidateForContactType(createDto);
            if (isValid) {

                $.ajax({
                    url: "/User/CreateProjectContactType",
                    type: "POST",
                    data: createDto,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#modal6').modal('hide');
                            GetAllProjectContactType();
                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });


        $(document).on("click", "#paySched", function () {

            var TermID = $(this).data('id');
            $.ajax({
                url: "/User/GetAllPaymentSchedulesById?TermID=" + TermID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var tempData = JSON.parse(data);

                    $('#exampleModal4').modal('show');
                    $('#id_pTerms').val(TermID);
                    $('#psterm').val(data.Result.terms);
                    if (data.Result.status === true) {
                        $("#psActive option[value='true']").prop("selected", true);
                    }
                    else {
                        $("#psActive option[value='false']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");
                }
            });



        });
        $(document).on("click", "#shipEdit", function () {
            var ShipID = $(this).data('id');
            $.ajax({
                url: "/User/GetALlShipmentMethodById?ShipID=" + ShipID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var tempData = JSON.parse(data);

                    $('#exampleModal5').modal('show');

                    $('#id_SM').val(ShipID);
                    $('#shipMethod').val(data.Result.shipMethod);

                    if (data.Result.status === true) {
                        $("#activeshipMethod option[value='true']").prop("selected", true);
                    }
                    else {
                        $("#activeshipMethod option[value='false']").prop("selected", true);
                    }

                    $(".loader").css("display", "none");

                }
            });




        });
        $(document).on("click", "#fab_edit", function () {
            var ItemApprovalID = $(this).data('id');
            $.ajax({
                url: "/User/GetFabApprovalTypesId?ItemApprovalID=" + ItemApprovalID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var getData = JSON.parse(data);
                    $('#exampleModal6').modal('show');
                    $('#id_FA').val(ItemApprovalID);

                    $('#fabinput').val(data.Result.itemName);
                    $('#fabShortname').val(data.Result.itemShortName);
                    if (data.Result.status === "1") {
                        $("#activeFab option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#activeFab option[value='0']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");

                }
            });


        });
        $(document).on('click', "#updateFabItems", function () {

            var itemId = $('#id_FA').val();
            var itemFullName = $('#fabinput').val();
            var itemshortName = $('#fabShortname').val();
            var status = $("#activeFab option:selected").val();
            let fd = {
                ItemApprovalID: itemId,
                ItemName: itemFullName,
                ItemShortName: itemshortName,
                Status: status
            };
            var isValid = formValidateForFabricationApproval(fd);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateFabApprovalTypes",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            notify(IsSuccess, Title, IsValid);
                            $('#exampleModal6').modal('hide');
                            GetAllFabricationApprovalType();
                        }
                        else {
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $(document).on('click', "#AddFA", function () {
            var itemFullName = $('#FAfullname').val();
            var shortName = $('#FAshortname').val();
            let fd = {
                ItemName: itemFullName,
                ItemShortName: shortName
            };
            var isValid = formValidateForFabricationApproval(fd);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateFabApprovalTypes",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#modal8').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllFabricationApprovalType();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });

        $(document).on("click", "#updateShipMethod", function () {

            var shipId = $('#id_SM').val();
            var shipMethod = $('#shipMethod').val().trim();

            var status = $("#activeshipMethod option:selected").val();
            let fd = {
                ShipID: shipId,
                ShipMethod: shipMethod,
                Status: JSON.parse(status)
            };
            var isValid = formValidateForShipMethod(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/UpdateShipmentMethod",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#exampleModal5').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllShipmentMethod();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $(document).on("click", "#addShipment", function () {

            var shipment = $('#shipmentInput').val();
            let fd = {
                ShipMethod: shipment
            };
            var isValid = formValidateForShipMethod(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/CreateShipmentMethod",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#modal7').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllShipmentMethod();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);

                        }
                    }
                });
            }
        });

        $(document).on("click", "#psUpdate", function () {

            var termId = $('#id_pTerms').val();
            var terms = $('#psterm').val().trim();
            var status = $('#psActive option:selected').val();
            let updateDto = {
                TermID: termId,
                Terms: terms,
                Status: JSON.parse(status)
            }
            var isValid = formValidateForPaymentSchedule(updateDto);
            if (isValid) {
                $.ajax({

                    url: "/User/UpdatePaymentSchedule",
                    type: "POST",
                    data: updateDto,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#exampleModal4').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllPaymentSchedules();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                })
            }
        });

        $(document).on('click', '#createPaymentSchedule', function () {
            var terms = $('#PaymentInput').val().trim();
            var status = $('#activePaymentSchedule').val();

            let modalData = {
                Terms: terms,
                Status: JSON.parse(status)
            };
            var isValid = formValidateForPaymentSchedule(modalData);
            if (isValid) {

                $.ajax({
                    url: "/User/CreatePaymentSchedule",
                    type: "POST",
                    data: modalData,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#addPaymentSchedule').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllPaymentSchedules();

                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $(document).on('click', "#editCountryButton", function () {
            var CountryID = $(this).data('id');
            $.ajax({

                url: "/User/GetEditModalCountryById?CountryID=" + CountryID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var tempData = JSON.parse(data);
                    $('#edit_country').modal('show');
                    $('#hidenCid').val(CountryID);
                    $('#editCName').val(data.Result.country);
                    $('#editCCode').val(data.Result.countryCode);

                    if (data.Result.status === "1") {
                        $("#statusCountry option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#statusCountry option[value='0']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on("click", "#upCountry", function () {
            var countryId = $('#hidenCid').val();
            var country = $('#editCName').val();
            var countryCode = $('#editCCode').val();
            var status = $("#statusCountry").val();

            let dto = {
                CountryID: countryId,
                Country: country,
                CountryCode: countryCode,
                Status: status,
            };
            var isValid = formValidateForCountries(dto);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateCountry",
                    type: "POST",
                    data: dto,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#edit_country').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllCountryOnSystemAdminActivity();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }

                    }
                });
            }
        });

        $(document).on('click', '#createCountrySA', function () {

            var country = $('#addCountryName').val();
            var countryCode = $('#addcountryCode').val();
            let fd = {
                Country: country,
                CountryCode: countryCode
            }
            var isValid = formValidateForCountries(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/CreateCountry",
                    type: "POST",
                    data: fd,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#addCountryModal').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllCountryOnSystemAdminActivity();
                            $('#addCountryName').val('');
                            $('#addcountryCode').val('');
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });


        $(document).on('click', '#State_Prov', function () {

            var countryId = $('#ddlCountry option:selected').val();
            var IsSuccess = false;
            var Title = "";
            var IsValid = true;
            if (countryId === "0") {
                /* $('#addState_ProvModal').modal('hide');*/
                Title = "Select Country First";
                notify(IsSuccess, Title, IsValid);

            }
            else if (countryId !== "0") {
                $('#addState_ProvModal').modal('show');
            }


        });
        $(document).on('click', '#editState_prov', function () {

            var StateID = $(this).data('id');
            $.ajax({

                url: "/User/GetEditModalStateProveById?StateID=" + StateID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //var tempData = JSON.parse(data);
                    $('#id_state').val(StateID);
                    $('#inputstate_prov').val(data.Result.state);
                    $('#inputstate_provCode').val(data.Result.stateCode);
                    if (data.Result.status === true) {
                        $("#activeState option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#activeState option[value='0']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");
                }
            });
        });
        $(document).on('click', '#updateStateProv', function () {

            var stateId = $('#id_state').val();
            var stateName = $('#inputstate_prov').val();
            var stateCode = $('#inputstate_provCode').val();
            var status = $("#activeState option:selected").val();
            var countryCode = $('#ddlCountry option:selected').val();
            let updateDTO = {
                StateID: stateId,
                State: stateName,
                StateCode: stateCode,
                CountryCode: countryCode,
                Status: JSON.parse(status)
            }
            var isValid = formValidateForState_Prov(updateDTO);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateProvState",
                    type: "POST",
                    data: updateDTO,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#editStateProv').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            getStateProv(countryCode);
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $(document).on('click', '#createState_Prov', function () {
            var countryCode = $('#ddlCountry option:selected').val();
            var stateName = $('#stateProv').val();
            var stateCode = $('#stateProvCode').val();
            let createDTO = {
                State: stateName,
                StateCode: stateCode,
                CountryCode: countryCode,
            }
            var isValid = formValidateForState_Prov(createDTO);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateProvState",
                    type: "POST",
                    data: createDTO,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {

                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#addState_ProvModal').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            getStateProv(countryCode);
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });

        $(document).on('click', "#editCurrency", function () {

            var CurrencyID = $(this).data('id');
            $.ajax({
                url: "/User/GetCurrencyEditPopupById?CurrencyID=" + CurrencyID,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    //var tempData = JSON.parse(data);
                    $('#id_Currency').val(CurrencyID);
                    $('#getCurrency').val(data.Result.currency);
                    $('#getCurrencyCode').val(data.Result.currencyCode);
                    if (data.Result.status === true) {
                        $("#activeStatusCurrency option[value='true']").prop("selected", true);
                    }
                    else {
                        $("#activeStatusCurrency option[value='false']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");

                }
            });
        });
        $(document).on('click', '#updateCurrencybtn', function () {

            var currencyId = $('#id_Currency').val();
            var currency = $('#getCurrency').val();
            var currencyCode = $('#getCurrencyCode').val();
            var status = $("#activeStatusCurrency option:selected").val();
            let fd = {
                CurrencyID: currencyId,
                Currency: currency,
                CurrencyCode: currencyCode,
                Status: JSON.parse(status)
            }
            var isValid = formValidateForAddorUpdateCurrency(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/UpdateCurrency",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {

                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            $('#edit_currency').modal('hide');
                            GetAllCurrencyOnSystemAdmin();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });


        $(document).on('click', '#createCurrency', function () {
            var currency = $('#inputCurrencyName').val().trim();
            var currencyCode = $('#inputCurrencyCode').val().trim();

            let fd = {
                Currency: currency,
                CurrencyCode: currencyCode
            }
            var isValid = formValidateForAddorUpdateCurrency(fd);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateCurrency",
                    type: 'POST',
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#addCurrencyModal').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllCurrencyOnSystemAdmin();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $(document).on('click', '#editModalUom', function () {
            var UOMID = $(this).data('id');
            $.ajax({
                url: "/User/GetUOMById?UOMID=" + UOMID,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    //var tempData = JSON.parse(data);
                    $('#id_UOM').val(UOMID);
                    $('#inputUOM').val(data.Result.uom);

                    if (data.Result.status === 1) {
                        $("#activeUOM option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#activeUOM option[value='0']").prop("selected", true);
                    }
                    if (data.Result.isDefault === 1) {
                        $("#activeDefaultUOM option[value='1']").prop("selected", true);
                    }
                    else {
                        $("#activeDefaultUOM option[value='0']").prop("selected", true);
                    }
                    $(".loader").css("display", "none");

                }
            });
        });

        $(document).on('click', '#updateUOM', function () {
            var uomId = $('#id_UOM').val();
            var uom = $('#inputUOM').val().trim();
            var status = $("#activeUOM option:selected").val();
            var isDefault = $("#activeDefaultUOM option:selected").val();
            let fd = {

                UOM_ID: uomId,
                UOM: uom,
                Status: status,
                IsDefault: isDefault

            }
            var isValid = formValidateForAddorUpdateUOM(fd);
            if (isValid) {
                $.ajax({
                    url: "/User/UpdateModalUOM",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#editUom').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllUOM();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });

        $(document).on('click', '#editBankaccBtn', function () {
            var AccountID = $(this).data('id');
            $.ajax({
                url: "/User/EditBankAccountModal?AccountID=" + AccountID,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $("#bankAccModal").html('');
                        $("#bankAccModal").html(data);
                        $('#modal10').modal('show');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            })
        });
        $(document).on('click', "#updateBankAcc", function () {
            var fldId = $('#id_bankAcc').val();
            var bankAcc = $('#AccName').val();
            var desc = $('#AccDesc').val();
            var cCode = $("#currecyDD option:selected").val();
            var Active = $('#activeBankAcc option:selected').val();
            let fd = {
                Fld_ID: fldId,
                Bank_Account: bankAcc,
                Desc: desc,
                CurrCode: cCode,
                IsActive: JSON.parse(Active)
            }
            var isValid = formValidateForUpdateBankAcc(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/UpdateBankAccount",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#editBankAcc').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllBankAccount();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });
        $('#activatebankStatus').change(function () {
            $(this).val(this.checked ? "true" : "false");
        });
        $(document).on('click', '#addBankAcc', function () {

            var bankAccount = $('#bankAcc').val();
            var desc = $('#Bankdesc').val();
            var curr = $("#currList option:selected").val();
            var status = $('#activatebankStatus ').prop('checked') ? true : false;
            let fd = {

                Bank_Account: bankAccount,
                Desc: desc,
                CurrCode: curr,
                IsActive: JSON.parse(status)

            }
            var isValid = formValidateForAddBankAcc(fd);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateBankAccount",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#AddBankAcc').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllBankAccount();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }

                    }
                });
            }
        });
        $(document).on('click', '#createUOM', function () {
            var uomName = $('#OUMName').val().trim();
            let md = {
                UOM: uomName
            }
            var isValid = formValidateForAddorUpdateUOM(md);
            if (isValid) {
                $.ajax({
                    url: "/User/CreateUOM",
                    type: "POST",
                    data: md,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#addUOM').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllBankAccount();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });

        function formValidateForUpdateClassification(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Classification === "" || formData.Classification === undefined) {
                IsValid = false;
                Title = "Classification cannot be Empty";
                notify(IsSuccess, Title, IsValid);
                document.getElementById("invtermClassification").focus();
            }



            return IsValid;
        }
        function formValidateForUpdateVendor(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Terms === "" || formData.Terms === undefined) {
                IsValid = false;
                Title = "Terms cannot be empty";
                notify(IsSuccess, Title, IsValid);
                document.getElementById("invterm1").focus();
            }
            return IsValid;
        }
        function formValidateForContactType(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.ContactType === "" || formData.ContactType === undefined) {
                IsValid = false;
                Title = "Contact Type  cannot be empty";
                notify(IsSuccess, Title, IsValid);
                document.getElementById("invterm1").focus();
            }
            return IsValid;
        }
        function formValidateForAddBankAcc(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Bank_Account === "" || formData.Bank_Account === undefined) {
                IsValid = false;
                Title = "BankAccount cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.Desc === "" || formData.Desc === undefined) {
                IsValid = false;
                Title = "BankAccount Description cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }




            return IsValid;
        }
        function formValidateForUpdateBankAcc(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Bank_Account === "" || formData.Bank_Account === undefined) {
                IsValid = false;
                Title = "BankAccount cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.Desc === "" || formData.Desc === undefined) {
                IsValid = false;
                Title = "BankAccount Description cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }





            return IsValid;
        }

        function formValidateForAddorUpdateUOM(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.UOM === "" || formData.UOM === undefined) {
                IsValid = false;
                Title = "Unit Of Measure Name cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            return IsValid;
        }
        function formValidateForAddorUpdateCurrency(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Currency === "" || formData.Currency === undefined) {
                IsValid = false;
                Title = "Currency cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.CurrencyCode === "" || formData.CurrencyCode === undefined) {
                IsValid = false;
                Title = "Currency Code cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            return IsValid;
        }

        function formValidateForState_Prov(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.State === "" || formData.State === undefined) {
                IsValid = false;
                Title = "State cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.StateCode === "" || formData.StateCode === undefined) {
                IsValid = false;
                Title = "State Code cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            return IsValid;
        }
        function formValidateForCountries(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Country === "" || formData.Country === undefined) {
                IsValid = false;
                Title = "Country cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.CountryCode === "" || formData.CountryCode === undefined) {
                IsValid = false;
                Title = "Country Code cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            return IsValid;
        }
        function formValidateForPaymentSchedule(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.Terms === "" || formData.Terms === undefined) {
                IsValid = false;
                Title = "Payment Terms cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }

            return IsValid;
        }

        function formValidateForShipMethod(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.ShipMethod === "" || formData.ShipMethod === undefined) {
                IsValid = false;
                Title = "Shipment Name cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }

            return IsValid;
        }

        function formValidateForFabricationApproval(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.ItemName === "" || formData.ItemName === undefined) {
                IsValid = false;
                Title = "Fabrication Approval Name cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }
            else if (formData.ItemShortName === "" || formData.ItemShortName === undefined) {
                IsValid = false;
                Title = "Fabrication Approval Short Name cannot be Empty";
                notify(IsSuccess, Title, IsValid);

            }

            return IsValid;
        }


        var filedata = {};
        var filedatacount = 0;
        var fileName = "";
        $(document).on("change", "#TermsFileUpload", function () {
            $.confirm({
                title: '',
                message: 'Do you want to add this file?',
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    if ($("#TermsFileUpload")[0].files.length > 1) {
                        var Title = 'Only One file you can upload!!!';
                        notify(false, Title, false);
                        $("#TermsFileUpload").val('');
                        return;
                    }

                    $('#btn_ChangeTCFile').show();
                    $('#fileList').html('');

                    if (filedatacount > 0) {

                        for (var i = 0; i < filedatacount; i++) {
                            delete filedata["fileupload" + i];
                        }

                        $('#fileList').html('');
                        filedatacount = 0;
                    }


                    filedata["fileupload" + filedatacount] = $("#TermsFileUpload")[0].files[0];
                    var html = '<a>' + $("#TermsFileUpload")[0].files[0].name + '</a>';
                    html += '<a id="delfile"><i class="fa-solid fa-trash"></i></a>';
                    filedatacount++;
                    $('#fileList').html(html);
                },
                onCancel: function () {
                    $("#TermsFileUpload").val('');
                    return;
                }
            });

            //showConfirmationDialog('', 'Do you want to add this file?', function () {



            //}, function () {
            //    $("#TermsFileUpload").val('');
            //    return false;
            //});            

        });

        $(document).on("click", "#btn_ChangeTCFile", function () {

            if (filedatacount == 0) {
                var Title = 'Please select file!!!';
                notify(false, Title, false);
                return;
            }

            //         showConfirmationDialog('', 'Are you sure want to upload file?', function () {
            //             uploadSystemTermsFile();
            //         }, function () {
            //             console.log('Cancelled');
            //});		
            $.confirm({
                title: 'Upload file',
                message: 'Are you sure want to upload file?',
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    uploadSystemTermsFile();
                },
                onCancel: function () {

                }
            });

        });

        function uploadSystemTermsFile() {

            var formData = new FormData();
            for (var key in filedata) {

                formData.append(key, filedata[key]);
            }

            $.ajax({
                url: "/User/UploadSystemTerms",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;
                    if (data.IsSuccess) {
                        Title = 'Terms And Condition File Upload Successfully';
                        $('#btn_ChangeTCFile').hide();
                        //$('#fileList').html('');

                        //var html = '<a target="_blank"  href="/Assets/SystemTermsFiles/' + data.Result + '">SystemTermFile</a>';
                        //$('#fileList').html(html);
                        $(".loader").css("display", "none");
                        notify(IsSuccess, Title, false);
                        GetDefaultSystemTermsFile();
                    }
                    else {
                        $(".loader").css("display", "none");
                        Title = data.ErrorMessages;
                        notify(IsSuccess, Title, IsValid);
                    }

                }
            });
        }

        $(document).on("click", "#delfile", function () {
            var fileName = $('#fileList a').text();
            if (fileName != "SystemTermsFile") {
                $.confirm({
                    title: '',
                    message: 'Do you want to add this file?',
                    type: 'confirm',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        $('#fileList').html('');
                        $("#TermsFileUpload").val('');
                        filedata = {};
                        $('#btn_ChangeTCFile').hide();
                        notify(true, 'Terms File Deleted Successfull!!', false);
                    },
                    onCancel: function () {
                        return;
                    }
                });

                //showConfirmationDialog('', 'Do you want to add this file?', function () {



                //}, function () {                    
                //    return false;
                //});				
            }
            else {
                return;
            }

        });


        $(document).on('click', '#editInvAdd', function () {
            var InvoiceAddressID = $(this).data('id');
            $.ajax({
                url: "/User/EditModalInvoiceAddress?InvoiceAddressID=" + InvoiceAddressID,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#editInvAddModal').html('');
                        $('#editInvAddModal').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }

                }
            });
        });

        $(document).on('click', '#upInvAdd', function () {
            var invId = $('#hidenInvAddId').val();
            var inAddress = $('#inv_Add').val();
            var country = $("#inv_Countrylist option:selected").val();
            var state = $("#invadd_State option:selected").val();
            var city = $("#invadd_City").val();
            var postalCode = $("#invadd_Postalcode").val();
            let fd = {


                FldID: invId,
                InvoiceAddress: inAddress,
                StateID: state,
                CountryID: country,
                City: city,
                PostalCode: postalCode,

            }
            var isValid = formValidateForInvoiceAddress(fd);
            if (isValid) {

                $.ajax({
                    url: "/User/UpdateInvoiceAddress",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var IsSuccess = data.IsSuccess;
                        var Title = data.Result;
                        var IsValid = true;
                        if (data.IsSuccess) {
                            $('#edit_inv_addrs').modal('hide');
                            $(".loader").css("display", "none");
                            notify(IsSuccess, Title, IsValid);
                            GetAllInvoiceAddress();
                        }
                        else {
                            $(".loader").css("display", "none");
                            Title = data.ErrorMessages;
                            notify(IsSuccess, Title, IsValid);
                        }
                    }
                });
            }
        });


        $(document).on('change', '#inv_Countrylist', function () {

            countryId = $(this).val();
            var InvStateDropDown = $('#invadd_State');
            if (countryId == "0" || countryId == null || countryId == undefined) {
                InvStateDropDown.empty();
                InvStateDropDown.append('<option value="0"selected>Select a state</option>');
                return;
            }
            $.ajax({
                url: "/User/getStateByCountryId?countryId=" + countryId,
                type: "GET",
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var stateDropdown = $('#invadd_State');
                    stateDropdown.empty();
                    stateDropdown.append('<option value=""selected>Select a state</option>');
                    $.each(data.Result, function (index, state) {

                        stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        /*  stateDropdown.append('<option value="' + state.StateID + '">' + state.State + '</option>');*/
                        //console.log(state);

                    });
                    $(".loader").css("display", "none");
                }
            })


        });

        function formValidateForInvoiceAddress(formData) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (formData.InvoiceAddress === "" || formData.InvoiceAddress === undefined) {
                IsValid = false;
                Title = "InvoiceAddress cannot be Empty";
                notify(false, Title, false);

            }


            return IsValid;
        }

        $(document).on('keyup', '#searchTab', function () {

            var value = $(this).val().toUpperCase().trim();
            $('.nav-tabs li').each(function () {
                if ($(this).find('button').text().toUpperCase().indexOf(value) >= 0 && value != '') {
                    $(this).addClass('searchfind');
                }
                else {
                    $(this).removeClass('searchfind');
                }
            });


        });

        $(document).on('click', '#setAuth', function () {
            let checkUrl = _BaseURL + "/Quickbook/Authentication";
            $.ajax({
                url: "/Quickbook/CheckValidity",
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").hide();

                    console.log(data);
                    if (data.requireAuthentication) {
                        window.open(checkUrl, "", "width=500,height=600");
                        return;
                    }

                    $.confirm({
                        title: '',
                        message: `There is an active connection for "${data.companyName}" set on ${data.writeDate}. Do you still want to Authenticate?`,
                        type: 'confirm',
                        confirmText: 'Yes, Proceed',
                        cancelText: 'Cancel',
                        onConfirm: function () {
                            window.open(checkUrl, "", "width=500,height=600");
                        },
                        onCancel: function () {
                            return;
                        }
                    });

                    // if (data == "INVALID") {
                    //     $(".loader").css("display", "none");
                    //     window.open(checkUrl, "", "width=500,height=600");
                    // }
                    // else {
                    //     $(".loader").css("display", "none");
                    //     //const result = data.Result;
                    //     $.confirm({
                    //         title: '',
                    //         message: "There is an active connection for \"" + data.split(',')[0] + "\" set on " + data.split(',')[1] + ". Do you still want to Authenticate?",
                    //         type: 'confirm',
                    //         confirmText: 'Yes, Proceed',
                    //         cancelText: 'Cancel',
                    //         onConfirm: function () {
                    //             $(".loader").css("display", "none");
                    //             window.open(checkUrl, "", "width=500,height=600");
                    //         },
                    //         onCancel: function () {
                    //             return;
                    //         }
                    //     });
                    // }
                    // $(".loader").css("display", "none");
                }
            });
        });

        $(document).on('click', '#checkAuth', function () {

            $.ajax({
                url: "/Quickbook/CheckValidity",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    $(".loader").hide();

                    if (!data.isSuccess) {
                        notify(false, data.message || "There is no active connection.", false);
                        return;
                    }

                    const message = `There is an active connection for "${data.companyName}" set on ${data.writeDate}.`;

                    notify(true, message, false);
                },
                error: function () {
                    $(".loader").hide();
                    notify(false, "Unable to verify the QuickBooks connection.", false);
                }
            });

        });

        // $(document).on('click', '#checkAuth', function () {
        //     $.ajax({
        //         url: "/Quickbook/CheckValidity",
        //         type: 'GET',
        //         beforeSend: function () {
        //             $(".loader").css("display", "flex");
        //         },
        //         success: function (data) {
        //             $(".loader").css("display", "none");
        //             if (data != "INVALID") {
        //                 const result = data;
        //                 const message = "There is an active connection for \"" + result.split(',')[0] + "\" set on " + result.split(',')[1] + ".";
        //                 $(".loader").css("display", "none");
        //                 notify(true, message, false);
        //             }
        //             else {
        //                 $(".loader").css("display", "none");
        //                 notify(false, "There is no active connection.", false);
        //             }
        //         }
        //     });
        // });

        $(document).on('click', '#syncBankAccount', async function () {

            try {
                $(".loader").css("display", "flex");

                const response = await SyncQBSAccount();

                if (response.Result === "SUCCESS") {
                    $.notify.success('Success', 'QBS account sync successful');
                }
                else {
                    $.notify.error('Error', response.ErrorMessages);
                }
            }
            catch (xhr) {
                $.notify.error('Error', xhr.responseText || 'An error occurred');
            }
            finally {
                $(".loader").css("display", "none");
            }

            // const response = SyncQBSAccount();
            // $(".loader").css("display", "flex");
            // if (response == 'SUCCESS') {
            //     notify(true, 'QBS account sync Successfull', true);
            // }
            // else {
            //     notify(false, response, true);
            // }
            // $(".loader").css("display", "none");
        });
    }
    //#endregion

    // #region :: Bridge Supporter
    if (action_name === "bridgesupporter") {
        // multiselect from      

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;
        const projectIdsStr = _UserPreferences["Dropdown.ProjectId"] || "";
        const projectIds = projectIdsStr.split(',').map(id => id.trim()).filter(id => id);

        if (projectIds.length > 0) {
            $('#projectId').val(projectIds);
        }

        setTimeout(() => {
            $('#searchInvoice').trigger('click');
        }, 300);


        $(".multislct").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
        });

        $('.txt_FromDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',
        });

        $('.txt_ToDate').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',
        });

        setTimeout(function () {

            $('.datecontrol').val('13');

            var fromSelector = $('.datecontrol').attr('data-from');
            var toSelector = $('.datecontrol').attr('data-to');

            var from = $('.' + fromSelector);
            var to = $('.' + toSelector);

            var startdate = moment().subtract(365, "days").format("YYYY.MM.DD");
            var enddate = moment().format("YYYY.MM.DD");

            // If you want to set empty dates, otherwise use the dates calculated above
            startdate = '';
            enddate = '';

            from.datepicker("option", "disabled", true);
            to.datepicker("option", "disabled", true);

            from.datepicker('setDate', startdate);
            to.datepicker('setDate', enddate);

        }, 0);

        $(document).on('change', '.datecontrol', function () {
            //$('.datecontrol').val($(this).val());

            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');

            if ($(this).hasClass('classselector')) {
                from = $('.' + from);
                to = $('.' + to);
            }
            else {
                from = $('#' + from);
                to = $('#' + to);
            }

            var mode = $(this).find('option:selected').attr('data-val');


            var startdate;
            var enddate;

            switch (mode) {
                case 'All':
                    //startdate = moment().subtract(365, "days").format("YYYY.MM.DD");
                    //enddate = moment().format("YYYY.MM.DD");
                    startdate = '';//moment().subtract(365, "days").format("YYYY.MM.DD");
                    enddate = '';//moment().format("YYYY.MM.DD");

                    break;
                case 'last365':
                    startdate = moment().subtract(365, "days").format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'today':
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'custom':
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'yesterday':
                    startdate = moment().subtract(1, "days").format("YYYY.MM.DD");
                    enddate = moment().subtract(1, "days").format("YYYY.MM.DD");
                    break;
                case 'thisweek':
                    startdate = moment().startOf('week').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'thismonth':
                    startdate = moment().startOf('month').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'thisquarter':
                    startdate = moment().startOf('quarter').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'thisyear':
                    startdate = moment().startOf('year').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'lastweek':
                    var tdate = moment().subtract(1, 'week');
                    startdate = tdate.startOf('week').format("YYYY.MM.DD");
                    enddate = tdate.endOf('week').format("YYYY.MM.DD");
                    break;

                case 'lastmonth':
                    var tdate = moment().subtract(1, 'month');
                    startdate = tdate.startOf('month').format("YYYY.MM.DD");
                    enddate = tdate.endOf('month').format("YYYY.MM.DD");
                    break;
                case 'lastquarter':
                    var tdate = moment().subtract(1, 'quarter');
                    startdate = tdate.startOf('quarter').format("YYYY.MM.DD");
                    enddate = tdate.endOf('quarter').format("YYYY.MM.DD");
                    break;

                case 'lastyear':
                    var tdate = moment().subtract(1, 'year');
                    startdate = tdate.startOf('year').format("YYYY.MM.DD");
                    enddate = tdate.endOf('year').format("YYYY.MM.DD");
                    break;


                default:
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
            }

            if (mode != "custom") {
                $(from).datepicker("option", "disabled", true);
                $(to).datepicker("option", "disabled", true);
            }
            else {
                $(from).datepicker("option", "disabled", false);
                $(to).datepicker("option", "disabled", false);
            }

            $(from).datepicker('setDate', startdate);
            $(to).datepicker('setDate', enddate);
        });

        $(document).on("click", "#searchInvoice", function () {
            const projectid = $("#projectId").val();
            const vendorid = $("#vendorid").val();
            const formdate = $("#fromdate").val();
            const todate = $("#todate").val();
            if (!projectid) {

                notify(false, 'Please select project!.', false);
                return;
            }

            _invoiceAllDataBind({ _projectid: projectid + '', _vendorid: vendorid + '', _fromdate: formdate, _todate: todate });
        });

        function _invoiceAllDataBind(opt) {
            let _stringArray = [], _stringHtml = '', projectid = 0, vendorid = 0, formdate = "", todate = "";

            if ("_projectid" in opt)
                projectid = opt._projectid;

            if ("_vendorid" in opt)
                vendorid = opt._vendorid;

            if ("_fromdate" in opt)
                formdate = opt._fromdate;

            if ("_todate" in opt)
                todate = opt._todate;

            projectid = projectid == 'null' ? '' : projectid;
            vendorid = vendorid == 'null' ? '' : vendorid;
            formdate = formdate == 'null' ? '' : formdate;
            todate = todate == 'null' ? '' : todate;

            $.ajax({
                url: '/User/GetAllInvoiceDetails?projectid=' + projectid + "&vendorid=" + vendorid + "&formdate=" + formdate + "&todate=" + todate,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = false;
                    var Title = "";
                    var IsValid = true;

                    if (data != null) {
                        $('#invoicetableData').html("");
                        $('#invoicetableData').html(data);
                        $(".loader").css("display", "none");
                        InvoiceDataTable();
                    }
                    else {
                        $(".loader").css("display", "none");
                        Title = "Something Went Wrong!";
                        notify(IsSuccess, Title, IsValid);
                    }

                }
            });
        }

        function InvoiceDataTable() {
            $("#invoice_data_table thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#invoice_data_table thead");

            $("#invoice_data_table").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                order: [[1, "asc"]],
                orderCellsTop: true,
                scrollX: true,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    { targets: [0], orderable: false },
                ],
                initComplete: function () {
                    let api = this.api();
                    api.columns().eq(0)
                        .each(function (colIdx) {
                            let cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                            let title = $(cell).text();
                            const selectHtml = '<select class="form-select"><option value="">All</option><option value="1">Yes</option><option value="0">No</option></select>';
                            if (colIdx === 0) {
                                $(cell).html('<button type="button" class="form-control" id="resetInvoicetable">Reset</button>');
                            }
                            if (colIdx === 6 || colIdx === 7 || colIdx === 8) {
                                $(selectHtml)
                                    .appendTo($(cell))
                                    .on("change", function () {
                                        let val = $(this).val();
                                        $.fn.dataTable.ext.search.push(
                                            function (settings, data, dataIndex) {
                                                if (val === "") return true;
                                                let cell = api.cell(dataIndex, colIdx).node();
                                                let status = $(cell).find('i').data('status');
                                                return status == val;
                                            }
                                        );

                                        api.draw();
                                        $.fn.dataTable.ext.search.pop();
                                    });
                            }
                            //else if () {
                            //    $(selectHtml)
                            //        .appendTo($(cell))
                            //        .on("change", function () {
                            //            let val = $(this).val();
                            //            $.fn.dataTable.ext.search.push(
                            //                function (settings, data, dataIndex) {
                            //                    if (val === "") return true;
                            //                    let cell = api.cell(dataIndex, colIdx).node();
                            //                    let status = $(cell).find('i').data('status');
                            //                    return status == val;
                            //                }
                            //            );

                            //            api.draw();
                            //            $.fn.dataTable.ext.search.pop();
                            //        });
                            //}
                            //else if () {
                            //    $(selectHtml)
                            //        .appendTo($(cell))
                            //        .on("change", function () {
                            //            let val = $(this).val();
                            //            $.fn.dataTable.ext.search.push(
                            //                function (settings, data, dataIndex) {
                            //                    if (val === "") return true;
                            //                    let cell = api.cell(dataIndex, colIdx).node();
                            //                    let status = $(cell).find('i').data('status');
                            //                    return status == val;
                            //                }
                            //            );

                            //            api.draw();
                            //            $.fn.dataTable.ext.search.pop();
                            //        });
                            //}
                            else {
                                $(cell).html('<input type="text" class="form-control" placeholder="' + title + '" />');
                            }
                            $("input", $(".filters th")
                                .eq($(api.column(colIdx).header()).index()))
                                .off("keyup")
                                .on("keyup", function () {
                                    $(this).attr("title", $(this).val());
                                    let regexr = "({search})";
                                    api.column(colIdx)
                                        .search(
                                            this.value !== ""
                                                ? regexr.replace("{search}", "(((" + this.value + ")))")
                                                : "",
                                            this.value !== "",
                                            this.value === ""
                                        )
                                        .draw();
                                });
                        });
                },
            });

            // Listen to page length change event
            $('#invoice_data_table').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on("click", "#resetInvoicetable", function () {
            var table = $('#invoice_data_table').DataTable();

            $(this)
                .closest('tr')
                .find('input.form-control')
                .val('');

            table
                .search('')
                .columns().search('')
                .page.len(50)
                .draw();
        });

        $(document).on("click", ".invoicehistory", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var flid = $('#' + id + '').data('flid');
            $.ajax({
                url: '/User/GetInvoiceHistoryDetails?flid=' + flid,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = false;
                    var Title = "";
                    var IsValid = true;

                    if (data != null) {
                        $('#invoicehistorytable').html("");
                        $('#invoicehistorytable').html(data);
                        InvoiceHistoryDatatableBind();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        Title = "Something Went Wrong!";
                        notify(IsSuccess, Title, IsValid);
                    }
                }
            });
        });

        function InvoiceHistoryDatatableBind() {
            $("#invoice_data_table_history").DataTable({

                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                "autoWidth": true,
                initComplete: function () {
                    var api = this.api();
                },
            });
            // Listen to page length change event
            $('#invoice_data_table_history').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on("click", ".cansendevent", function (e) {
            const _this = $(e.currentTarget);
            const id = _this[0].id;
            const status = _this[0].attributes[3].nodeValue == 1 ? 0 : 1;
            let flid = $('#' + id + '').data('flid');

            $.ajax({
                url: '/User/EventCanSend?flid=' + flid + "&status=" + status,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        if (status === 0) {
                            $(_this).removeClass('fa-check')
                                .addClass('fa-times')
                                .css('color', '#fb3939')
                                .attr('data-status', "0")
                                .parent().next('td').children('i').attr("style", "cursor:not-allowed;color:#d2c8c8;");
                            $.ajax({
                                url: '/User/EventIsSent?flid=' + flid + "&status=" + status,
                                type: 'GET',
                                contentType: false,
                                processData: false,
                                cache: false,
                                dataType: 'json',
                                success: function (data) {
                                    if (data.IsSuccess) {
                                        if (status === 0) {
                                            $(_this).parent().next('td').children('i').removeClass('fa-check')
                                                .addClass('fa-times')
                                                .css('color', '#fb3939')
                                                .attr('data-status', "0")
                                                .attr("style", "cursor:not-allowed;color:#d2c8c8;");
                                        }

                                    }
                                }
                            });

                        }
                        else {
                            $(_this).removeClass('fa-times')
                                .addClass('fa-check')
                                .css('color', '#5abf26')
                                .attr('data-status', "1")
                                .parent().next('td').children('i').removeAttr("style");
                        }
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on("click", ".issentevent", function (e) {
            const _this = $(e.currentTarget);
            const id = _this[0].id;
            const status = _this[0].attributes[3].nodeValue == 1 ? 0 : 1;
            let flid = $('#' + id + '').data('flid');

            $.ajax({
                url: '/User/EventIsSent?flid=' + flid + "&status=" + status,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        if (status === 0) {
                            $(_this).removeClass('fa-check')
                                .addClass('fa-times')
                                .css('color', '#fb3939')
                                .attr('data-status', "0");
                        }
                        else {
                            $(_this).removeClass('fa-times')
                                .addClass('fa-check')
                                .css('color', '#5abf26')
                                .attr('data-status', "1");
                        }
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on("click", ".ispaidevent", function (e) {
            const _this = $(e.currentTarget);
            const id = _this[0].id;
            const status = _this[0].attributes[3].nodeValue == 1 ? 0 : 1;
            let flid = $('#' + id + '').data('flid');

            $.ajax({
                url: '/User/EventIsPaid?flid=' + flid + "&status=" + status,
                type: 'GET',
                contentType: false,
                processData: false,
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        if (status === 0) {
                            $(_this).removeClass('fa-check')
                                .addClass('fa-times')
                                .css('color', '#fb3939')
                                .attr('data-status', "0");
                        }
                        else {
                            $(_this).removeClass('fa-times')
                                .addClass('fa-check')
                                .css('color', '#5abf26')
                                .attr('data-status', "1");
                        }
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on('click', '.openRef', function (e) {
            const _this = e.currentTarget;
            const refNo = _this.getAttribute('data-ref');
            const flId = _this.getAttribute('data-flid');
            $('#flId').val('');
            $('#refNo').val('');
            $('#flId').val(flId);
            $('#refNo').val(refNo);
            $('#refNumberEdit').modal('show');
        });

        $(document).on('click', '#saveRefNo', function () {
            const refNo = $('#refNo').val();
            const flId = $('#flId').val();
            if (refNo === '' || refNo === undefined || refNo === null) {
                notify(false, 'Please enter Ref No!.', true);
                return;
            }
            const formData = {
                flid: flId,
                refid: refNo
            };

            $.ajax({
                url: '/User/UpdateRefNo',
                type: 'GET',
                data: formData,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (result) {
                    //const data = JSON.parse(result);
                    if (result.IsSuccess) {
                        const projectid = $("#projectId").val() + '';
                        const vendorid = $("#vendorid").val() + '';
                        const formdate = $("#fromdate").val();
                        const todate = $("#todate").val();

                        _invoiceAllDataBind({ _projectid: projectid, _vendorid: vendorid, _fromdate: formdate, _todate: todate });

                        notify(true, result.Result, false);
                        $('#flId').val('');
                        $('#refNo').val('');
                        $('#refNumberEdit').modal('hide');
                    }
                    else {
                        notify(false, "Something wrong!.", false);
                    }
                    $(".loader").css("display", "none");
                }
            })
        });
    }
    //#endregion

    // #region :: Bridge Supporter Report
    if (action_name === "bridgesupporterreport") {
        // multiselect from

        const projectIdsStr = _UserPreferences["Dropdown.ProjectId"] || "";
        const projectIds = projectIdsStr.split(',').map(id => id.trim()).filter(id => id);

        if (projectIds.length > 0) {
            $('#dllProject').val(projectIds);
        }


        $("#dllProject").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select Project",
            filterPlaceholder: "Enter Keyword",
            selectAll: false,
            onClick: function (e) {
                if ($("#dllProject").multipleSelect("getSelects").length > 5) {
                    var lastSelectedValue = e.value;
                    var allSelectedvalues = $("#dllProject").val();
                    var index = allSelectedvalues.indexOf(lastSelectedValue);
                    allSelectedvalues.splice(index, 1);
                    $("#dllProject").multipleSelect("setSelects", allSelectedvalues, true);
                    notify(false, "Select maximum five projects!", true);
                }
            },
            onClose: function (e) {
                const projectValues = $("#dllProject").val();
                if (!projectValues) {
                    return;
                }
                const ProjectId = projectValues.join(',');
                bind_vendor(ProjectId);

            }
        });
        $("#ddlVendor").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select Vendor",
            filterPlaceholder: "Enter Keyword",
            selectAll: false,
            onClick: function (e) {
                if ($("#ddlVendor").multipleSelect("getSelects").length > 5) {
                    var lastSelectedValue = e.value;
                    var allSelectedvalues = $("#ddlVendor").val();
                    var index = allSelectedvalues.indexOf(lastSelectedValue);
                    allSelectedvalues.splice(index, 1);
                    $("#ddlVendor").multipleSelect("setSelects", allSelectedvalues, true);
                    notify(false, "Select maximum five vendors!", true);
                }
            },
        });
        $(".ddlIsSend").multipleSelect({
            filter: false,
            showClear: false,
            placeholder: "Please Select",
            single: true
        });
        $(".ddlcanSend").multipleSelect({
            filter: false,
            showClear: false,
            placeholder: "Please Select",
            single: true
        });
        $(".ddlIsPaid").multipleSelect({
            filter: false,
            showClear: false,
            placeholder: "Please Select",
            single: true
        });
        $(".ddlSuptrAmt").multipleSelect({
            filter: false,
            showClear: false,
            placeholder: "Please Select",
            single: true
        });

        $('.fromsearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',

        });
        $('.tosearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',
        });

        function bind_vendor(ProjectId) {
            $.ajax({
                url: '/User/GetBridgeSupporterVendor',
                type: 'GET',
                dataType: 'JSON',
                data: { ProjectIds: ProjectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const $selectVen = $("#ddlVendor");
                    $selectVen.empty();
                    if (data.IsSuccess) {
                        data.Result.forEach(function (vendor) {
                            const option = `<option value="${vendor.id}">${vendor.name}</option>`;
                            $selectVen.append(option);
                        });
                        $selectVen.multipleSelect('refresh');
                    }
                    else {
                        notify(data.IsSuccess, data.ErrorMessages, false);

                    }
                    $(".loader").css("display", "none");
                }
            });
        }

        $('.datecontrol').on('change', function () {

            var parentContainer = $(this).closest('.st_dtRange');
            var from = parentContainer.find('.' + $(this).data('from'));
            var to = parentContainer.find('.' + $(this).data('to'));

            var mode = $(this).val();

            var startdate;
            var enddate;

            switch (mode) {
                case 'All':
                    startdate = '';
                    enddate = '';
                    break;
                case 'last365':
                    startdate = moment().subtract(365, "days").format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'today':
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'custom':
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'yesterday':
                    startdate = moment().subtract(1, "days").format("YYYY.MM.DD");
                    enddate = moment().subtract(1, "days").format("YYYY.MM.DD");
                    break;
                case 'thisweek':
                    startdate = moment().startOf('week').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'thismonth':
                    startdate = moment().startOf('month').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
                case 'thisquarter':
                    startdate = moment().startOf('quarter').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'thisyear':
                    startdate = moment().startOf('year').format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;

                case 'lastweek':
                    var tdate = moment().subtract(1, 'week');
                    startdate = tdate.startOf('week').format("YYYY.MM.DD");
                    enddate = tdate.endOf('week').format("YYYY.MM.DD");
                    break;

                case 'lastmonth':
                    var tdate = moment().subtract(1, 'month');
                    startdate = tdate.startOf('month').format("YYYY.MM.DD");
                    enddate = tdate.endOf('month').format("YYYY.MM.DD");
                    break;
                case 'lastquarter':
                    var tdate = moment().subtract(1, 'quarter');
                    startdate = tdate.startOf('quarter').format("YYYY.MM.DD");
                    enddate = tdate.endOf('quarter').format("YYYY.MM.DD");
                    break;

                case 'lastyear':
                    var tdate = moment().subtract(1, 'year');
                    startdate = tdate.startOf('year').format("YYYY.MM.DD");
                    enddate = tdate.endOf('year').format("YYYY.MM.DD");
                    break;


                default:
                    startdate = moment().format("YYYY.MM.DD");
                    enddate = moment().format("YYYY.MM.DD");
                    break;
            }
            if (mode != "custom") {
                from.datepicker("option", "disabled", true);
                to.datepicker("option", "disabled", true);
            }
            else {
                from.datepicker("option", "disabled", false);
                to.datepicker("option", "disabled", false);
            }

            from.datepicker('setDate', startdate);
            to.datepicker('setDate', enddate);
        });

        $(document).on("click", "#exportToBridgePDF", function (e) {

            e.preventDefault();

            const projectValues = $("#dllProject").val();
            if (!projectValues) {
                notify(false, "Please Select Projects!!!", false);
                return;
            }
            const ProjectId = projectValues.join(',');

            let AllVendorID = $('#ddlVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            var From_Date, To_date;
            if ($('.fromsearch').val() != '')
                From_Date = $('.fromsearch').val();
            else
                From_Date = "";
            if ($('.tosearch').val() != '')
                To_date = $('.tosearch').val();
            else
                To_date = "";

            var SendType = $(".ddlIsSend option:selected").val() ?? "";
            var CanSendType = $(".ddlcanSend option:selected").val() ?? "";
            var PaidType = $(".ddlIsPaid option:selected").val() ?? "";

            var SupporterAmt = $(".ddlSuptrAmt option:selected").val();
            if (SupporterAmt === undefined || SupporterAmt === null) {
                notify(false, "Please Select Supporter Amount!!!", false);
                return;
            }

            fetchReportData(
                '/Reports/BridgeSupporterReports',
                {
                    AllProjectID: ProjectId,
                    AllVendorID: VendorId,
                    From_Date: From_Date,
                    To_date: To_date,
                    SendType: SendType,
                    CanSendType: CanSendType,
                    PaidType: PaidType,
                    SupporterAmt: SupporterAmt
                }
            );

        });

        function fetchReportData(url, data) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'JSON',
                data: data,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        window.open(data.Result, '_blank');
                    } else {
                        notify(data.IsSuccess, data.ErrorMessages, false);
                    }
                }
            });
        }
    }
    //#endregion
});