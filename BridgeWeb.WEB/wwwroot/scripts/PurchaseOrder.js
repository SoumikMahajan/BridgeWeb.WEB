$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const _QueryParameter = window.location.pathname.split('/');
    const _ActionName = _QueryParameter[2].toLocaleLowerCase();

    //Approval
    let selectedPoIds = new Array();
    let selectedPoNumber = new Array();

    //Email
    let selectedPoIdsVendor = new Array();
    let selectedEMailVendor = new Array();

    //Download
    let selectedPoidsAtt = new Array();
    let selectedPoNumberAtt = new Array();
    let selectedLineItemId = null;
    // #region :: Create Purchase Order
    if (_ActionName === 'createpurchaseorder') {
        let isDirty = false;
              

        $(document).on('change keyup', '#purchaseOredrForm input, #purchaseOredrForm select, #purchaseOredrForm textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        const UserPreferProjectId = parseInt(window._UserPreferences["Dropdown.ProjectId"]) || '0';
        var copyIdExistsOrnOt = $('#iscopypo').val();
        const preference = [];


        $('#project_DD_Id').multipleSelect({
            filter: true,
            showClear: true,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true
        });

        if (copyIdExistsOrnOt == "0" && UserPreferProjectId != "0") {
            $('#project_DD_Id').multipleSelect('setSelects', [UserPreferProjectId]);
            let projectName = $('#project_DD_Id option:selected').data('name');
            let legalName = $('#project_DD_Id option:selected').data('legalname');
            $('#ShipTo').val(projectName);
            $('#InvoiceTo').val(legalName);
        }

        $('#vendor_DD_Id').multipleSelect({
            filter: true,
            showClear: true,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true
        });

        $('#vendorCO_DD_Id').multipleSelect({
            filter: true,
            showClear: true,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true
        });

        $('.datepicker').datepickercustom({
            changeMonth: true,
            changeYear: true,
            minDate: 0
        });

        //if ($('#iscopypo').val() == "1") {
        //}
        let ProjectId = $('#project_DD_Id option:selected').attr('data-id');

        Load_Vendor_CO_DD_List(ProjectId);
        GetPOApprovers(ProjectId);

        let vendotId = $('#vendor_DD_Id').val();   
        Load_Buyer_With_Default(vendotId);       

        $(document).on('change', '#project_DD_Id', async function () {

            let ProjectId = $('#project_DD_Id option:selected').attr('data-id');

            if (!ProjectId) {
                ResetForm();
                return;
            }

            preference.push({
                PreferenceKey: 'Dropdown.ProjectId',
                PreferenceValue: ProjectId.toString()
            });

            SetProjectPreference(preference);
            $.ajax({
                url: '/PurchaseOrder/GetProjectApproversById',
                data: { ProjectId: ProjectId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess == true) {
                        $('.loader').css('display', 'none');
                        const { approvers, requiredApprovers } = data.Result;
                        if (approvers > 0 && approvers != '') {
                            Load_Vendor_CO_DD_List(ProjectId);
                            Load_ShipTo_And_InvoiceTo(ProjectId);
                            const selectedValues = $('#project_DD_Id').multipleSelect('getSelects');
                            if (selectedValues.length === 0) {
                                $('#project_DD_Id').multipleSelect('setSelects', ['0']);
                            }
                            let projectName = $('#project_DD_Id option:selected').data('name');
                            let legalName = $('#project_DD_Id option:selected').data('legalname');
                            $('#ShipTo').val(projectName);
                            $('#InvoiceTo').val(legalName);
                        }
                        else {
                            notify(false, "Can not create purchase order enough approvers", false);

                            ResetForm();
                        }
                    }
                    else {
                        $('.loader').css('display', 'none');
                        ResetForm();
                    }
                }
            })
        });

        $(document).on('change', '#vendor_DD_Id', function () {
            const selectedValues = $('#vendor_DD_Id').multipleSelect('getSelects');
            if (selectedValues.length === 0) {
                $('#vendor_DD_Id').multipleSelect('setSelects', ['0']);
            }

            let vendotId = $(this).val();
            const selectedOption = $(this).find('option:selected');
            const currCode = selectedOption.data('currcode');

            //Load_Buyer_With_Default(vendotId);
            $('#currency').val('');
            $('#currency').val(currCode);
            Update_Vendor_Label(vendotId);
        });

        $(document).on('change', '#vendorCO_DD_Id', function () {
            const selectedValues = $('#vendorCO_DD_Id').multipleSelect('getSelects');
            if (selectedValues.length === 0) {
                $('#vendorCO_DD_Id').multipleSelect('setSelects', ['0']);
            }
            let vendorId = $('#vendorCO_DD_Id').val();
            if (vendorId == 0) {
                $('#addressTXT').val('');
            }

            let projectId = $('#project_DD_Id option:selected').attr('data-id');

            let formData = {
                ProjectId: projectId,
                VendorId: vendorId
            }

            $.ajax({
                url: "/PurchaseOrder/GetAllAddressListWithDefault",
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    debugger;
                    $(".loader").css("display", "none");
                    if (data.IsSuccess == true) {
                        let result = data.Result;
                        $.each(result, function (i, value) {
                            if (value.isDefault == '1') {
                                $('#addressTXT').val('');
                                $('#addressTXT').val(value.address);
                            }
                        });
                    }
                }
            });
        });

        $(document).on('click', '#loadAddressListModal', function () {
            debugger;
            let vendorId = $('#vendorCO_DD_Id').val();
            let projectId = $('#project_DD_Id option:selected').attr('data-id');
            //if (vendorId == 0 || vendorId == null || projectId == 0 || projectId == null) {
            //    let html = 'Please select Project.';
            //    html += 'Please select Vendor(C/O). Then try.';
            //$('#loadAddList').html('');
            //$('#loadAddList').html(html);
            //$('#edit_addrs').modal('show');
            //return;
            //}

            let formData = {
                ProjectId: projectId,
                VendorId: vendorId
            }

            $.ajax({
                url: "/PurchaseOrder/GetAllAddressListWithDefault",
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none')
                    if (data.IsSuccess) {
                        var result = data.Result;
                        let html = '';
                        $.each(result, function (i, value) {
                            html += `<div class='select_address'>
                                    <label for=''>${value.tabHeader}</label>
                                    <p class='addressUpdate' id='addressUpdate_${i}'>${value.address}</p>
                                </div>`;
                        });
                        $('#loadAddList').html('');
                        $('#loadAddList').html(html);
                        $('#edit_addrs').modal('show');
                    }
                }
            });
        });

        $(document).on('click', '.addressUpdate', function (e) {
            let elementId = e.target.id;
            let text = $('#' + elementId).text();
            $('#addressTXT').val('');
            $('#addressTXT').val(text);
            $('#edit_addrs').modal('hide');
        });

        $(document).on('click', '#createPoBtn', function () {

            $('#purchaseOredrForm')
                .find(':disabled')
                .each(function () {
                    $(this).data('wasDisabled', true).prop('disabled', false);
                });

            const data = $('#purchaseOredrForm').serializeArray();

            $('#purchaseOredrForm')
                .find(':input')
                .each(function () {
                    if ($(this).data('wasDisabled')) {
                        $(this).prop('disabled', true).removeData('wasDisabled');
                    }
                });

            const dataObject = data.reduce((obj, field) => {
                obj[field.name] = field.value;
                return obj;
            }, {});

            if (dataObject.Project == 0 || dataObject.Project == null || dataObject.Project == undefined) {
                notify(false, 'Please Select Project!', false);
                return;
            }
            if (dataObject.Vendor == 0 || dataObject.Vendor == null || dataObject.Vendor == undefined) {
                notify(false, 'Please Select Vendor!', false);
                return;
            }
            if (dataObject.Buyer == 0 || dataObject.Buyer == null || dataObject.Buyer == undefined) {
                notify(false, 'Please Select Buyer!', false);
                return;
            }
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            $.ajax({
                url: "/PurchaseOrder/SavePurchaseOrder",
                data: dataObject,
                type: 'POST',
                dataType: 'json',
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        isDirty = false;
                        let Status = data.Result.split('-')[0];
                        let PurchaseOrderId = data.Result.split('-')[1];
                        if (Status == "Success") {

                            notify(true, "PO created Successfully", true);
                            let location = _BaseURL + '/PurchaseOrder/POEdit?POId=' + PurchaseOrderId;
                            window.location.href = location;

                        }
                        else {
                            //console.log(result);
                            notify(false, "Something going wrong", false);
                        }
                    }
                    else {
                        notify(false, "Something going wrong", false);
                    }
                    //console.log(result);                    
                }
            });            
        });
        function Load_Buyer_With_Default(vendotId) {

            //    if (vendotId == 0 || vendotId == undefined) {
            //        $('#buyer').empty();
            //$('#buyer').append(`<option value='0'>--Select Buyer--</option>`);

            //        return;
            //  };


            vendotId = (vendotId == undefined || vendotId == null) ?
                0 : $('#iscopypo').val() == "1" ?
                    vendotId : 0;

            const data = {
                VendorId: vendotId
            };

            $.ajax({
                url: "/PurchaseOrder/GetAllBuyerWithDefault",
                data: data,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        let result = data.Result;
                        if ($('#iscopypo').val() == "0") {
                            $.each(result, function (i, value) {
                                $('#buyer').append(`<option value='${value.buyerId}' ${value.isDefaultBuyer}>${value.buyerName}</option>`);
                            });
                        }
                        else {
                            var buyerId = $('#buyerhidden').val();
                            $.each(result, function (i, value) {
                                $('#buyer').append(`<option value='${value.buyerId}'  ${value.isDefaultBuyer}${buyerId == value.buyerId ? 'selected' : ''}>${value.buyerName}</option>`);
                            });
                        }
                    }
                }
            })            
        }
        function Update_Vendor_Label(vendotId) {
            $('#vendorLabelWithLinq').html('');
            let labelHtml = '';
            if (vendotId == 0 || vendotId == undefined || vendotId == null) {
                labelHtml += `
                    <label for='' class='form-label'>
                        Vendor <span class='req me-auto'>*</span>
                        <a href='/Vendors/ContactList' class='edtvndr'>
                            <i class='fa-regular fa-pen-to-square'></i>
                        </a>
                    </label>
                `;
            }
            else {
                labelHtml += `
                    <label for='' class='form-label'>
                        Vendor <span class='req me-auto'>*</span>
                        <a href='${_BaseURL}/Vendors/EditVendorContact?vendorId=${vendotId}' target='_blank'class='edtvndr'>
                            <i class='fa-regular fa-pen-to-square'></i>
                        </a>
                    </label>
                `;
            }
            $('#vendorLabelWithLinq').html(labelHtml);
        }
        function Load_Vendor_CO_DD_List(ProjectId) {
            if (ProjectId == 0 || ProjectId == undefined) {
                $('#vendorCO_DD_Id option:selected').remove();
                $('#vendorCO_DD_Id').empty();
                $('#vendorCO_DD_Id').multipleSelect('refresh');
                return;
            }

            $.ajax({
                url: "/PurchaseOrder/GetAllVendorForPurchaseOrderByProjectId",
                data: { ProjectId: ProjectId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        let result = data.Result;
                        $('#vendorCO_DD_Id option:selected').remove();
                        $('#vendorCO_DD_Id').empty();

                        if ($('#iscopypo').val() == "0") {
                            $.each(result, function (i, v) {
                                $('#vendorCO_DD_Id').append(`<option value="${v.vendorId}" data-currcode="${v.currencyCode}" data-currid="${v.currCode}">${v.vendorName}</option>`);
                            });
                        }
                        else {
                            let vendorCo = $('#vendorCo').val();
                            $.each(data, function (i, v) {
                                $('#vendorCO_DD_Id').append(`<option value="${v.vendorId}" data-currcode="${v.currencyCode}" ${vendorCo == v.vendorId ? 'selected' : ''}  data-currid="${v.currCode}">${v.vendorName}</option>`);
                            });
                        }

                        $('#vendorCO_DD_Id').multipleSelect('refresh');
                    }
                }
            });
        }
        function Load_ShipTo_And_InvoiceTo(ProjectId) {
            if (ProjectId == 0 || ProjectId == undefined) {
                $('#ShipTo').val('');
                $('#InvoiceTo').val('');
                return;
            }

            //let url = "/PurchaseOrder/GetShipToAndInvoiceTo";
            let formData = {
                ProjectId: ProjectId
            };
            $.ajax({
                url: "/PurchaseOrder/GetShipToAndInvoiceTo",
                data: { ProjectId: ProjectId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        let result = data.Result;
                        let shipTo = result.split('-')[0];
                        let invoiceTo = result.split('-')[1];
                        if ($('#iscopypo').val() == "0") {
                            $('#ShipTo').val('');
                            $('#InvoiceTo').val('');

                            $('#ShipTo').val(shipTo);
                            $('#InvoiceTo').val(invoiceTo);
                        }
                    }
                }
            });
        }
        function GetPOApprovers(ProjectId) {

            if (ProjectId === undefined)
                return;

            $.ajax({
                url: '/PurchaseOrder/GetProjectApproversById',
                data: { ProjectId: ProjectId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        const approvers = data.Result.approvers;
                        const requiredApprovers = data.Result.requiredApprovers;
                        if (approvers > 0 && approvers >= requiredApprovers) {
                            Load_Vendor_CO_DD_List(ProjectId);
                            Load_ShipTo_And_InvoiceTo(ProjectId);

                            const selectedValues = $('#project_DD_Id').multipleSelect('getSelects');
                            if (selectedValues.length === 0) {
                                $('#project_DD_Id').multipleSelect('setSelects', ['0']);
                            }
                            let projectName = $('#project_DD_Id option:selected').data('name');
                            let legalName = $('#project_DD_Id option:selected').data('legalname');
                            $('#ShipTo').val(projectName);
                            $('#InvoiceTo').val(legalName);
                        }
                        else {
                            $('#createPoBtn').hide();
                            $.notify.error('Error', "Can not create purchase order. Not enough approvers");
                            return false;
                        }
                    }
                    else {
                        $('#createPoBtn').hide();
                        $.notify.error('Error', "Can not create purchase order. Not enough approvers");
                        return false;
                    }
                }
            });
        }
        function ResetForm() {
            $('#project_DD_Id').multipleSelect('setSelects', []);
            $('#vendor_DD_Id').multipleSelect('setSelects', []);

            $('#vendorCO_DD_Id option:selected').remove();
            $('#vendorCO_DD_Id').empty();
            $('#vendorCO_DD_Id').multipleSelect('refresh');

            $('#ShipTo').val('');
            $('#InvoiceTo').val('');

            $('#addressTXT').val('');
            $('#buyer').val('0');
        }
    }
    // #endregion

    // #region :: Purchase Order List
    if (_ActionName === 'polist') {
        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;
        const projectIdsStr = _UserPreferences["Dropdown.ProjectId"] || "";
        const projectIds = projectIdsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

        const SectionIdsStr = _UserPreferences["Dropdown.SectionId"] || "";
        const sectionIds = SectionIdsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

        const vendorIdsStr = _UserPreferences["Dropdown.VendorId"] || "";
        const vendorIds = vendorIdsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

        const PurchaseOrderNumberValue = _UserPreferences["Input.PurchaseOrderNo"] || "";
        const remarksValue = _UserPreferences["Input.Remarks"] || "";
        const itemSpecValue = _UserPreferences["Input.ItemSpec"] || "";
        const urlParams = new URLSearchParams(window.location.search);
        /*const projectIdFromUrl = urlParams.get('projectId');*/
        const projectIdFromUrl = $('#projecturl').val();
        let hasPreAppliedFilters = false;
        /*$('#POItemLoader').css("display", "block");*/
        $('#POItemLoader').show();
        if (projectIdFromUrl) {
            _UserPreferences["Dropdown.ProjectId"] = "";
            hasPreAppliedFilters = false;
            $('#projectNumber').val(projectIdFromUrl);

            $.when(
                vendorlist(projectIdFromUrl),
                sectionList(projectIdFromUrl),
            ).done(function () {
                loadPOListTable();
            });
        }

        else if (projectIds.length > 0 && projectIds[0] != 0) {

            hasPreAppliedFilters = true;

            $('#projectNumber').val(projectIds);

            $('#POItemLoader').show();

            $.when(
                vendorlist(projectIdsStr),
                sectionList(projectIdsStr)
            ).done(function () {

                loadPOListTable(); 

            }).always(function () {
                $('#POItemLoader').hide();
            });
        }

        if (hasPreAppliedFilters) {
            setTimeout(() => {
                $('#advanceSearch').trigger('click'); 
            }, 300);
        }

        //if (projectIds.length > 0 && projectIds[0] != 0) {
        //    $('#projectNumber').val(projectIds);

        //    vendorlist(projectIdsStr);
        //    sectionList(projectIdsStr);

        //    setTimeout(() => {
        //        $('#advanceSearch').trigger('click');
        //    }, 300);
        //}
        $('#purchaseOrderNumber').val(PurchaseOrderNumberValue);
        $('#item_Spec').val(itemSpecValue);
        $('#remarks').val(remarksValue);



        $('.multislct').multipleSelect({
            filter: true,
            showClear: true,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword'
        });

        var status = $('#hdn_status').val();

        if (status === 'Singal') {
            const ProjectIds = $('#hdn_projectId').val().split(",");

            $('#projectNumber').multipleSelect('setSelects', ProjectIds);
            vendorlist($('#hdn_projectId').val());
            loadPOListTableBasedonProjectIdandVendor();
        }
        else {

            loadPOListTable();
        }
        function loadPOListTable() {

            let poId = $('#prevPoId').val();

            $.ajax({
                url: "/PurchaseOrder/LoadInitialPOListData",
                data: { PoId: poId },
                type: 'GET',
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data!= "") {
                        $('#purchaseOrderTableDiv').html('');
                        $('#purchaseOrderTableDiv').html(data);
                        RefreshPurhaseOrderTable();
                        $('#POItemLoader').hide();
                    }
                    else {
                        console.log(data.ErrorMessages);
                    }
                }
            })            
        }
        function loadPOListTableBasedonProjectIdandVendor() {
            const ProjectIds = $('#hdn_projectId').val();
            const VendorIds = $('#hdn_vendorid').val();

            let formdata = {
                OrderNumber: '0',
                ProjectNumber: ProjectIds || '0',
                ProjectSectionNumber: '0',
                ProjectVendorNumber: VendorIds || '0',
                Item_Spec: $('#item_Spec').val() || '',
                Remarks: $('#remarks').val() || ''
            };

            $.ajax({
                url: "/PurchaseOrder/GetFilteredPurchaseOrders",
                data: formdata,
                type: 'GET',
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        $('#purchaseOrderTableDiv').html('');
                        $('#purchaseOrderTableDiv').html(data);

                        setTimeout(function () { }, 1000);

                        RefreshPurhaseOrderTable();

                        $('#projectVendor').multipleSelect('setSelects', VendorIds);
                    }
                }
            });
        }

        function RefreshPurhaseOrderTable() {
            $("#purchs_ordr_tab thead tr")
                .clone(true)
                .addClass("pofilters")
                .appendTo("#purchs_ordr_tab thead");

            var table = $("#purchs_ordr_tab").DataTable({
                orderCellsTop: true,
                //scrollX: true,
                autoWidth: false,
                order: [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { orderable: false, targets: 0 },
                    { width: "6%", targets: 0 },   // Action
                    { width: "7%", targets: 1 },   // PO Number
                    { width: "16%", targets: 2 },   // Project
                    { width: "14%", targets: 3 },   // Vendor Common
                    { width: "16%", targets: 4 },   // Remarks
                    { width: "9%", targets: 5 },   // Buyer
                    { width: "6%", targets: 6 },   // Arrival Date
                    { width: "6%", targets: 7 },   // CheckBack Date
                    { width: "5%", targets: 8 },   // Commit
                    { width: "5%", targets: 9 },   // Approved
                    { width: "5%", targets: 10 },  // Accepted
                    { width: "5%", targets: 11 },  // Status
                ],
                fixedHeader: {
                    headerOffset: $("#main-navbar").outerHeight(),

                },
                pageLength: pageLength,
                initComplete: function () {
                    var api = this.api();

                    // For each column
                    api
                        .columns()
                        .eq(0)
                        .each(function (colIdx) {
                            // Set the header cell to contain the input element
                            var cell = $(".pofilters th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            if (colIdx === 0) {
                                $(cell).html(
                                    '<button type="button" class="porde_list_reset_btn" id="resetPOSearchBtn">Reset</button>'
                                );
                            }
                            else if (colIdx >= 8) {
                                // narrow columns: no placeholder, avoids clipping
                                $(cell).html('<input type="text" class="form-control" />');
                            }
                            else {
                                // For other columns, add input elements
                                $(cell).html(
                                    '<input type="text" class="form-control" placeholder="🔍 Search..." />'
                                );
                            }

                            // On every keypress in this input
                            $(
                                "input",
                                $(".pofilters th").eq($(api.column(colIdx).header()).index())
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

            // Listen to page length change event
            $('#purchs_ordr_tab').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on('click', '#deletedPOListPageBtn', function () {
            const url = `${_BaseURL}/PurchaseOrder/DeletedPOList`;
            window.location.href = url;
        });

        $(document).on('change', '#projectNumber', async function () {
            let ProjectIds = Array.isArray($(this).val()) ? ($(this).val()).join(',') : $(this).val();
            let selectedProjects = $("#projectNumber").multipleSelect("getSelects");

            if (ProjectIds === null || ProjectIds === undefined || ProjectIds === '') {

                $('#projectVendor').empty();
                $('#projectSection').empty();

                $('#projectVendor').multipleSelect('refresh');
                $('#projectSection').multipleSelect('refresh');
                return;
            }

            if (selectedProjects.length > 5) {
                $.notify.warning('Caution', 'Select maximum five projects!');
                selectedProjects.pop();
                $("#projectNumber").multipleSelect("setSelects", selectedProjects);
                return;
            }

            vendorlist(ProjectIds);
            sectionList(ProjectIds);
        });

        function sectionList(ProjectIds) {
            $.ajax({
                url: "/PurchaseOrder/GetAllSectionListByProjectIds",
                data: { ProjectIds: ProjectIds },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $('#projectSection').html('');
                        $.each(data.Result, function (i, v) {

                            $('#projectSection').append(`<option value="${v.sectionId}">${v.sectionName}</option>`);
                        });
                        $('#projectSection').multipleSelect('refresh');

                        if (sectionIds.length > 0) {
                            $('#projectSection').multipleSelect('setSelects', SectionIdsStr);
                        }
                    }
                }
            })
        }

        function vendorlist(ProjectIds) {
            $.ajax({
                url: "/PurchaseOrder/GetAllVendorListByProjectIds",
                data: { ProjectIds: ProjectIds },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.each(data.Result, function (i, v) {
                            $('#projectVendor').append(`<option value="${v.vendorId}">${v.vendorName}</option>`);
                        });
                        $('#projectVendor').multipleSelect('refresh');

                        if (vendorIds.length > 0) {
                            $('#projectVendor').multipleSelect('setSelects', vendorIdsStr);
                        }
                    }
                }
            });            
        }

        $(document).on('click', '#advanceSearch', function () {
            let ProjectIds = $('#projectNumber').multipleSelect('getSelects');
            ProjectIds = ProjectIds.join(',');
            /*let ProjectIds = Array.isArray($('#projectNumber').val()) ? ($('#projectNumber').val()).join(',') : $('#projectNumber').val();*/
            /*let ProjectIds = $('#projectNumber option:selected').map(function () { return this.value; }).get().join(',');*/
            let SectionIds = Array.isArray($('#projectSection').val()) ? ($('#projectSection').val()).join(',') : $('#projectSection').val();
            let VendorIds = Array.isArray($('#projectVendor').val()) ? ($('#projectVendor').val()).join(',') : $('#projectVendor').val();
            let PurchaseOrderNumber = $('#purchaseOrderNumber').val();
            let itemSpec = $('#item_Spec').val();
            let remarks = $('#remarks').val();

            if ((ProjectIds === null || ProjectIds === undefined || ProjectIds === '') && PurchaseOrderNumber === '') {
                DestroyDataTable('purchs_ordr_tab', 'pofilters');
                $('#poListTbody').html('');
                resetSidePannel();
                RefreshPurhaseOrderTable();
                notify(false, 'Please select project or enter purchase order number!.', false);
                return;
            }

            let formdata = {
                OrderNumber: PurchaseOrderNumber || '0',
                ProjectNumber: ProjectIds || '0',
                ProjectSectionNumber: SectionIds || '0',
                ProjectVendorNumber: VendorIds || '0',
                Item_Spec: itemSpec || '',
                Remarks: remarks || ''
            };

            $.ajax({
                url: "/PurchaseOrder/GetFilteredPurchaseOrders",
                data: formdata,
                type: 'GET',
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data!="") {
                        $('#purchaseOrderTableDiv').html('');
                        $('#purchaseOrderTableDiv').html(data);
                        setTimeout(function () { }, 1000);
                        UpdateUserPreferencePoList(PurchaseOrderNumber, ProjectIds, SectionIds, VendorIds, itemSpec, remarks);
                        RefreshPurhaseOrderTable();
                    }
                }
            });

        });

        function UpdateUserPreferencePoList(PurchaseOrderNumber, ProjectIds, SectionIds, VendorIds, itemSpec, remarks) {
            const preferences = [];
            preferences.push({
                PreferenceKey: 'Input.PurchaseOrderNo',
                PreferenceValue: PurchaseOrderNumber
            });
            preferences.push({
                PreferenceKey: 'Dropdown.ProjectId',
                PreferenceValue: ProjectIds || '0'
            });
            preferences.push({
                PreferenceKey: 'Dropdown.SectionId',
                PreferenceValue: SectionIds || '0'
            });
            preferences.push({
                PreferenceKey: 'Dropdown.VendorId',
                PreferenceValue: VendorIds || '0'
            });
            preferences.push({
                PreferenceKey: 'Input.ItemSpec',
                PreferenceValue: itemSpec || ''
            });
            preferences.push({
                PreferenceKey: 'Input.Remarks',
                PreferenceValue: remarks || ''
            });

            SetProjectPreference(preferences);
        }

        $(document).on('click', '#resetPOSearchBtn', function () {
            $(".pofilters input").each(function () {
                $(this).val('');
                $(this).trigger('keyup');
            });
            api.columns().search('').draw();
        });

        $(document).on('click', '.btn-action', function () {
            const historyBtn = $(this).attr('btn-history');
            const deleteBtn = $(this).attr('btn-delete');
            const downloadBtn = $(this).attr('btn-download');
            const pdfBtn = $(this).attr('btn-pdf');
            const approvalBtn = $(this).attr('btn-approval');
            const eMailBtn = $(this).attr('btn-eMail');
            const rejectBtn = $(this).attr('btn-reject');

            if (historyBtn !== undefined) {
                let poId = $(this).data('poid');
                let url = `${_BaseURL}/PurchaseOrder/ViewPOHistory?PoId=${poId}`;
                window.open(url, '_blank');
            }
            if (deleteBtn !== undefined) {
                let PoId = $(this).attr('data-poid');
                DeletePo(PoId);
            }
            if (downloadBtn !== undefined) {
                $(this).toggleClass('checked');
                let poId = $(this).data('poid');
                let poNumber = $(this).data('purchaseorderid').split('#')[1];

                if ($(this).hasClass('checked')) {
                    selectedPoidsAtt.push(poId);
                    selectedPoNumberAtt.push(poNumber);
                }
                else {
                    let poidIndex = selectedPoidsAtt.indexOf(poId);
                    let ponumberIndex = selectedPoNumberAtt.indexOf(poNumber);

                    if (poidIndex > -1) {
                        selectedPoidsAtt.splice(poidIndex, 1);
                    }
                    if (ponumberIndex > -1) {
                        selectedPoNumberAtt.splice(ponumberIndex, 1);
                    }
                }
                if (selectedPoidsAtt.length > 0) {
                    $('#downloadBtn').show();
                    $('#downloadCount').text(selectedPoidsAtt.length);
                }
                else {
                    $('#downloadCount').text(selectedPoidsAtt.length);
                    $('#downloadBtn').hide();
                }
            }
            if (pdfBtn !== undefined) {
                var poId = $(this).data('poid');
                var Iscommited = $(this).data('iscommited');
                var mode = 0;
                const url = '/Reports/PurchaseOrderReportGeneration';
                $.ajax({
                    url: "/Reports/PurchaseOrderReportGeneration",
                    data: { PurchaseOrderID: poId, showImageFlag: mode, IsCommited: Iscommited },
                    type: 'GET',
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (result) {                       
                        $('.loader').css('display', 'none');
                        if (result.IsSuccess) {
                            window.open(result.Result, '_blank');
                        }
                        else {
                            notify(result.IsSuccess, result.ErrorMessages, false);
                        }
                    }
                })
            }
            if (approvalBtn !== undefined) {
                $(this).toggleClass('checked');
                let poId = $(this).data('poid');
                let purchaseOrderNumber = $(this).data('ponumber');
                if ($(this).hasClass('checked')) {
                    selectedPoIds.push(poId);
                    selectedPoNumber.push(purchaseOrderNumber);
                }
                else {
                    let poidIndex = selectedPoIds.indexOf(poId);
                    let ponumberIndex = selectedPoNumber.indexOf(purchaseOrderNumber);

                    if (poidIndex > -1) {
                        selectedPoIds.splice(poidIndex, 1);
                    }
                    if (ponumberIndex > -1) {
                        selectedPoNumber.splice(ponumberIndex, 1);
                    }
                }
                if (selectedPoIds.length > 0) {
                    $('#approvalBtn').show();
                    $('#approvalCount').text(selectedPoIds.length);
                }
                else {
                    $('#approvalCount').text(selectedPoIds.length);
                    $('#approvalBtn').hide();
                }
            }
            if (eMailBtn !== undefined) {
                $(this).toggleClass('checked');
                let emailAddress = $(this).data('email');
                let poId = $(this).data('poid');
                if ($(this).hasClass('checked')) {
                    selectedPoIdsVendor.push(poId);
                    selectedEMailVendor.push(emailAddress.toLowerCase());
                }
                else {
                    let poIdIndex = selectedPoIdsVendor.indexOf(poId);
                    let emailIndex = selectedEMailVendor.indexOf(emailAddress.toLowerCase());

                    if (poIdIndex > -1) {
                        selectedPoIdsVendor.splice(poIdIndex, 1);
                    }

                    if (emailIndex > -1) {
                        selectedEMailVendor.splice(emailIndex, 1);
                    }
                }
                if (selectedPoIdsVendor.length > 0) {
                    $('#mailBtn').show();
                    $('#mailCount').text(selectedPoIdsVendor.length);
                }
                else {
                    $('#mailCount').text(selectedPoIdsVendor.length);
                    $('#mailBtn').hide();
                }
            }
            if (rejectBtn !== undefined) {
                console.log('Reject button clicked');
            }
        });
        function DeletePo(poId) {
            $("#dialog-confirm").html("Want to delete the Purchase Order ?");
            $("#dialog-confirm").dialog({
                resizable: false,
                modal: true,
                height: 200,
                width: 340,
                buttons: {
                    "Yes": async function () {
                        $(this).dialog('close');
                        let result = await CheckInvoiceExist(poId)

                        if (!result) {
                            $.ajax({
                                url: "/PurchaseOrder/DeletePO",
                                data: { PoId: poId },
                                type: 'GET',
                                dataType: 'Json',
                                beforeSend: function () {
                                    $(".loader").css("display", "flex");
                                },
                                success: function (data) {
                                    $(".loader").css("display", "none");
                                    if (data.IsSuccess) {
                                        $.notify.success('Success', data.Result);
                                        LoadTableData();
                                    }
                                    else {
                                        $.notify.error('Error', data.ErrorMessages);
                                    }
                                },
                                error: function (err) {
                                    $(this).dialog('close');
                                }
                            })
                        }
                        else {
                            notify(false, "Cannot delete this PO because it has one or more invoices written against it.", true);
                        }
                        $('.loader').css('display', 'none');
                    },
                    "No": function () {
                        $('.loader').css('display', 'none');
                        $(this).dialog('close');
                    }
                }
            });
            $(".ui-dialog-titlebar-close").html("X");
        }

        async function CheckInvoiceExist(poId) {
            $.ajax({
                url: "/PurchaseOrder/CheckInvoiceExist",
                data: { PoId: poId },
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess == true) {
                        $('.loader').css('display', 'none');
                        return data.Result;
                    }
                    else {
                        $('.loader').css('display', 'none');
                        return false;
                    }
                }
            })           
        }

        $(document).on('click', '#approvalBtn', function () {
            debugger;
            if (selectedPoIds.length <= 0) {
                notify(false, "No data available for approval.");
                return;
            }
            let poIds = selectedPoIds.join(',');
            $.ajax({
                url: "/PurchaseOrder/GetPoDetailsForApproval",
                data: { PoIds: poIds },
                type: 'GET',
                dataType: 'Json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) { 
                    if (data.IsSuccess == true) {
                        let innerHtml = '<ul class="comment_list">';
                        let html = data.Result.map(r => {
                            return `<li>
                                    <span>${r.poNumber}-${r.parentVendorName}-${r.contactName} ${r.remarks ? `-${r.remarks}` : ''}</span>
                                    <a href="#" title="Remove this account" class="remove_bar" data-poid ='${r.poId}'>
                                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                                    </a>
                                </li>`
                        }).join('');
                        innerHtml += html;
                        innerHtml += '</ul>';

                        $('#approveModalBody').html('');
                        $('#approveModalBody').html(innerHtml);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }    
                    $(".loader").css("display", "none");
                }
            })            
        });

        $(document).on('click', '#mailBtn', function () {
            if (selectedPoIdsVendor.length > 0) {
                $('#vendorMailIds').val('');
                let mailList = selectedEMailVendor.join(',');
                let uniqueEmailString = GetUniqueMailAddress(mailList);
                $('#vendorMailIds').val(uniqueEmailString);
                loadPOMailTemplate();
                loadVendorIdsFromMailIds(selectedPoIdsVendor.join(','));
            }
            else {
                notify(false, 'Something went wrong!!', false);
            }
        });
        function loadVendorIdsFromMailIds(mailPoIds) {
            $.ajax({
                url: _BaseURL + "/PurchaseOrder/GetVendorIdFromMailPOIds",
                data: { PoIds: mailPoIds },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {                  
                    if (data.IsSuccess) {
                        let result = data.Result;
                        let response = '';
                        result.forEach(v => {
                            response += response == '' ? `${v.vendor_ID}$${v.purchaseOrderID}` : `%%${v.vendor_ID}$${v.purchaseOrderID}`;
                        });

                        //$('#sendMailBtn').removeAttr('data-vendorid');
                        $('#sendMailBtn').attr('data-vendorid', response);
                        $('#sendMailBtn').attr('data-poid', "");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            })
        }
        function loadPOMailTemplate() {
            $.ajax({
                url: "/PurchaseOrder/GetPOMailTemplate",
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        let mailBody = data.Result.mailBody;
                        let subject = data.Result.subject;
                        $('#subject').val('');
                        $('#subject').val(subject);
                        var editor = tinymce.get('editor');
                        if (editor == null) {
                            tinymce.init({
                                selector: "#editor",
                                plugins: "textcolor",
                                toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , init_instance_callback: function () { tinyMCE.get('editor').setContent(mailBody); }
                            });
                        }
                        else {
                            editor.setContent(mailBody);
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $('.loader').css('display', 'none');
                },
                error: function (err) {
                    console.log(err);
                    $('.loader').css('display', 'none');
                }
            });            
        }

        $(document).on('click', '#downloadBtn', async function () {
            //if (selectedPoidsAtt.length > 0) {
            //    GetPoDetailsForDownload(selectedPoidsAtt.join(','));
            //    GetPoFilesToDownload(selectedPoidsAtt.join(','));
            //}
            

            if (selectedPoidsAtt.length > 0) {
                try {
                    $(".loader").css("display", "flex");

                    await GetPoDetailsForDownload(selectedPoidsAtt.join(','));
                    await GetPoFilesToDownload(selectedPoidsAtt.join(','));

                    setTimeout(() => {
                        CheckTermsPDFCheckbox();
                        CheckPOPDFCheckbox();
                    }, 300);

                } catch (err) {
                    console.log('Error in download process:', err);
                } finally {
                    $(".loader").css("display", "none");
                }
            }
            
        });

        function GetPoDetailsForDownload(PoIds) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/PurchaseOrder/GetPoDetailsForDownload",
                    type: 'GET',
                    dataType: 'JSON',
                    data: { PoIds },
                    success: function (result) {
                        if (result.IsSuccess) {
                            let data = result.Result;
                            let html = data.map(d => `
                                <input checked data-poid='${d.purchaseOrderID}' type='checkbox' class='downloadablepopdfs mrg5L mrg5R' style='margin-top:1px;' />
                                <span>${d.poNumber} - ${d.parentVendorName} - ${d.contactName} ${d.remarks}</span>
                            `).join('<br/>');
                            $('#poPDFDownload').html(html);
                        } else {
                            $('#poPDFDownload').html("<span>No data Found.</span>");
                        }
                        resolve(result);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        }

        async function GetPoFilesToDownload(PoIds) {

            let attachmentHtml = '';
            let termsHtml = '';

            await new Promise((resolve, reject) => {
                $.ajax({
                    url: "/PurchaseOrder/GetPoFilesToDownload",
                    type: 'GET',
                    dataType: 'JSON',
                    data: { PoIds: PoIds },
                    success: function (result) {
                        if (result.IsSuccess && result.Result.length > 0) {
                            attachmentHtml = result.Result.map(v => `
                                    <input data-filename='${v.fileName}' type='checkbox' class='downloadablepoattachments mrg5L mrg5R' style='margin-top:1px;' />
                                    <a target='_blank' href='${baseurl}ProjectFiles/${v.fileName}'>${v.fileName}</a>
                                `).join('<br/>');
                        }
                        resolve(true);
                    },
                    error: reject,
                    complete: resolve
                });
            });

            // Now call terms API only after 1st finishes
            await new Promise((resolve, reject) => {
                $.ajax({
                    url: "/PurchaseOrder/GetPoTermsFiles",
                    type: 'GET',
                    dataType: 'JSON',
                    data: { PoIds: PoIds },
                    success: function (result) {
                        if (result.IsSuccess && result.Result.length > 0) {
                            let html = '';
                            result.Result.forEach(v => {
                                if (html !== "") html += "<br/>";
                                let fileName = v.termsFile;
                                let FileNameshow = v.filename1;
                                let ProjectID = v.projectID;
                                let filenames = fileName.split(',');

                                if (fileName.includes("SystemTermsFile")) {
                                    html += `
                                            <input checked data-projectid='${ProjectID}' data-filename='${fileName}' type='checkbox' class='downloadabletermsfile mrg5L mrg5R' style='margin-top:1px;' />
                                            <a target='_blank' href='/Assets/SystemTermsFiles/${fileName}'>${FileNameshow}</a>
                                        `;
                                } else {
                                    filenames.forEach((f, i) => {
                                        if (i > 0) html += "<br/>";
                                        html += `
                                                <input checked data-projectid='${ProjectID}' data-filename='${fileName}' type='checkbox' class='downloadabletermsfile mrg5L mrg5R' style='margin-top:1px;' />
                                                <a target='_blank' href='/Assets/TermsConditionFiles/${fileName}'>${FileNameshow}</a>
                                            `;
                                    });
                                }
                            });
                            termsHtml = html;
                        }
                    },
                    error: reject,
                    complete: function () {
                        const finalHtml = (termsHtml || "") + "<br/>" + (attachmentHtml || "");
                        $('#poAttachmentDownload').html(finalHtml.trim() || "<span>No attachments found.</span>");
                        resolve(true);
                    }
                });
            });

            return true;            
        }

        //function GetPoDetailsForDownload(PoIds) {
        //    const url = '/PurchaseOrder/GetPoDetailsForDownload';
        //    const res = globalAjax(url, 'GET', { PoIds: PoIds });
        //    res.then(function (result) {
        //        if (result.IsSuccess) {
        //            let data = result.Result;
        //            let response =
        //                data.map(d => {
        //                    return `
        //                    <input checked data-poid='${d.purchaseOrderID}' type='checkbox' class='downloadablepopdfs mrg5L mrg5R' style='margin-top:1px;' />
        //                    <span>
        //                        ${d.poNumber} - ${d.parentVendorName} - ${d.contactName} 
        //                        ${d.remarks}
        //                    </span>
        //                `;
        //                }).join('<br/>');
        //            $('#poPDFDownload').html('');
        //            $('#poPDFDownload').html(response);
        //        }
        //        else {
        //            //notify(false, result.Result, false);
        //            $('#poPDFDownload').html('');
        //            $('#poPDFDownload').html("<span> No data Found.</span >");
        //        }
        //        $('.loader').css('display', 'none');
        //    }).fail(function (err) {
        //        console.log(err);
        //        $('.loader').css('display', 'none');
        //    });
        //}
        //function GetPoFilesToDownload(PoIds) {
        //    let attachmentHtml = '';
        //    let termsHtml = '';
        //    const poFilesurl = '/PurchaseOrder/GetPoFilesToDownload';
        //    const poFilesRes = globalAjax(poFilesurl, 'GET', { PoIds: PoIds }, "text", true, true, false, false);
        //    poFilesRes
        //        .then(function (result) {

        //            if (result.IsSuccess) {
        //                let data = result.Result;
        //                if (data.length > 0) {
        //                    attachmentHtml = data.map(v => {
        //                        let filename = v.fileName;
        //                        return `
        //                                <input data-filename='${filename}' type='checkbox' class='downloadablepoattachments mrg5L mrg5R' style='margin-top:1px;' />
        //                                <a target='_blank' href ='${baseurl}ProjectFiles/${filename}' title='Download this file'>${filename}</a>
        //                            `;
        //                    }).join('<br/>');
        //                }
        //            }
        //            else {
        //                notify(false, result.Result, false);
        //            }
        //            $('.loader').css('display', 'none');
        //        })
        //        .fail(function (err) {
        //            console.log(err);
        //            $('.loader').css('display', 'none');
        //        });

        //    const termsFileUrl = '/PurchaseOrder/GetPoTermsFiles';
        //    const termsFileRes = globalAjax(termsFileUrl, 'GET', { PoIds: PoIds }, "text", true, true, false, false);
        //    termsFileRes
        //        .then(function (result) {
        //            if (result.IsSuccess) {
        //                let data = result.Result;
        //                let html = '';
        //                if (data.length > 0) {
        //                    data.forEach(v => {
        //                        if (html != "") { html += "<br />"; }
        //                        let fileName = v.termsFile;
        //                        let FileNameshow = v.filename1;
        //                        let ProjectID = v.projectID;

        //                        let filenames = fileName.split(',');

        //                        if (fileName == 'SystemTermsFile^SystemTermsFile^TermsandConditions_0.pdf' || fileName == 'SystemTermsFile^TermsandConditions_0.pdf') {
        //                            html += `<input checked data-projectid='${ProjectID}' data-filename='${fileName}' type='checkbox' class='downloadabletermsfile mrg5L mrg5R' style='margin-top:1px;' />
        //                                    <a target='_blank' href ='/Assets/SystemTermsFiles/${fileName}' title='Download this file'>${FileNameshow}</a>`;
        //                        }
        //                        else {
        //                            for (var i = 0; i < filenames.length; i++) {
        //                                if (i > 0) {
        //                                    html += "<br>";
        //                                }
        //                                html += `<input checked data-projectid='${ProjectID}' data-filename='${fileName}' type='checkbox' class='downloadabletermsfile mrg5L mrg5R' style='margin-top:1px;' />
        //                                    <a target='_blank' href ='/Assets/TermsConditionFiles/${fileName}' title='Download this file'>${FileNameshow}</a>`;
        //                            }
        //                        }
        //                    });
        //                }
        //                termsHtml += html;
        //            }
        //            else {
        //                notify(false, result.Result, false);
        //            }
        //            $('.loader').css('display', 'none');
        //        })
        //        .fail(function (err) {
        //            console.log(err);
        //            $('.loader').css('display', 'none');
        //        });

        //    if (termsHtml != "") { termsHtml += "<br />"; }
        //    termsHtml = termsHtml + attachmentHtml;

        //    $('#poAttachmentDownload').html('');
        //    $('#poAttachmentDownload').html(termsHtml);
        //}

        $(document).on('click', '#unselectBtn', function () {
            selectedPoidsAtt = [];
            selectedPoNumberAtt = [];
            $('#downloadBtn').hide();
            $('.fa-download').removeClass('checked');
            $('#download_files').modal('hide');
        });

        $(document).on('click', '#downloadFilesBtn', async function () {
            const po_PDF_checkboxes = document.querySelectorAll('#poPDFDownload input[type="checkbox"]');
            const po_attachment_checkboxes = document.querySelectorAll('#poAttachmentDownload input[type="checkbox"]');
            const po_PDF_isChecked = Array.from(po_PDF_checkboxes).some(checkbox => checkbox.checked);
            const po_attachment_isChecked = Array.from(po_attachment_checkboxes).some(checkbox => checkbox.checked);

            if (po_PDF_isChecked || po_attachment_isChecked) {
                try {
                    $(".loader").css("display", "flex");

                    await ReadyAttatchmentFile(po_PDF_isChecked, po_attachment_isChecked);
                    await ReadyTermsFile();
                    await GeneratePurchaseOrderReport();
                    await DownloadZipFile();

                } catch (err) {
                    console.error("An error occurred:", err);
                } finally {
                    $('.loader').css('display', 'none');
                }
            }
            else {
                $.notify.error('Error', "There are no files selected for download.");
            }
        });

        function ReadyAttatchmentFile(po_PDF_isChecked, po_attachment_isChecked) {

            let attachments = $('.downloadablepoattachments:checked')
                .map(function () {
                    return $(this).data('filename');
                })
                .get()
                .join('^');

            return $.ajax({
                url: "/PurchaseOrder/InsertToFolder",
                type: 'GET',
                data: { attachments: attachments, IsPoPdfChecked: po_PDF_isChecked, IsTermsChecked: po_attachment_isChecked },
                cache: false,
            });
        }

        function ReadyTermsFile() {

            let projectid = $('.downloadabletermsfile:checked')
                .map(function () {
                    return $(this).data('projectid');
                })
                .get()
                .join('^');

            if (projectid === '' || projectid === undefined) {
                return Promise.resolve();
            }

            return $.ajax({
                url: "/PurchaseOrder/InsertTerms",
                type: 'GET',
                data: { poids: projectid },
                cache: false,
            });
        }

        function GeneratePurchaseOrderReport() {

            const selectedPOs = $('.downloadablepopdfs:checked');

            if (selectedPOs === '' || selectedPOs === undefined) {
                return Promise.resolve();
            }

            const ajaxCalls = selectedPOs.map(function () {
                const poid = $(this).data('poid');

                return $.ajax({
                    url: '/Home/PurchaseOrderReportGeneration',
                    type: 'GET',
                    data: { PurchaseOrderID: poid, showImageFlag: "0" },
                    cache: false
                });
            }).get();

            return Promise.all(ajaxCalls);

        }

        function DownloadZipFile() {

            return $.ajax({
                url: '/PurchaseOrder/DownloadZipFile',
                type: 'GET',
                cache: false,
                success: function (result) {
                    $.notify.success('Success', "Zip file created");
                    $('#btn_sendbatchatt').hide();
                    $('.fa-download').removeClass('checked');
                    $('#download_files').modal('hide');

                    setTimeout(() => {
                        window.open(result, "_blank");
                    }, 2000);
                    resetSidePannel();
                    //window.location.reload();
                }
            });
        }

        function resetSidePannel() {
            selectedPoIds.length = 0;
            selectedPoNumber.length = 0;
            let length = selectedPoIds.length;
            $('#approvalCount').text(length);
            $('#approvalBtn').hide();

            selectedPoIdsVendor.length = 0;
            selectedEMailVendor.length = 0;
            length = selectedPoIdsVendor.length;
            $('#mailCount').text(length);
            $('#mailBtn').hide();

            selectedPoidsAtt.length = 0;
            selectedPoNumberAtt.length = 0;
            length = selectedPoidsAtt.length;
            $('#downloadCount').text(selectedPoidsAtt.length);
            $('#downloadBtn').hide();
        }

        $(document).on('click', '.remove_bar', function () {
            let poid = $(this).data('poid');
            let index = selectedPoIds.indexOf(poid);
            if (index > -1) {
                selectedPoIds.splice(index, 1);
                selectedPoNumber.splice(index, 1);
            }
            if (selectedPoIds.length > 0) {
                $('#approvalBtn').show();
                $('#approvalCount').text(selectedPoIds.length);
            }
            else {
                $('#approvalCount').text(selectedPoIds.length);
                $('#approvalBtn').hide();
            }
            const approveBtn = $(`#btn_approval_${poid}`);
            approveBtn.removeClass('checked');
            $(this).parent().remove();
        });

        $(document).on('click', '#sendForApprovalBtn', function () {
            debugger;
            let poids = selectedPoIds.join(',');
            if (poids == "") {
                return;
            }
            $.confirm({
                title: 'Proceed with email notification?',
                message: "Do you want to send the approvers a notification email? OK for yes, cancel for no.",
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {                   
                    const formData = {
                        PoIds: poids,
                        MailSend: true
                    };
                    $.ajax({
                        url: "/PurchaseOrder/SendForBatchApproval",
                        data: formData,
                        type: 'POST',
                        dataType: 'Json',
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $('.loader').css('display', 'none');
                            if (data.IsSuccess == true) {
                                $.notify.success('Success', data.Result);
                                $('#send_po_approv').modal('hide');
                                selectedPoIds = [];
                                selectedPoNumber = [];
                                $('#approvalBtn').hide();
                                $('#approvalCount').text('0');
                                LoadTableData();
                            }
                            else {
                                $.notify.error('Error', data.Errors);
                            }
                        },
                        error: function (err) {
                            console.error(err);
                            $('.loader').css('display', 'none');
                        },
                    })
                },
                onCancel: function () {
                    debugger;
                    const formData = {
                        PoIds: poids,
                        MailSend: false
                    };
                    $.ajax({
                        url: "/PurchaseOrder/SendForBatchApproval",
                        data: formData,
                        type: 'POST',
                        dataType : 'Json',
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $('.loader').css('display', 'none');
                            if (data.IsSuccess == true) {
                                $.notify.success('Success', data.Result);
                                $('#send_po_approv').modal('hide');
                                selectedPoIds = [];
                                selectedPoNumber = [];
                                $('#approvalBtn').hide();
                                $('#approvalCount').text('0');
                                LoadTableData();
                            }
                            else {
                                $.notify.error('Error', data.Errors);
                            }
                        },
                        error: function (err) {
                            console.error(err);
                            $('.loader').css('display', 'none');
                        },
                    })
                }
            });

                      
        });

        $(document).on('click', '.btnPoEdit', function () {
            const poid = $(this).data('poid');
            //console.log(poid);
        });

        $(document).on('click', '#sendMailBtn', function () {

            let selfCC = $('#selfCC').is(':checked') ? "1" : "0";
            let mailbody = escape(tinyMCE.get('editor').getContent());
            let mailTo = $('#vendorMailIds').val();
            let mailSubject = $('#subject').val();

            //validation start
            if (mailTo?.trim() == "" || mailTo == null) {
                $.notify.error('Error', "Add recipient");
                return;
            }

            if (mailbody?.trim() == "" || mailbody == null) {
                $.notify.error('Error', "Add Body");
                return;
            }

            if (!isValidEmailList(mailTo)) {
                $.notify.error('Error', "Email should be in format Email1,Email2,Email3.....");
                return;
            }

            let vendorContent = $(this).attr('data-vendorid');
            const mailIdList = mailTo.split(',');
            let arr = [];
            for (let i = 0; i < mailIdList.length; i++) {
                const mailId = mailTo.split(',')[i];
                let indices = [];
                for (let i = 0; i < selectedEMailVendor.length; i++) {
                    //if (selectedEMailVendor[i] === mailId) {
                    indices.push(i);
                    //}
                }
                let poids = indices.map(i => selectedPoIdsVendor[i]).join(',');

                let result = {};

                let parts = vendorContent.split('%%');
                for (let a = 0; a < parts.length; a++) {
                    let test = parts[a].split('$')[1];
                    const poList = test.includes('^') ? test.split('^').join(',') : test;
                    const vdId = parts[a].split('$')[0];
                    if (poids == poList) {
                        result = {
                            _SelfCC: selfCC,
                            _MailBody: mailbody,
                            _MailSubject: mailSubject,
                            _MailId: mailId,
                            _VendorId: vdId,
                            _PoIdList: poList
                        };
                        arr.push(result);
                    }
                }
            }

            for (let j = 0; j < arr.length; j++) {

                let formData = arr[j];
                $.ajax({
                    url: "/PurchaseOrder/SendVendorMail",
                    data: formData,
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {                       
                        if (data.IsSuccess) {
                            $('#send_mail_modal').modal('hide');
                            selectedPoIdsVendor = new Array();
                            selectedEMailVendor = new Array();
                            $('.fa-paper-plane').removeClass('checked');
                            $('#mailCount').text('0');
                            $('#mailBtn').hide();;
                            $.notify.success('Success', `Mail sent to ${formData._MailId}`);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                        $('.loader').css('display', 'none');
                    }
                });
            }
        });

        $(document).on('change', '#mailDynamicField', function () {
            const value = $(this).val();
            if (value == "1") {
                let url = "THESERVERLINKBASEURL" + "<<\(" + "POID" + "\)>>";
                tinymce.activeEditor.execCommand('mceInsertContent', true, `<a data-mce-href='${url}' href='${url}'><input type='button' style='border-radius: 4px;color: white;background: grey;cursor: pointer;' value='Go to Purchase Order' /></a>`);
            }
            else {
                tinymce.activeEditor.execCommand('mceInsertContent', true, `<a><<(${value})>></a>`);
            }
        });

        function GetUniqueMailAddress(mailList) {
            let emailArray = mailList.split(',');
            let uniqueEmails = [...new Set(emailArray.map(email => email.trim()))];
            return uniqueEmails.join(',');
        }
        function isValidEmailList(input) {
            // Match all email addresses in the string
            const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+/g;
            const emails = input.match(emailPattern);


            if (!emails || emails.length === 0) return false;


            if (emails.length === 1 && input.trim() === emails[0]) return true;


            let separators = [];
            let lastIndex = 0;

            for (let i = 0; i < emails.length - 1; i++) {
                const index1 = input.indexOf(emails[i], lastIndex) + emails[i].length;
                const index2 = input.indexOf(emails[i + 1], index1);
                const sep = input.slice(index1, index2).trim();
                if (sep) separators.push(sep);
                lastIndex = index2;
            }


            const allowed = [","];
            const uniqueSeparators = [...new Set(separators)];

            return uniqueSeparators.length === 1 && allowed.includes(uniqueSeparators[0]);
        }
        function processVendorDetails(inputString) {
            const vendorSections = inputString.split('%%');

            const results = vendorSections.map(section => {
                const [vendorId, productIds] = section.split('$');

                const productIdList = productIds.includes('^') ? productIds.split('^') : [productIds];

                return {
                    vendor_id: vendorId,
                    product_ids: productIdList
                };
            });

            return results;
        }

        $(document).on('click', '#closeEmailModal', function () {
            $('#sendMailBtn').removeAttr('data-vendorid');
            $("#send_mail_modal").modal("hide");
        });

        $('#send_mail_modal').on('hidden.bs.modal', function () {
            $('#sendMailBtn').removeAttr('data-vendorid');
            $('#sendMailBtn').removeAttr('data-poid');
            $('#vendorMailIds').val('');
            $('#subject').val('');
            $('#mailDynamicField').val('');
            if (tinymce.get('editor')) {
                tinymce.get('editor').setContent('');
            }
            $('#selfCC').prop('checked', false);
        });

        function LoadTableData() {
            let ProjectIds = Array.isArray($('#projectNumber').val()) ? ($('#projectNumber').val()).join(',') : $('#projectNumber').val();
            let SectionIds = Array.isArray($('#projectSection').val()) ? ($('#projectSection').val()).join(',') : $('#projectSection').val();
            let VendorIds = Array.isArray($('#projectVendor').val()) ? ($('#projectVendor').val()).join(',') : $('#projectVendor').val();

            if (ProjectIds === null || ProjectIds === undefined) {
                $('#poListTbody').html('');
                resetSidePannel();
                return;
            }

            let formdata = {
                OrderNumber: $('#purchaseOrderNumber').val() || '0',
                ProjectNumber: ProjectIds || '0',
                ProjectSectionNumber: SectionIds || '0',
                ProjectVendorNumber: VendorIds || '0',
                Item_Spec: $('#item_Spec').val() || '',
                Remarks: $('#remarks').val() || ''
            };

            $.ajax({
                url: "/PurchaseOrder/GetFilteredPurchaseOrders",
                data: formdata,
                type: 'GET',
                dataType: 'HTML',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data != '') {
                        $('#purchaseOrderTableDiv').html('');
                        $('#purchaseOrderTableDiv').html(data);
                        RefreshPurhaseOrderTable();
                    }
                }
            })
        }

        function DestroyDataTable(tableId, filterClass) {
            tableId = tableId || 'purchs_ordr_tab';
            filterClass = filterClass || 'pofilters';
            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                $(`#${tableId}`).DataTable().clear().destroy();
            }
            $(`#${tableId} thead .${filterClass}`).remove();
        }

        $(document).on('click', '.btnPoEdit', function () {
            var poid = $(this).data('poid');
            const url = "/PurchaseOrder/POEdit?POId=" + poid;
            window.open(url);
        });

        $(document).on('click', '#checkuncheckallattachments', function () {
            if ($(this).is(':checked')) {
                $('.downloadabletermsfile').each(function () {
                    $(this).prop('checked', true);
                });
            }
            else {
                $('.downloadabletermsfile').each(function () {
                    $(this).prop('checked', false);
                });
            }
        });

        $(document).on('click', '#checkuncheckallpdfs', function () {
            if ($(this).is(':checked')) {
                $('.downloadablepopdfs').each(function () {
                    $(this).prop('checked', true);
                });
            }
            else {
                $('.downloadablepopdfs').each(function () {
                    $(this).prop('checked', false);
                });
            }
        });

        $(document).on('click', '.downloadabletermsfile', CheckTermsPDFCheckbox);

        $(document).on('click', '.downloadablepopdfs', CheckPOPDFCheckbox);

        function CheckTermsPDFCheckbox() {
            const total = $('.downloadabletermsfile').length;
            const checked = $('.downloadabletermsfile:checked').length;

            if (total === checked) {
                $('#checkuncheckallattachments').prop('checked', true);
            } else {
                $('#checkuncheckallattachments').prop('checked', false);
            }
        }

        function CheckPOPDFCheckbox() {
            const total = $('.downloadablepopdfs').length;
            const checked = $('.downloadablepopdfs:checked').length;

            if (total === checked) {
                $('#checkuncheckallpdfs').prop('checked', true);
            } else {
                $('#checkuncheckallpdfs').prop('checked', false);
            }
        }
    }
    // #endregion

    // #region :: Deleted PO List
    if (_ActionName === 'deletedpolist') {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        $('.multislct').multipleSelect({
            filter: true,
            showClear: true,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword'
        });

        RefreshPurhaseOrderTable();
        LoadDeletedPoTableData();
        function RefreshPurhaseOrderTable() {
            $("#del_po_table thead tr")
                .clone(true)
                .addClass("pofilters")
                .appendTo("#del_po_table thead");

            var table = $("#del_po_table").DataTable({
                orderCellsTop: true,
                scrollX: true,
                order: [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { orderable: false, targets: 0 },
                    { width: "100px", targets: 0 },
                ],

                pageLength: pageLength,
                initComplete: function () {
                    var api = this.api();

                    // For each column
                    api
                        .columns()
                        .eq(0)
                        .each(function (colIdx) {
                            // Set the header cell to contain the input element
                            var cell = $(".pofilters th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            if (colIdx === 0) {
                                $(cell).html(
                                    '<button type="button" class="porde_list_reset_btn" id="resetPOSearchBtn">Reset</button>'
                                );
                            } else {
                                // For other columns, add input elements
                                $(cell).html(
                                    '<input type="text" class="form-control" placeholder="🔍 Search..." />'
                                );
                            }

                            // On every keypress in this input
                            $(
                                "input",
                                $(".pofilters th").eq($(api.column(colIdx).header()).index())
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

            $('#del_po_table').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        function DestroyDataTable(tableId, filterClass) {
            tableId = tableId || 'del_po_table';
            filterClass = filterClass || 'pofilters';

            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                $(`#${tableId}`).DataTable().clear().destroy();
            }
            $(`#${tableId} thead .${filterClass}`).remove();
        }

        $(document).on('click', '#poListPageBtn', function () {
            const url = `${_BaseURL}/PurchaseOrder/POList`;
            window.location.href = url;
        });

        $(document).on('click', '#loadDeletedPoListBtn', function () {
            LoadDeletedPoTableData();
        });

        $(document).on('click', '#resetPOSearchBtn', function () {
            $(".pofilters input").each(function () {
                $(this).val('');
                $(this).trigger('keyup');
            });
            api.columns().search('').draw();
        });

        $(document).on('change', '#projectNumber', function () {
            let ProjectIds = Array.isArray($(this).val()) ? ($(this).val()).join(',') : $(this).val();
            if (!ProjectIds) {
                $('#projectVendor').html('');
                $('#projectVendor').multipleSelect('refresh');

                $('#deletedPoLIstTbody').html('');
                DestroyDataTable('del_po_table', 'pofilters');
                RefreshPurhaseOrderTable();
                return;
            }

            LoadVendorByProject(ProjectIds);
        });

        function LoadVendorByProject(ProjectIds) {
            $.ajax({
                url: "/PurchaseOrder/GetAllVendorListByProjectIds",
                data: { ProjectIds: ProjectIds },
                type: 'GET',
                dataType: 'JSON',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        $.each(data.Result, function (i, v) {
                            $('#projectVendor').append(`<option value="${v.vendorId}">${v.vendorName}</option>`);
                        });
                        $('#projectVendor').multipleSelect('refresh');
                    }
                }
            })
        }

        $(document).on('click', '.btn-recycle', function () {

            const $el = $(this);
            const PoNo = $el.data('pono');
            const poId = PoNo.split('#')[0];

            $.confirm({
                title: 'Warning',
                message: 'Are you sure you want to restore the PO?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',

                onConfirm: function () {

                    $.ajax({
                        url: "/PurchaseOrder/RecyclePO",
                        data: { PoId: poId },
                        type: 'GET',
                        dataType: 'JSON',

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");

                            if (data.IsSuccess) {
                                LoadDeletedPoTableData();
                                $.notify.success('Success', data.Result);
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                    return;
                }
            });
        });

        $(document).on('click', '.btn-pdf', function () {

            const $el = $(this);
            const poId = $el.data('poid');
            const isCommitted = $el.data('comitted');
            const mode = 0;

            $.ajax({
                url: "/Reports/DeletedPurchaseOrderReportGeneration",
                data: {PurchaseOrderID: poId,showImageFlag: mode,IsCommited: isCommitted},
                type: 'GET',
                dataType: 'JSON',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        window.open(data.Result, "_blank");
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });

        function LoadDeletedPoTableData() {
            debugger;
            const ProjectIds = Array.isArray($('#projectNumber').val()) ? ($('#projectNumber').val()).join(',') : $('#projectNumber').val();
            const VendorIds = Array.isArray($('#projectVendor').val()) ? ($('#projectVendor').val()).join(',') : $('#projectVendor').val();
            const itemSpec = $('#item_Spec').val();

            if (!ProjectIds) {
                $('#deletedPoLIstTbody').html('');
                DestroyDataTable('del_po_table', 'pofilters');
                RefreshPurhaseOrderTable();
                return;
            }

            const formData = {
                ProjectNumber: ProjectIds || '0',
                VendorNumber: VendorIds || '0',
                Item_Spec: itemSpec || ''
            };

            $.ajax({
                url: "/PurchaseOrder/GetPoDeletedList",
                data: formData,
                type: 'GET',
                dataType: 'JSON',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    debugger;
                    $('.loader').css('display', 'none');               
                    if (data.IsSuccess == true) {
                        if (data.Result.length > 0) {
                            DestroyDataTable('del_po_table', 'pofilters');
                            let TR = data.Result.map(v => {
                                return `
                                        <tr>
                                            <td>
                                                <div class="pot_act_icons">
                                                    <i class="fa fa-recycle btn-recycle" style="font-size: 1.3em;cursor:pointer;"  data-pono='${v.poNo}'></i>
                                                    <i class="fa fa-file-pdf-o mrg5L btn-pdf" style="cursor:pointer;font-size: 1.2em;"
                                                        title="View PDF"  data-poid='${v.poNo.split("#")[0]}' data-comitted='${v.isCommitted}' ></i>
                                                </div>
                                            </td>
                                            <td>${v.poNo.split("#")[1]}</td>
                                            <td>${v.projNo}</td>
                                            <td>${v.vendorCommon}</td>
                                            <td>${v.buyer}</td>
                                            <td>${v.shipDate}</td>
                                            <td>${v.checkBack}</td>
                                            <td>${v.isCommitted}</td>
                                        </tr>`;
                            }).join("");

                            $('#deletedPoLIstTbody').append('');
                            $('#deletedPoLIstTbody').append(TR);
                        }
                        RefreshPurhaseOrderTable();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

    }
    // #endregion

    // #region :: Purchase Order Edit Page
    if (_ActionName === "poedit") {
        let isDirty = false;
        var InvoiceData = "";

        $(document).on('change keyup', '#po_details_edit_form input, #po_details_edit_form select, #po_details_edit_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        checkAssignedApprovers();
        function checkAssignedApprovers() {
            var poid = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/PO_GetRequiredAndAssignedApprovers",
                data: { POID: poid },
                type: "GET",
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {

                        if (data.Result.data == 'NOAPPROVER') {
                            $('#btn_CommitPONSndApprvl').hide();
                            $.notify.error('Error', 'This PO does not have any assigned Approvers.');
                        }
                        else if (parseInt(data.Result.data) > 0) {
                            $('#btn_CommitPONSndApprvl').hide();
                            $.notify.error('Error', "This PO does not have enough Approvers. Need to assign " + data.Result.data + " more PO Approver(s).");
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                },
            })

        }

        HideUnhideButton();

        InvoiceStatusData();
        PODetailspartial();
        function InvoiceStatusData() {
            //function to call the API and set the calculation fields.
            //Variable "InvoiceData" to store the actual output for click event modal.
            var poid = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/InvoiceDataonPageLoad",
                data: { POID: poid },
                type: "GET",
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        InvoiceData = data.Result;
                        var vl = InvoiceData.split('^')[1];
                        var tx = InvoiceData.split('^')[2];
                        InvoiceData = InvoiceData.split('^')[0];
                        $('#hdn_InvoiceStatus').val(InvoiceData);
                        $('#invval').text(numberWithCommas(parseFloat(vl).toFixed(2)));

                        $('#invtx').text(numberWithCommas(parseFloat(tx).toFixed(2)));

                        $('#invtot').text(numberWithCommas(parseFloat(parseFloat(vl) + parseFloat(tx)).toFixed(2)));
                        if (InvoiceData == "Not Exists") {
                            $('#invval').text('');
                            $('#invtx').text('');
                            $('#invtot').text('');
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
        function numberWithCommas(x) {
            //to convert the value into USD format and separate it with ",".
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
        function partialInvoiceData() {
            if (InvoiceData == "Not Exists") {
                $('#invstatus').text("Invoice not received");
                return;
            }
            if (InvoiceData == "Full") {
                $('#invstatus').text("Invoice fully received");

                $('#invstatus').css('cursor', 'pointer');
                $('#invstatus').css('color', 'blue');
                $('#invstatus').css('text-decoration', 'underline');
                //$('#invstatus').attr('onclick', 'gotoinvoices();');
                $('#invstatus').attr('title', 'View Invoice(s)');
            }
            else {
                $('#invstatus').text("Invoice partially received");
                $('#invstatus').css('color', 'blue');
                $('#invstatus').css('cursor', 'pointer');
                $('#invstatus').css('text-decoration', 'underline');
                //$('#invstatus').attr('onclick', 'gotoinvoices();');
                $('#invstatus').attr('title', 'View Invoice(s)');
            }
        }
        function HideUnhideButton() {
            debugger;
            var LineItemcount = $('#hdn_lineItemCount').val();
            var isCommited = $('#Hdn_iscommited').val();
            var IsSentForApproval = $('#hdn_IsSentForApproval').val();
            var IsApproved = $('#hdn_IsApproved').val();
            var CreatePOPermission = $('#Hdn_CreatePOPermission').val();



            if (isCommited == "1") {
                $("#txt_VendorName").attr('disabled', 'disabled');
                $("#txt_VendorCO").attr('disabled', 'disabled');
                $('#btn_SaveAll').addClass("d-none");

                //if ($('#btn_SavePO').hasClass("d-none")) {
                //	$('#btn_SavePO').removeClass("d-none");
                //}
                //else {
                //	$('#btn_SavePO').addClass("d-none");
                //}
            }

            if (IsApproved == "0" && IsSentForApproval == "1") {
                $('#btn_CancelSendPONSndApprvl').show();
            }
            else {
                $('#btn_CancelSendPONSndApprvl').hide();
            }

            if (LineItemcount == "0") {
                $('#btn_RevisePO').hide();
                $('#btn_CommitPO').hide();
                $('#btn_CommitPONSndApprvl').hide();
                $('#btn_ViewPOPDF').hide();
                $('#btn_CommitPONSndApprvl1').hide(); //Proof PO

            }

            else {
                if (isCommited == "0") {
                    $('#btn_RevisePO').hide();
                    $('#btn_ViewPOPDF').hide();
                    $('#btn_CommitPONSndApprvl1').hide();
                }
                if (isCommited == "1") {
                    //vendor and vendor co modal click should be disabled
                    //txt_Comment textarea disabled in POcomment modal
                    //Po Taxes modal save button disabled
                    $('#AddLineItemPO').hide();
                    //in LineItem table addClass('disable-sort') disable the sort
                    $('#btn_ProofPONSndApprvl').hide();
                    $('#btn_CommitPO').hide();
                    $('#btn_CommitPONSndApprvl').hide();
                    $('.makedisable').attr('disabled', 'disabled');
                    $('#txt_comments').attr('disabled', 'disabled');
                    $('#saveCommentTaxDtl2').hide();


                }
                if (isCommited == "1" && IsSentForApproval == '0') {
                    $('#btn_CommitPO').hide();
                    $('#btn_CommitPONSndApprvl').hide();
                    $('#btn_ProofPONSndApprvl').hide();

                }
                if (IsApproved == '1' && isCommited == "0") {
                    $('#btn_ViewPOPDF').show();
                    $('#btn_ProofPONSndApprvl').hide();
                    $('#btn_CommitPONSndApprvl1').hide();
                }
                if ($("#hdn_InvoiceStatus").val().trim() != "Not Exists") {
                    $("#txt_VendorName").attr('disabled', 'disabled');
                }

            }
            if (CreatePOPermission == "0") {
                $('#btn_CopyPO').remove();
            }
        }

        var count = 0;


        $(document).on('click', '#PODetailsCollapse', function () {

            if ($("#btn_CreatePO").hasClass('d-none')) {

                $("#btn_CreatePO").removeClass('d-none');
                //getVendorList();
            }
            else {
                $("#btn_CreatePO").addClass('d-none');
            }
            if ($(this).hasClass('collapsed')) { // Check if it's expanding
                $('#PODetails').slideUp();
                toggleSavebuttons();
                return;
            }
            PODetailspartial();
        });

        function toggleSavebuttons() {

            var LineItemcount = $('#hdn_lineItemCount').val();
            var isCommited = $('#Hdn_iscommited').val();
            var isConfirmed = $('#Hdn_isConfirmed').val();
            var approveForVendor = $('#Hdn_approveforvendor').val();
            var vendorName = $("#Hdn_vendorname").val();
            var isApproved = $('#hdn_IsApproved').val();

            if (isCommited == "1") {


                if ($("#btn_SavePO").hasClass('d-none')) {

                    $("#btn_SavePO").removeClass('d-none');

                }
                else {
                    $("#btn_SavePO").addClass('d-none');
                }



            }
            if (LineItemcount !== "0" && isCommited == '1') {
                $('#btn_CreatePO').remove();

            }

            if (isConfirmed == "1") {
                $('#approveforvendor').removeAttr('data-bs-toggle');
                $('#approveforvendor').text("This PO has been already accepted").css('cursor', 'not-allowed');
            }
            else {
                if (approveForVendor == "1") {
                    $('#approveforvendor').text("Accept/Decline on behalf of " + vendorName);
                }
                else {
                    $('#approveforvendor').remove();
                }
            }

            if (isApproved == "0") {
                $('#approveforvendor').remove();
            }
        }

        function VendorConfirmationButtonToggle() {

            var poid = $('#Hdn_PurchaseOrderID').val();
            if (count == 0) {

                $.ajax({
                    url: "/PurchaseOrder/CheckVendorConfirm",
                    data: { POID: poid },
                    type: "GET",
                    dataType: "json",
                    async: false,

                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            $('#Hdn_IsVendorConfirmation').val(data.Result.result);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                        $(".loader").css("display", "none");

                    }
                });

                if ($('#Hdn_IsVendorConfirmation').val() == "0") {
                    $('#Vendorconfirmation').remove();
                }
                else if ($('#Hdn_IsVendorConfirmation').val() > 0) {
                    //redirect to polist;
                    var url1 = '/PurchaseOrder/POLIST?id=' + poid;
                    window.location.href = url1;
                }

                return;
            }

            if ($('#Hdn_IsVendorConfirmation').val() == 0) {
                $('#Vendorconfirmation').remove();
            }
            else if ($('#Hdn_IsVendorConfirmation').val() > 0) {
                //redirect to polist;
                var url2 = '/PurchaseOrder/POLIST?id=' + poid;
                window.location.href = url2;
            }

        }
        function PODetailspartial() {
            if (count > 0) {
                $('#PODetails').slideDown();
                toggleSavebuttons();
                VendorConfirmationButtonToggle();
                return;
            }
            var POID = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/PODetails",
                data: { POID: POID },
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {
                        $('#PODetails').html('');
                        $('#PODetails').html(data);
                        HideUnhideButton();
                        partialInvoiceData();
                        VendorConfirmationButtonToggle();
                        $('#txt_ArrivalDate').datepickercustom({
                            showButtonPanel: true,
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'MM dd yy',

                        });
                        $('#txt_CheckDate').datepickercustom({
                            showButtonPanel: true,
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'MM dd yy',

                        });
                        $("#txt_VendorName").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            single: true,

                        });
                        $("#txt_VendorCO").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            single: true,

                        });

                        $(".loader").css("display", "none");
                        count += 1;
                        toggleSavebuttons();
                        //$('#btn_CreatePO').addClass('d-none');

                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            });

        }

        $(document).on('click', '#btn_openpotax', function () {
            $('#po_taxes').modal('hide');
            HideUnhideButton();
            var POID = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/POTax",
                data: { POID: POID },
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    var alldata = data.Result;
                    if (data.IsSuccess) {
                        $('#GSTHSTName').val(alldata.gsthstName);
                        $('#Ddl_GSTPST').val(alldata.gsthstType);
                        $('#txt_GSTHST').val(alldata.gsthst);

                        $('#PSTName').val(alldata.pstName);
                        $('#Ddl_PST').val(alldata.pstType);
                        $('#txt_PSTValue').val(alldata.pst);

                        $('#StateTaxName').val(alldata.stateTaxName);
                        $('#Ddl_StateTax').val(alldata.stateTaxType);
                        $('#txt_StateTax').val(alldata.stateTax);

                        $('#po_taxes').modal('show');
                        $(".loader").css("display", "none");

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }

            });

        });

        $(document).on('click', '#comment_attachments', function () {
            debugger;
            HideUnhideButton();
            $('#popupforTaxComment').modal('show');
            var POID = $('#Hdn_PurchaseOrderID').val();
            POCommentsAttachement(POID);

        });
        function POCommentsAttachement(POid) {

            $.ajax({
                url: "/PurchaseOrder/POCommentsAttachments",
                data: { POID: POid },
                type: "GET",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#pocommentattachmodal').html('');
                        $('#pocommentattachmodal').html(data);
                        $('#popupforTaxComment').modal('hide');
                        $('#fileInput').val('');
                        $(".loader").css("display", "none");

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', "Something went Wrong !!!!");
                    }
                }

            });
        }

        $(document).on('change', '#txt_VendorCO', function () {
            if ($(this).val() == undefined || $(this).val() == null)
                return;
            //var vendorCoId = $(this).val() == undefined || $(this).val() == null ? "0" : $(this).val();
            var vendorCoId = $(this).val();
            $.ajax({

                url: "/PurchaseOrder/VendorCoAddress",
                data: { VendorCoId: vendorCoId },
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $('#txt_addr1').text('');
                        $('#txt_addr1').text(data.Result.address1);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })


        });

        $(document).on('click', '#addresslist', function () {
            var vendorCoId = $("#txt_VendorCO").val() == undefined || $("#txt_VendorCO").val() == null ? "0" : $("#txt_VendorCO").val().toString();
            var projectID = $('#Ddl_Project').val();
            $.ajax({
                url: "/PurchaseOrder/AddressList",
                data: { VendorID: vendorCoId, ProjectID: projectID },
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#vendorCoAddresslist').html('');
                        $('#vendorCoAddresslist').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', "Something went Wrong !!!!");
                    }
                }
            })


        });

        $(document).on('click', '.chooseaddress', function () {
            var address = $(this).text();
            $('#txt_addr1').text('');
            $('#txt_addr1').text(address);
            $('#addresslistmodal').modal('hide');
        });

        $(document).on('click', '#saveCommentTaxDtl2', function () {

            var GSTName = $('#GSTHSTName').val();
            var GSTType = $('#Ddl_GSTPST').val();
            var GST = $('#txt_GSTHST').val();

            var PSTName = $('#PSTName').val();
            var PSTType = $('#Ddl_PST').val();
            var PST = $('#txt_PSTValue').val();

            var Statetaxname = $('#StateTaxName').val();
            var StateTaxType = $('#Ddl_StateTax').val();
            var Statetax = $('#txt_StateTax').val();

            var poId = $('#Hdn_PurchaseOrderID').val();

            let fd = {
                POID: poId,
                GSTHST: GST == "" || GST == undefined || GST == null ? 0 : GST,
                GSTHSTType: GSTType,
                PST: PST == "" || PST == undefined || PST == null ? 0 : PST,
                PSTType: PSTType,
                StateTax: Statetax == "" || Statetax == undefined || Statetax == null ? 0 : Statetax,
                StateTaxType: StateTaxType,
                GSTHSTName: GSTName,
                PSTName: PSTName,
                StateTaxName: Statetaxname,
            };
            $.ajax({
                url: "/PurchaseOrder/POTaxUpdate",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        PODetailspartial();
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            })

        });

        //file Upload functions

        var ProjectAtcfiledata = {};
        var ProjectAtcfiledatacount = 0;
        $(document).on("change", "#polevelfileupload", function () {

            if (this.files.length == 0)
                return;

            if (this.files.length > 15) {
                notify(false, "Please select less than 15 files at a time.", false);
                $(this).val('');
                return;
            }
            var inputFiles = $("#polevelfileupload")[0].files;

            for (var i = 0; i < inputFiles.length; i++) {
                var newFile = inputFiles[i];
                var fileKey = "file" + ProjectAtcfiledatacount;

                ProjectAtcfiledata[fileKey] = newFile;

                var html = "<li class='filesul' data-filekey='" + fileKey + "'>";
                html += newFile.name;
                html += ' <a href="javascript:void(0);" class="deletePOLevelFile" id="delPOLevelfile"><i class="fa-solid fa-trash-can"></i></a></li>';

                ProjectAtcfiledatacount++;

                $(this).closest(".divbind").find(".filelist").append(html);

            }

        });
        $(document).on("click", ".deletePOLevelFile", function () {
            var liElement = $(this).closest('li');
            var fileKey = liElement.data('filekey');
            delete ProjectAtcfiledata[fileKey];
            liElement.remove();
            $('#polevelfileupload').val('');
        });

        $(document).on('click', '#savecomment_attachment', function () {

            var filestoexpose = '';
            $('.downloadablefile').each(function () {

                if ($(this).is(':checked')) {

                    let filename = $(this).attr('data-fldid');
                    filestoexpose += filestoexpose == '' ? filename + '|||' + 1 : '^^^' + filename + '|||' + 1;
                }
                else {
                    let filename = $(this).attr('data-fldid');
                    filestoexpose += filestoexpose == '' ? filename + '|||' + 0 : '^^^' + filename + '|||' + 0;
                }

            });

            var poId = $('#Hdn_PurchaseOrderID').val();
            var comment = $('#txt_comments').val();

            var formData = new FormData();
            formData.append("POCommentsAttachmentsSaveDTO.Comment", comment);
            formData.append("POCommentsAttachmentsSaveDTO.POId", poId);
            formData.append("POCommentsAttachmentsSaveDTO.File", filestoexpose);
            for (var key in ProjectAtcfiledata) {
                formData.append(key, ProjectAtcfiledata[key]);
            }

            $.ajax({
                url: "/PurchaseOrder/POCommentsAttachmentsSave",
                data: formData,
                type: "POST",
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#polevelfileupload').val('');
                        ProjectAtcfiledata = {};
                        var POID = $('#Hdn_PurchaseOrderID').val();
                        POCommentsAttachement(POID);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);    
                    }
                }
            })




        });

        $(document).on('click', '#getpoexnotes', function () {
            if ($(this).attr("aria-expanded") == "false") {
                return;
            }
            var poId = $('#Hdn_PurchaseOrderID').val();
            POExpediteNote(poId);

        });
        function POExpediteNote(POID) {
            $.ajax({
                url: "/PurchaseOrder/POExpediteNote",
                type: "POST",
                data: { POID: POID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#poexpeditenotelist').html('');
                        $('#poexpeditenotelist').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        notify(false, "Something Went Wrong.", false);
                        $(".loader").css("display", "none");

                    }
                }
            })
        }

        $(document).on('click', '#addExpNote', function () {
            var poId = $('#Hdn_PurchaseOrderID').val();
            var ExpediteNote = $('#txt_ExpediteNotes').val();
            if (ExpediteNote == "" || ExpediteNote == undefined || ExpediteNote == null) {
                notify(false, "Please enter note", true);
                return;
            }
            let fd = {
                POID: poId,
                Notes: ExpediteNote.trim()
            }
            $.ajax({
                url: "/PurchaseOrder/SavePOExpediteNotesFromPOPage",
                type: "POST",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    let title = "";
                    if (data.IsSuccess) {
                        $('#txt_ExpediteNotes').val('');
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        POExpediteNote(poId);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })

        });

        $(document).on('click', '.expeditenotecontent', function () {
            var FldId = $(this).data('id');
            var content = $(this).data('content');
            $('#expnotedata').val(content);
            $('#hiddennotefldid').val(FldId);
        });

        $(document).on('click', '#updateexpeditenote', function () {

            var FldID = $('#hiddennotefldid').val();
            var note = $('#expnotedata').val();
            if (note == "" || note == undefined || note == null) {
                $('#expnotedata').focus();
                notify(false, 'Please enter note', true);
                return;
            }
            let fd = {
                FldId: FldID,
                Note: note.trim()
            }
            $.ajax({
                url: "/PurchaseOrder/SaveUpdatedPOExpediteNotesFromPOPage",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $('#expnotedata').val('');
                        $.notify.success('Success', data.Result);
                        $('#expeditenoteedit').modal('hide');
                        $(".loader").css("display", "none");
                        let POID = $('#Hdn_PurchaseOrderID').val();
                        POExpediteNote(POID);

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        })

        $(document).on('click', '.deleteexpnote', function () {
            var FldId = $(this).data('expid');
            $.confirm({
                title: '',
                message: "Are you sure you want to delete?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    
                    $.ajax({
                        url: "/PurchaseOrder/DeletePOExpediteNotesFromPOPage",
                        data: { FldID: FldId },
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                $(".loader").css("display", "none");
                                let POID = $('#Hdn_PurchaseOrderID').val();
                                POExpediteNote(POID);
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    })
                },
                onCancel: function () {
                    return;
                }
            });            
        });

        $(document).on('click', '.deletepoexpnote1', function () {
            var fldId = $(this).data('id');

            $.confirm({
                title: 'Delete',
                message: 'Do you really want to delete the note?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/PurchaseOrder/DeletePOExpNote",
                        data: { FldID: fldId },
                        type: "POST",
                        dataType: "json",

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                const POLIID = $('#hdn_poli').val();

                                $('a.expNotebtn[data-lineitemid="' + POLIID + '"]').trigger('click');
                                $('#po_exp_note').modal('hide');
                                $(".loader").css("display", "none");
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }


                        }
                    });
                },
                onCancel: function () {
                    return;
                }
            });


        });

        $(document).on('click', '.deletePOLevelFileList', function () {
            var fileId = $(this).data('fileid');
            var Filename = $(this).data('filename');
            $.confirm({
                title: '',
                message: 'Are you sure you want to delete the file? OK for yes Cancel for no.',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/PurchaseOrder/DeletePOLevelFileList",
                        type: "POST",
                        data: { FldID: fileId, FileName: Filename },
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                $(".loader").css("display", "none");
                                var POID = $('#Hdn_PurchaseOrderID').val();
                                POCommentsAttachement(POID);
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    })
                },
                onCancel: function () {
                    return;
                }
            });

        });

        $(document).on('click', '.filelistforpo', function () {
            var fileId = $(this).data('checkid');
            $.ajax({
                url: "/PurchaseOrder/SetExposedPOLevelFileList",
                type: "POST",
                data: { FldId: fileId },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $(".loader").css("display", "none");
                        let POID = $('#Hdn_PurchaseOrderID').val();
                        POCommentsAttachement(POID);
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on('keyup', '#searchPOFile', function () {
            var tmp = 0;
            var txt = $(this).val().toUpperCase();
            $('.fileUpload li').each(function () {
                var valtxt = $(this).find('a').text().toUpperCase();

                if (!valtxt.includes(txt.toUpperCase())) {
                    $(this).addClass('d-none');
                }
                else {
                    $(this).removeClass('d-none');
                    tmp++;
                }
            });

            $('#filesofpolevelnumber').html(tmp + " File(s) found");
        });

        polineItems();
        function polineItems() {
            var POID = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/GetAllPOLineItems",
                data: { POID: POID },
                type: "GET",
                //async:false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {

                        $('#polineitemtable').html('');
                        $('#polineitemtable').html(data);
                        POLineItemsDataTable();
                        sortPOLItable();

                        var tax = $.trim($('.po_table tfoot tr td:eq(8)').html()?.split('<br>')[1] || '0.00');
                        $("#txt_CalculatedTaxAmount").val(tax);

                        $(".loader").css("display", "none");

                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', "Something Went Wrong.");
                    }
                }
            })
        }

        var tabledata = [];
        let allExpanded = false;

        function sortPOLItable() {

            $("#po_table tbody").sortable(
                {
                    handle: ".sortrow",
                    cancel: ".Deactive-sort",
                    cursor: "move",
                    start: function (event, ui) {
                        // 0 based array, add one
                        var obj = ui.item;
                        $(obj).removeClass('selected');
                        $(obj).css('background', '#86ABC2');

                    },
                    update: function (event, ui) {

                        var obj = ui.item;
                        var obj2 = ui.item.prev('tr');//for previous value
                        var st = $(obj).attr('data-id');
                        var lt = $(obj2).attr('data-id');
                        if (parseInt(lt) < parseInt(st)) {
                            obj2 = ui.item.next('tr');
                            lt = $(obj2).attr('data-id');
                        }
                        if (lt == undefined) {
                            lt = 1;
                        }
                        var poid = $('#Hdn_PurchaseOrderID').val();

                        let fd = {
                            Prev: st,
                            Current: lt,
                            POID: parseInt(poid)
                        };

                        $.ajax({
                            url: "/PurchaseOrder/SortPOLineItem",
                            type: "POST",
                            data: fd,
                            dataType: "json",
                            async: false,
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                if (data.IsSuccess) {
                                    $.notify.success('Success', data.Result);

                                    window.setTimeout(() => {
                                        polineItems();
                                    }, 500);
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                    $(".loader").css("display", "none");
                                }
                            }
                        });

                    },
                    stop: function (event, ui) {
                        var obj = ui.item;
                        $(obj).removeClass('selected');
                        //$(obj).css('background', '');
                        //$('.ui-widget-content').css('display', 'none');
                    }
                    // end of drag
                });
        }
        function POLineItemsDataTable() {

            if ($.fn.DataTable.isDataTable("#po_table")) {
                $('#po_table').DataTable().clear().destroy();
            }

            //$("#po_table thead tr")
            //          .clone(true)
            //          .addClass("filterpo")
            //          .appendTo("#po_table thead");

            var table = $("#po_table").DataTable({
                autoWidth: false,
                //scrollX: true,    
                paging: false,
                order: [],
                fixedHeader: true,
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                //"pageLength": 10,
                //orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    //{ className: "dt-head-nowrap", targets: "_all" },

                    { "orderable": false, "targets": "_all" },
                    { "targets": [10, 11], "className": "d-none" }

                ],
                //"order": [],
                //fixedHeader: true,
                //"paging": false,
                //orderCellsTop: true,

                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filterpo th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();



                        // Handle keyup event for filtering
                        $("input", $(".filterpo th").eq($(api.column(colIdx).header()).index()))
                            .off("keyup")
                            .on("keyup", function () {
                                var searchTerm = $(this).val();
                                $(this).attr("title", searchTerm);

                                var regexr = "({search})";
                                api.column(colIdx)
                                    .search(
                                        searchTerm !== "" ? regexr.replace("{search}", "(((" + searchTerm + ")))") : "",
                                        searchTerm !== "",
                                        searchTerm === ""
                                    )
                                    .draw();
                            });
                        //$('.dt-search').css("display", "none");

                        //add the sortable function


                    });

                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#po_table tbody').html(
                            '<tr><td colspan="12" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                    tabledata = api.rows().data().toArray();

                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });

            $('#po_table tbody ').on('click', 'a.editpolineitems', function (e) {

                e.preventDefault();
                $(this).toggleClass("arrwbtn");
                var tr = $(this).closest('tr');
                //var tr1 = $(this).parent().parent('tr');
                var row = table.row(tr);
                var lineItemId = $(this).data('poitemid');
                var status = $(this).data('status');

                var DIVID = "#RowExpand_" + lineItemId;
                var TRID = "For_TR_" + lineItemId;
                var TDID = "For_TD_" + lineItemId;
                var UOMID = $(this).data('uom');


                if (row.child.isShown()) {
                    // Close the row
                    var TRIDS = "." + TRID;

                    if (!tr.hasClass('shown')) {
                        $(TRIDS).css('display', '');
                        tr.addClass('shown');
                    }
                    else {

                        $(TRIDS).css('display', 'none');
                        tr.removeClass('shown');


                    }
                    //row.child().css('display', 'none');


                } else {
                    // Open the row

                    row.child(format(row.data(), lineItemId, row)).show();
                    $(DIVID).parent().addClass(TDID);
                    $(DIVID).parent().parent().addClass(TRID);
                    UOMList(UOMID, lineItemId);

                    tr.addClass('shown');
                    var fontsize = "";
                    for (var a = 5; a <= 22; a = a + 0.5) {
                        fontsize += fontsize == "" ? a + "px" : " " + a + "px";
                    }
                    let id = "#txt_LineItemDtldDesc_" + lineItemId;
                    tinymce.remove(id);
                    tinymce.init({
                        selector: id,
                        fontsize_formats: fontsize,
                        plugins: "textcolor,fullscreen,image",
                        toolbar: "image | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                        , menubar: false
                        , height: "300px"
                        , image_list: [
                            { title: 'Logo 1', value: '../images/BridgeLogo6-darker2.png' },

                        ],
                        setup: function (ed) {
                            ed.on('keydown', function (e) {
                                var kc = e.key.charCodeAt(0);
                                ////console.log(kc);

                                if (kc >= 97 && kc <= 122 && e.ctrlKey == false && e.shiftKey == false && e.altKey == false) {
                                    tinymce.activeEditor.execCommand('mceInsertContent', true, String.fromCharCode(kc - 32));
                                    return false;
                                }

                            });
                            ed.on('focusin', function (e) {

                                ed.theme.resizeTo("100%", 480);
                                window.location = window.location.href.split('#')[0] + '#editor';
                            });

                        },

                    });

                }

            });



            $('#toggle-expand-all').on('click', function () {

                $(".loader").css("display", "flex");
                table.rows().every(function () {
                    var row = this;
                    var lineItemId = row.data()[10].split("|")[0];
                    var $link = $(row.node()).find('a.editpolineitems');
                    $link.trigger('click');
                });
                $(".loader").css("display", "none");
            });

        }

        //variables

        var itemDtlDescription = "";
        var itemDescription = "";
        var itemNumber = "";
        var sectionName = "";
        var Spec = "";
        var Model = "";
        var GSTHST = 0;
        var PST = 0;
        var StateTax = 0;
        var tag = "";
        var tagging = "";
        var html = "";
        var NoStateTax = "";
        var NOGST = "";
        var NoPST = "";
        var nonfrieght = "";
        var isApproved = "";


        // end variables
        function format(rowData, lineItemId, row) {

            var POId = $('#Hdn_PurchaseOrderID').val();
            var isCommitted = $('#Hdn_iscommited').val();

            if (!$(row.node()).hasClass('clicked')) {
                $.ajax({
                    url: "/PurchaseOrder/GetPOLineItemByPOLineItemsId",
                    type: "POST",
                    data: { POLineItemId: lineItemId, POID: POId },
                    dataType: "json",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {

                        if (data.IsSuccess) {
                            var result = data.Result;
                            UOMID = result.uom;
                            itemDtlDescription = decodeURI(result.itemDtldDesc);
                            itemDtlDescription = itemDtlDescription.replace(/<\/br>/g, "&nbsp;");
                            itemDescription = result.itemDescription;
                            itemNumber = result.itemNumber;
                            sectionName = result.sectionName;
                            Spec = result.spec;
                            Model = result.model;
                            tag = result.tag;
                            tagging = result.tagging;
                            tagging = tagging.replace(/\\n/g, "%0A");
                            GSTHST = result.gsthst;
                            PST = result.pst;
                            StateTax = result.stateTax;
                            NoStateTax = result.noStateTax;
                            NOGST = result.noGST;
                            NoPST = result.noPST;
                            nonfrieght = result.nonfrieght == true ? "1" : "0";
                            isApproved = result.isApproved == true ? "1" : "0";

                            var taxHtml = `
                                <div class="col-lg-6">
                                    <div class="d-flex flex-wrap gap-3 align-items-center">
                                        <label>
                                            <input type="checkbox" ${NOGST == false ? "checked" : ""} id="chk_GSTHSTTx_${lineItemId}">
                                            ${GSTHST}
                                        </label>
                            `;

                            if (PST != 0) {
                                taxHtml += `
                                    <label>
                                        <input type="checkbox" ${NoPST == false ? "checked" : ""} id="chk_PSTTx_${lineItemId}">
                                        ${PST}
                                    </label>`;
                            }

                            if (StateTax != 0) {
                                taxHtml += `
                                    <label>
                                        <input type="checkbox" ${NoStateTax == false ? "checked" : ""} id="chk_StateTx_${lineItemId}">
                                        ${StateTax}
                                    </label>`;
                            }

                            taxHtml += `</div></div>`;


                            html = `
				            <div class="expanded-content" id="RowExpand_${lineItemId}">
				             <div class="row gy-2 custom_gutter5-x">
					              <div class="col-lg-6">
						            <h2 class="section_header mb-3" id="ponumbershow_${lineItemId}">${itemNumber} - ${itemDescription}</h2>
						            <div class="row custom_gutter5-x">
						              <div class="col-lg-4">
							            <div class="frm_fld_wrp">
							              <label for="" class="form-label">Section</label>
							              <input type="text" class="form-control" value="${sectionName}" id="Section_${lineItemId}" disabled>
							            </div>
						              </div>
						              <div class="col-lg-4">
							            <div class="frm_fld_wrp">
							              <label for="" class="form-label">Item Description</label>
							              <input type="text" class="form-control" value="${itemDescription}" id="txt_LintItemDesc_${lineItemId}" disabled>
							            </div>
						              </div>
						              <div class="col-lg-4">
							            <div class="frm_fld_wrp">
							              <label for="" class="form-label">Spec</label>
							              <input type="text" class="form-control" value="${Spec}" id="txt_LineItemSpec_${lineItemId}" disabled>
							            </div>
						              </div>
						              <div class="col-lg-4">
							            <div class="frm_fld_wrp">
							              <label for="" class="form-label">Model</label>
							              <input type="text" class="form-control" value="${Model}" id="txt_LineItemModel_${lineItemId}" disabled>
							            </div>
						              </div>
						              <div class="col-lg-4">
							            <div class="frm_fld_wrp">
							              <label for="" class="form-label" >UOM</label>

							              <select class="form-select uomddl" id="uomdd_${lineItemId}">
								            <option value="0" selected>--Select--</option>
								

							              </select>
							            </div>
						              </div>
						              <div class="col-lg-6 activity_tag">
							            <label class="mb-2"><input type="checkbox" ${tag == true ? "checked" : ""} id="chk_ActvTg_${lineItemId}"> Active tag </label>
							            <textarea class="form-control" cursor: pointer; style="min-height: 90px;font-weight: bold;" id="txt_LineItemAutoTagg_${lineItemId}" readonly>${tagging}</textarea>
						              </div>
                                      <div class="col-lg-6">
							            
						              </div>
                                      <br>
						              ${taxHtml}                          
						            </div>
					              </div>
						            <div class="col-lg-6">
							            <h2 class="section_header mb-3">Item Detailed Description ${itemNumber}</h2>
							            <textarea id="txt_LineItemDtldDesc_${lineItemId}" class="ckeditor" ${isCommitted == "1" ? "disabled" : ""}>${itemDtlDescription}</textarea>
						             </div>
						             <input type="hidden" id="hdn_IsApproved_${lineItemId} value="${nonfrieght}"/>
						             <input type="hidden" id="hdn_Nonfreight_${lineItemId}" value="${isApproved}" />
						            </div>
					            </div>`;
                            $(row.node()).addClass('clicked');

                            $(".loader").css("display", "none");

                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }

            return html;
        }
        function UOMList(UOMID, lineItemID) {

            $.ajax({
                url: "/Budget/GetAllUOMinBudgetDetails",
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    let id = "#uomdd_" + lineItemID;
                    var dropdown = $(id);
                    dropdown.empty();
                    dropdown.append('<option value="0">--Select UOM--</option>');

                    if (data.IsSuccess) {
                        data.Result.forEach(function (item) {
                            var option = $('<option></option>')
                                .val(item.uoM_ID)
                                .text(item.uom);

                            // Set selected based on UOM value
                            if (UOMID == item.uoM_ID) {
                                option.prop('selected', true);
                            }

                            dropdown.append(option);
                        });
                        $(".loader").css("display", "none");
                    } else {
                        $(".loader").css("display", "none");
                        console.error("Error loading data:", data.ErrorMessages);
                        notify(false, data.ErrorMessages, true);
                    }
                }
            });
        }

        var restrictSelection = false;

        $(document).on('click', '.disable-sort', function (event) {
            restrictSelection = true;
        });

        $(document).on('click', '#po_table tr', function (event) {
            $(this).css('background', '');
            $(this).on('click', '.disable-sort', function (event) {
                restrictSelection = true;
            });

            if (restrictSelection) {
                restrictSelection = false;
                return;
            }
            var iscommitted = $('#Hdn_iscommited').val();
            restrictSelection = false;

            if (iscommitted == '1')
                return;

            var clickedrowPOLineItemid = $(this).attr("data-poitemid");

            if (clickedrowPOLineItemid == null || clickedrowPOLineItemid == undefined)
                return;

            var clickedrowindex = $(this).attr('data-id');
            var closestrow = "";

            if (!event.ctrlKey && !event.shiftKey) {
                var ln = $('.selected').length;
                var hclass = false;
                hclass = $(this).hasClass('selected');
                cancelselections();
                if (hclass && ln == 1) {
                    $(this).addClass('selected');
                }
            }

            if (event.shiftKey) {
                var allids = "";
                var short = 999999;
                $('.selected').each(function () {
                    var id = $(this).attr('data-id');
                    var diff = clickedrowindex - id;
                    if (diff < 0) {
                        diff = 0 - diff;
                    }
                    if (diff < short) {
                        closestrow = $(this).attr('data-id');
                        short = diff;
                    }
                    if (allids == "") {
                        allids = id;
                    }
                    else {
                        allids += "," + id;
                    }
                });

                $('.selected').each(function () {
                    var currtmp = $(this).attr("data-id");
                    if (currtmp !== closestrow) {
                        $(this).removeClass('selected');
                        if ($(this).hasClass('odd')) {
                            $(this).css('background-color', '');
                        }
                        else {
                            $(this).css('background-color', '');
                        }
                    }
                });

                var isunderrange = 0;
                $('#po_table tbody tr').each(function () {
                    if (isunderrange == 1) {
                        if (!$(this).hasClass('selected')) {
                            $(this).addClass('selected');
                        }
                        else {
                            isunderrange = 0;
                            return;
                        }
                    }
                    else if ($(this).hasClass('selected')) {
                        isunderrange = 1;
                    }
                    var currentrowid = $(this).attr("data-poitemid");
                    if (currentrowid == clickedrowPOLineItemid) {
                        if (isunderrange == 1) {
                            isunderrange = 0;
                            return;
                        }
                        else {
                            $(this).addClass('selected');
                            isunderrange = 1;
                        }
                    }

                });
                return;
            }

            $(this).toggleClass('selected');
            if (!$(this).hasClass('selected')) {
                if ($(this).hasClass('odd')) {
                    $(this).css('background-color', '');
                }
                else {
                    $(this).css('background-color', '');
                }
            }
            else {
                $(this).addClass('selected');
            }
            checkselected();

        });

        function cancelselections() {
            $('.selected').each(function () {
                $(this).removeClass('selected');
                if ($(this).hasClass('odd')) {
                    $(this).css('background-color', '#f9f9f9');
                }
                else {
                    $(this).css('background-color', '#fff');
                }
            });
            checkselected();
        }
        function checkselected() {
            var items = $('.selected').length;
            if (items == 0) {
                $('#removemultiple').hide();
                return;
            }

            $('#removemultiple').show();
            if (items == 1) {
                $('#dragger').show();
            }
            else {
                $('#dragger').hide();
            }

        }

        $(document).on('click', '#cancelselections', function () {
            cancelselections();
        });

        $(document).on('click', '.save_po_lineitems', function () {
            let POLineItemId = $(this).data('id');
            let Quantity = $(this).parent().parent().find('td.Edit_Line').children('.LineItem_Quantity').val();
            let Cost = $(this).parent().parent().find('td.Edit_Line_Cost').children('.LineItem_Cost').val();

            let prevCost = $(this).parent().parent().find('td.Edit_Line_Cost').children('.LineItem_Cost').data('prevcost');
            let prevQuantity = $(this).parent().parent().find('td.Edit_Line').children('.LineItem_Quantity').data('prevquantity');

            let id = "#LineItemEdit_" + POLineItemId;
            let tr = $(id).parent().parent('tr');

            let DTable2 = $('#po_table').DataTable({
                paging: false,
                searching: false,
                retrieve: true,
            });
            Cost = parseFloat(Cost.replace(",", ""))
            let row = DTable2.row(tr);
            if (row.child.isShown()) {
                UpdateLineItem(parseFloat(Quantity), Cost, POLineItemId, prevCost, prevQuantity);
            } else {
                UpdateOnlyQuantityAndCost(parseFloat(Quantity), Cost, POLineItemId);
            }
            cancelselections();

        });
        function UpdateLineItem(Quantity, Cost, POLineItemID, prevCost, prevQuantity) {
            if (Quantity == undefined || Quantity == null) {
                notify(false, "Please enter Line Item Qty", false);
                return;
            }
            var confrm = true;

            var UID = "#uomdd_" + POLineItemID;
            var LineItemUnt = $(UID).val();
            if (LineItemUnt == 0 || LineItemUnt == undefined) {
                notify(false, "Please Select a Line Item Unit", false);
                $(UID).focus();
                return;
            }
            if (Cost == undefined || Cost == 0) {
                notify(false, "Please enter Line Item Costs", false);
                return;
            }
            if (Cost <= 0) {
                notify(false, "Please enter correct Line Item Costs", false);
                return;
            }
            var allowedval = parseFloat(checkEditablevalueNew(POLineItemID));

            if (parseFloat(Quantity) * parseFloat(Cost) < allowedval) {
                /*cango = confirm("Item is having total value less than invoiced value. Do you want to continue?");*/
                $.confirm({
                    title: 'Warning',
                    message: 'Item is having total value less than invoiced value. Do you want to continue?',
                    type: 'warning',
                    confirmText: 'Continue',
                    cancelText: 'Go Back',
                    onConfirm: function () {
                        proceedUpdate(Quantity, Cost, POLineItemID, prevCost, prevQuantity);
                    },
                    onCancel: function () {
                        return;
                    }
                });
                return;
            }
            proceedUpdate(Quantity, Cost, POLineItemID, prevCost, prevQuantity);            

        }

        function proceedUpdate(Quantity, Cost, POLineItemID, prevCost, prevQuantity) {

            var confrm = true;
            var changed = 0;

            var NID = "#hdn_Nonfreight_" + POLineItemID;
            var AID = "#hdn_IsApproved_" + POLineItemID;

            // Approved Non-freight change check
            if ($(NID).val() == '0' && $(AID).val() == '1') {

                if ((parseFloat(prevCost) * parseFloat(prevQuantity)) !=
                    (parseFloat(Quantity) * parseFloat(Cost))) {

                    changed = 1;
                    confrm = window.confirm(
                        "You are changing the total of a Non-freight item from an approved PO. " +
                        "This will make this PO unapproved. Do you still want to save this item?"
                    );
                }
            }

            if (!confrm) {
                return;
            }

            // TinyMCE description
            var DTLID = "txt_LineItemDtldDesc_" + POLineItemID;
            var LineItemDtldDesc = tinyMCE.get(DTLID).getContent();
            LineItemDtldDesc = LineItemDtldDesc
                .replace(new RegExp("<p style", 'g'), "<div style")
                .replace(new RegExp("</p>", 'g'), "</div>")
                .replace(new RegExp("&nbsp;", 'g'), "</br>");
            LineItemDtldDesc = encodeURI(LineItemDtldDesc);

            // Active Tag
            var ATGID = "#chk_ActvTg_" + POLineItemID;
            var ActvTg = $(ATGID).is(':checked') ? '1' : '0';

            var NoStateTx = true;
            var NST = "#chk_StateTx_" + POLineItemID;
            if ($(NST).is(':checked') == true) {
                NoStateTx = false;
            }

            // GST/HST
            var NoGSTHSTTx = true;
            var NTID = "#chk_GSTHSTTx_" + POLineItemID;
            if ($(NTID).is(':checked') == true) {
                NoGSTHSTTx = false;
            }
            
            var NoPSTTx = true;
            var PTID = "#chk_PSTTx_" + POLineItemID;
            if ($(PTID).is(':checked') == true) {
                NoPSTTx = false;
            }

            var TGID = "#txt_LineItemAutoTagg_" + POLineItemID;
            var LineItemAutoTagg = $(TGID).val() || "";

            var PurchaseOrderID = $('#Hdn_PurchaseOrderID').val();

            var UID = "#uomdd_" + POLineItemID;
            var LineItemUnt = $(UID).val();

            let fd = {
                POLineItemID: POLineItemID,
                POID: PurchaseOrderID,
                Cost: Cost,
                Quantity: Quantity,
                Tag: ActvTg == '1' ? true : false,
                Tagging: LineItemAutoTagg,
                UOMID: LineItemUnt,
                ItemDtldDesc: LineItemDtldDesc || "",
                changed: changed,
                isShown: 1,
                NoState: NoStateTx,
                NoGSHT: NoGSTHSTTx,
                NoPST: NoPSTTx,
            };

            $.ajax({
                url: "/PurchaseOrder/SaveUpdatedPOLineItem",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);

                        var id1 = "#Quantity_" + POLineItemID;
                        var id2 = "#Cost_" + POLineItemID;

                        $(id1).val(Quantity);
                        $(id2).val(Cost);

                        window.setTimeout(() => {
                            polineItems();
                        }, 200);
                    }
                    else {
                        if (data.ErrorMessages && data.ErrorMessages.length > 0) {
                            $.notify.error('Error', data.ErrorMessages.join(', '));
                        } else {
                            $.notify.error('Error', "Something went wrong while saving.");
                        }
                    }
                },
                error: function () {
                    $(".loader").css("display", "none");
                    $.notify.error('Error', "Server error while saving line item.");
                }
            });
        }


        function checkEditablevalueNew(POLineItemID) {

            var amount = 0;
            $.ajax({
                url: "/PurchaseOrder/GetInvoiceAmountForPOLineItem",
                data: { POLineItemId: POLineItemID },
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.IsSuccess) {
                        amount = data.Result.invoiceAmount;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
            return amount;
        }

        function UpdateOnlyQuantityAndCost(Quantity, Cost, POLineItemID) {

            if (Quantity == "" || Quantity == null || Quantity == undefined) {
                $.notify.error('Error', "Please Enter Quantity");

                return;
            }

            if (Cost == "" || Cost == null || Cost == undefined) {
                $.notify.error('Error', "Please Enter Cost");
                return;
            }
            if (Cost <= "0") {
                $.notify.error('Error', "Please enter correct Line Item Costs");
                return;
            }
            let fd = {
                POLineItemID: POLineItemID,
                Cost: Cost,
                Quantity: Quantity,
            };

            $.ajax({
                url: "/PurchaseOrder/UpdateQuantityandCostPOLineItem",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        var id1 = "#Quantity_" + POLineItemID;
                        var id2 = "#Cost_" + POLineItemID;

                        $(id1).val("");
                        $(id1).val(Quantity);
                        $(id2).val("");
                        $(id2).val(Cost);
                        $(".loader").css("display", "none");
                        polineItems();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })

        }

        var updatedPOLineItems = [];

        $(document).on('click', '#btn_SaveAll', function () {

            $('#po_table tbody tr').each(function () {
                var POLineItemId = $(this).data('poitemid');
                if (!POLineItemId) {
                    return;
                }
                var hasError = false;
                var Quantity = $(this).find('td.Edit_Line').children('.LineItem_Quantity').val();
                var Cost = $(this).find('td.Edit_Line_Cost').children('.LineItem_Cost').val();

                var prevCost = $(this).find('td.Edit_Line_Cost').children('.LineItem_Cost').data('prevcost');
                var prevQuantity = $(this).find('td.Edit_Line').children('.LineItem_Quantity').data('prevquantity');

                var id = "#LineItemEdit_" + POLineItemId;
                var tr = $(id).closest('tr');

                var DTable2 = $('#po_table').DataTable({
                    paging: false,
                    searching: false,
                    retrieve: true
                });
                var PurchaseOrderID = $('#Hdn_PurchaseOrderID').val();
                let fd = {
                    POLineItemID: 0,
                    POID: 0,
                    Cost: 0,
                    Quantity: 0,
                    Tag: false,
                    Tagging: "",
                    UOMID: 0,
                    ItemDtldDesc: "",
                    changed: 0,
                    UserId: 0,
                    isShown: 0,
                };
                var row = DTable2.row(tr);

                if (row.child.isShown()) {
                    if (Quantity == undefined || Quantity == null) {
                        $.notify.error('Error', "Please enter Line Item Qty");
                        hasError = true;
                    }
                    var confrm = true;
                    var UID = "#uomdd_" + POLineItemId;
                    var LineItemUnt = $(UID).val();
                    if (LineItemUnt == 0 || LineItemUnt == undefined) {
                        $.notify.error('Error', "Please Select a Line Item Unit");
                        $(UID).focus();
                        hasError = true;
                    }
                    if (Cost == undefined || Cost == 0) {
                        $.notify.error('Error', "Please enter Line Item Costs");
                        hasError = true;
                    }
                    if (Cost <= 0) {
                        $.notify.error('Error', "Please enter correct Line Item Costs");
                        hasError = true;
                    }
                    var NID = "#hdn_Nonfreight_" + POLineItemId;
                    var AID = "#hdn_IsApproved_" + POLineItemId;
                    var changed = 0;
                    var allowedval = parseFloat(checkEditablevalueNew(POLineItemId));
                    var cango = true;

                    if (parseFloat(Quantity) * parseFloat(Cost) < allowedval) {
                        cango = confirm("Item is having total value less than invoiced value. Do you want to continue?");
                    }
                    if (!cango) {
                        hasError = true;
                    }

                    if ($(NID).val() == '0' && $(AID).val() == '1') {

                        if ((parseFloat(prevCost) * parseFloat(prevQuantity)) != (parseFloat(LineItemQty) * parseFloat(LineItemCosts))) {
                            changed = 1;
                            confrm = window.confirm("You are changing the total of a Non-freight item from an approved PO. This will make this PO unapproved. Do you still want to save this item?")
                        }

                    }
                    if (!confrm) {
                        hasError = true;
                    }
                    var DTLID = "txt_LineItemDtldDesc_" + POLineItemId;
                    var LineItemDtldDesc = tinyMCE.get(DTLID)?.getContent() || "";
                    LineItemDtldDesc = LineItemDtldDesc.replace(new RegExp("<p style", 'g'), "<div style").replace(new RegExp("</p>", 'g'), "</div>").replace(new RegExp("&nbsp;", 'g'), "</br>");
                    LineItemDtldDesc = encodeURI(LineItemDtldDesc);

                    var ATGID = "#chk_ActvTg_" + POLineItemId;
                    var ActvTg = false;
                    if ($(ATGID).is(':checked') == true) {
                        ActvTg = true
                    }

                    var NoStateTx = true;
                    var NST = "#chk_StateTx_" + POLineItemId;
                    if ($(NST).is(':checked') == true) {
                        NoStateTx = false;
                    }

                    var NoGSTHSTTx = true;
                    var GTID = "#chk_GSTHSTTx_" + POLineItemId;                   
                    if ($(GTID).is(':checked') == true) {
                        NoGSTHSTTx = false;
                    }

                    var NoPSTTx = true;
                    var PTID = "#chk_PSTTx_" + POLineItemId;
                    if ($(PTID).is(':checked') == true) {
                        NoPSTTx = false;
                    }

                    var TGID = "#txt_LineItemAutoTagg_" + POLineItemId;
                    var LineItemAutoTagg = $(TGID).val();
                    var MID = "#txt_LineItemModel_" + POLineItemId;
                    var Model = $(MID).val();
                    if (!hasError) {

                        fd = {
                            POLineItemID: POLineItemId,
                            POID: PurchaseOrderID,
                            Cost: Cost,
                            Quantity: Quantity,
                            Tag: ActvTg,
                            Tagging: LineItemAutoTagg,
                            UOMID: LineItemUnt,
                            ItemDtldDesc: LineItemDtldDesc,
                            changed: changed,
                            UserId: 0,
                            isShown: 1,
                            NoState: NoStateTx,
                            NoGSHT: NoGSTHSTTx,
                            NoPST: NoPSTTx
                        }
                    }

                }
                else {
                    if (Quantity == "" || Quantity == null || Quantity == undefined) {
                        $.notify.error('Error', "Please Enter Quantity");
                        hasError = true;
                    }

                    if (Cost == "" || Cost == null || Cost == undefined) {
                        $.notify.error('Error', "Please Enter Cost");
                        hasError = true;
                    }
                    if (Cost <= "0") {
                        $.notify.error('Error', "Please enter correct Line Item Costs");
                        hasError = true;
                    }
                    if (!hasError) {

                        fd = {
                            POLineItemID: POLineItemId,
                            POID: PurchaseOrderID,
                            Cost: Cost,
                            Quantity: Quantity,
                            Tag: false,
                            Tagging: "",
                            UOMID: 0,
                            ItemDtldDesc: "",
                            changed: 0,
                            UserId: 0,
                            isShown: 0,
                            NoState: null,
                            NoGSHT: null,
                            NoPST: null
                        };
                    }
                }
                if (!hasError) {
                    updatedPOLineItems.push(fd);
                }
            });
            //for converting all the cost to float
            if (updatedPOLineItems.length == 0) return;

            updatedPOLineItems.forEach(item => {
                if (item.Cost.includes(",")) {
                    item.Cost = parseFloat(item.Cost.replace(/,/g, ''));
                } else {
                    item.Cost = parseFloat(item.Cost);
                }
                item.Quantity = parseFloat(item.Quantity);
            });


            $.ajax({
                url: "/PurchaseOrder/SaveAllPoItems",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(updatedPOLineItems),
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        cancelselections();
                        polineItems();
                    }
                    else {
                        notify(false, data.ErrorMessages, true);
                        $(".loader").css("display", "none");
                    }
                    updatedPOLineItems = [];
                }
            });
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

        $(document).on('change', '.LineItem_Cost', function () {
            var value = $(this).val().replace(/,/g, '');
            $(this).val(formatNumber(value));
        });

        $(document).on('click', '#btn_CommitPONSndApprvl', function () {
            if ($('#hdn_IsApproved').val() == '1') {
                /*confrm = confirm("This PO will become unapproved if you again send this for Approval.");*/
                $.confirm({
                    title: 'Warning',
                    message: 'This PO will become unapproved if you again send this for Approval.',
                    type: 'warning',
                    confirmText: 'Continue',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        proceedCommitPO();
                    },
                    onCancel: function () {
                        return;
                    }
                });

                return;
            }
            proceedCommitPO();
        });

        $(document).on('click', '#btn_CommitPONSndApprvl1', function () {            

            if ($('#hdn_IsApproved').val() == '1') {
                /*confrm = confirm("This PO will become unapproved if you again send this for Approval.");*/
                $.confirm({
                    title: 'Warning',
                    message: 'This PO will become unapproved if you again send this for Approval.',
                    type: 'warning',
                    confirmText: 'Continue',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        proceedCommitPO();   
                    },
                    onCancel: function () {
                        return;
                    }
                });

                return;
            }
            proceedCommitPO();
        });

        function proceedCommitPO() {
            let fd = {
                PurchaseOrderID: 0,
                Vendor_ID: 0,
                Project_ID: 0,
                Buyer_ID: 0,
                ConversionRate: 0,
                ArrivalDate: null,
                CheckBackDate: null,
                FOB: "",
                Freight: "",
                ShipTo: "",
                VendorCO: 0,
                InvoiceTo: "",
                Address1: "",
                Notes: "",
                Remarks: "",
                Terms: 0,
                UpdatedBy: 0,
                ShipMethod: 0,
                IsClicked: false,
                mailSend: false,
            };
                if (count == 0) {
                    let terms = "";
                    let fob = "";
                    let cnvRate = "";
                    let ArrivalDate = "";
                    let shipto = "";
                    let Address = "";
                    let buyerid = "";
                    $.ajax({
                        url: "/PurchaseOrder/GetPODataForCountZero",
                        data: { POID: $('#Hdn_PurchaseOrderID').val() },
                        type: "GET",
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                const tempData = data.Result;
                                terms = tempData.terms;
                                fob = tempData.fob;
                                cnvRate = tempData.conversionRate;
                                ArrivalDate = tempData.arrivalDate;
                                shipto = tempData.shipTo;
                                Address = tempData.address;
                                buyerid = tempData.buyerID;
                                $(".loader").css("display", "none");
                            }
                            else {
                                notify(false, data.ErrorMessages, true);
                                $(".loader").css("display", "none");
                            }

                        }
                    });

                    if (terms == "0") {
                        notify(false, "No Invoice terms.", false);
                        return;
                    }
                    else if (buyerid == "0") {
                        notify(false, 'You must select Buyer before saving the Project', false);
                        return;
                    }
                    else if (fob == "" || fob == undefined || fob == null) {
                        notify(false, "No FOB.", false);
                        return;
                    }
                    else if (cnvRate == " " || cnvRate == undefined || cnvRate == null) {
                        notify(false, "No Conversion Rate.", false);
                        return;
                    }
                    else if (ArrivalDate == "" || ArrivalDate == null) {
                        notify(false, "No Delivery date.", false);
                        return;
                    }
                    else if (shipto == "" || shipto == null) {
                        notify(false, "No Ship to.", false);
                        return;
                    }
                    else if (Address == "" || Address == null) {
                        notify(false, "No Address.", false);
                        return;
                    }


                    fd = {
                        PurchaseOrderID: $('#Hdn_PurchaseOrderID').val(),
                        Vendor_ID: 0,
                        Project_ID: 0,
                        Buyer_ID: 0,
                        ConversionRate: 0,
                        ArrivalDate: null,
                        CheckBackDate: null,
                        FOB: "",
                        Freight: "",
                        ShipTo: "",
                        VendorCO: 0,
                        InvoiceTo: "",
                        Address1: "",
                        Notes: "",
                        Remarks: "",
                        Terms: 0,
                        UpdatedBy: 0,
                        ShipMethod: 0,
                        IsClicked: false,
                        mailSend: false,

                    };

            }
                else {
                    var Project = $('#Ddl_Project').val();
                    if (Project == "0") {
                        notify(false, 'You must select Project before saving the Project', false);
                        $('#Ddl_Project').trigger('focus');
                        return;
                    }
                    var VendorID = $('#txt_VendorName').val();
                    if (VendorID == "0" || VendorID == undefined) {
                        notify(false, 'You must select Vendor before saving the Project', false);
                        return;
                    }
                    var ConversionRate = $('#txt_ConversionRate').val().trim();
                    var Buyer = $('#Ddl_Buyer').val();

                    if (Buyer == "0") {
                        notify(false, 'You must select Buyer before saving the Project', false);
                        $('#Ddl_Buyer').trigger('focus');
                        return;
                    }

                    var Shipment = $('#Ddl_Shipment').val();
                    var Terms = $('#txt_Terms').val();
                    var FOB = $('#txt_FOB').val()?.trim();
                    var ShipTo = $('#txt_ShipTo').val()?.trim();
                    var VendorCO = $('#txt_VendorCO').val();
                    var POID = $('#Hdn_PurchaseOrderID').val();
                    var Arrivaldate = $('#txt_ArrivalDate').val();
                    var checkbakcDate = $('#txt_CheckDate').val();
                    var frieght = $('#txt_Freight').val();
                    var remarks = $('#txt_Remarks').val();
                    var notes = $('#txt_Notes').val();
                    var Address1 = $('#txt_addr1').val()?.trim();
                    var invoiceTo = $('#txt_InvoiceTo').val()?.trim();
                    fd = {
                        PurchaseOrderID: POID,
                        Vendor_ID: VendorID,
                        Project_ID: Project,
                        Buyer_ID: Buyer,
                        ConversionRate: ConversionRate,
                        ArrivalDate: Arrivaldate,
                        CheckBackDate: checkbakcDate,
                        FOB: FOB,
                        Freight: frieght,
                        ShipTo: ShipTo,
                        VendorCO: VendorCO,
                        InvoiceTo: invoiceTo,
                        Address1: Address1,
                        Notes: notes,
                        Remarks: remarks,
                        Terms: Terms,
                        UpdatedBy: 0,
                        ShipMethod: Shipment,
                        IsClicked: true,
                        mailSend: false,
                    };
                            if ($('#txt_Terms').val() == '0') {
                                notify(false, "No Invoice terms.", false);
                                return;
                            }
                            else if ($('#txt_FOB').val() == '' || $('#txt_FOB').val() == null) {
                                notify(false, "No FOB.", false);
                                return;
                            }
                            else if ($('#txt_ConversionRate').val() == '') {
                                notify(false, "No Conversion Rate.", false);
                                return;
                            }
                            else if ($('#txt_ArrivalDate').val() == '') {
                                notify(false, "No Delivery date.", false);
                                return;
                            }
                            else if ($('#txt_ShipTo').val() == '' || $('#txt_ShipTo').val() == null) {
                                notify(false, "No Ship to.", false);
                                return;
                            }
                            else if ($('#txt_addr1').val() == '') {
                                notify(false, "No Address.", false);
                                return;
                            }

            }

            $.confirm({
                title: 'Confirm',
                message: 'Do you want to send the approvers a notification email?Ok for yes, and Cancel for no.',
                type: 'confirm',
                confirmText: 'Ok',
                cancelText: 'Cancel',
                onConfirm: function () {
                    fd.mailSend = true;
                    sendPOForApproval(fd);
                },
                onCancel: function () {
                    fd.mailSend = false;
                    sendPOForApproval(fd);
                }
            });
        }
        function sendPOForApproval(fd) {
            $.ajax({
                url: "/PurchaseOrder/SavePOandSendForApproval",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        count = 0;
                        updateRequiredFileds($('#Hdn_PurchaseOrderID').val());
                        HideUnhideButton();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            });
        }


        $(document).on('click', '#btn_CancelSendPONSndApprvl', function () {
            let POID = $('#Hdn_PurchaseOrderID').val();
            $.confirm({
                title: 'Warning',
                message: 'Do you want to cancel \"Sent for approval\"? this will cancel the approval(s) if any.',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/PurchaseOrder/CancelSendApproval",
                        data: { POID: POID },
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                updateRequiredFileds(POID);
                                $(".loader").css("display", "none");
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");
                            }
                        }
                    })
                },
                onCancel: function () {
                    return;
                }
            });
        });

        function updateRequiredFileds(POID) {
            $.ajax({
                url: "/PurchaseOrder/RequiredPODetailsForCommits",
                data: { POId: POID },
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var result = data.Result;
                        var IsApproved = result.isApproved ? "1" : "0";
                        var IsSentForApproval = result.isSentForApproval ? "1" : "0";
                        $('#hdn_IsSentForApproval').val(IsSentForApproval);
                        $('#hdn_IsApproved').val(IsApproved);
                        HideUnhideButton();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }

        $(document).on('click', '#moveNext', function () {
            let POID = $('#Hdn_PurchaseOrderID').val();
            let fd = {
                POID: POID,
                CheckBackDate: null,
                Notes: "",
                IsClicked: false,
                Mode: "NEXT"
            };

            if (count > 0) {
                var checkbackDate = $('#txt_CheckDate').val();
                var notes = $('#txt_Notes').val();
                fd.CheckBackDate = checkbackDate;
                fd.IsClicked = true;
                fd.Notes = notes;
            }
            $.ajax({
                url: "/PurchaseOrder/MoveNextOrPrevious",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        let POIDToRedirect = data.Result.poid;
                        if (POIDToRedirect == 0) {
                            $.notify.error('Error', "Nothing to navigate");
                            $(".loader").css("display", "none");

                            return;
                        }
                        window.location.href = "/PurchaseOrder/POEdit" + "?POId=" + POIDToRedirect;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            })

        });

        $(document).on('click', '#movePrevious', function () {
            let POID = $('#Hdn_PurchaseOrderID').val();
            let fd = {
                POID: POID,
                CheckBackDate: null,
                Notes: "",
                IsClicked: false,
                Mode: "PREV"
            };

            if (count > 0) {
                var checkbackDate = $('#txt_CheckDate').val();
                var notes = $('#txt_Notes').val();
                fd.CheckBackDate = checkbackDate;
                fd.IsClicked = true;
                fd.Notes = notes;
            }

            $.ajax({
                url: "/PurchaseOrder/MoveNextOrPrevious",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        let POIDToRedirect = data.Result.poid;
                        if (POIDToRedirect == 0) {
                            $.notify.error('Error', "Nothing to navigate");
                            $(".loader").css("display", "none");

                            return;
                        }
                        window.location.href = "/PurchaseOrder/POEdit" + "?POId=" + POIDToRedirect;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            })

        });

        $(document).on('click', '#btn_CopyPO', function () {
            const POID = $('#Hdn_PurchaseOrderID').val();
            const url = "/PurchaseOrder/CreatePurchaseOrder?POIDCopy=" + POID;
            window.open(url);
        });

        $(document).on('click', '#btn_SavePO', function () {
            let fd = {
                PurchaseOrderID: 0,
                CheckBackDate: null,
                Notes: "",
                IsClicked: true,
            }
            const poid = $('#Hdn_PurchaseOrderID').val();
            fd.PurchaseOrderID = poid;


            fd.CheckBackDate = $('#txt_CheckDate').val();
            fd.Notes = $('#txt_Notes').val();

            $.ajax({
                url: "/PurchaseOrder/UpdateCheckbackandNote",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        count = 0;
                        window.setTimeout(
                            function () { window.location.reload(); }, 4000
                        );
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");

                }
            });

        });

        //$(document).on('click', '#AddLineItemPO', function () {
        //	const ponumber = $('#PODetailsCollapse').text().split("-")[2].trim();
        //	const POID = $('#Hdn_PurchaseOrderID').val();
        //	const ProjectID = $('#Hdn_ProjectId').val();
        //	const url = _BaseURL + "/PurchaseOrder/AddItemsToPO?POID=" + POID + "&PONumber=" + ponumber + "&ProjectID=" + ProjectID;
        //	window.location.href = url;
        //});


        $(document).on('click', '#cancelBtn', function () {
            const POID = $('#Hdn_PurchaseOrderID').val();
            window.location.href = "/PurchaseOrder/POEdit?POId=" + POID;
        });

        //$(document).on('click', '#btn_CommitPO', function () {
        //    debugger;
        //    const POID = $('#Hdn_PurchaseOrderID').val();
        //    let terms = "";
        //    let fob = "";
        //    let cnvRate = "";
        //    let ArrivalDate = "";
        //    let shipto = "";
        //    let Address = "";

        //    if (count == 0) {
        //        $.ajax({
        //            url: "/PurchaseOrder/GetPODataForCountZero",
        //            data: { POID: POID },
        //            type: "GET",
        //            dataType: "json",
        //            async: false,
        //            beforeSend: function () {
        //                $(".loader").css("display", "flex");
        //            },
        //            success: function (data) {
        //                if (data.IsSuccess) {
        //                    const tempData = data.Result;
        //                    terms = tempData.terms;
        //                    fob = tempData.fob;
        //                    cnvRate = tempData.conversionRate;
        //                    ArrivalDate = tempData.arrivalDate;
        //                    shipto = tempData.shipTo;
        //                    Address = tempData.address;
        //                    $(".loader").css("display", "none");
        //                }
        //                else {
        //                    notify(false, data.ErrorMessages, true);
        //                    $(".loader").css("display", "none");
        //                }

        //            }
        //        });

        //        if (terms == "0") {
        //            $.notify.error('Error', "No Invoice terms.");
        //            return;
        //        }
        //        else if (fob == "" || fob == undefined || fob == null) {
        //            $.notify.error('Error', "No FOB.");
        //            return;
        //        }
        //        else if (cnvRate == " " || cnvRate == undefined || cnvRate == null) {
        //            $.notify.error('Error', "No Conversion Rate.");
        //            return;
        //        }
        //        else if (ArrivalDate == "" || ArrivalDate == null) {
        //            $.notify.error('Error', "No Delivery date.");
        //            return;
        //        }
        //        else if (shipto == "" || shipto == null) {
        //            $.notify.error('Error', "No Ship to.");
        //            return;
        //        }
        //        else if (Address == "" || Address == null) {
        //            $.notify.error('Error', "No Address.");
        //            return;
        //        }
        //    }
        //    else {
        //        if ($('#txt_Terms').val() == '0') {
        //            $.notify.error('Error', "No Invoice terms.");
        //            return;
        //        }
        //        else if ($('#txt_FOB').val() == '' || $('#txt_FOB').val() == null) {
        //            $.notify.error('Error', "No FOB.");
        //            return;
        //        }
        //        else if ($('#txt_ConversionRate').val() == '' || $('#txt_ConversionRate').val() == null) {
        //            $.notify.error('Error', "No Conversion Rate.");
        //            return;
        //        }
        //        else if ($('#txt_ArrivalDate').val() == '' || $('#txt_ArrivalDate').val() == null) {
        //            $.notify.error('Error', "No Delivery date.");
        //            return;
        //        }
        //        else if ($('#txt_ShipTo').val() == '' || $('#txt_ShipTo').val() == null) {
        //            $.notify.error('Error', "No Ship to.");
        //            return;
        //        }
        //        else if ($('#txt_addr1').val() == '' || $('#txt_addr1').val() == null) {
        //            $.notify.error('Error', "No Address.");
        //            return;
        //        }
        //    }
        //    let data = "NOTOVERCOMMITED";

        //    //var table = $('#po_table').DataTable();

        //    //table.rows().every(function () {
        //    //	let row = $(this.node()); // Get the actual row element
        //    //	let rowData = this.data(); // Get row data from DataTables

        //    //	// Received column (10th column)
        //    //	let isExceededValue = rowData[11];

        //    //	if (isExceededValue === "1") {

        //    //		data = "OVERCOMMITED";
        //    //	}
        //    //});

        //    $('#po_table tbody tr').each(function () {
        //        let revised = $(this).find('td:eq(11)').html();
        //        if (revised == '1') {

        //            data = "OVERCOMMITED";
        //        }
        //    });

        //    let carryon = true;
        //    if (data == "OVERCOMMITED") {
        //        $.confirm({
        //            title: '',
        //            message: 'You have line items that exceed budget.Do you want to continue?',
        //            type: 'confirm',
        //            confirmText: 'Yes, Proceed',
        //            cancelText: 'Cancel',
        //            onConfirm: function () {
        //                proceedCommitCheck();
        //            },
        //            onCancel: function () {
        //                return;
        //            }
        //        });

        //    }
        // /*   proceedCommitCheck();*/
        //    function proceedCommitCheck() {
        //        debugger;
        //        let POLineItemIdList = [];
        //        let fullResult = {};
        //        //call the ajax to check
        //        $.ajax({
        //            url: "/PurchaseOrder/CheckItemsonCommit",
        //            data: { POID: POID },
        //            type: "GET",
        //            dataType: "json",
        //            async: false,

        //            beforeSend: function () {
        //                $(".loader").css("display", "flex");
        //            },
        //            success: function (response) {
        //                if (response.IsSuccess) {
        //                    let tempData = response.Result;
        //                    POLineItemIdList = tempData.map(item => item.poLineItemId);
        //                    fullResult = tempData;
        //                    $(".loader").css("display", "none");
        //                }
        //                else {
        //                    $.notify.error('Error', data.ErrorMessages);
        //                    $(".loader").css("display", "none");
        //                }

        //            }

        //        });
        //        if (POLineItemIdList.length == 0) {
        //            //function/ajax call
        //            CommitPO(data);
        //            return;
        //        }
        //    }
        //    $.confirm({
        //        title: '',
        //        message: "After revision some PO items are invoiced for more than their remaining value. Please create a credit memo to offset this.",
        //        type: 'confirm',
        //        confirmText: 'Yes, Proceed',
        //        cancelText: 'Cancel',
        //        onConfirm: function () {
        //            CreditNoteModal(fullResult, POLineItemIdList);
        //        },
        //        onCancel: function () {
        //            return;
        //        }
        //    });
        //});

        $(document).on('click', '#btn_CommitPO', function () {
            const POID = $('#Hdn_PurchaseOrderID').val();

            let terms = "";
            let fob = "";
            let cnvRate = "";
            let arrivalDate = "";
            let shipTo = "";
            let address = "";

            function showLoader(show) {
                $(".loader").css("display", show ? "flex" : "none");
            }

            function validateFields() {

                if (terms === "0") {
                    notify(false, "No Invoice terms.", false);
                    return false;
                }

                if (!fob) {
                    notify(false, "No FOB.", false);
                    return false;
                }

                if (!cnvRate || cnvRate.trim() === "") {
                    notify(false, "No Conversion Rate.", false);
                    return false;
                }

                if (!arrivalDate) {
                    notify(false, "No Delivery date.", false);
                    return false;
                }

                if (!shipTo) {
                    notify(false, "No Ship to.", false);
                    return false;
                }

                if (!address) {
                    notify(false, "No Address.", false);
                    return false;
                }

                return true;
            }

            function checkOverCommitted() {

                let status = "NOTOVERCOMMITED";

                $('#po_table tbody tr').each(function () {
                    let revised = $(this).find('td:eq(11)').text().trim();
                    if (revised === "1") {
                        status = "OVERCOMMITED";
                    }
                });

                return status;
            }

            function proceedCommitCheck(overCommitStatus) {

                showLoader(true);

                $.ajax({
                    url: "/PurchaseOrder/CheckItemsonCommit",
                    data: { POID: POID },
                    type: "GET",
                    dataType: "json",
                    success: function (response) {

                        showLoader(false);

                        if (!response.IsSuccess) {
                            notify(false, response.ErrorMessages, true);
                            return;
                        }

                        const fullResult = response.Result;
                        const poLineItemIdList = fullResult.map(item => item.poLineItemId);

                        if (poLineItemIdList.length === 0) {
                            CommitPO(overCommitStatus);
                            return;
                        }

                        $.confirm({
                            title: '',
                            message: "After revision some PO items are invoiced for more than their remaining value. Please create a credit memo to offset this.",
                            type: 'confirm',
                            confirmText: 'Yes, Proceed',
                            cancelText: 'Cancel',
                            onConfirm: function () {
                                CreditNoteModal(fullResult, poLineItemIdList);
                            }
                        });

                    }
                });
            }

            function startCommitProcess() {

                const overCommitStatus = checkOverCommitted();

                if (overCommitStatus === "OVERCOMMITED") {

                    $.confirm({
                        title: '',
                        message: 'You have line items that exceed budget. Do you want to continue?',
                        type: 'confirm',
                        confirmText: 'Yes, Proceed',
                        cancelText: 'Cancel',
                        onConfirm: function () {
                            proceedCommitCheck(overCommitStatus);
                        }
                    });

                } else {
                    proceedCommitCheck(overCommitStatus);
                }
            }

            // MAIN FLOW

            if (count === 0) {

                showLoader(true);

                $.ajax({
                    url: "/PurchaseOrder/GetPODataForCountZero",
                    data: { POID: POID },
                    type: "GET",
                    dataType: "json",
                    success: function (data) {

                        showLoader(false);

                        if (!data.IsSuccess) {
                            notify(false, data.ErrorMessages, true);
                            return;
                        }

                        const tempData = data.Result;

                        terms = tempData.terms;
                        fob = tempData.fob;
                        cnvRate = tempData.conversionRate;
                        arrivalDate = tempData.arrivalDate;
                        shipTo = tempData.shipTo;
                        address = tempData.address;

                        if (!validateFields()) return;

                        startCommitProcess();
                    }
                });

            } else {

                terms = $('#txt_Terms').val();
                fob = $('#txt_FOB').val();
                cnvRate = $('#txt_ConversionRate').val();
                arrivalDate = $('#txt_ArrivalDate').val();
                shipTo = $('#txt_ShipTo').val();
                address = $('#txt_addr1').val();

                if (!validateFields()) return;

                startCommitProcess();
            }

        });

        function CommitPO(commitStatus) {


            //var fd = {
            //	PurchaseOrderID: 0,
            //	Vendor_ID: 0,
            //	ProjectID: 0,
            //	Buyer_ID: 0,
            //	ConversionRate: 0,
            //	ArrivalDate: null,
            //	CheckBackDate: null,
            //	FOB: "",
            //	Freight: "",
            //	ShipTo: "",
            //	VendorCO: 0,
            //	InvoiceTo: "",
            //	Address1: "",
            //	Notes: "",
            //	Remarks: "",
            //	Terms: 0,
            //	UpdatedBy: 0,
            //	ShipMethod: 0,
            //	IsClicked: false,
            //	isHidden: isHidden
            //};
            var fd = {};
            if (count == 0) {
                var isHidden = $('#Chk_hidden1').is(':checked') ? true : false;
                fd = {
                    PurchaseOrderID: $('#Hdn_PurchaseOrderID').val(),
                    Vendor_ID: 0,
                    Project_ID: 0,
                    Buyer_ID: 0,
                    ConversionRate: 0,
                    ArrivalDate: null,
                    CheckBackDate: null,
                    FOB: "",
                    Freight: "",
                    ShipTo: "",
                    VendorCO: 0,
                    InvoiceTo: "",
                    Address1: "",
                    Notes: "",
                    Remarks: "",
                    Terms: 0,
                    UpdatedBy: 0,
                    ShipMethod: 0,
                    IsClicked: false,
                    mailSend: false,
                    isHidden: isHidden

                };

            }

            else {
                var Project = $('#Ddl_Project').val();
                if (Project == "0") {
                    notify(false, 'You must select Project before saving the Project', false);
                    $('#Ddl_Project').trigger('focus');
                    return;
                }
                var VendorID = $('#txt_VendorName').val();
                if (VendorID == "0" || VendorID == undefined) {
                    notify(false, 'You must select Vendor before saving the Project', false);
                    return;
                }
                var ConversionRate = $('#txt_ConversionRate').val().trim();
                var Buyer = $('#Ddl_Buyer').val();

                if (Buyer == "0") {
                    notify(false, 'You must select Buyer before saving the Project', false);
                    $('#Ddl_Buyer').trigger('focus');
                    return;
                }

                var Shipment = $('#Ddl_Shipment').val();
                var Terms = $('#txt_Terms').val();
                var FOB = $('#txt_FOB').val().trim();
                var ShipTo = $('#txt_ShipTo').val().trim();
                var VendorCO = $('#txt_VendorCO').val();
                var POID = $('#Hdn_PurchaseOrderID').val();
                var Arrivaldate = $('#txt_ArrivalDate').val();
                var checkbakcDate = $('#txt_CheckDate').val();
                var frieght = $('#txt_Freight').val();
                var remarks = $('#txt_Remarks').val();
                var notes = $('#txt_Notes').val();
                var isHidden = $('#Chk_hidden').is(':checked') ? true : false
                fd = {
                    PurchaseOrderID: POID,
                    Vendor_ID: VendorID,
                    Project_ID: Project,
                    Buyer_ID: Buyer,
                    ConversionRate: ConversionRate,
                    ArrivalDate: Arrivaldate,
                    CheckBackDate: checkbakcDate,
                    FOB: FOB,
                    Freight: frieght,
                    ShipTo: ShipTo,
                    VendorCO: VendorCO,
                    InvoiceTo: "",
                    Address1: $("#txt_addr1").val(),
                    Notes: notes,
                    Remarks: remarks,
                    Terms: Terms,
                    UpdatedBy: 0,
                    ShipMethod: Shipment,
                    IsClicked: true,
                    mailSend: false,
                    isHidden: isHidden
                };

                //var confrm = true;
                //if ($('#hdn_IsApproved').val() == '1') {
                //    confrm = confirm("This PO will become unapproved if you again send this for Approval.");
                //}

                //if (!confrm) {
                //    return;
                //}

                if ($('#txt_Terms').val() == '0') {
                    notify(false, "No Invoice terms.", false);
                    return;
                }
                else if ($('#txt_FOB').val() == '' || $('#txt_FOB').val() == null) {
                    notify(false, "No FOB.", false);
                    return;
                }
                else if ($('#txt_ConversionRate').val() == '') {
                    notify(false, "No Conversion Rate.", false);
                    return;
                }
                else if ($('#txt_ArrivalDate').val() == '') {
                    notify(false, "No Delivery date.", false);
                    return;
                }
                else if ($('#txt_ShipTo').val() == '' || $('#txt_ShipTo').val() == null) {
                    notify(false, "No Ship to.", false);
                    return;
                }
                else if ($('#txt_addr1').val() == '') {
                    notify(false, "No Address.", false);
                    return;
                }

            }

            if (commitStatus == "OVERCOMMITED") {
                $("#dialog-confirm").html("You have line items that exceed budget. Do you want to continue? (Yes/No)");
                $.ajax({
                    url: "/PurchaseOrder/POCommit",
                    data: fd,
                    type: "POST",
                    dataType: "json",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                            setTimeout(function () {
                                window.location.reload();
                            }, 3000);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });


            }
            else if (commitStatus == "NOTOVERCOMMITED") {
                $.ajax({
                    url: "/PurchaseOrder/POCommit",
                    data: fd,
                    type: "POST",
                    dataType: "json",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                            setTimeout(function () {
                                window.location.reload();
                            }, 3000);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }
            else {
                $.ajax({
                    url: "/PurchaseOrder/POCommit",
                    data: fd,
                    type: "POST",
                    dataType: "json",
                    async: false,

                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                            setTimeout(function () {
                                window.location.reload();
                            }, 3000);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }
        }

        function CreditNoteModal(result, POLineItemIdList) {

            let POLineItemIds = POLineItemIdList.join(",");
            let ProjectId = $('#Hdn_ProjectId').val();
            let POId = $('#Hdn_PurchaseOrderID').val();

            //let obj = {
            //	POLineItemID: POLineItemIds, 
            //	POID: parseInt(POId) ,
            //	ProjectId: parseInt(ProjectId), 
            //	InvoiceAmountData: result.map(item => ({
            //		poLineItemId: parseInt(item.poLineItemId),
            //		totalInv: parseFloat(item.totalInv),
            //		poCost: parseFloat(item.poCost),
            //		amount: parseFloat(item.amount)
            //	}))
            //};
            let obj = {
                POLineItemID: POLineItemIds,
                POID: parseInt(POId),
                ProjectId: parseInt(ProjectId),
                InvoiceAmountData: result
            };

            // Convert object to JSON string
            let jsonData = JSON.stringify(obj);

            $.ajax({
                url: "/PurchaseOrder/CreditNoteModal",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: jsonData,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#creditNotem').html('');
                        $('#creditNotem').html(data);
                        let date = new Date();
                        $('#txt_InvoiceDate').datepickercustom({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'yy/mm/dd'
                        });
                        $('#txt_InvoiceDate').datepicker("setDate", date);
                        $(".loader").css("display", "none");
                        $('#credit_note_modal').modal('show');
                    }
                    else {
                        $.notify.error('Error', "Something Went Wrong");
                        $('#credit_note_modal').modal('hide');
                        $(".loader").css("display", "none");
                    }
                }
            });
        }

        $(document).on('click', '#saveCMPO', function () {
            let account = $('#Ddl_ProjectAccount').val();
            let invnumber = $('#txt_InvoiceNumber').val();
            let memo = $('#txt_InvoiceMemo').val();
            let idate = $('#txt_InvoiceDate').val();
            let InvoiceAmount = $('#txt_SubtotalInvoice').val();
            InvoiceAmount = replaceAll(InvoiceAmount, ',', '');
            let Subtotal = $('#txt_SubtotalInvoice').val();
            Subtotal = replaceAll(Subtotal, ',', '');
            var TotalInvoice = $('#txt_TotalInvoice').val();
            TotalInvoice = replaceAll(TotalInvoice, ',', '');
            var Exrate = '1.00';
            var VendorId = $('#credit_vendor').attr('data-id');
            let Tax1 = $('#txt_TotalTax1').val();
            Tax1 = replaceAll(Tax1, ',', '');

            let Tax2 = $('#txt_TotalTax2').val();
            Tax2 = replaceAll(Tax2, ',', '');

            let Tax3 = $('#txt_TotalTax3').val();
            Tax3 = replaceAll(Tax3, ',', '');
            if (invnumber == 'CR-') {
                $.notify.error('Error', "Add Credit memo number");
                return;
            }

            if (account == '0') {
                $.notify.error('Error', "Please select account");
                return;
            }
            let fd = {
                InvoiceNumberVendor: invnumber,
                InvoiceDate: idate,
                InvoiceAmount: 0 - parseFloat(InvoiceAmount),
                Subtotal: 0 - parseFloat(Subtotal),
                VendorId: VendorId,
                POID: $('#Hdn_PurchaseOrderID').val(),
                TotalInvoice: 0 - parseFloat(TotalInvoice),
                Exrate: Exrate,
                Memo: memo,
                Tax1: 0 - parseFloat(Tax1),
                Tax2: 0 - parseFloat(Tax2),
                Tax3: 0 - parseFloat(Tax3),
                ProjectAccount: account
            }
            var GeneratedInvoiceID = "";
            $.ajax({
                url: "/PurchaseOrder/InsertInvoice",
                data: fd,
                dataType: "json",
                type: "POST",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        GeneratedInvoiceID = data.Result;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");

                }

            });
            if (GeneratedInvoiceID == "")
                return;


            var invoiceItemsCreateDTOs = [];

            $('#credit_note tbody tr').each(function () {
                var poNumber = $(this).find('td:eq(0)').text().trim();
                var poLineItemNumber = $(this).find('td:eq(1)').text().trim();
                var description = $(this).find('td:eq(2)').text().trim();
                var lineItemTotal = $(this).find('td:eq(3) input').val().replace(/,/g, '').trim(); // Remove commas

                // Convert values to appropriate data types
                var poLineItemID = $(this).data('poli'); // Getting data-poli attribute

                invoiceItemsCreateDTOs.push({
                    PurchaseOrderNumber: poNumber,
                    POLineItemID: poLineItemID ? parseInt(poLineItemID) : 0,
                    POLineItemNumber: poLineItemNumber,
                    Description: description,
                    LineItemTotal: lineItemTotal ? 0 - parseFloat(lineItemTotal) : 0,
                    InvoiceID: GeneratedInvoiceID
                });
            });

            let success = false;
            $.ajax({
                url: '/PurchaseOrder/AddPOLIinInvoiceItems',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(invoiceItemsCreateDTOs),
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (!data.IsSuccess) {
                        $.notify.error('Error', data.ErrorMessages);
                        return;
                    }
                    else {
                        success = data.IsSuccess;
                    }

                }
            });

            if (!success)
                return;

            CommitPO("");

        });
        let goflag = false;
        let fullinvoice = "";
        let Povalue = "";

        $(document).on('click', '#btn_RevisePO', function () {
            const PurchaseOrderID = $('#Hdn_PurchaseOrderID').val();
            $.ajax({
                url: "/PurchaseOrder/POReviseCheckNew",
                data: { POID: PurchaseOrderID },
                type: "POST",
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        fullinvoice = data.Result.fullInvoiceAmount;
                        Povalue = data.Result.poValue;
                        if (parseFloat(fullinvoice) <= 0.00) {
                            goflag = true;
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            });
            let c = true;

            if (parseFloat(Povalue) > 0.00) {
                if (goflag) {
                    $.confirm({
                        title: '',
                        message: 'This PO is fully invoiced. Click OK if you are sure you want to revise it.',
                        type: 'confirm',
                        confirmText: 'Yes, Proceed',
                        cancelText: 'Cancel',
                        onConfirm: function () {
                            $('#creat_version').modal('show');
                        },
                        onCancel: function () {
                            alert('Cancelled! Page would reload here.');
                        }
                    });

                }
                else {
                    $('#creat_version').modal('show');
                }
            }
            else {
                $('#creat_version').modal('show');
            }

        });

        $(document).on('click', '#yes_btn', function () {
            const poid = $("#Hdn_PurchaseOrderID").val();
            const IsNewVersion = true;
            $.ajax({
                url: "/PurchaseOrder/PORevise",
                data: { POID: poid, IsNewVersion: IsNewVersion },
                type: "POST",
                dataType: "json",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            });

        });

        $(document).on('click', '#no_btn', function () {
            const poid = $("#Hdn_PurchaseOrderID").val();
            const IsNewVersion = false;
            $.ajax({
                url: "/PurchaseOrder/PORevise",
                data: { POID: poid, IsNewVersion: IsNewVersion },
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            });
        });

        $(document).on('click', '#btn_CreatePO', function () {
            const POID = $('#Hdn_PurchaseOrderID').val();
            var Project = $('#Ddl_Project').val();
            var VendorID = $('#txt_VendorName').val();
            var Ddl_Buyer = $('#Ddl_Buyer').val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            let fd = {
                PurchaseOrderID: 0,
                Vendor_ID: 0,
                ProjectID: 0,
                Buyer_ID: 0,
                ConversionRate: 0,
                ArrivalDate: null,
                CheckBackDate: null,
                FOB: "",
                Freight: "",
                ShipTo: "",
                VendorCO: 0,
                InvoiceTo: "",
                Address1: "",
                Notes: "",
                Remarks: "",
                Terms: 0,
                UpdatedBy: 0,
                ShipMethod: 0,
                IsClicked: false,
                isHidden: false
            };
            //if (count == 0) {
            //	fd = {
            //		PurchaseOrderID: $('#Hdn_PurchaseOrderID').val(),
            //		Vendor_ID: 0,
            //		Project_ID: 0,
            //		Buyer_ID: 0,
            //		ConversionRate: 0,
            //		ArrivalDate: null,
            //		CheckBackDate: null,
            //		FOB: "",
            //		Freight: "",
            //		ShipTo: "",
            //		VendorCO: 0,
            //		InvoiceTo: "",
            //		Address1: "",
            //		Notes: "",
            //		Remarks: "",
            //		Terms: 0,
            //		UpdatedBy: 0,
            //		ShipMethod: 0,
            //		IsClicked: false,
            //		mailSend: false,
            //		isHidden: false

            //	};

            //}
            //else {
            if (VendorID == "0") {
                $.notify.error('Error', 'You must select Vendor before saving the Project');
                return;
            }
            if (Ddl_Buyer == "0") {
                $.notify.error('Error', 'You must select Buyer before saving the Project');
                $('#Ddl_Buyer').focus();
                return;
            }
            var Project = $('#Ddl_Project').val();
            if (Project == "0") {
                $.notify.error('Error', 'You must select Project before saving the Project');
                $('#Ddl_Project').focus();
                return;
            }
            var VendorID = $('#txt_VendorName').val();
            if (VendorID == "0" || VendorID == undefined) {
                $.notify.error('Error', 'You must select Vendor before saving the Project');
                return;
            }
            var ConversionRate = $('#txt_ConversionRate').val().trim();
            var Buyer = $('#Ddl_Buyer').val();

            if (Buyer == "0") {
                $.notify.error('Error', 'You must select Buyer before saving the Project');
                $('#Ddl_Buyer').focus();
                return;
            }

            let Shipment = $('#Ddl_Shipment').val();
            let Terms = $('#txt_Terms').val();
            let FOB = $('#txt_FOB').val().trim();
            let ShipTo = $('#txt_ShipTo').val().trim();
            let VendorCO = $('#txt_VendorCO').val();
            //let POID = $('#Hdn_PurchaseOrderID').val();
            let Arrivaldate = $('#txt_ArrivalDate').val();
            let checkbakcDate = $('#txt_CheckDate').val();
            let frieght = $('#txt_Freight').val();
            let remarks = $('#txt_Remarks').val();
            let notes = $('#txt_Notes').val();
            let isHidden = $('#Chk_hidden').is(':checked') ? true : false;
            fd = {
                PurchaseOrderID: POID,
                Vendor_ID: VendorID,
                Project_ID: Project,
                Buyer_ID: Buyer,
                ConversionRate: ConversionRate,
                ArrivalDate: Arrivaldate,
                CheckBackDate: checkbakcDate,
                FOB: FOB,
                Freight: frieght,
                ShipTo: ShipTo,
                VendorCO: VendorCO,
                InvoiceTo: $('#txt_InvoiceTo').val(),
                Address1: $('#txt_addr1').val(),
                Notes: notes,
                Remarks: remarks,
                Terms: Terms,
                UpdatedBy: 0,
                ShipMethod: Shipment,
                IsClicked: true,
                mailSend: false,
                isHidden: isHidden
            };

            //}

            $.ajax({
                url: "/PurchaseOrder/UpdatePODetailsNew",
                data: fd,
                type: "POST",
                dataType: "json",

                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        isDirty = false;
                        $.notify.success('Success', data.Result);
                        window.setTimeout(
                            function () { window.location.reload(); }, 4000
                        );
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }

                }
            });

        });

        $(document).on('click', '.expNotebtn', function () {
            const POLIID = $(this).data('id');
            const POID = $('#Hdn_PurchaseOrderID').val();
            var row = $(this).closest('tr');
            var quantity = row.find('.LineItem_Quantity').val();
            var receivedQuantity = row.find('td:eq(9)').text().trim();
            var itemNumber = row.find('td:eq(1)').text();


            $.ajax({
                url: "/PurchaseOrder/ExpediteModal",
                data: { POLineItemId: POLIID, POID: POID },
                type: "GET",
                dataType: "html",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {
                        $('#expeditedetials').html('');
                        $('#expeditedetials').html(data);

                        //$('.statusli').text('');
                        //$('.statusli').text(`Received ${receivedQuantity} Out of ${quantity}`);
                        //$('.statusli').attr('data-received', receivedQuantity);
                        //$('.statusli').attr('data-itemqty', quantity);

                        $('#hdn_poli').val('');
                        $('#hdn_poli').val(POLIID);

                        $("#headerExpModal").text('');
                        $("#headerExpModal").text(`PO Item Expedite Notes (${itemNumber})`);

                        //$('#txt_ReturnQty').attr('data-maxqty', quantity);
                        //$('#txt_ReturnQty').attr('data-maxqty1', receivedQuantity);
                        //$('#txt_ReturnQty').attr('data-lineitemid', POLIID);


                        $("#txt_ExpectedArrivalDate").datepickercustom({
                            changeMonth: true,
                            changeYear: true,

                            altFormat: "yy.mm.dd",
                            onSelect: function (dateText, inst) {
                                // When a date is selected, updating  the alternate fields
                                // Convert dateText (string) into a Date object
                                var selectedDate = $.datepicker.parseDate(inst.settings.dateFormat || $.datepicker._defaults.dateFormat, dateText, inst.settings);

                                $(inst.settings.altField).each(function () {
                                    // Format selectedDate (which is now a Date object)
                                    $(this).val($.datepicker.formatDate(inst.settings.altFormat, selectedDate));
                                });
                                setStatus();
                            }
                        });

                        $('#txt_RecvdDate').datepickercustom({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'yy.mm.dd',
                            maxDate: 0
                        });

                        $('#txt_RecvdDate1').datepickercustom({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'yy.mm.dd',

                        });

                        POLIExpHistory(POLIID);
                        POExpediteNoteinExpHistory(POLIID);

                        var GeneratedPONumber = $('#Hdn_GeneratedPONumber').val();
                        $('#headerContent').html('');
                        $('#headerContent').html(`PO Expedite Notes (${GeneratedPONumber})`);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', "Something went Wrong.");
                        $(".loader").css("display", "none");
                    }
                }
            });
        });
        function POLIExpHistory(POLIID) {
            $.ajax({
                url: "/PurchaseOrder/POLIExpediteHistory",
                data: { POLineItemId: POLIID },
                type: "GET",
                dataType: "html",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#tbl_poliexphist').html('');
                        $('#tbl_poliexphist').html(data);
                        $(".loader").css("display", "none");

                    }
                    else {
                        $('#tbl_poliexphist').html(
                            '<tr></tr><tr></tr><tr></tr>< tr > <td colspan="8" class="empty_cell">No Expedite History Found</td></tr ><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr>'
                        );
                    }
                },
                error: function () {
                    $(".loader").css("display", "none");

                    $.notify.error('Error', "Something went Wrong.");
                }
            });
        }
        function POExpediteNoteinExpHistory(POLIID) {
            $.ajax({
                url: "/Expedite/GetPOExpediteNoteInExpedite",
                data: { POLineItemID: POLIID },
                type: "GET",
                dataType: "html",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data && $.trim(data).length) {
                        $('#poexpnoteinExpHistory').html('');
                        $('#poexpnoteinExpHistory').html(data);
                        $(".loader").css("display", "none");

                    }
                    else {
                        $('#poexpnoteinExpHistory').html(
                            '<tr></tr>< tr > <td colspan="8" class="empty_cell">No Expedite History Found</td></tr ><tr></tr><tr></tr>'
                        );
                    }
                },
                error: function () {
                    $(".loader").css("display", "none");

                    $.notify.error('Error', "Something went Wrong.");
                }
            });
        }

        $(document).on('keyup', '#txt_ReturnQty', function (e) {
            var q = parseFloat($(this).val());
            var qty = parseFloat($(this).attr('data-maxqty'));
            var rcv = parseFloat($(this).attr('data-maxqty1'));
            var id = $(this).attr('data-lineitemid');

            if (q >= (qty - rcv)) {
                $('#ddl_ItemStatus').val('4');
            }
            else {
                DdlLineItemStatusByProjectID(id);
            }
        });

        function DdlLineItemStatusByProjectID(POLineItemId) {
            $.ajax({
                url: '/Expedite/GetPOLineItemStatusByProjectID',
                type: 'GET',
                dataType: 'JSON',
                data: { POLineItemId: POLineItemId },
                success: function (data) {
                    if (data.IsSuccess) {
                        if (data.Result != "0") {
                            $('#ddl_ItemStatus').val(data.Result);
                            $("#Hdn_ItemStatus").val(data.Result);
                        }
                        else {
                            $('#ddl_ItemStatus').val('1');
                            $("#Hdn_ItemStatus").val('1');
                        }

                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                        $('#ddl_ItemStatus').val('1');
                        $("#Hdn_ItemStatus").val('1');
                    }
                }
            });

        }

        $(document).on('click', '#btn_AddPOItemExpdNote', function () {

            var POLineItemID = $('#Hdn_POLIID').val();
            var ItemStatus = $('#ddl_ItemStatus').val();
            var ArrivalDate = $("#txt_ExpectedArrivalDate").val();
            var ReceivedQty = $('#txt_ReturnQty').val();
            var ReceivedDate = $('#txt_RecvdDate').val();
            var Reference = $('#txt_Reference').val();
            //var ItemExpediteNote = $('#ItemExpediteNote').val();
            const POID = $('#Hdn_PurchaseOrderID').val();
            var updateAll = $('#chkPOUpdateAll').prop("checked");
            var LIQuantity = $('.statusli').data('itemqty');
            var ReceivedPOQtyLI = $('.statusli').data('received');
            var Note = $('#ItemExpediteNote').val();

            if ((ReceivedQty.trim() != 0) && (ReceivedQty.trim() != '' || ReceivedDate != '')) {
                if (ReceivedQty.trim() == '' || ReceivedDate.trim() == '') {
                    notify(false, "Please enter QTY/Date", false);
                    return;
                }
            }

            if (ItemStatus == 0) {
                $('#ddl_ItemStatus').trigger('focus');
                notify(false, "Select Item Status", false);
                return;
            }

            if (ReceivedQty.trim() != "" || ReceivedQty.trim() != 0) {
                if (ReceivedDate == "") {
                    notify(false, "You must enter Received Date", false);
                    return;
                }
            }
            if (ReceivedDate != "") {
                if (ReceivedQty.trim() == "") {
                    notify(false, "You must enter Received Quantity", false);
                    return;
                }
            }

            if (parseInt(LIQuantity) - parseInt(ReceivedPOQtyLI) <= 0) {
                notify(false, "All Quantity of this item already Received", false);
                return;
            }


            //call Save function
            let fd = {
                POLineItemID: POLineItemID,
                ItemStatus: ItemStatus,
                ArrivalDate: ArrivalDate,
                Note: Note,
                ReceiveQty: ReceivedQty,
                ReceiveDate: ReceivedDate,
                Reference: Reference,
                POID: POID,
                isUpdateAll: updateAll,
            }

            $.ajax({
                url: "/PurchaseOrder/SavePOLIExpNoteinExpModal",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $('#po_exp_note').modal('hide');
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);

                        const POLIID = $('#hdn_poli').val();

                        $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                        polineItems();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");

                    }

                }
            });





        });


        $(document).on('click', '#btn_ProofPONSndApprvl', function () {
            var POID = $('#Hdn_PurchaseOrderID').val();
            if ($('#po_table tbody').find('tr').eq(0).find('td').length <= 1) {
                notify(false, 'No records found!!!', true);
                return;
            }
            generatePOReportOnPoEdit(POID, 1);

        });
        $(document).on('click', '#btn_ViewPOPDF', function () {
            var POID = $('#Hdn_PurchaseOrderID').val();
            if ($('#po_table tbody').find('tr').eq(0).find('td').length <= 1) {
                notify(false, 'No records found!!!', true);
                return;
            }
            generatePOReportOnPoEdit(POID, 0);

        });

        function generatePOReportOnPoEdit(POID, mode) {
            $.ajax({
                url: '/Reports/PurchaseOrderReportGeneration',
                type: 'GET',
                dataType: 'JSON',
                data: { PurchaseOrderID: POID, showImageFlag: mode },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        //window.open(data.Result, '_blank');
                        window.open(data.Result + "?v=" + new Date().getTime(), "_blank");
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        // #region :: START Fabrication - 11-02-2025

        $(document).on('click', '#OpenFabricationHistory', async function () {

            var Lineitemid = $(this).data('lineitemid');
            var itemno = $(this).parent().parent().find('td:eq(1)').text();
            var itemdesc = $(this).parent().parent().find('td:eq(4)').text().trim();
            itemdesc = itemdesc != "" ? " - " + itemdesc : "";
            var ProjectID = $('#Hdn_ProjectId').val();

            $('#headerforapprovals').text("APPROVALS FOR " + itemno + itemdesc);

            var POID = $('#Hdn_PurchaseOrderID').val();

            try {
                let isSuccess = await BindItemApprovalList();
                if (!isSuccess) return;

                isSuccess = await IsManager(POID);
                if (!isSuccess) return;

                GetAllFabricationList(Lineitemid, ProjectID);
            } catch (error) {
                console.error("Error in execution:", error);
            }


        });

        function BindItemApprovalList() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/PurchaseOrder/GetFabricationApprovalList',
                    type: 'GET',
                    dataType: 'JSON',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            const $selectSec = $("#ddlItemApprovalType");
                            $selectSec.empty().append('<option value="0" selected>--Select--</option>');

                            data.Result.forEach(function (item) {
                                const option = `<option value="${item.id}">${item.name}</option>`;
                                $selectSec.append(option);
                            });

                            resolve(true);
                        } else {
                            $.notify.error('Error', data.ErrorMessages);
                            reject(false);
                        }
                    },
                    error: function (xhr, status, error) {
                        $(".loader").css("display", "none");
                        reject(false);
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

                        notify(false, errorMessage, false); // Show error, stay on page
                        console.error(`[AJAX Error] ${xhr.status}: ${errorMessage}`);
                    }
                });
            });
        }

        function IsManager(POID) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/PurchaseOrder/CheckIsManager',
                    type: 'GET',
                    dataType: 'JSON',
                    data: { PurchaseOrderID: POID },
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            $("#hdn_isManager").val(data.Result.result);
                            resolve(true);
                        } else {
                            $.notify.error('Error', data.ErrorMessages);
                            resolve(false);
                        }
                    },
                    error: function (error) {
                        $(".loader").css("display", "none");
                        reject(false);
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

                        notify(false, errorMessage, false); // Show error, stay on page
                        console.error(`[AJAX Error] ${xhr.status}: ${errorMessage}`);
                    }
                });
            });
        }

        function GetAllFabricationList(Lineitemid, ProjectID) {
            var POID = $('#Hdn_PurchaseOrderID').val();
            var IsManager = $('#hdn_isManager').val();
            var UserType = $('#hdn_isUsertype').val();

            $.ajax({
                url: '/PurchaseOrder/GetFabricationItems',
                type: 'GET',
                dataType: 'HTML',
                data: { POLineitemID: Lineitemid, ProjectID: ProjectID, PurchaseOrderID: POID, IsManager: IsManager, UserType: UserType },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data !== '') {
                        $("#partialFabItems").html(data);
                        $(".fabdate").datepickercustom({
                            changeMonth: true,
                            changeYear: true,
                            maxDate: 0,
                            altFormat: "yy.mm.dd",
                        });
                        $(".addFab").attr("data-id", Lineitemid);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });
        }

        $(document).on('click', '.openindvfabhistory', function () {
            $("#fev_approv_history").modal("show");

            var PoLineItemApprovalID = $(this).data('approval');

            $.ajax({
                url: '/PurchaseOrder/GetFabIndvHistoryById',
                type: 'GET',
                dataType: 'HTML',
                data: { PoLineItemApprovalID: PoLineItemApprovalID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data != '') {
                        $('#partialFabHistory').html('');
                        $('#partialFabHistory').html(data);
                    }
                }
            });

        });

        $(document).on('change', '.ddl_actiontype_change', function () {
            var Id = $(this).data('polineiteam');
            var ddlid = $(this).val();
            var userlist = $('#ddl_selectuser_' + Id);
            var datepicker = $('#datepicker_' + Id);

            datepicker.toggle(["1", "6", "2", "3"].includes(ddlid));

            const modeMappings = {
                "1": "GETUSERSFORRECEIVE",
                "4": "GETUSERSFORCOMMENT",
                "6": "GETUSERSFORSEND",
                "7": "GETUSERSFORAMEND",
                "2": "GETUSERSFORAPPROVEREJECT",
                "3": "GETUSERSFORAPPROVEREJECT"
            };

            if (modeMappings[ddlid]) {
                BindUserOnchange(modeMappings[ddlid], Id);
            } else {
                userlist.empty().append("<option value='0'>---Select User---</option>");
            }

        });

        function BindUserOnchange(Mode, Id) {
            var ProjectID = $('#Hdn_ProjectId').val();
            const $selectSec = $('#ddl_selectuser_' + Id);
            $.ajax({
                url: '/PurchaseOrder/GetUsersOnFabrication',
                type: 'GET',
                dataType: 'JSON',
                data: { Mode: Mode, ApprovalID: Id, ProjectID: ProjectID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    $selectSec.empty().append('<option value="0" selected>--Select Users--</option>');
                    if (data.IsSuccess) {
                        data.Result.forEach(function (item) {
                            const option = `<option value="${item.id}">${item.name}</option>`;
                            $selectSec.append(option);
                        });
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        $(document).on('click', '#btn_AddItemApprovalInGrid', function () {

            const ItemApprovalID = $('#ddlItemApprovalType').val();
            const ItemApprovalDesc = $('#descforitem').val();
            const LineItemID = $(".addFab").attr("data-id");
            const ProjectID = $('#Hdn_ProjectId').val();

            if (ItemApprovalID == 0) {
                notify(false, 'Select Fabrication Approval Type', false);
                return;
            }

            if (ItemApprovalDesc == "") {
                notify(false, 'Enter Fabrication Approval Description.', false);
                return;
            }

            var formData = new FormData();
            formData.append("PoLineItemId", LineItemID);
            formData.append("desc", ItemApprovalDesc.trim());
            formData.append("ItemApprovalId", ItemApprovalID);
            formData.append("ProjectID", ProjectID);


            $.ajax({
                url: '/PurchaseOrder/FabApprovalItemValidation',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {

                        let isDuplicate = false;
                        $('.remove_note').each(function () {
                            var nowdesc = $(this).attr('data-desc');
                            if (nowdesc == ItemApprovalDesc) {
                                if (ItemApprovalID == $(this).attr('data-index')) {
                                    notify(false, "Description already exists", false);
                                    isDuplicate = true;
                                    return;
                                }
                            }

                        });

                        if (isDuplicate) return;

                        $("#fabDescription").show();
                        const approvalText = $("#ddlItemApprovalType option[value='" + ItemApprovalID + "']").text();
                        const html = `
					    <span class="remove_note" data-desc="${ItemApprovalDesc}" data-index="${ItemApprovalID}">
						    <p>${approvalText} - ${ItemApprovalDesc}</p>
						    <a href="#" class="deletefabitem remove_bar" data-itemid="${ItemApprovalID}">
							    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
						    </a>
					    </span>`;

                        $('#fabDescription .comment_list').append(html);
                        $("#approvalfinaladd").toggle($(".remove_note").length > 0);
                        $('#ddlItemApprovalType').val(0);
                        $('#descforitem').val('');
                    }
                    else {
                        notify(data.IsSuccess, data.ErrorMessages, true);
                    }
                }
            });
        });

        $(document).on('click', '.deletefabitem', function () {

            $.confirm({
                title: '',
                message: "Do you want to delete Fabrication Approval?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $(this).parent().remove();
                },
                onCancel: function () {
                    return;
                }
            });
            //if (confirm("Do you want to delete Fabrication Approval?")) {
            //    $(this).parent().remove();
            //}

            if ($('.remove_note').length > 0) {
                $('#approvalfinaladd').show();
            }
            else {
                $('#approvalfinaladd').hide();
            }
        });

        $(document).on('click', '#approvalfinaladd', function () {

            var POLineItemID = $(".addFab").attr("data-id");
            //var managerID = $('#hdn_isManager').val();
            var ProjectID = $('#Hdn_ProjectId').val();

            var createModelList = [];

            $('.remove_note').each(function () {

                var o = $(this);
                var ItemApprovalID = o.attr('data-index');
                var ItemApprovalDesc = o.attr('data-desc');

                var fd = {
                    POLineItemID: POLineItemID,
                    ItemApprovalID: ItemApprovalID,
                    ItemApprovalDesc: encodeURI(ItemApprovalDesc),
                    ProjectId: ProjectID
                };

                createModelList.push(fd);

            });

            $.ajax({
                url: '/PurchaseOrder/CreateNewFabrication',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'JSON',
                data: JSON.stringify(createModelList),
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('.remove_note').remove();
                        $('#fabDescription').hide();
                        $('.addFab').trigger('click');
                        GetAllFabricationList(POLineItemID, ProjectID);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on('click', '.addfab', function () {
            if ($(this).hasClass('collapsed')) {
                $('#collapseFab').slideUp();
                return;
            }
            $('#collapseFab').slideDown();
        });

        $(document).on('click', '.editFabDes', function () {
            var id = $(this).data('id');
            var desc = $(this).data('description');
            var approval = $(this).data('type');

            $('#headerforeditdesc').text("Edit Description For - " + approval);
            $('#editabledesc').val(desc);
            $('#editabledescid').val(id);
            $('#desc_update').modal('show');

        });

        $(document).on('click', '#editabledescid', function () {
            var ApprovalID = $(this).val();
            var desc = $("#editabledesc").val();
            var ProjectID = $('#Hdn_ProjectId').val();
            var LineitemID = $('.addFab').data('id');

            $.ajax({
                url: '/PurchaseOrder/UpdateDescItemApproval',
                type: 'POST',
                dataType: 'JSON',
                data: { ApprovalID: ApprovalID, desc: desc.trim() },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#desc_update').modal('hide');
                        GetAllFabricationList(LineitemID, ProjectID);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });

        $(document).on('click', '.saveData', async function () {
            var POLineItemID = $(this).data("item");
            var IsManager = $("#hdn_isManager").val();
            var POLineItemApprovalID = $(this).data("approval");
            var ProjectID = $('#Hdn_ProjectId').val();
            var FabPathGrpName = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").text();
            var ApprovalPathID = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();
            var ActionType = $('#ddl_actiontype_' + POLineItemApprovalID).val();
            var ActionDate = '';
            var CommentFab = $('#textarea_' + POLineItemApprovalID).val().trim();
            var ActionByProjectManager = "0";

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    notify(false, "FabCurrentResponse cannot be null", true);
                    return;
                }

                var responseParts = FabCurrentResponse.split("^^");
                var FabPathApprovalID = responseParts[0];
                var currentstatus = responseParts[1];


                if ((currentstatus == "Received" || currentstatus == "Approved" || currentstatus == "PathSet" || currentstatus == "Rejected") && (FabPathApprovalID == ApprovalPathID)) {
                    if (ActionType == 0) {
                        notify(false, "Please select an Action", false);
                        return;
                    }
                }

                if (IsManager == "1") {
                    var ActionByProjectManager = $('#ddl_selectuser_' + POLineItemApprovalID).val();
                    if (IsManager == "1" && ActionByProjectManager == "0" && (ActionType == "1" || ActionType == "6" || ActionType == "2" || ActionType == "3")) {
                        notify(false, "Please select  a user", false);
                        return;
                    }
                }

                if (ActionType == "1" || ActionType == "6" || ActionType == "2" || ActionType == "3") {
                    ActionDate = $('#datepicker_' + POLineItemApprovalID).val();
                }

                if (ApprovalPathID == "0") {
                    notify(false, "Please Select Fabrication Approval Path", false);
                    return;
                }

                if (CommentFab == "" && (ActionType == "3" || ActionType == "7" || ActionType == "4")) {
                    notify(false, "Please add comment", false);
                    return;
                }

                if (ActionType == "7") {
                    /*c = confirm("This is an approved item, all approval will be cancelled. Are you sure you want to amend the item?");*/
                    $.confirm({
                        title: 'Warning',
                        message: 'This is an approved item, all approval will be cancelled. Are you sure you want to amend the item?")',
                        type: 'warning',
                        confirmText: 'Continue',
                        cancelText: 'Go Back',
                        onConfirm: function () {
                            proceedSave();
                        },
                        onCancel: function () {
                            return;
                        }
                    });
                }
                proceedSave();

                function proceedSave() {

                    var fd = new FormData();
                    fd.append("POLineItemApprovalID", POLineItemApprovalID);
                    fd.append("ActionType", ActionType);
                    fd.append("ActionDate", ActionDate ? ActionDate : "");
                    fd.append("Comment", CommentFab ? encodeURI(CommentFab) : "");
                    fd.append("ActionByProjectManager", ActionByProjectManager);
                    fd.append("ProjectID", ProjectID);
                    fd.append("FabPathGrpName", FabPathGrpName);
                    fd.append("ApprovalPathID", ApprovalPathID);
                    fd.append("POLineItemID", POLineItemID);
                    fd.append("FabPathApprovalID", FabPathApprovalID);

                    var files = $('#file_' + POLineItemApprovalID)[0].files;
                    if (files && files.length > 0) {
                        var FileNames = Array.from(files).map(file => file.name).join("^^^");
                        fd.append("FileNames", FileNames);

                        $.each(files, function (i, file) {
                            fd.append("Files", file);
                        });
                    }

                    $.ajax({
                        url: "/PurchaseOrder/AddPOApprovalItem",
                        type: "POST",
                        data: fd,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                $.notify.success('Success', 'Added successfully');
                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                            else {
                                if (data.ErrorMessages && data.ErrorMessages.length > 0) {
                                    $.notify.error('Error', data.ErrorMessages.join(', '));
                                } else {
                                    $.notify.error('Error', 'Something went wrong.');
                                }

                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                        },
                        error: function () {
                            $(".loader").css("display", "none");
                            notify(false, "Server error while saving approval.", true);
                        }
                    });
                }


            } catch (error) {
                notify(false, error, false);
                console.error(error);
            }

        });


        $(document).on('change', '.ddl_approvalpath_change', async function () {
            var POLineItemID = $(this).data("item");
            var POLineItemApprovalID = $(this).data("id");
            var ProjectID = $('#Hdn_ProjectId').val();
            var CurrChangePathId = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    notify(false, "FabCurrentResponse cannot be null", true);
                    return;
                }

                var responseParts = FabCurrentResponse.split("^^");
                var FabPathApprovalID = responseParts[0];
                var currentstatus = responseParts[1];

                if (FabPathApprovalID === CurrChangePathId) {
                    GetAllFabricationList(POLineItemID, ProjectID);
                    return;
                }

                if (FabPathApprovalID != "0") {
                    $.confirm({
                        title: 'Warning',
                        message: "If you change the path it will go back to the beginning of the process.Are you sure you want to do the this?",
                        type: 'warning',
                        confirmText: 'Continue',
                        cancelText: 'Go Back',
                        onConfirm: function () {
                            var actiontype = $('#ddl_actiontype_' + POLineItemApprovalID);
                            actiontype.html("");
                            actiontype.append("<option value='0'>---Select Action---</option>");

                            var userlist = $('#ddl_selectuser_' + POLineItemApprovalID);
                            userlist.html("");
                            userlist.append("<option value='0'>---Select Action---</option>");
                        },
                        onCancel: function () {
                            GetAllFabricationList(POLineItemID, ProjectID);
                        }
                    });
                    //var confirm_selection = confirm("If you change the path it will go back to the beginning of the process.Are you sure you want to do the this?");
                    //if (!confirm_selection) {
                    //    GetAllFabricationList(POLineItemID, ProjectID);
                    //}
                    //else {
                    //    var actiontype = $('#ddl_actiontype_' + POLineItemApprovalID);
                    //    actiontype.html("");
                    //    actiontype.append("<option value='0'>---Select Action---</option>");

                    //    var userlist = $('#ddl_selectuser_' + POLineItemApprovalID);
                    //    userlist.html("");
                    //    userlist.append("<option value='0'>---Select Action---</option>");
                    //}
                }

            } catch (error) {
                $.notify.error('Error', error.message);
                console.error(error);
            }

        });

        function CheckFabPathApprovedID(POLineItemApprovalID) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/PurchaseOrder/CheckCurrPathIdAndStatus',
                    type: 'GET',
                    dataType: 'JSON',
                    data: { POLineItemApprovalID: POLineItemApprovalID },
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            resolve(data.Result);
                        } else {
                            $.notify.error('Error', data.ErrorMessages);
                            reject("");
                        }
                    },
                    error: function (xhr, status, error) {
                        $(".loader").css("display", "none");
                        reject("");
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
                    }
                });
            });

        }

        $(document).on('click', '.deleteHistory', function () {
            var ProjectID = $('#Hdn_ProjectId').val();
            var HistoryId = $(this).data("id");
            var POLineItemID = $(this).data("item");
            $.confirm({
                title: '',
                message: 'Are you sure you want to delete the item history?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {

                    $.ajax({
                        url: "/PurchaseOrder/DeleteFabHistory",
                        type: "GET",
                        data: { HistoryId: HistoryId, POLineItemID: POLineItemID },
                        dataType: 'json',
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                $.notify.success('Success', 'Successfully deleted the history');
                                $('#fev_approv_history').modal('hide');
                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                        }
                    });
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });
           
        });

        // #endregion

        // #region :: START Fabrication When PolineItem Add - 12-11-2025

        $(document).on('click', '.addFabOnAddLineitemsModel', function () {
            let btn = $(this);
            let icon = btn.find('.icon-fab-toggle');
            let panel = $('#collapseFabOnAddLineitemsModel');

            if (panel.hasClass('show')) {
                panel.collapse('hide');
                icon.removeClass('fa-square-minus').addClass('fa-square-plus');
            } else {
                panel.collapse('show');
                icon.removeClass('fa-square-plus').addClass('fa-square-minus');
            }
        });

        $(document).on('click', '#btn_AddItemApprovalInGridOnAddLineitemsModel', function () {

            const ItemApprovalID = $('#ddlItemApprovalTypeOnAddLineitemsModel').val();
            const ItemApprovalDesc = $('#descforfabitemOnAddLineitemsModel').val().trim();

            const ProjectID = $('#Hdn_ProjectId').val();

            if (ItemApprovalID == 0) {
                notify(false, 'Select Fabrication Approval Type', false);
                return;
            }

            if (ItemApprovalDesc == "") {
                notify(false, 'Enter Fabrication Approval Description.', false);
                return;
            }

            $.ajax({
                url: '/PurchaseOrder/FabApprovalItemValidationOnAddPoLineItem',
                type: 'GET',
                dataType: 'JSON',
                data: { ProjectID: ProjectID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        let isDuplicate = false;
                        $('.remove_note_on_polineitem').each(function () {
                            var nowdesc = $(this).attr('data-desc');
                            if (nowdesc == ItemApprovalDesc) {
                                if (ItemApprovalID == $(this).attr('data-index')) {
                                    $.notify.error('Error', 'Description already exists');
                                    isDuplicate = true;
                                    return;
                                }
                            }
                        });

                        if (isDuplicate) return;

                        $("#fabDescriptionOnAddLineitemsModel").show();
                        const approvalText = $("#ddlItemApprovalTypeOnAddLineitemsModel option[value='" + ItemApprovalID + "']").text();
                        const html = `
					    <span class="remove_note_on_polineitem" data-desc="${ItemApprovalDesc}" data-index="${ItemApprovalID}">
						    <p>${approvalText} - ${ItemApprovalDesc}</p>
						    <a href="#" class="deletefabitemOnAddLineitemsModel remove_bar" data-itemid="${ItemApprovalID}">
							    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
						    </a>
					    </span>`;

                        $('#fabDescriptionOnAddLineitemsModel .comment_list').append(html);
                        $('#ddlItemApprovalTypeOnAddLineitemsModel').val(0);
                        $('#descforfabitemOnAddLineitemsModel').val('');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });


        $(document).on('click', '.deletefabitemOnAddLineitemsModel', function () {
            $.confirm({
                title: '',
                message: 'Do you want to delete Fabrication Approval?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $(this).parent().remove();
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });
        });

        // #endregion

        $(document).on('click', '#btn_AddExpNote', function () {

            var POLineItemID = $('#Hdn_POLIID').val();
            var Notes = $('#POItemExpediteNote').val()?.trim();

            if (Notes == "" || Notes == null) {
                notify(false, 'Note cannot be Empty', false);
                return;
            }

            $.confirm({
                title: '',
                message: 'Do you want to save Note?',
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    let fd = {
                        POLineItemID: POLineItemID,
                        Note: Notes
                    }
                    $.ajax({
                        url: "/PurchaseOrder/SavePOExpediteNote",
                        data: fd,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                $('#po_exp_note').modal('hide');
                                $(".loader").css("display", "none");
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");
                                $('#POItemExpediteNote').val('');

                            }
                        }
                    });
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });
           
        });

        $(document).on('click', '#btn_AddPOItemExpdNoteFull', function () {
            var ArrivalDate = $("#txt_ExpectedArrivalDate").val();
            var POLineItemID = $('#Hdn_POLIID').val();
            var ItemStatus = $('#ddl_ItemStatus').val();
            var POID = $('#Hdn_PurchaseOrderID').val();

            if ($('#txt_RecvdDate1').val() == '' || $('#txt_RecvdDate1').val() == null || $('#txt_RecvdDate1').val() == undefined) {
                notify(false, "Please enter Date", false);
                return;
            }

            var recvddt = $('#txt_RecvdDate').val();
            var recvdQty = $('#txt_ReturnQty').val();
            var refrnc = $('#txt_Reference1').val();
            var expdtnt = $('#ItemExpediteNote').val();
            var recvdDate = $('#txt_RecvdDate1').val();
            var reference = $('#txt_Reference').val();
            var Note = $('#ItemExpediteNote').val() == null || $('#ItemExpediteNote').val() == "" ? "Received Fully" : $('#ItemExpediteNote').val();
            var REFERENCE = "";

            if (refrnc != null && refrnc != "") {
                REFERENCE = refrnc;
            }
            else {
                REFERENCE = reference;
            }

            let fd = {
                POID: POID,
                Note: Note,
                ReceivedDate: recvdDate,
                Reference: REFERENCE,
                ArrivalDate: ArrivalDate
            }
            $.ajax({
                url: "/PurchaseOrder/SavePOExpediteNoteAllFull",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('#po_exp_note').modal('hide');
                        $(".loader").css("display", "none");
                        const POLIID = $('#hdn_poli').val();

                        $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                        polineItems();

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }

                }
            });



        });

        $(document).on('click', '.committedcostdetails', function () {
            $('#committedmodal').modal('hide');
            var costDetails = $(this).data('costdetails');
            var POLineItemId = $(this).data('li');
            var row = $(this).closest('tr');
            var description = row.children('td').eq(4).text();
            var itemNumber = row.children('td').eq(1).text()
            var pocost = parseFloat(costDetails.split('^^')[1]);
            var bcost = parseFloat(costDetails.split('^^')[2]);
            var curr = costDetails.split('^^')[0];
            var conversionRate = costDetails.split('^^')[3];
            var variance = bcost - (pocost * conversionRate);
            var newRows = `
				<tr>
					<td>${itemNumber}</td>
					<td>${description}</td>
					<td>${formatNumber(pocost)} ${curr}</td>
					<td>${formatNumber(bcost)}</td>
					<td>${formatNumber(variance)}</td>
				</tr>
			`;
            $("#header_tablebody").empty().append(newRows);

            $.ajax({
                url: "/PurchaseOrder/GetPOCommittedDetails",
                data: { POLineItemID: POLineItemId },
                type: "GET",
                dataType: "HTML",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#commitdetailsbind').html('');
                        $('#commitdetailsbind').html(data);
                        setTimeout(() => {
                            CommittedDetailsDataTable();
                            $('#committedmodal').modal('show');
                        }, 500);

                        $(".loader").css("display", "none");
                    }
                    else {
                        notify(false, "Something went Wrong.", true);
                        $(".loader").css("display", "none");
                    }

                }
            });

        });
        function CommittedDetailsDataTable() {
            if ($.fn.DataTable.isDataTable("#Committedlist")) {
                $('#Committedlist').DataTable().clear().destroy();
            }
            //$('#Committedlist').DataTable().clear().destroy();
            //$("#Committedlist thead tr")
            //	.clone(true)
            //	.addClass("flter")
            //	.appendTo("#Committedlist thead");

            var table = $("#Committedlist").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 50,
                orderCellsTop: true,
                scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1] },
                    //{ width: "10%", targets: 1 },  // Explicitly set column widths
                    //{ width: "15%", targets: 2 },
                    //{ width: "20%", targets: 3 },
                ],

                initComplete: function () {
                    var api = this.api();

                    // For each column
                    //api
                    //	.columns()
                    //	.eq(0)
                    //	.each(function (colIdx) {
                    //		// Set the header cell to contain the input element


                    //		// On every keypress in this input
                    //		$(
                    //			"input",
                    //			$(".filters th").eq($(api.column(colIdx).header()).index())
                    //		)
                    //			.off("keyup")
                    //			.on("keyup", function () {
                    //				// Get the search value
                    //				$(this).attr("title", $(this).val());
                    //				var regexr = "({search})";

                    //				// Search the column for that value
                    //				api
                    //					.column(colIdx)
                    //					.search(
                    //						this.value !== ""
                    //							? regexr.replace("{search}", "(((" + this.value + ")))")
                    //							: "",
                    //						this.value !== "",
                    //						this.value === ""
                    //					)
                    //					.draw();
                    //			});
                    //	});

                    api.columns().eq(0).each(function (colIdx) {
                        //var cell = $(".filterstb th").eq($(api.column(colIdx).header()).index());
                        //$(cell).html('<input type="text" class="form-control form-control-sm" placeholder="Search" />');

                        // Apply search on input event
                        $("#dt-search-2").on("keyup change", function () {
                            if (api.column(colIdx).search() !== this.value) {
                                api.column(colIdx).search(this.value).draw();
                            }
                        });
                    });
                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#Committedlist tbody').html(
                            '<tr><td colspan="2" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });
        }

        $(document).on('change', '#Chk_hidden', function () {

            const purchaseOrderId = $('#Hdn_PurchaseOrderID').val();
            var ishidden = $('#Chk_hidden').is(':checked') ? true : false;

            $.ajax({
                url: "/PurchaseOrder/HiddenPO",
                data: { POID: purchaseOrderId, status: ishidden },
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $(".loader").css("display", "none");
                    }
                    else {
                        notify(false, data.ErrorMessages, true);
                        $(".loader").css("display", "none");
                    }
                }
            });

        });

        $(document).on('click', '#dragger', function () {

            var count = 1;
            var item = $($('.selected')[0]).find('td:eq(1)').html();

            $('#reorderheader').text("Reorder item " + item);

            var html = "";

            $('#po_table tbody tr').each(function () {
                let itemselectedid = $($('.selected')[0]).attr('data-poitemid');
                var tmpid = $(this).attr('data-poitemid');

                if (tmpid != itemselectedid) {
                    var Itemnumber = $(this).find('td:eq(2)').text(); //Item Generated PO Number
                    var Itemdesc = $(this).find('td:eq(4)').html(); //Item Description
                    var itemid = $(this).attr('data-id');//index of the LI
                    html += `<option value="${itemid}">${count++}.${Itemnumber}-${Itemdesc}</option>`
                }
                else {
                    var Itemnumber = $(this).find('td:eq(2)').text(); //Item Generated PO Number
                    var Itemdesc = $(this).find('td:eq(4)').html(); //Item Description
                    var itemid = $(this).attr('data-id');//index of the LI
                    html += `<option value="${itemid}" disabled>${count++}.${Itemnumber}-${Itemdesc}</option>`

                }

            });

            $('#ddl_reorder').html(html);

            window.setTimeout(function () {
                $('#reorder_modal').modal('show');
            }, 100);


        });

        $(document).on('click', '#reorderrowbtn', function () {
            var previousVal = $($('.selected')[0]).attr('data-id');

            var Current = parseInt($('#ddl_reorder').val());

            var placer = $('#ddl_placereorder').val();

            Current = placer == 1 ? Current : Current + 1;

            var poid = $('#Hdn_PurchaseOrderID').val();

            let fd = {
                Prev: previousVal,
                Current: Current,
                POID: parseInt(poid)
            };

            $.ajax({
                url: "/PurchaseOrder/SortPOLineItem",
                type: "POST",
                data: fd,
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        notify(true, data.Result, true);
                        $('#removemultiple').hide();
                        polineItems();
                    }
                    else {
                        notify(false, data.ErrorMessages, true);
                        $(".loader").css("display", "none");
                    }
                }

            });
        });

        $(document).on('click', '.delPOLI', function () {
            var POLIID = $(this).data('poli');

            $.confirm({
                title: '',
                message: 'Are you sure you want to delete this PO Item?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/PurchaseOrder/CheckInvoiceTotal",
                        data: { POLIID: POLIID },
                        type: "POST",
                        dataType: "json",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                if (parseFloat(data.Result) != 0) {
                                    $.confirm({
                                        title: 'Warning',
                                        message: "The item " + "has invoiced value of " + formatNumber(data.Result) + ", do you want to make the item cost and quantity zero?",
                                        type: 'warning',
                                        confirmText: 'Continue',
                                        cancelText: 'Go Back',
                                        onConfirm: function () {
                                            MakeZero(POLIID);
                                        },
                                        onCancel: function () {
                                            return;
                                        }
                                    });
                                }

                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");
                            }

                        }
                    });

                    $.ajax({
                        url: "/PurchaseOrder/DeletePOLineItemsSingle",
                        data: { POLineItemID: POLIID },
                        type: "POST",
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                window.setTimeout(function () {
                                    window.location.reload();
                                }, 2000);
                                $('#removemultiple').hide();
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");
                            }

                        }
                    })
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });

        });
        function MakeZero(POLineItemId) {

            $.ajax({
                url: "/PurchaseOrder/MakeItemZero",
                data: { POLineitemID: POLineItemId },
                type: "POST",
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        return;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }

                }
            })
        }

        var POLInotEqualToZero = {};
        var IDsToDeleteAfterChecking = [];
        var IDsToMakeZero = [];

        $(document).on('click', '#deleteMultiple', function () {

            var count = $('.selected').length;
            $.confirm({
                title: '',
                message: "Do you really want to delete " + count + " from the PO?",
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    var polineItemIDs = $('.selected').map(function () {
                        return $(this).data('poitemid');
                    }).get().join(',');
                    $.ajax({
                        url: "/PurchaseOrder/CheckItemInvoiceMultiple",
                        data: { POLineItemIDs: polineItemIDs },
                        type: "POST",
                        async: false,
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                POLInotEqualToZero = data.Result;
                            }
                            else {
                                $(".loader").css("display", "none");
                            }
                        }
                    })
                    if (Object.keys(POLInotEqualToZero).length > 0) {
                        for (var item of Object.values(POLInotEqualToZero)) {
                            if (item.totalInvoice != 0) {
                                var itemNumber = "#item_" + item.poLineItemID;
                                var itemValue = $(itemNumber).text();

                                $.confirm({
                                    title: '',
                                    message: "The item " + itemValue + " " + "has invoiced value of " + formatNumber(item.totalInvoice) + ", do you want to make the item cost and quantity zero?",
                                    type: 'confirm',
                                    confirmText: 'Yes, Proceed',
                                    cancelText: 'Cancel',
                                    onConfirm: function () {
                                        IDsToMakeZero.push(item.poLineItemID);
                                    },
                                    onCancel: function () {
                                        alert('Cancelled! Page would reload here.');
                                    }
                                });

                            }
                            else {
                                IDsToDeleteAfterChecking.push(item.poLineItemID);
                            }
                        }
                    }
                    let fd = {
                        POLIToMakeZero: IDsToMakeZero.join(","),
                        POLIToDelete: IDsToDeleteAfterChecking.length == 0 ? polineItemIDs : IDsToDeleteAfterChecking.join(",")
                    }
                    //ajaxCall
                    $.ajax({
                        url: "/PurchaseOrder/DeleteMultiplePOLineItem",
                        data: fd,
                        type: "POST",
                        async: false,
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                $('#removemultiple').hide();
                                window.setTimeout(function () {
                                    polineItems();
                                }, 2000);

                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");

                            }
                        }
                    })
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });

        });

        $(document).on('click', '#editVendorContact', function () {
            var vendorID = $('#txt_VendorName').val();
            if (vendorID == "0" || vendorID == null || vendorID == undefined) {
                notify(false, "Please Select Vendor", false);
                return;
            }
            var url = "/Vendors/EditVendorContact?vendorId=" + vendorID;
            //$(this).attr("href", url);
            window.open(url, "_blank");

        });

        $(document).on('change', '#txt_ExpectedArrivalDate', function () {

            setStatus();
        });
        function setStatus() {

            if ($('#txt_ExpectedArrivalDate').val() > $('#Hdn_PORequiedDate').val()) {
                $("#ddl_ItemStatus").val('2');
            }
            else {
                $("#ddl_ItemStatus").val($("#Hdn_ItemStatus").val());
            }
        }

        $(document).on('click', '#invstatus', function () {
            var poid = $('#Hdn_PurchaseOrderID').val();
            var url1 = "/Invoice/invoicesearch?id=" + poid;
            window.open(url1);
        });

        $(document).on('click', '#AddLineItemPO', function () {

            const ponumber = $('#PODetailsCollapse').text().split("-")[2].trim();
            const POID = $('#Hdn_PurchaseOrderID').val();
            const ProjectID = $('#Hdn_ProjectId').val();

            let fd = {
                POID: POID,
                PONumber: ponumber,
                ProjectID: ProjectID
            }

            $.ajax({
                url: "/PurchaseOrder/AddItemsToPOModal",
                data: fd,
                type: "GET",
                dataType: "HTML",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {
                        $('#addpolibind').html('');
                        $('#addpolibind').html(data);
                        if (tinymce.get("txt_LineItemDtldDesc")) {
                            tinymce.get("txt_LineItemDtldDesc").remove();
                        }
                        let fontsize = "";
                        for (let a = 5; a <= 22; a = a + 0.5) {
                            fontsize += fontsize == "" ? a + "px" : " " + a + "px";
                        }

                        tinymce.init({
                            formats: {
                                underline: { inline: 'u' },
                            },
                            fontsize_formats: fontsize,
                            selector: "#txt_LineItemDtldDesc",
                            plugins: "textcolor,paste",
                            paste_auto_cleanup_on_paste: false,
                            paste_postprocess: function (pl, o) {
                                o.node.innerHTML = replaceAll(o.node.innerHTML.toUpperCase(), '&NBSP;', '&nbsp');
                            },
                            toolbar: "undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor | fontsizeselect",
                            menubar: false,
                            setup: function (ed) {
                                ed.on('focusin', function (e) {
                                    ed.theme.resizeTo("100%", 480);
                                    window.location = window.location.href.split('#')[0] + '#editor';
                                });

                                ed.on('keydown', function (e) {
                                    var kc = e.key.charCodeAt(0);

                                    if (kc >= 97 && kc <= 122 && e.ctrlKey == false && e.shiftKey == false && e.altKey == false) {
                                        tinymce.activeEditor.execCommand('mceInsertContent', true, String.fromCharCode(kc - 32));
                                        return false;
                                    }

                                });
                            },

                        });

                        var poid = $('#Hdn_PurchaseOrderID').val();
                        let sectionId = $('#Ddl_SecPOLI').val();
                        if (sectionId != null || sectionId != '') {
                            LineItemDropDown(poid, sectionId);
                        }
                        $('#Ddl_LineItems').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',

                            onClick: function () {
                                var selectedItems = $('#Ddl_LineItems').multipleSelect('getSelects');

                                if (selectedItems.length > 0) {
                                    $('#btn_addlitolist').prop('disabled', false);
                                } else {
                                    $('#btn_addlitolist').prop('disabled', true);
                                }
                            }
                        });
                        $('#add_itme_pom').modal('show');
                    }
                    else {
                        notify(false, "Something Went Wrong!!!", false);
                    }
                    $(".loader").css("display", "none");

                }
            });
        });
        function LineItemDropDown(PurchaseOrderId, SectionID) {
            if (SectionID == "0") {
                const dropdown = $('#Ddl_LineItems');
                dropdown.empty();
                dropdown.append('<option value="0">--Select LineItem--</option>');
                return;
            }

            $.ajax({
                url: "/PurchaseOrder/LineItemDropDownList",
                type: "POST",
                data: { POID: PurchaseOrderId, SectionId: SectionID },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    let dropdown = $('#Ddl_LineItems');
                    dropdown.append('<option value="0">--Select LineItem--</option>');
                    if (data.IsSuccess) {
                        dropdown.empty();
                        const result = data.Result;

                        result.forEach(function (item) {
                            dropdown.append(`<option value='${item.lineItemId}'>${item.itemDescription}</option>`);
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        dropdown.empty();
                        dropdown.append('<option value="0">--Select LineItem--</option>');
                        $(".loader").css("display", "none");
                    }
                    $('#Ddl_LineItems').multipleSelect('refresh');
                }

            });


        }

        $(document).on('click', '[id^="chk_ActvTg_"]', function () {
            const obj = $(this);
            const lineItemId = obj.attr('id').split('_')[2];
            let Quantity = $('.LineItem_Quantity').val();
            const LineItemId = localStorage.getItem('selectedLineItemId');
            let specValue = $('#txt_LineItemSpec_' + lineItemId).val();
            let selectedUomText = $('#uomdd_' + lineItemId + ' option:selected').text();
            if (obj.is(':checked') && LineItemId && LineItemId !== "0") {
                $('#txt_LineItemAutoTagg_' + lineItemId).removeClass('d-none');
            } else {
                if (!obj.is(':checked') && LineItemId && LineItemId !== "0") {
                    $('#txt_LineItemAutoTagg_' + lineItemId).addClass('d-none');
                    /*notify(false, "You have UNCHECKED ACTIVE TAG after selecting the LINEITEMS...", true);*/
                    return;
                } else {
                    $('#txt_LineItemAutoTagg_' + lineItemId).addClass('d-none');
                    notify(false, "Please Select LineItem first...", true);
                    obj.prop('checked', false);
                    return;
                }
            }

            $.ajax({
                url: "/PurchaseOrder/LoadAutoTagData",
                data: { LineItemID: LineItemId },
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        const tempData = data.Result[0];
                        let html = "";
                        html += "Tag: " + tempData.projectName + "\n";
                        html += "Specification: " + specValue + "\n";
                        html += "Description: " + tempData.itemDescription + "\n";
                        html += Quantity + " " + selectedUomText
                            /*$('#Ddl_LineItemUnt option:selected').text()*/ + "\n";

                        $('#txt_LineItemAutoTagg_' + lineItemId).val(html);
                    } else {
                        $('#txt_LineItemAutoTagg_' + lineItemId).val('');
                    }
                    $(".loader").css("display", "none");
                }
            });
        });


        $(document).on('click', '#chk_ActvTg', function () {
            const LineItemId = $('#Ddl_LineItems').val()?.toString();
            const obj = $(this);

            if ($(obj).is(':checked') == true && LineItemId != null && LineItemId != "0" && LineItemId != "") {
                $('#txt_LineItemAutoTagg').removeClass('d-none');
            }
            else {

                if ($(obj).is(':checked') == false && LineItemId != null && LineItemId != "0" && LineItemId != "") {
                    $('#txt_LineItemAutoTagg').addClass("d-none");
                    /*notify(false, "You have UNCHECKED ACTIVE TAG after selecting the LINEITEMS...", true);*/
                    return;
                }
                else {
                    $('#txt_LineItemAutoTagg').addClass("d-none");
                    notify(false, "Please Select LineItem first...", true);
                    $('#chk_ActvTg').prop('checked', false);
                    return;
                }

            }
            $.ajax({
                url: "/PurchaseOrder/LoadAutoTagData",
                data: { LineItemID: LineItemId },
                type: "GET",
                dataType: "json",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const tempData = data.Result;
                    let html = "";
                    if (data.IsSuccess) {

                        for (i = 0; i < tempData.length; i++) {
                            html += "Tag: " + tempData[i].projectName + "\n";
                            html += "Specification: " + tempData[i].specNum + "\n";
                            html += "Description: " + tempData[i].itemDescription + "\n";
                            html += "" + $('#txt_LineItemQty').val() + " " + $('#Ddl_LineItemUnt option:selected').text() + "\n";
                        }
                        $('#txt_LineItemAutoTagg').val(html);
                    }
                    else {
                        $('#txt_LineItemAutoTagg').val('');

                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on('change', '#Ddl_LineItems', function () {

            const LineItemId = $(this).val();
            if (LineItemId == null || LineItemId == "0") {
                $('#txt_LineItemQty').val('');
                $('#Ddl_LineItemUnt').val(0);
                $('#txt_LineItemCosts').val('');
                $('#txt_LineItemModel').val('');
                $(".loader").css("display", "none");
                $('#txt_LineItemModel').prop('disabled', true);
                $('.hidefields').css('display', '');
                $('#btn_addlitolist').attr('disabled', true);                
                return;
            }

            if (LineItemId.length == 1) {
                $('.hidefields').css('display', '');
                $('#btn_addlitolist').removeAttr('disabled');              
                $.ajax({
                    url: "/PurchaseOrder/SelectedLineItemDetails",
                    type: "POST",
                    data: { LineItemId: LineItemId },
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        const result = data.Result;
                        if (data.IsSuccess) {
                            $('#txt_LineItemModel').removeAttr('disabled');
                            $('#txt_LineItemQty').val(result.quanity);
                            $('#Ddl_LineItemUnt').val(result.uom);
                            $('#txt_LineItemCosts').val(result.cost);
                            $('#txt_LineItemModel').val(result.model);
                            $(".loader").css("display", "none");
                        }
                        else {
                            $('#txt_LineItemQty').val('');
                            $('#Ddl_LineItemUnt').val(0);
                            $('#txt_LineItemCosts').val('');
                            $('#txt_LineItemModel').val('');
                            $(".loader").css("display", "none");
                            $('#txt_LineItemModel').prop('disabled', true);
                        }
                    }
                })
            }
            else if (LineItemId.length > 1) {
                $('.hidefields').css('display', 'none');
                $('#btn_addlitolist').removeAttr('disabled');  

                $('.addFabOnAddLineitemsModel').prop('disabled', true).addClass('btn-disabled');

                const fabCollapseEl = document.getElementById('collapseFabOnAddLineitemsModel');

                if ($(fabCollapseEl).hasClass('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(fabCollapseEl)
                        || new bootstrap.Collapse(fabCollapseEl);

                    bsCollapse.hide();
                }
            }

        });

        $(document).on('change', '#Ddl_SecPOLI', function () {

            const SectionID = $('#Ddl_SecPOLI').val();
            var poid = $('#Hdn_PurchaseOrderID').val();
            LineItemDropDown(poid, SectionID);
        });

        $(document).on('click', '#btn_addlitolist', function () {

            var obj = $(this);
            if ($('#Ddl_LineItems').val() == null || $('#Ddl_LineItems').val() == "0") {
                //let ullist = $('#lilist');
                //ullist.empty();
                //$('#lilist').removeClass('comment_list');

                notify(false, 'Please Select Line Item', false);
                return;
            }

            var lineiemId = $('#Ddl_LineItems').val();
            var lilength = $('#lilist').length;

            //if (lilength > 0 && lilength != undefined) {
            //	var lineItemId = $('#lilist').data('')
            //}

            if (lineiemId.length == 1) {
                let ullist = $('#lilist');
                obj.removeAttr('disabled');
                $('#lilist').addClass('comment_list');
                var itemQty = parseFloat($('#txt_LineItemQty').val())?.toFixed(2);
                var cost = parseFloat($('#txt_LineItemCosts').val())?.toFixed(2);
                var model = $('#txt_LineItemModel').val()?.trim();
                var UOM = $('#Ddl_LineItemUnt option:selected');
                lineItemDescription = $('#Ddl_LineItems option:selected').text();
                var parts = lineItemDescription.split("-");
                var filtered = parts.filter((_, index) => index != 5);
                var result = filtered.join("-");

                if ($('#lilist li.lidata[data-id="' + lineiemId.toString() + '"]').length === 0) {
                    var listItem = `
								<li class="lidata" data-id="${lineiemId.toString()}">
									Description -
									<span class="desc">
										 ${result} 
									</span>
									Cost -
									<span class="cost">
										${cost}
									</span>
									Quantity -
									<span class="qty">
									 ${itemQty}
									</span>
									Model-
									<span class="model">
									${model}
									</span>
									UOM-
									<span data-uomid="${UOM.val()}" class="uomid">
									${UOM.text()}
									</span>
									<a href="javascript:void(0)" title="Remove this item" class="removeAddedPoItems">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i>
									</a>
								</li>
							`;

                    ullist.append(listItem);

                }
                else {
                    notify(false, 'This line item already exists in the list.', false);
                    var existingLi = $('#lilist li.lidata[data-id="' + lineiemId.toString() + '"]');
                    existingLi.css('background', '#f8d7da');

                    setTimeout(function () {
                        existingLi.css('background', '');
                    }, 2000);

                }

                $('.addFabOnAddLineitemsModel').prop('disabled', false).removeClass('btn-disabled');

                return;
            }
            else {
                $('.addFabOnAddLineitemsModel').prop('disabled', true).addClass('btn-disabled');
                const fabCollapseEl = document.getElementById('collapseFabOnAddLineitemsModel');

                if ($(fabCollapseEl).hasClass('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(fabCollapseEl)
                        || new bootstrap.Collapse(fabCollapseEl);

                    bsCollapse.hide();
                }
            }

            $.ajax({
                url: "/PurchaseOrder/AddLIToList",
                type: "GET",
                data: { LineItemId: lineiemId.toString() },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    let ullist = $('#lilist');
                    //ullist.empty();

                    if (data.IsSuccess) {
                        $('#lilist').addClass('comment_list');
                        var result = data.Result;

                        for (var item of result) {

                            var costFormatted = parseFloat(item.cost).toFixed(2);
                            var quantityFormatted = parseFloat(item.quantity).toFixed(2);
                            if ($('#lilist li.lidata[data-id="' + item.lineItemID + '"]').length === 0) {
                                var listItem = `
								<li class="lidata" data-id="${item.lineItemID}">
									Description - 
									<span class="desc">
										${item.itemNumber} 
									</span>
									Cost - 
									 <span class="cost">
										${costFormatted}
									</span><br>
									Quantity -
									<span class="qty">
										 ${quantityFormatted}
									</span>
									Model-
									<span class="model">
									${item.model}
									</span>
									UOM-
									<span data-uomid="${item.uoM_ID}" class="uomid">
									${item.uom}
									</span>
									<a href="javascript:void(0)" title="Remove this item" class="removeAddedPoItems">
										<i class="fa-solid fa-xmark" aria-hidden="true"></i>
									</a>
								</li>
							`;
                                ullist.append(listItem);
                            }
                            else {
                                $.notify.error('Error', 'This line item already exists in the list.');
                                var existingLi = $('#lilist li.lidata[data-id="' + item.lineItemID + '"]');
                                existingLi.css('background', '#f8d7da'); // light red (like bootstrap danger)

                                // Remove the red highlight after 2 seconds
                                //setTimeout(function () {
                                //	$existingLi.css('background', '');
                                //}, 2000);
                                (function (element) {
                                    setTimeout(function () {
                                        element.css('background', '');
                                    }, 2000);
                                })(existingLi);

                                continue;
                            }

                        }

                        if (result.length == 1) {
                            $('.addFabOnAddLineitemsModel').prop('disabled', false).removeClass('btn-disabled');
                        }
                        else {
                            $('.addFabOnAddLineitemsModel').prop('disabled', true).addClass('btn-disabled');
                            const fabCollapseEl = document.getElementById('collapseFabOnAddLineitemsModel');

                            if ($(fabCollapseEl).hasClass('show')) {
                                const bsCollapse = bootstrap.Collapse.getInstance(fabCollapseEl)
                                    || new bootstrap.Collapse(fabCollapseEl);

                                bsCollapse.hide();
                            }
                        }

                        $(".loader").css("display", "none");
                    }
                    else {
                        $('#lilist').removeClass('comment_list');
                        $(".loader").css("display", "none");
                    }
                }

            });

        });

        $(document).on('click', '.removeAddedPoItems', function () {

            $(this).closest('li.lidata').remove();

            const remaining = $('li.lidata .removeAddedPoItems').length;

            if (remaining === 1) {
                $('.addFabOnAddLineitemsModel')
                    .prop('disabled', false)
                    .removeClass('btn-disabled');
            } else {
                $('.addFabOnAddLineitemsModel')
                    .prop('disabled', true)
                    .addClass('btn-disabled');
            }

            const fabCollapseEl = document.getElementById('collapseFabOnAddLineitemsModel');
            if ($(fabCollapseEl).hasClass('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(fabCollapseEl)
                    || new bootstrap.Collapse(fabCollapseEl);
                bsCollapse.hide();
            }
        });

        $(document).on('click', '#btn_addlidb', function () {          
            if ($('#lilist li').length == 0) {
                notify(false, 'Please Add LineItem To the list to continue...', false);
                return;
            }

            const fabItemList = $(".remove_note_on_polineitem").length;

            if (fabItemList >= 1) {
                $.ajax({
                    url: '/PurchaseOrder/FabApprovalItemValidationOnAddPoLineItem',
                    type: 'GET',
                    dataType: 'JSON',
                    data: { ProjectID: $('#Hdn_ProjectID').val() },
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (!data.IsSuccess) {
                            notify(data.IsSuccess, data.ErrorMessages, true);
                            return;
                        }
                    }
                });
            }

            var ItemApprovalID = buildItemApprovalID();
            localStorage.setItem('selectedLineItemId', $('#Ddl_LineItems').val());
            if ($('#lilist li').length == 1) {
                //ajax call
                let li = $('#lilist .lidata');
                const POLineItemID = li.data('id');
                const ProjectID = $('#Hdn_ProjectID').val();
                const purchaseOrderId = $('#Hdn_PurchaseOrderID').val();


                if (POLineItemID == null || POLineItemID == undefined || POLineItemID == "0") {
                    notify(false, "Plese select List Item", true);
                    return;
                }

                let LineItemQty = parseFloat(li.find('.qty').text().trim());

                if (LineItemQty == "" || isNaN(LineItemQty)) {
                    //$('#txt_LineItemQty').val('0.00');
                }

                LineItemQty = parseFloat(li.find('.qty').text().replace('Quantity -', '').trim());

                if (isNaN(LineItemQty)) {
                    notify(false, "Please enter Line Item Qty", false);
                    //$('#txt_LineItemQty').focus();
                    li.css('background', '#f8d7da');
                    return;
                }

                let LineItemUnt = li.find('.uomid').data('uomid');

                if (LineItemUnt == "0") {
                    notify(false, "Please Select a Line Item Unit", false);
                    $('#Ddl_LineItemUnt').trigger('focus');
                    li.css('background', '#f8d7da');
                    return;
                }
                let LineItemCosts = parseFloat(li.find('.cost').text().trim());
                if (isNaN(LineItemCosts)) {
                    notify(false, "Please enter Line Item Costs", false);
                    $('#txt_LineItemCosts').trigger('focus');
                    li.css('background', '#f8d7da');
                    return;
                }

                let NoStateTx = false;
                if ($('#chk_StateTx').is(':checked')) {
                    NoStateTx = true;
                }
                let NoGSTHSTTx = false;
                if ($('#chk_GSTHSTTx').is(':checked')) {
                    NoGSTHSTTx = true;
                }
                let NoPSTTx = true;
                if ($('#chk_PSTTx').is(':checked')) {
                    NoPSTTx = false;
                }
                let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
                let ActvTg = false;
                let LineItemDtldDesc = "";
                //LineItemDtldDesc = tinyMCE.get('txt_LineItemDtldDesc').getContent();
                //LineItemDtldDesc = encodeURI(LineItemDtldDesc);
                if ($('#chk_ActvTg').is(':checked'))
                    ActvTg = true;

                let LineItemAutoTagg = $('#txt_LineItemAutoTagg').val().toUpperCase();
                let Model = li.find('.model').text().trim();

                let fd = {
                    POID: purchaseOrderId,
                    LineItemId: POLineItemID,
                    ItemApprovalID: ItemApprovalID,
                    ProjectId: ProjectID,
                    Quantity: LineItemQty,
                    UOMID: LineItemUnt,
                    Cost: LineItemCosts,
                    NoStateTax: false,
                    NoGSTHST: false,
                    NoPST: false,
                    ItemDtldDesc: "",
                    Model: Model,
                    Tag: ActvTg,
                    Tagging: LineItemAutoTagg,
                };

                $.ajax({
                    url: "/PurchaseOrder/AddLineItems",
                    data: fd,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {
                        if (data.IsSuccess) {

                            notify(true, data.Result, true);
                            $(".loader").css("display", "none");
                            $('#add_itme_pom').modal('hide');
                            //polineItems();
                            //HideUnhideButton();
                            setTimeout(function () {
                                window.location.reload();
                            }, 300);
                        }
                        else {
                            notify(false, data.ErrorMessages, true);
                            $(".loader").css("display", "none");
                        }
                    }
                });

                return;
            }

            else {

                //ajax call to save multiple li
                let liofData = [];
                var ActvTg = '0';
                if ($('#chk_ActvTg').is(':checked') == true) {
                    ActvTg = '1';
                }

                var PurchaseOrderID = $('#Hdn_PurchaseOrderID').val();

                var NoGSTHSTTx = '0';
                if ($('#chk_GSTHSTTx').is(':checked') == true) {
                    NoGSTHSTTx = '1';
                }

                $('#lilist .lidata').each(function () {
                    let li = $(this);
                    let lineItemId = li.data('id');
                    let quantity = li.find('.qty').text()?.trim();
                    let cost = li.find('.cost').text()?.trim();
                    let uom = li.find('.uomid').data('uomid');
                    let model = li.find('.model').text()?.trim();

                    liofData.push({
                        POID: parseInt(PurchaseOrderID),
                        LineitemID: lineItemId.toString(),
                        Quantity: parseFloat(quantity),
                        Cost: parseFloat(cost),
                        UOMID: parseInt(uom),
                        Tag: ActvTg,
                        Model: model,
                        ItemApprovalID: ItemApprovalID
                    });
                });

                $.ajax({
                    url: '/PurchaseOrder/AddPOLineItemMulti',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(liofData),
                    dataType: "JSON",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            var title = `Saving ${data.Result.count} Items`;
                            $.notify.success('Success', data.Result);
                            $('#add_itme_pom').modal('hide');
                            setTimeout(function () {
                                window.location.reload();
                            }, 300);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                            $('#add_itme_pom').modal('hide');
                        }
                        $(".loader").css("display", "none");

                    }
                });
            }
        });

        function buildItemApprovalID() {
            let parts = [];

            $('.remove_note_on_polineitem').each(function () {
                let id = $(this).attr("data-index");
                let desc = $(this).attr("data-desc");

                if (id && desc) {
                    parts.push(id + "#" + desc);
                }
            });

            if (parts.length === 0) {
                return "";
            }
            return parts.join("^");
        }

        $(document).on('click', '#confirmforvendor', function () {
            var arcomment = $('#APRRJCT_Comment').val()?.trim();
            var poid = $('#Hdn_PurchaseOrderID').val();

            $.ajax({
                url: "/PurchaseOrder/ConfirmPOForVendor",
                data: { POID: poid, Comment: arcomment },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        window.location.reload();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");

                }
            });
        });

        $(document).on('click', '.POLIExphist', function () {

            $('#popupforeditexpedite').modal('hide');

            var FLdId = $(this).attr('data-id');
            var $row = $(this).closest('tr');
            var status = $row.find('td').eq(1).text();
            var note = $row.find('td').eq(3).text();
            var quantity = $row.find('td').eq(4).text() == "-" ? "" : $row.find('td').eq(4).text();
            var receivedDate = $row.find('td').eq(5).text();
            var ref = $row.find('td').eq(6).text();
            //var newddl = $('#ddl_ItemStatus').clone();
            var options = $('#ddl_ItemStatus').children().clone();
            //$(newddl).attr('id', 'newddl_ItemStatus');
            $('#newddl_ItemStatus').empty();
            $('#newddl_ItemStatus').append(options);

            $('#hdn_fldid').val(FLdId);

            $("#edtnote").val('');
            $("#edtnote").val(note);

            $('#edtrqty').val('');
            $('#edtrqty').val(quantity);

            $('#edtrdate').val('');
            $('#edtrdate').val(receivedDate);

            $('#edtref').val('');
            $('#edtref').val(ref);

            /*$('#edtrdate').datepicker();*/
            $('#edtrdate').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd-mm-yy',
                maxDate: 0  // ❗ Disable future dates
            });


            $("#newddl_ItemStatus option").each(function () {
                if ($(this).text() == status) {
                    $(this).attr('selected', 'selected');
                }
            });

            $('#popupforeditexpedite').modal('show');


        });

        $(document).on('click', '#btn_updatepoliexphist', function () {

            var FldID = $('#hdn_fldid').val();
            var ItemStatus = $('#newddl_ItemStatus').val();
            var POLineItemExpediteNote = $('#edtnote').val();
            var ReceiveQty = $('#edtrqty').val();
            var ReceiveDate = $('#edtrdate').val();
            var Reference = $('#edtref').val();
            POLineItemExpediteNote = encodeURI(POLineItemExpediteNote);

            let fd = {
                FldID: FldID,
                ItemStatus: ItemStatus,
                POLineItemExpediteNote: POLineItemExpediteNote,
                ReceiveQty: ReceiveQty,
                ReceiveDate: ReceiveDate,
                Reference: Reference,
            }

            $.ajax({
                url: "/PurchaseOrder/UpdatePOLIExpeditenote",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        //const POID = $('#Hdn_PurchaseOrderID').val();
                        const POLIID = $('#hdn_poli').val();
                        $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            });


        });

        $(document).on('click', '.poexphistory', function () {
            var $row = $(this).closest('tr');
            $('#popupforeditponote').modal('hide');
            var fldId = $(this).data('id');
            $('#hidden_fldId2').val('');
            $('#hidden_fldId2').val(fldId);

            var note = $row.find('td').eq(2).text();
            $('#editponote').val('');
            $('#editponote').val(note);

            $('#popupforeditponote').modal('show');



        });

        $(document).on('click', '#edtbtnsave', function () {
            var fldId = $('#hidden_fldId2').val();
            var note = $('#editponote').val();
            //const POLIID = $('#hdn_poli').val();

            if (note == '' || note == " ") {
                $('#editponote').focus();
                return false;
            }

            let fd = {
                FldID: fldId,
                Note: encodeURI(note)
            }

            $.ajax({
                url: "/PurchaseOrder/UpdatePOExpeditenote",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        const POLIID = $('#hdn_poli').val();
                        $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                        polineItems();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on('click', '.deletepoliexpnote', function () {
            var fldId = $(this).data('id');
            $.confirm({
                title: '',
                message: 'Do you really want to delete the note?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/PurchaseOrder/DeletePOLIExpNote",
                        data: { FldID: fldId },
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                const POLIID = $('#hdn_poli').val();
                                $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                                polineItems();
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            $(".loader").css("display", "none");

                        }
                    });
                },
                onCancel: function () {
                    return;
                }
            });
            
        });

        $(document).on('click', '.deletepoexpnote', function () {
            $.confirm({
                title: '',
                message: 'Do you really want to delete the note?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    var fldId = $(this).data('id');
                    $.ajax({
                        url: "/PurchaseOrder/DeletePOExpNote",
                        data: { FldID: fldId },
                        type: "POST",
                        dataType: "json",

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                const POLIID = $('#hdn_poli').val();
                                $('a.expNotebtn[data-id="' + POLIID + '"]').trigger('click');
                                polineItems();
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            $(".loader").css("display", "none");
                        }
                    });
                },
                onCancel: function () {
                    alert('Cancelled! Page would reload here.');
                }
            });
            
        });
    }
    // #endregion

    // #region :: Add Item to PO
    if (_ActionName === "additemstopo") {
        let fontsize = "";
        for (let a = 5; a <= 22; a = a + 0.5) {
            fontsize += fontsize == "" ? a + "px" : " " + a + "px";
        }

        tinymce.init({
            formats: {
                underline: { inline: 'u' },
            },
            fontsize_formats: fontsize,
            selector: "#txt_LineItemDtldDesc",
            plugins: "textcolor,paste",
            paste_auto_cleanup_on_paste: false,
            paste_postprocess: function (pl, o) {
                o.node.innerHTML = replaceAll(o.node.innerHTML.toUpperCase(), '&NBSP;', '&nbsp');
            },
            toolbar: "undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor | fontsizeselect",
            menubar: false,
            setup: function (ed) {
                ed.on('focusin', function (e) {
                    ed.theme.resizeTo("100%", 480);
                    window.location = window.location.href.split('#')[0] + '#editor';
                });

                ed.on('keydown', function (e) {
                    var kc = e.key.charCodeAt(0);

                    if (kc >= 97 && kc <= 122 && e.ctrlKey == false && e.shiftKey == false && e.altKey == false) {
                        tinymce.activeEditor.execCommand('mceInsertContent', true, String.fromCharCode(kc - 32));
                        return false;
                    }

                });
            },

        });

        var poid = $('#Hdn_PurchaseOrderID').val();


        let sectionId = $('#Ddl_SecPOLI').val();
        if (sectionId.length > 0) {
            LineItemDropDown(poid, sectionId);
        }
        if ($('#Ddl_LineItems').val() == 0) {
            $('#btn_AddLnItmToPONStay').prop('display', 'none');
            $('#btn_AddLnItmToPO').prop('display', 'none');
        }
        else {
            $('#btn_AddLnItmToPONStay').prop('display', '');
            $('#btn_AddLnItmToPO').prop('display', '');
        }
        function LineItemDropDown(PurchaseOrderId, SectionID) {
            if (SectionID == "0") {
                const dropdown = $('#Ddl_LineItems');
                dropdown.empty();
                dropdown.append('<option value="0">--Select LineItem--</option>');
                return;
            }

            $.ajax({
                url: "/PurchaseOrder/LineItemDropDownList",
                type: "POST",
                data: { POID: PurchaseOrderId, SectionId: SectionID },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    let dropdown = $('#Ddl_LineItems');

                    if (data.IsSuccess) {
                        dropdown.empty();
                        const result = data.Result;
                        dropdown.append('<option value="0">--Select LineItem--</option>');
                        result.forEach(function (item) {
                            dropdown.append(`<option value='${item.lineItemId}'>${item.itemDescription}</option>`);
                        });
                        $(".loader").css("display", "none");
                    }
                    else {
                        dropdown.empty();
                        dropdown.append('<option value="0">--Select LineItem--</option>');
                        $(".loader").css("display", "none");
                    }
                }

            });
        }

        $(document).on('change', '#Ddl_SecPOLI', function () {
            const SectionID = $('#Ddl_SecPOLI').val();
            if ($('#Ddl_LineItems').val() == 0) {
                $('#btn_AddLnItmToPONStay').prop('display', 'none');
                $('#btn_AddLnItmToPO').prop('display', 'none');
            }
            else {
                $('#btn_AddLnItmToPONStay').prop('display', '');
                $('#btn_AddLnItmToPO').prop('display', '');
            }
            LineItemDropDown(poid, SectionID);
        });

        $(document).on('change', '#Ddl_LineItems', function () {
            const LineItemId = $(this).val();
            selectedLineItemId = $(this).val();
            if (LineItemId == "0") {
                $('#txt_LineItemQty').val('');
                $('#Ddl_LineItemUnt').val(0);
                $('#txt_LineItemCosts').val('');
                $('#txt_LineItemModel').val('');
                $('#txt_LineItemModel').prop('disabled', true);
                $("#chk_ActvTg").prop('checked', false);
                $('#txt_LineItemAutoTagg').val('');
                $('#txt_LineItemAutoTagg').addClass("d-none");
                $('#btn_AddLnItmToPONStay').prop('display', 'none');
                $('#btn_AddLnItmToPO').prop('display', 'none');

                return;
            }
            $('#btn_AddLnItmToPONStay').prop('display', '');
            $('#btn_AddLnItmToPO').prop('display', '');
            $.ajax({
                url: "/PurchaseOrder/SelectedLineItemDetails",
                type: "POSt",
                data: { LineItemId: LineItemId },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const result = data.Result;
                    if (data.IsSuccess) {
                        $('#txt_LineItemModel').removeAttr('disabled');
                        $('#txt_LineItemQty').val(result.quanity);
                        $('#Ddl_LineItemUnt').val(result.uom);
                        $('#txt_LineItemCosts').val(result.cost);
                        $('#txt_LineItemModel').val(result.model);
                        $(".loader").css("display", "none");

                    }
                    else {
                        $('#txt_LineItemQty').val('');
                        $('#Ddl_LineItemUnt').val(0);
                        $('#txt_LineItemCosts').val('');
                        $('#txt_LineItemModel').val('');
                        $(".loader").css("display", "none");
                        $('#txt_LineItemModel').prop('disabled', true);
                    }
                }
            })

        });

        $(document).on('click', '#chk_ActvTg', function () {
            const LineItemId = $('#Ddl_LineItems').val();
            const obj = $(this);

            if ($(obj).is(':checked') == true && LineItemId != null && LineItemId != "0") {
                $('#txt_LineItemAutoTagg').removeClass('d-none');
            }
            else {

                if ($(obj).is(':checked') == false && LineItemId != null && LineItemId != "0") {
                    $('#txt_LineItemAutoTagg').addClass("d-none");
                    /*notify(false, "You have UNCHECKED ACTIVE TAG after selecting the LINEITEMS...", true);*/
                    return;
                }
                else {
                    $('#txt_LineItemAutoTagg').addClass("d-none");
                    notify(false, "Please Select LineItem first...", true);
                    $('#chk_ActvTg').prop('checked', false);
                    return;
                }

            }
            $.ajax({
                url: "/PurchaseOrder/LoadAutoTagData",
                data: { LineItemID: LineItemId },
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const tempData = data.Result;
                    let html = "";
                    if (data.IsSuccess) {

                        html += "Tag: " + tempData.projectName + "\n";
                        html += "Specification: " + tempData.specNum + "\n";
                        html += "Description: " + tempData.itemDescription + "\n";
                        html += "" + $('#txt_LineItemQty').val() + " " + $('#Ddl_LineItemUnt option:selected').text() + "\n";
                        $('#txt_LineItemAutoTagg').val('');
                        $('#txt_LineItemAutoTagg').val(html);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $('#txt_LineItemAutoTagg').val('');
                        $(".loader").css("display", "none");
                    }
                }
            });
        });

        let itemApprovalTypeCount = 0;

        $(document).on('click', '#itemapproval_btn', function () {
            if ($(this).hasClass('collapsed')) { // Check if it's expanding
                $('#itemapprovaladd').slideUp();
                return;
            }
            bindItemApprovalType();
        });

        function bindItemApprovalType() {
            if (itemApprovalTypeCount > 0) {
                $('#itemapprovaladd').slideDown();
                return;
            }

            $.ajax({
                url: "/PurchaseOrder/GetAllApprovalType",
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const result = data.Result;
                    const dropDown = $('#ddlItemApprovalType');
                    if (data.IsSuccess) {
                        dropDown.empty();
                        dropDown.append('<option value="0">--Select--</option>');
                        result.forEach(function (item) {
                            dropDown.append(`<option value='${item.itemApprovalId}'>${item.itemname}</option>`);
                        });
                        itemApprovalTypeCount++;
                        $(".loader").css("display", "none");
                    }
                    else {
                        dropDown.empty();
                        dropDown.append('<option value="0">--Select--</option>');
                        $(".loader").css("display", "none");

                    }

                }
            });


        }

        $(document).on('click', '#btn_AddLnItmToPONStay', function () {
            const POLineItemID = $('#Ddl_LineItems').val();
            const ProjectID = $('#Hdn_ProjectID').val();
            const purchaseOrderId = $('#Hdn_PurchaseOrderID').val();
            let ItemApprovalID = "";//for listed data ApprovalType Add

            if (POLineItemID == null || POLineItemID == undefined || POLineItemID == "0") {
                notify(false, "Plese select List Item", true);
                return;
            }
            let LineItemQty = $('#txt_LineItemQty').val();
            if (LineItemQty.trim() == "" || isNaN(LineItemQty)) {
                $('#txt_LineItemQty').val('0.00');
            }
            LineItemQty = $('#txt_LineItemQty').val();
            if (LineItemQty.trim() == "" || isNaN(LineItemQty)) {
                notify(false, "Please enter Line Item Qty", false);
                $('#txt_LineItemQty').focus();
                return;
            }
            let LineItemUnt = $('#Ddl_LineItemUnt').val();
            if (LineItemUnt.trim() == "" || isNaN(LineItemUnt) || LineItemUnt == 0) {
                notify(false, "Please Select a Line Item Unit", false);
                $('#Ddl_LineItemUnt').focus();
                return;
            }
            let LineItemCosts = $('#txt_LineItemCosts').val();
            if (LineItemCosts.trim() == "" || isNaN(LineItemCosts)) {
                notify(false, "Please enter Line Item Costs", false);
                $('#txt_LineItemCosts').focus();
                return;
            }
            let NoStateTx = false;
            if ($('#chk_StateTx').is(':checked')) {
                NoStateTx = true;
            }
            let NoGSTHSTTx = false;
            if ($('#chk_GSTHSTTx').is(':checked')) {
                NoGSTHSTTx = true;
            }
            let NoPSTTx = false;
            if ($('#chk_PSTTx').is(':checked')) {
                NoPSTTx = true;
            }
            let ActvTg = false;
            let LineItemDtldDesc = "";
            LineItemDtldDesc = tinyMCE.get('txt_LineItemDtldDesc').getContent();
            LineItemDtldDesc = encodeURI(LineItemDtldDesc);
            if ($('#chk_ActvTg').is(':checked'))
                ActvTg = true;

            let LineItemAutoTagg = $('#txt_LineItemAutoTagg').val();
            let Model = $('#txt_LineItemModel').val();

            let fd = {
                POID: purchaseOrderId,
                LineItemId: POLineItemID,
                ItemApprovalID: "",
                ProjectId: ProjectID,
                Quantity: LineItemQty,
                UOMID: LineItemUnt,
                Cost: LineItemCosts,
                NoStateTax: NoStateTx,
                NoGSTHST: NoGSTHSTTx,
                NoPST: NoPSTTx,
                ItemDtldDesc: LineItemDtldDesc,
                Model: Model,
                Tag: ActvTg,
                Tagging: LineItemAutoTagg,
            };

            $.ajax({
                url: "/PurchaseOrder/AddLineItems",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $(".loader").css("display", "none");
                        window.location.href = "/PurchaseOrder/POEdit?POId=" + purchaseOrderId;
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            })

        });

        $(document).on('click', '#btn_AddLnItmToPO', function () {
            const POLineItemID = $('#Ddl_LineItems').val();
            const ProjectID = $('#Hdn_ProjectID').val();
            const purchaseOrderId = $('#Hdn_PurchaseOrderID').val();
            let ItemApprovalID = "";//for listed data ApprovalType Add

            if (POLineItemID == null || POLineItemID == undefined || POLineItemID == "0") {
                notify(false, "Plese select List Item", true);
                return;
            }
            let LineItemQty = $('#txt_LineItemQty').val();
            if (LineItemQty.trim() == "" || isNaN(LineItemQty)) {
                $('#txt_LineItemQty').val('0.00');
            }
            LineItemQty = $('#txt_LineItemQty').val();
            if (LineItemQty.trim() == "" || isNaN(LineItemQty)) {
                notify(false, "Please enter Line Item Qty", false);
                $('#txt_LineItemQty').focus();
                return;
            }
            let LineItemUnt = $('#Ddl_LineItemUnt').val();
            if (LineItemUnt.trim() == "" || isNaN(LineItemUnt) || LineItemUnt == 0) {
                notify(false, "Please Select a Line Item Unit", false);
                $('#Ddl_LineItemUnt').focus();
                return;
            }
            let LineItemCosts = $('#txt_LineItemCosts').val();
            if (LineItemCosts.trim() == "" || isNaN(LineItemCosts)) {
                notify(false, "Please enter Line Item Costs", false);
                $('#txt_LineItemCosts').focus();
                return;
            }
            let NoStateTx = false;
            if ($('#chk_StateTx').is(':checked')) {
                NoStateTx = true;
            }
            let NoGSTHSTTx = false;
            if ($('#chk_GSTHSTTx').is(':checked')) {
                NoGSTHSTTx = true;
            }
            let NoPSTTx = false;
            if ($('#chk_PSTTx').is(':checked')) {
                NoPSTTx = true;
            }
            let ActvTg = false;
            let LineItemDtldDesc = "";
            LineItemDtldDesc = tinyMCE.get('txt_LineItemDtldDesc').getContent();
            LineItemDtldDesc = encodeURI(LineItemDtldDesc);
            if ($('#chk_ActvTg').is(':checked'))
                ActvTg = true;

            let LineItemAutoTagg = $('#txt_LineItemAutoTagg').val();
            let Model = $('#txt_LineItemModel').val();

            let fd = {
                POID: purchaseOrderId,
                LineItemId: POLineItemID,
                ItemApprovalID: "",
                ProjectId: ProjectID,
                Quantity: LineItemQty,
                UOMID: LineItemUnt,
                Cost: LineItemCosts,
                NoStateTax: NoStateTx,
                NoGSTHST: NoGSTHSTTx,
                NoPST: NoPSTTx,
                ItemDtldDesc: LineItemDtldDesc,
                Model: Model,
                Tag: ActvTg,
                Tagging: LineItemAutoTagg,

            };
            $.ajax({
                url: "/PurchaseOrder/AddLineItems",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        notify(true, data.Result, true);
                        $(".loader").css("display", "none");
                        window.location.reload();
                    }
                    else {
                        notify(false, data.ErrorMessages, true);
                        $(".loader").css("display", "none");
                    }
                }

            })

        });

        $(document).on('click', '#btn_CnclLnItmToPO', function () {
            const PurchaseOrderID = $('#Hdn_PurchaseOrderID').val();
            window.location.href = "/PurchaseOrder/POEdit?POId=" + PurchaseOrderID;
        });
    }
    // #endregion

    // #region :: Purchase Order History
    if (_ActionName === "viewpohistory") {
        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;
        $('#po_history_table').DataTable({
            "processing": true,
            "order": [[8, "asc"]],

            //scrollX: true,
            columnDefs: [
                { className: "dt-head-nowrap", targets: "_all" },
                { width: "100px", targets: 0 },
                //{ className: "text-center", targets: [3, 4] },
                { type: 'string', targets: [4, 5] }
            ],
            pageLength: pageLength,
        });

        $('#po_history_table').on('length.dt', function (e, settings, len) {
            const preferences = [];
            preferences.push({
                PreferenceKey: 'DataTable.PageLength',
                PreferenceValue: len.toString()
            });

            SetProjectPreference(preferences);
        });

        $(document).on('click', '.btn-action', async function () {
            const viewitemsBtn = $(this).attr('btn-viewitems');
            const infoBtn = $(this).attr('btn-info');

            const poid = $(this).attr('data-poid');
            const fldid = $(this).attr('data-fldid');
            const version = $(this).attr('data-version');

            if (viewitemsBtn != undefined) {
                let inputData = {
                    PoId: poid,
                    Flid: fldid
                };
                $.ajax({
                    url: "/PurchaseOrder/GetPoHistoryLineItemDetails",
                    type: "POST",
                    data: inputData,
                    dataType: 'text',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != "") {
                            $(".loader").css("display", "none");
                            $('#poHistoryLineItems').html('');
                            $('#poHistoryLineItems').html(data);

                            if ($.fn.DataTable.isDataTable("#line_item_table")) {
                                $('#line_item_table').DataTable().clear().destroy();
                            }

                            $("#line_item_table").DataTable({
                                "pageLength": pageLength,
                                orderCellsTop: true,
                            });

                            $('#line_item_table').on('length.dt', function (e, settings, len) {
                                const preferences = [];
                                preferences.push({
                                    PreferenceKey: 'DataTable.PageLength',
                                    PreferenceValue: len.toString()
                                });

                                SetProjectPreference(preferences);
                            });

                            $('#line_item_modal').modal('show');

                            return;
                        }
                        else {
                            $(".loader").css("display", "none");
                            notify(false, "Something went wrong", false);
                        }
                    }
                })
            }

            if (infoBtn != undefined) {
                let inputData = {
                    PoId: poid,
                    Version: version
                };
                $.ajax({
                    url: "/PurchaseOrder/GetAllHistory",
                    type: "POST",
                    data: inputData,
                    dataType: 'text',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        debugger;
                        if (data != "") {
                            $(".loader").css("display", "none");
                            $('#all_history_modal').modal('show');
                            $('#all_history_modal_tbody').html('');
                            $('#all_history_modal_tbody').html(data);

                            if ($.fn.DataTable.isDataTable("#history_table")) {
                                $('#history_table').DataTable().clear().destroy();
                            }

                            $("#history_table").DataTable({
                                "pageLength": pageLength,
                                orderCellsTop: true,
                            });

                            $('#history_table').on('length.dt', function (e, settings, len) {
                                const preferences = [];
                                preferences.push({
                                    PreferenceKey: 'DataTable.PageLength',
                                    PreferenceValue: len.toString()
                                });

                                SetProjectPreference(preferences);
                                $('#all_history_modal').modal('show');
                                return;
                            });
                        }
                        else {
                            $(".loader").css("display", "none");
                            notify(false, "Something went wrong", false);
                        }
                    }
                })

            }
        });

        $(document).on('click', '.inner_info_btn', async function () {
            let flid = $(this).attr('data-flid');
            var rw = $(this).parent().parent();
            var Username = $(rw).find('td:eq(0)').html();
            var action = $(rw).find('td:eq(1)').text();
            var date = $(rw).find('td:eq(2)').html();
            $('#historydetailsheader').text(Username + ' - ' + action + ' - ' + date);
            $.ajax({
                url: "/PurchaseOrder/HistoryDetailsByFldID",
                type: "POST",
                data: { FldID: flid },
                dataType: 'text',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $(".loader").css("display", "none");
                        $('#history_details_tbl').html('');
                        $('#history_details_tbl').html(data);
                        $('#history_details_modal').modal('show');
                        $('#all_history_modal').modal('hide');

                        $('#history_details_modal').on('shown.bs.modal', function () {
                            $('#history_details_table').DataTable().columns.adjust().draw(false);
                        });
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            })
        });
        $(document).on('click', '.getUpdatedFieldDetailsItem', async function () {
            let flid = $(this).attr('data-flid');
            var rw = $(this).parent().parent();
            var Username = $(rw).find('td:eq(0)').html();
            var action = $(rw).find('td:eq(1)').text();
            var date = $(rw).find('td:eq(2)').html();
            $('#historydetailsheader').text(Username + ' - ' + action + ' - ' + date);
            $.ajax({
                url: "/PurchaseOrder/ItemHistoryDetailsByFldID",
                type: "POST",
                data: { FldID: flid },
                dataType: 'text',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $(".loader").css("display", "none");
                        $('#history_details_tbl').html('');
                        $('#history_details_tbl').html(data);
                        $('#history_details_modal').modal('show');
                        $('#all_history_modal').modal('hide');

                        $('#history_details_modal').on('shown.bs.modal', function () {
                            $('#history_details_table').DataTable().columns.adjust().draw(false);
                        });
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            })
        });

        $(document).on("click", ".openpohistory", function () {

            var POID = $(this).attr('data-poid');
            var version = $(this).attr('data-version') || '';

            var Url = '/PurchaseOrder/GetPOApprovalHistoryForPohistoryPage';

            getPoApprovalHistory(POID, version, Url);

        });

        $(document).on("click", ".openpohistory2", function () {

            var POID = $(this).attr('data-poid');
            var version = $(this).attr('data-version') || '';
            var Url = '/PurchaseOrder/GetPOApprovalHistoryForPohistoryPage2';
            getPoApprovalHistory(POID, version, Url);

        });

        function getPoApprovalHistory(POID, version, Url) {
            var request = {
                PoId: POID,
                Version: version
            };

            $.ajax({
                url: Url,
                type: "POST",
                data: JSON.stringify(request),
                contentType: "application/json; charset=utf-8",
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#partail_bck_PoApprovalHistory").html("");
                        $("#partail_bck_PoApprovalHistory").html(data);
                        $('#po_bck_Approval_history').modal('show');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            });

        }


    }
    // #endregion
});