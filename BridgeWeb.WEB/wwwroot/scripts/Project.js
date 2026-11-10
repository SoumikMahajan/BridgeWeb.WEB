$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    var QueryParameter = window.location.pathname.split("/");
    var action_name = QueryParameter[2].toLocaleLowerCase();

    // #region :: Create Project
    if (action_name === 'createproject') {
        let isDirty = false;

        $(document).on('change keyup', '#create_project_form input, #create_project_form select, #create_project_form textarea', function () {
            isDirty = true;
        });

        // window.addEventListener('beforeunload', function (e) {
        //     if (!isDirty) return;

        //     e.preventDefault();
        //     e.returnValue = '';   // Chrome requires this
        // });

        var ddlVendorClassification = "";
        var vendorco = [];
        var vendorcocount = 0;
        var classArray = [];


        $("#txt_WareHouseReqDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_InstallDate,#txt_CompletionDate,#txt_OpeningDate",
            altFormat: "yy.mm.dd",
        });

        $("#txt_CompletionDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_OpeningDate",
            altFormat: "yy.mm.dd",
        });
        $("#txt_InstallDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_CompletionDate,#txt_OpeningDate",
            altFormat: "yy.mm.dd",
        });
        $("#txt_OpeningDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0
        });

        $(document).on("change", ".ddlCountry", function () {
            var countryId = $(this).val();
            var $stateDropdown = $(this).closest('.frm_fld_wrp').siblings().find('.ddlState');

            $.ajax({
                url: '/Project/GetAllStatesOnProjectByCountryId',
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
                        $stateDropdown.empty();
                        $stateDropdown.append('<option value="0" selected>--Select State--</option>');
                        $.each(data.Result, function (index, state) {
                            $stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });

        });

        var Schedulefiledata = {};
        var Schedulefiledatacount = 0;

        $(document).on("change", "#scheduleFileUpload", function () {

            //Schedulefiledata["fileupload" + Schedulefiledatacount] = $("#scheduleFileUpload")[0].files[0];
            //var html = "<li class='filesul'>";
            //html += $("#scheduleFileUpload")[0].files[0].name;
            //html += '&nbsp;<a id="delSchedulefile"><i class="fa-solid fa-trash"></i></li>';            

            //Schedulefiledatacount++;
            ////$('.fileList').html(html);
            //$(this).closest('.Install_sche_file').find('.filelist').append(html);

            var inputFiles = $("#scheduleFileUpload")[0].files;

            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "fileupload" + Schedulefiledatacount;

                Schedulefiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" id="delSchedulefile"><i class="fa-solid fa-trash"></i></a></li>';

                Schedulefiledatacount++;
                $(this).closest('.Install_sche_file').find('.filelist').append(html);
            }

        });

        $(document).on("click", "#delSchedulefile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');
            delete Schedulefiledata[fileKey];
            liElement.remove();
            $('#scheduleFileUpload').val('');
        });

        var ProjectAtcfiledata = {};
        var ProjectAtcfiledatacount = 0;

        $(document).on("change", "#atachmentFileUpload", function () {

            var inputFiles = $("#atachmentFileUpload")[0].files;

            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "fileupload" + ProjectAtcfiledatacount;

                ProjectAtcfiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" id="delAtcProjectfile"><i class="fa-solid fa-trash"></i></a></li>';

                ProjectAtcfiledatacount++;
                $(this).closest('.project_attach').find('.filelist').append(html);
            }

        });

        $(document).on("click", "#delAtcProjectfile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');
            delete ProjectAtcfiledata[fileKey];
            liElement.remove();
            $('#atachmentFileUpload').val('');
        });

        $(document).on("click", "#btn_CreateProject", function () {

            var ProjectName = $('#txt_ProjectName').val().trim();
            var LegalName = $('#txt_LegalName').val().trim();
            var isBridgeSupporter = $('#bridgesupporter').is(':checked') ? true : false;
            //var isProjectClosed = $('#bridgeIsClosed').is(':checked') ? 1 : 0;

            var HotelAddr = $('#txt_HotelAddr').val().trim();
            var HotelCountry = $('#Ddl_HotelCountry option:selected').val();
            var HotelState = $('#Ddl_HotelState option:selected').val().trim();
            var HotelCity = $('#txt_HotelCity').val().trim();
            var HotelZipCode = $('#txt_HotelZipCode').val().trim();

            var OwnerAddr = $('#txt_OwnerAddr').val().trim();
            var OwnerCountry = $('#Ddl_OwnerCountry option:selected').val();
            var OwnerState = $('#Ddl_OwnerState option:selected').val();
            var OwnerCity = $('#txt_OwnerCity').val().trim();
            var OwnerZipCode = $('#txt_OwnerZipCode').val().trim();
            var OwnerFax = '';  // $('#txt_OwnerFax').val().trim();
            var OwnerMobile = $('#txt_OwnerMobile').val().trim();
            var ownerphoneextension = $('#txt_OwnerPhoneExtension').val();

            var WareHouseReqDate = $('#txt_WareHouseReqDate').val().trim();
            var InstallDate = $('#txt_InstallDate').val().trim();
            var CompletionDate = $('#txt_CompletionDate').val().trim();
            var OpeningDate = $('#txt_OpeningDate').val().trim();
            var OnwnerRequirement = $('#txt_OwnerReqmnt').val().trim();

            var InvAddress = $('#txt_InvAddr').val().trim();
            var InvCountry = $('#Ddl_InvCountry option:selected').val();
            var InvState = $('#Ddl_InvState option:selected').val();
            var InvCity = $('#txt_InvCity').val().trim();
            var InvZipCode = $('#txt_InvZipCode').val().trim();

            var AccountingContact = $('#txt_AccountingContact').val().trim();
            var AccountingPhone = $('#txt_AccountingPhone').val().trim();
            var AccountingFax = ''; //$('#txt_AccountingFax').val().trim();
            var AccountingEmail = $('#txt_AccountingEmail').val().trim();
            var phoneextension = $('#txt_AccountingPhoneExtension').val();
            var FederalID = $('#txt_FederalID').val().trim();
            var CurrencyCode = $('.ddl_CurrencyCode option:selected').val();

            var GST = $('#txt_GST').val().trim() === "" ? 0 : $('#txt_GST').val().trim();
            var GSTTYPE = $('#txt_GSTLblShw').val().trim();

            var PST = $('#txt_PST').val().trim() === "" ? 0 : $('#txt_PST').val().trim();
            var PSTTYPE = $('#txt_PSTLblShw').val().trim();

            var StateTax = $('#txt_StateTax').val().trim() === "" ? 0 : $('#txt_StateTax').val().trim();
            var StateTaxTYPE = $('#txt_StateTxLblShw').val().trim();

            var PrchsOrdrCmmnts = $('#txt_PrchsOrdrCmmnts').val();

            var seletcedVendorList = vendorco.join(",");
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            var fd = {
                ProjectName: ProjectName,
                LegalName: LegalName,
                InvoiceAddress: InvAddress,
                InvoiceCity: InvCity,
                InvoiceState: InvState,
                InvoicePostalCode: InvZipCode,
                InvoiceCountry: InvCountry,
                //NumOfUserToAprv_Budget:,
                //NumOfUserToAprv_PO:,
                //NumOfUserToAprv_POITEMS:,
                //ClientID:0,
                //ManagerID:0,
                //DevelopmentInfo:,
                HotelAddress: HotelAddr,
                HotelCity: HotelCity,
                HotelState: HotelState,
                HotelPostalCode: HotelZipCode,
                HotelCountry: HotelCountry,
                //ProjectScope:,
                //OwnerName:,
                OwnerAddress: OwnerAddr,
                OwnerCity: OwnerCity,
                OwnerState: OwnerState,
                OwnerPostalCode: OwnerZipCode,
                OwnerCountry: OwnerCountry,
                //OwnerContact:,
                //OwnerNotes:,
                OwnerFax: OwnerFax,
                //OwnerEmail:,
                OwnerMobile: OwnerMobile,
                AccountingContact: AccountingContact,
                AccountingTelephone: AccountingPhone,
                AccountingFax: AccountingFax,
                AccountingEmail: AccountingEmail,
                FederalID: FederalID,
                //ProjectCreatedDate:,
                GSTHST: GST,
                GSTHSTTYPE: GSTTYPE,
                PST: PST,
                PSTTYPE: PSTTYPE,
                StateTax: StateTax,
                STATETAXTYPE: StateTaxTYPE,
                CurrCode: CurrencyCode,
                InstallDate: InstallDate,
                ProjectCompletionDate: CompletionDate,
                WarehouseRequiredDate: WareHouseReqDate,
                OpeningDate: OpeningDate,
                //InstallationScheduleFile:,
                OwnerReportingRequirement: OnwnerRequirement,
                //TermsFile:,
                //ProjectFile:,
                //ProjectComments:,
                PurchaseOrderComment: PrchsOrdrCmmnts,
                AccountPhoneExtension: phoneextension,
                OwnerPhoneExtension: ownerphoneextension,
                //NumOfUserToAprvPerlevel:,
                //DefaultTermsFile:,
                //IsClosed:,
                //CreatedBy:,
                //IsActive:,
                IsBridgeSupporter: isBridgeSupporter,
                SelectedVendorList: seletcedVendorList
            }

            if (fd.ProjectName == "") {
                $.notify.warning('Caution', 'You must enter a Project Name before saving the Project');
                errorfunc('txt_ProjectName', 'You must enter a Project Name before saving the Project');
                return;
            }

            if (fd.AccountingEmail != '') {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,4})+\.([A-Za-z]{2,4})$/;
                var eaddress = AccountingEmail;
                if (AccountingEmail != '' && reg.test(eaddress) == false) {
                    $('#txt_AccountingEmail').val('');
                    $.notify.warning('Caution', 'You must enter a valid email format.');
                    errorfunc('txt_AccountingEmail', 'You must enter a valid email format.');
                    return false;
                }
            }



            $.ajax({
                url: "/Project/CreateProject",
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
                        var ProjectId = data.Result.projectID;
                        var ProjectName = data.Result.projectName;
                        var ProjectNumber = data.Result.projectNumber;

                        uploadfiles(ProjectNumber, 'PF', function () {
                            uploadfiles(ProjectNumber, 'ISF', function () {
                                uploadfiles(ProjectNumber, 'TC', function () {

                                    $(".loader").css("display", "none");
                                   
                                    $.confirm({
                                        title: 'Are You Sure?',
                                        message: `Do you want to proceed to set up the Project Team? Project has been created with Project Number ${ProjectNumber}`,
                                        type: 'confirm',
                                        confirmText: 'Yes, Proceed',
                                        cancelText: 'Cancel',
                                        onConfirm: function () {
                                            window.location = "/Project/ProjectTeam?pid=" + ProjectId + "&n=" + encodeURIComponent(ProjectName);
                                        },
                                        onCancel: function () {
                                            window.location.reload();
                                        }
                                    });                                    
                                   
                                });

                            });
                        });

                    }
                    else {
                        $(".loader").css("display", "none");
                        Title = data.ErrorMessages;
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });


        });

        function uploadfiles(projectid, mode, callback) {
            var formData = new FormData();
            if (mode == "ISF") {
                for (var key in Schedulefiledata) {
                    formData.append(key, Schedulefiledata[key]);
                }
            }
            else if (mode == "PF") {
                for (var key in ProjectAtcfiledata) {
                    formData.append(key, ProjectAtcfiledata[key]);
                }
            }


            $.ajax({
                url: "/Project/UploadProjectFiles?projectid=" + projectid + "&mode=" + mode,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        if (callback) {
                            callback();
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }

        $(document).on("click", "#vendorlistBtn", function () {
            $("#orderVendor").modal('hide');
            getVendor();

        });
        classificationList();
        function getVendor() {

            $.ajax({
                url: _BaseURL + "/Project/VendorlistInProject",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data != null) {
                        $("#orderVendor").modal('show');
                        $('#vendorTableForProject').html('');
                        $('#vendorTableForProject').html(data);


                        var table = $('#order_vendortable').DataTable({
                            orderCellsTop: true,
                            fixedHeader: true,
                            "pageLength": 50,
                            initComplete: function () {
                                var api = this.api();


                                // Clone the header row only if it's not already cloned
                                if ($('#order_vendortable thead tr').length === 1) {
                                    $('#order_vendortable thead tr').clone(true).appendTo('#order_vendortable thead');
                                }

                                // Loop through each cloned header cell and add event listener for the input fields
                                $('#order_vendortable thead tr:eq(1) th').each(function (i) {
                                    var title = $(this).text();


                                    if ($(this).find('input').length > 0) {
                                        $('input', this).on('keyup change clear', function () {
                                            if (api.column(i).search() !== this.value) {
                                                api.column(i)
                                                    .search(this.value)
                                                    .draw();
                                            }
                                        });
                                    }
                                    else if (i === 3) {
                                        $(this).find('.dt-column-title').removeClass('.dt-column-title');
                                    }
                                });
                                $('#Ddl_Vendor_Clftion').on('change', function () {
                                    var clsearch = $(this).val();
                                    if (clsearch == null) clsearch = '';

                                    var srchtxt = '';
                                    var tmp = clsearch;

                                    for (var i = 0; i < tmp.length; i++) {
                                        var id = tmp[i];
                                        for (var a = 0; a < classArray.length; a++) {
                                            if (classArray[a].classification == id) {
                                                if (srchtxt == '') {
                                                    srchtxt += (classArray[a].classification);
                                                } else {
                                                    srchtxt += '|' + (classArray[a].classification);
                                                }
                                            }
                                        }
                                    }

                                    // Search in the Classification column (index 3)
                                    api.column(3).search(srchtxt, true, false).draw();
                                });

                            }
                        });

                        $(".multislct").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",

                        });


                        vendorco.forEach(function (id) {
                            $(".idParentVendor[data-id='" + id + "']").prop('checked', true);

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }

        function classificationList() {
            $.ajax({
                url: _BaseURL + "/Project/classificationList",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var tempData = JSON.parse(data);
                    classArray = JSON.parse(data);
                    //ddlVendorClassification = /*"<select class='multislct' id='Ddl_Vendor_Clftion' multiple='multiple'>"*/
                    ddlVendorClassification = `
					 <div class="multi_select">
						 <select multiple="multiple" class="multislct ms-offscreen" data-width="100%" tabindex="-1">
						<option value="" disabled>Please Select</option>
						`;
                    for (let i = 0; i < tempData.length; i++) {

                        var classification = tempData[i].classification;
                        var classificationID = tempData[i].classification_ID;

                        /*ddlVendorClassification += "<option value='" + classificationID + "'>" + classification + "</option>";*/
                        ddlVendorClassification += `
				  <option value="${classificationID}">${classification}</option>`;

                    }
                    /*ddlVendorClassification += "</select>";*/
                    ddlVendorClassification += `
            </select>
            <div class="ms-parent multislct ms-parent-open" title="" style="width: 100%;">
                <button type="button" class="ms-choice">
                    <span class="placeholder">Please Select</span>
                    <div class="icon-close open"></div>
                    <div class="icon-caret open"></div>
                </button>
                <div class="ms-drop bottom" style="display: block;">
                    <div class="ms-search">
                        <input type="text" autocomplete="on" autocorrect="on" autocapitalize="off" spellcheck="false" placeholder="Enter Keyword">
                    </div>
                    <ul style="max-height: 250px;">
                        <li class="ms-select-all" tabindex="0">
                            <label>
                                <input type="checkbox" data-name="selectAll" tabindex="-1">
                                <span>[Select all]</span>
                            </label>
                        </li>
						`;
                    for (let i = 0; i < tempData.length; i++) {
                        var classification = tempData[i].classification;
                        var classificationID = tempData[i].classification_ID;
                        ddlVendorClassification += `
						<li class=" " tabindex="0">
							<label class="">
								<input type="checkbox" value="${classificationID}" data-name="selectItem" tabindex="-1">
								<span>${classification}</span>
							</label>
						</li>`;
                    }
                    ddlVendorClassification += `
									<li class="ms-no-results" style="display: none;">No matches found</li>
								</ul>
							</div>
							</div>
						 </div>`;


                    $(".loader").css("display", "none");
                },
            })
        }

        $(document).on("click", "#POCommentBtn", function () {

            $.ajax({
                url: _BaseURL + "/Project/POComments",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#polist').modal('show');
                        $('#POCommentList').html('');
                        $('#POCommentList').html(data);
                        POCommentDataTable();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });

        });

        function POCommentDataTable() {

            $("#POCommentListTable thead tr")
                .clone(true)
                .addClass("filter")
                .appendTo("#POCommentListTable thead");

            var table = $("#POCommentListTable").DataTable({

                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 50,
                orderCellsTop: true,
                scrollY: "500px",   // vertical scroll height
                scrollX: true,      // enable horizontal scroll
                scrollCollapse: true, // collapse the table if less content
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    { orderable: false, targets: 0 },      // Disable sorting on first column
                    //{ width: "5%", targets: 0 },           // First column (icon)
                    //{ width: "auto", targets: 1 },          // Project Number
                    //{ width: "auto", targets: 2 },          // Project Name
                    //{ width: "auto", targets: 3 }           // Comment
                ],
                //autoWidth: false,
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

                            /*cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();*/


                            if (colIdx === 1) {

                                $(cell).html
                                    (
                                        '<input type="text" class="form-control" placeholder="Project Number" />'

                                    );
                            }
                            else if (colIdx === 2) {
                                $(cell).html
                                    (
                                        '<input type="text" class="form-control" placeholder="Project Name" />'
                                    );
                            }

                            else {
                                $(cell).html('<div style="display:none"></div>');
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
                    $('.dt-search').css("display", "none");
                },
            });

        }
        $(document).on("click", ".insertComment", function () {

            $('#txt_PrchsOrdrCmmnts').val('');
            var commentIndex = $(this).data('index');
            var hiddenComment = $('.hiddenComment');

            $('.hiddenComment').each(function () {
                var index = $(this).data('index');
                if (commentIndex === index) {
                    $('#txt_PrchsOrdrCmmnts').val($(this).val());
                    auto_grow($('#txt_PrchsOrdrCmmnts'));
                    $('#txt_PrchsOrdrCmmnts').focus();
                    $('#polist').modal('hide');
                    return false;
                }

            })

        });
        function auto_grow(element) {

            $(element).css("height", "60px");
            $(element).css("height", (document.getElementById("txt_PrchsOrdrCmmnts").scrollHeight + "px"));
        }
        $(document).on("keyup", "#txt_PrchsOrdrCmmnts", function () {


            if ($.trim($(this).val()) === "") {

                /*$("#txt_PrchsOrdrCmmnts").removeAttr("style");*/
                $(this).removeAttr("style");
                $(this).css("height", "");
            }
        });
        $(document).on("click", ".idParentVendor", function () {

            var PId = $(this).data('id');

            if ($(this).is(":checked")) {
                if (!vendorco.includes(PId)) {
                    vendorco.push(PId);
                    $(this).prop(":checked", true)
                }
            } else {
                const index = vendorco.indexOf(PId);
                if (index > -1) {
                    vendorco.splice(index, 1);
                    $(this).prop(":checked", false)
                }
            }
        });

        //$("#txt_PST, #txt_GST, #txt_StateTax").on("keypress", function (e) {
        //    return IsNumber(e);
        //});

    }
    // #endregion

    // #region :: Project List
    if (action_name === 'projectlist') {
        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        projectList();

        function projectList() {
            $("#project_list thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#project_list thead");

           /* var IsActive = null;*/
            var IsClosed = 0;
            let columnFilterValues = {};
            let debounceTimer;

            function debounce(fn, delay) {
                return function (...args) {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            var table = $('#project_list').DataTable({
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
                order: [[1, 'asc']],
                autoWidth: false,
                columnDefs: [
                    { className: "dt-head-left", targets: "_all" }, 
                    { orderable: false, targets: 0 },
                    { width: "6%", targets: 0 },  //Action
                    { width: "6%", targets: 1 }, //Project  
                    { width: "14%", targets: 2 }, //Name 
                    { width: "14%", targets: 3 }, //Legal Name  
                    { width: "10%", targets: 4 }, //Project Manager  
                    { width: "10%", targets: 5 }, //Hotel City
                    { width: "10%", targets: 6 },  //Country
                    { width: "10%", targets: 7 },  //Mobile 
                    { width: "14%", targets: 8 },  //Email
                    { width: "6%", targets: 9 },  //Status 

                ],
                ajax: {
                    url: '/Project/ProjectTableBind',
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
                            /*SortColumn: d.columns[d.order[0].column].data,*/
                            SortColumn: sortColumn,
                            SortDirection: sortDirection,
                            /*SortDirection: d.order[0].dir,*/
                            IsClosed: IsClosed,
                            ColumnFilters: columnFilterValues
                        })
                    },
                    dataSrc: "data",
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
                            let editIcon = `<i class="fa fa-pencil-square-o editProject" style="cursor:pointer;" data-id="${row.projectID}"></i>`;
                            let deleteIcon = ''
                            if (row.bcount === 0) {
                                deleteIcon = `<i class="fa fa-trash-o fa-fw deleteProject" style="cursor:pointer;" data-id="${row.projectID}"></i>`; 
                            }                            
                            return `<div class="text-center">${editIcon} ${deleteIcon}</div>`;
                        }
                    },
                    {
                         data: "ProjectNumber",
                         title: "Project",
                        render: function (data, type, row) {
                            return `<p class="/* text-uppercase1 */" data-id="${row.projectID}" title="${row.projectNumber}">${row.projectNumber}</p>`;
                         }
                    },
                    {
                         data: "ProjectName",
                         title: "Name",
                         render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.projectID}" title="${row.projectName}">${row.projectName}</p>`;
                         }
                    },
                    {
                         data: "LegalName",
                         title: "Legal Name",
                        render: function (data, type, row) {
                            return `<p class="text-uppercase1" data-id="${row.projectID}" title="${row.legalName || ''}">${row.legalName || ''}</p>`;
                       }
                    },
                    {
                         data: "ProjectManager",
                         title: "Project Manager",
                        render: function (data, type, row) {
                            return `<p class="/* text-uppercase1 */" data-id="${row.projectID}" title="${row.projectManager || ''}">${row.projectManager || ''}</p>`;
                       }
                    },
                    {
                         data: "HotelCity",
                         title: "Hotel City",
                        render: function (data, type, row) {
                            return `<p class="/* text-uppercase1 */" data-id="${row.projectID}" title="${row.hotelCity || ''}">${row.hotelCity || ''}</p>`;
                        }
                    },
                    {
                          data: "HotelCountry",
                          title: "Country",
                        render: function (data, type, row) {
                            return `<p class="text" data-id="${row.projectID}" title="${row.hotelCountry || ''}">${row.hotelCountry || ''}</p>`;
                        }
                    },
                    {
                          data: "OwnerMobile",
                          title: "Mobile",
                        render: function (data, type, row) {
                            return `<p class="text" data-id="${row.projectID}" title="${row.OwnerMobile || ''}">${row.OwnerMobile || ''}</p>`;
                        }
                    },
                    {
                          data: "AccountingEmail",
                          title: "Email",
                        render: function (data, type, row) {
                            return `<a style="color:#7792a8;" href="mailto:${row.accountingEmail || ''}">${row.accountingEmail || ''}</a>`;
                        }
                    },
                    {
                        data: "IsClosed",
                        title: "Status",
                        orderable: false,
                        render: function (data, type, row) {
                            return row.IsClosed ? 'CLOSED' : 'OPEN';
                        }
                    }
                ],
                initComplete: function (){
                      var api = this.api();
                      api.columns().eq(0).each(function (colIdx){
                        var column = api.column(colIdx);
                        var cell = $(".filters th").eq($(column.header()).index());
                        var title = $(cell).text();
                        if (colIdx === 0){
                           $(cell).html('<button type="button" class="porde_list_reset_btn" id="resetProjectList">Reset</button>');
        
                           $('#resetProjectList').on('click', function () {
                               $('.filters input').val('');
                               $('#filterbtn').val('');
                               $('#hiddenBtn').val('0');
                               columnFilterValues = {};
                               IsActive = null;
                               IsHidden = 0;
                               table.search('').draw();
                           });
                        }
                        else if (colIdx === 9) {
                          //Hidden Status Dropdown
                           $(cell).html(`
                                                <select class="form-select" id="hiddenBtn">      
                                                    <option value="0" selected>OPEN</option>
                                                    <option value="1">CLOSED</option>
                                                    </select>
                                                `);
                            $('#hiddenBtn').on('change', function () {
                                const hiddenVal = this.value;
                                if (hiddenVal === "") {
                                    IsClosed = null;
                                } else {
                                    IsClosed = hiddenVal === "0" ? 0 : 1;
                                }

                                table.draw();
                            });
                            //$('#hiddenBtn').on('change', function () {
                            //    const hiddenVal = this.value;
                            //    IsHidden = hiddenVal === "" ? null : parseInt(hiddenVal);

                            //    const activeVal = $("#filterbtn option:selected").val();
                            //    IsActive = activeVal === "" ? null : parseInt(activeVal);
                            //    table.draw();
                            //});
                        }
                        else{
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
                     })
                },
                drawCallback: function () {
                  $('html, body').animate({ scrollTop: 0 }, 300);
                }
            })
        };

        // Listen to page length change event
        $('#project_list').on('length.dt', function (e, settings, len) {
            const preferences = [];
            preferences.push({
                PreferenceKey: 'DataTable.PageLength',
                PreferenceValue: len.toString()
            });

            SetProjectPreference(preferences);
            //SetProjectPreference('DataTable.PageLength', len);
        });
    }
    //    function projectList() {
    //        $.ajax({
    //            url: _BaseURL + "/Project/ProjectTableBind",
    //            type: "GET",
    //            contentType: false,
    //            processData: false,
    //            cache: false,
    //            dataType: 'html',
    //            beforeSend: function () {
    //                $(".loader").css("display", "flex");
    //            },
    //            success: function (data) {
    //                if (data != null) {
    //                    $('#projectListTable').html('');
    //                    $('#projectListTable').html(data);
    //                    ProjectListDataTable();

    //                    $(".loader").css("display", "none");
    //                }
    //                else {
    //                    $(".loader").css("display", "none");
    //                    $.notify.error('Error', 'Something went wrong');
    //                }
    //            }
    //        });

    //    }
    //    function ProjectListDataTable() {

    //        $("#project_list thead tr")
    //            .clone(true)
    //            .addClass("s")
    //            .appendTo("#project_list thead");

    //        var table = $("#project_list").DataTable({
    //            "language": {
    //                "lengthMenu": "_MENU_ Entries Per Page"
    //            },
    //            "pageLength": pageLength,
    //            orderCellsTop: true,
    //            //scrollX: true,
    //            order: [[1, 'asc']],
    //            columnDefs: [
    //                { className: "dt-head-nowrap", targets: "_all" },
    //                { className: "dt-center", targets: [1, 2] },
    //                { width: '200px', targets: 9 },
    //                { "targets": 10, "className": "d-none" },
    //                { targets: [0, 1], orderable: false }
    //            ],
    //            initComplete: function () {
    //                var api = this.api();

    //                api.columns().eq(0).each(function (colIdx) {
    //                    var cell = $(".s th").eq($(api.column(colIdx).header()).index());
    //                    var title = $(cell).text();

    //                    // Remove unnecessary classes
    //                    cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();

    //                    if (colIdx === 0) {
    //                        $(cell).html('<button type="button" class="porde_list_reset_btn" id="resetProjectList">Reset</button>');
    //                    }
    //                    else if (colIdx === 9) {
    //                        var select = $(
    //                            '<select class="form-select" id="statusbtn"><option value="">All</option><option value="false" selected>OPEN</option><option value="true">CLOSED</option>'
    //                        ).appendTo($(cell));
    //                        select.on("change", function () {
    //                            var val = $(this).val();
    //                            if (val === "") {
    //                                api.column(colIdx).search("", false, false).draw();
    //                            } else {
    //                                var searchText = val === "true" ? "CLOSED" : "OPEN";
    //                                api.column(colIdx).search(searchText, false, false).draw();
    //                            }
    //                            //api.column(colIdx).search(val === "true" ? "CLOSED" : "OPEN", false, false).draw();
    //                        });

    //                        select.trigger("change");
    //                    }
    //                    else {
    //                        $(cell).html
    //                            (
    //                                '<input type="text" class="form-control" placeholder="🔍 Search..." />'
    //                            );
    //                    }

    //                    // Handle keyup event for filtering
    //                    $("input", $(".s th").eq($(api.column(colIdx).header()).index()))
    //                        .off("keyup")
    //                        .on("keyup", function () {
    //                            var searchTerm = $(this).val();
    //                            $(this).attr("title", searchTerm);

    //                            var regexr = "({search})";
    //                            api.column(colIdx)
    //                                .search(
    //                                    searchTerm !== "" ? regexr.replace("{search}", "(((" + searchTerm + ")))") : "",
    //                                    searchTerm !== "",
    //                                    searchTerm === ""
    //                                )
    //                                .draw();
    //                        });
    //                    $('.dt-search').css("display", "none");
    //                });
    //            },
    //        });


        $(document).on("click", ".deleteProject", function () {

            var projectId = $(this).data('id');
            let fd = {
                projectId: projectId,
            }           

            $.confirm({
                title: 'Delete Project?',
                message: 'Do you really want to delete the project?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({

                        url: _BaseURL + "/Project/DeleteProjectId",
                        dataType: "POST",
                        data: fd,
                        dataType: "JSON",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {                           
                            if (data.IsSuccess === true) {
                                Title = data.Result;
                                $.notify.success('Success', 'Data deleted successfully!');
                                projectList();
                                $(".loader").css("display", "none");
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    })
                },
                onCancel: function () {
                   
                }
            });            
        });
    //    $(document).on("click", "#resetProjectList", function () {

    //        projectList();

    //    });

        $(document).on("click", ".editProject", function () {
            var projectId = $(this).data('id');
            $(".loader").css("display", "flex");
            $.redirect(_BaseURL + "/Project/EditProject?ProjectId=" + projectId);
        });
    
    // #endregion

    // #region :: Edit Project
    if (action_name === 'editproject') {
        let isDirty = false;

        // $(document).on('change keyup', '#edit_project_form input, #edit_project_form select, #edit_project_form textarea', function () {
        //     isDirty = true;
        // });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        var InstalledFilesCount = $("#installedFileCount").val();
        var TermsCondFilesCount = $("#totalTermsFileCount").val();
        var ProjectFilesCount = $("#projectFilesCount").val();

        var ddlVendorClassification = "";
        var vendorco = [];
        var vendorcocount = 0;
        var classArray = [];
        var projectFileToInclude = [];

        $(".multi_slc_wrp").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",

        });
        var height = $('#txt_PrchsOrdrCmmnts').height();
        $("#txt_WareHouseReqDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_InstallDate,#txt_CompletionDate,#txt_OpeningDate",
            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {
                // When a date is selected, updating  the alternate fields
                // Convert dateText (string) into a Date object
                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                $(inst.settings.altField).each(function () {
                    // Format selectedDate (which is now a Date object)
                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                });
            }
        });

        $("#txt_InstallDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_CompletionDate,#txt_OpeningDate",
            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {

                // Convert dateText (string) into a Date object
                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                $(inst.settings.altField).each(function () {
                    // Format selectedDate (which is now a Date object)
                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                });
            }
        });
        $("#txt_CompletionDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_OpeningDate",
            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {

                // Convert dateText (string) into a Date object
                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                $(inst.settings.altField).each(function () {
                    // Format selectedDate (which is now a Date object)
                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                });
            }
        });

        $("#txt_OpeningDate").datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            altField: "#txt_OpeningDate",
            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {

                // Convert dateText (string) into a Date object
                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                $(inst.settings.altField).each(function () {
                    // Format selectedDate (which is now a Date object)
                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                });
            }
        });

        $("#fromDate").datepickercustom({

            changeMonth: true,
            changeYear: true,


            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {

                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                $(inst.settings.altField).each(function () {

                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                });
            },
            beforeShow: function () {
                var yearSelect = $(this).find('.ui-datepicker-year');
                yearSelect.empty();


                for (var year = 2006; year <= 2026; year++) {
                    yearSelect.append($('<option>', { value: year, text: year }));
                }
            }
        });

        $("#toDate").datepickercustom({
            changeMonth: true,
            changeYear: true,


            altFormat: "yy.mm.dd",
            onSelect: function (dateText, inst) {

                $(inst.settings.altField).each(function () {
                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, inst.settings.dateFormat ? inst.settings.dateFormat : dateText));
                });
            }
        });

        function auto_grow(element) {
            $(element).css("height", "60px");
            $(element).css("height", $(element).prop("scrollHeight") + "px");
        }
        $("#txt_PrchsOrdrCmmnts").focus(function () {
            auto_grow($('#txt_PrchsOrdrCmmnts'));
        });
        $("#txt_PrchsOrdrCmmnts").blur(function () {
            window.setTimeout(function () {
                $('#txt_PrchsOrdrCmmnts').css('height', height);
            }, 500);
        });

        ProjectContactList();
        function ProjectContactList() {
            var ProjectId = $('#hiddenProjectId').val();
            $.ajax({
                url: '/Project/ProjectContactList?ProjectId=' + ProjectId,
                type: 'GET',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = false;
                    var Title = "";
                    var IsValid = true;

                    if (data != null) {
                        $('#ProjectContactListTable').html("");
                        $('#ProjectContactListTable').html(data);
                        ProjectContactListDataTable();
                        $(".loader").css("display", "none");

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }


                }
            });

        }
        function ProjectContactListDataTable() {
            if ($.fn.DataTable.isDataTable("#projectContactDatatable")) {
                $('#projectContactDatatable').DataTable().clear().destroy();
            }
            $("#projectContactDatatable thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#projectContactDatatable thead");

            var table = $("#projectContactDatatable").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": pageLength,
                orderCellsTop: true,
                scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    //{ width: "10%", targets: 1 },  // Explicitly set column widths
                    //{ width: "15%", targets: 2 },
                    //{ width: "20%", targets: 3 },
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
                                    '<button type="button" class="porde_list_reset_btn" id="resetSearchField">Reset</button>'
                                );
                            }

                            else {
                                // For other columns, add input elements
                                $(cell).html(
                                    '<input type="text" class="form-control" placeholder="🔍"/>'
                                );
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
                    $('#resetSearchField').on('click', function () {
                        // Clear all the search fields
                        $('#projectContactDatatable .filters input').val('');

                        // Reset column searches
                        api.columns().search('').draw();
                    });

                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#projectContactDatatable tbody').html(
                            '<tr><td colspan="11" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });

            // Listen to page length change event
            $('#projectContactDatatable').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }


        $(document).on("click", "#bankAccountTabBtn", function () {
            var ProjectId = $('#hiddenProjectId').val();
            $(this).addClass('active');
            $("#ProjectAccountDetails").removeClass('active');

            $.ajax({
                url: _BaseURL + "/Project/BankAccountDetails?ProjectId=" + ProjectId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#BankDetails').html('');
                        $('#BankDetails').html(data);
                        $("#bankAccountSelect").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            onClose: function () {
                                AddBankAccount();
                            }
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }


                }
            });




        });
        loadUploadFiles();
        function loadUploadFiles() {

            //var InstallationScheduleFile = $('#InstallationScheduleFiledata a').text().trim();
            //var TermsFile = $('#TermsFiledata a').text().trim();
            //var ProjectFile = $('.previousfilelist li a').map(function () {
            //    return $(this).text().trim();
            //}).get()/*.join(',')*/;
            ////$('.previousfilelist li a').each(function () {

            ////	var filePath = '';
            ////	//if ($(this).parent().attr('id') == 'InstallationScheduleFiledata') {
            ////	//	filePath = '../../Assets/InstallationScheduleFiles/' + 'FabricationStatus(ISF_231_0)..pdf';
            ////	//} else if ($(this).parent().attr('id') == 'TermsFiledata') {
            ////	//	/*filePath = '../../Assets/TermsConditionFiles/' + TermsFile;*/
            ////	//	if (TermsFile == '') {
            ////	//		alert('empty');
            ////	//		filePath = '../../Assets/SystemTermsFiles/SystemTermsFile^TermsandConditions_0.pdf';
            ////	//		$(TermsFile).attr('href', filePath);
            ////	//		$(TermsFile).text('SystemTermsFile^TermsandConditions_0.pdf');
            ////	//	} else {
            ////	//		filePath = '../../Assets/TermsConditionFiles/' + TermsFile;
            ////	//		$('#termsFileLink').attr('href', filePath);
            ////	//		$('#termsFileLink').text(TermsFile);
            ////	//	}
            ////	//} else {
            ////	filePath = '../../Assets/ProjectFiles/' + ProjectFile;
            ////	/*}*/
            ////	$(this).attr('href', filePath);
            ////});
            //$('.previousfilelist li a').each(function (index) {
            //    var filePath = '';

            //    if (ProjectFile[index] != '') {
            //        filePath = '../../Assets/ProjectFiles/' + ProjectFile[index].trim();

            //    } else {
            //        filePath = '#';

            //    }

            //    $(this).attr('href', filePath);
            //});
            //$('#InstallationScheduleFiledata a').each(function () {
            //    var filePath = '';

            //    if (InstallationScheduleFile == '') {

            //        //filePath = '../../Assets/InstallationScheduleFiles/SystemInstallationScheduleFile.pdf';
            //        //$(this).text('SystemInstallationScheduleFile.pdf');
            //        $('#InstallationScheduleFiledata i.fa-trash-can').hide();
            //    } else {

            //        filePath = '../../Assets/InstallationScheduleFiles/' + InstallationScheduleFile;

            //    }

            //    $(this).attr('href', filePath);
            //});


            //$('#TermsFiledata a').each(function () {
            //    var filePath = '';

            //    if (TermsFile == '') {

            //        filePath = '../../Assets/SystemTermsFiles/SystemTermsFile^TermsandConditions_0.pdf';
            //        $(this).text('SystemTermsFile...ions_0.pdf');
            //        $('#TermsFiledata i.fa-trash-can').hide();
            //    } else {

            //        filePath = '../../Assets/TermsConditionFiles/' + TermsFile;
            //        $(this).text(TermsFile);

            //    }

            //    $(this).attr('href', filePath);
            //});

            $('.previousfilelist li ').each(function () {
                const checkbox = $(this).find('input[type="checkbox"]');
                const anchor = $(this).find('a');
                const anchorText = anchor.text().trim();
                if (checkbox.is(':checked')) {
                    projectFileToInclude.push(anchorText);
                }

            });

        }

        function AddBankAccount() {

            var selectedItem = $('#bankAccountSelect').multipleSelect('getSelects');
            let htmlContent = '';
            var $addBankDetails = $("#addBankDetails");

            /*var button = $addBankDetails.find('#addnewAccountbtn');*/
            var button = $('#addnewAccountbtn');



            if (selectedItem.length > 0) {

                if (button.hasClass('d-none')) {
                    button.removeClass('d-none').addClass('d-flex');
                }
            } else {

                if (!button.hasClass('d-none')) {
                    button.removeClass('d-flex').addClass('d-none');
                }
            }
        }
        $(document).on("click", "#addnewAccountbtn", function () {
            var selectedItem = $('#bankAccountSelect').multipleSelect('getSelects');
            var projectId = $('#hiddenProjectId').val();

            var values = selectedItem.join(",");
            let fd = {
                FldID: values,
                ProjectID: projectId,

            }
            $.ajax({
                url: _BaseURL + "/Project/AddNewProjectBankAccount",
                type: "POST",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        window.setTimeout(function () {
                            $.ajax({
                                url: _BaseURL + "/Project/BankAccountDetails?ProjectId=" + projectId,
                                type: "GET",
                                success: function (data) {
                                    $('#BankDetails').html('');
                                    $('#BankDetails').html(data);
                                    $("#bankAccountSelect").multipleSelect({
                                        filter: true,
                                        showClear: true,
                                        placeholder: "Please Select",
                                        filterPlaceholder: "Enter Keyword",
                                        onClose: function () {
                                            AddBankAccount();
                                        }
                                    });
                                },
                                complete: function () {
                                    $(".loader").hide();
                                }
                            });
                        }, 4000);

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").hide();
                    }

                }
            });

        });

        $(document).on("click", ".editvendorContactList", function () {
            var projectContactId = $(this).data('id');
            $.redirect(_BaseURL + "/Project/EditProjectContact?ProjectContactId=" + projectContactId);
        });
        $(document).on("click", ".deleteProjectContact", function () {
            var projectContactId = $(this).data('id');
            
            $.confirm({
                title: 'Delete Project Contact?',
                message: 'Do You want to Delete the project contact',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/DeleteProjectContact?ProjectContactId=" + projectContactId,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var success = data.IsSuccess;
                            var Title = "";
                            if (data.Result === "SUCCESS") {
                                Title = "Project Contact has been deleted";
                                ProjectContactList();
                                $.notify.success('Success', Title);

                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            $(".loader").css("display", "none");
                        }
                    })
                },
                onCancel: function () {                    
                }
            });
            
        });

        $(document).on("click", "#POModal", function () {
            $("#po_comment_list").modal('hide');
            $.ajax({
                url: _BaseURL + "/Project/POCommentList",
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $("#po_comment_list").modal('show');
                        $("#POComment").html('');
                        $("#POComment").html(data);

                        setTimeout(function () {
                            POCommentDataTable();
                        }, 200);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })

        })
        function POCommentDataTable() {

            $("#poCommentList thead tr")
                .clone(true)
                .addClass("filter")
                .appendTo("#poCommentList thead");

            var table = $("#poCommentList").DataTable({

                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 50,
                orderCellsTop: true,
                scrollX: true,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    { 'bSortable': false, 'aTargets': [0, 3] },
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

                            /*cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();*/


                            if (colIdx === 1) {

                                $(cell).html
                                    (
                                        '<input type="text" class="form-control" placeholder="Project Number" />'

                                    );






                            }
                            else if (colIdx === 2) {
                                $(cell).html
                                    (
                                        '<input type="text" class="form-control" placeholder="Project Name"/>'
                                    );


                            }

                            else {
                                $(cell).html('<div style="display:none"></div>');
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
                    $('.dt-search').css("display", "none");
                },
            });










        }

        $(document).on("click", ".addComment", function () {

            $('#txt_PrchsOrdrCmmnts').val('');
            var comment = $(this).closest('tr').find('.commentArea').val();
            $('#txt_PrchsOrdrCmmnts').val(comment);
            $('#txt_PrchsOrdrCmmnts').trigger('focus');
            auto_grow($('#txt_PrchsOrdrCmmnts'));
            $('#po_comment_list').modal('hide');
        });

        $(document).on("keyup", "#searchFiles", function () {

            var vl = $(this).val().toUpperCase().trim();
            $('.previousfilelist li').each(function () {
                var fileName = $(this).find('a').text().toUpperCase().trim();


                if (fileName.indexOf(vl) >= 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

        });
        $(document).on("click", "#PTDModal", function () {

            var ProjectId = $('#hiddenProjectId').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $("#fromDate").datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $("#toDate").datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Project/PTDPurchaseOrder?ProjectId=" + ProjectId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#pdt_modal').modal('show');
                        $('#ptdDatatable').html('');
                        $('#ptdDatatable').html(data);
                        setTimeout(function () {
                            PTDDataTable();
                        }, 200);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });

        });
        $(document).on('change', '#fromDate', function () {
            var ProjectId = $('#hiddenProjectId').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $("#toDate").datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Project/PTDPurchaseOrder?ProjectId=" + ProjectId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#pdt_modal').modal('show');
                        $('#ptdDatatable').html('');
                        $('#ptdDatatable').html(data);
                        PTDDataTable();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        })

        $(document).on('change', '#toDate', function () {
            var ProjectId = $('#hiddenProjectId').val();
            var fromDate = $.datepicker.formatDate("yy-mm-dd", $("#fromDate").datepicker("getDate"));
            var toDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker("getDate"));

            $.ajax({
                url: _BaseURL + "/Project/PTDPurchaseOrder?ProjectId=" + ProjectId + "&FromDate=" + fromDate + "&ToDate=" + toDate,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#pdt_modal').modal('show');
                        $('#ptdDatatable').html('');
                        $('#ptdDatatable').html(data);
                        PTDDataTable();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            })


        });
        //data table ptdtable
        function PTDDataTable() {

            var PTDPurchaseOrder = $('#PTDModal #PODetails').text();

            $("#pdt-breakdown thead tr")
                .clone(true)

                .addClass("filter")
                .appendTo("#pdt-breakdown thead");

            var table = $("#pdt-breakdown").DataTable({

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
                    { className: "dt-center", targets: [0, 1] },



                ],



                initComplete: function () {

                    var api = this.api();
                    if (PTDPurchaseOrder !== 'No Data Found') {
                        api.columns(1).nodes().flatten().to$().each(function () {
                            $(this).removeClass("dt-type-numeric dt-center dt-head-nowrap");
                        });

                        api.columns().eq(0).each(function (colIdx) {
                            var cell = $(".filter th").eq($(api.column(colIdx).header()).index());
                            var title = $(cell).text();

                            if (colIdx === 0) {
                                $(cell).html(`<input type="text" class="form-control" placeholder="${title}" />`);
                            } else if (colIdx === 1) {
                                $(cell).html(`<span id="PODetails">${PTDPurchaseOrder}</span>`);
                            }

                            $("input", $(".filter th").eq($(api.column(colIdx).header()).index()))
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
                        $(".filter th").each(function (index) {

                            $(this).html('');

                        });
                    }


                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#pdt-breakdown tbody').html(
                            '<tr><td colspan="3" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });










        }
        $(document).on("click", "#addProjectContactBtn", function () {

            var projectId = $('#hiddenProjectId').val();
            $.redirect(_BaseURL + "/Project/AddProjectContact?ProjectId=" + projectId);
        });
        HotelState();
        function HotelState() {

            var countryId = $("#hotelCountry").val();
            var stateId = $('#hiddenHotelStateVal').val();
            var HotelStateDropdown = $('#hoteState');

            if (countryId == null || countryId == "0" || countryId == "") {
                HotelStateDropdown.empty();
                HotelStateDropdown.append('<option value="0"selected>Select a state</option>');
                return;
            }

            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#hoteState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="0">Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            if (stateId == state.stateID) {
                                stateDropdown.append(`<option value="${state.stateID}" selected>${state.state}(${state.stateCode})</option>`);
                            }

                            else {
                                stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                            }

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
        }
        $(document).on("change", "#hotelCountry", function () {

            var countryId = $("#hotelCountry").val();
            if (countryId == "0") {
                let stateDropdown = $('#hoteState');
                stateDropdown.empty();
                stateDropdown.append('<option value=""selected>Select a state</option>');
                return;
            }
            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#hoteState');
                        stateDropdown.empty();

                        stateDropdown.append('<option value=""selected>Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
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
        OwnerState();
        function OwnerState() {

            var countryId = $("#OwnerCountry").val();
            var stateId = $('#hiddenOwnerState').val();
            var stateDropdownForNoCountry = $('#OwnerState');
            if (countryId == null || countryId == "0" || countryId == "") {
                stateDropdownForNoCountry.empty();
                stateDropdownForNoCountry.append('<option value="0"selected>Select a state</option>');
                return;

            }
            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#OwnerState');
                        stateDropdown.empty();


                        stateDropdown.append('<option value="0">Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            if (stateId == state.stateID) {
                                stateDropdown.append(`<option value="${state.stateID}" selected>${state.state}(${state.stateCode})</option>`);
                            }

                            else {
                                stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                            }

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
        }
        $(document).on("change", "#OwnerCountry", function () {

            var countryId = $("#OwnerCountry").val();
            if (countryId == "0") {
                let stateDropdown = $('#OwnerState');
                stateDropdown.empty();
                stateDropdown.append('<option value=""selected>Select a state</option>');
                return;
            }

            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#OwnerState');
                        stateDropdown.empty();

                        stateDropdown.append('<option value=""selected>Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
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
        InvoiceState();
        function InvoiceState() {

            var countryId = $("#InvoiceCountry").val();
            var stateId = $('#hiddenInvoiceState').val();
            var InvStateDropDown = $('#InvoiceState');
            if (countryId == null || countryId == "0" || countryId == "") {
                InvStateDropDown.empty();
                InvStateDropDown.append('<option value="0"selected>Select a state</option>');
                return;
            }

            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#InvoiceState');
                        stateDropdown.empty();
                        stateDropdown.append('<option value="0">Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            if (stateId == state.stateID) {
                                stateDropdown.append(`<option value="${state.stateID}" selected>${state.state}(${state.stateCode})</option>`);
                            }

                            else {
                                stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                            }

                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
        }
        $(document).on("change", "#InvoiceCountry", function () {

            var countryId = $("#InvoiceCountry").val();
            if (countryId == "0") {
                let stateDropdown = $('#InvoiceState');
                stateDropdown.empty();
                stateDropdown.append('<option value=""selected>Select a state</option>');
                return;
            }


            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryIdInEditProject?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#InvoiceState');
                        stateDropdown.empty();

                        stateDropdown.append('<option value=""selected>Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
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
        $(document).on("click", ".deleteFile", function () {

            var fileName = $(this).data('filename');
            var fldId = $(this).data('fldid');
            var projectId = $('#hiddenProjectId').val();
            var mode = "PF";

            $.confirm({
                title: 'Delete Project File?',
                message: "You really want to delete the file " + fileName + "?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/deleteProjectAttachments?fileName=" + fileName + "&ProjectId=" + projectId + "&mode=" + mode + "&fldId=" + fldId,
                        data: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var IsSuccess = data.IsSuccess;
                            var Title = "";
                            var IsValid = true;

                            if (data.IsSuccess == true) {
                                $(".loader").css("display", "none");;
                                $.notify.success('Success', data.Result);
                                window.location.reload();
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    });
                },
                onCancel: function () {
                }
            });

           
        });
        $(document).on('click', '.deleteTermsFile', function () {
            var fileName = $(this).data('filename');
            var fldId = $(this).data('fldid');
            var projectId = $('#hiddenProjectId').val();
            var mode = "TC";           

            $.confirm({
                title: 'Delete Project File?',
                message: "You really want to delete the file " + fileName + "?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/deleteProjectAttachments?fileName=" + fileName + "&ProjectId=" + projectId + "&mode=" + mode + "&fldId=" + fldId,
                        data: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {                           
                            if (data.IsSuccess == true) {
                                $(".loader").css("display", "none");
                                $.notify.success('Success', data.Result);
                                window.location.reload();
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    });
                },
                onCancel: function () {
                }
            });

        });
        $(document).on('click', ".deleteISF", function () {
            var fileName = $(this).data('filename');
            var fldId = $(this).data('fldid');
            var projectId = $('#hiddenProjectId').val();
            var mode = "ISF";

            $.confirm({
                title: 'Delete Project File?',
                message: "You really want to delete the file " + fileName + "?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/deleteProjectAttachments?fileName=" + fileName + "&ProjectId=" + projectId + "&mode=" + mode + "&fldId=" + fldId,
                        data: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess == true) {
                                $(".loader").css("display", "none");
                                $.notify.success('Success', data.Result);
                                window.location.reload();
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    });
                },
                onCancel: function () {
                }
            });


        });
        $(document).on('click', ".editProjectAccount", function () {
            var fldId = $(this).data('id');
            $.ajax({
                url: _BaseURL + "/Project/GetProjectAccountDetailsByFldId?fldId=" + fldId,
                type: 'GET',
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#ProjectDetails').html('');
                        $('#ProjectDetails').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });
        })
        $(document).on('click', "#saveProjectAccountDetails", function () {
            var fldId = $('#hiddenFldId').val();
            var accountNumber = $('#accountNo').val().trim();
            var description = $('#accountDesc').val().trim();
            let fd = {
                FldID: fldId,
                AccountNumber: accountNumber,
                Description: description,
            }
            let isValid = updateProjectAccount(fd);
            if (isValid) {
                $.ajax({
                    url: _BaseURL + "/Project/UpdateProjectAccountDetails",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $('#edit_projacc').modal('hide');
                        var IsSuccess = data.IsSuccess;
                        var Title = "";
                        var IsValid = true;

                        if (data.IsSuccess == true) {
                            $(".loader").css("display", "none");
                            $.notify.success('Success', data.Result);
                            window.location.reload();
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }

                    }
                })
            }



        })
        function updateProjectAccount(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.AccountNumber === "" || fd.AccountNumber === undefined) {
                IsValid = false;
                $.notify.warning('Caution', 'Please enter Account number');
            }
            return IsValid;

        }

        $(document).on("click", ".openProjectTeam", function () {
            var ProjectId = $("#hiddenProjectId").val();
            var ProjectName = $("#txt_ProjectName").val().trim();
            window.location = "/Project/ProjectTeam?pid=" + ProjectId + "&n=" + encodeURIComponent(ProjectName);
        });

        $(document).on("click", ".deleteProjectAcc", function () {

            var fldId = $(this).data('id');

            $.confirm({
                title: 'Delete Project Account?',
                message: 'Do you really want to delete project account',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/DeleteProjectAccount",
                        type: "POST",
                        data: { FldId: fldId },
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var IsSuccess = data.IsSuccess;
                            var Title = "";
                            var IsValid = true;

                            if (data.IsSuccess == true) {
                                $(".loader").css("display", "none");
                                $.notify.success('Success', data.Result);
                                window.location.reload();
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    })
                },
                onCancel: function () {
                    
                }
            });           

        });

        $(document).on("click", ".delete_project_bank", function () {

            var fldId = $(this).data('id');
            var ProjectId = $("#hiddenProjectId").val();

            $.confirm({
                title: 'Delete Project Account',
                message: 'Are you sure you want to delete this Account?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/DeleteProjectBank",
                        type: "POST",
                        data: { FldId: fldId, ProjectId: ProjectId },
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $(".loader").css("display", "none");
                                $.notify.success('Success', data.Result);
                                window.location.reload();
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }

                        }
                    })
                },
                onCancel: function () {

                }
            });

        });


        $(document).on("click", "#AddnewProjectAccount", function () {
            var accountNumber = $('#createAccountNum').val().trim();
            var desc = $('#createAccountDesc').val().trim();
            var projectId = $("#hiddenProjectId").val();
            let fd = {
                ProjectID: projectId,
                AccountNumber: accountNumber,
                Description: desc,
            };
            var isValid = AddProjectAccountValidate(fd);

            if (!isValid)
                return;

            $.ajax({
                url: _BaseURL + "/Project/CreateProjectAccount",
                type: "POST",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: async function (data) {
                    try {
                        await SyncQBSAccount();
                        $.notify.success('Success', data.Result);
                        window.location.reload();
                    }
                    catch (xhr) {
                        $.notify.error('Error', 'QBS sync failed.');
                    }
                    finally {
                        $(".loader").css("display", "none");
                    }
                }
            })
        });

        $(document).on('click', '#updateProjectAccountBalance', function () {
            UpdateProjectAccountBalance();
            $(".loader").css("display", "none");
        });

        $(document).on('click', '#updateBankAccount', function () {
            UpdateBankAccount();
            $(".loader").css("display", "none");
        });

        function UpdateProjectAccountBalance() {
            $('.editProjectAccount').each(function (e) {
                const currentIcon = $(this);
                const accountNumber = currentIcon.attr('data-accountnumber');
                if (accountNumber == null) {
                    $.notify.warning('Caution', 'No account found!');
                    return;
                }
                let formData = {
                    accountId: accountNumber
                };

                $.ajax({
                    url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                    data: formData,
                    type: 'GET',
                    dataType: 'text',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            const li = currentIcon.closest('li');
                            const span = li.find('span');
                            if (span.length) {
                                span.text(`${span.text()} ${data.Result}`);
                            }
                            currentIcon.remove();
                        }
                        else {
                            //console.log(data);
                            $.notify.error('Error', data.Errors[0]);
                        }
                    }
                });
                
            });
        }
        function UpdateBankAccount() {
            $('.bankAccount').each(function () {
                const _This = $(this);
                const accountNumber = _This.attr('data-account');

                let formData = {
                    accountId: accountNumber
                };

                $.ajax({
                    url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                    data: formData,
                    type: 'GET',
                    dataType: 'text',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            let li = _This.closest('li');
                            let span = li.find('span');
                            if (span.length) {
                                span.text(`${span.text()} ${data.Result}`);
                            }
                        }
                        else {
                            $.notify.error('Error', data.Errors[0]);
                        }
                    }
                });
            });
        }

        function AddProjectAccountValidate(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.AccountNumber === "" || fd.AccountNumber === undefined) {
                IsValid = false;
                $.notify.warning('Caution', 'Please enter Account number!');
            }
            return IsValid;

        }

        $(document).on('click', ".deleteConverRate", function () {
            var fldId = $(this).data('id');
            $.ajax({
                url: _BaseURL + "/Project/DeleteProjectConversionRate?FldId=" + fldId,
                type: "POST",
                data: { FldId: fldId },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var IsSuccess = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess == true) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        window.location.reload();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            })

        })

        var Schedulefiledata = {};
        var Schedulefiledatacount = 0;
        var ProjectId = $('#hiddenProjectNumber').val();

        $(document).on("change", "#scheduleFileUpload", function () {
            var inputFiles = $("#scheduleFileUpload")[0].files;
            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "fileupload" + Schedulefiledatacount;

                Schedulefiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" id="delSchedulefile"><i class="fa-solid fa-trash-can"></i></a></li>';

                Schedulefiledatacount++;
                /*$(this).closest('.files_selected').find('.filelist').append(html);*/
                $(this).closest('.file_drop_area').find('.filelist').append(html);

            }
            if (inputFiles.length > 0) {
                var mode = "ISF";
                FileUploadInEditProject(ProjectId, mode);
            }







        });

        $(document).on("click", "#delSchedulefile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');
            delete Schedulefiledata[fileKey];
            liElement.remove();
            $('#scheduleFileUpload').val('');
        });

        var Termsfiledata = {};
        var Termsfiledatacount = 0;

        $(document).on("change", "#TermsFileUpload", function () {

            var inputFiles = $("#TermsFileUpload")[0].files;

            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "fileupload" + Termsfiledatacount;

                Termsfiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" id="delTermsfile"><i class="fa-solid fa-trash-can"></i></a></li>';

                Termsfiledatacount++;
                /*$(this).closest('.files_selected').find('.filelist').append(html);*/
                /*$(this).closest('.TermsFiles').find('.filelist').append(html);*/
                $(".TermsFiles .filelist").append(html);
            }
            if (inputFiles.length > 0) {
                var mode = "TC";
                FileUploadInEditProject(ProjectId, mode);
            }

        });

        $(document).on("click", "#delTermsfile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');
            delete Termsfiledata[fileKey];
            liElement.remove();
            $('#TermsFileUpload').val('');
        });


        var ProjectAtcfiledata = {};
        var ProjectAtcfiledatacount = 0;

        $(document).on("change", "#ProjectAttachmentFileUpload", function () {
            var inputFiles = $("#ProjectAttachmentFileUpload")[0].files;
            isDirty = false;
            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "fileupload" + ProjectAtcfiledatacount;

                ProjectAtcfiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" class="delProjectAttchfile"><i class="fa-solid fa-trash-can"></i></a></li>';

                ProjectAtcfiledatacount++;


                $(this).closest('.project_attachments').find('.filelist').append(html);
            }
            if (inputFiles.length > 0) {
                var mode = "PF";
                FileUploadInEditProject(ProjectId, mode);
            }
        });

        $(document).on("click", ".delProjectAttchfile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');


            delete ProjectAtcfiledata[fileKey];
            liElement.remove();

            // Reset the file input field if all files are removed
            if ($(".filelist li").length === 0) {
                $('#ProjectAttachmentFileUpload').val('');
            }
        });
        function FileUploadInEditProject(ProjectId, mode) {
            var formData = new FormData();
            if (mode == "ISF") {
                for (var key in Schedulefiledata) {
                    formData.append(key, Schedulefiledata[key]);
                }
            }
            else if (mode == "PF") {
                for (var key in ProjectAtcfiledata) {
                    formData.append(key, ProjectAtcfiledata[key]);
                }
            }
            else if (mode == "TC") {
                for (var key in Termsfiledata) {
                    formData.append(key, Termsfiledata[key]);
                }
            }

            /*	if (inputFiles.length > 0) {*/
            $.ajax({
                url: _BaseURL + "/Project/UploadFileOnEditProject?ProjectId=" + ProjectId + "&mode=" + mode + "&InstalledFilesCount=" + InstalledFilesCount + "&TermsCondFilesCount=" + TermsCondFilesCount + "&ProjectFilesCount=" + ProjectFilesCount,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var success = data.IsSuccess;
                    var Title = "";
                    if (data.IsSuccess == true) {

                        $.notify.success('Success', data.Result);
                        window.setTimeout(function () {
                            window.location.reload();
                        }, 3000);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });
            /*}*/
        }

        $(document).on('click', '#shipTovendorBtn', function () {
            var ProjectId = $('#hiddenProjectId').val();
            getVendorInEditProject(ProjectId);
        });
        function getVendorInEditProject(ProjectId) {

            $.ajax({
                url: _BaseURL + "/Project/GetVendorDetailsInEditProject?ProjectId=" + ProjectId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data != null) {
                        $("#shiptoVendorlistmodal").modal('show');
                        $('#vendorListinEditProject').html('');
                        $('#vendorListinEditProject').html(data);



                        var table = $('#shipto_vendortable').DataTable({
                            orderCellsTop: true,
                            fixedHeader: true,
                            "pageLength": 50,
                            initComplete: function () {
                                var api = this.api();


                                // Clone the header row only if it's not already cloned
                                if ($('#shipto_vendortable thead tr').length === 1) {
                                    $('#shipto_vendortable thead tr').clone(true).appendTo('#order_vendortable thead');
                                }

                                // Loop through each cloned header cell and add event listener for the input fields
                                $('#shipto_vendortable thead tr:eq(1) th').each(function (i) {
                                    var title = $(this).text();


                                    if ($(this).find('input').length > 0) {
                                        $('input', this).on('keyup change clear', function () {
                                            if (api.column(i).search() !== this.value) {
                                                api.column(i)
                                                    .search(this.value)
                                                    .draw();
                                            }
                                        });
                                    }
                                    else if (i === 3) {
                                        $(this).find('.dt-column-title').removeClass('.dt-column-title');
                                    }
                                });
                                $('#Ddl_Vendor_ClftioninEditProject').on('change', function () {
                                    var clsearch = $(this).val();
                                    if (clsearch == null) clsearch = '';

                                    var srchtxt = '';
                                    var tmp = clsearch;

                                    for (var i = 0; i < tmp.length; i++) {
                                        var id = tmp[i];
                                        for (var a = 0; a < classArray.length; a++) {
                                            if (classArray[a].classification == id) {
                                                if (srchtxt == '') {
                                                    srchtxt += (classArray[a].classification);
                                                } else {
                                                    srchtxt += '|' + (classArray[a].classification);
                                                }
                                            }
                                        }
                                    }

                                    // Search in the Classification column (index 3)
                                    api.column(3).search(srchtxt, true, false).draw();
                                });

                            }
                        });

                        $(".multislct").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",

                        });


                        vendorco.forEach(function (id) {
                            $(".idVendor[data-id='" + id + "']").prop('checked', true);


                        });
                        $('.idVendor:checked').each(function () {
                            var vendorId = $(this).data('id');
                            vendorco.push(vendorId); // Add currently checked vendor IDs to vendorco
                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }
        $(document).on("click", ".idVendor", function () {

            var PId = $(this).data('id');

            if ($(this).is(":checked")) {
                if (!vendorco.includes(PId)) {
                    vendorco.push(PId);
                    $(this).prop(":checked", true)
                }
            } else {
                const index = vendorco.indexOf(PId);
                if (index > -1) {
                    vendorco.splice(index, 1);
                    $(this).prop(":checked", false)
                }
            }

        });
        classificationList();
        function classificationList() {
            $.ajax({
                url: _BaseURL + "/Project/classificationList",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var tempData = JSON.parse(data);
                    classArray = JSON.parse(data);
                    //ddlVendorClassification = /*"<select class='multislct' id='Ddl_Vendor_Clftion' multiple='multiple'>"*/
                    ddlVendorClassification = `
					<div class="multi_select">
					 <select multiple="multiple" class="multislct ms-offscreen" data-width="100%" tabindex="-1">
					<option value="" disabled>Please Select</option>
					`;
                    for (let i = 0; i < tempData.length; i++) {

                        var classification = tempData[i].classification;
                        var classificationID = tempData[i].classification_ID;

                        /*ddlVendorClassification += "<option value='" + classificationID + "'>" + classification + "</option>";*/
                        ddlVendorClassification += `
						<option value="${classificationID}">${classification}</option>`;

                    }
                    /*ddlVendorClassification += "</select>";*/
                    ddlVendorClassification += `
					</select>
					<div class="ms-parent multislct ms-parent-open" title="" style="width: 100%;">
						<button type="button" class="ms-choice">
							<span class="placeholder">Please Select</span>
							<div class="icon-close open"></div>
							<div class="icon-caret open"></div>
						</button>
						<div class="ms-drop bottom" style="display: block;">
							<div class="ms-search">
								<input type="text" autocomplete="on" autocorrect="on" autocapitalize="off" spellcheck="false" placeholder="Enter Keyword">
							</div>
							<ul style="max-height: 250px;">
								<li class="ms-select-all" tabindex="0">
									<label>
										<input type="checkbox" data-name="selectAll" tabindex="-1">
										<span>[Select all]</span>
									</label>
								</li>
								`;
                    for (let i = 0; i < tempData.length; i++) {
                        var classification = tempData[i].classification;
                        var classificationID = tempData[i].classification_ID;
                        ddlVendorClassification += `
						<li class=" " tabindex="0">
							<label class="">
								<input type="checkbox" value="${classificationID}" data-name="selectItem" tabindex="-1">
								<span>${classification}</span>
							</label>
					    </li>`;
                    }
                    ddlVendorClassification += `
									<li class="ms-no-results" style="display: none;">No matches found</li>
								</ul>
							</div>
							</div>
						 </div>`;

                    $(".loader").css("display", "none");

                },
            })
        }

        $(document).on('click', '#AddProjectcomment', function () {
            var comment = $('#newcomment').val();
            var ProjectId = $('#hiddenProjectId').val();
            if (comment != "" && comment != null && comment != undefined) {
                $.ajax({
                    url: _BaseURL + "/Project/AddProjectComment?ProjectId=" + ProjectId + "&comment=" + comment,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var success = data.IsSuccess;
                        var Title = "";
                        var IsValid = true;                       
                        if (data.IsSuccess === true) {
                            $(".loader").css("display", "none");
                            $.notify.success('Success', data.Result);
                            isDirty = false;
                            $(window).on('beforeunload', function () {
                                $(".loader").css("display", "flex");
                            });
                            window.setTimeout(function () {
                                window.location.reload();
                            }, 2000);

                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }

                    }
                })
            }
            else {
                $.notify.warning('Caution', 'Please Enter Comment!');
                return;
            }


        });

        $(document).on('click', ".deleteProjectcommetInEditP", function () {

            var ProjectId = $('#hiddenProjectId').val();
            var commentId = $(this).data('id');

            $.confirm({
                title: 'Delete?',
                message: 'Do you really want to delete?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: _BaseURL + "/Project/DeleteProjectComment?ProjectId=" + ProjectId + "&CommentId=" + commentId,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {

                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            var success = data.IsSuccess;
                            var Title = "";
                            var IsValid = true;
                            if (data.IsSuccess === true) {
                                $(".loader").css("display", "flex");
                                $.notify.success('Success', data.Result);
                                $(window).on('beforeunload', function () {
                                    $(".loader").css("display", "flex");
                                });
                                window.setTimeout(function () {
                                    window.location.reload();
                                }, 2000);

                            }
                            else {
                                $(".loader").css("display", "flex");
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    })
                },
                onCancel: function () {
                    
                }
            });

            
        });

        $(window).on('load', function () {
            $(".loader").css("display", "none");
        });

        $(document).on('click', '#UpdateProjectBtn', function () {
            POFilesToInclude();
            var ProjectId = $('#hiddenProjectId').val();
            var projectNumber = $('#txt_ProjectNumber').data('id');
            var ProjectName = $('#txt_ProjectName').val().trim();
            var legalName = $('#txt_LegalName').val().trim();
            var isBridgeSupporter = $('#bridgesupporter').is(':checked') ? "true" : "false";
            var isProjectClosed = $('#bridgeIsClosed').is(':checked') ? "true" : "false";
            var hotelAddress = $('#txt_hotelAdd').val().trim();
            var hotelCity = $('#txt_hotelCity').val().trim();
            var hotelCountry = $('#hotelCountry').val();
            var hotelState = $('#hoteState').val();
            var hotelPostalCode = $('#hotelPostalCode').val().trim();
            var ownerAddress = $('#OwnerAddress').val().trim();
            var ownerCity = $('#ownerCity').val().trim();
            var ownerCountry = $('#OwnerCountry').val();
            var ownerState = $('#OwnerState').val();
            var ownerPostalCode = $('#OwnerPostalCode').val().trim();
            var ownerMobile = $('#OwnerMobile').val().trim();
            var ownerPhoneExtension = $('#OwnerPhoneExtension').val().trim();
            var ownerFax = '';  //$('#OwnerFax').val().trim();
            var wareHouseDate = $.datepicker.formatDate("yy-mm-dd", $("#txt_WareHouseReqDate").datepicker("getDate"));
            var projectCompleteDate = $.datepicker.formatDate("yy-mm-dd", $("#txt_CompletionDate").datepicker("getDate"));
            var installDate = $.datepicker.formatDate("yy-mm-dd", $("#txt_InstallDate").datepicker("getDate"));
            var openingDate = $.datepicker.formatDate("yy-mm-dd", $("#txt_OpeningDate").datepicker("getDate"));
            var projectOwnerReporting = $('#ownerReportingRequirement').val().trim();
            var invoiceAddress = $('#invAddress').val().trim();
            var invoiceCity = $('#invCity').val().trim();
            var invoiceCountry = $('#InvoiceCountry').val();
            var invoiceState = $('#InvoiceState').val();
            var invoicePostalCode = $('#InvoicePostalCode').val().trim();
            var accountingContact = $('#AccountingContact').val().trim();
            var accountingEmail = $('#AccountingEmail').val().trim();
            var accountingTelephone = $('#AccountingTelephone').val().trim();
            var accountingPhoneExt = $('#AccountPhoneExtension').val().trim();
            var accountingFax = ''; //$('#AccountingFax').val().trim();
            var accountingFederalId = $('#accFederalID').val().trim();
            var accountingCurrCode = $('#accCurrCode').val();
            var GSTtype = $("#txt_GSTLblShw").val().trim();
            var PSTType = $('#txt_PSTLblShw').val().trim();
            var StateType = $('#txt_StateTxLblShw').val().trim();
            var GSTVal = $('#txt_GST').val();
            var PSTVal = $('#txt_PST').val();
            var StateTaxVal = $('#txt_StateTax').val();
            var PurchaseOrdercomment = $('#txt_PrchsOrdrCmmnts').val().trim();
            var isBudgetReport = $('#BudgetReport').is(':checked') ? "true" : "false";
            var isPurchaseReport = $('#PurchaseReportActive').is(':checked') ? "true" : "false";
            var isStatusReport = $('#StatusReportActive').is(':checked') ? "true" : "false";
            var isAccountReport = $('#AccountReportActive').is(':checked') ? "true" : "false";
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();




            let fd = {
                ProjectID: ProjectId,
                ProjectNumber: projectNumber,
                ProjectName: ProjectName,
                LegalName: legalName,
                InvoiceAddress: invoiceAddress,
                InvoiceCity: invoiceCity,
                InvoiceState: invoiceState,
                InvoicePostalCode: invoicePostalCode,
                InvoiceCountry: invoiceCountry,
                HotelAddress: hotelAddress,
                HotelCity: hotelCity,
                HotelState: hotelState,
                HotelPostalCode: hotelPostalCode,
                HotelCountry: hotelCountry,
                OwnerName: "",
                OwnerAddress: ownerAddress,
                OwnerCity: ownerCity,
                OwnerState: ownerState,
                OwnerPostalCode: ownerPostalCode,
                OwnerCountry: ownerCountry,
                OwnerFax: ownerFax,
                OwnerMobile: ownerMobile,
                AccountingContact: accountingContact,
                AccountingTelephone: accountingTelephone,
                AccountingFax: accountingFax,
                AccountingEmail: accountingEmail,
                GSTHST: GSTVal,
                GSTHSTTYPE: GSTtype,
                PST: PSTVal,
                PSTTYPE: PSTType,
                StateTax: StateTaxVal,
                STATETAXTYPE: StateType,
                CurrCode: accountingCurrCode,
                InstallDate: installDate,
                ProjectCompletionDate: projectCompleteDate,
                WarehouseRequiredDate: wareHouseDate,
                OpeningDate: openingDate,
                OwnerReportingRequirement: projectOwnerReporting,
                PurchaseOrderComment: PurchaseOrdercomment,
                AccountPhoneExtension: accountingPhoneExt,
                OwnerPhoneExtension: ownerPhoneExtension,
                IsClosed: isProjectClosed,
                IsSupporter: isBridgeSupporter,
                VendorIds: vendorco.join(","),
                IsBudgetReportActive: isBudgetReport,
                IsPurchaseReportActive: isPurchaseReport,
                IsStatusReportActive: isStatusReport,
                IsAccountReportActive: isAccountReport,

            };
            var isValid = ProjectUpdateValidation(fd);
            if (isValid) {
                $.ajax({
                    url: _BaseURL + "/Project/UpdateProject",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {
                        var success = data.IsSuccess;
                        var Title = "";
                        var IsValid = true;
                        if (data.IsSuccess === true) {
                            isDirty = false;
                            $.notify.success('Success', data.Result);
                            $(window).on('beforeunload', function () {
                                $(".loader").css("display", "flex");
                            });
                            window.setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                })
            }

        });
        function ProjectUpdateValidation(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.ProjectName === "" || fd.ProjectName === undefined) {
                IsValid = false;
                Title = "Please Enter Project Name";
                var inputField = $('#txt_ProjectName');
                $("#txt_ProjectName").attr("placeholder", "PLEASE ENTER FIRST NAME").trigger('focus');
                $.notify.warning('Caution', Title);
                shake(inputField);
            }
            else if (fd.AccountingEmail != "" && fd.AccountingEmail != undefined) {
                IsValid = IsEmailValid(fd.AccountingEmail);
                if (IsValid == false) {
                    Title = "You must enter a valid email format.";
                    $.notify.warning('Caution', Title);
                }
            }
            return IsValid;
        }
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
        function IsEmailValid(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;
            if (!regex.test(email)) {
                return false;
            }
            else {
                return true;
            }
        }
        function POFilesToInclude() {
            var projectId = $('#hiddenProjectId').val();
            var fileName = [];
            $('.previousfilelist li ').each(function () {
                const checkbox = $(this).find('input[type="checkbox"]');
                const anchor = $(this).find('a');
                const anchorText = anchor.text().trim();
                if (checkbox.is(':checked')) {
                    if (!projectFileToInclude.includes(anchorText)) {
                        fileName.push(anchorText);

                    }
                }
                else {

                    if (projectFileToInclude.includes(anchorText)) {
                        fileName.push(anchorText);

                    }
                }
            });
            if (fileName.length == 0) {
                return;
            }
            var fileNameToSend = fileName.join(",");
            $.ajax({
                url: "/Project/POFilestoShowUpdate",
                data: { ProjectId: projectId, FileName: fileNameToSend },
                async: false,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        }
        //on cancel button click redirection
        $(document).on('click', '#cancelbtn', function () {
            $.redirect(_BaseURL + "/Project/ProjectList");
        });

        $(document).on('click', '#btn_excRate', function () {

            var currency = $('#ddl_cnvcurrency').val();
            var convrate = $('#txt_convrate').val();

            if (currency == 0 || currency == "") {
                $.notify.warning('Caution', 'Please select Currency!');
                return;
            }
            if (convrate == "") {
                $.notify.warning('Caution', 'Please select Conversion rate!');
                return;
            }
            var pid = $("#hiddenProjectId").val();
            //ajax call

            let fd = {
                ProjectID: pid,
                CurrencyID: currency,
                ConversionRate: convrate
            }
            $.ajax({
                url: "/Project/AddConversionRate",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        isDirty = false;
                        window.setTimeout(() => {
                            window.location.reload();
                        }, 300);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });

        $(document).on('click', '#reset_btn', function () {

            $('#shipto_vendortable thead').find('input[type="text"]').val('');

            // Reset multiselect dropdown
            //$('#Ddl_Vendor_ClftioninEditProject').val([]).trigger('change'); // Clear selection and notify plugin
            $('#Ddl_Vendor_ClftioninEditProject').multipleSelect('setSelects', ['0']);
            // Clear all DataTable column searches
            var table = $('#shipto_vendortable').DataTable();
            table.columns().search('').draw();
        });

        $(document).on('click', '.redirecttopolist', function () {

            var vendorId = $(this).data('vendorid');
            var projectId = $('#hiddenProjectId').val();

            $.ajax({
                url: "/Project/GetPOfromProjectEdit",
                type: "GET",
                data: { VendorId: vendorId, ProjectId: projectId },
                dataType: "JSON",
                beforeSend: function (data) {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var poid = data.Result;
                        var poids = poid.join(",");
                        var url = "/PurchaseOrder/POList?id=" + poids;
                        window.open(url);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                },
            });

        });

        $(document).on('focus', '.commentArea', function () {
            let element = $(this);
            element.css("height", "60px");
            element.css("height", $(element).prop("scrollHeight") + "px");
        });

        $(document).on('blur', '.commentArea', function () {
            let element = $(this);
            element.css("height", "60px");

        });
    }
    // #endregion

    // #region :: Edit Project Contact
    if (action_name === 'editprojectcontact') {
        /*stateData();*/
        function stateData() {

            var countryId = $("#country").val();
            var stateId = $('#hiddenStateVal').val();
            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryId?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#state');
                        stateDropdown.empty();

                        if (countryId == null || countryId == "0" || countryId == "") {
                            stateDropdown.append('<option value="0"selected>Select a state</option>');
                        }
                        else {
                            stateDropdown.append('<option value="0">Select a state</option>');
                            $.each(data.Result, function (index, state) {
                                if (stateId == state.stateID) {
                                    stateDropdown.append(`<option value="${state.stateID}" selected>${state.state}(${state.stateCode})</option>`);
                                }

                                else {
                                    stateDropdown.append(`<option value="${state.stateID}">${state.state}(${state.stateCode})</option>`);
                                }

                            });
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }
        $(document).on("change", "#country", function () {

            var countryId = $("#country").val();

            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryId?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var stateDropdown = $('#state');
                        stateDropdown.empty();

                        stateDropdown.append('<option value=""selected>Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
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
        $(document).on("click", "#UpdateProjectContactBtn", function () {
            var projectId = $('#projectIdHidden').val();
            var projectContactId = $('#projectContactIdHidden').val();
            var contactType = $('#user_type').val();
            var contactName = $('#contactName').val().trim();
            var email = $('#contactEmail').val().trim();
            var address = $('#address').val().trim();
            var city = $('#contactCity').val().trim();
            var country = $('#country').val();
            var state = $('#state').val();
            var zipCode = $('#zipcode').val();
            var telePhone = $('#telephone').val();
            var extension = $('#extension').val();
            var phone = $('#phone').val();
            var fax = $('#fax').val();
            let fd = {
                ProjectContact_ID: projectContactId,
                ContactName: contactName,
                Address: address,
                City: city,
                State: state,
                Country: country,
                Telephone: telePhone,
                Extension: extension,
                MobilePhone: phone,
                Fax: fax,
                Email: email,
                ZIPCode: zipCode,
                ContactType_ID: contactType,
                ProjectID: projectId,
                Status: 1,



            }

            var isValid = validateUpdateProjectContact(fd);
            if (isValid) {
                $.confirm({
                    title: 'Update Project Contact?',
                    message: `Do You want to Update the project contact?`,
                    type: 'confirm',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        $.ajax({
                            url: _BaseURL + "/Project/UpdateProjectContact",
                            type: "POST",
                            data: fd,
                            dataType: "json",
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                if (data.IsSuccess == true) {
                                    $(".loader").css("display", "none");
                                    $.notify.success('Success', data.Result);
                                    setTimeout(function () {
                                        $.redirect(_BaseURL + "/Project/EditProject?ProjectId=" + projectId);
                                    }, 3000);
                                }
                                else {
                                    $(".loader").css("display", "none");
                                    $.notify.error('Error', data.ErrorMessages);
                                }
                            }
                        })

                    },
                    onCancel: function () {                        
                    }
                });
            }
        });





        function validateUpdateProjectContact(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.ContactType_ID === "0" || fd.ContactType_ID === undefined) {
                IsValid = false;
                Title = "Please select Contact type";
                $.notify.warning('Caution', Title);
            }

            else if (fd.ContactName === "" || fd.ContactName === undefined) {
                IsValid = false;
                Title = "Please enter Contact Name";
                var inputField = $('#contactName');
                $.notify.warning('Caution', Title);
                $("#contactName").attr("placeholder", "PLEASE ENTER FIRST NAME").trigger('focus');


            }



            return IsValid;

        }



    }
    // #endregion

    // #region :: Add Project Contact
    if (action_name === 'addprojectcontact') {
        let isDirty = false;

        $(document).on('change keyup', '#add_project_contact_form input, #add_project_contact_form select, #add_project_contact_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $(document).on("change", "#countryInAdd", function () {

            var countryId = $("#countryInAdd").val();

            $.ajax({
                url: _BaseURL + "/Project/getStateByCountryId?countryId=" + countryId,
                type: "GET",
                /* data: {cId:countryId},*/
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {

                        var stateDropdown = $('#state');
                        stateDropdown.empty();

                        stateDropdown.append('<option value=""selected>Select a state</option>');
                        $.each(data.Result, function (index, state) {
                            stateDropdown.append(`<option value="${state.stateID}">${state.state} (${state.stateCode})</option>`);
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
        $(document).on("click", "#AddProjectContactSave", function () {

            var projectId = $('#projectIdinPC').val();

            var contactType = $('#user_typeCreate').val();
            var contactName = $('#nameContact').val().trim();
            var email = $('#addEmail').val().trim();
            var address = $('#address').val().trim();
            var city = $('#addCity').val().trim();
            var country = $('#countryInAdd').val();
            var state = $('#state').val();
            var zipCode = $('#postalCode').val();
            var telePhone = $('#telePhone').val();
            var extension = $('#extension').val();
            var phone = $('#mobile').val();
            var fax = $('#addFax').val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            let fd = {

                ContactName: contactName,
                Address: address,
                City: city,
                State: state,
                Country: country,
                Telephone: telePhone,
                Extension: extension,
                MobilePhone: phone,
                Fax: fax,
                Email: email,
                ZIPCode: zipCode,
                ContactType_ID: contactType,
                ProjectID: projectId,
                Status: 1,
            }
            var isValid = validateAddProjectContact(fd);

            if (isValid) {
                $.confirm({
                    title: 'Add Project Contact?',
                    message: `Do you want add this project contact?`,
                    type: 'confirm',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        $.ajax({
                            url: _BaseURL + "/Project/CreateProjectContact",
                            type: "POST",
                            data: fd,
                            dataType: "json",
                            beforeSend: function (xhr) {
                                $(".loader").css("display", "flex");
                                xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                            },
                            success: function (data) {
                                var success = data.IsSuccess;
                                var Title = "";
                                var IsValid = true;
                                if (data.IsSuccess === true) {
                                    $(".loader").css("display", "none");
                                    isDirty = false;
                                    $.notify.success('Success', data.Result);
                                    window.setTimeout(function () {
                                        $.redirect(_BaseURL + "/Project/EditProject?ProjectId=" + projectId);
                                    }, 2000);
                                }
                                else {
                                    $(".loader").css("display", "none");
                                    $.notify.error('Error', data.ErrorMessages);
                                }

                            }
                        })
                    },
                    onCancel: function () {                        
                    }
                });               
            }

        });
        function EmailValidation(email) {

            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|int|group)$/;
            if (!regex.test(email)) {
                return false;
            }
            else {
                return true;
            }

        }
        function validateAddProjectContact(fd) {

            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.ContactType_ID === "0" || fd.ContactType_ID === undefined) {
                IsValid = false;
                $.notify.warning('Caution', 'You must select a Contact Type before saving the Contact');
            }

            else if (fd.ContactName === "" || fd.ContactName === undefined) {
                IsValid = false;
                var inputField = $('#nameContact');
                $.notify.warning('Caution', 'Please enter Contact Name');
                errorfunc('nameContact', 'You must enter a Contact Name before saving the Contact');
            }
            else if (fd.Email != null && fd.Email != "" && fd.Email != undefined) {
                IsValid = EmailValidation(fd.Email);
                if (!IsValid) {
                    $.notify.warning('Caution', 'Please Enter Valid Email Format');
                }

            }
            return IsValid;

        }
    }
    // #endregion

    // #region :: Project Team
    if (action_name === 'projectteam') {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;
        var ProjectId = $("#projectid").val();
        _getAllProjectMemberlist();
        function _getAllProjectMemberlist() {
            $.ajax({
                url: "/Project/GetProjectTeamMemberList",
                data: { ProjectId: ProjectId },
                type: "GET",
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#partialTeamMemberBind').html('');
                        $('#partialTeamMemberBind').html(data);
                        ProjectTeamMemberDataTableBind();
                        $("#lblPoApp span").text($("#poApproverCount").val());
                        $("#BgtApprvrs span").text($("#budgetApproverCount").val());
                        $("#prevBgtApprvrs").text($("#budgetApproverCount").val());
                        $("#lblFabApp span").text($("#poItemApproverCount").val());

                        $('#teamMemberTable thead tr').find('th:eq(5)').html('Budget(' + $('#BgtApprvrs span').text() + '/' + $('#RqrdBgtApprvrs_ddl option:selected').val() + ')');

                        set_approval_color();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });

        }

        function ProjectTeamMemberDataTableBind() {
            $('#teamMemberTable').dataTable({
                pageLength: pageLength,
                "orderCellsTop": false,
                "order": [],
                "columnDefs": [
                    { "orderable": false, "targets": [4, 5, 6] }
                ]
            });

            $('#teamMemberTable').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }
        function set_approval_color() {
            if (parseInt($('#lblPoApp span').text()) <= 0) {
                $('#lblPoApp').parent().parent().css('background', '#e7c3c3');
            }
            else {
                $('#lblPoApp').parent().parent().css('background', 'none');
            }

            if (parseInt($('#RqrdBgtApprvrs_ddl').val()) > parseInt($('#BgtApprvrs span').text())) {
                $('#BgtApprvrs').parent().parent().css('background', '#e7c3c3');
            }
            else {
                $('#BgtApprvrs').parent().parent().css('background', 'none');
            }

            if (parseInt($('#lblFabApp span').text()) <= 0) {
                $('#lblFabApp').parent().parent().css('background', '#e7c3c3');
            }
            else {
                $('#lblFabApp').parent().parent().css('background', 'none');
            }
        }

        $(document).on("change", "#manager_ddl", function () {
            var ManagerId = $(this).val();
            /*if (ManagerId != null && ManagerId !== "0" && ManagerId != undefined) {*/

            $.ajax({
                url: '/Project/ChangeManager',
                type: 'POST',
                data: { ProjectId: ProjectId, ManagerId: ManagerId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        _getAllProjectMemberlist();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }


                }
            });
            /*}*/
            //else {
            //	return;
            //}

        });

        $(document).on("change", "#RqrdBgtApprvrs_ddl", function () {
            var BudgetApproverNumber = $(this).val();

            $.ajax({
                url: '/Project/ChangeBudgetApprovernumber',
                type: 'POST',
                data: { ProjectId: ProjectId, BudgetApproverNumber: BudgetApproverNumber },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        $('#teamMemberTable thead tr').find('th:eq(5)').html('Budget(' + $('#BgtApprvrs span').text() + '/' + BudgetApproverNumber + ')');
                        set_approval_color();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                        var prevBgtApprvrs = $("#prevBgtApprvrs");
                        $(obj).val(prevBgtApprvrs);
                    }


                }
            });

        });

        $(document).on("click", "#redirectProjectEdit", function () {
            window.location = "/Project/EditProject?ProjectId=" + ProjectId;
        });

        $(document).on("click", "#openPermissionEditModel", function () {
            var TeamMemberId = $(this).data('teammemberid');
            var UserTypeName = $(this).closest('tr').find('td:nth-child(4)').text().trim();

            $.ajax({
                url: "/Project/GetTeamMemberPermission",
                data: { TeamMemberId: TeamMemberId, UserTypeName: UserTypeName },
                type: "GET",
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#partialEditPermission').html('');
                        $('#partialEditPermission').html(data);
                        $(".loader").css("display", "none");
                        $('.headerCheckbox').each(function () {
                            const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
                            const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                            $(this).prop("checked", allChecked);
                        });
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
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

        });

        $(document).on("click", ".headerCheckbox", function (e) {


            const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');


            const isChecked = $(this).prop('checked');
            $(relatedOptions).prop("checked", isChecked);

        });

        $(document).on("click", "#poApproval", function () {
            var ProjectUserId = $(this).data('userid');
            var flag = $(this).data('isapproved');


            $.ajax({
                url: '/Project/AddDeletePOApprovers',
                type: 'GET',
                data: { ProjectId: ProjectId, ProjectUserId: ProjectUserId, flag: flag },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        _getAllProjectMemberlist();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });

        });

        $(document).on("click", "#budgetApprover", function () {
            var ProjectUserId = $(this).data('userid');
            var flag = $(this).data('isbudget');


            $.ajax({
                url: '/Project/AddDeleteBudgetApprovers',
                type: 'GET',
                data: { ProjectId: ProjectId, ProjectUserId: ProjectUserId, flag: flag },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        _getAllProjectMemberlist();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });

        });

        $(document).on("click", "#poItemApprover", function () {
            var ProjectUserId = $(this).data('userid');
            var flag = $(this).data('ispoitem');


            $.ajax({
                url: '/Project/AddDeletePOLineItemApprover',
                type: 'GET',
                data: { ProjectId: ProjectId, ProjectUserId: ProjectUserId, flag: flag },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        _getAllProjectMemberlist();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });

        });

        $(document).on("click", ".deleteProjectMember", function () {
            var ProjectUserId = $(this).data('teammemberid');

            $.confirm({
                title: 'Delete Project Team Member?',
                message: 'Do you want to delete project team member',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    deleteProjectMember(ProjectUserId);
                },
                onCancel: function () {
                  
                }
            });           
        });

        function deleteProjectMember(ProjectUserId) {


            $.ajax({
                url: '/Project/DeleteProjectTeammembers',
                type: 'GET',
                data: { ProjectId: ProjectId, ProjectUserId: ProjectUserId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {                       
                        $.notify.success('Success', data.Result);                       
                        window.setTimeout(function () {
                            $(".loader").css("display", "none");
                            window.location.reload();
                        }, 4000);
                        
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }

        $(document).on('click', '#editProjectMemberPer', function () {
            var projectUserType = $('#userTypeId option:selected').val();
            var FldId = $(this).data('teammemberid');
            var priorities = "";

            priorities = $('.project_check:checked').map(function () {
                return $(this).attr('data-sysid');
            }).get().join(',');
            let fd = {
                Fldid: FldId,
                UsertypeID: projectUserType,
                priorities_on_list: priorities,
            };
            $.ajax({
                url: _BaseURL + "/Project/ProjectTeamUpdate",
                type: "POST",
                data: fd,
                dataType: "json",
                success: function (data) {
                    $('#project_editUser').modal('hide');
                    var IsSuccess = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;

                    if (data.IsSuccess == true) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        _getAllProjectMemberlist();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            })


        });
        $("#userListProject").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
            single: true,

        });
        $(document).on("change", "#SystemUserType", function () {

            var UserType = $("#SystemUserType").val();
            var ProjectUserType = $("#ProjectUserType").val();
            var teamMember = [];
            $('#ProjectUserType').val(UserType);
            $('.teamMember').each(function () {

                teamMember.push($(this).data('userid'));
            });
            if (UserType == "0" || UserType == "" || UserType == undefined) {
                $("#permissionList").addClass('d-none');
            }

            $.ajax({
                url: _BaseURL + "/Project/ProjectUserList?UserTypeId=" + UserType,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {

                    if (data.IsSuccess) {
                        var userList = data.Result;
                        var projectManagerId = $('#manager_ddl').val();

                        $(".loader").css("display", "none");

                        $("#userListProject").empty();


                        $("#userListProject").append('<option value="0" selected>---Select User---</option>');


                        for (var i = 0; i < userList.length; i++) {
                            var user = userList[i];
                            //if (teamMember[i] == user.fldID) {
                            //	continue;
                            //}
                            if (teamMember.includes(user.fldID)) {
                                continue;
                            }
                            if (projectManagerId == user.fldID) {
                                continue;
                            }
                            let optionText = "";
                            if (UserType == "7") {
                                optionText = user.lastname;
                            }
                            else {
                                optionText = user.lastname + ', ' + user.firstname + ' (' + user.email + ')';
                            }
                            /*$("#userListProject").append('<option value="' + user.fldID + '">' + user.lastname, user.firstname + (user.email) + '</option>');*/
                            $("#userListProject").append('<option value="' + user.fldID + '">' + optionText + '</option>');
                        }
                        //we need to destroy the multipleselect old instance in order to initialize it again
                        $('#userListProject').multipleSelect('destroy');
                        $("#userListProject").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            single: true,

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

        $(document).on("change", "#userListProject", function (event) {

            event.preventDefault();
            //var FldId = $('#userListProject').multipleSelect('getSelects');
            var FldId = $('#userListProject option:selected').val();
            if (FldId == undefined || FldId == null) {
                $('#userListProject').multipleSelect('setSelects', ['0']);
                return;
            }
            if (FldId == "0") {
                $("#permissionList").addClass('d-none');
                $('#memberAddPermissionList').html('');
                return;
            }
            $.ajax({
                url: _BaseURL + "/Project/PermissionUserList?FldId=" + FldId,
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $("#permissionList").removeClass('d-none');
                        $("#permissionList").addClass('d-flex');
                        $('#memberAddPermissionList').html('');
                        $('#memberAddPermissionList').html(data);
                        $(".loader").css("display", "none");
                        //$(document).on("click", ".systemoption", function () {
                        //	$('.headerCheckbox').each(function () {
                        //		const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
                        //		const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                        //		$(this).prop("checked", allChecked);
                        //	});

                        //})
                        $('.headerCheckbox').each(function () {
                            const relatedOptions = $(this).closest('.check_wrp').find('.systemoption');
                            const allChecked = relatedOptions.length === relatedOptions.filter(':checked').length;
                            $(this).prop("checked", allChecked);
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
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            })

        });
        $(document).on("click", "#AddMemberBtn", function () {
            var SystemUserType = $('#SystemUserType').val();
            var projectId = $('#projectid').val();
            var UserId = $('#userListProject').multipleSelect('getSelects');
            var ProjectRoleId = $("#ProjectUserType").val();
            var priorityList = "";

            priorityList = $('.project_check:checked').map(function () {
                return $(this).attr('data-sysid');
            }).get().join(',');
            let fd = {
                SystemUserType: SystemUserType,
                ProjectId: projectId,
                UserId: UserId,
                ProjectUsertype: ProjectRoleId,
                priorities_on_list: priorityList,

            };
            var isValid = AddProjectTeamMemberValidation(fd);
            if (isValid) {
                $.ajax({
                    url: _BaseURL + "/Project/AddProjectMemberFromUserlist",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var success = data.IsSuccess;
                        var Title = "";
                        var IsValid = true;
                        if (data.IsSuccess) {                           
                            $.notify.success('Success', data.Result);
                            AddPOApprovalLevelForTeam();
                            window.setTimeout(function () {                               
                                window.location.reload();
                            }, 3000);
                            
                            //window.location.reload();

                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }

                    }

                })
            }

        });
        function AddPOApprovalLevelForTeam() {
            var projectId = $('#projectid').val();
            $.ajax({
                url: "/Project/AddPOApprovalLevelForMemberinAddMember",
                data: { ProjectId: projectId },
                type: "POST",
                dataType: "json",               
                success: function (data) {                    
                    var success = data.IsSuccess;
                    var Title = "";
                    var IsValid = true;
                    if (!data.IsSuccess) {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    
                }
            });
        }
        function AddProjectTeamMemberValidation(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.SystemUserType === "0" || fd.SystemUserType === undefined) {
                IsValid = false;
                $.notify.warning('Caution', 'Please select System User!');
            }

            else if (fd.UserId == "0" || fd.UserId == undefined || fd.UserId == "") {
                IsValid = false;
                $.notify.warning('Caution', 'Please select user!');
            }
            else if (fd.ProjectUsertype === "0" || fd.ProjectUsertype === undefined || fd.ProjectUsertype === null) {
                IsValid = false;
                $.notify.warning('Caution', 'Please select User Type!');
            }
            return IsValid;
        }

        //*****************************************  START OF PURCHASED ORDER APPROVAL GROUP  SCRIPT  ***************************************************************//

        $(document).on("click", "#poApprovalLevelSet", function () {
            //Check Any Po Approval team member exists
            CheckPoApprovalTeamMember();
        })

        function CheckPoApprovalTeamMember() {
            $.ajax({
                url: "/Project/CheckPoApprovalTeamExistsByProjectId",
                data: { ProjectId: ProjectId },
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $("#po_appro_lavel").modal("show");
                        poApprovalLevelSet();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        function poApprovalLevelSet() {
            $.ajax({
                url: "/Project/PoApprovalLevelSet",
                data: { ProjectId: ProjectId },
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#POModelBody').html('');
                        $('#POModelBody').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            });
        }

        $(document).on("click", ".po_chkap", function () {

            var levelId = $(this).data('levelid');
            var projectUserId = $(this).data('userid');

            var flag = $(this).is(':checked') ? '1' : '0';

            var checkbox = $(this);

            $.ajax({
                url: '/Project/POEditUserLevel',
                type: 'GET',
                data: { LevelId: levelId, ProjectUserId: projectUserId, flag: flag, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        poApprovalLevelSet();
                    }
                    else {
                        $(".loader").css("display", "none");
                        checkbox.prop('checked', false);
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });

        });

        $(document).on("change", ".po_changenumberstoapprovepo", function () {

            var levelId = $(this).data('levelid');
            var number = $(this).val();

            $.ajax({
                url: '/Project/ChangePOApprovernumber',
                type: 'GET',
                data: { LevelId: levelId, number: number, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        poApprovalLevelSet();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                        poApprovalLevelSet();
                    }

                }
            });

        });

        $(document).on("click", ".po_deleteApproverLevel", function () {

            var levelId = $(this).data('levelid');
            $.confirm({
                title: '',
                message: 'Do you want to delete po approval level?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    DeletePOApprovalLevel(levelId);
                },
                onCancel: function () {

                }
            });           
        });

        function DeletePOApprovalLevel(levelId) {
            $.ajax({
                url: '/Project/PODeleteLevel',
                type: 'GET',
                data: { LevelId: levelId, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        poApprovalLevelSet();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }

        $(document).on("click", "#po_addnewlevel", function () {

            $.confirm({
                title: '',
                message: `Do you want add new PO level?`,
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    AddNewPOLevel();
                },
                onCancel: function () {
                    
                }
            });          
        });

        function AddNewPOLevel() {
            $.ajax({
                url: '/Project/AddNewPOLevel',
                type: 'GET',
                data: { ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        poApprovalLevelSet();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        //*****************************************  END OF PURCHASED ORDER APPROVAL GROUP  SCRIPT  ***************************************************************//

        //*****************************************  START OF FABRICATION APPROVAL GROUP  SCRIPT  ***************************************************************//

        $(document).on("click", "#fabricationapprovallevelset", function () {

            fabricationapprovallevelset();
        })

        function fabricationapprovallevelset() {
            $.ajax({
                url: "/Project/FabApprovalLevelSet",
                data: { ProjectId: ProjectId },
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#fabModelBody').html('');
                        $('#fabModelBody').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }

        $(document).on("click", ".fab_chkap", function () {

            var levelId = $(this).data('levelid');
            var projectUserId = $(this).data('userid');

            var flag = $(this).is(':checked') ? '1' : '0';

            var checkbox = $(this);

            $.ajax({
                url: '/Project/FabEditUserLevel',
                type: 'GET',
                data: { LevelId: levelId, ProjectUserId: projectUserId, flag: flag, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationapprovallevelset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        checkbox.prop('checked', false);
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });

        });

        $(document).on("change", ".fab_changenumberstoapprovepo", function () {

            var levelId = $(this).data('levelid');
            var number = $(this).val();

            $.ajax({
                url: '/Project/ChangeFABApprovernumber',
                type: 'GET',
                data: { LevelId: levelId, number: number, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationapprovallevelset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                        fabricationapprovallevelset();
                    }

                }
            });

        });

        $(document).on("click", ".fab_deleteApproverLevel", function () {

            var levelId = $(this).data('levelid');

            $.confirm({
                title: '',
                message: 'Do you want to delete approval level?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    DeleteFabApprovalLevel(levelId);
                },
                onCancel: function () {
                    
                }
            });
        });

        function DeleteFabApprovalLevel(levelId) {
            $.ajax({
                url: '/Project/FABDeleteLevel',
                type: 'GET',
                data: { LevelId: levelId, ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationapprovallevelset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }

        $(document).on("click", "#fab_addnewlevel", function () {

            $.confirm({
                title: '',
                message: `Are you sure you want to add a new level approvers?`,
                type: 'confirm',
                confirmText: 'Ok',
                cancelText: 'Cancel',
                onConfirm: function () {
                    AddNewFabricationLevel();
                },
                onCancel: function () {
                }
            });          
        });

        function AddNewFabricationLevel() {
            $.ajax({
                url: '/Project/AddNewfabricationLevel',
                type: 'GET',
                data: { ProjectId: ProjectId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationapprovallevelset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }


        $(document).on("click", "#saveFabGroup", function () {

            var fabGroupList = [];
            var groupNames = []; // Array to track names for duplication check
            var duplicateFound = false; // Flag for duplicate check

            $(".fabgrp_name").each(function () {
                var value = $(this).val();
                var levelId = $(this).data("levelid");

                if (groupNames.includes(value)) {
                    duplicateFound = true;
                    $.notify.warning('Caution', "The group name '" + value + "' already exists!");                   
                    return false;
                }

                groupNames.push(value);

                var fabGroupItem = {
                    Name: value,
                    LevelId: levelId
                };

                fabGroupList.push(fabGroupItem);
            });

            if (duplicateFound) {
                return false;
            }

            $.ajax({
                url: '/Project/UpdateFabApprovalGroupname',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(fabGroupList),
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    data = JSON.parse(data);

                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationapprovallevelset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });

        });



        //*****************************************  END OF FABRICATION APPROVAL GROUP SCRIPT  ***************************************************************//

        //*****************************************  START OF FABRICATION APPROVAL PATH SCRIPT  ***************************************************************//
        $(document).on("click", "#fabricationPathSet", function () {
            fabricationpathset();
        });

        function fabricationpathset() {
            $.ajax({
                url: "/Project/FabPath",
                data: { ProjectId: ProjectId },
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#fabPathModelBody').html('');
                        $('#fabPathModelBody').html(data);
                        $('#fabsave').addClass('d-none');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }

        $(document.body).on('click', '#btnAdd', function () { //Add on Selected List
            $('#selectFrom option:selected').each(function () {
                $('#selectTo').append('<option  data-levelid="' + $(this).attr("data-levelid") + '" value="' + $(this).val() + '" style="cursor:pointer" class="demogrpname">' + $(this).text() + '</option>');
            });
        });

        $(document.body).on('click', '#btnRemove', function () { //Remove on Selected List

            $('#selectTo option:selected').each(function () {
                $(this).remove();
            });
        });

        $(document.body).on('click', '#btnUp', function () { //Up on Selected List

            $('#selectTo option:selected').each(function () {
                var newPos = $('#selectTo option').index(this) - 1;
                if (newPos > -1) {
                    $('#selectTo option').eq(newPos).before('<option  data-levelid="' + $(this).attr("data-levelid") + '" value="' + $(this).val() + '" selected="selected" style="cursor:pointer" class="demogrpname">' + $(this).text() + '</option>');
                    $(this).remove();
                }
            });
        });
        $(document.body).on('click', '#btnDown', function () { //Down on Selected List

            var countOptions = $('#selectTo option').size();
            $('#selectTo option:selected').each(function () {
                var newPos = $('#selectTo option').index(this) + 1;
                if (newPos < countOptions) {
                    $('#selectTo option').eq(newPos).after('<option  data-levelid="' + $(this).attr("data-levelid") + '" value="' + $(this).val() + '" selected="selected" style="cursor:pointer" class="demogrpname">' + $(this).text() + '</option>');
                    $(this).remove();
                }
            });
        });

        $(document).on('click', '#newfabapprovalpath', function () {

            const $icon = $('#newfabapprovalpath i');
            const isAdding = $icon.hasClass('fa-plus-square');

            $('#apppath, #fabsave').toggleClass('d-none', !isAdding);
            $('#fabapprovalpathname')
                .prop('disabled', !isAdding)
                .val('');

            $icon.toggleClass('fa-plus-square fa-minus-square');

            $('#fabpathid').val('');
            $('#selectTo').html('');

        });

        //$(document).on('click', '#closeapppatharea', function () {
        //    $("#apppath").addClass('d-none');
        //    $("#fabsave").addClass('d-none');
        //});

        $(document).on('click', '#fabsave', function () {
            var fabnameID = '';
            var flag = false;
            var fabapprovalpathname = $('#fabapprovalpathname').val().trim();
            var ApprovalPathID = $('#fabpathid').val();
            var pathnameval = $('#selectTo option').toArray().map(item => item.value);

            if (fabapprovalpathname == "" || fabapprovalpathname == null) {
                $.notify.warning('Caution', 'Please Enter Fabrication Path Name');
                return;
            }

            //var check = duplicatedgroupCheck('.demogrpname');

            //if (check === false) {
            //	return;
            //}

            if (pathnameval == "" || pathnameval == null) {
                $.notify.warning('Caution', 'Please Assign Group');
                return;
            }

            var fabSelectedGroupList = [];
            var groupNames = [];
            var duplicateFound = false;
            var Ordering = 1;

            $("#selectTo option").each(function () {
                var GrpNameID = $(this).val();
                var GrpName = $(this).text().trim();
                var LevelID = $(this).data("levelid");


                if (groupNames.includes(GrpName)) {
                    duplicateFound = true;
                    $.notify.warning('Caution', "The group name '" + GrpName + "' already exists!");
                    return false;
                }

                groupNames.push(GrpName);

                var fabSelectGroupItem = {
                    GrpNameID: GrpNameID,
                    LevelID: LevelID,
                    Ordering: Ordering++
                };

                fabSelectedGroupList.push(fabSelectGroupItem);
            });

            if (duplicateFound) {
                return false;
            }

            var fd = {
                FabPathId: ApprovalPathID,
                ProjectId: ProjectId,
                FabPathName: fabapprovalpathname,
                SeletedGroupList: fabSelectedGroupList
            }



            $.ajax({
                url: "/Project/AddFabApprovalPath",
                data: fd,
                type: "POST",
                //contentType: 'application/json',
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationpathset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            })

        });



        //var duplicatedgroupCheck = function (elem) { //Check Validation for same grp name assign
        //	var dataTable = typeof elem === "object" & $(elem).is("option") ? $(elem) : $(".demogrpname");

        //	var valid = true;

        //	$.each(dataTable, function (index1, item1) {

        //		$.each(dataTable.not(this), function (index2, item2) {

        //			if ($(item1).text() == $(item2).text()) {
        //				//$(item1).css("border-color", "red");
        //				notify(false, 'With ' + $(item1).text() + ' name already exists', true);
        //				valid = false;
        //			}

        //		});
        //	});

        //	return valid;

        //}

        $(document).on('click', '.editFabApprovalPath', function () {

            //$('#selectTo').html('');

            var $selectedGrpDropdown = $('#selectTo');

            var pathId = $(this).data("id");

            $.ajax({
                url: "/Project/FabPathDetailsById",
                data: { ProjectId: ProjectId, PathId: pathId },
                type: "GET",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#apppath").removeClass('d-none');
                        $("#fabsave").removeClass('d-none');
                        $("#fabapprovalpathname").val('');
                        $("#fabpathid").val(pathId);
                        $selectedGrpDropdown.empty();
                        $.each(data.Result, function (index, state) {
                            $selectedGrpDropdown.append(`<option data-levelid="${state.levelID}" value="${state.grpnameID}" style="cursor:pointer" class="demogrpname">${state.groupName}</option>`);
                        });

                        $("#fabapprovalpathname").val(data.Result[0].approvalPathName);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on("click", ".deleteFabApprovalPath", function () {
            var FabPathId = $(this).data('id');

            $.confirm({
                title: '',
                message: 'Do you want to delete Fabrication Path',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    deleteFabApprovalPath(FabPathId);
                },
                onCancel: function () {
                    
                }
            });           
        });

        function deleteFabApprovalPath(FabPathId) {


            $.ajax({
                url: '/Project/DeleteFabApprovalPath',
                type: 'GET',
                data: { ProjectId: ProjectId, FabPathId: FabPathId },
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        fabricationpathset();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        }

        //*****************************************  END OF FABRICATION APPROVAL PATH SCRIPT  ***************************************************************//
    }
    // #endregion
});