$(document).on("UserPreferencesReady", function () {
    const QueryParameter = window.location.pathname.split("/");
    const ActionName = QueryParameter[2].toLocaleLowerCase();
    //const spinnerIcon = `<i class="fa-solid fa-spinner fa-spin"></i>`;

    // #region :: Expedite
    if (ActionName == 'home') {

        const projectIdsStr = _UserPreferences["Dropdown.ProjectId"] || "";
        const projectIds = projectIdsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        if (projectIds.length > 0) {
            $('#projectDD').val(projectIds[0]);
            loadVendorPart(projectIds[0]);
            loadBudgetPart(projectIds[0]);
        }


        let options = [
            { value: '', text: 'Select' },
            { value: 'VITMDESC', text: 'Item Description' },
            { value: 'VITMAPPRVL', text: 'Fabrication Approvals' },
            { value: 'VITMAPPRVLSTS', text: 'Fabrication Approvals Status' },
            { value: 'VITMSTTS', text: 'Item Status' },
            { value: 'BPOVAL', text: 'PO#' },
            { value: 'BVENDR', text: 'Vendor' },
            { value: 'BSHIPTO', text: 'Ship To' },
            { value: 'BARRVLDT', text: 'Arrival Date' },
            { value: 'VRQTY', text: 'R-Qty' },
            { value: 'VINV', text: 'Invoice Status' }
        ];

        const fieldMappings = {
            "BPOVAL": "POID",
            "BISCOMMITTED": "IsCommitted",
            "BVENDR": "VendorName",
            "BBUYR": "BuyerName",
            "BSHIPTO": "VendorCO",
            "BTRMS": "Terms",
            "BCRRNCY": "Currency",
            "BCONVRT": "Conv",
            "BITMAPPRVL": "ActionType",
            "BFOB": "FOB",
            "BARRVLDT": "ArrivalDate",
            "BCHKBCK": "CheckBackDate",
            "BITMSTTS": "ItemStatus",
            "BINV": "Inv",
            "BPOQTY": "Qty",
            "BRQTY": "ReceivedQuantity",
            "BSHPVIA": "ShipMethod",
            "BSHPTO": "ShipTo",
            "BFRGHT": "Freight",
            "BRMRKS": "Remarks",
            "VITMAPPRVLSTS": "ActionType",
            "VPOLNITMNMBR": "POLineItemID",
            "VSPCNMBR": "SpecNum",
            "VITMDESC": "ItemDescription",
            "VITMAPPRVL": "ActionType",
            "VITMSTTS": "ItemStatus",
            "VRQTY": "ReceivedQuantity",
            "VINV": "Invoice",
            "VPOQTY": "Quantity"
        };

        const searchOptionMappings = {
            "GREATERTHAN": ">",
            "LESSTHAN": "<",
            "EQUALS": "=",
            "MATCH": "like",
            "NOTMATCH": "not like"
        };

        const substrings = [
            "VITMAPPRVL",
            "VITMSTTS",
            "BPOVAL",
            "VITMAPPRVLSTS",
            "BSHIPTO"
        ];

        LoadCriteria();
        function LoadCriteria() {
            const html = options
                .map(option => `<option value='${option.value}'>${option.text}</option>`)
                .join('');

            $('#FirstSearchDdlLeft').html(html);
						$('#FirstSearchDdlRight').html(html);
						$('#SecondSearchDdlLeft').html(`<option value=''>Select</option>`);
						$('#SecondSearchDdlRight').html(`<option value=''>Select</option>`);
        }

        $('#ThirdSearchDdlLeftDtPckr').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy'
        });

        $('#ThirdSearchDdlRightDtPckr').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy'
        });

        function ForBudgetSelectionRight(obj) {
            handleBudgetSelection(obj, updateBudgetUIRight);
        }
        function ForBudgetSelectionLeft(obj) {
            handleBudgetSelection(obj, updateBudgetUILeft);
        }
        function ForVendorSelectionLeft(obj) {
            handleVendorSelection(obj, ResetLeft, '#SecondSearchDdlLeft');
        }
        function ForVendorSelectionRight(obj) {
            handleVendorSelection(obj, ResetRight, '#SecondSearchDdlRight');
        }
        function SecondDdlHtml(type) {
            const options = {
                FIRSTTYPE: [
                    { value: '', text: 'Select' },
                    { value: 'GREATERTHAN', text: 'is greater than' },
                    { value: 'LESSTHAN', text: 'is less than' },
                    { value: 'EQUALS', text: 'equals' }
                ],
                SECONDTYPE: [
                    { value: '', text: 'Select' },
                    { value: 'MATCH', text: 'contains' },
                    { value: 'NOTMATCH', text: 'does not contain' }
                ],
                THIRDTYPE: [
                    { value: '', text: 'Select' },
                    { value: 'MATCH', text: 'More Than' },
                    { value: 'NOTMATCH', text: 'Less Than' }
                ],
                FOURTHTYPE: [
                    { value: '', text: 'Select' },
                    { value: 'GREATERTHAN', text: 'after' },
                    { value: 'LESSTHAN', text: 'before' },
                    { value: 'EQUALS', text: 'on' }
                ]
            };

            let html = '';

            if (options[type]) {
                html = options[type].map(option =>
                    `<option value='${option.value}'>${option.text}</option>`
                ).join('');
            }

            return html;
        }
        function handleBudgetSelection(obj, updateUI) {
            switch (obj) {
                case 'BSHIPTO':
                case 'VITMAPPRVLSTS':
                case 'VITMDESC':
                case 'VITMAPPRVL':
                case 'VITMSTTS':
                case 'BVENDR':
                case 'VINV':
                    updateUI('SECONDTYPE',
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: false, takeVal: true, displayOn: true },
                        { displayOff: true, takeVal: false, displayOn: false }
                    );
                    break;

                case 'BPOVAL':
                    updateUI('SECONDTYPE',
                        { displayOff: false, takeVal: true, displayOn: true },
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: true, takeVal: false, displayOn: false }
                    );
                    break;

                case 'BARRVLDT':
                    updateUI('FOURTHTYPE',
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: false, takeVal: true, displayOn: true }
                    );
                    break;

                case 'VRQTY':
                    updateUI('FIRSTTYPE',
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: false, takeVal: true, displayOn: true },
                        { displayOff: true, takeVal: false, displayOn: false }
                    );
                    break;

                default:
                    updateUI('',
                        { displayOff: false, takeVal: true, displayOn: true },
                        { displayOff: true, takeVal: false, displayOn: false },
                        { displayOff: true, takeVal: false, displayOn: false }
                    );
                    break;
            }
        }
        function updateBudgetUILeft(optionType, ddlState, txtState, datePickerState) {
            if (optionType == '') {
								$('#SecondSearchDdlLeft').empty();
            }
            else {
                const optionhtml = SecondDdlHtml(optionType);
                $('#SecondSearchDdlLeft').html('');
                $('#SecondSearchDdlLeft').html(optionhtml);
            }
            $('.ThirdSearchDdlLeftddl')
                .toggleClass('displayoff', ddlState.displayOff)
                .toggleClass('TakeVal', ddlState.takeVal)
                .toggleClass('displayon', ddlState.displayOn);

            $('.ThirdSearchDdlLefttxt')
                .toggleClass('displayoff', txtState.displayOff)
                .toggleClass('TakeVal', txtState.takeVal)
                .toggleClass('displayon', txtState.displayOn);

            $('#ThirdSearchDdlLeftDtPckr')
                .toggleClass('displayoff', datePickerState.displayOff)
                .toggleClass('TakeVal', datePickerState.takeVal)
                .toggleClass('displayon', datePickerState.displayOn);
        }
        function updateBudgetUIRight(optionType, ddlState, txtState, datePickerState) {
            if (optionType == '') {
                $('#SecondSearchDdlRight').empty();
            }
            else {
                const optionhtml = SecondDdlHtml(optionType);
                $('#SecondSearchDdlRight').html('');
                $('#SecondSearchDdlRight').html(optionhtml);
            }
            $('.ThirdSearchDdlRightddl').toggleClass('displayoff', ddlState.displayOff)
                .toggleClass('TakeVal', ddlState.takeVal)
                .toggleClass('displayon', ddlState.displayOn);

            $('.ThirdSearchDdlRighttxt').toggleClass('displayoff', txtState.displayOff)
                .toggleClass('TakeVal', txtState.takeVal)
                .toggleClass('displayon', txtState.displayOn);

            $('#ThirdSearchDdlRightDtPckr').toggleClass('displayoff', datePickerState.displayOff)
                .toggleClass('TakeVal', datePickerState.takeVal)
                .toggleClass('displayon', datePickerState.displayOn);
        }
        function handleVendorSelection(obj, resetFunction, targetSelector) {
            resetFunction();

            let optionhtml = "";
            let optionType = "";

            switch (obj) {
                case 'VPOLNITMNMBR':
                case 'VRQTY':
                case 'VPOQTY':
                    optionType = 'FIRSTTYPE';
                    break;
                case 'VSPCNMBR':
                case 'VITMDESC':
                case 'VITMAPPRVL':
                case 'VITMSTTS':
                    optionType = 'SECONDTYPE';
                    break;
                default:
                    console.warn(`Unhandled object type: ${obj}`);
                    return;
            }

            optionhtml = SecondDdlHtml(optionType);

            $(targetSelector).html(optionhtml);

            $(targetSelector).removeClass('displayoff');
            $(targetSelector).addClass('TakeVal');
            $(targetSelector).addClass('displayon');
        }

        $(".multislct").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
            single: true
        });

        $(document).on('change', '#projectDD', function () {
            const projectId = $("#projectDD option:selected").attr('data-id');

            //$('input[name="and_or_redio"]').prop('checked', false);

            //$('#FirstSearchDdlRight').attr('disabled', true);
            //$('#SecondSearchDdlRight').attr('disabled', true);
            //$('#ThirdSearchDdlRighttxt').attr('disabled', true);
            //$('#ThirdSearchDdlRightDtPckr').attr('disabled', true);
            //$('#ThirdSearchDdlRight').attr('disabled', true);

            ResetRight();
            ResetLeft();

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $('#vendorCount').text(`(0)`);
                $('#accVendor').html('');
                $('#sectionCount').text(`(0)`);
                $('#accBudget').html('');
                //notify(false, 'Please select project', false);
                return;
            }
            loadVendorPart(projectId);
            loadBudgetPart(projectId);

            UpdateUserPreferense(projectId);
        });

        function UpdateUserPreferense(ProjectId) {
            const preferences = [];
            preferences.push({
                PreferenceKey: 'Dropdown.ProjectId',
                PreferenceValue: ProjectId || '0'
            });
            SetProjectPreference(preferences);
        }

        $(document).on('change', '#FirstSearchDdlLeft', function (e) {
            const projectId = $("#projectDD option:selected").attr('data-id');
            const hiddenFilterValue = $('#Hdn_Filter').val();
            const value = e.target.value;

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                $('#FirstSearchDdlLeft').val('');
                return;
            }

            if (value == '' || value == undefined) {
                $('#SecondSearchDdlLeft').empty();
								$('#SecondSearchDdlLeft').html(`<option value=''>Select</option>`);
                $('#ThirdSearchDdlLefttxt').val('');
                $('#ThirdSearchDdlLeftDtPckr').val('');
                $('#ThirdSearchDdlLeft').empty();

                $('#ThirdSearchDdlLefttxt').removeClass('displayon');
                $('#ThirdSearchDdlLefttxt').addClass('displayoff');
                $('#ThirdSearchDdlLeftDtPckr').removeClass('displayon');
                $('#ThirdSearchDdlLeftDtPckr').addClass('displayoff');
                $('#ThirdSearchDdlLeft').removeClass('displayoff');

                return;
            }

            if (hiddenFilterValue == 'B' && value != '') {
                ForBudgetSelectionLeft(value);
            }
            else if (hiddenFilterValue == 'V' && value != '') {
                ForVendorSelectionLeft(value);
            }
            else if (hiddenFilterValue == '') {
                ForBudgetSelectionLeft(value);
            }
            else {
                ResetLeft();
            }
        });

        $(document).on('change', '#FirstSearchDdlRight', function (e) {
            const projectId = $("#projectDD option:selected").attr('data-id');
            const hiddenFilterValue = $('#Hdn_Filter').val();
            const value = e.target.value;

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                $('#FirstSearchDdlRight').val('');
                return;
            }

            if (value == '' || value == undefined) {
                $('#SecondSearchDdlRight').empty();
								$('#SecondSearchDdlRight').html(`<option value=''>Select</option>`);
                $('#ThirdSearchDdlRighttxt').val('');
                $('#ThirdSearchDdlRightDtPckr').val('');
                $('#ThirdSearchDdlRight').empty();

                $('#ThirdSearchDdlRighttxt').removeClass('displayon');
                $('#ThirdSearchDdlRighttxt').addClass('displayoff');
                $('#ThirdSearchDdlRightDtPckr').removeClass('displayon');
                $('#ThirdSearchDdlRightDtPckr').addClass('displayoff');
                $('#ThirdSearchDdlRight').removeClass('displayoff');

                return;
            }

            if (hiddenFilterValue == 'B' && value != '') {
                ForBudgetSelectionRight(value);
            }
            else if (hiddenFilterValue == 'V' && value != '') {
                ForVendorSelectionRight(value);
            }
            else if (hiddenFilterValue == '') {
                ForBudgetSelectionRight(value);
            }
            else {
                ResetRight();
            }
        });

        $(document).on('change', '#SecondSearchDdlLeft', async function (e) {
            debugger;
            const projectId = $("#projectDD option:selected").attr('data-id');
            const mode = $('#FirstSearchDdlLeft').val();
            const value = e.target.value;
            const contain = substrings.some(sub => mode.includes(sub));

            if (value == '' || value == undefined) {
                $('#ThirdSearchDdlLefttxt').val('');
                $('#ThirdSearchDdlLeftDtPckr').val('');
                $('#ThirdSearchDdlLeft').empty();

                //$('#ThirdSearchDdlLefttxt').removeClass('displayon');
                //$('#ThirdSearchDdlLefttxt').addClass('displayoff');
                //$('#ThirdSearchDdlLeftDtPckr').removeClass('displayon');
                //$('#ThirdSearchDdlLeftDtPckr').addClass('displayoff');
                //$('#ThirdSearchDdlLeft').removeClass('displayoff');

                return;
            }

            if (contain) {

                let response = await MakeDropdown(projectId, mode);

                if (response != '') {
                    let options = response.map(v => {
                        return `<option value="${v.itemValue}">${v.itemText}</option>`;
                    }).join('');

                    $('#ThirdSearchDdlLeft').empty();
                    $('#ThirdSearchDdlLeft').html(options);
                }
                else {
                    $('#ThirdSearchDdlLeft').empty();
                }

                $('#ThirdSearchDdlLeft').removeClass('displayoff');
                $('#ThirdSearchDdlLeft').addClass('displayon');
                $('#ThirdSearchDdlLefttxt').removeClass('displayon');
                $('#ThirdSearchDdlLefttxt').addClass('displayoff');
                $('#ThirdSearchDdlLeftDtPckr').removeClass('displayon');
                $('#ThirdSearchDdlLeftDtPckr').addClass('displayoff');
            }
        });

        $(document).on('change', '#SecondSearchDdlRight', async function (e) {
            const projectId = $("#projectDD option:selected").attr('data-id');
            const mode = $('#FirstSearchDdlRight').val();
            const value = e.target.value;
            const contain = substrings.some(sub => mode.includes(sub));

            if (value == '' || value == undefined) {
                $('#ThirdSearchDdlRighttxt').val('');
                $('#ThirdSearchDdlRightDtPckr').val('');
                $('#ThirdSearchDdlRight').empty();

                //$('#ThirdSearchDdlRighttxt').removeClass('displayon');
                //$('#ThirdSearchDdlRighttxt').addClass('displayoff');
                //$('#ThirdSearchDdlRightDtPckr').removeClass('displayon');
                //$('#ThirdSearchDdlRightDtPckr').addClass('displayoff');
                //$('#ThirdSearchDdlRight').removeClass('displayoff');

                return;
            }

            if (contain) {
                let response = await MakeDropdown(projectId, mode);
                if (response != '') {
                    let options = response.map(v => {
                        return `<option value="${v.itemValue}">${v.itemText}</option>`;
                    }).join('');

                    $('#ThirdSearchDdlRight').empty();
                    $('#ThirdSearchDdlRight').html(options);
                }
                else {
                    $('#ThirdSearchDdlRight').empty();
                }

                $('#ThirdSearchDdlRight').removeClass('displayoff');
                $('#ThirdSearchDdlRight').addClass('displayon');
                $('#ThirdSearchDdlRighttxt').removeClass('displayon');
                $('#ThirdSearchDdlRighttxt').addClass('displayoff');
                $('#ThirdSearchDdlRightDtPckr').removeClass('displayon');
                $('#ThirdSearchDdlRightDtPckr').addClass('displayoff');
            }
        });

        async function MakeDropdown(projectId, mode) {
            try {
                let result = await $.ajax({
                    url: "/Expedite/MakeDropdown",
                    type: "POST",
                    data: { Mode: mode, PID: projectId },
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    }
                });

                $(".loader").css("display", "none");

                if (result.IsSuccess) {
                    return result.Result; 
                } else {
                    return [];
                }
            } catch (error) {
                $(".loader").css("display", "none");
                console.error(error);
                return [];
            }
        }

        //RESET FUNCTIONS

        $(document).on('click', '#clearFilterBtn', ResetFilterState);

        function ResetFilterState() {
            $('#HiddenClause').val('');
            ResetLeft();
            ResetRight();

            const projectId = $("#projectDD option:selected").attr('data-id');

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $('#vendorCount').text(`(0)`);
                $('#accVendor').html('');
                $('#sectionCount').text(`(0)`);
                $('#accBudget').html('');
                //notify(false, 'Please select project', false);
                return;
            }
            loadVendorPart(projectId);
            loadBudgetPart(projectId);

        }
        function ResetLeft() {
            $('#FirstSearchDdlLeft').val('');

            $('#SecondSearchDdlLeft').empty();
            //$('#SecondSearchDdlLeft').val('');

            $('#ThirdSearchDdlLefttxt').val('');
            $('#ThirdSearchDdlLeftDtPckr').val('');
            $('#ThirdSearchDdlLeft').empty();

            $('#ThirdSearchDdlLefttxt').removeClass('displayon');
            $('#ThirdSearchDdlLefttxt').addClass('displayoff');
            $('#ThirdSearchDdlLeftDtPckr').removeClass('displayon');
            $('#ThirdSearchDdlLeftDtPckr').addClass('displayoff');

            $('#ThirdSearchDdlLeft').removeClass('displayoff');
            $('#ThirdSearchDdlLeft').addClass('displayon');
        }
        function ResetRight() {
            $('#FirstSearchDdlRight').val('');

            $('#SecondSearchDdlRight').empty();

            //$('#SecondSearchDdlRight').val('');
            $('#ThirdSearchDdlRighttxt').val('');
            $('#ThirdSearchDdlRightDtPckr').val('');
            $('#ThirdSearchDdlRight').empty();

            $('#ThirdSearchDdlRighttxt').removeClass('displayon');
            $('#ThirdSearchDdlRighttxt').addClass('displayoff');
            $('#ThirdSearchDdlRightDtPckr').removeClass('displayon');
            $('#ThirdSearchDdlRightDtPckr').addClass('displayoff');

            $('#ThirdSearchDdlRight').removeClass('displayoff');
            $('#ThirdSearchDdlRight').addClass('displayon');
        }
        function loadVendorPart(projectId) {
            $.ajax({
                url: "/Expedite/LoadVendorPart",
                type: 'POST',
                data: { ProjectId: projectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('#accVendor').html(data);
                    $(".loader").css("display", "none");
                    updateVendorCountValue('#vendorCountValue');
                }
            });
        }

        function updateVendorCountValue(selector, interval = 500, maxAttempts = 20) {
            let attempts = 0;

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    let vendorCountValue = $(selector).val();
                    //console.log(vendorCountValue);
                    $('#vendorCount').text(`(${vendorCountValue})`);
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(check, interval);
                    } else {
                        console.log('Element not found after maximum attempts.');
                    }
                }
            };

            check();
        }

        $(document).on('click', '.second_level_vendor_btn', function () {
            const Id = $(this).attr('data-id');
            const VendorId = $(this).attr('data-vendorid');
            const ProjectId = $("#projectDD option:selected").attr('data-id');
            const WhereClause = $('#HiddenClause').val();

            let $element = $(`#acc_${VendorId}`);
            let dataValue = $element.attr("data-l-data");
            if (dataValue == "true") {
                return;
            }

            const data = {
                VendorId: VendorId,
                ProjectId: ProjectId,
                Query: WhereClause
            }

            $.ajax({
                url: "/Expedite/GetPurchaseOrdersByContactID",
                type: 'POST',
                data: data,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (response) {
                    if (response != '' || response != null) {
                        $element.attr("data-l-data", "true");
                        $(`#acc_${VendorId}`).html(response);
                    }
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on('click', '#vendorRefresh', function () {
            const projectId = $("#projectDD option:selected").attr('data-id');

            $('#vendorCount').text(`(0)`);
            $('#accVendor').html('');

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                return;
            }
            loadVendorPart(projectId);
        });

        function loadBudgetPart(projectId) {
            $.ajax({
                url: "/Expedite/LoadBudgetSectionPart",
                type: 'POST',
                data: { ProjectId: projectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('#accBudget').html(data);
                    $(".loader").css("display", "none");
                }
            })

            $.ajax({
                url: "/Expedite/LoadBudgetSectionPartCount",
                type: 'POST',
                data: { ProjectId: projectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    const result = JSON.parse(data);
                    if (result.IsSuccess) {
                        $('#sectionCount').text(`(${result.Result.length})`);
                    }
                    $(".loader").css("display", "none");
                }
            })
        }

        $(document).on('click', '.second_level_budget_btn', function () {
            const Id = $(this).attr('data-id');
            const budgetSectionId = $(this).attr('data-budgetsectionid');
            const ProjectId = $("#projectDD option:selected").attr('data-id');

            let $element = $(`#acc_${budgetSectionId}`);
            let dataValue = $element.attr("data-l-data");
            if (dataValue == "true") {
                return;
            }
            const postData = {
                BudgetSectionId: budgetSectionId,
                ProjectId: ProjectId
            }
            $.ajax({
                url: '/Expedite/GetAllBudgetItemsByBudgetSectionId',
                type: 'POST',
                data: postData,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (response) {
                    if (response != '' || response != null) {
                        $element.attr("data-l-data", "true");
                        $(`#${Id}`).html(response);
                    }
                    $(".loader").css("display", "none");
                }
            })
        });

        $(document).on('click', '#budgetRefresh', function () {
            const projectId = $("#projectDD option:selected").attr('data-id');

            $('#sectionCount').text(`(0)`);
            $('#accBudget').html('');

            if (projectId == '0' || projectId == '' || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                return;
            }
            loadBudgetPart(projectId);
        });

        //$(document).on('click', '.edit_vendor_po_item', function () {
        //    const lineitemnumber = $(this).attr('data-lineitemnumber');
        //    const lineitemid = $(this).attr('data-lineitemid');
        //    const qty = $(this).attr('data-qty');
        //    const rqty = $(this).attr('data-rqty');
        //    const ponumber = $(this).attr('data-ponumber');

        //    const postData = {
        //        LineItemNumber: lineitemnumber,
        //        LineItemId: lineitemid,
        //        Quantity: qty,
        //        ReceivedQuantity: rqty,
        //        PoNumber: ponumber
        //    }

        //    $('#hdn_POID').val(ponumber);


        //    $('#po_itm_exp_note').modal('show');
        //});

        $(document).on('click', '#applyFilter', async function () {
            let error;
            let leftClause = CreateLeftWhereClause();
            if (!leftClause) return;

            let Condition = $('#chk_and').is(':checked') ? "AND" : $('#chk_or').is(':checked') ? "OR" : "";
            let FirstSearchDdlRight = $('#FirstSearchDdlRight').val();
            let RightClause;
            if (Condition && FirstSearchDdlRight) {
                RightClause = CreateRightWhereClause();
                if (!RightClause) {
                    error = true;
                    return;
                }
            }

            if (!RightClause) RightClause = '';

            let Clause = ` ${leftClause} ${RightClause}`;

            $('#HiddenClause').val('');
            $('#HiddenClause').val(Clause);

            if (!error) {
                const projectId = $("#projectDD option:selected").attr('data-id');
                let FirstSearchDdlLeft = $("#FirstSearchDdlLeft").val();
                const flag = FirstSearchDdlLeft === "BSHIPTO" ? FirstSearchDdlLeft : "";

                let inputData = {
                    ProjectId: projectId,
                    Query: Clause,
                    Flag: flag
                };

                if (projectId == '0' || projectId == '' || projectId == undefined) {
                    $('#vendorCount').text(`(0)`);
                    $('#accVendor').html('');
                    $('#sectionCount').text(`(0)`);
                    $('#accBudget').html('');
                    $.notify.warning('Caution', 'Please select project!');
                    return;
                }
                await loadBudgetPart_Query(inputData);
            }
        });

        function CreateLeftWhereClause() {
            const fieldTypes = {
                "POID": "number",
                "POLineItemID": "string",
                "VendorName": "string"
            };
            let FirstSearchDdlLeft = $('#FirstSearchDdlLeft').val();
            if (fieldMappings.hasOwnProperty(FirstSearchDdlLeft)) {
                FirstSearchDdlLeft = fieldMappings[FirstSearchDdlLeft];
            }
            if (!FirstSearchDdlLeft) {
                $.notify.warning('Caution', 'Please Select search field criteria!');
                return;
            }

            let SecondSearchDdlLeft = $('#SecondSearchDdlLeft').val();
            if (searchOptionMappings.hasOwnProperty(SecondSearchDdlLeft)) {
                SecondSearchDdlLeft = searchOptionMappings[SecondSearchDdlLeft];
            }
            if (!SecondSearchDdlLeft) {
                $.notify.warning('Caution', 'Please Select search operator!');
                return;
            }

            let LeftSearchVal;
            if ($('#ThirdSearchDdlLefttxt').hasClass('displayon')) {
                LeftSearchVal = $('#ThirdSearchDdlLefttxt').val();
            }
            else if ($('#ThirdSearchDdlLeftDtPckr').hasClass('displayon')) {
                LeftSearchVal = $('#ThirdSearchDdlLeftDtPckr').val();
            }
            else if ($('#ThirdSearchDdlLeft').hasClass('displayon')) {
                LeftSearchVal = $('#ThirdSearchDdlLeft').val();
            }
            if (!LeftSearchVal) {
                $.notify.warning('Caution', '"Please Select search value!');
                return;
            }

            let LeftClause;
            //if (SecondSearchDdlLeft == "like" || SecondSearchDdlLeft == "not like") {
            //    LeftClause = `${FirstSearchDdlLeft} ${SecondSearchDdlLeft} '^${LeftSearchVal}^'`;
            //}
            //else {
            //    LeftClause = `${FirstSearchDdlLeft} ${SecondSearchDdlLeft} ${LeftSearchVal}`;
            //}
            const fieldType = fieldTypes[FirstSearchDdlLeft];

            if (SecondSearchDdlLeft === "like" || SecondSearchDdlLeft === "not like") {

                if (fieldType === "number") {
                    // Convert numeric column to string in SQL
                    LeftClause = `CONVERT(VARCHAR, ${FirstSearchDdlLeft}) ${SecondSearchDdlLeft} '^${LeftSearchVal}^'`;
                } else {
                    LeftClause = `${FirstSearchDdlLeft} ${SecondSearchDdlLeft} '^${LeftSearchVal}^'`;
                }
            }
            else {
                if (fieldType === "string") {
                    LeftClause = `${FirstSearchDdlLeft} ${SecondSearchDdlLeft} '${LeftSearchVal}'`;
                } else {
                    LeftClause = `${FirstSearchDdlLeft} ${SecondSearchDdlLeft} ${LeftSearchVal}`;
                }
            }
            return LeftClause;
        }
        function CreateRightWhereClause() {
            let FirstSearchDdlRight = $('#FirstSearchDdlRight').val();
            if (fieldMappings.hasOwnProperty(FirstSearchDdlRight)) {
                FirstSearchDdlRight = fieldMappings[FirstSearchDdlRight];
            }
            if (!FirstSearchDdlRight) {
                $.notify.warning('Caution', 'Please Select search field criteria');
                return;
            }

            let SecondSearchDdlRight = $('#SecondSearchDdlRight').val();
            if (searchOptionMappings.hasOwnProperty(SecondSearchDdlRight)) {
                SecondSearchDdlRight = searchOptionMappings[SecondSearchDdlRight];
            }
            if (!SecondSearchDdlRight) {
                $.notify.warning('Caution', 'Please Select search operator');
                return;
            }

            let RightSearchVal;
            if ($('#ThirdSearchDdlRighttxt').hasClass('displayon')) {
                RightSearchVal = $('#ThirdSearchDdlRighttxt').val();
            }
            else if ($('#ThirdSearchDdlRightDtPckr').hasClass('displayon')) {
                RightSearchVal = $('#ThirdSearchDdlRightDtPckr').val();
            }
            else if ($('#ThirdSearchDdlRight').hasClass('displayon')) {
                RightSearchVal = $('#ThirdSearchDdlRight').val();
            }

            if (!RightSearchVal) {
                $.notify.warning('Caution', 'Please Select search value');
                return;
            }

            let Condition = $('#chk_and').is(':checked') ? "and" : $('#chk_or').is(':checked') ? "or" : "";

            if (!Condition) return;

            let RightClause;
            if (SecondSearchDdlRight == "like" || SecondSearchDdlRight == "not like") {
                RightClause = ` ${Condition} ${FirstSearchDdlRight} ${SecondSearchDdlRight} '^${RightSearchVal}^'`;
            }
            else {
                RightClause = ` ${Condition} ${FirstSearchDdlRight} ${SecondSearchDdlRight} ${RightSearchVal}`;
            }
            return RightClause;
        }

        async function loadBudgetPart_Query(inputData) {
            $.ajax({
                url: "/Expedite/LoadVendorPartWithQuery",
                type: "POST",
                data: inputData,
                dataType: 'html',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $(".loader").css("display", "none");
                        $('#accVendor').html(data);
                        updateVendorCountValue('#vendorCountValue');
                    }
                    else {
                        $(".loader").css("display", "none");
                        notify(false, "Something went wrong", false);
                    }
                }
            })
            
        }

        $(document).on('change', 'input[name="and_or_redio"]', function (e) {
            //const value = e.target.value;

            $('#FirstSearchDdlRight').removeAttr('disabled');
            $('#SecondSearchDdlRight').removeAttr('disabled');
            $('#ThirdSearchDdlRighttxt').removeAttr('disabled');
            $('#ThirdSearchDdlRightDtPckr').removeAttr('disabled');
            $('#ThirdSearchDdlRight').removeAttr('disabled');

            $('#FirstSearchDdlRight').val('');
            $('#FirstSearchDdlRight').trigger('change');
            //$('#SecondSearchDdlRight').empty();
            //$('#ThirdSearchDdlRighttxt').val('');
            //$('#ThirdSearchDdlRightDtPckr').val('');
            //$('#ThirdSearchDdlRight').empty();
        });

        $(document).on('click', '.btn_approval', function () {
            let lineitemnumber = $(this).attr('data-lineitemnumber');
            let ponumber = $(this).attr('data-ponumber');

            $('#fabrication_approval').modal('show');
        });

        // #region :: START OF FABRICATION
        $(document).on('click', '#OpenFabricationHistory', async function () {

            var Lineitemid = $(this).data('lineitemid');
            var itemno = $(this).data('lineitemnumber');
            var POID = $(this).data('ponumber');

            var itemdesc = $(this).parent().parent().find('td:eq(3)').text().trim();
            itemdesc = itemdesc != "" ? " - " + itemdesc : "";
            var ProjectID = $("#projectDD option:selected").attr('data-id');

            $('#headerforapprovals').text("APPROVALS FOR " + itemno + itemdesc);

            try {
                let isSuccess = await BindItemApprovalList();
                if (!isSuccess) return;

                isSuccess = await IsManager(POID);
                if (!isSuccess) return;

                $('#Hdn_POLineItemID').val(Lineitemid);
                $('#Hdn_PurchaseOrderID').val(POID);

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
                            $("#Hdn_IsManager").val(data.Result.result);
                            resolve(true);
                        } else {
                            $.notify.error('Error', data.ErrorMessages);
                            resolve(false);
                        }
                    },
                    error: function (xhr, status, error) {
                        $(".loader").css("display", "none");
                        reject(false);
                        if (xhr.status === 401 || xhr.status === 403)
                            window.location.href = '/Home/Index';

                        let errorMessage = "Something went wrong.";

                        try {

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

        function GetAllFabricationList(Lineitemid, ProjectID) {
            var POID = $('#Hdn_PurchaseOrderID').val();
            var IsManager = $('#Hdn_IsManager').val();
            var UserType = $('#Hdn_IsUserType').val();

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
            var ProjectID = $("#projectDD option:selected").attr('data-id');
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
            const ProjectID = $("#projectDD option:selected").attr('data-id');

            if (ItemApprovalID == 0) {
                $.notify.warning('Caution', 'Select Fabrication Approval Type');
                return;
            }

            if (ItemApprovalDesc == "") {
                $.notify.warning('Caution', 'Enter Fabrication Approval Description.');
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
                                    $.notify.error('Error', 'Description already exists');
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
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });

        $(document).on('click', '.deletefabitem', function () {

            $.confirm({
                title: 'Delete',
                message: 'Do you want to delete Fabrication Approval?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $(this).parent().remove();
                    if ($('.remove_note').length > 0) {
                        $('#approvalfinaladd').show();
                    }
                    else {
                        $('#approvalfinaladd').hide();
                    }
                },
                onCancel: function () {
                    if ($('.remove_note').length > 0) {
                        $('#approvalfinaladd').show();
                    }
                    else {
                        $('#approvalfinaladd').hide();
                    }
                }
            });            
        });

        $(document).on('click', '#approvalfinaladd', function () {

            var POLineItemID = $(".addFab").attr("data-id");
            //var managerID = $('#hdn_isManager').val();
            var ProjectID = $("#projectDD option:selected").attr('data-id');

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
            var ProjectID = $("#projectDD option:selected").attr('data-id');
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
            var IsManager = $("#Hdn_IsManager").val();
            var POLineItemApprovalID = $(this).data("approval");
            var ProjectID = $("#projectDD option:selected").attr('data-id');
            var FabPathGrpName = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").text();
            var ApprovalPathID = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();
            var ActionType = $('#ddl_actiontype_' + POLineItemApprovalID).val();
            var ActionDate = '';
            var CommentFab = $('#textarea_' + POLineItemApprovalID).val().trim();
            var ActionByProjectManager = "0";

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    $.notify.warning('Caution', 'FabCurrentResponse cannot be null');
                    return;
                }

                var responseParts = FabCurrentResponse.split("^^");
                var FabPathApprovalID = responseParts[0];
                var currentstatus = responseParts[1];


                if ((currentstatus == "Received" || currentstatus == "Approved" || currentstatus == "PathSet" || currentstatus == "Rejected") && (FabPathApprovalID == ApprovalPathID)) {
                    if (ActionType == 0) {
                        $.notify.warning('Caution', 'Please select an Action');
                        return;
                    }
                }

                if (IsManager == "1") {
                    var ActionByProjectManager = $('#ddl_selectuser_' + POLineItemApprovalID).val();
                    if (IsManager == "1" && ActionByProjectManager == "0" && (ActionType == "1" || ActionType == "6" || ActionType == "2" || ActionType == "3")) {
                        $.notify.warning('Caution', 'Please select  a user');
                        return;
                    }
                }

                if (ActionType == "1" || ActionType == "6" || ActionType == "2" || ActionType == "3") {
                    ActionDate = $('#datepicker_' + POLineItemApprovalID).val();
                }

                if (ApprovalPathID == "0") {
                    $.notify.warning('Caution', 'Please Select Fabrication Approval Path');
                    return;
                }

                if (CommentFab == "" && (ActionType == "3" || ActionType == "7" || ActionType == "4")) {
                    $.notify.warning('Caution', 'Please add comment');
                    return;
                }

                if (ActionType == "7") {

                    $.confirm({
                        title: 'Amend Approved Item?',
                        message: 'This is an approved item, all approval will be cancelled. Are you sure you want to amend the item?',
                        type: 'warning',
                        confirmText: 'Yes, Amend',
                        cancelText: 'Cancel',
                        onConfirm: function () {                            
                            submitApprovalData();
                        },
                        onCancel: function () {                           
                        }
                    });
                    return;
                }               

                submitApprovalData();

                function submitApprovalData() {
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
                    fd.append("FabPathApprovalID", FabPathApprovalID)


                    var files = $('#file_' + POLineItemApprovalID)[0].files;
                    var FileNames = "";
                    if (files && files.length > 0) {
                        FileNames = Array.from(files).map(file => file.name).join("^^^");
                        fd.append("FileNames", FileNames ? FileNames : "");
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
                                $.notify.error('Error', data.ErrorMessages);
                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                        }
                    });
                }
            } catch (error) {
                $.notify.error('Error', error);
                console.error(error);
            }

        });

        $(document).on('change', '.ddl_approvalpath_change', async function () {
            var POLineItemID = $(this).data("item");
            var POLineItemApprovalID = $(this).data("id");
            var ProjectID = $("#projectDD option:selected").attr('data-id');
            var CurrChangePathId = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    $.notify.warning('Caution', 'FabCurrentResponse cannot be null');
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
                        message: 'If you change the path it will go back to the beginning of the process.Are you sure you want to do the this?',
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
            $.confirm({
                title: 'Delete',
                message: 'Are you sure you want to delete the item history?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    var ProjectID = $("#projectDD option:selected").attr('data-id');
                    var HistoryId = $(this).data("id");
                    var POLineItemID = $(this).data("item");

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
                                $.notify.error('Error', data.ErrorMessages)
                                GetAllFabricationList(POLineItemID, ProjectID);
                            }
                        }
                    });

                },
                onCancel: function () {
                   
                }
            });            

        });

        // #endregion       

        $(document).on('click', '.expNotebtn', function () {

            const POLIID = $(this).data('lineitemid');
            const POID = $(this).data('poid');
            var row = $(this).closest('tr');
            var quantity = $(this).attr('data-qty');
            var receivedQuantity = $(this).attr('data-rqty');
            var itemNumber = row.find('td:eq(1)').text();

            $('.currentlyediting').each(function () {
                $(this).removeClass('currentlyediting');
            });

            row.addClass('currentlyediting');


            $.ajax({
                url: "/Expedite/ExpediteModal",
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

                        $('#txt_RecvdDate').bind('copy paste cut', function (e) {
                            e.preventDefault();
                        });

                        POLIExpHistory(POLIID);
                        POExpediteNoteinExpHistory(POLIID);
                        CheckFrieght(POLIID);
                        //var GeneratedPONumber = $('#Hdn_GeneratedPONumber').val();
                        $('#headerContent').html('');
                        $('#headerContent').html(`PO Expedite Notes (${itemNumber})`);
                        $(".loader").css("display", "none");
                        $('#hidden_POID').val(POID);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }
            });

        });


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

        function POLIExpHistory(POLIID) {
            $.ajax({
                url: "/Expedite/POLIExpediteHistory",
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
                        //notify(false, "Something went Wrong.", true);
                        //$(".loader").css("display", "none");
                    }
                },
                error: function () {
                    $(".loader").css("display", "none");
                    $.notify.error('Error', 'Something went wrong');
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
                    if (data != "") {
                        $('#poexpnoteinExpHistory1').html('');
                        $('#poexpnoteinExpHistory1').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $('#poexpnoteinExpHistory1').html(
                            '<tr></tr>< tr > <td colspan="8" class="empty_cell">No Expedite History Found</td></tr ><tr></tr><tr></tr>'
                        );
                    }
                },
                error: function (data) {
                    $.notify.error('Error', 'Something went wrong');
                    $(".loader").css("display", "none");
                }
            });
        }
        function CheckFrieght(POLIID) {

            if (POLIID == "" || POLIID == null)
                return;
            $.ajax({
                url: "/Expedite/CheckFrieght",
                data: { POLineItemId: POLIID },
                type: "GET",
                dataType: "json",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {

                        if (data.Result.isFrieght != false) {
                            $('#txt_ReturnQty').attr('disabled', 'disabled');
                            $('#txt_RecvdDate').attr('disabled', 'disabled');
                        }
                        else {
                            $('#txt_ReturnQty').removeAttr('disabled');
                            $('#txt_RecvdDate').removeAttr('disabled');
                        }
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }
            });

        }

        function formatNumber(number) {
            number = parseFloat(number).toFixed(2);            
            var x = number.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        $(document).on('click', '#btn_AddPOItemExpdNote', function () {

            var POLineItemID = $('#Hdn_POLIID').val();
            var ItemStatus = $('#ddl_ItemStatus').val();
            var ArrivalDate = $("#txt_ExpectedArrivalDate").val();
            var ReceivedQty = $('#txt_ReturnQty').val();
            var ReceivedDate = $('#txt_RecvdDate').val();
            var Reference = $('#txt_Reference').val();
            //var ItemExpediteNote = $('#ItemExpediteNote').val();
            const POID = $('#hidden_POID').val();
            var updateAll = $('#chkPOUpdateAll').prop("checked");
            var LIQuantity = $('.statusli').data('itemqty');
            var ReceivedPOQtyLI = $('.statusli').data('received');
            var Note = $('#ItemExpediteNote').val().trim();


            if ((ReceivedQty.trim() != 0) && (ReceivedQty.trim() != '' || ReceivedDate != '')) {
                if (ReceivedQty.trim() == '' || ReceivedDate.trim() == '') {
                    $.notify.warning('Caution', 'Please enter QTY/Date!');
                    return;
                }
            }
            
            if (ItemStatus == 0) {
                $('#ddl_ItemStatus').trigger('focus');
                $.notify.warning('Caution', 'Select Item Status!');
                return;
            }
                        

            if (ReceivedQty.trim() != "" || ReceivedQty.trim() != 0) {
                if (ReceivedDate == "") {
                    $.notify.warning('Caution', 'You must enter Received Date!');
                    return;
                }              
            }
            if (ReceivedDate != "") {
                if (ReceivedQty.trim() == "") {
                    $.notify.warning('Caution', 'You must enter Received Quantity!');
                    return;
                }              
            }
            if (parseInt(LIQuantity) - parseInt(ReceivedPOQtyLI) <= 0) {
                $.notify.warning('Caution', 'All Quantity of this item already Received!');
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
                        //$('#po_exp_note').modal('hide');
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        const POLIID = $('#hdn_poli').val();

                        var totalrows = $('.currentlyediting').find('td').length;

                        var ststuscellnumber;
                        var receivedqtycellnumber;
                        var arrivaldate;

                        if (totalrows <= 10) {
                            ststuscellnumber = 5;
                            receivedqtycellnumber = 9;
                            arrivaldate = 8;
                        }
                        else {
                            ststuscellnumber = 12;
                            receivedqtycellnumber = 16;
                            arrivaldate = 15;

                        }

                        var prev = '';
                        prev = parseFloat($('.currentlyediting').find('td:eq(' + receivedqtycellnumber + ')').html());
                        var curr = parseFloat(isNaN(ReceivedQty) || ReceivedQty == "" ? 0 : ReceivedQty);
                        var currentTotal = Math.round(parseFloat(prev + curr) * 100) / 100;

                        var status = '';
                        if (currentTotal.toString() == $('.statusdiv').find('label').attr('data-itemqty')) {
                            status = 'Received';
                        } else {
                            status = $('#ddl_ItemStatus option:selected').text();
                        }

                        //var newtxt = "Received " + curr + " Out of " + $('.statusdiv').find('label').attr('data-itemqty');
                        //$('.statusdiv').find('label').text('');
                        //$('.statusdiv').find('label').text(newtxt);

                        if (updateAll == true) {
                            $('#POitemTable tr').find('td:eq(' + arrivaldate + ')').html(ArrivalDate.split(".").join("-"));
                            $('#POitemTable tr').find('td:eq(' + ststuscellnumber + ')').html(status);
                        }

                        else {
                            $('.currentlyediting').find('td:eq(' + ststuscellnumber + ')').html(status);
                            $('.currentlyediting').find('td:eq(' + receivedqtycellnumber + ')').html(formatNumber(currentTotal));
                            $('.currentlyediting').find('td:eq(' + arrivaldate + ')').html(ArrivalDate.split(".").join("-"));
                        }
                        $('#ItemExpediteNote').val('');
                        $('#txt_ReturnQty').val('');
                        $('#txt_RecvdDate').val('');
                        $('#txt_Reference').val('');

                        $('.currentlyediting').find('.expNotebtn').trigger('click');


                    }
                    else {                      
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }

                }
            });

        });

        $(document).on('click', '#btn_AddExpNote', function () {

            var POLineItemID = $('#Hdn_POLIID').val();
            var Notes = $('#POItemExpediteNote').val()?.trim();

            if (Notes == "" || Notes == null) {
                $.notify.warning('Caution', 'Note cannot be Empty');
                return;
            }

            $.confirm({
                title: 'Proceed',
                message: `Do you want to save Note?`,
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
                                $(".loader").css("display", "none");
                                const POLIID = $('#hdn_poli').val();
                                $('#POItemExpediteNote').val('');
                                const POID = $('#hidden_POID').val();
                                POExpediteNoteinExpHistory(POLIID);
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
                    
                }
            });
        });

        $(document).on('click', '#btn_AddPOItemExpdNoteFull', function () {
            var ArrivalDate = $("#txt_ExpectedArrivalDate").val();
            var POLineItemID = $('#Hdn_POLIID').val();
            var ItemStatus = $('#ddl_ItemStatus').val();
            const POID = $('#hidden_POID').val();

            if ($('#txt_RecvdDate1').val() == '' || $('#txt_RecvdDate1').val() == null || $('#txt_RecvdDate1').val() == undefined) {
                $.notify.warning('Caution', 'Please enter Date');
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

                        var totalrows = $('.currentlyediting').find('td').length;

                        var ststuscellnumber;
                        var receivedqtycellnumber;
                        var arrivaldate;

                        if (totalrows <= 10) {
                            ststuscellnumber = 5;
                            receivedqtycellnumber = 9;
                            arrivaldate = 8;
                        }
                        else {
                            ststuscellnumber = 12;
                            receivedqtycellnumber = 16;
                            arrivaldate = 15;

                        }

                        var prev = '';
                        prev = parseFloat($('.currentlyediting').find('td:eq(' + receivedqtycellnumber + ')').html());
                        var curr = parseFloat(isNaN(ReceivedQty) || ReceivedQty == "" ? 0 : ReceivedQty);
                        var currentTotal = Math.round(parseFloat(prev + curr) * 100) / 100;

                        var status = '';
                        if (currentTotal.toString() == $('.statusdiv').find('label').attr('data-itemqty')) {
                            status = 'Received';
                        } else {
                            status = $('#ddl_ItemStatus option:selected').text();
                        }

                        if (updateAll == true) {
                            $('#POitemTable tr').find('td:eq(' + arrivaldate + ')').html(ArrivalDate.split(".").join("-"));
                            $('#POitemTable tr').find('td:eq(' + ststuscellnumber + ')').html(status);
                        }

                        else {
                            $('.currentlyediting').find('td:eq(' + ststuscellnumber + ')').html(status);
                            $('.currentlyediting').find('td:eq(' + receivedqtycellnumber + ')').html(formatNumber(currentTotal));
                            $('.currentlyediting').find('td:eq(' + arrivaldate + ')').html(ArrivalDate.split(".").join("-"))
                        }
                        $('#ItemExpediteNote').val('');
                        $('#txt_ReturnQty').val('');
                        $('#txt_RecvdDate').val('');
                        $('#txt_Reference').val('');

                        $('.currentlyediting').find('.expNotebtn').trigger('click');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }

                }
            });

        });

        function setStatus() {

            if ($('#txt_ExpectedArrivalDate').val() > $('#Hdn_PORequiedDate').val()) {
                $("#ddl_ItemStatus").val('2');
            }
            else {
                $("#ddl_ItemStatus").val($("#Hdn_ItemStatus").val());
            }
        }

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

            //$('#edtrdate').datepicker();
            //$('#edtrdate').datepicker({ dateFormat: 'dd-mm-yy'});

            $('#edtrdate').datepickercustom({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd-mm-yy',
                maxDate: 0
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
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        //const POID = $('#Hdn_PurchaseOrderID').val();
                        $('.currentlyediting').find('.expNotebtn').trigger('click');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }                   
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
                $('#editponote').trigger('focus');
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
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        $('.currentlyediting').find('.expNotebtn').trigger('click');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });
        });

        $(document).on('click', '.deletepoliexpnote', function () {

            let obj = $(this);


            $.confirm({
                title: 'Delete',
                message: 'Do you really want to delete the note?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    if ($('#Hdn_ItemStatus1').val() == "1") {
                        var $row = $(obj).closest("tr");
                        var text = parseFloat($row.find('td:eq(4)').text());
                        if (!isNaN(text)) {
                            var prev = parseFloat($('.currentlyediting').find('td:last-child').html());
                            var rcvqnty1 = parseFloat(Math.round(parseFloat(prev - text) * 100) / 100).toFixed(2);
                            $('.currentlyediting').find('td:last-child').html(rcvqnty1);
                        }
                    }

                    else {
                        var $row = $(obj).closest("tr");
                        var text = parseFloat($row.find('td:eq(4)').text());
                        if (!isNaN(text)) {
                            var prev = parseFloat($('.currentlyediting').find('td:eq(15)').html());
                            var rcvqnty1 = parseFloat(Math.round(parseFloat(prev - text) * 100) / 100).toFixed(2);

                            $('.currentlyediting').find('td:eq(15)').html(rcvqnty1);
                        }
                    }

                    var fldId = $(this).data('id');

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
                                $('.currentlyediting').find('.expNotebtn').trigger('click');

                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            $(".loader").css("display", "none");

                        }
                    });
                },
                onCancel: function () {
                    
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
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }


                        }
                    });
                },
                onCancel: function () {

                }
            });
            
            
        });

        $(document).on('click', '.gotoPOEdit', function (e) {
            e.preventDefault(); // IMPORTANT
            e.stopPropagation();

            let href = $(this).data('href');
            const _BaseURL = window.location.origin;

            window.open(_BaseURL + href, "_blank");
        });

        $(document).on('click', '.gotoPOReport', function (e) {
            var POID = $(this).data('poid');
            generatePOReportOnPoEdit(POID, 0);
        });

        function generatePOReportOnPoEdit(POID, mode) {
            $.ajax({
                url: '/Reports/PurchaseOrderReportGeneration',
                type: 'GET',
                dataType: 'JSON',
                data: { PurchaseOrderID: POID, showImageFlag: mode, IsCommited: "Y" },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        window.open(data.Result + "?v=" + new Date().getTime(), "_blank");
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }


        $(document).on('click', '.deletepoexpnote', function () {           
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
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {

                }
            });           
        });

        $(document).on('click', '.ponotehist', function () {

            var poid = $(this).attr('data-poid');
            $('#hdn_poidonly').val('');
            $('#hdn_poidonly').val(poid);

            POExpediteNoteOnlyInExpHistory(poid);
        });
        function POExpediteNoteOnlyInExpHistory(POID) {
            //var permissionForEdit = $('#Hdn_EditPermission').val();

            $.ajax({
                url: "/Expedite/GetPONoteInExpediteOnly",
                data: { POID: POID },
                type: "GET",
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#poexpnoteinExpHistory').html('');
                        $('#poexpnoteinExpHistory').html(data);
                        $('#note_modal').modal('show');
                        $(".loader").css("display", "none");
                        $('#hdn_poid').val(POID);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }
            });
        }

        $(document).on('click', '#btn_AddOnlyExpNote', function () {

            var POID = $('#hdn_poid').val();
            var Notes = $('#POItemExpediteNotemodal').val()?.trim();

            if (Notes == "" || Notes == null) {
                $.notify.warning('Caution', 'Note cannot be Empty');
                return;
            }

            $.confirm({
                title: 'Proceed',
                message: `Do you want to save Note?`,
                type: 'confirm',
                confirmText: 'Yes, Proceed',
                cancelText: 'Cancel',
                onConfirm: function () {
                    let fd = {
                        POID: POID,
                        Note: Notes
                    }
                    $.ajax({
                        url: "/Expedite/SavePOExpediteNoteOnly",
                        data: fd,
                        type: "POST",
                        dataType: "json",

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                //$('#po_exp_note').modal('hide');
                                $(".loader").css("display", "none");
                                $('#POItemExpediteNotemodal').val('');
                                POExpediteNoteOnlyInExpHistory(POID);

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
                }
            });            
        });

        $(document).on('click', '.deletepoexpnoteonly', function () {

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

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                var POID = $('#hdn_poidonly').val();
                                POExpediteNoteOnlyInExpHistory(POID);
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            $(".loader").css("display", "none");

                        }
                    });
                },
                onCancel: function () {                   
                }
            });            
        });

        $(document).on('click', '.poexphistoryonly', function () {
            var $row = $(this).closest('tr');
            $('#popupforeditponote1').modal('hide');
            var fldId = $(this).data('id');
            $('#hidden_fldId2').val('');
            $('#hidden_fldId2').val(fldId);

            var note = $row.find('td').eq(2).text();
            $('#editponoteonly').val('');
            $('#editponoteonly').val(note);

            $('#popupforeditponote1').modal('show');

        });

        $(document).on('click', '#edtbtnsave1', function () {
            var fldId = $('#hidden_fldId2').val();
            var note = $('#editponoteonly').val();
            //const POLIID = $('#hdn_poli').val();

            if (note == '' || note == " ") {
                $('#editponoteonly').trigger('focus');
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
                        var POID = $('#hdn_poidonly').val();
                        POExpediteNoteOnlyInExpHistory(POID);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");

                }
            });
        });
    }
    // #endregion
});