$(document).on("UserPreferencesReady", function () {
    var _BaseURL = window.location.origin;
    var QueryParameter = window.location.pathname.split("/");
    var action_name = QueryParameter[2].toLocaleLowerCase();
    // #region :: Add Vendor
    if (action_name === 'addvendor') {
        let isDirty = false;

        $(document).on('change keyup', '#addVendorForm input, #addVendorForm select, #addVendorForm textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $(".multislct").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
        });

        $(document).on("change", "#ddlCountry", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#ddlState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        });

        $(document).on("change", "#RDdl_Country", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#RDdl_State');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        });

        $(document).on("click", "#btn_CrtPrntVndr", function () {
            var txt_Terms = $('#invTerm option:selected').val();
            var Name = $('#txt_Name').val().trim();
            var LegalName = $('#txt_LegalName').val().trim();
            var ShortName = '';
            var Address = $('#txt_Addr').val().trim();
            var country = $('#ddlCountry option:selected').val();
            var state = $('#ddlState option:selected').val();
            var City = $('#txt_City').val().trim();
            var ZipCode = $('#txt_ZipCode').val().trim();
            var curr = $('#Ddl_Currency option:selected').val();
            var clfs = $('#Ddl_Clftion').val();

            if (clfs != null && clfs != 'null' && clfs != undefined && clfs != 'undefined') {
                clfs = clfs.toString().replace(/,/g, ",");
            }
            else {
                clfs = '';
            }


            var VndrNotes = $('#txt_VndrNotes').val().trim();
            var Minority = $("#minor_owner").is(':checked') ? "1" : "0";
            var Woman = $("#women_owner").is(':checked') ? "1" : "0";

            var RStatus = $('#different_address').is(':checked');



            var RAddress = $('#Rtxt_Addr').val().trim();
            var RCity = $('#Rtxt_City').val().trim();
            var Rcountry = $('#RDdl_Country option:selected').val();
            var RState = $('#RDdl_State option:selected').val();
            var RZipCode = $('#Rtxt_ZipCode').val().trim();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            if (!RStatus) {
                RAddress = Address;
                RCity = City;
                RZipCode = ZipCode;
                RState = state;
                Rcountry = country;
            };

            let fd = {
                ParentVendorName: Name,
                LegalName: LegalName,
                CurrCode: parseInt(curr),
                Address1: Address,
                Country: parseInt(country),
                State: parseInt(state),
                City: City,
                ZipCode: ZipCode,
                Note: VndrNotes,
                Terms_ID: BigInt(txt_Terms),
                R_Flag: RStatus,
                R_Country: Rcountry,
                R_State: RState,
                R_City: RCity,
                R_ZipCode: RZipCode,
                R_Address: RAddress,
                Minority_own_business: Minority,
                Woman_own_business: Woman,
                ClassificationList: clfs
            }

            var isValid = formValidateForAddParentVendor(fd);

            if (isValid) {
                $.ajax({
                    url: "/Vendors/AddParentVendor",
                    type: "POST",
                    data: fd,
                    dataType: "JSON",
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        var Title = data.Result;
                        if (data.IsSuccess) {
                            isDirty = false;
                            MovetoVendorContactForNewParentVendor();
                        }
                        else {
                            if (data.ErrorMessages == 'INVALID^ParentVendorName') {                               
                                $.notify.error('Error', 'This Vendor Already exists !');
                                $('#txt_Name').val('');
                                $('#txt_LegalName')
                                    .addClass('errorClass')
                                    .one('input', function () {
                                        $(this).removeClass('errorClass');
                                    });
                                $('#Ddl_Currency').addClass('errorClass');
                            }
                            else {
                                $.notify.error('Error', 'Problem to create Vendor!');
                            }

                        }


                    }
                });

            }



        });

        function formValidateForAddParentVendor(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.Terms_ID == 0) {
                IsValid = false;
                Title = "You must select invoice terms before continue";
                $.notify.warning('Caution', Title);
                $('#invTerm')[0]?.focus();
                return;
            }
            if (fd.LegalName === "" || fd.LegalName === undefined) {
                IsValid = false;
                Title = "You must enter Legal Name before continue";
                $.notify.warning('Caution', Title);
                $('#txt_LegalName')[0]?.focus();
                return;
            }
            if (fd.ParentVendorName === "" || fd.ParentVendorName === undefined) {
                IsValid = false;
                Title = "You must enter a Vendor Name before continue";
                $.notify.warning('Caution', Title);
                $('#txt_Name')[0]?.focus();
                return;
            }
            if (fd.CurrCode === 0 || fd.CurrCode === undefined) {
                IsValid = false;
                Title = "You must select Currency before continue";
                $.notify.warning('Caution', Title);
                return;
            }

            return IsValid;
        }

        function MovetoVendorContactForNewParentVendor() {
            $.notify.info('Info', 'Now please add a contact for this vendor. The vendor will not be saved if a contact is not added.');
            $(".loader").css("display", "flex");
            window.setTimeout(function () {
                window.location = "/Vendors/VendorContactsForNewParentVendor";
            }, 4000);

        }

        $(document).on("keyup", "#txt_LegalName", function () {
            if ($("#Ddl_Currency").val() != '0') {
                $("#txt_Name").val($("#txt_LegalName").val() + " (" + $("#Ddl_Currency option:selected").attr('data-currcode') + ")");
            }
            else {
                $("#txt_Name").val($("#txt_LegalName").val());
            }
        });

        $(document).on("change", "#Ddl_Currency", function () {
            var p1 = $('#txt_Name').val().lastIndexOf(" (");
            var nm = '';
            if (p1 == -1) {
                nm = $('#txt_Name').val();
            }
            else {
                nm = $('#txt_Name').val().substring(0, p1);
            }
            if (nm == '') {
                nm = $('#txt_LegalName').val();
            }

            if ($("#Ddl_Currency").val() != '0') {
                $("#txt_Name").val(nm + " (" + $("#Ddl_Currency option:selected").attr('data-currcode') + ")");
            }
            else {
                $("#txt_Name").val(nm);
            }
        });

        $(document).on("click", "#different_address", function () {
            if ($(this).is(':checked')) {
                $('#remit_showhide').removeClass('d-none');
            }
            else {
                $('#remit_showhide').addClass('d-none');
            }
        });

        $(document).on('click', '#btn_cancel', function () {

            window.location.href = "/Home/Dashboard";
        });

    }
    //#endregion

    // #region :: Vendor Contacts for New Parent Vendor
    if (action_name === 'vendorcontactsfornewparentvendor') {
        let isDirty = false;

        $(document).on('change keyup', '#parent_vendor_contact_add input, #parent_vendor_contact_add select, #parent_vendor_contact_add textarea', function () {
            isDirty = true;
        });

        $(document).on('change keyup', '#parent_vendor_contact_permission input, #parent_vendor_contact_permission select, #parent_vendor_contact_permission textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $(document).on("change", "#ddlCountry", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#ddlState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        });

        $(document).on("click", "#checkedSystemUSer", function () {
            if ($(this).is(':checked')) {
                $('#permissionShowHide').removeClass('d-none');
            }
            else {
                $('#permissionShowHide').addClass('d-none');
            }
        });
        $(document).on("click", ".systemoption", function (e) {
            var _this = $(e.currentTarget);
            var isChecked = _this.prop('checked');
            var sysid = _this.data('sysid');

            // If sysid 18 is toggled, also toggle sysid 17 accordingly
            if (sysid == 18) {
                $('input[data-sysid="17"]').prop('checked', isChecked);
            }

            $('.headerCheckbox').each(function () {
                const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
                const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                $(this).prop("checked", allChecked);
            });

        })

        $(document).on("click", "#uncheckall", function (ev) {
            ev.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', false);
            $('input[type="checkbox"].headerCheckbox').prop('checked', false);

        });

        $(document).on("click", "#checkall", function (event) {
            event.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', true);
            $('input[type="checkbox"].headerCheckbox').prop('checked', true);
        });

        $(document).on("click", ".headerCheckbox", function (e) {


            const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');


            const isChecked = $(this).prop('checked');
            $(relatedOptions).prop("checked", isChecked);

        })

        //      $(document).on("click", ".systemoption", function (e) {
        //          var _this = $(e.currentTarget);
        //          var id = _this[0].id;
        //          let endIndex = id.length - 1;
        //          var headerid = id.substring(0, endIndex);
        //          if (_this[0].checked == false) {
        //              if ($("#" + headerid + "").is(":checked")) {
        //                  $("#" + headerid + "").prop('checked', false);
        //              }

        //          }

        //});


        $(document).on("click", "#btn_CrtVendorContact", function () {

            var ContactTitle = $("#txt_ContactTitle").val().trim();
            var IsHidden = $("#Ishidden").is(':checked') ? 1 : 0;
            var IsSystemUser = $("#checkedSystemUSer").is(':checked') ? 1 : 0;
            var FirstName = $("#txt_ContactFname").val().trim();
            var LastName = $("#txt_ContactLname").val().trim();
            var EmailAddress = $("#txt_Email").val()?.trim();
            var WebSite = $("#txt_Website").val().trim();
            var PhoneNo = $("#txt_Phone").val().trim();
            var Ext = $("#txt_Extension").val().trim();
            /*var Fax = $("#txt_Fax").val().trim();*/
            var Mobile = $("#txt_Mobile").val().trim();
            var Address = $("#txt_Add1").val().trim();
            var country = $('#ddlCountry option:selected').val();
            var state = $('#ddlState option:selected').val();
            var city = $("#Ddl_City").val().trim();
            var postalcode = $("#txt_ZipCode").val().trim();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            var priorities = "";
            //$('.project_check').each(function () {
            //    if ($(this).is(":checked")) {
            //        if (priorities == "")
            //        {
            //            priorities += $(this).attr('data-sysid');
            //        }
            //        else {
            //            priorities += "," + $(this).attr('data-sysid');
            //        }
            //    }
            //});
            if ($("#checkedSystemUSer").is(":checked")) {
                priorities = $('.project_check:checked').map(function () {
                    return $(this).attr('data-sysid');
                }).get().join(',');
            }
            else {
                priorities = null;
            }




            let fd = {
                ContactFirstname: FirstName,
                ContactLastname: LastName,
                Address1: Address,
                Country: country,
                State: state,
                City: city,
                Phone: PhoneNo,
                Extension: Ext,
                ZipCode: postalcode,
                /*Fax: Fax,*/
                ContactTitle: ContactTitle,
                Email: EmailAddress,
                Website: WebSite,
                IsHidden: IsHidden,
                IsSystemUser: IsSystemUser,
                Mobile: Mobile,
                priorities_on_list: priorities
            }

            var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;

            if (fd.ContactFirstname === "" || fd.ContactFirstname === undefined) {
                $.notify.warning('Caution', 'You must enter first name before continuing');
                errorfunc('txt_ContactFname', 'Please Enter Contact First Name');
                return;
            }
            if (fd.Email != '' && fd.Email != null && reg.test(fd.Email) == false) {
                $.notify.warning('Caution', 'You must enter an email address in the correct email format.');               
                return;
            }

            if (fd.IsSystemUser == 1) {

                if (fd.Email == '' || fd.Email == ' ' || fd.Email == null) {
                    $.notify.warning('Caution', 'You must enter an Email Address before continuing');                    
                    return;
                }
            }


            $.ajax({
                url: "/Vendors/CreateVendorContactForNew",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = data.Result;
                    if (data.IsSuccess) {
                        isDirty = false;
                        $.notify.success('Success', data.Result);
                        window.setTimeout(function () {
                            window.location.href = "/Vendors/ContactList";
                        }, 4000);

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
        });
    }
    //#endregion

    // #region :: Vendor List
    if (action_name === 'vendorlist') {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        VendorListDataTablebind();

        function VendorListDataTablebind() {

            $("#vendorList_table thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#vendorList_table thead");

            let columnFilterValues = {};
            let debounceTimer;

            function debounce(fn, delay) {
                return function (...args) {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            var table = $('#vendorList_table').DataTable({
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
                ajax: {
                    url: '/Vendors/GetAllVendorTableBind',
                    type: 'POST',
                    contentType: 'application/json',
                    data: function (d) {
                        return JSON.stringify({
                            Draw: d.draw,
                            Search: d.search.value,
                            Start: d.start,
                            Length: d.length,
                            SortColumn: d.columns[d.order[0].column].data,
                            SortDirection: d.order[0].dir,
                            ColumnFilters: columnFilterValues
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
                        data: 'parentvendorname',
                        render: function (data, type, row) {
                            return `<a href="/Vendors/EditVendor?vendorid=${row.parentvendor_id}" target="_blank" style="color:#7792a8;">${data}</a>`;
                        }
                    },
                    {
                        data: 'legalname',
                        render: function (data, type, row) {
                            return `<a href="/Vendors/EditVendor?vendorid=${row.parentvendor_id}" target="_blank" style="color:#7792a8;">${data}</a>`;
                        }
                    },
                    {
                        data: 'classifications',
                        render: function (data, type, row) {
                            return `<a href="/Vendors/EditVendor?vendorid=${row.parentvendor_id}" target="_blank" style="color:#7792a8;">${data}</a>`;
                        }
                    },
                    {
                        data: 'city',
                        render: function (data, type, row) {
                            return `<a href="/Vendors/EditVendor?vendorid=${row.parentvendor_id}" target="_blank" style="color:#7792a8;">${data}</a>`;
                        }
                    },
                    {
                        data: 'country',
                        render: function (data, type, row) {
                            return `<a href="/Vendors/EditVendor?vendorid=${row.parentvendor_id}" target="_blank" style="color:#7792a8;">${data}</a>`;
                        }
                    }
                ],
                initComplete: function () {
                    var api = this.api();
                    api.columns().eq(0).each(function (colIdx) {
                        var column = api.column(colIdx);
                        var cell = $(".filters th").eq($(column.header()).index());
                        var title = $(cell).text();

                        $(cell).html('<input type="text" id="advSr_' + title + '" class="form-control" placeholder="🔍 Search..." autocomplete="off" />');

                        $("input", cell).on("input", debounce(function () {
                            var columnName = column.dataSrc();
                            var value = this.value;

                            // Update only if value changed
                            if (columnFilterValues[columnName] !== value) {
                                columnFilterValues[columnName] = value;
                                //console.log(columnFilterValues);
                                table.draw();
                            }
                        }, 300));
                    });
                },
                drawCallback: function () {
                    $('html, body').animate({ scrollTop: 0 }, 300);
                }
            });

            // Listen to page length change event
            $('#vendorList_table').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

    }
    //#endregion

    // #region :: Edit Vendor
    if (action_name === 'editvendor') {
        let isDirty = false;

        $(document).on('change keyup', '#edit_vendor_form input, #edit_vendor_form select, #edit_vendor_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        $(".multislct").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
        });
        partialVendorContact();
        var date = new Date();
        var currentMonth = date.getMonth() + 1;
        var currentDate = date.getDate();
        var currentYear = date.getFullYear();

        currentMonth = currentMonth < 9 ? '0' + currentMonth : currentMonth;
        currentDate = currentDate < 9 ? '0' + currentDate : currentDate;



        $('#toDateYTD').val(currentYear + '.' + currentMonth + '.' + currentDate);

        var date = new Date(currentYear, 1, 1);
        currentMonth = date.getMonth();
        currentDate = date.getDate();
        currentYear = date.getFullYear();

        currentMonth = currentMonth < 9 ? '0' + currentMonth : currentMonth;
        currentDate = currentDate < 9 ? '0' + currentDate : currentDate;

        $('#fromDateYTD').val(currentYear + '.' + currentMonth + '.' + currentDate);


        $('#fromDateYTD').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',
        });

        $('#toDateYTD').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd',

        });

        function partialVendorContact() {
            var vendorId = $('#parentVendorid').val();
            $.ajax({
                url: _BaseURL + "/Vendors/VendorContactListing?vendorId=" + vendorId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },


                success: function (data) {
                    if (data != null) {

                        $('#partialEditVendorContact').html('');
                        $('#partialEditVendorContact').html(data);

                        VendorContactListDataTable();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }


                }
            })
        }

        $(document).on("change", "#ddlCountry", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#ddlState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong!');
                    }

                }
            });

        });


        $(document).on("change", "#upRDdl_Country", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#upRDdl_State');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        });

                    }
                    else {;
                        $.notify.error('Error', 'Something went wrong!');
                    }

                }
            });

        });

        function commonNamebind() {
            if ($("#Ddl_Currency").val() != '0') {
                $("#txt_Name").val($("#txt_LegalName").val() + " (" + $("#Ddl_Currency option:selected").attr('data-currencycode') + ")");
            }
            else {
                $("#txt_Name").val($("#txt_LegalName").val());
            }
        }
        function VendorContactListDataTable() {
            if ($.fn.DataTable.isDataTable("#edit_vendorcontact_info_table")) {
                $('#edit_vendorcontact_info_table').DataTable().clear().destroy();
            }

            $("#edit_vendorcontact_info_table thead tr")
                .clone(true)

                .addClass("filter")
                .appendTo("#edit_vendorcontact_info_table thead");

            var table = $("#edit_vendorcontact_info_table").DataTable({

                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                orderCellsTop: true,
                scrollX: true,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    {
                        targets: 10, // Index of the 'Active' column (starting from 0)
                        visible: false, // Hide the column from both <th> and <td>
                        searchable: true // Keep it searchable
                    },
                    { width: "0px", targets: 10 },
                ],
                initComplete: function () {
                    var api = this.api();
                    api.columns(1).nodes().flatten().to$().each(function () {
                        $(this).removeClass("dt-type-numeric dt-center dt-head-nowrap");
                    });
                    api.columns(2).nodes().flatten().to$().each(function () {
                        $(this).removeClass("dt-center");
                    });

                    // For each column
                    api.columns()
                        .eq(0)
                        .each(function (colIdx) {
                            // Set the header cell to contain the input element
                            var cell = $(".filter th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();

                            if (colIdx === 0) {


                                $(cell).html(
                                    '<button type="button" class="porde_list_reset_btn" id="resetVendorContactlisting">Reset</button>'
                                );
                            }
                            else if (colIdx === 1) {



                                var select = $(
                                    '<select class="form-select" id="filterbtn"><option value="All">All</option><option value="true">Active</option><option value="false">Deactive</option></select>'
                                ).appendTo($(cell))
                                    .on("change", function () {
                                        var val = $(this).val(); // Get the selected value from dropdown

                                        if (val === "All") {
                                            // Clear search for column 8 when "All" is selected
                                            api.column(10).search("").draw();
                                        } else {
                                            // Filter for "true" or "false" (Active or Deactive)
                                            var regexVal = $.fn.dataTable.util.escapeRegex(val);
                                            api.column(10).search("^" + regexVal + "$", true, false).draw();
                                        }
                                    });

                                //.on("change", function () {
                                //var val = $(this).val();
                                //api.column(colIdx).search(val !== "All" ? val : "", false, false).draw();
                                /*});*/

                                select.removeClass('dt-type-numeric dt-center dt-head-nowrap');
                                //.on("change", function () {
                                //    var val = $(this).val();
                                //    var demo = '<i class="' + val + '"></i>';

                                //    api
                                //        .column(colIdx)
                                //        .search(val ? '<i class="' + val + '"></i>' : '', true, false)
                                //        .draw();
                                //});

                            }
                            else if (colIdx === 2) {
                                var select = $('<select class="form-select" id="hiddenBtn"><option value="ALL">All</option><option value="1">YES</option><option value="0" selected>NO</option></select>'
                                ).appendTo($(cell))
                                    .on("change", function () {
                                        var val = $.fn.dataTable.util.escapeRegex($(this).val());

                                        api
                                            .column(colIdx)
                                            .search(val == 1 ? "Y" : "N")
                                            .draw();
                                        //var val = $(this).val();
                                        //api.column(colIdx).search(val === "1" ? "Y" : "N", false, false).draw();

                                    });


                            }
                            //else if (colIdx === 3) {
                            //	var select = $('<input type="text" class="form-control" placeholder="' +
                            //		title +
                            //		'" />'
                            //	).appendTo($(cell))
                            //		.on("keyup", function () {
                            //			var val = $(this).val();

                            //			api.column(colIdx).search(val).draw();
                            //		});


                            //}
                            //else if (colIdx === 5) {
                            //	var select = $(

                            //		'<input type="text" class="form-control" placeholder="E-Mail" />'

                            //	).appendTo($(cell))
                            //		.on("keyup", function () {
                            //			var val = $(this).val();

                            //			api.column(colIdx).search(val).draw();
                            //		});
                            //}

                            //else if (colIdx === 6) {
                            //	var select = $(
                            //		/*'<select class="form-select"><option value="">All</option> <option value="Administrator">Administrator</option><option value="Buyer">Buyer</option><option value="Client/Operator">Client/Operator</option> <option value="Consultant">Consultant</option><option value="Accountant">Accountant</option></select>'*/
                            //		'<input type="text" class="form-control" placeholder="City" />'

                            //	).appendTo($(cell))
                            //		.on("keyup", function () {
                            //			var val = $(this).val();

                            //			api.column(colIdx).search(val).draw();
                            //		});
                            //}
                            //else if (colIdx === 7) {
                            //	var select = $(

                            //		'<input type="text" class="form-control" placeholder="Phone" />'
                            //	).appendTo($(cell)).on("keyup", function () {
                            //		var val = $(this).val();

                            //		api.column(colIdx).search(val).draw();
                            //	});
                            //}
                            else if (colIdx == 10) {
                                var select = $(
                                    '<div style="display:none;"></div>'
                                )
                                    .appendTo($(cell))
                            }
                            else {
                                // For other columns, add input elements
                                $(cell).html
                                    (
                                        '<input type="text" class="form-control" placeholder="' +
                                        title +
                                        '" />'
                                    );
                                //.appendTo(cell)
                                //.on("keyup", function () {
                                //			var val = $(this).val();

                                //			api.column(colIdx).search(val).draw();
                                //   });
                            }

                            // On every keypress in this input
                            $(
                                "input",
                                $(".filter th").eq($(api.column(colIdx).header()).index())
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
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#edit_vendorcontact_info_table tbody').html(
                            '<tr><td colspan="10" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });


            $('#edit_vendorcontact_info_table').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });

        }


        commonNamebind();
        $("#Ddl_Currency").on("change", function () {

            commonNamebind();

        });

        $(document).on("click", "#remit_chk", function (e) {
            var _this = $(e.currentTarget);
            r_chk(_this)
        })
        function r_chk(obj) {
            if ($(obj).is(':checked')) {
                $('#r_div').show();
            }
            else {
                $('#r_div').hide();
            }
        }


        $(document).on("click", "#btn_UpdtPrntVndr", function () {
            var vendorId = $('#parentVendorid').val().trim();
            var IsBridgeSupport = $("#isBridgeSupport").is(':checked') ? true : false;
            var txt_Terms = $('#invTerm option:selected').val();
            var Name = $('#txt_Name').val().trim();
            var LegalName = $('#txt_LegalName').val().trim();
            var ShortName = '';
            var Address = $('#txt_Addr').val().trim();
            var country = $('#ddlCountry option:selected').val();
            var state = $('#ddlState option:selected').val();
            var City = $('#txt_City').val().trim();
            var ZipCode = $('#txt_ZipCode').val().trim();
            var curr = $('#Ddl_Currency option:selected').val();
            var clfs = $('#Ddl_Clftion').val();
            if (clfs != null && clfs != 'null' && clfs != undefined && clfs != 'undefined') {
                clfs = clfs.toString().replace(/,/g, ",");
            }
            else {
                clfs = '';
            }
            var Isactive = $('#txt_Actv').val();


            var VndrNotes = $('#txt_VndrNotes').text().trim();
            var Minority = $("#minor_owner").is(':checked') ? "1" : "0";
            var Woman = $("#women_owner").is(':checked') ? "1" : "0";

            //var RStatus = $('#remit_chk').is(':checked') ? "1" : "0";
            var RStatus = $('#remit_chk').prop('checked') ? "1" : "0";
            var RAddress = $('#Rtxt_Addr').val().trim();
            var RCity = $('#Rtxt_City').val().trim();
            var Rcountry = $('#RDdl_Country option:selected').val();
            var RState = $('#RDdl_State option:selected').val();
            var RZipCode = $('#Rtxt_ZipCode').val().trim();

            RAddress = RStatus == "1" ? RAddress : "";
            RCity = RStatus == "1" ? RCity : "";
            RZipCode = RStatus == "1" ? RZipCode : "";
            RState = RStatus == "1" ? RState : "0";
            Rcountry = RStatus == "1" ? Rcountry : "0";
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            let fd = {
                ParentVendor_ID: vendorId,
                ParentVendorName: Name,
                LegalName: LegalName,
                CurrCode: parseInt(curr),
                Address1: Address,
                Country: parseInt(country),
                State: parseInt(state),
                City: City,
                ZipCode: ZipCode,
                Note: VndrNotes,
                Terms_ID: parseInt(txt_Terms),
                R_Country: Rcountry,
                R_State: RState,
                R_City: RCity,
                R_ZipCode: RZipCode,
                R_Address: RAddress,
                Minority_own_business: Minority,
                Woman_own_business: Woman,
                R_Flag: RStatus == "1" ? true : false,
                BridgeSupporter: IsBridgeSupport,
                ClassificationList: clfs,
                IsActive: Isactive == "True" ? true : false
            }

            var isValid = formValidateForUpdateParentVendor(fd);

            if (isValid) {
                $.ajax({
                    url: "/Vendors/UpdateParentVendor",
                    type: "POST",
                    data: fd,
                    dataType: "JSON",
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {

                        $(".loader").css("display", "none");
                        var Title = data.Result;
                        if (data.IsSuccess) {
                            isDirty = false;
                            $.notify.success('Success', 'Vendor Updated!');
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }
                        else {
                            if (data.ErrorMessages == 'INVALID^CURRERR') {
                                $.notify.error('Error', 'Vendor currency cannot be changed after invoices have been entered !!');
                            }
                            else {
                                $.notify.error('Error', 'Problem to update Vendor!');
                            }

                        }


                    }
                });

            }



        });


        function formValidateForUpdateParentVendor(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.LegalName === "" || fd.LegalName === undefined) {
                IsValid = false;
                Title = "You must enter Legal Name before continue";
                $.notify.warning('Caution', Title);
                return;
            }
            if (fd.ParentVendorName === "" || fd.ParentVendorName === undefined) {
                IsValid = false;
                Title = "You must enter a Vendor Name before continue";
                $.notify.warning('Caution', Title);
                return;
            }
            if (fd.CurrCode === 0 || fd.CurrCode === undefined) {
                IsValid = false;
                Title = "You must select Currency before continue";
                $.notify.warning('Caution', Title);
                return;
            }

            return IsValid;
        }

        $(document).on("click", ".vendorDetails", function () {

            var id = $(this).data('id');
            $.redirect(_BaseURL + "/Vendors/EditVendorContact?vendorId=" + id);


        });
        $(document).on("click", "#mergeVendor", function () {
            var parentVendorId = $('#parentVendorid').val();


            $.redirect(_BaseURL + "/Vendors/MergeVendors?ParentVendorId=" + parentVendorId);

            $('#notselected').removeClass('d-none').addClass('d-flex');
        });

        $(document).on("click", ".activeVendorContact", function () {

            var vendorId = $(this).data('vid');
            var active = $(this).data('active');
            $.ajax({
                url: _BaseURL + "/Vendors/ActiveInActiveVendorContact?vendorId=" + vendorId + "&active=" + active,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var success = data.IsSuccess;
                    var Title = "";
                    if (data.IsSuccess === true) {
                        window.location.reload();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })

        });
        /*vendor contact active in active dropdown*/
        //$(document).on("change", "#filterbtn", function () {

        //	var active = $(this).prop('selected', true).val();
        //	var vendorId = $('#parentVendorid').val();
        //	$.ajax({
        //		url: _BaseURL + "/Vendors/VendorContactListing?vendorId=" + vendorId + "&active=" + active,
        //		type: "GET",
        //		beforeSend: function () {
        //			$(".loader").css("display", "flex");
        //		},
        //		success: function (data) {
        //			$(".loader").css("display", "none");
        //			$('#partialEditVendorContact').html('');
        //			$('#partialEditVendorContact').html(data);

        //			VendorContactListDataTable();
        //			$('#filterbtn').val(active);
        //		},
        //		error: function (error) {
        //			console.error(error);
        //		}
        //	})


        //});

        $(document).on("click", '.deleteVendorContact', function () {

            var vendorId = $(this).data('id');
            var fd = {
                vendorId: vendorId
            }

            $.confirm({
                title: 'Delete Vendor Contact',
                message: 'Are you sure you want to delete?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({

                        url: _BaseURL + "/Vendors/DeleteVendorContact",
                        type: "POST",
                        data: fd,
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            $(".loader").css("display", "none");
                            var success = data.IsSuccess;
                            var Title = "";

                            if (data.IsSuccess === true) {
                                $.notify.success('Success', data.Result);
                                partialVendorContact();

                            }
                            else {

                                Title = data.ErrorMessages.join(",");
                                //if (Title === "FAILED") {
                                //		Title = "You cannot delete this Contact before adding one";
                                //		notify(success, Title, false);
                                //		return;
                                //}
                                //if (Title == 'FAILED 2') {
                                //		Title = "You cannot delete this Contact as the Contact has POs";
                                //		notify(success, Title, false);
                                //		return;
                                //}
                                //else {
                                //		notify(success, Title, false);
                                //		return;
                                //}
                                if (Title === "FAILED") {
                                    Title = "You cannot delete this Contact before adding one";
                                } else if (Title === "FAILED 2") {
                                    Title = "You cannot delete this Contact as the Contact has POs";
                                }
                                $.notify.error('Error', Title);

                            }
                        }
                    })
                },
                onCancel: function () {                    
                }
            });

        });

        $(document).on("click", "#resetVendorContactlisting", function () {

            /*window.location.reload();*/
            partialVendorContact();
        });

        $(document).on("click", "#YTDModal", function () {
            var vendorId = $('#parentVendorid').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $("#fromDateYTD").datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $("#toDateYTD").datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Vendors/ProjectListinEditVendor?vendorId=" + vendorId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    $('#ytdlist').html('');
                    $('#ytdlist').html(data);
                    $('#ytdtitle').text('');

                    var parentVendorName = $('#parentvendorname').val();
                    $('#ytdtitle').text(`YTD Breakdown for ${parentVendorName}`);

                    $('#ytd_breakdown').modal('show');

                    setTimeout(function () {
                        YTDDataTable();
                    }, 200);
                }
            })


        });

        $(document).on('click', '.redirecttopolist', function () {
            var projectId = $(this).data('id');
            var vendorId = $('#parentVendorid').val();
            var status = 'Singal';

            const url = "/PurchaseOrder/POList?id=" + projectId + "&VendorID=" + vendorId + "&Status=" + status;
            window.open(url, "_blank");
        });

        function YTDDataTable() {
            var totalAmount = $('#totalAmount').val();
            var currency = $('#curr').val();

            $("#ytdtbl thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#ytdtbl thead");

            var table = $("#ytdtbl").DataTable({

                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 50,
                orderCellsTop: true,
                scrollX: true,
                "autoWidth": true,
                "responsive": true,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [0, 1, 2] },
                ],



                initComplete: function () {
                    var api = this.api();

                    if (totalAmount != 0) {
                        api.columns(1).nodes().flatten().to$().each(function () {
                            $(this).removeClass("dt-type-numeric dt-center dt-head-nowrap");
                        });
                        api.columns(0).nodes().flatten().to$().each(function () {
                            $(this).removeClass("dt-type-numeric dt-center dt-head-nowrap");
                        });

                        api.columns().eq(0).each(function (colIdx) {

                            var cell = $(".filters th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            if (colIdx === 0 || colIdx === 1) {
                                $(cell).html(`<input type="text" class="form-control" placeholder="${title}" />`);
                            } else if (colIdx === 2) {
                                $(cell).html(`<span id="tAmt">${formatNumber(totalAmount)} ${currency}</span>`);
                            }

                            $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                                .off("keyup")
                                .on("keyup", function () {
                                    $(this).attr("title", $(this).val());
                                    var regexr = "({search})";

                                    api.column(colIdx)
                                        .search(
                                            this.value !== "" ? regexr.replace("{search}", "(((" + this.value + ")))") : "",
                                            this.value !== "",
                                            this.value === ""
                                        )
                                        .draw();
                                });
                        });
                        $('.dt-search').hide();
                    }
                    else {
                        $('.dt-search').hide();
                        $(".filters th").each(function (index) {

                            $(this).html('');

                        });
                    }

                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#ytdtbl tbody').html(
                            '<tr><td colspan="3" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });


        }

        $(document).on('change', '#fromDateYTD', function () {
            var vendorId = $('#parentVendorid').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $("#toDateYTD").datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Vendors/ProjectListinEditVendor?vendorId=" + vendorId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#ytd_breakdown').modal('show');
                        $('#ytdlist').html('');
                        $('#ytdlist').html(data);
                        $(".loader").css("display", "none");
                        setTimeout(function () {
                            YTDDataTable();
                        }, 200);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            })
        });
        $(document).on('change', '#toDateYTD', function () {
            var vendorId = $('#parentVendorid').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $("#fromDateYTD").datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Vendors/ProjectListinEditVendor?vendorId=" + vendorId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#ytd_breakdown').modal('show');
                        $('#ytdlist').html('');
                        $('#ytdlist').html(data);
                        $(".loader").css("display", "none");
                        setTimeout(function () {
                            YTDDataTable();
                        }, 200);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })


        });

        $(document).on("change", "#RDdl_Country", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#RDdl_State');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state}</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });

        });

        $(document).on('keyup', '.pincode', function () {
            var value = $(this).val()?.toLocaleUpperCase();
            $(this).val(value);
        });
        function formatNumber(number) {
            number = parseFloat(number).toFixed(2);
            //var number = number.toFixed(2) + '';
            var x = number.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
    }
    //#endregion

    // #region :: Vendor Contact List
    if (action_name === 'contactlist') {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        GetContactList();
        function GetContactList() {
            debugger;
            $("#contact_list thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#contact_list thead");

            var IsActive = null;
            var IsHidden = 0;
            let columnFilterValues = {};
            let debounceTimer;

            function debounce(fn, delay) {
                return function (...args) {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            var table = $('#contact_list').DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                orderCellsTop: true,
                //scrollX: true,
                processing: false,
                serverSide: true,
                destroy: true,
                lengthMenu: [10, 25, 50, 100],
                order: [[3, 'asc']],
                autoWidth: false,
                columnDefs: [
                    { className: "dt-head-left", targets: "_all" }, 
                    { orderable: false, targets: [0, 1, 2] },
                    { width: "6%", targets: 0 },
                    { width: "6%", targets: 1 },
                    { width: "6%", targets: 2 },
                    { width: "14%", targets: 3 },   // Vendor Name
                    { width: "14%", targets: 4 },   // Classifications
                    { width: "14%", targets: 5 },   // Contact
                    { width: "10%", targets: 6 },   // Title
                    { width: "10%", targets: 7 },   // City
                    { width: "10%", targets: 8 },   // Phone
                    { width: "10%", targets: 9 },   // Email
                ],
                ajax: {
                    url: '/Vendors/GetPartialContactList',
                    type: 'POST',
                    contentType: 'application/json',
                    data: function (d) {
                        return JSON.stringify({
                            Draw: d.draw,
                            Search: d.search.value,
                            Start: d.start,
                            Length: d.length,
                            SortColumn: d.columns[d.order[0].column].data,
                            SortDirection: d.order[0].dir,
                            IsActive: IsActive,
                            IsHidden: IsHidden,
                            ColumnFilters: columnFilterValues
                        });
                        //console.log(d.draw, d.search.value, d.start, d.length, d.columns[d.order[0].column].data, d.order[0].dir, IsActive, IsHidden, columnFilterValues);
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
                        data: "action",
                        title: "Action",
                        orderable: false,
                        render: function (data, type, row) {
                            let sendIcon = row.isSystemUser === 1 ?
                                `<i title="Send LogIn info" style="cursor:pointer;color:#7EA6C7;" data-email="${row.email}" class="fa fa-share mrg5R sendmailforVendor" data-bs-toggle="modal"></i>`
                                : '';
                            let editIcon = `<i class="fa fa-pencil-square-o editvendorContactList" style="cursor:pointer;" data-id="${row.parentVendor_ID}" id="parentvendor_${row.parentVendor_ID}"></i>`;
                            return `<div class="text-center">${sendIcon} ${editIcon}</div>`;
                        }
                    },
                    {
                        data: "active",
                        title: "Active",
                        orderable: false,
                        render: function (data, type, row) {
                            if (row.isSystemUser === 1) {
                                const iconClass = row.isActive === 1 ? "fa-check-circle" : "fa-times-circle";
                                return `<i class="fa ${iconClass} acinAc" style="cursor:pointer;" data-vendorcontact="${row.vendor_ID}"></i>`;
                            }
                            return '';
                        }
                    },
                    {
                        data: "isHidden",
                        title: "Hidden",
                        orderable: false,
                        render: function (data, type, row) {
                            return data ? 'Y' : 'N';
                        }
                    },
                    {
                        data: "parentVendorName",
                        title: "Vendor Name",
                        render: function (data) {
                            return `<p class="text-uppercase1" title="${data}">${data}</p>`;
                        }
                    },
                    {
                        data: "classifications",
                        title: "Classifications",
                        render: function (data) {
                            return `<p class="text-uppercase1" title="${data}">${data}</p>`;
                        }
                    },
                    {
                        data: "vendorName",
                        title: "Contact",
                        render: function (data, type, row) {
                            return `<a target="_blank" style="color:#7792a8;" href="/Vendors/EditVendorContact?vendorId=${row.vendor_ID}">${data ? data : ''}</a>`;
                        }
                    },
                    { data: "contactTitle", title: "Title" },
                    { data: "city", title: "City" },
                    {
                        data: "phone",
                        title: "Phone",
                        render: function (data) {
                            return `<a style="color:#7792a8;" href="telto:${data}">${data}</a>`;
                        }
                    },
                    {
                        data: "email",
                        title: "Email",
                        render: function (data) {
                            return `<a style="color:#7792a8;" href="mailto:${data}">${data}</a>`;
                        }
                    }
                ],
                initComplete: function () {
                    var api = this.api();
                    api.columns().eq(0).each(function (colIdx) {
                        var column = api.column(colIdx);
                        var cell = $(".filters th").eq($(column.header()).index());
                        var title = $(cell).text();

                        if (colIdx === 0) {
                            // Reset Button
                            $(cell).html('<button type="button" class="porde_list_reset_btn" id="resetVendorContact">Reset</button>');

                            // Reset logic
                            $('#resetVendorContact').on('click', function () {
                                $('.filters input').val('');
                                $('#filterbtn').val('');
                                $('#hiddenBtn').val('0');
                                columnFilterValues = {};
                                IsActive = null;
                                IsHidden = 0;
                                table.search('').draw();
                            });
                        }
                        else if (colIdx === 1) {
                            // Active Status Dropdown
                            $(cell).html(`
                                <select class="form-select" id="filterbtn">
                                    <option value="" selected>All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                    <option value="3">Inactive System User</option>
                                </select>
                            `);
                            $('#filterbtn').on('change', function () {
                                const isActiveVal = this.value;
                                IsActive = isActiveVal === "" ? null : parseInt(isActiveVal);

                                const hiddenVal = $("#hiddenBtn option:selected").val();
                                IsHidden = hiddenVal === "" ? null : parseInt(hiddenVal);
                                table.draw();
                            });
                        }
                        else if (colIdx === 2) {
                            // Hidden Status Dropdown
                            $(cell).html(`
                                <select class="form-select" id="hiddenBtn">
                                    <option value="">All</option>
                                    <option value="1">YES</option>
                                    <option value="0" selected>NO</option>
                                </select>
                            `);
                            $('#hiddenBtn').on('change', function () {
                                const hiddenVal = this.value;
                                IsHidden = hiddenVal === "" ? null : parseInt(hiddenVal);

                                const activeVal = $("#filterbtn option:selected").val();
                                IsActive = activeVal === "" ? null : parseInt(activeVal);
                                table.draw();
                            });
                        }
                        else {
                            // Default text input
                            $(cell).html('<input type="text" id="advSr_' + title + '" class="form-control search" placeholder="🔍 Search..." autocomplete="off" />');

                            $("input", cell).on("input", debounce(function () {
                                var columnName = column.dataSrc();
                                var value = this.value;
                                if (columnFilterValues[columnName] !== value) {
                                    columnFilterValues[columnName] = value;
                                    //console.log(columnFilterValues);
                                    table.draw();
                                }
                            }, 300));
                        }
                    });

                },
                drawCallback: function () {
                    $('html, body').animate({ scrollTop: 0 }, 300);
                }
            });

            // Listen to page length change event
            $('#contact_list').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        //function ContactListDataTable() {


        //    $("#contact_list thead tr")
        //        .clone(true)

        //        .addClass("filter")
        //        .appendTo("#contact_list thead");

        //    var table = $("#contact_list").DataTable({

        //        "language": {
        //            "lengthMenu": "_MENU_ Entries Per Page"
        //        },
        //        "pageLength": 50,
        //        lengthMenu: [10, 25, 50, 100],
        //        orderCellsTop: true,
        //        "processing": true,
        //        scrollX: true,
        //        columnDefs: [
        //            { className: "dt-head-nowrap", targets: "_all" },
        //            { className: "dt-center", targets: [1, 2] },
        //            {
        //                targets: 10,
        //                visible: false,
        //                searchable: true
        //            },
        //            {
        //                targets: 11,
        //                visible: false,
        //                searchable: true
        //            }


        //        ],
        //        initComplete: function () {
        //            var api = this.api();

        //            // For each column
        //            api.columns()
        //                .eq(0)
        //                .each(function (colIdx) {
        //                    // Set the header cell to contain the input element
        //                    var cell = $(".filter th").eq(
        //                        $(api.column(colIdx).header()).index()
        //                    );
        //                    var title = $(cell).text();
        //                    if (colIdx === 1) {
        //                        cell.removeClass("dt-type-numeric").addClass("dt-center");
        //                    }


        //                    cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();

        //                    if (colIdx === 0) {
        //                        $(cell).html(
        //                            '<button type="button" class="porde_list_reset_btn" id="resetVendorContact">Reset</button>'
        //                        );
        //                    }
        //                    else if (colIdx === 1) {

        //                        cell.find('.dt-type-numeric').remove();


        //                        var select = $(
        //                            '<select class="form-select" id="filterbtn"><option value="All">All</option><option value="true">Active</option><option value="false">Inactive</option><option value="3">Inactive System User</option></select>'
        //                        ).appendTo($(cell))
        //                            //.on("change", function () {
        //                            //	var selectedValue = $(this).val();

        //                            //	$("#contact_list tbody tr").each(function () {
        //                            //		var icon = $(this).find("i.acinAc"); // This is for active/inactive icons
        //                            //		var systemUserIcon = $(this).find("i.fa-share"); // This is for IsSystemUser==1 (fa-share icon)

        //                            //		if (selectedValue === "true") {
        //                            //			if (icon.hasClass("fa-check-circle")) {
        //                            //				$(this).show(); // Show rows with fa-check-circle (active users)
        //                            //			} else {
        //                            //				$(this).hide(); // Hide rows with fa-times-circle
        //                            //			}
        //                            //		} else if (selectedValue === "false") {
        //                            //			if (icon.hasClass("fa-times-circle")) {
        //                            //				$(this).show(); // Show rows with fa-times-circle (deactive users)
        //                            //			} else {
        //                            //				$(this).hide(); // Hide rows with fa-check-circle
        //                            //			}
        //                            //		} else if (selectedValue === "3") {
        //                            //			// Show rows with the fa-share icon (system users)
        //                            //			if (systemUserIcon.length > 0) {
        //                            //				$(this).show(); // Show rows with fa-share
        //                            //			} else {
        //                            //				$(this).hide(); // Hide other rows
        //                            //			}
        //                            //		} else {
        //                            //			// Handle "All" case or reset filter
        //                            //			$(this).show(); // Show all rows
        //                            //		}
        //                            //	});
        //                            //});
        //                            .on("change", function () {
        //                                var val = $(this).val();

        //                                if (val === "All") {

        //                                    api.column(10).search("").draw();
        //                                    api.column(11).search("").draw();

        //                                }
        //                                else if (val == "3") {
        //                                    api.column(10).search("false").draw();
        //                                    api.column(11).search("^" + 1 + "$", true, false).draw();
        //                                }
        //                                else {
        //                                    // Filter for "true" or "false" (Active or Deactive)
        //                                    api.column(11).search("").draw();
        //                                    var regexVal = $.fn.dataTable.util.escapeRegex(val);
        //                                    api.column(10).search("^" + regexVal + "$", true, false).draw();
        //                                }
        //                            });


        //                    }
        //                    else if (colIdx === 2) {
        //                        var select = $('<select class="form-select search" id="hiddenBtn"><option value="ALL">All</option><option value="1">YES</option><option value="0" selected>NO</option></select>'
        //                        ).appendTo($(cell))
        //                            .on("change", function () {
        //                                //var val = $.fn.dataTable.util.escapeRegex($(this).val());

        //                                //api
        //                                //    .column(colIdx)
        //                                //    .search(val == 1 ? "Y" : "N")
        //                                //    .draw();
        //                                var val = $(this).val();
        //                                if (val === "ALL") {
        //                                    // Clear the search for this column
        //                                    api.column(colIdx).search("").draw();
        //                                } else {
        //                                    // Search for "YES" or "NO"
        //                                    api.column(colIdx).search(val === "1" ? "Y" : "N", false, false).draw();
        //                                }
        //                                //api.column(colIdx).search(val === "1" ? "Y" : "N", false, false).draw();

        //                            });


        //                    }
        //                    else if (colIdx === 5) {
        //                        var select = $(

        //                            '<input type="text" class="form-control search" placeholder="Contact" />'

        //                        ).appendTo($(cell))
        //                            .on("keyup", function () {
        //                                //var val = $.fn.dataTable.util.escapeRegex($(this).val());

        //                                //api
        //                                //    .column(colIdx)
        //                                //    .search(val ? val + "$" + "" : "", true, false)
        //                                //    .draw();

        //                                //var val = $.fn.dataTable.util.escapeRegex($(this).val());
        //                                var val = $(this).val();
        //                                api.column(colIdx).search(val, false, false).draw();
        //                            });
        //                    }

        //                    else if (colIdx === 6) {
        //                        var select = $(
        //                            /*'<select class="form-select"><option value="">All</option> <option value="Administrator">Administrator</option><option value="Buyer">Buyer</option><option value="Client/Operator">Client/Operator</option> <option value="Consultant">Consultant</option><option value="Accountant">Accountant</option></select>'*/
        //                            '<input type="text" class="form-control search" placeholder="Title" />'

        //                        ).appendTo($(cell))
        //                            .on("keyup", function () {
        //                                // var val = $.fn.dataTable.util.escapeRegex($(this).val());
        //                                var val = $(this).val();
        //                                api
        //                                    .column(colIdx)
        //                                    .search(val, false, false)
        //                                    .draw();
        //                            });
        //                    }
        //                    else if (colIdx === 7) {
        //                        var select = $(

        //                            '<input type="text" class="form-control search" placeholder="City" />'
        //                        ).appendTo($(cell)).on("keyup", function () {
        //                            //var val = $.fn.dataTable.util.escapeRegex($(this).val());
        //                            var val = $(this).val();
        //                            //                api.column(colIdx)
        //                            //                    .search(val ? "^" + val + "$" : "", true, false)
        //                            //.draw();
        //                            api.column(colIdx)
        //                                .search(val, false, false) // disable regex and smart search
        //                                .draw();
        //                        });
        //                    }
        //                    else if (colIdx == 10) {
        //                        var select = $(
        //                            '<div style="display:none;"></div>'
        //                        )
        //                            .appendTo($(cell))
        //                    }
        //                    else if (colIdx == 11) {
        //                        var select = $(
        //                            '<div style="display:none;"></div>'
        //                        )
        //                            .appendTo($(cell))
        //                    }
        //                    else {
        //                        // For other columns, add input elements
        //                        $(cell).html
        //                            (
        //                                '<input type="text" class="form-control search" placeholder="' +
        //                                title +
        //                                '" />'
        //                            );
        //                    }


        //                    //$(
        //                    //	"input",
        //                    //	$(".filter th").eq($(api.column(colIdx).header()).index())
        //                    //)
        //                    //	.off("keyup")
        //                    //	.on("keyup", function () {
        //                    //		// Get the search value
        //                    //		$(this).attr("title", $(this).val());
        //                    //		var regexr = "({search})";

        //                    //		// Search the column for that value
        //                    //		api
        //                    //			.column(colIdx)
        //                    //			.search(
        //                    //				this.value !== ""
        //                    //					? regexr.replace("{search}", "(((" + this.value + ")))")
        //                    //					: "",
        //                    //				this.value !== "",
        //                    //				this.value === ""
        //                    //			)
        //                    //			.draw();
        //                    //	});
        //                    $("input", cell).on("keyup", function () {
        //                        //var val = $.fn.dataTable.util.escapeRegex($(this).val());
        //                        var val = $(this).val();

        //                        //api.column(colIdx).search(val ? "^" + val + "$" : "", true, false).draw();
        //                        api.column(colIdx).search(val ? val : "", true, false).draw();
        //                    });
        //                });
        //        },
        //    });





        //}


        //$(document).on("click", "#resetVendorContact", function () {
        //    var table = $('#contact_list').DataTable();

        //    $('#filterbtn').val('All').trigger('change');
        //    $('#hiddenBtn').val('0').trigger('change');

        //    $(this)
        //        .closest('tr')
        //        .find('input.form-control.search')
        //        .val('');

        //    table
        //        .search('')
        //        .columns().search('')
        //        .page.len(50)
        //        .draw();
        //});

        $(document).on("click", ".editvendorContactList", function () {

            var id = $(this).data('id');
            $.redirect(_BaseURL + "/Vendors/EditVendor?vendorid=" + id);
        });

        $(document).on("click", ".sendmailforVendor", function () {

            var email = $(this).data('email');

            $('#pomailtos').val(email);
            var mode = "NEWUSERMAIL";
            $.ajax({
                url: '/User/getMailContent',
                type: 'GET',
                dataType: 'json',
                data: { mode: mode },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('#sendmailvendortemplate').modal('show');
                    var IsSuccess = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;
                    if (data.IsSuccess) {
                        var subject = data.Result.split('!##!')[1];
                        data = unescape(data.Result.split('!##!')[0]);
                        $('#newusersubject').val(subject);

                        if (tinymce.get('newusermail')) {
                            tinymce.get('newusermail').remove();
                        }
                        $('#newusermail').val('');
                        $('#newusermail').val(data);

                        $('#ddl_mail').val(0);
                        $('.mce-widget mce-btn mce-menubtn mce-first mce-last mce-active').addClass('pop-up');
                        tinymce.init({
                            selector: "#newusermail",
                            plugins: "textcolor,fullscreen,image",
                            toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                            , menubar: false
                            , height: "250px"
                            , image_list: [
                                { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                            ]

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            })

            $('.close').click(function () {
                $('#sendmailvendortemplate').modal('hide');

            });

        });

        $(document).on("click", "#sendFinalMail", function () {
            //var email = $('.sendmailforVendor').data('email');
            var email = $('#pomailtos').val().trim();
            var subject = $('#newusersubject').val();

            var body = tinyMCE.activeEditor.getContent();

            let fd = {
                Email: email,
                Subject: subject,
                mailBody: escape(body),

            }

            $.ajax({
                url: _BaseURL + "/Vendors/sendFinalMailCredentials",
                type: 'POST',
                dataType: 'json',
                data: fd,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;
                    if (data.IsSuccess) {
                        $('#sendmailvendortemplate').modal('hide');
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);

                        window.setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })

        });

        $(document).on("click", ".acinAc", function () {
            var vendorId = $(this).data('vendorcontact');
            var mode = $(this).hasClass('fa-check-circle') ? "DEACTIVATECONTACT" : "ACTIVATECONTACT";
            $.ajax({

                url: _BaseURL + "/Vendors/ActiveInActiveonClick?vendorId=" + vendorId + "&mode=" + mode,
                type: "POST",
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        GetContactList();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })


        });

        $(document).on('change', '#ddl_mail', function () {
            var vl = $(this).val();
            var editor = tinymce.activeEditor;
            var content = editor.getContent();

            if (vl == '1') {
                var url = "THESERVERLINKBASEURLLOGIN";
                tinymce.activeEditor.execCommand('mceInsertContent', true, "<a data-mce-href=\"" + url + "\" href=\"" + url + "\"><input type='button' style='border-radius: 4px;color: white;background: grey;cursor: pointer;' value='Log In' /></a>");
            }
            else if (vl != '0') {
                tinymce.activeEditor.execCommand('mceInsertContent', true, "<a><<\(" + vl + "\)>></a>");
            }
            //else {
            //		var cleanedContent = content

            //				.replace(/<a[^>]*><input[^>]*value=['"]Log In['"][^>]*><\/a>/gi, '')

            //				.replace(/<a[^>]*>&lt;&lt;\([^)]*\)&gt;&gt;<\/a>/gi, '');

            //		editor.setContent(cleanedContent);
            //}
        });

    }
    //#endregion

    // #region :: Edit Vendor Contact
    if (action_name === 'editvendorcontact') {
        let isDirty = false;

        $(document).on('change keyup', '#edit_vendor_form input, #edit_vendor_form select, #edit_vendor_form textarea', function () {
            isDirty = true;
        });

        $(document).on('change keyup', '#edit_contact_permission input, #edit_contact_permission select, #edit_contact_permission textarea', function () {
            isDirty = true;
        });

        loadaddress();
        $('.headerCheckbox').each(function () {
            const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
            const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
            $(this).prop("checked", allChecked);
        });

        function loadaddress() {
            var vendorId = $('#hiddenVId').val();
            $.ajax({
                url: "/Vendors/GetAllContactAddress",
                data: { vendorId: vendorId },
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $("#partialAddressLoad").html("");
                        $("#partialAddressLoad").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $("#partialAddressLoad").html("");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });
        }
        $(document).on("change", "#cnDdlCountry", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#cnDdlstate');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });

        });
        $(document).on("click", "#addNewAddress", function () {

            var Tabheader = $('#cnHeader').val().trim();
            var Address = $('#cnAddress').val().trim();
            var CountryID = $('#cnDdlCountry option:selected').val();
            var StateID = $('#cnDdlstate option:selected').val();
            var PinCode = $('#cnzipcode').val().trim();
            var City = $('#cncity').val().trim();
            var Isdefault = $('#cnIsDefault').is(':checked') ? true : false;
            var VendorId = $('#hiddenVId').val();

            if (Tabheader == '') {
                $.notify.warning('Caution', 'Address title can not be blank.');
                errorfunc('cnHeader', 'Please Enter Address Title');
                return;
            }
            if (Address == '') {
                $.notify.warning('Caution', 'Address can not be blank.');
                errorfunc('cnAddress', 'Please Enter Address');
                return;
            }

            var fd = {
                Tabheader: Tabheader,
                Address: Address,
                VendorID: VendorId,
                CountryID: CountryID,
                StateID: StateID,
                PinCode: PinCode,
                City: City,
                IsDefault: Isdefault
            }

            $.ajax({
                url: "/Vendors/AddNewContactAddress",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var Title = data.Result;
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#add_new_address').modal('hide');
                        $(".loader").css("display", "none");
                        loadaddress();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });

        });

        $(document).on("click", "#vendorSuser", function () {

            var emailLabel = $('#vendorEmail').closest('.frm_fld_wrp').find('label.form-label');

            if ($(this).is(":checked")) {
                $('#vendorUpPermissionShowHide').removeClass('d-none');
                if (emailLabel.find('span.req').length === 0) {
                    emailLabel.append('<span class="req">*</span>');
                }
            } else {
                $('#vendorUpPermissionShowHide').addClass('d-none');
                emailLabel.find('span.req').remove();
            }

        });

        $(document).on("click", "#updateVContact", function () {
            var vendorId = $("#hiddenVId").val();
            var firstName = $("#vendorFN").val().trim();
            var lastName = $("#vendorLN").val().trim();
            var vendorEmail = $("#vendorEmail").val().trim();
            var website = $("#vendorWebsite").val().trim();
            var contactTitle = $("#contactTitleVendor").val().trim();
            var phone = $("#VendorPhone").val().trim();
            var mobile = $('#vendorMob').val().trim();
            var extension = $("#vendorExt").val().trim();
            /*var fax = $("#vendorFax").val().trim();*/
            var isSystemUser = $("#vendorSuser").is(':checked') ? 1 : 0;
            var isHidden = $("#vendorH").is(':checked') ? 1 : 0;
            var priorities = "";

            if (isSystemUser == 0) {
                priorities = "";
            }

            var priorities = $('.project_check:checked').map(function () {
                return $(this).attr('data-sysid');
            }).get().join(',');

            var address1 = '';
            var city = '';
            var Country = '';
            var state = '';
            var postalcode = "";
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            $('input[type="checkbox"][name="IsDefaultAddress"]').each(function () {
                if ($(this).is(':checked')) {

                    var tab = $(this).closest('.tab-content');

                    address1 = tab.find('textarea[name="address"]').val();
                    city = tab.find('input[name="city"]').val();
                    Country = tab.find('select[name="country"]').val();
                    state = tab.find('select[name="state"]').val();
                    postalcode = tab.find('input[name="pincode"]').val();
                }
            });



            let fd = {
                VendorId: vendorId,
                ContactFirstname: firstName,
                ContactLastname: lastName,
                Address1: address1,
                Country: Country,
                State: state,
                City: city,
                Phone: phone,
                Extension: extension,
                Mobile: mobile,
                ZipCode: postalcode,
                /*Fax: fax,*/
                ContactTitle: contactTitle,
                Email: vendorEmail,
                Website: website,
                IsHidden: isHidden,
                IsSystemUser: isSystemUser,
                priorities_on_list: priorities
            }

            if (fd.ContactFirstname === "" || fd.ContactFirstname === undefined) {
                $.notify.warning('Caution', 'You must enter first name before continue');
                errorfunc('vendorFN', 'Please Enter First Name')
                return;
            }
            if (fd.IsSystemUser == 1) {
                if (fd.Email === "" || fd.Email === undefined) {
                    $.notify.warning('Caution', 'You must enter Email before continue');
                    errorfunc('vendorEmail', 'Please Enter Email Address')
                    return;
                }
            }

            $.ajax({
                url: _BaseURL + "/Vendors/UpdateVendorContact",
                type: "POST",
                data: fd,
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
                    }
                    else {
                        if (data.ErrorMessages === 'INVALID^EMAIL') {
                            $.notify.error('Error', 'Email already exists! Please give an unique one !');
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                        
                    }

                }
            });
        });

        $(document).on("click", ".systemoption", function (e) {
            var _this = $(e.currentTarget);
            var isChecked = _this.prop('checked');
            var sysid = _this.data('sysid');


            if (sysid == 18) {
                $('input[data-sysid="17"]').prop('checked', isChecked);
            }

            $('.headerCheckbox').each(function () {
                const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
                const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                $(this).prop("checked", allChecked);
            });

        })

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

            var groupKey = $(this).val().trim();

            $('.' + groupKey + '_check').prop('checked', $(this).prop('checked'));

        })

        $(document).on("click", ".systemoption", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            let endIndex = id.length - 1;
            var headerid = id.substring(0, endIndex);
            if (_this[0].checked == false) {
                if ($("#" + headerid + "").is(":checked")) {
                    $("#" + headerid + "").prop('checked', false);
                }

            }

        });

        $(document).on("change", ".upddlCountry", function (e) {
            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var index = id.split('_');
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#upddlstate_' + index[1] + '');
                        stateDropdown.empty();
                        $('.upddlstate').html('');
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        });

        $(document).on("click", ".update_btn", function (e) {

            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var index = id.split('_')[1];

            var tabHeader = $("#uptabheader_" + index + "").val();
            var address = $("#upaddress_" + index + "").val();
            var city = $("#upcity_" + index + "").val();
            var country = $("#upddlCountry_" + index + " option:selected").val();
            var state = $("#upddlstate_" + index + " option:selected").val();
            var zipcode = $("#upzipcode_" + index + "").val();
            var VendorId = $('#hiddenVId').val();
            var flid = $("#flid_" + index + "").val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            let isdefualt;
            if ($("#upisdefualt_" + index + "").is(":checked")) {
                isdefualt = true;
            }
            else {
                isdefualt = false;
            }

            if (tabHeader == '') {
                $.notify.warning('Caution', 'Address title can not be blank!');
                errorfunc('cnHeader', 'Please Enter Address Title');
                return;
            }
            if (address == '') {
                $.notify.warning('Caution', 'Address can not be blank!');
                errorfunc('cnAddress', 'Please Enter Address');
                return;
            }

            var fd = {
                Tabheader: tabHeader,
                Address: address,
                VendorID: VendorId,
                CountryID: country,
                StateID: state,
                PinCode: zipcode,
                City: city,
                IsDefault: isdefualt,
                FldID: flid,
                Flag: "update"
            }

            $.ajax({
                url: "/Vendors/UpdateContactAddress",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#add_new_address').modal('hide');
                        $(".loader").css("display", "none");
                        loadaddress();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        })

        $(document).on("click", ".delete_btn", function (e) {

            var _this = $(e.currentTarget);
            var id = _this[0].id;
            var index = id.split('_')[1];
            var addressId = $("#flid_" + index + "").val();

            $.confirm({
                title: 'Delete Address?',
                message: 'Do You want to delete?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    deleteContactAddress(addressId);
                },
                onCancel: function () {
                    
                }
            });
        });

        function deleteContactAddress(addressId) {
            $.ajax({
                url: "/Vendors/DeleteContactAddress",
                type: "POST",
                data: { addressId: addressId },
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess)
                    {
                        $.notify.success('Success', data.Result);
                        $(".loader").css("display", "none");
                        loadaddress();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
        }

        $(document).on("click", "#CreateVCard", function () {
            generateVcard();
        });
        function generateVcard() {

            var urltemp = '';

            var obj = {};

            obj.FN = $('#vendorFN').val();
            obj.LN = $('#vendorLN').val();
            obj.TITLE = "Contact";
            obj.ORG = $('#vendorFN').val();
            obj.EMAIL = $('#vendorEmail').val();
            var _divhtml = $(".address-nav");


            obj.PHONE = $('#VendorPhone').val();
            obj.EXT = $('#vendorExt').val();
            obj.Cell = $('#vendorMob').val();
            obj.FAX = $('#vendorFax').val();
            $.each(_divhtml, function (key, val) {
                var row = $(val);
                if (row.hasClass('active')) {
                    var index = row[0].id.split('_')[1];
                    obj.COUNTRY = $('#upddlCountry_' + index + ' option:selected').text();
                    obj.ADR = $('#upaddress_' + index + '').val();
                    obj.STATE = $('#upddlstate_' + index + ' option:selected').text();
                    obj.CITY = $('#upcity_' + index + '').val();
                    obj.POSTALCODE = $('#upzipcode_' + index + '').val();
                }
            })
            $.ajax({
                type: "POST",
                url: "/Vendors/GenerateVcard",
                async: false,
                data: obj,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    $(".loader").css("display", "none");
                    urltemp = '/Assets/VendorFiles/';


                    urltemp += data;

                    var html = "<a target='_blank' href='" + urltemp + "'><i class='fa fa-download mrg5R' aria-hidden='true'></i>"
                        + "Download Contact for " + $('#vendorFN').val() + " " + $('#vendorLN').val() + "</u></a>";
                    $('#vcardlink').html(html);

                }
            });

        }

        $(document).on('keyup', '.pincode', function () {
            var value = $(this).val()?.toLocaleUpperCase();
            $(this).val(value);
        });
    }
    //#endregion

    // #region :: Add New Vendor Contact
    if (action_name === 'addnewvendorcontact') {
        let isDirty = false;

        $(document).on('change keyup', '#add_vendor_contact_form input, #add_vendor_contact_form select, #add_vendor_contact_form textarea', function () {
            isDirty = true;
        });

        $(document).on('change keyup', '#add_contact_form input, #add_contact_form select, #add_contact_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $(document).on("change", "#ddlCountry", function () {
            var countryId = $(this).val();
            $.ajax({
                url: '/Vendors/GetAllStatesOnAddVendorByCountryId',
                type: 'GET',
                data: { CountryId: countryId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess) {

                        var allstate = data.Result;
                        var stateDropdown = $('#ddlState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
                        });

                    }
                    else {
                        $.notify.error('Error', 'Something Went Wrong!');
                    }

                }
            });

        });

        $(document).on("click", "#checkedSystemUSer", function () {
            if ($(this).is(':checked')) {
                $('#permissionShowHide').removeClass('d-none');
            }
            else {
                $('#permissionShowHide').addClass('d-none');
            }
        });

        $(document).on("click", "#uncheckall", function (ev) {
            ev.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', false);
            $('input[type="checkbox"].headerCheckbox').prop('checked', false);

        });
        $(document).on("click", "#checkall", function (event) {
            event.preventDefault();
            $('input[type="checkbox"].project_check').prop('checked', true);
            $('input[type="checkbox"].headerCheckbox').prop('checked', true);
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

        $(document).on("click", ".systemoption", function (e) {
            //var _this = $(e.currentTarget);
            //var id = _this[0].id;
            //let endIndex = id.length - 1;
            //var headerid = id.substring(0, endIndex);
            //if (_this[0].checked == false) {
            //    if ($("#" + headerid + "").is(":checked")) {
            //        $("#" + headerid + "").prop('checked', false);
            //    }

            //}
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

        $(document).on("click", "#btn_CrtNewVendorContact", function (e) {
            var IsHidden = $("#Ishidden").is(':checked') ? 1 : 0;
            var IsSystemUser = $("#checkedSystemUSer").is(':checked') ? 1 : 0;
            var FirstName = $("#txt_ContactFname").val().trim();
            var LastName = $("#txt_ContactLname").val().trim();
            var EmailAddress = $("#txt_Email").val().trim();
            var WebSite = $("#txt_Website").val().trim();
            var PhoneNo = $("#txt_Phone").val().trim();
            var Ext = $("#txt_Extension").val().trim();
            /*var Fax = $("#txt_Fax").val().trim();*/
            var Mobile = $("#txt_Mobile").val().trim();
            var Address = $("#txt_Add1").val().trim();
            var country = $('#ddlCountry option:selected').val();
            var state = $('#ddlState option:selected').val();
            var city = $("#Ddl_City").val().trim();
            var postalcode = $("#txt_ZipCode").val().trim();
            var ParentVendorID = $("#ParentVendorID").val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            //var priorities = "";
            //$('.project_check').each(function () {
            //    if ($(this).is(":checked")) {
            //        if (priorities == "") {
            //            priorities += $(this).attr('data-sysid');
            //        }
            //        else {
            //            priorities += "," + $(this).attr('data-sysid');
            //        }
            //    }
            //});
            var priorities = "";
            if ($("#checkedSystemUSer").is(":checked")) {
                priorities = $('.project_check:checked').map(function () {
                    return $(this).attr('data-sysid');
                }).get().join(',');
            }
            else {
                priorities = null;
            }


            let fd = {
                ContactFirstname: FirstName,
                ContactLastname: LastName,
                Address1: Address,
                ParentVendor_ID: ParentVendorID,
                Country: country,
                State: state,
                City: city,
                Phone: PhoneNo,
                Extension: Ext,
                ZipCode: postalcode,
                /*Fax: Fax,*/
                Email: EmailAddress,
                Website: WebSite,
                IsHidden: IsHidden,
                IsSystemUser: IsSystemUser,
                Mobile: Mobile,
                priorities_on_list: priorities
            }
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,4})+\.([A-Za-z]{2,4})$/;

            if (fd.ContactFirstname === "" || fd.ContactFirstname === undefined) {
                $.notify.warning('Caution', 'You must enter first name before continue');
                errorfunc('txt_ContactFname', 'Please Enter First Name')
                return;
            }
            if (fd.Email != '' && reg.test(fd.Email) == false) {
                $.notify.warning('Caution', 'You must enter proper mail format before continue');
                errorfunc('txt_Email', 'Please Enter First Name')
                return;
            }
            if (fd.IsSystemUser == 1) {
                if (fd.Email === "" || fd.Email === undefined) {
                    $.notify.warning('Caution', 'You must enter Email before continue');
                    errorfunc('txt_Email', 'Please Enter Email Address');
                    return;
                }
            }


            $.ajax({
                url: "/Vendors/InsertNewVendorContact",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        isDirty = false;
                        $.notify.success('Success', data.Result);
                        $(".loader").css("display", "none");
                        window.setTimeout(function () {
                            window.location.href = '/Vendors/EditVendor?vendorid=' + ParentVendorID
                        }, 2000);

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });


        $(document).on("keyup", "#txt_Email", function () {
            var IsSystemUser = $("#checkedSystemUSer").is(':checked') ? 1 : 0;
            if (IsSystemUser == 0) {
                return;
            }
            var email = $("#txt_Email").val();
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,4})+\.([A-Za-z]{2,4})$/;
            var eaddress = email;
            var rdd = $(this);
            $(rdd).parent().find('.emailexists').remove();
            if (email != '' && reg.test(eaddress) == false) {

                rdd.addClass('errorClass');

                return false;
            }
            if (email == '') {

                rdd.removeClass('errorClass');
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

                }
            });
        });

        $(document).on('click', '#gotoEditVendor', function () {
            var vendorId = $('#ParentVendorID').val().trim();
            $.redirect(_BaseURL + "/Vendors/EditVendor?vendorid=" + vendorId);

        });


    }
    //#endregion

    // #region :: Merge Vendors
    if (action_name === 'mergevendors') {

        var removedIds = [];
        $(document).on("click", "#vendorListbtn", function () {


            var currCode = $('#CurrencyID').val();
            var parentVendorId = $('#pvId').val();
            var storedId = $('#hValId').val().split(",");

            var isChecked = "0";
            /*if (storedId === null || storedId === undefined || storedId === "") {*/

            $.ajax({
                url: _BaseURL + "/Vendors/VendorListforMerge?currCode=" + currCode + "&parentVendorId=" + parentVendorId + "&isChecked=" + isChecked,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    $("#all_vendor_list").modal('show');
                    $('#partialVendorListMerge').html("");
                    $('#partialVendorListMerge').html(data);
                    selectVendorDataTable();
                    storedId.forEach(function (id) {
                        $(".pvId[data-id='" + id + "']").prop('checked', true);


                    });
                    removedIds.forEach(function (id) {
                        $(".pvId[data-id='" + id + "']").prop('checked', true);
                    });




                }
            });


            //}
            //else {
            //	$.ajax({
            //		url: _BaseURL + "/Vendors/VendorListforMerge?currCode=" + currCode + "&parentVendorId=" + parentVendorId + "&isChecked=" + isChecked,
            //		type: "GET",
            //		beforeSend: function () {
            //			$(".loader").css("display", "flex");
            //		},
            //		success: function (data) {
            //			$(".loader").css("display", "none");
            //			$("#all_vendor_list").modal('show');

            //			$('#partialVendorListMerge').html("");
            //			$('#partialVendorListMerge').html(data);
            //			selectVendorDataTable();
            //			storedId.forEach(function (id) {
            //				$(".pvId[data-id='" + id + "']").prop('checked', true);


            //			});

            //		},
            //		error: function (error) {
            //			console.log(error);
            //		}


            //	});
            //}



        });

        $(document).on("click", ".pvId", function () {

            let value = $(this).is(':checked') ? 1 : 0;
            var PId = $(this).data('id');

            $(this).val(value);
        });
        $(document).on("click", "#AddVndMerge", function () {

            var isChecked = $(".pvId").is(':checked');

            let parentVendorId = [];

            var currCode = $('#pvCurrCode').val();
            //if (isChecked == 1) {
            //	$(".pvId").each(function () {
            //		var PId = $(this).data('id');
            //		if ($(this).val() == 1) {
            //			parentVendorId.push(PId);
            //			$("#hValId").val(parentVendorId.join(","));


            //		}
            //		else {
            //			return;
            //		}

            //	});

            //}
            let existingIds = $("#hValId").val();
            if (existingIds) {
                parentVendorId = existingIds.split(",");
            }



            $(".pvId:checked").each(function () {
                var PId = $(this).data('id');
                if (!parentVendorId.includes(PId.toString())) {
                    parentVendorId.push(PId);
                }
            });
            $(".pvId:not(:checked)").each(function () {
                var PId = $(this).data('id').toString();
                const index = parentVendorId.indexOf(PId);
                if (index > -1) {
                    parentVendorId.splice(index, 1);

                }
            });

            $("#hValId").val(parentVendorId.join(","));

            var parentVendorIdString = parentVendorId.join(",");
            if (isChecked === true) {
                $.ajax({
                    url: _BaseURL + "/Vendors/VendorListbind?currCode=" + currCode + "&ParentVendorId=" + parentVendorIdString + "&isChecked=" + isChecked,
                    type: "GET",
                    contentType: false,
                    processData: false,
                    async: true,
                    cache: false,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (tempData) {
                        $(".loader").css("display", "none");
                        //var tempData = JSON.parse(data);
                        var length = tempData.length;
                        removedIds.length = 0;

                        var vndid = "";
                        var vndname = "";
                        var html = "";
                        var vndncontacts = tempData.contacts;
                        var contactlist = "";
                        /*let count = 0;*/

                        for (var i = 0; i < length; i++) {
                            var vndid = tempData[i].parentVendor_ID;
                            var vndname = tempData[i].parentVendorName;
                            var vndncontacts = tempData[i].contacts;
                            vndid = tempData[i].parentVendor_ID;
                            vndname = tempData[i].parentVendorName;
                            var contactlist = "";
                            var contactArray = vndncontacts.split('#');
                            for (var t = 0; t < contactArray.length; t++) {

                                /*console.log(contactArray[t].split('^')[0]);*/
                                var contactName = contactArray[t].split('^')[0];
                                var contactId = contactArray[t].split('^')[1];

                                contactlist += "<span style='cursor:pointer' class='badge text-bg-success listedVendor'  data-id='" + vndid + "'  data-vid='" + contactId + "'>" + contactName + "</span>";

                            }

                            html += "<ul class='comment_list'><li class='listBind'><span >" + vndname + "</span>" + contactlist + "<a href='javascript:void(0);' class='remove_bar' title='remove_bar' ><i class='fa-solid fa-xmark' aria-hidden='true'></i></a></li></ul>";
                            /*count++;*/

                        }
                        /*if (count > 0) {*/
                        $('#notselected').removeClass('d-flex').addClass('d-none');

                        $('#listToMerge').html(html);


                        /*}*/
                        //else {
                        //	$('#listToMerge').html("")
                        //	$('#listToMerge').html("None Selected");
                        //}


                    }
                })

            }
            else {
                $('#listToMerge').html("");
                $('#notselected').removeClass('d-none').addClass('d-flex');

            }




        });
        $(document).on("click", "#mergeBtn", function () {

            var parentVendorId = $("#pvId").val();
            var vendorToBeMerged = $("#hValId").val();


            if (vendorToBeMerged === null || vendorToBeMerged === undefined || vendorToBeMerged === "") {
                var success = false;
                var title = "Please Select Vendors";
                var isValid = true;
                $.notify.warning('Caution', title);
                var currCode = $('#CurrencyID').val();
                var parentVendorId = $('#pvId').val();
                var isChecked = "0";


                $.ajax({
                    url: _BaseURL + "/Vendors/VendorListforMerge?currCode=" + currCode + "&parentVendorId=" + parentVendorId + "&isChecked=" + isChecked,
                    type: "GET",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {
                            $("#all_vendor_list").modal('show');
                            $('#partialVendorListMerge').html("");
                            $('#partialVendorListMerge').html(data);
                            selectVendorDataTable();
                            removedIds.forEach(function (id) {
                                $(".pvId[data-id='" + id + "']").prop('checked', true);
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

            else {

                $.confirm({
                    title: 'Warning',
                    message: "Are you sure you want to Merge " + $('.remove_bar').length + " vendors with \"" + $('#vendorlegalname').val() + "\"?",
                    type: 'warning',
                    confirmText: 'Continue',
                    cancelText: 'Go Back',
                    onConfirm: function () {
                        $.ajax({
                            url: _BaseURL + "/Vendors/VendorMerge?vendorId=" + parentVendorId + "&MergeId=" + vendorToBeMerged,
                            type: "POST",
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                var tempData = JSON.parse(data);
                                alert(tempData);
                                $(".loader").css("display", "flex");
                                $('#listToMerge').html("");
                                $('#notselected').removeClass('d-none').addClass('d-flex');
                                $("#hValId").val("");
                                removedIds.length = 0;

                                $.confirm({
                                    title: '',
                                    message: "New Contacts merged" + " Go back to Edit Screen",
                                    type: 'confirm',
                                    confirmText: 'Yes, Proceed',
                                    cancelText: 'Cancel',
                                    onConfirm: function () {
                                        $.redirect(_BaseURL + "/Vendors/EditVendor?vendorid=" + parentVendorId);
                                    },
                                    onCancel: function () {
                                        window.location.reload();
                                    }
                                });                               
                            }
                        });
                    },
                    onCancel: function () {
                        return;
                    }
                });                
            }
            /*}*/

        });

        $(document).on("click", ".remove_bar", function () {

            var removeBar = $(this);
            var listBind = removeBar.closest(".listBind");
            var listedVendor = listBind.find(".listedVendor");
            var IdtoRemove = listedVendor.data('id');
            removedIds.push(IdtoRemove);

            var listedId = $("#hValId").val();

            var storedId = $("#hValId").val().split(",");

            if (listedId.includes(IdtoRemove)) {
                var idArray = listedId.split(',');
                var index = idArray.indexOf(IdtoRemove.toString());
                listedId.substr(index, 1);
                if (index !== -1) {
                    idArray.splice(index, 1);

                }

                listedId = idArray.join(',');
                $("#hValId").val(listedId);
            }

            $.confirm({
                title: '',
                message: 'Are you sure you want to delete?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    listBind.remove();
                },
                onCancel: function () {                    
                }
            });
           
            if (listedId === null || listedId === undefined || listedId === "") {

                $('#listToMerge').html("");
                $('#notselected').removeClass('d-none').addClass('d-flex');
            }

        });

        $(document).on("click", ".listedVendor", function () {
            var vendorId = $(this).data('vid');

            $.redirect(_BaseURL + "/Vendors/EditVendorContact?vendorId=" + vendorId);


        });
        $(document).on("click", ".modalParentVendorId", function () {
            var parentVendorId = $(this).data('id');

            /*$.redirect(_BaseURL + "/Vendors/EditVendor?vendorid=" + parentVendorId);*/

            // To Open the URL in a new tab
            window.open(_BaseURL + "/Vendors/EditVendor?vendorid=" + parentVendorId, '_blank');


        });

        function selectVendorDataTable() {
            $("#all_vendor_modalTable thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#all_vendor_modalTable thead");

            var table = $("#all_vendor_modalTable").DataTable({
                orderCellsTop: true,
                pageLength: 50,
                responsive: true,
                /*scrollX: true,*/
                searching: true,
                paging: true,
                // bLengthChange: false,

                columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
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
    }
    //#endregion
});