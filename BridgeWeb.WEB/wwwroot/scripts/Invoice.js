$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const QueryParameter = window.location.pathname.split("/");
    const action_name = QueryParameter[2].toLocaleLowerCase();

    // #region :: Invoice Search
    if (action_name === "invoicesearch") {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        $(".vendorlist").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
        });

        $('#fromsearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        $('#tosearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'
        });


        ProjectDropDown("0");

        function ProjectDropDown(ParentVendorId) {
            //var ParentVendorId = $('#txt_Project3').val() == null ? "0" : $('#txt_Project3').val();
            if (ParentVendorId == "0") {

                $.ajax({
                    url: "/Invoice/ProjectListDropdown",
                    data: JSON.stringify({ VendorId: ParentVendorId }),
                    type: "POST",
                    contentType: "application/json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {
                            $('#projectNameBind').html('');
                            $('#projectNameBind').html(data);

                            $("#txt_Project").multipleSelect({
                                filter: true,
                                showClear: true,
                                placeholder: "Please Select",
                                filterPlaceholder: "Enter Keyword",
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
            else {
                $.ajax({
                    url: "/Invoice/ProjectListDropdown",
                    data: JSON.stringify({ VendorId: ParentVendorId }),
                    type: "POST",
                    contentType: "application/json",

                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {
                            $('#projectNameBind').html('');
                            $('#projectNameBind').html(data);

                            $("#txt_Project").multipleSelect({
                                filter: true,
                                showClear: true,
                                placeholder: "Please Select",
                                filterPlaceholder: "Enter Keyword",
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
        }

        $('.datecontrol').on('change', function () {
            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');
            from = $('#' + from);
            to = $('#' + to);
            var mode = $(this).val();
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

        $(document).on('change', '#txt_Project3', function () {
            var ParentVendorId = $(this).val() == null || $(this).val() == "" ? "0" : $(this).val().join(",");
            ProjectDropDown(ParentVendorId);
        });

        $(document).on('change', '#txt_Project', function () {
            let ProjectIds = Array.isArray($(this).val()) ? ($(this).val()).join(',') : $(this).val();
            let selectedProjects = $("#txt_Project").multipleSelect("getSelects");
            if (selectedProjects.length > 5) {
                $.notify.warning('Caution', 'Select maximum five projects!');
                selectedProjects.pop();
                $("#txt_Project").multipleSelect("setSelects", selectedProjects);
                return;
            }
        });

        var poid = $('#poidhdn').val();
        if (poid == "") {
            InvoiceTableOnpageLoad();
        }

        else {
            InvoiceSearchOnClick();
        }

        function InvoiceTableOnpageLoad() {
            $('#tableonpageload').dataTable({
                pageLength: pageLength,
                "orderCellsTop": false,
                "order": [],
                "columnDefs": [
                    { "orderable": false, "targets": [4, 5, 6] }
                ],
                initComplete: function (settings, json) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).data();

                    if (rows.length === 0) {
                        $('#tableonpageload tbody').html(
                            '<tr><td colspan="11" class="empty_cell text-center">No data available in table</td></tr>'
                        );
                    }
                    $('.dt-search').css('display', 'none');
                },
                drawCallback: function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).data();

                    if (rows.length === 0) {
                        $('#tableonpageload tbody').html(
                            '<tr><td colspan="11" class="empty_cell text-center">No data available in table</td></tr>'
                        );
                    }
                }
            });

            $('#tableonpageload').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });

        }

        function InvoiceSearchOnClick() {

            var poid = $('#poidhdn').val();
            if (poid == "") {
                var fromdate = $('#fromsearch').val();
                var todate = $('#tosearch').val();
                var invoicenumber = $('#txt_invoice').val();
                if (invoicenumber == null) {
                    invoicenumber = "";
                }
                var vendorid = $('#txt_Project3').val();
                if (vendorid == null) {
                    vendorid = "";
                    $.notify.warning('Caution', 'Please Select Vendor!');
                    return;
                }
                else {
                    vendorid = vendorid.join(",");
                }
                var ProjectID = $('#txt_Project').val();
                if (ProjectID == null) {
                    ProjectID = "";
                }
                else {
                    ProjectID = ProjectID.join(",")
                }
                let fd = {
                    VendorID: vendorid,
                    InvoiceNumber: invoicenumber,
                    ProjectID: ProjectID,
                    Fromdate: fromdate,
                    Todate: todate,
                    POID: ""
                }
                $('#tableonpageload').css('display', 'none');
                $('#tableonpageload').DataTable().clear().destroy();

                $.ajax({
                    url: "/Invoice/SearchInvoiceList",
                    type: "POST",
                    data: JSON.stringify(fd),
                    dataType: "html",
                    contentType: "application/json",

                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != "") {
                            $('#invoicelist').html('');
                            $('#invoicelist').html(data);

                            InvoiceListDataTable();
                            $(".loader").css("display", "none");
                            $('#inv_list_tab tbody').off('click').on('click', 'tr', function (e) {

                                if ($(e.target).hasClass('payment')) {
                                    var redirectable = $(e.target).data('canbeclicked');
                                    if (redirectable == true) {

                                        return;
                                    }
                                }

                                // Get the clicked row
                                var parentRow = $(this);

                                // Retrieve data attributes
                                var mode = parentRow.data('redirect');
                                var invoiceId = parentRow.data('invoiceid');

                                // Check the mode and redirect
                                if (mode === "Credit") {
                                    var url = "/Invoice/EditCreditNote?invoiceId=" + invoiceId;
                                    window.open(url);
                                } else if (mode === "Invoice") {
                                    var url1 = "/Invoice/InvoiceEdit?invoiceId=" + invoiceId;
                                    window.open(url1);
                                }

                            });
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }
                    }
                });
            }
            else {
                let fd = {
                    VendorID: "",
                    InvoiceNumber: "",
                    ProjectID: "",
                    Fromdate: "",
                    Todate: "",
                    POID: poid

                }
                $('#tableonpageload').css('display', 'none');
                $('#tableonpageload').DataTable().clear().destroy();

                $.ajax({
                    url: "/Invoice/SearchInvoiceList",
                    type: "POST",
                    data: JSON.stringify(fd),
                    dataType: "html",
                    contentType: "application/json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != "") {
                            $('#invoicelist').html('');
                            $('#invoicelist').html(data);

                            InvoiceListDataTable();
                            $(".loader").css("display", "none");
                            $('#inv_list_tab tbody').off('click').on('click', 'tr', function (e) {

                                if ($(e.target).hasClass('payment')) {
                                    var redirectable = $(e.target).data('canbeclicked');
                                    if (redirectable == true) {

                                        return;
                                    }
                                }

                                // Get the clicked row
                                var parentRow = $(this);

                                // Retrieve data attributes
                                var mode = parentRow.data('redirect');
                                var invoiceId = parentRow.data('invoiceid');

                                // Check the mode and redirect
                                if (mode === "Credit") {
                                    var url = "/Invoice/EditCreditNote?invoiceId=" + invoiceId;
                                    window.open(url);
                                } else if (mode === "Invoice") {
                                    var url1 = "/Invoice/InvoiceEdit?invoiceId=" + invoiceId;
                                    window.open(url1);
                                }

                            });
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }
                    }

                });
            }

        }

        function InvoiceListDataTable() {
            if ($.fn.DataTable.isDataTable("#inv_list_tab")) {
                $('#inv_list_tab').DataTable().clear().destroy();
            }
            $("#inv_list_tab thead tr")
                .clone(true)
                .addClass("filtersinvoice")
                .appendTo("#inv_list_tab thead");

            var table = $("#inv_list_tab").DataTable({
                pageLength: pageLength,
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                scrollX: true,
                "order": [[0, "desc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },
                    //{ width: "10%", targets: 1 },  // Explicitly set column widths
                    //{ width: "15%", targets: 2 },
                    //{ width: "20%", targets: 3 },
                    { orderable: false, targets: [3, 4, 5, 6, 7, 8, 9, 10] }
                ],
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [0] }
                ],


                initComplete: function () {
                    var api = this.api();

                    // For each column
                    api
                        .columns()
                        .eq(0)
                        .each(function (colIdx) {
                            // Set the header cell to contain the input element
                            var cell = $(".filtersinvoice th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            // For other columns, add input elements
                            $(cell).html(
                                '<input type="text" class="form-control" placeholder="🔍 Search..." />'
                            );

                            // On every keypress in this input
                            $(
                                "input",
                                $(".filtersinvoice th").eq($(api.column(colIdx).header()).index())
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

                    $('.dt-search').css('display', 'none');
                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#inv_list_tab tbody').html(
                            '<tr><td colspan="11" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }

            });

            $('#inv_list_tab').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on('click', '#searchinvoicebtn', function () {
            InvoiceSearchOnClick();
        });

        $(document).on('click', '.payment', function () {
            var clickable = $(this).data('canbeclicked');
            var invId = $(this).data('invid');
            if (!clickable) {
                return;
            }

            $.ajax({
                url: "/Invoice/setFormanualsearch",
                type: "POST",
                data: { id: invId },
                async: false,
                datatype: "json",
                success: function (data) {
                    url = '/Invoice/ManualPaymentSearch';
                    window.open(url);
                }
            })

        });

        
    }
    // #endregion

    // #region :: Invoice Entry
    if (action_name === "invoiceentry") {

        let isDirty = false;

        $(document).on('change keyup', '#invoice_entry_form input, #invoice_entry_form select, #invoice_entry_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });
        //const UserPreferVendorId = parseInt(window._UserPreferences["Dropdown.VendorId"]) || '0';
        //const preferences = [];

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        //if (UserPreferVendorId != "0") {
        //		$('#Ddl_Vendors').multipleSelect('setSelects', [UserPreferVendorId]);
        //		 VendorTerms();
        //		 VendorAddress();
        //}

        document.onkeydown = function (e) {
            //var keyPressed = e.keyCode;
            if (e.key === "Shift") {

                $('html').css({
                    '-moz-user-select': '-moz-none',
                    '-moz-user-select': 'none',
                    '-o-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                }); //or you could pass these css rules into a class and add that class to html instead

                document.onkeyup = function () {
                    //here you remove css rules that disable text selection
                }
            }
        }

        var date = new Date();

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        $('#txt_InvoiceDate').datepicker("setDate", date);

        //this function is for clearing the button in multiselect
        $(document).on('click', '.icon-close', function () {
            let $dropdown = $(this).closest('.ms-parent').prev('select');
            let firstOption = $dropdown.find('option:first').val();
            $dropdown.multipleSelect('setSelects', [firstOption]);

        });

        $(document).on('change', '#Ddl_Vendors', async function () {

            try {
                $('.loader').css('display', 'flex');
                //preferences.push({
                //		PreferenceKey: 'Dropdown.VendorId',
                //		PreferenceValue: $(this).find('option:selected').val() || '0'
                //});
                //SetProjectPreference(preferences);
                if ($(this).find('option:selected').val() == "0" || $(this).find('option:selected').val() == null) {
                    await ProjectDD();
                    await ProjectAccount();
                    $('#adjustbtn').removeClass('d-none');


                    ItemSelectortbl("");

                    $('#lblAddress').text('');
                    $('#lblAddress').parent().removeAttr('href');
                    $('#lblLegal').text('');


                    return;
                }

                await ProjectDD();

                await VendorTerms();

                await ProjectAccount();

                await VendorAddress();
            }
            catch (err) {
                console.error("An error occurred:", err);
            } finally {
                $('.loader').css('display', 'none');
            }


        });

        $(document).on('change', '#ddl_project', async function () {

            try {
                $('.loader').css('display', 'flex');

                await ProjectAccount();

                await POSeletor();
            }
            catch (err) {
                console.error("An error occurred:", err);
            } finally {
                $('.loader').css('display', 'none');
            }


        });

        async function ProjectDD() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            if (vendorId == "0" || vendorId == null || vendorId == undefined) {
                //$('#ddl_project').empty();
                $('#projectlistbind').html('');

                $('#projectlistbind').html('<select multiple="multiple" class="multislct" data-width="100%" id="ddl_project"><option value="0">--Select Project--</option></select>');

                $('#ddl_project').multipleSelect({
                    filter: true,
                    showClear: false,
                    placeholder: 'Please Select',
                    filterPlaceholder: 'Enter Keyword',
                    single: true,
                });

                let firstOption = $('#ddl_project').find('option:first').val();
                $('#ddl_project').multipleSelect('setSelects', [firstOption]);

                return;
            }

            $.ajax({
                url: "/Invoice/ProjectDDBasedonVendor",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "HTML",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {
                    if (data != "") {
                        $('#projectlistbind').html('');
                        $('#projectlistbind').html(data);

                        $('#ddl_project').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',
                            single: true,

                        });
                        let firstOption = $('#ddl_project').find('option:first').val();
                        $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    //$(".loader").css("display", "none");

                }
            });
        }
        function SyncAll() {

            if ($('#item_selector tbody').find('tr').eq(0).find('td').length > 1) {
                $('#item_selector tbody tr').each(function () {

                    var invoicedamount = 0;
                    var totamnt = replaceAll($(this).find("td:eq(7)").html().toString(), ',', '');
                    var poitemid = $(this).attr('data-poliid');

                    $('#invoice_items tbody').find('tr').each(function () {
                        if ($(this).attr('data-rowid') == poitemid) {
                            var p = $(this).find('td:eq(0)').find('input').val().replace(',', '');
                            p = isNaN(parseFloat(p)) ? 0 : parseFloat(p);
                            var total = $(this).attr('data-total');
                            var vl = parseFloat(total) * parseFloat(p) / 100;
                            invoicedamount += vl;
                        }
                    });

                    $(this).find("td:eq(5) input").val(formatNumber(parseFloat(totamnt) - parseFloat(invoicedamount)));

                });
                calCulateOtherFields();
            }
        }
        ProjectDD();
        ProjectAccount();
        //POSeletor();
        async function VendorTerms() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined)
                return;

            await $.ajax({
                url: "/Invoice/Vendorterms",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "JSON",
                //async: false,


                success: function (data) {
                    if (data.IsSuccess) {

                        $("#ddl_terms").val(data.Result).change();
                        if ($("#ddl_terms").val() == null) {

                            $('#ddl_terms').val($('#ddl_terms option:first').val());
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }
            });

        }

        async function ProjectAccount() {

            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                //$('#bnkbalance').html('No Such Account In QBO');
                return;
            }

            $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

            $.ajax({
                url: "/Invoice/ProjectAccount",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.description}</option>`);
                        }
                        let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
                        let formData = {
                            accountId: accountNumber
                        };                      

                        $.ajax({
                            url: url,
                            data: formData,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data) {
                                if (data.IsSuccess) {
                                    if (data.Result != "INVALID") {
                                        $('#bnkbalance').html(data.Result);
                                    }
                                    else {
                                        $('#bnkbalance').html('No Such Account In QBO');
                                    }
                                }
                                else {
                                    $.notify.error('Error', data.Errors[0]);
                                    $('#bnkbalance').html('No Such Account In QBO');
                                }
                            }
                        });                       
                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                        $('#bnkbalance').html('No Such Account In QBO');
                    }
                    //$(".loader").css("display", "none");

                }
            });
        }

        async function POSeletor() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();

            var t1 = $('#ddl_project option:selected').attr('data-tax1');
            var t2 = $('#ddl_project option:selected').attr('data-tax2');
            var t3 = $('#ddl_project option:selected').attr('data-tax3');

            t1 = t1 == '' || t1 == null || t1 == undefined ? 'Total Tax 1' : 'Total ' + t1;
            t2 = t2 == '' || t2 == null || t2 == undefined ? 'Total Tax 2' : 'Total ' + t2;
            t3 = t3 == '' || t3 == null || t3 == undefined ? 'Total Tax 3' : 'Total ' + t3;

            $('#tt1').text(t1);
            $('#tt2').text(t2);
            $('#tt3').text(t3);


            //if (vendorId == "0" || vendorId == null || vendorId == undefined || projectId == "0" || projectId == null || projectId == undefined) {
            //	$('#poselectortblbind').html('');

            //	//if ($.fn.DataTable.isDataTable("#po_selector")) {
            //	//	$('#po_selector').DataTable().clear().destroy();
            //	//}
            //	$('#po_selector').DataTable().clear().destroy();
            //	var html = `<table id="po_selector" class="table table-striped table-hover po_selector_table" style="width:100%">
            //				<thead >
            //						<tr>
            //							<th style="width: 5%"></th>
            //							<th style="text-align: center; width: 40%;">PO #</th>
            //							<th style="text-align: center; width:15%;">Curr</th> 
            //							<th style="text-align: right; width: 20%;">Amount</th> 
            //							<th style="text-align: right; width: 20%;">Remaning</th> 
            //							<th class="d-none">Payment Schedule</th>  
            //							<th class="d-none">Taxes</th>  
            //							<th class="d-none">ProjectID</th> 
            //							<th class="d-none">VendorId</th>  
            //							<th class="d-none">RemainingDuplicate</th>
            //							<th class="d-none">PurchaseOrderID</th> 
            //							<th class="d-none">CR</th>

            //						</tr>
            //				</thead>

            //							<tbody>	
            //								<tr>
            //									<td colspan="12" class="text-center">No data available in the table.</td>
            //								</tr>
            //							</tbody>
            //				</table>`;



            //	$('#poselectortblbind').html(html);

            //	return;
            //}

            $.ajax({
                url: "/Invoice/POSelector",
                data: { VendorId: vendorId, ProjectId: projectId },
                type: "GET",
                dataType: "HTML",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {

                    if (data != "") {
                        $('#poselectortblbind').html('');
                        $('#poselectortblbind').html(data);

                        POSelectorDatatable();
                        conversionRateForProject();
                        ApplyFxRate();


                    }
                    else {
                        //notify(false, "Something Went Wrong.", true);
                        $('#poselectortblbind').html('');

                    }
                    //$(".loader").css("display", "none");

                }
            });

        }
        function POSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#po_selector")) {
                $('#po_selector').DataTable().clear().destroy();
            }

            //$("#po_selector thead tr")
            //    .clone(true)
            //    .addClass("filters")
            //    .appendTo("#po_selector thead");

            var table = $("#po_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,

                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },

                    { "targets": [5, 6, 7, 8, 9, 10, 11], "className": "d-none" }

                ],




                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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
                        $('#po_selector tbody').html(
                            '<tr><td colspan="12" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }

        $(document).on('click', '.redirectpoedit', function () {
            var poid = $(this).data('poid');
            var url = "/Purchaseorder/POEdit?POId=" + poid;
            window.open(url, '_blank');

        });

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.error('Error', data.Errors[0]);
                    }
                }
            }); 
        });
        function conversionRateForProject() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];

            $("#po_selector tbody tr").each(function () {
                var remaining = $(this).find("td:eq(9)").text()?.trim();
                var poid = $(this).find("td:eq(10)").text()?.trim();
                var cr = $(this).find("td:eq(11)").text()?.trim();

                var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                if (poid != "" && poid != null && poid != undefined) {

                    remainingValues.push(
                        {
                            Remaining: parseFloat(remaining),
                            POIDs: parseInt(poid),
                            ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                        }
                    );
                }

            });

            if (remainingValues.length == 0) return;

            $.ajax({
                url: "/Invoice/ConversionrateForProject",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(remainingValues),
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data.IsSuccess) {
                        var totalafterconv = data.Result.totalAfterConvert;
                        var totalbeforeconv = data.Result.totalBeforeConvert;
                        $('#exchngrate').val('');
                        $('#exchngrate').val(formatNumber(parseFloat(totalafterconv / totalbeforeconv)));
                        $(".loader").css("display", "none");

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#exchngrate').val('');
                        $(".loader").css("display", "none");
                    }
                }

            });
        }
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

        async function VendorAddress() {
            var vendorid = $('#Ddl_Vendors').val()?.toString();

            $.ajax({
                url: "/Invoice/GetVendorAddress",
                data: { VendorID: vendorid },
                type: "GET",
                dataType: "JSON",

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {
                    if (data.IsSuccess) {
                        var response = data.Result.result;
                        $('#lblAddress').text(response.split('%%%')[0]);
                        $('#lblLegal').text(response.split('%%%')[1]);
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid=' + vendorid);
                    }
                    else {
                        $('#lblAddress').text('');
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid' + vendorid);
                        $('#lblLegal').text('');
                    }
                    //$(".loader").css("display", "none");
                }
            });
        }

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";
            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);
            ItemSelectortbl(poids);

        });

        ItemSelectortbl("");
        function ItemSelectortbl(poids) {
            if (poids == "") {
                $('#polineitemtblbind').html('');
                var html = `
						<table id="item_selector" class="table table-striped table-hover item_selector_table" style="width:100%">
							<thead>
								<tr>
									<th>Item#</th>
									<th>PO#</th>
									<th>Description</th>
									<th>Qty</th>
									<th>Curr</th>
									<th>PO Cost</th>
									<th>Total</th>
									<th>Rem</th>
									<th>%</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colspan="9" class="text-center">No data available </td>
								</tr>
							</tbody>
						</table>
						`;

                $('#polineitemtblbind').html(html);
                $('.dt-search').css("display", "none");
                //ItemSelectorDatatable();
                return;

            }

            $.ajax({
                url: "/Invoice/POLineItemSelectorBasedonPO",
                type: "GET",
                data: { poids: poids },
                dataType: "HTML",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data != "") {
                        $('#polineitemtblbind').html('');
                        $('#polineitemtblbind').html(data);
                        ItemSelectorDatatable();
                        convRate();
                        getInvoiceLineItems("");
                        ApplyFxRate();
                        $(".loader").css("display", "none");



                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");

                    }
                }

            });
        }
        function ItemSelectorDatatable() {
            if ($.fn.DataTable.isDataTable("#item_selector")) {
                $('#item_selector').DataTable().clear().destroy();
            }



            var table = $("#item_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },
                    { "targets": [9], "className": "d-none" },
                    //{
                    //		targets: "_all"  ,    // column index (0-based)
                    //		type: "string"   // force as string instead of numeric
                    //}
                ],

                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();

                    $('.dt-search').css("display", "none");

                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#item_selector tbody').html(
                            '<tr><td colspan="10" class="empty_cell">No data available</td></tr>'
                        );
                    }
                    $('.dt-search').css("display", "none");

                }


            });
        }
        function convRate() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];

            $("#item_selector tbody tr").each(function () {
                var remaining = $(this).find("td:eq(7)").text()?.trim();
                var poid = $(this).data('poliid'); //polineitemid for convRate of Item Selector table
                var cr = $(this).data('cr');

                var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                if (poid != "" && poid != null && poid != undefined) {

                    remainingValues.push(
                        {
                            Remaining: parseFloat(remaining),
                            POIDs: parseInt(poid),
                            ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                        }
                    );
                }


            });

            if (remainingValues.length == 0) return;

            $.ajax({
                url: "/Invoice/ConversionrateForProject",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(remainingValues),
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data.IsSuccess) {
                        var totalafterconv = data.Result.totalAfterConvert;
                        var totalbeforeconv = data.Result.totalBeforeConvert;
                        $('#exchngrate').val('');
                        $('#exchngrate').val(formatNumber(parseFloat(totalafterconv / totalbeforeconv)));
                        $(".loader").css("display", "none");

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#exchngrate').val('');
                        $(".loader").css("display", "none");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                    $(".loader").css("display", "none");

                }

            });
        }
        function ApplyFxRate() {
            var currentExchngRate = parseFloat($('#exchngrate').val().trim());

            if ($('#po_selector tbody').find('tr').eq(0).find('td').length > 1) {

                $('#tblPOSelector tbody tr').each(function () {
                    var remainingAmount = $(this).find('td:eq(9)').html().replace(",", "");
                    var orAmount = $(this).find('td:eq(3)').html().replace(",", "");

                    if (currentExchngRate > 0) {
                        $(this).find('td:eq(4)').html(formatNumber(parseFloat(remainingAmount * currentExchngRate).toFixed(2)));
                        $(this).find('td:eq(3)').html(formatNumber(parseFloat(orAmount * currentExchngRate).toFixed(2)));

                    }
                    //else {

                    //}

                });

            }

            if ($('#item_selector tbody').find('tr').eq(0).find('td').length > 1) {

                $('#item_selector tbody tr').each(function () {
                    var remainingAmount = $(this).find('td:eq(7)').html();
                    var orAmount = $(this).find('td:eq(6)').html();
                    remainingAmount = remainingAmount != undefined || remainingAmount != null || remaining != "" ? remainingAmount.replace(",", "") : 0;

                    if (currentExchngRate > 0) {
                        $(this).find('td:eq(8)').html(formatNumber(parseFloat(remainingAmount * currentExchngRate).toFixed(2)));
                        $(this).find('td:eq(7)').html(formatNumber(parseFloat(orAmount * currentExchngRate).toFixed(2)));
                    }
                });
            }

            //Invoice Items table logic here
            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    //calculate taxes function simplified and modified
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val().replace(',', '');
                    var quantity = $(rw).find('td:eq(4) input').val().replace(',', '');
                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var val = cost * quantity * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';
                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1val');
                    Taxtype = $(this).attr('data-Tax1type');
                    tottax1 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2val');
                    Taxtype = $(this).attr('data-Tax2type');
                    tottax2 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3val');
                    Taxtype = $(this).attr('data-Tax3type');
                    tottax3 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    //Update LineItemtotal
                    $(this).find('td:eq(7)').html(isNaN(val) ? 0 : formatNumber(val));

                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));
                });
            }

            //$('#invoice_items tbody tr td:eq(0)').val() > 100 ? $('#tblInvoiceItems tbody tr td:eq(1)').val('100') : 0;

            CalculatePercent($('#tblInvoiceItems tbody tr td:eq(1)'));
        }

        $(document).on('click', '#singleSelect', function () {

            var poidall = "";
            $(document).find('.noselect').each(function () {
                if ($(this).length > 0) {

                    let poid = $(this).data('poliid');
                    if (poid != undefined) {

                        poidall += poidall == "" ? poid : "," + poid;
                    }
                }



            });

            $(document).find('.selected').each(function () {
                //if ($(this).hasClass('selected') && !$(this).hasClass('noselect'))
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('noselect');
                }

                let poid = $(this).data('poliid');
                if (poid != undefined) {

                    poidall += poidall == "" ? poid : "," + poid;
                }

            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            getInvoiceLineItems(poidall);


        });

        $(document).on('click', '#item_selector tbody tr', function (event) {

            if ($(event.target).closest('a').length) {
                return;
            }

            //if ($(event.target).closest('.getotherinvoice').length) {
            //	return;
            //}
            if ($(this).find('td').length <= 1) return;

            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#item_selector tbody tr').not(':hidden');
            if (event.ctrlKey) {
                //rows.removeClass('selected');
                currentRow.toggleClass('selected');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selected').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selected');

                } else {
                    currentRow.addClass('selected');
                }

            }
            else {
                var ln = $('.selected').length;
                var hclass = false;
                hclass = $(this).hasClass('selected');

                $('.selected').each(function () {
                    $(this).removeClass('selected');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selected');
                }
                else if (ln == 1) {
                    $(this).removeClass('selected');
                }


            }

            $('.selected').each(function () {
                const poliid = $(this).data('poliid');
                if (poliid) {
                    polids += (polids ? "," : "") + poliid;
                }
            });

            //console.log(polids)
        });

        getInvoiceLineItems("");
        function getInvoiceLineItems(poids) {
            if (poids == "" || poids == undefined || poids == null) {

                var html = `<table id="invoice_items" class="table table-striped table-hover invoice_items_table" style="width:100%">
							<thead>
								<tr>
									<th>%</th>
									<th><a href="#">PO#</a></th>
									<th>Item #</th>
									<th>Description</th>
									<th>Qty</th>
									<th>Amount</th>
									<th>Sub Total</th>
									<th>Line Item Total</th>
								</tr>
							</thead>

							<tbody>
								<tr>
								   <td colspan="11" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invoiceitemtblbind').html('');
                $('#invoiceitemtblbind').html(html);

                return;
            }

            var percent = $('#percentage').val();

            $.ajax({
                url: "/Invoice/GetInvoiceDataAfterSelecting",
                data: { poids: poids, percent: percent },
                dataType: "HTML",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {

                        $('#invoiceitemtblbind').html('');
                        $('#invoiceitemtblbind').html(data);
                        //calCulateOtherFields();
                        SyncAll();
                        convRate();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }

            });

            ApplyFxRate();
        }
        function calCulateOtherFields() {

            var TotalTax1 = 0.00;
            var TotalTax2 = 0.00;
            var TotalTax3 = 0.00;
            var TotalInvoice = 0;
            var Amount = 0.00;

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {
                $('#invoice_items tbody tr').each(function () {
                    Amount += parseFloat($(this).find('td:eq(7)').text().replace(/,/g, ""));

                    //TotalTax1 += parseFloat(isNaN($(this).find('td.d-none:eq(0) input').val()) ? 0 : $(this).find('td.d-none:eq(0) input').val());
                    //TotalTax2 += parseFloat(isNaN($(this).find('td.d-none:eq(1) input').val()) ? 0 : $(this).find('td.d-none:eq(1) input').val());
                    //TotalTax3 += parseFloat(isNaN($(this).find('td.d-none:eq(2) input').val()) ? 0 : $(this).find('td.d-none:eq(2) input').val());
                    var tax1 = $(this).find('td.d-none:eq(0) input').val()?.trim().replace(/[^0-9.]/g, '');
                    var tax2 = $(this).find('td.d-none:eq(1) input').val()?.trim().replace(/[^0-9.]/g, '');
                    var tax3 = $(this).find('td.d-none:eq(2) input').val()?.trim().replace(/[^0-9.]/g, '');

                    TotalTax1 += isNaN(parseFloat(tax1)) ? 0 : parseFloat(tax1);
                    TotalTax2 += isNaN(parseFloat(tax2)) ? 0 : parseFloat(tax2);
                    TotalTax3 += isNaN(parseFloat(tax3)) ? 0 : parseFloat(tax3);
                });

                //TotalInvoice = parseFloat(parseFloat(TotalTax1).toFixed(2) + parseFloat(TotalTax2).toFixed(2) + parseFloat(TotalTax3).toFixed(2));
                TotalInvoice = TotalTax1 + TotalTax2 + TotalTax3;
                TotalInvoice = parseFloat(TotalInvoice.toFixed(2));
                $('#txt_SubtotalInvoice').val(formatNumber(Amount));

                $('#txt_TotalTax1').val(formatNumber(isNaN(TotalTax1) ? 0 : TotalTax1));
                $('#txt_TotalTax2').val(formatNumber(isNaN(TotalTax2) ? 0 : TotalTax2));
                $('#txt_TotalTax3').val(formatNumber(isNaN(TotalTax3) ? 0 : TotalTax3));

                var ttinv = Amount + TotalInvoice;

                $('#txt_TotalInvoice').val(formatNumber(ttinv));
            }
            else {
                $('#txt_SubtotalInvoice').val(0);

                $('#txt_TotalTax1').val(0);
                $('#txt_TotalTax2').val(0);
                $('#txt_TotalTax3').val(0);
                $('#txt_TotalInvoice').val(0);
            }

        }
        function SyncAll() {

            if ($('#item_selector tbody').find('tr').eq(0).find('td').length > 1) {
                $('#item_selector tbody tr').each(function () {

                    var invoicedamount = 0;
                    var totamnt = replaceAll($(this).find("td:eq(7)").html().toString(), ',', '');
                    var poitemid = $(this).attr('data-poliid');

                    $('#invoice_items tbody').find('tr').each(function () {
                        if ($(this).attr('data-rowid') == poitemid) {
                            var p = $(this).find('td:eq(0)').find('input').val().replace(',', '');
                            p = isNaN(parseFloat(p)) ? 0 : parseFloat(p);
                            var total = $(this).attr('data-total');
                            var vl = parseFloat(total) * parseFloat(p) / 100;
                            invoicedamount += vl;
                        }
                    });

                    $(this).find("td:eq(5) input").val(formatNumber(parseFloat(totamnt) - parseFloat(invoicedamount)));

                });
                calCulateOtherFields();
            }
        }

        $(document).on('click', '#selectall', function () {
            let poidall = "";
            $('#item_selector tbody tr').each(function () {
                // if (!$(this).hasClass('noselect')) {
                $(this).addClass('noselect');
                //let poli = $(this).attr('data-poli');
                let poli = $(this).data('poliid');
                if (poli != undefined) {

                    poidall += poidall == "" ? poli : "," + poli;
                }
                //poidall += poidall == "" ? poid : "," + poid;
                //}
            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            getInvoiceLineItems(poidall);

        });

        $(document).on('click', '#invoice_items tbody tr ', function (event) {

            if ($(event.target).closest('tr').hasClass('theader')) {
                return;
            }

            // Ignore clicks on rows without .selectable class
            if (!$(event.target).hasClass('selectable')) {
                return;
            }
            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#invoice_items tbody tr').not(':hidden');
            if (event.ctrlKey) {
                currentRow.toggleClass('selectedrow');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selectedrow').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selectedrow');

                } else {

                    currentRow.addClass('selectedrow');
                }

            }
            else {

                //rows.removeClass('selectedrow');
                //currentRow.toggleClass('selectedrow');
                var ln = $('.selectedrow').length;
                var hclass = false;
                hclass = $(this).hasClass('selectedrow');

                $('.selectedrow').each(function () {
                    $(this).removeClass('selectedrow');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selectedrow');
                }
                else if (ln == 1) {
                    $(this).removeClass('selectedrow');
                }
            }

            var selectedrows = parseInt($('.selectedrow').length);
            if (selectedrows > 0) {
                $('#adjustbtn').removeClass('d-none');
            }
            else {
                $('#adjustbtn').addClass('d-none');
            }

        });

        $(document).on('click', '#unselectSelected', function () {

            $('.selectedrow').each(function () {
                $(this).remove();
                var poitemidinvoice = $(this).attr('data-poli');

                $('#item_selector tbody tr').each(function () {
                    var poitemidselector = $(this).data('poliid');
                    if (poitemidselector == poitemidinvoice) { $(this).removeClass('noselect'); $(this).removeClass('selected') }
                });

            });

            if ($('#invoice_items tbody tr').length === 0) {
                $('#invoice_items tbody').append('<tr><td colspan="11" class="text-center">No data available</td></tr>');
            }
            SyncAll();
        });

        $(document).on('click', '#unselectAll', function () {
            $('#invoice_items tbody tr').each(function () {
                $(this).remove();

            });

            $('#item_selector tbody tr').each(function () {
                $(this).removeClass('noselect');
                $(this).removeClass('selected');
            });

            $('#invoice_items tbody').append('<tr><td colspan="11" class="text-center">No data available</td></tr>');

            SyncAll();

        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty.');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            })


        });

        $(document).on('keyup', '#exchngrate', function () {
            $(this).removeAttr('data-edited');
            $(this).attr('data-edited', 'Y');

            ApplyFxRate();
        });

        $(document).on('click', '.getotherinvoice', function () {
            lineitemId = $(this).data('itemid');
            $.ajax({
                url: "/Invoice/PreviousInvoices",
                data: { POLIId: lineitemId },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {
                        $('#previnvlistbind').html('');
                        $('#previnvlistbind').html(data);
                        if ($('#tblprevinvoice tbody tr').length > 0) {
                            prevInvoiceDatatable();
                            $('#previnvoice').modal('show');
                        } else {
                            $.notify.error('Error', 'No previous invoice found');
                        }

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');

                    }
                    $(".loader").css("display", "none");
                }
            })
        });
        function prevInvoiceDatatable() {
            if ($.fn.DataTable.isDataTable("#tblprevinvoice")) {
                $('#tblprevinvoice').DataTable().clear().destroy();
            }

            var table = $("#tblprevinvoice").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                //columnDefs: [
                //	{ className: "dt-head-nowrap", targets: "_all" },
                //	{ "orderable": false, targets: 0 },
                //	{ "orderable": true, targets: "_all" },
                //	{ "targets": [9], "className": "d-none" }
                //],
                order: [[2, 'asc']],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even']




            });
        }

        $(document).on('keyup', '.percentChange', function () {

            CalculatePercent($(this));
        });
        function CalculatePercent(obj) {

            if ($(obj).val() > 100) {
                $(obj).val('100');
            }

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val();
                    var qty = $(rw).find('td:eq(4) input').val();

                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var vl = cost * qty * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';

                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1Val');
                    Taxtype = $(this).attr('data-tax1type');

                    //CalculateTaxes() function logic from the old solution start
                    if (Taxtype == "%") {
                        tottax1 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax1 = TaxVal;
                    }
                    tottax1 = isNaN(tottax1) ? 0 : tottax1;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2Val');
                    Taxtype = $(this).attr('data-tax2type');

                    if (Taxtype == "%") {
                        tottax2 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax2 = TaxVal;
                    }
                    tottax2 = isNaN(tottax2) ? 0 : tottax2;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3Val');
                    Taxtype = $(this).attr('data-tax3type');

                    if (Taxtype == "%") {
                        tottax3 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax3 = TaxVal;
                    }
                    tottax3 = isNaN(tottax3) ? 0 : tottax3;

                    $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                });
            }


            SyncAll();
        }

        $(document).on('keyup', '.setQty', function () {

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val();
                    var qty = $(rw).find('td:eq(4) input').val();

                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var vl = cost * qty * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';

                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1Val');
                    Taxtype = $(this).attr('data-tax1type');

                    //CalculateTaxes() function logic from the old solution start
                    if (Taxtype == "%") {
                        tottax1 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax1 = TaxVal;
                    }
                    tottax1 = isNaN(tottax1) ? 0 : tottax1;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2Val');
                    Taxtype = $(this).attr('data-tax2type');

                    if (Taxtype == "%") {
                        tottax2 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax2 = TaxVal;
                    }
                    tottax2 = isNaN(tottax2) ? 0 : tottax2;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3Val');
                    Taxtype = $(this).attr('data-tax3type');

                    if (Taxtype == "%") {
                        tottax3 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax3 = TaxVal;
                    }
                    tottax3 = isNaN(tottax3) ? 0 : tottax3;

                    $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                });
            }

            SyncAll();
        });

        $(document).on('click', '#btn_Save', function () {

            var goAhead = true;

            $('#invoice_items tbody tr').each(function () {
                var ProjectAccount = $(this).find('td').eq(11).find('select').val();
                if (ProjectAccount == "0") {                   
                    $.notify.warning('Caution', "Row number " + ($(this).index() + 1) + " Does not have any Project account associated.");
                    goAhead = false;
                    return;
                }
            });

            if (!goAhead) return;

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length <= 1) {
                $.notify.warning('Caution', 'Please Add items in Invoice first');
                return;
            }

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var POID = $('#hdn_poid').val();

            var tmp = true;
            var i = 0;
            var probrow = 0;

            $('#invoice_items tbody tr').each(function () {
                var total = $(this).attr('data-remaining');
                var t1 = 0;
                var t2 = 0;
                var t3 = 0;

                t1 = $(this).find('td:eq(8)').find('input').val()?.trim().replace(',', '');
                t2 = $(this).find('td:eq(9)').find('input').val()?.trim().replace(',', '');
                t3 = $(this).find('td:eq(10)').find('input').val()?.trim().replace(',', '');

                t1 = isNaN(parseFloat(t1)) ? 0 : parseFloat(t1);
                t2 = isNaN(parseFloat(t2)) ? 0 : parseFloat(t2);
                t3 = isNaN(parseFloat(t3)) ? 0 : parseFloat(t3);

                var vl = replaceAll($(this).find('td:eq(7)').html().replace(',', ''), ',', '');

                vl = isNaN(parseFloat(vl)) ? 0 : parseFloat(vl);

                i++;

                total = (precise_round(total, 2));
                vl = precise_round(vl, 2);
                vl = (precise_round(vl, 2));

                if (parseFloat(vl) > parseFloat(total)) {

                    if (probrow == "0") {
                        probrow = i;
                    }



                    tmp = false;
                    return;
                }

            });

            if (probrow != "0") {
                $.notify.warning('Caution', 'Row number ' + (probrow) + ' is exceeding total remaining value.');

            }

            if (!tmp) return;

            var projectId = $('#ddl_project').val()?.toString();

            //validation start

            if (vendorId == "0" || vendorId == null) {
                $.notify.warning('Caution', 'Please Select Vendors');
                return;
            }

            if ($('#po_selector tbody').find('tr').eq(0).find('td').length <= 1) {
                $.notify.warning('Caution', 'Please Select POs.');
                return;
            }

            if ($('#txt_InvoiceNumber').val() != '' || $('#txt_InvoiceNumber').val() != null) {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the InvoiceNumber in correct format');
                    return false;

                }

            }

            if ($('#txt_InvoiceDate').val()?.trim() == '') {
                $('#' + "txt_InvoiceDate").val($('#' + 'txt_InvoiceDate').val()?.trim());
                $('#' + 'txt_InvoiceDate').attr('placeholder', 'Please insert Invoice Date.');
                $('#' + 'txt_InvoiceDate').effect("shake", { times: 2 }, 700);
                $('#' + 'txt_InvoiceDate').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date');
                return;
            }

            var InvoiceDate = $('#txt_InvoiceDate').val();
            if ($('#ddl_terms').val()?.trim() == '' || $('#ddl_terms').val()?.trim() == '0' || $('#ddl_terms').val() == null) {
                $('#ddl_terms').val($('#' + 'ddl_terms').val().trim());
                $('#ddl_terms').attr('placeholder', 'Please Select Terms.');
                $('#ddl_terms').effect("shake", { times: 2 }, 700);
                $('#ddl_terms').focus();
                $.notify.warning('Caution', 'Please Select Terms');
                return;
            }

            var Terms = $('#ddl_terms').val();
            if ($('#Ddl_ProjectAccount').val() == '0') {
                $('#Ddl_ProjectAccount').val($('#' + 'Ddl_ProjectAccount').val()?.trim());
                $('#Ddl_ProjectAccount').attr('placeholder', 'Please Select Project Account.');
                $('#Ddl_ProjectAccount').effect("shake", { times: 2 }, 700);
                $('#Ddl_ProjectAccount').trigger('focus');
                $.notify.warning('Caution', 'Please Select Project Account.');

                return;
            }
            var projectAccount = $('#Ddl_ProjectAccount').val();
            if ($('#exchngrate').val() == '' || !$('#exchngrate').val()) {
                $.notify.warning('Caution', 'Please Add FX Rate in Invoice first');
                return;
            }
            if ($('#txt_InvoiceNumber').val()?.trim() == '') {
                $('#txt_InvoiceNumber').val($('#' + 'txt_InvoiceNumber').val()?.trim());
                $('#txt_InvoiceNumber').attr('placeholder', 'Please enter Invoice Number.');
                $('#txt_InvoiceNumber').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceNumber').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Number.');

                return;
            }

            var InvoiceNumber = escape($('#txt_InvoiceNumber').val().trim());

            if ($('#txt_TotalInvoiceAmount').val()?.replace(',', '').trim() == '0' || $('#txt_TotalInvoiceAmount').val().replace(',', '').trim() == '') {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val()?.trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Please enter Total Invoice Amount.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Please enter Total Invoice Amount.');

                return;
            }

            var TotalInvoiceAmount = replaceAll($('#txt_TotalInvoiceAmount').val().replace(',', ''), ',', '');

            //if ($('#txt_InvoiceMemo').val()?.trim() == '0') {
            //		$('#txt_InvoiceMemo').val($('#' + 'txt_InvoiceMemo').val()?.trim());
            //		$('#txt_InvoiceMemo').attr('placeholder', 'Please enter Invoice Memo.');
            //		$('#txt_InvoiceMemo').effect("shake", { times: 2 }, 700);
            //		$('#txt_InvoiceMemo').focus();
            //		notify(false, 'Please enter Invoice Memo.', false);

            //		return;
            //}

            var InvoiceMemo = $('#txt_InvoiceMemo').val();

            var SubtotalInvoice = replaceAll($('#txt_SubtotalInvoice').val().replace(',', ''), ',', '');
            SubtotalInvoice = Math.round((SubtotalInvoice * 100)) / 100;
            var TotalTax1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var TotalTax2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var TotalTax3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            var TotalInvoice = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            var TotalInvoiceor = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            //TotalInvoice = parseFloat(TotalInvoice / FxRate);
            TotalInvoice = Math.round((TotalInvoice * 100)) / 100;

            if (parseFloat(TotalInvoiceAmount) != parseFloat(TotalInvoiceor)) {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val().trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Invoice totals does not match.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Invoice total does not match with each other.');
                return;

            }

            var Exrate = replaceAll($('#exchngrate').val(), ',', '');
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            let fd = {
                InvoiceNumberVendor: InvoiceNumber,
                InvoiceDate: InvoiceDate,
                InvoiceAmount: TotalInvoiceAmount,
                Terms: Terms,
                Memo: InvoiceMemo,
                ProjectAccount: projectAccount,
                Subtotal: SubtotalInvoice,
                VendorId: BigInt(vendorId),
                Tax1: parseFloat(TotalTax1),
                Tax2: parseFloat(TotalTax2),
                Tax3: parseFloat(TotalTax3),
                TotalInvoice: parseFloat(TotalInvoice),
                Exrate: parseFloat(Exrate),
                POID: POID.replace(',', '^'),
                ProjectId: projectId,

            };
            //ajax call
            $.ajax({
                url: "/Invoice/SaveInvoice",
                type: "POST",
                dataType: "JSON",
                data: fd,
                async: false,
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        isDirty = false;
                        var InvoiceItems = new Array();
                        var InvoiceID = data.Result.invoiceID;
                        $('#invoice_items tbody tr').each(function () {

                            var Percentage = $(this).find('td').eq(0).find('.percentChange').val()?.replace(',', '');
                            Percentage = isNaN(parseFloat(Percentage)) ? 0 : parseFloat(Percentage);

                            var PONumber = $(this).find('td').eq(1).text();
                            var ItemNumber = $(this).find('td').eq(2).text();
                            var Spec = $(this).find('td').eq(12).text();
                            var Description = $(this).find('td').eq(3).html();
                            //var Note = $(this).find('td').eq(6).find('input[type="text"]').val();
                            var Qty = $(this).find('td').eq(4).find('input[type="text"]').val().replace(',', '');
                            Qty = isNaN(parseFloat(Qty)) ? 0 : parseFloat(Qty);

                            var Amount = $(this).find('td').eq(5).find('input').val().replace(',', '');
                            Amount = isNaN(parseFloat(Amount)) ? 0 : parseFloat(Amount);
                            var Tax1 = $(this).find('td').eq(8).find('input[type="text"]').val()?.replace(',', '');
                            Tax1 = isNaN(parseFloat(Tax1)) ? 0 : parseFloat(Tax1);

                            var Tax2 = $(this).find('td').eq(9).find('input[type="text"]').val()?.replace(',', '');
                            Tax2 = isNaN(parseFloat(Tax2)) ? 0 : parseFloat(Tax2);


                            var Tax3 = $(this).find('td').eq(10).find('input[type="text"]').val()?.replace(',', '');
                            Tax3 = isNaN(parseFloat(Tax3)) ? 0 : parseFloat(Tax3);


                            var Taxes = parseFloat(Tax1) + parseFloat(Tax2) + parseFloat(Tax3);

                            Taxes = parseFloat(Taxes).toFixed(2);

                            var LineItemTotal = $(this).find('td').eq(7).text().replace(',', '');

                            LineItemTotal = Math.round((LineItemTotal * 100)) / 100;
                            var ProjectAccount = $(this).find('td').eq(11).find('select').val();
                            var POLineItemID = $(this).attr('data-poli');

                            InvoiceItems.push({
                                PurchaseOrderNumber: PONumber,
                                POLineItemID: POLineItemID,
                                POLineItemNumber: ItemNumber,
                                Percent: Percentage,
                                Spec: Spec,
                                Description: Description,
                                Note: "",
                                Quantity: Qty,
                                Amount: Amount,
                                Tax1: Tax1,
                                Tax2: Tax2,
                                Tax3: Tax3,
                                Tax: Taxes,
                                LineItemTotal: LineItemTotal,
                                ProjectAccount: ProjectAccount,
                                InvoiceID: Number(InvoiceID),
                            });

                        });

                        $.ajax({
                            url: "/Invoice/SaveInvoiceItems",
                            type: "POST",
                            data: JSON.stringify(InvoiceItems),
                            dataType: "JSON",
                            contentType: 'application/json',
                            success: function (data) {
                                if (data.IsSuccess) {
                                    $.notify.success('Success', data.Result);
                                    //POSeletor();
                                    //ItemSelectortbl("");
                                    //getInvoiceLineItems("");
                                    //$("input").val("");
                                    //$('#txt_InvoiceDate').datepicker("setDate", date);
                                    //$('#txt_SubtotalInvoice').val(0);
                                    //$('#txt_TotalTax1').val(0);
                                    //$('#txt_TotalTax2').val(0);
                                    //$('#txt_TotalTax3').val(0);
                                    //$('#txt_TotalInvoice').val(0);

                                    window.setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);

                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);

                                }
                                $(".loader").css("display", "none");
                            }

                        })
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                    $(".loader").css("display", "none");
                }

            });
        });

        function precise_round(num, dec) {

            if ((typeof num !== 'number') || (typeof dec !== 'number'))
                return false;

            var num_sign = num >= 0 ? 1 : -1;

            return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
        }

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        $(document).on('click', '#increaseval', function () {
            ChangeItemadjust('+');

        });

        $(document).on('click', '#decreaseval', function () {

            ChangeItemadjust('-');
        });

        function ChangeItemadjust(op) {

            var percent, qty, amnt, total, step, totalshow, newp, newtotal, remaining;
            $('.selectedrow').each(function () {
                remaining = parseFloat($(this).attr('data-remaining'));
                qty = replaceAll($(this).find('td:eq(4) input').val(), ',', '');
                amnt = replaceAll($(this).find('td:eq(5) input').val(), ',', '');
                percent = replaceAll($(this).find('td:eq(0) input').val(), ',', '');
                total = parseFloat(qty) * parseFloat(amnt) * parseFloat(percent) / 100;
                totalshow = replaceAll($(this).find('td:eq(7)').html(), ',', '');
                totalshow = parseFloat(totalshow);

                if (op == '+') {
                    newtotal = totalshow + 1 / 100;
                    totalshow = totalshow + 1 / 100;
                }

                else {
                    newtotal = totalshow - 1 / 100;
                    totalshow = totalshow - 1 / 100;

                }
                newp = 100 * newtotal / (parseFloat(qty) * parseFloat(amnt));
                if (remaining < totalshow) {
                    $.notify.warning('Caution', 'Can not exceed remaining!');
                    return;
                }
                $(this).find('td:eq(0) input').val(newp);
                $(this).find('td:eq(0) input').trigger('keyup');

            });
        }

        $(document).on('change', '#percentage', function () {
            var val = $(this).val()?.trim();
            var maxVal = $(this).attr('data-maxval');
            if (val == "" || val == null || val == " ") {
                $(this).val(maxVal);
                return;
            }
            parseFloat(val) > parseFloat(maxVal) ? $(this).val(maxVal) : $(this).val(val);
        })

        $(document).on('keyup', '.setQty', function () {

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val();
                    var qty = $(rw).find('td:eq(4) input').val();

                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var vl = cost * qty * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';

                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1Val');
                    Taxtype = $(this).attr('data-tax1type');

                    //CalculateTaxes() function logic from the old solution start
                    if (Taxtype == "%") {
                        tottax1 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax1 = TaxVal;
                    }
                    tottax1 = isNaN(tottax1) ? 0 : tottax1;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2Val');
                    Taxtype = $(this).attr('data-tax2type');

                    if (Taxtype == "%") {
                        tottax2 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax2 = TaxVal;
                    }
                    tottax2 = isNaN(tottax2) ? 0 : tottax2;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3Val');
                    Taxtype = $(this).attr('data-tax3type');

                    if (Taxtype == "%") {
                        tottax3 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax3 = TaxVal;
                    }
                    tottax3 = isNaN(tottax3) ? 0 : tottax3;

                    $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                });
            }


            SyncAll();
        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calculatefortaxfields();
        });
        function calculatefortaxfields() {
            var st = replaceAll($('#txt_SubtotalInvoice').val(), ',', '');
            var t1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }

            var tot = parseFloat(st) + parseFloat(t1) + parseFloat(t2) + parseFloat(t3);

            $('#txt_TotalInvoice').val(formatNumber(tot));
        }
    }
    // #endregion

    // #region :: Invoice Entry Without Item
    if (action_name === "invoiceentry_tax") {

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        var date = new Date();

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        $('#txt_InvoiceDate').datepicker("setDate", date);

        $(document).on('click', '.icon-close', function () {
            let $dropdown = $(this).closest('.ms-parent').prev('select');
            let firstOption = $dropdown.find('option:first').val();
            $dropdown.multipleSelect('setSelects', [firstOption]);

        });

        $(document).on('change', '#Ddl_Vendors', async function () {

            if ($(this).find('option:selected').val() == "0" || $(this).find('option:selected').val() == null) {

                await ProjectList();
                return;
            }

            await ProjectList();
            await VendorTerms_Tax();

        });

        ProjectList();
        ProjectAccount();
        async function ProjectList() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined) {
                //$('#ddl_project').empty();
                $('#project_tax').html('');

                $('#project_tax').html('<select multiple="multiple" class="multislct" data-width="100%" id="ddl_project"><option value="0">--Select Project--</option></select>');

                $('#ddl_project').multipleSelect({
                    filter: true,
                    showClear: false,
                    placeholder: 'Please Select',
                    filterPlaceholder: 'Enter Keyword',
                    single: true,
                });

                let firstOption = $('#ddl_project').find('option:first').val();
                $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                return;
            }

            await $.ajax({
                url: "/Invoice/ProjectListonVendorDDChange",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "HTML",
                success: function (data) {
                    if (data != "") {
                        $('#project_tax').html('');
                        $('#project_tax').html(data);

                        $('#ddl_project').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',
                            single: true,

                        });

                        let firstOption = $('#ddl_project').find('option:first').val();
                        $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });

        }

        $(document).on('change', '#ddl_project', async function () {
            try {
                $(".loader").css("display", "flex");
                await tblPOselectorfn();
                await ProjectAccount();
            }
            catch (error) {
                console.error(error);
            }
            finally {
                $(".loader").css("display", "none");
            }

        });

        async function tblPOselectorfn() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();

            await $.ajax({
                url: "/Invoice/GetPoselector_Tax",
                type: "GET",
                data: { VendorId: vendorId, ProjectId: projectId },
                dataType: "HTML",
                success: function (data) {
                    if (data != "") {
                        $('#poselector_Tax').html('');
                        $('#poselector_Tax').html(data);

                        POSelectorDatatable();
                        ProjectConvRate_Tax();
                    }
                    else {
                        $('#poselector_Tax').html('');
                    }


                }
            })


        }

        tblPOselectorfn();
        function POSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#po_selector_Tax")) {
                $('#po_selector_Tax').DataTable().clear().destroy();
            }

            //$("#po_selector_Tax thead tr")
            //    .clone(true)
            //    .addClass("filters")
            //    .appendTo("#po_selector_Tax thead");

            var table = $("#po_selector_Tax").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                pageLength: 50,
                orderCellsTop: true,

                //scrollX: true,
                "order": [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },

                    { "targets": [5, 6, 7, 8], "className": "d-none" }

                ],

                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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

                        $('#po_selector_Tax tbody').empty();
                        $('#po_selector_Tax tbody').html(
                            '<tr><td colspan="6" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }
        function ProjectConvRate_Tax() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];
            if ($('#po_selector_Tax tbody').find('tr').eq(0).find('td').length > 1) {

                $("#po_selector_Tax tbody tr").each(function () {

                    var remaining = $(this).find("td:eq(4)").text()?.trim();
                    var poid = $(this).attr('data-poid');
                    var cr = $(this).find("td:eq(8)").text()?.trim();

                    var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                    var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                    if (poid != "" && poid != null && poid != undefined) {

                        remainingValues.push(
                            {
                                Remaining: parseFloat(remaining),
                                POIDs: parseInt(poid),
                                ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                            }
                        );
                    }

                });

                if (remainingValues.length == 0) return;

                $.ajax({
                    url: "/Invoice/ConversionrateForProject_Tax",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(remainingValues),
                    dataType: "json",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },

                    success: function (data) {
                        if (data.IsSuccess) {
                            var totalafterconv = data.Result.totalAfterConvert;
                            var totalbeforeconv = data.Result.totalBeforeConvert;
                            $('#exchngrate').val('');
                            $('#exchngrate').val(formatNumber(parseFloat(isNaN(totalafterconv / totalbeforeconv) ? 1.0000 : totalafterconv / totalbeforeconv)));
                            $(".loader").css("display", "none");

                        }
                        else {
                            //notify(false, data.ErrorMessages, true);
                            $('#exchngrate').val('');
                            $(".loader").css("display", "none");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error: " + error);
                        $(".loader").css("display", "none");

                    }

                });

            }

        }
        function VendorTerms_Tax() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined)
                return;

            $.ajax({
                url: "/Invoice/Vendorterms",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "JSON",
                //async: false,
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#ddl_terms").val(data.Result).change();
                        if ($("#ddl_terms").val() == null) {

                            $('#ddl_terms').val($('#ddl_terms option:first').val());
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }


                },

            });

        }
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
        async function ProjectAccount() {

            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                //$('#bnkbalance').html('No Such Account In QBO');
                return;
            }

            await $.ajax({
                url: "/Invoice/ProjectAccount",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",
                success: async function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.description}</option>`);
                        }
                        let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        let formData = {
                            accountId: accountNumber
                        };

                        $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                        $.ajax({
                            url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                            data: formData,
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (data) {
                                if (data.IsSuccess) {
                                    if (data.Result != "INVALID") {
                                        $('#bnkbalance').html(data.Result);
                                    }
                                    else {
                                        $('#bnkbalance').html('No Such Account In QBO');
                                    }
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                    $('#bnkbalance').html('No Such Account In QBO');
                                }
                            }
                        });
                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                        $('#bnkbalance').html('No Such Account In QBO');
                    }


                }
            });
        }

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'JSON',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.error('Error', data.Errors[0]);
                    }
                }
            })           

        });

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";

            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);


        });
        function calculatefortaxfields() {

            //var st = replaceAll($('#txt_SubtotalInvoice').val(), ',', '');
            var t1 = replaceAll($('#txt_TotalTax1').val() ?? 0, ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val() ?? 0, ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val() ?? 0, ',', '');


            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }

            var tot = parseFloat(t1) + parseFloat(t2) + parseFloat(t3);
            $('#txt_TotalInvoice').val('');

            $('#txt_TotalInvoice').val(formatNumber(tot));
        }

        $(document).on('keyup', '#txt_TotalTax1,#txt_TotalTax2,#txt_TotalTax3', function () {
            calculatefortaxfields();
        });

        $(document).on('keyup', '#exchngrate', function () {
            $(this).removeAttr('data-edited');
            $(this).attr('data-edited', "Y");
        });

        $(document).on('click', '#btn_Save', function () {

            var goAhead = true;

            //$('#invoice_items tbody tr').each(function () {
            //	var ProjectAccount = $(this).find('td').eq(11).find('select').val();
            //	if (ProjectAccount == "0") {
            //		notify(false, "Row number " + ($(this).index() + 1) + " Does not have any Project account associated.", false);
            //		goAhead = false;
            //		return;
            //	}
            //});

            if (!goAhead) return;

            //if ($('#invoice_items tbody').find('tr').eq(0).find('td').length <= 1) {
            //	notify(false, 'Please Add items in Invoice first', false);
            //	return;
            //}

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var POID = $('#hdn_poid').val();

            var tmp = true;
            var i = 0;
            var probrow = 0;



            if (probrow != "0") {
                $.notify.warning('Caution', 'Row number ' + (probrow) + ' is exceeding total remaining value.');
            }

            if (!tmp) return;

            var projectId = $('#ddl_project').val()?.toString();

            //validation start

            if (vendorId == "0" || vendorId == null) {
                $.notify.warning('Caution', 'Please Select Vendors.');
                return;
            }

            if (POID == "" || POID == null) {
                $.notify.warning('Caution', 'Please Select POs.');
                return;
            }

            if ($('#txt_InvoiceNumber').val() != '' || $('#txt_InvoiceNumber').val() != null) {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the InvoiceNumber in correct format');
                    return false;

                }

            }

            if ($('#txt_InvoiceDate').val()?.trim() == '') {
                $('#' + "txt_InvoiceDate").val($('#' + 'txt_InvoiceDate').val()?.trim());
                $('#' + 'txt_InvoiceDate').attr('placeholder', 'Please insert Invoice Date.');
                $('#' + 'txt_InvoiceDate').effect("shake", { times: 2 }, 700);
                $('#' + 'txt_InvoiceDate').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date.');

                return;
            }

            var InvoiceDate = $('#txt_InvoiceDate').val();

            if ($('#ddl_terms').val()?.trim() == '' || $('#ddl_terms').val()?.trim() == '0' || $('#ddl_terms').val() == null) {
                $('#ddl_terms').val($('#' + 'ddl_terms').val().trim());
                $('#ddl_terms').attr('placeholder', 'Please Select Terms.');
                $('#ddl_terms').effect("shake", { times: 2 }, 700);
                $('#ddl_terms').trigger('focus');;
                $.notify.warning('Caution', 'Please Select Terms.');
                return;
            }

            var Terms = $('#ddl_terms').val();
            if ($('#Ddl_ProjectAccount').val() == '0') {
                $('#Ddl_ProjectAccount').val($('#' + 'Ddl_ProjectAccount').val()?.trim());
                $('#Ddl_ProjectAccount').attr('placeholder', 'Please Select Project Account.');
                $('#Ddl_ProjectAccount').effect("shake", { times: 2 }, 700);
                $('#Ddl_ProjectAccount').trigger('focus');
                $.notify.warning('Caution', 'Please Select Project Account.');

                return;
            }
            var projectAccount = $('#Ddl_ProjectAccount').val();
            if ($('#exchngrate').val() == '' || !$('#exchngrate').val()) {;
                $.notify.warning('Caution', 'Please Add FX Rate in Invoice first');
                return;
            }

            if ($('#txt_InvoiceNumber').val()?.trim() == '') {
                $('#txt_InvoiceNumber').val($('#' + 'txt_InvoiceNumber').val()?.trim());
                $('#txt_InvoiceNumber').attr('placeholder', 'Please enter Invoice Number.');
                $('#txt_InvoiceNumber').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceNumber').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Number.');

                return;
            }

            var InvoiceNumber = escape($('#txt_InvoiceNumber').val().trim());

            if ($('#txt_TotalInvoiceAmount').val()?.replace(',', '').trim() == '0' || $('#txt_TotalInvoiceAmount').val().replace(',', '').trim() == '') {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val()?.trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Please enter Total Invoice Amount.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Please enter Total Invoice Amount.');

                return;
            }

            var TotalInvoiceAmount = replaceAll($('#txt_TotalInvoiceAmount').val().replace(',', ''), ',', '');

            //if ($('#txt_InvoiceMemo').val()?.trim() == '0') {
            //		$('#txt_InvoiceMemo').val($('#' + 'txt_InvoiceMemo').val()?.trim());
            //		$('#txt_InvoiceMemo').attr('placeholder', 'Please enter Invoice Memo.');
            //		$('#txt_InvoiceMemo').effect("shake", { times: 2 }, 700);
            //		$('#txt_InvoiceMemo').focus();
            //		notify(false, 'Please enter Invoice Memo.', false);

            //		return;
            //}
            var InvoiceMemo = $('#txt_InvoiceMemo').val();

            //var SubtotalInvoice = replaceAll($('#txt_SubtotalInvoice').val().replace(',', ''), ',', '');
            //SubtotalInvoice = Math.round((SubtotalInvoice * 100)) / 100;
            var TotalTax1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var TotalTax2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var TotalTax3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            var TotalInvoice = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            var TotalInvoiceor = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            //TotalInvoice = parseFloat(TotalInvoice / FxRate);
            TotalInvoice = Math.round((TotalInvoice * 100)) / 100;

            if (parseFloat(TotalInvoiceAmount) != parseFloat(TotalInvoiceor)) {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val().trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Invoice totals does not match.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');

                $.notify.warning('Caution', "Total and Total Invoice amount doesn't matched.");
                return;

            }

            var Exrate = replaceAll($('#exchngrate').val(), ',', '');


            let fd = {
                InvoiceNumberVendor: InvoiceNumber,
                InvoiceDate: InvoiceDate,
                InvoiceAmount: TotalInvoiceAmount,
                Terms: Terms,
                Memo: InvoiceMemo,
                ProjectAccount: projectAccount,
                Subtotal: 0,
                VendorId: parseInt(vendorId),
                Tax1: parseFloat(TotalTax1),
                Tax2: parseFloat(TotalTax2),
                Tax3: parseFloat(TotalTax3),
                TotalInvoice: TotalInvoice,
                Exrate: parseFloat(Exrate),
                POID: POID.replace(',', '^'),
                ProjectId: projectId,

            };
            //ajax call
            $.ajax({
                url: "/Invoice/SaveInvoice_Tax",
                type: "POST",
                dataType: "JSON",
                data: fd,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        //var InvoiceItems = new Array();
                        //var InvoiceID = data.Result.invoiceId;
                        $.notify.success('Success', 'Saved invoice.');
                        window.setTimeout(() => {

                            window.location.reload();
                        }, 3000);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);

                    }

                    $(".loader").css("display", "none");
                }

            });
        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty.');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);

                    }
                    $(".loader").css("display", "none");
                }
            })


        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });
    }
    // #endregion

    //#region :: Credit Note Entry
    if (action_name === "creditnoteentry") {
        let isDirty = false;
        let initialData = $('#credit_note_entry_form').serialize();

        $(document).on('change keyup', '#credit_note_entry_form input, #credit_note_entry_form select, #credit_note_entry_form textarea', function () {
            let currentData = $('#credit_note_entry_form').serialize();
            isDirty = (initialData !== currentData);
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        document.onkeydown = function (e) {
            //var keyPressed = e.keyCode;
            if (e.key === "Shift") {

                $('html').css({
                    '-moz-user-select': '-moz-none',
                    '-moz-user-select': 'none',
                    '-o-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                }); //or you could pass these css rules into a class and add that class to html instead

                document.onkeyup = function () {
                    //here you remove css rules that disable text selection
                }
            }
        }

        var date = new Date();

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        $('#txt_InvoiceDate').datepicker("setDate", date);

        //function call on page load.

        ProjectDDinCN();
        POSelectorInCN();
        POItemSelectorinCN("");
        getInvoiceLineItemsinCN("");

        $(document).on('change', '#Ddl_Vendors', async function () {

            try {
                $('.loader').css('display', 'flex');
                if ($(this).find('option:selected').val() == "0" || $(this).find('option:selected').val() == null) {

                    await ProjectDDinCN();

                    await POItemSelectorinCN("");
                    await getInvoiceLineItemsinCN("");
                    return;
                }
                await ProjectDDinCN();
            }
            catch (err) {
                console.error("An error occurred:", err);
                $('.loader').css('display', 'none');
            }

        });

        $(document).on('change', '#ddl_project', async function () {

            try {
                $('.loader').css('display', 'flex');
                await ProjectAccountinCN();
                await POSelectorInCN();
            } catch (err) {
                console.error("An error occurred:", err);
            } finally {
                $('.loader').css('display', 'none');
            }

        });

        async function ProjectDDinCN() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            if (vendorId == "0" || vendorId == null || vendorId == undefined) {
                //$('#ddl_project').empty();
                $('#plbind').html('');

                $('#plbind').html('<select multiple="multiple" class="multislct" data-width="100%" id="ddl_project"><option value="0">--Select Project--</option></select>');

                $('#ddl_project').multipleSelect({
                    filter: true,
                    showClear: false,
                    placeholder: 'Please Select',
                    filterPlaceholder: 'Enter Keyword',
                    single: true,
                });

                let firstOption = $('#ddl_project').find('option:first').val();
                $('#ddl_project').multipleSelect('setSelects', [firstOption]);

                return;
            }
            await $.ajax({
                url: "/Invoice/ProjectDDinCN",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "HTML",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {
                    if (data != "") {
                        $('#plbind').html('');
                        $('#plbind').html(data);

                        $('#ddl_project').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',
                            single: true,

                        });

                        let firstOption = $('#ddl_project').find('option:first').val();
                        $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    //$(".loader").css("display", "none");

                }
            });

        }
        async function ProjectAccountinCN() {

            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                //$('#bnkbalance').html('No Such Account In QBO');
                return;
            }

            await $.ajax({
                url: "/Invoice/ProjectAccountinCN",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option  value="${item.fldId}" >${item.anumber}</option>`);
                        }
                        //let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        //const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
                        //let formData = {
                        //	accountId: accountNumber
                        //};

                        //globalAjax(url, 'GET', formData, 'text', true, true, true, false)
                        //	.then(function (data) {
                        //		//console.log(data);
                        //		if (data.IsSuccess) {
                        //			if (data.Result != "INVALID") {

                        //				$('#bnkbalance').html(data.Result);
                        //			}
                        //			else {
                        //				$('#bnkbalance').html('No Such Account In QBO');
                        //			}
                        //		}
                        //		else {
                        //			//console.log(data);
                        //			notify(false, data.Errors[0], true);

                        //		}
                        //		$(".loader").css("display", "none");
                        //	}).fail(function (err) {
                        //		$(".loader").css("display", "none");
                        //		console.error(err);
                        //	});

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);

                        //$('#bnkbalance').html('No Such Account In QBO');
                    }
                    //$(".loader").css("display", "none");

                }
            });
        }

        async function POSelectorInCN() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();

            await $.ajax({
                url: "/Invoice/POSelectorinCN",
                type: "GET",
                data: { VendorId: vendorId, ProjectId: projectId },
                dataType: "HTML",
                //async: false,
                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {
                    if (data != "") {
                        $('#poselectorincnbind').html('');
                        $('#poselectorincnbind').html(data);
                        POSelectorDatatableInCN();
                        //POSelectorDatatable();
                        //ProjectConvRate_Tax();
                    }
                    else {
                        $('#poselectorincnbind').html('');
                    }
                    //$(".loader").css("display", "none");

                }
            })
        }
        function POSelectorDatatableInCN() {

            if ($.fn.DataTable.isDataTable("#po_selector")) {
                $('#po_selector').DataTable().clear().destroy();
            }

            //$("#po_selector thead tr")
            //    .clone(true)
            //    .addClass("filters")
            //    .appendTo("#po_selector thead");

            var table = $("#po_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "paging": false,
                orderCellsTop: true,

                //scrollX: true,
                "order": [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },



                ],

                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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

                        $('#po_selector tbody').empty();
                        $('#po_selector tbody').html(
                            '<tr><td colspan="5" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";
            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);
            //item selector table.
            POItemSelectorinCN(poids);
        });
        async function POItemSelectorinCN(poids) {

            if (poids == "") {
                $('#poitemselectorcn').html('');
                var html = `
						<table id="item_selector" class="table table-striped table-hover item_selector_table" style="width:100%">
							<thead>
								<tr>
									<th style="width: 20%">PO#</th>
									<th style="width: 20%">Item #</th>
									<th style="width: 40%;">Description</th>
									<th style="width: 20%;">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colspan="6" class="text-center">No data available </td>
								</tr>
							</tbody>
						</table>
						`;

                $('#poitemselectorcn').html(html);
                $('.dt-search').css("display", "none");

                return;

            }

            await $.ajax({
                url: "/Invoice/POItemsinCN",
                type: "GET",
                data: { poids: poids },
                dataType: "HTML",
                success: function (data) {
                    if (data != "") {
                        $('#poitemselectorcn').html('');
                        $('#poitemselectorcn').html(data);
                        POItemSelectorDatatable();
                        convRate();
                        //getInvoiceLineItemsinCN("");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                    $(".loader").css("display", "none");

                }

            });
        }
        function POItemSelectorDatatable() {
            if ($.fn.DataTable.isDataTable("#item_selector")) {
                $('#item_selector').DataTable().clear().destroy();
            }

            var table = $("#item_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },
                    { "targets": [5], "className": "d-none" }

                ],
                "order": [[1, "asc"]],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();

                    $('.dt-search').css("display", "none");

                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#item_selector tbody').html(
                            '<tr><td colspan="6" class="empty_cell">No data available</td></tr>'
                        );
                    }
                    $('.dt-search').css("display", "none");

                }


            });
        }
        function convRate() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];

            $("#item_selector tbody tr").each(function () {
                var remaining = $(this).find("td:eq(3)").text()?.trim();
                var poid = $(this).data('poliid'); //polineitemid for convRate of Item Selector table
                var cr = $(this).find("td:eq(5)").text()?.trim();

                var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                if (poid != "" && poid != null && poid != undefined) {

                    remainingValues.push(
                        {
                            Remaining: parseFloat(remaining),
                            POIDs: parseInt(poid),
                            ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                        }
                    );
                }


            });

            if (remainingValues.length == 0) return;

            $.ajax({
                url: "/Invoice/ConversionrateForProject",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(remainingValues),
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data.IsSuccess) {
                        var totalafterconv = data.Result.totalAfterConvert;
                        var totalbeforeconv = data.Result.totalBeforeConvert;
                        $('#exchngrate').val('');
                        $('#exchngrate').val(formatNumber(parseFloat(totalafterconv / totalbeforeconv)));
                        $(".loader").css("display", "none");

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#exchngrate').val('');
                        $(".loader").css("display", "none");
                    }
                }

            });
        }

        $(document).on('click', '#item_selector tbody tr', function (event) {

            if ($(event.target).closest('a').length) {
                return;
            }

            //if ($(event.target).closest('.getotherinvoice').length) {
            //	return;
            //}
            if ($(this).find('td').length <= 1) return;

            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#item_selector tbody tr').not(':hidden');
            if (event.ctrlKey) {
                //rows.removeClass('selected');
                currentRow.toggleClass('selected');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selected').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selected');

                } else {
                    currentRow.addClass('selected');
                }

            }
            else {
                var ln = $('.selected').length;
                var hclass = false;
                hclass = $(this).hasClass('selected');

                $('.selected').each(function () {
                    $(this).removeClass('selected');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selected');
                }
                else if (ln == 1) {
                    $(this).removeClass('selected');
                }


            }

            $('.selected').each(function () {
                const poliid = $(this).data('poliid');
                if (poliid) {
                    polids += (polids ? "," : "") + poliid;
                }
            });

            //console.log(polids)
        });

        $(document).on('click', '#singleSelect', function () {

            var poidall = "";
            $(document).find('.noselect').each(function () {
                if ($(this).length > 0) {

                    let poid = $(this).data('poliid');
                    if (poid != undefined) {

                        poidall += poidall == "" ? poid : "," + poid;
                    }
                }



            });

            $(document).find('.selected').each(function () {
                //if ($(this).hasClass('selected') && !$(this).hasClass('noselect'))
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('noselect');
                }

                let poid = $(this).data('poliid');
                if (poid != undefined) {

                    poidall += poidall == "" ? poid : "^" + poid;
                }

            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            //getInvoiceLineItems(poidall);
            getInvoiceLineItemsinCN(poidall);

        });

        $(document).on('click', '#selectall', function () {

            let poidall = "";
            $('#item_selector tbody tr').each(function () {
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('noselect');
                    //let poli = $(this).attr('data-poli');
                    let poli = $(this).data('poliid');
                    if (poli != undefined) {

                        poidall += poidall == "" ? poli : "^" + poli;
                    }
                    //poidall += poidall == "" ? poid : "," + poid;
                }
            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            getInvoiceLineItemsinCN(poidall);

        });

        $(document).on('click', '#unselectAll', function () {
            $('#invoice_items tbody tr').each(function () {
                $(this).remove();

            });

            $('#item_selector tbody tr').each(function () {
                $(this).removeClass('noselect');
                $(this).removeClass('selected');
            });

            $('#invoice_items tbody').append('<tr><td colspan="4" class="text-center">No data available</td></tr>');

            //SyncAll();

        });
        async function getInvoiceLineItemsinCN(poids) {

            if (poids == "" || poids == undefined || poids == null) {

                var html = `<table id="invoice_items" class="table table-striped table-hover invoice_items_table" style="width:100%">
							<thead>
								<tr>
									
									<th>PO#</th>
									<th>Item #</th>
									<th>Description</th>
									<th>Amount</th>
									
								</tr>
							</thead>

							<tbody>
								<tr>
								   <td colspan="4" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invoiceitemdetialscn').html('');
                $('#invoiceitemdetialscn').html(html);
                $('#txt_TotalTax1').val('');
                $('#txt_TotalTax2').val('');
                $('#txt_TotalTax3').val('');
                $('#txt_SubtotalInvoice').val('');
                $('#txt_TotalInvoice').val('');
                return;
            }

            $.ajax({
                url: "/Invoice/GetInvIteminCN",
                data: { POLIIDS: poids },
                dataType: "HTML",
                success: function (data) {
                    if (data != "") {

                        $('#invoiceitemdetialscn').html('');
                        $('#invoiceitemdetialscn').html(data);
                        calculatetaxes();
                        //calCulateOtherFields();
                        //SyncAll();
                        //convRate();

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');

                    }
                }


            });

        }
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

        $(document).on('click', '#invoice_items tbody tr ', function (event) {

            if ($(event.target).closest('tr').hasClass('theader')) {
                return;
            }

            // Ignore clicks on rows without .selectable class
            if (!$(event.target).hasClass('selectable')) {
                return;
            }
            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#invoice_items tbody tr').not(':hidden');
            if (event.ctrlKey) {
                currentRow.toggleClass('selectedrow');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selectedrow').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selectedrow');

                } else {

                    currentRow.addClass('selectedrow');
                }

            }
            else {

                //rows.removeClass('selectedrow');
                //currentRow.toggleClass('selectedrow');
                var ln = $('.selectedrow').length;
                var hclass = false;
                hclass = $(this).hasClass('selectedrow');

                $('.selectedrow').each(function () {
                    $(this).removeClass('selectedrow');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selectedrow');
                }
                else if (ln == 1) {
                    $(this).removeClass('selectedrow');
                }
            }

            var selectedrows = parseInt($('.selectedrow').length);
            //if (selectedrows > 0) {
            //	$('#adjustbtn').removeClass('d-none');
            //}
            //else {
            //	$('#adjustbtn').addClass('d-none');
            //}

        });

        $(document).on('click', '#unselectSelected', function () {

            $('.selectedrow').each(function () {
                $(this).remove();
                var poitemidinvoice = $(this).attr('data-poli');

                $('#item_selector tbody tr').each(function () {
                    var poitemidselector = $(this).data('poliid');
                    if (poitemidselector == poitemidinvoice) { $(this).removeClass('noselect'); $(this).removeClass('selected') }
                });

            });

            if ($('#invoice_items tbody tr').length === 0) {
                $('#invoice_items tbody').append('<tr><td colspan="4" class="text-center">No data available</td></tr>');
            }

        });
        function calculatetaxes() {

            var tottax = 0;
            var tottax1 = 0;
            var tottax2 = 0;
            var tottax3 = 0;
            var totamount = 0;

            $('#invoice_items tbody tr').each(function () {

                var tax1 = $(this).attr('data-gsthst');
                var tax2 = $(this).attr('data-pst');
                var tax3 = $(this).attr('data-statetax');
                var amount = replaceAll($(this).find('td:eq(3) input').val(), ',', '');

                amount = isNaN(amount) ? 0 : amount;

                totamount += parseFloat(amount);

                if ($(this).attr('data-gsthsttype') == '%') {
                    tax1 = parseFloat(amount) * parseFloat(tax1) / 100;
                }
                if ($(this).attr('data-psttype') == '%') {
                    tax2 = parseFloat(amount) * parseFloat(tax2) / 100;
                }
                if ($(this).attr('data-statetaxtype') == '%') {
                    tax3 = parseFloat(amount) * parseFloat(tax3) / 100;
                }

                tottax1 += parseFloat(tax1);
                tottax2 += parseFloat(tax2);
                tottax3 += parseFloat(tax3);

                tottax += parseFloat(tax1) + parseFloat(tax2) + parseFloat(tax3);

            });

            $('#txt_TotalTax1').val(formatNumber(tottax1));
            $('#txt_TotalTax2').val(formatNumber(tottax2));
            $('#txt_TotalTax3').val(formatNumber(tottax3));
            $('#txt_SubtotalInvoice').val(formatNumber(totamount));
            $('#txt_TotalInvoice').val(formatNumber(tottax1 + tottax2 + tottax3 + totamount));

        }

        $(document).on('click', '#btn_save', function () {

            var invnumber = $('#txt_InvoiceNumber').val();
            var account = $('#Ddl_ProjectAccount').val();

            var memo = $('#txt_InvoiceMemo').val();

            var idate = $('#txt_InvoiceDate').val();
            var InvoiceAmount = $('#txt_SubtotalInvoice').val();
            InvoiceAmount = replaceAll(InvoiceAmount, ',', '');
            var Subtotal = $('#txt_SubtotalInvoice').val();
            Subtotal = replaceAll(Subtotal, ',', '');

            var TotalInvoice = $('#txt_TotalInvoice').val();
            TotalInvoice = replaceAll(TotalInvoice, ',', '');

            var Exrate = '1.00';
            var VendorId = $('#Ddl_Vendors').val();

            var Tax1 = $('#txt_TotalTax1').val();
            Tax1 = replaceAll(Tax1, ',', '');

            var Tax2 = $('#txt_TotalTax2').val();
            Tax2 = replaceAll(Tax2, ',', '');

            var Tax3 = $('#txt_TotalTax3').val();
            Tax3 = replaceAll(Tax3, ',', '');


            if (invnumber == 'CR-') {
                $.notify.warning('Caution', 'Add Credit memo number!');
                return;
            }
            if (account == '0') {
                $.notify.warning('Caution', 'Please select account!');
                return;
            }
            if ($('#txt_InvoiceNumber').val() != '') {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the Credit Note in correct format!');
                    return false;
                }

            }
            var polineitemid = '';
            var podata = [];
            var Amount = 0.00;
            $('#invoice_items tbody tr').each(function () {
                polineitemid += polineitemid == '' ? $(this).attr('data-poli') : '^' + $(this).attr('data-poli');
                podata.push({
                    POLI: $(this).attr('data-poli'),
                    Amount: parseFloat($(this).find('td:eq(3) input').val()?.replace(',', ''))
                });
                //amount += amount == '' ? $(this).find('td:eq(4) input').val() : '^' + $(this).find('td:eq(4) input').val();
                //poid += poid == '' ? $(this).attr('data-poid') : '^' + $(this).attr('data-poid');
                //PurchaseOrderNumber += PurchaseOrderNumber == '' ? $(this).find('td:eq(1)').html() : '^' + $(this).find('td:eq(1)').html();
                //POLineItemNumber += POLineItemNumber == '' ? $(this).find('td:eq(2)').html() : '^' + $(this).find('td:eq(2)').html();
                //Description += Description == '' ? $(this).find('td:eq(3)').html() : '^' + $(this).find('td:eq(3)').html();

            });
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            if (polineitemid == "") {
                $.notify.warning('Caution', 'Please Select Invoice Items!');
                return;

            }

            $.ajax({
                url: "/Invoice/GetItemsDetailsonSave",
                data: JSON.stringify({
                    POLIDS: polineitemid,
                    POLIData: podata
                }),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "HTML",
                async: false,
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    if (data != "") {
                        isDirty = false;
                        $('#itemonsavebind').html('');
                        $('#itemonsavebind').html(data);
                        itemDetailsonSaveDatatable();
                        $('#itemeditpopup').modal('show');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }

            });
        });

        //function itemDetailsonSave(polineitemid) {
        //	if (polineitemid == "" || polineitemid == null) {
        //		return;
        //	}

        //	$.ajax({
        //		url: "/Invoice/GetItemsDetailsonSave",
        //		data: JSON.stringify({
        //			POLIDS: polineitemid,
        //			POLIData: podata
        //		}),
        //		type: "POST",
        //		contentType: "application/json; charset=utf-8",
        //		dataType: "HTML",
        //		async: false,
        //		beforeSend: function () {
        //			$(".loader").css("display", "flex");
        //		},
        //		success: function (data) {
        //			if (data != "") {

        //				$('#itemonsavebind').html('');
        //				$('#itemonsavebind').html(data);

        //				$(".loader").css("display", "none");
        //			}
        //			else {
        //				notify(false, "Something Went Wrong.", false);
        //				$(".loader").css("display", "none");
        //			}
        //		},
        //		error: function (error) {
        //			console.error(error);
        //			$(".loader").css("display", "none");
        //		}

        //	});
        //}

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.success('Success', data.Errors[0]);
                    }
                }
            })           
        });
        function itemDetailsonSaveDatatable() {
            if ($.fn.DataTable.isDataTable("#tblitemeditor")) {
                $('#tblitemeditor').DataTable().clear().destroy();
            }

            var table = $("#tblitemeditor").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },


                ],
                "order": [[1, "asc"]],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();
                    itemeditorbalance();

                    $('#itemeditpopup').modal({
                        backdrop: 'static',
                        keyboard: false
                    });


                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#tblitemeditor tbody').html(
                            '<tr><td colspan="8" class="empty_cell">No data available</td></tr>'
                        );
                    }


                }

            });
        }
        function itemeditorbalance() {

            $('#tblitemeditor tbody tr').each(function () {

                var cost = replaceAll($(this).find('td:eq(3) input').val(), ',', '');
                var qty = replaceAll($(this).find('td:eq(4) input').val(), ',', '');

                var extcst = $(this).find('td:eq(5)').attr('data-ext');
                var camt = replaceAll($(this).find('td:eq(6)').html(), ',', '');



                var amount = parseFloat(cost) * parseFloat(qty);

                $(this).find('td:eq(5)').html(formatNumber(amount));
                $(this).find('td:eq(7)').html(formatNumber(camt - (parseFloat(extcst) - parseFloat(amount))));

                if (parseFloat($(this).find('td:eq(7)').html()) == 0) {
                    $(this).addClass('matched');
                    $(this).removeClass('notmatched');
                }
                else {
                    $(this).removeClass('matched');
                    $(this).addClass('notmatched');

                }

            });
        }

        $(document).on('keyup', '.costchange,.qtychange', function () {
            itemeditorbalance();
        });

        //$(document).on('keyup', '.qtychange', function () {
        //	itemeditorbalance();
        //});


        $(document).on('click', '#save_btnitem_cm', handleSaveCreditNoteClick);

        async function handleSaveCreditNoteClick() {

            if ($('.notmatched').length > 0) {
                showNotMatchedConfirm();
                return;
            }

            await saveInvoiceCN();
        }

        function showNotMatchedConfirm() {
            $.confirm({
                title: 'Warning',
                message: 'There are items which are not adjusted as per the Credit Memo. Do you want to continue?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: async function () {
                    await saveInvoiceCN();
                }
            });
        }

        async function saveInvoiceCN() {

            var account = $('#Ddl_ProjectAccount').val();
            var invnumber = $('#txt_InvoiceNumber').val();
            var memo = $('#txt_InvoiceMemo').val();

            var idate = $('#txt_InvoiceDate').val();
            var InvoiceAmount = $('#txt_SubtotalInvoice').val();
            InvoiceAmount = replaceAll(InvoiceAmount, ',', '');
            var Subtotal = $('#txt_SubtotalInvoice').val();
            Subtotal = replaceAll(Subtotal, ',', '');

            var TotalInvoice = $('#txt_TotalInvoice').val();
            TotalInvoice = replaceAll(TotalInvoice, ',', '');

            var Exrate = $('#exchngrate').val();
            var VendorId = $('#Ddl_Vendors').val().toString();


            var Tax1 = $('#txt_TotalTax1').val();
            Tax1 = replaceAll(Tax1, ',', '');

            var Tax2 = $('#txt_TotalTax2').val();
            Tax2 = replaceAll(Tax2, ',', '');

            var Tax3 = $('#txt_TotalTax3').val();
            Tax3 = replaceAll(Tax3, ',', '');



            if (invnumber == 'CR-') {
                $.notify.warning('Caution', 'Add Credit memo number"!');
                return;
            }

            var poid = '';
            $('#invoice_items tbody tr').each(function () {
                poid += poid == '' ? $(this).attr('data-poid') : '^' + $(this).attr('data-poid');
            });

            let fd = {
                InvoiceNumberVendor: invnumber,
                InvoiceDate: idate,
                InvoiceAmount: 0 - parseFloat(InvoiceAmount),
                Terms: null,
                Memo: memo,
                ProjectAccount: account,
                Subtotal: 0 - parseFloat(Subtotal),
                VendorId: parseInt(VendorId),
                Tax1: 0 - parseFloat(Tax1),
                Tax2: 0 - parseFloat(Tax2),
                Tax3: 0 - parseFloat(Tax3),
                TotalInvoice: 0 - parseFloat(TotalInvoice),
                Exrate: parseFloat(Exrate),
                POID: poid,

            };
            try {
                $(".loader").css("display", "flex");

                let creditNoteResponse = await $.ajax({
                    url: "/Invoice/SaveInvoiceInCn",
                    type: "POST",
                    dataType: "JSON",
                    data: fd,

                });

                const result = creditNoteResponse;
                if (result.IsSuccess) {
                    var InvoiceItems = new Array();
                    var InvoiceID = result.Result.invoiceID;

                    $('#invoice_items tbody tr').each(function () {

                        var PONumber = $(this).find('td').eq(0).text();
                        var ItemNumber = $(this).find('td').eq(1).text();
                        var description = $(this).find('td').eq(2).text();
                        var amount = replaceAll($(this).find('input').val(), ',', '');
                        var polineitemid = $(this).attr('data-poli');
                        var poid = $(this).attr('data-poid');

                        InvoiceItems.push({
                            PurchaseOrderNumber: PONumber,
                            POLineItemID: Number(polineitemid),
                            POLineItemNumber: ItemNumber,
                            Description: description,
                            LineItemTotal: 0 - parseFloat(amount),
                            InvoiceID: Number(InvoiceID),
                        });

                    });

                    let cnitemdata = await $.ajax({
                        url: "/Invoice/SaveInvoiceItemsinCN",
                        type: "POST",
                        data: JSON.stringify(InvoiceItems),
                        dataType: "JSON",
                        contentType: 'application/json',
                    });

                    if (cnitemdata.IsSuccess) {
                        var itemeditorupdate = new Array();

                        $('#tblitemeditor tbody tr').each(function () {
                            var cost = $(this).find('td:eq(3) input').val();
                            var qty = $(this).find('td:eq(4) input').val();
                            var itemid = $(this).attr('data-poli');
                            //console.log(cost + ">>>" + qty + ">>>" + itemid);
                            itemeditorupdate.push({
                                POLineItemID: Number(itemid),
                                Quantity: parseFloat(qty),
                                Cost: parseFloat(cost)

                            });


                        });

                        let updatePOLIresponse = await $.ajax({
                            url: "/Invoice/UpdatePOLineItem",
                            type: "POST",
                            data: JSON.stringify(itemeditorupdate),
                            dataType: "JSON",
                            contentType: 'application/json',
                        });
                        if (updatePOLIresponse.IsSuccess) {
                            $.notify.success('Success', updatePOLIresponse.Result);

                            setTimeout(function () {

                                window.location.reload();
                            }, 3000);
                        }
                        else {
                            $.notify.error('Error', updatePOLIresponse.ErrorMessages);
                        }
                    }
                    else {
                        $.notify.error('Error', cnitemdata.ErrorMessages);
                    }
                }

                else {
                    $.notify.error('Error', result.ErrorMessages);
                }
            } catch (e) {
                console.error(e);
            }
            finally {
                $(".loader").css("display", "none");
            }
        }        

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calcsubtotal();
        });
        function calcsubtotal() {

            var t1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val(), ',', '');



            var totamount = parseFloat(replaceAll($('#txt_SubtotalInvoice').val(), ',', ''));

            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }


            $('#txt_TotalInvoice').val(formatNumber(parseFloat(t1) + parseFloat(t2) + parseFloat(t3) + totamount));


        }

        $(document).on('keyup', '.setQty', function () {
            calculatetaxes();
        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty!');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val()?.trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);

                    }
                    $(".loader").css("display", "none");
                }
            })


        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });
    }
    // #endregion

    //#region :: Credit Note Entry Without Item
    if (action_name === "creditentry_tax") {

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        var date = new Date();

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        $('#txt_InvoiceDate').datepicker("setDate", date);


        $(document).on('change', '#Ddl_Vendors', async function () {

            if ($(this).find('option:selected').val() == "0" || $(this).find('option:selected').val() == null) {

                await ProjectListCN_Tax();

                return;
            }
            try {
                $(".loader").css("display", "flex");
                await ProjectListCN_Tax();
                await VendorTerms_Tax();
            } catch (e) {
                console.error(e);
                $(".loader").css("display", "none");
            }



        });

        ProjectListCN_Tax();
        async function ProjectListCN_Tax() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined) {
                //$('#ddl_project').empty();
                $('#project_tax').html('');

                $('#project_tax').html('<select multiple="multiple" class="multislct" data-width="100%" id="ddl_project"><option value="0">--Select Project--</option></select>');

                $('#ddl_project').multipleSelect({
                    filter: true,
                    showClear: false,
                    placeholder: 'Please Select',
                    filterPlaceholder: 'Enter Keyword',
                    single: true,
                });

                let firstOption = $('#ddl_project').find('option:first').val();
                $('#ddl_project').multipleSelect('setSelects', [firstOption]);



                return;
            }

            await $.ajax({
                url: "/Invoice/ProjectListinCreditEntry_Tax",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "HTML",
                success: function (data) {
                    if (data != "") {
                        $('#project_tax').html('');
                        $('#project_tax').html(data);

                        $('#ddl_project').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',
                            single: true,

                        });

                        let firstOption = $('#ddl_project').find('option:first').val();
                        $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                }

            });

        }

        ProjectList();
        ProjectAccount();
        function ProjectList() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined) {
                //$('#ddl_project').empty();
                $('#project_tax').html('');

                $('#project_tax').html('<select multiple="multiple" class="multislct" data-width="100%" id="ddl_project"><option value="0">--Select Project--</option></select>');

                $('#ddl_project').multipleSelect({
                    filter: true,
                    showClear: false,
                    placeholder: 'Please Select',
                    filterPlaceholder: 'Enter Keyword',
                    single: true,
                });

                let firstOption = $('#ddl_project').find('option:first').val();
                $('#ddl_project').multipleSelect('setSelects', [firstOption]);



                return;
            }

            $.ajax({
                url: "/Invoice/ProjectListonVendorDDChange",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "HTML",
                async: false,

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#project_tax').html('');
                        $('#project_tax').html(data);

                        $('#ddl_project').multipleSelect({
                            filter: true,
                            showClear: false,
                            placeholder: 'Please Select',
                            filterPlaceholder: 'Enter Keyword',
                            single: true,

                        });

                        let firstOption = $('#ddl_project').find('option:first').val();
                        $('#ddl_project').multipleSelect('setSelects', [firstOption]);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    $(".loader").css("display", "none");

                }

            });

        }

        $(document).on('change', '#ddl_project', async function () {

            try {
                $(".loader").css("display", "flex");
                await tblPOselectorfn();
                await ProjectAccount();
            } catch (e) {
                console.error(e);
            }
            finally {
                $(".loader").css("display", "none");
            }

        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });
        async function tblPOselectorfn() {

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();

            await $.ajax({
                url: "/Invoice/GetPoselectorCN_Tax",
                type: "GET",
                data: { VendorId: vendorId, ProjectId: projectId },
                dataType: "HTML",
                success: async function (data) {
                    if (data != "") {
                        $('#poselector_Tax').html('');
                        $('#poselector_Tax').html(data);

                        POSelectorDatatable();
                        await ProjectConvRate_Tax();
                    }
                    else {
                        $('#poselector_Tax').html('');
                    }
                }

            })


        }

        tblPOselectorfn();
        function POSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#po_selector_Tax")) {
                $('#po_selector_Tax').DataTable().clear().destroy();
            }


            var table = $("#po_selector_Tax").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                pageLength: 50,
                orderCellsTop: true,

                //scrollX: true,
                "order": [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },

                    { "targets": [5, 6, 7, 8], "className": "d-none" }

                ],

                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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

                        $('#po_selector_Tax tbody').empty();
                        $('#po_selector_Tax tbody').html(
                            '<tr><td colspan="6" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }
        async function ProjectConvRate_Tax() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];
            if ($('#po_selector_Tax tbody').find('tr').eq(0).find('td').length > 1) {

                $("#po_selector_Tax tbody tr").each(function () {

                    var remaining = $(this).find("td:eq(4)").text()?.trim();
                    var poid = $(this).attr('data-poid');
                    var cr = $(this).find("td:eq(8)").text()?.trim();

                    var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                    var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                    if (poid != "" && poid != null && poid != undefined) {

                        remainingValues.push(
                            {
                                Remaining: parseFloat(remaining),
                                POIDs: parseInt(poid),
                                ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                            }
                        );
                    }

                });

                if (remainingValues.length == 0) return;

                await $.ajax({
                    url: "/Invoice/ConversionrateForProject_Tax",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(remainingValues),
                    dataType: "json",
                    success: function (data) {
                        if (data.IsSuccess) {
                            var totalafterconv = data.Result.totalAfterConvert;
                            var totalbeforeconv = data.Result.totalBeforeConvert;
                            $('#exchngrate').val('');
                            $('#exchngrate').val(formatNumber(parseFloat(isNaN(totalafterconv / totalbeforeconv) ? 1.0000 : totalafterconv / totalbeforeconv)));

                        }
                        else {
                            //notify(false, data.ErrorMessages, true);
                            $('#exchngrate').val('');
                        }
                    }


                });

            }

        }
        async function VendorTerms_Tax() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();

            if (vendorId == "0" || vendorId == null || vendorId == undefined)
                return;

            await $.ajax({
                url: "/Invoice/Vendorterms",
                data: { VendorId: vendorId },
                type: "GET",
                dataType: "JSON",
                //async: false,
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#ddl_terms").val(data.Result).change();
                        if ($("#ddl_terms").val() == null) {

                            $('#ddl_terms').val($('#ddl_terms option:first').val());
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }


                }

            });

        }
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
        async function ProjectAccount() {

            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                //$('#bnkbalance').html('No Such Account In QBO');
                return;
            }

            await $.ajax({
                url: "/Invoice/ProjectAccount",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",
                success: async function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.description}</option>`);
                        }
                        let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
                        let formData = {
                            accountId: accountNumber
                        };

                        $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                        $.ajax({
                            url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                            data: formData,
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                if (data.IsSuccess) {
                                    if (data.Result != "INVALID") {
                                        $('#bnkbalance').html(data.Result);
                                    }
                                    else {
                                        $('#bnkbalance').html('No Such Account In QBO');
                                    }
                                }
                                else {
                                    $.notify.error('Error', data.Errors[0]);
                                    $('#bnkbalance').html('No Such Account In QBO');
                                }
                            }
                        });                       
                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                        $('#bnkbalance').html('No Such Account In QBO');
                    }
                    $(".loader").css("display", "none");

                }

            });
        }

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function () {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.error('Error', data.Errors[0]);
                    }
                }
            })           
        });

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";

            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);


        });
        function calculatefortaxfields() {

            //var st = replaceAll($('#txt_SubtotalInvoice').val(), ',', '');
            var t1 = replaceAll($('#txt_TotalTax1').val() ?? 0, ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val() ?? 0, ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val() ?? 0, ',', '');


            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }

            var tot = parseFloat(t1) + parseFloat(t2) + parseFloat(t3);
            $('#txt_TotalInvoice').val('');

            $('#txt_TotalInvoice').val(formatNumber(tot));
        }

        $(document).on('keyup', '#txt_TotalTax1,#txt_TotalTax2,#txt_TotalTax3', function () {
            calculatefortaxfields();
        });

        $(document).on('keyup', '#exchngrate', function () {
            $(this).removeAttr('data-edited');
            $(this).attr('data-edited', "Y");
        });

        $(document).on('click', '#btn_Save', function () {

            var goAhead = true;

            //$('#invoice_items tbody tr').each(function () {
            //	var ProjectAccount = $(this).find('td').eq(11).find('select').val();
            //	if (ProjectAccount == "0") {
            //		notify(false, "Row number " + ($(this).index() + 1) + " Does not have any Project account associated.", false);
            //		goAhead = false;
            //		return;
            //	}
            //});

            if (!goAhead) return;

            //if ($('#invoice_items tbody').find('tr').eq(0).find('td').length <= 1) {
            //	notify(false, 'Please Add items in Invoice first', false);
            //	return;
            //}

            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var POID = $('#hdn_poid').val();

            var tmp = true;
            var i = 0;
            var probrow = 0;



            if (probrow != "0") {
                $.notify.warning('Caution', 'Row number ' + (probrow) + ' is exceeding total remaining value.');
                return;

            }

            if (!tmp) return;

            var projectId = $('#ddl_project').val()?.toString();

            //validation start

            if (vendorId == "0" || vendorId == null) {
                $.notify.warning('Caution', 'Please Select Vendors!');
                return;
            }

            //if (POID == "" || POID == null) {
            //	notify(false, 'Please Select POs.', false);
            //	return;
            //}

            if ($('#txt_InvoiceNumber').val() != '' || $('#txt_InvoiceNumber').val() != null) {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the InvoiceNumber in correct format');
                    return false;

                }

            }

            if ($('#txt_InvoiceDate').val()?.trim() == '') {
                $('#' + "txt_InvoiceDate").val($('#' + 'txt_InvoiceDate').val()?.trim());
                $('#' + 'txt_InvoiceDate').attr('placeholder', 'Please insert Invoice Date.');
                $('#' + 'txt_InvoiceDate').effect("shake", { times: 2 }, 700);
                $('#' + 'txt_InvoiceDate').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date.');
                return;
            }

            var InvoiceDate = $('#txt_InvoiceDate').val();

            if ($('#ddl_terms').val()?.trim() == '' || $('#ddl_terms').val()?.trim() == '0' || $('#ddl_terms').val() == null) {
                $('#ddl_terms').val($('#' + 'ddl_terms').val().trim());
                $('#ddl_terms').attr('placeholder', 'Please Select Terms.');
                $('#ddl_terms').effect("shake", { times: 2 }, 700);
                $('#ddl_terms').trigger('focus');
                $.notify.warning('Caution', 'Please Select Terms.');
                return;
            }

            var Terms = $('#ddl_terms').val();
            if ($('#Ddl_ProjectAccount').val() == '0') {
                $('#Ddl_ProjectAccount').val($('#' + 'Ddl_ProjectAccount').val()?.trim());
                $('#Ddl_ProjectAccount').attr('placeholder', 'Please Select Project Account.');
                $('#Ddl_ProjectAccount').effect("shake", { times: 2 }, 700);
                $('#Ddl_ProjectAccount').trigger('focus');
                $.notify.warning('Caution', 'Please Select Project Account.');

                return;
            }
            var projectAccount = $('#Ddl_ProjectAccount').val();
            if ($('#exchngrate').val() == '' || !$('#exchngrate').val()) {
                $.notify.warning('Caution', 'Please Add FX Rate in Invoice first');
                return;
            }

            if ($('#txt_InvoiceNumber').val()?.trim() == '') {
                $('#txt_InvoiceNumber').val($('#' + 'txt_InvoiceNumber').val()?.trim());
                $('#txt_InvoiceNumber').attr('placeholder', 'Please enter Invoice Number.');
                $('#txt_InvoiceNumber').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceNumber').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Number.');

                return;
            }

            var InvoiceNumber = escape($('#txt_InvoiceNumber').val().trim());

            if ($('#txt_TotalInvoiceAmount').val()?.replace(',', '').trim() == '0' || $('#txt_TotalInvoiceAmount').val().replace(',', '').trim() == '') {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val()?.trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Please enter Total Invoice Amount.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Please enter Total Invoice Amount.');

                return;
            }

            var TotalInvoiceAmount = replaceAll($('#txt_TotalInvoiceAmount').val().replace(',', ''), ',', '');

            if ($('#txt_InvoiceMemo').val()?.trim() == '0') {
                $('#txt_InvoiceMemo').val($('#' + 'txt_InvoiceMemo').val()?.trim());
                $('#txt_InvoiceMemo').attr('placeholder', 'Please enter Invoice Memo.');
                $('#txt_InvoiceMemo').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceMemo').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Memo.');

                return;
            }
            var InvoiceMemo = $('#txt_InvoiceMemo').val();

            //var SubtotalInvoice = replaceAll($('#txt_SubtotalInvoice').val().replace(',', ''), ',', '');
            //SubtotalInvoice = Math.round((SubtotalInvoice * 100)) / 100;
            var TotalTax1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var TotalTax2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var TotalTax3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            var TotalInvoice = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            var TotalInvoiceor = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            //TotalInvoice = parseFloat(TotalInvoice / FxRate);
            TotalInvoice = Math.round((TotalInvoice * 100)) / 100;

            if (parseFloat(TotalInvoiceAmount) != parseFloat(TotalInvoiceor)) {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val().trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Invoice totals does not match.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');

                $.notify.warning('Caution', 'Invoice total does not match with each other.');
                return;

            }

            var Exrate = replaceAll($('#exchngrate').val(), ',', '');


            let fd = {
                InvoiceNumberVendor: InvoiceNumber,
                InvoiceDate: InvoiceDate,
                InvoiceAmount: 0 - parseFloat(TotalInvoiceAmount),
                Terms: Terms,
                Memo: InvoiceMemo,
                ProjectAccount: projectAccount,
                Subtotal: 0,
                VendorId: POID == "" || POID == null || POID == undefined ? null : BigInt(vendorId),
                Tax1: 0 - parseFloat(TotalTax1),
                Tax2: 0 - parseFloat(TotalTax2),
                Tax3: 0 - parseFloat(TotalTax3),
                TotalInvoice: 0 - parseFloat(TotalInvoice),
                Exrate: parseFloat(Exrate),
                POID: POID == "" || POID == null || POID == undefined ? null : POID.replace(',', '^'),
                ProjectId: projectId,

            };
            //ajax call
            $.ajax({
                url: "/Invoice/SaveInvoice_Tax",
                type: "POST",
                dataType: "JSON",
                data: fd,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        //var InvoiceItems = new Array();
                        //var InvoiceID = data.Result.invoiceId;
                        $.notify.success('Success', 'Credit Memo saved successfully.');
                        window.location.reload();
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);

                    }

                    $(".loader").css("display", "none");
                }

            });
        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty.');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }

            })


        });

        $(document).on('click', '.redirectpoedit', function () {
            var poid = $(this).data('poid');
            var url = "/Purchaseorder/POEdit?POId=" + poid;
            window.open(url, '_blank');

        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });
    }
    // #endregion

    // #region :: Edit Credit Note
    if (action_name === 'editcreditnote') {

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        $('#ddl_project').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true
        });

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd'

        });
        LoadCreditNoteData();
        async function LoadCreditNoteData() {
            try {
                $(".loader").css("display", "flex");

                await ProjectAccountinCN();

                await POSelectorInCN();

            } catch (error) {
                console.error("Error while loading CN data:", error);
            } finally {
                $(".loader").css("display", "none");
            }
        }
        //ProjectAccountinCN();
        async function ProjectAccountinCN() {

            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();

                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);

                return;
            }
            try {
                $(".loader").css("display", "flex");
                let data = await $.ajax({

                    url: "/Invoice/ProjectAccountinCN",
                    data: { ProjectId: projectId },
                    type: "GET",
                    dataType: "JSON",
                });

                if (data.IsSuccess) {
                    $('#Ddl_ProjectAccount').empty();
                    $('#Ddl_ProjectAccount').append('<option value="0">--Select Project Account--</option>');
                    let creditNoteProjectAccount = $('#Hdn_projectacc').val();
                    for (var item of data.Result) {
                        if (item.fldId == creditNoteProjectAccount) {

                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" selected >${item.anumber}</option>`);
                        }
                        else {

                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.anumber}</option>`);
                        }
                    }
                    let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                    let formData = {
                        accountId: accountNumber
                    };

                    $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                    $.ajax({
                        url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                        data: formData,
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            if (data.IsSuccess) {
                                if (data.Result != "INVALID") {
                                    $('#bnkbalance').html(data.Result);
                                }
                                else {
                                    $('#bnkbalance').html('No Such Account In QBO');
                                }
                            }
                            else {
                                $.notify.error('Error', data.Errors[0]);
                                $('#bnkbalance').html('No Such Account In QBO');
                            }
                        }
                    })
                }
                else {
                    $('#Ddl_ProjectAccount').empty();
                    $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                    $('#bnkbalance').html('No Such Account In QBO');
                }
            } catch (error) {
                console.error(error);
            }
            finally {
                $(".loader").css("display", "none");
            }


            //$.ajax({
            //		url: "/Invoice/ProjectAccountinCN",
            //		data: { ProjectId: projectId },
            //		type: "GET",
            //		dataType: "JSON",
            //		async: false,

            //		beforeSend: function () {
            //				$(".loader").css("display", "flex");
            //		},
            //		success: function (data) {

            //				if (data.IsSuccess) {


            //				}
            //				else {
            //						//notify(false, data.ErrorMessages, true);

            //				}
            //				$(".loader").css("display", "none");

            //		},
            //		error: function (error) {
            //				console.error(error);
            //				$(".loader").css("display", "none");
            //		}
            //});

        };

        //POSelectorInCN();
        async function POSelectorInCN() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();
            var poids = $('#hdn_poid').val();
            var invoiceid = $('#Hdn_InvoiceNumber').val();

            try {
                $(".loader").css("display", "flex");
                await new Promise(resolve => setTimeout(resolve, 50));

                let data = await $.ajax({
                    url: "/Invoice/POSelectorinCNEdit?poids=" + poids,
                    type: "GET",
                    data: { VendorId: vendorId, ProjectId: projectId, InvoiceId: invoiceid },
                    dataType: "HTML",
                });

                if (data != "") {
                    $('#poselectorincnbind').html('');
                    $('#poselectorincnbind').html(data);
                    POSelectorDatatableInCN();
                    //POSelectorDatatable();
                    //ProjectConvRate_Tax();
                    var poids = "";
                    $('.poselector_chk').each(function () {
                        //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                        if ($(this).is(':checked')) {

                            //poids.push($(this).data('poid'));
                            poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                        }
                    });
                    $('#hdn_poid').val(poid);
                    POItemSelectorinCN(poids, false);
                }
                else {
                    $('#poselectorincnbind').html('');
                }

            } catch (error) {
                console.error(error);
            }
            finally {
                $(".loader").css("display", "none");
            }

        }
        function POSelectorDatatableInCN() {

            if ($.fn.DataTable.isDataTable("#po_selector")) {
                $('#po_selector').DataTable().clear().destroy();
            }

            //$("#po_selector thead tr")
            //    .clone(true)
            //    .addClass("filters")
            //    .appendTo("#po_selector thead");

            var table = $("#po_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "paging": false,
                //scrollX: true,
                "order": [[1, "asc"]],
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },



                ],

                //initComplete: function () {
                //    var api = this.api();

                //    api.columns().eq(0).each(function (colIdx) {
                //        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                //        var title = $(cell).text();

                //        // Remove unnecessary classes
                //        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                //        // Handle keyup event for filtering
                //        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
                //            .off("keyup")
                //            .on("keyup", function () {
                //                var searchTerm = $(this).val();
                //                $(this).attr("title", searchTerm);

                //                var regexr = "({search})";
                //                api.column(colIdx)
                //                    .search(
                //                        searchTerm !== "" ? regexr.replace("{search}", "(((" + searchTerm + ")))") : "",
                //                        searchTerm !== "",
                //                        searchTerm === ""
                //                    )
                //                    .draw();
                //            });
                //        //$('.dt-search').css("display", "none");

                //        //add the sortable function


                //    });

                //},

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {

                        $('#po_selector tbody').empty();
                        $('#po_selector tbody').html(
                            '<tr><td colspan="5" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }
        function POItemSelectorinCN(poids, clicked) {

            if (poids == "") {
                $('#poitemselectorcn').html('');
                var html = `
						<table id="item_selector" class="table table-striped table-hover item_selector_table" style="width:100%">
							<thead>
								<tr>
									<th style="width: 20%">PO#</th>
									<th style="width: 20%">Item #</th>
									<th style="width: 40%;">Description</th>
									<th style="width: 20%;">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colspan="6" class="text-center">No data available </td>
								</tr>
							</tbody>
						</table>
						`;

                $('#poitemselectorcn').html(html);
                $('.dt-search').css("display", "none");

                return;

            }

            var invoiceId = $('#Hdn_InvoiceNumber').val();
            $.ajax({
                url: "/Invoice/POItemsinCNEdit",
                type: "GET",
                data: { poids: poids, InvoiceId: invoiceId, clicked: clicked },
                dataType: "HTML",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data != "") {
                        $('#poitemselectorcn').html('');
                        $('#poitemselectorcn').html(data);
                        POItemSelectorDatatable();
                        convRate();
                        //getInvoiceLineItemsinCN("");
                        $(".loader").css("display", "none");

                        var poidall = "";


                        $(document).find('.selected').each(function () {
                            //if ($(this).hasClass('selected') && !$(this).hasClass('noselect'))
                            if (!$(this).hasClass('noselect')) {
                                $(this).addClass('noselect');
                            }

                            let poid = $(this).data('poliid');
                            if (poid != undefined) {

                                poidall += poidall == "" ? poid : "^" + poid;
                            }

                        });

                        if (poidall == "" || poidall == undefined || poidall == null) return;

                        if (clicked == true) {
                            getInvoiceLineItemsinCN("", true);
                            calculatetaxes();
                        }
                        else {

                            getInvoiceLineItemsinCN(poidall, false);
                            var totamount = 0;

                            $('#invoice_items tbody tr').each(function () {

                                var tax1 = $(this).attr('data-gsthst');
                                var tax2 = $(this).attr('data-pst');
                                var tax3 = $(this).attr('data-statetax');
                                var amount = replaceAll($(this).find('td:eq(3) input').val(), ',', '');

                                totamount += parseFloat(amount);
                            });
                            $('#txt_SubtotalInvoice').val(totamount);
                            calcsubtotal();
                        }
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");

                    }
                }


            });
        }
        function POItemSelectorDatatable() {
            if ($.fn.DataTable.isDataTable("#item_selector")) {
                $('#item_selector').DataTable().clear().destroy();
            }

            var table = $("#item_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },
                    { "targets": [5], "className": "d-none" }

                ],
                "order": [[1, "asc"]],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();

                    $('.dt-search').css("display", "none");

                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#item_selector tbody').html(
                            '<tr><td colspan="6" class="empty_cell">No data available</td></tr>'
                        );
                    }
                    $('.dt-search').css("display", "none");

                }


            });
        }
        function convRate() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];

            $("#item_selector tbody tr").each(function () {
                var remaining = $(this).find("td:eq(3)").text()?.trim();
                var poid = $(this).data('poliid'); //polineitemid for convRate of Item Selector table
                var cr = $(this).find("td:eq(5)").text()?.trim();

                var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                if (poid != "" && poid != null && poid != undefined) {

                    remainingValues.push(
                        {
                            Remaining: parseFloat(remaining),
                            POIDs: parseInt(poid),
                            ConversionRate: vendorcurrcode?.trim().toLocaleLowerCase() != projectCurrCode?.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                        }
                    );
                }


            });

            if (remainingValues.length == 0) return;

            $.ajax({
                url: "/Invoice/ConversionrateForProject",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(remainingValues),
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data.IsSuccess) {
                        var totalafterconv = data.Result.totalAfterConvert;
                        var totalbeforeconv = data.Result.totalBeforeConvert;
                        $('#exchngrate').val('');
                        $('#exchngrate').val(formatNumber(parseFloat(totalafterconv / totalbeforeconv)));
                        $(".loader").css("display", "none");

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#exchngrate').val('');
                        $(".loader").css("display", "none");
                    }
                }


            });
        }
        function getInvoiceLineItemsinCN(poids, clicked) {

            if (poids == "" || poids == undefined || poids == null) {

                var html = `<table id="invoice_items" class="table table-striped table-hover invoice_items_table" style="width:100%">
							<thead>
								<tr>
									
									<th>PO#</th>
									<th>Item #</th>
									<th>Description</th>
									<th>Amount</th>
									
								</tr>
							</thead>

							<tbody>
								<tr>
								   <td colspan="4" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invoiceitemdetialscn').html('');
                $('#invoiceitemdetialscn').html(html);
                $('#txt_TotalTax1').val('');
                $('#txt_TotalTax2').val('');
                $('#txt_TotalTax3').val('');
                $('#txt_SubtotalInvoice').val('');
                $('#txt_TotalInvoice').val('');
                return;
            }
            var invoiceId = $('#Hdn_InvoiceNumber').val();
            $.ajax({
                url: "/Invoice/GetInvIteminCNEdit",
                data: { POLIIDS: poids, InvoiceId: invoiceId, clicked: clicked },
                dataType: "HTML",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {

                        $('#invoiceitemdetialscn').html('');
                        $('#invoiceitemdetialscn').html(data);

                        //calCulateOtherFields();
                        //SyncAll();
                        //convRate();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }

            });

        }
        function calculatetaxes() {

            var tottax = 0;
            var tottax1 = 0;
            var tottax2 = 0;
            var tottax3 = 0;
            var totamount = 0;

            $('#invoice_items tbody tr').each(function () {

                var tax1 = $(this).attr('data-gsthst');
                var tax2 = $(this).attr('data-pst');
                var tax3 = $(this).attr('data-statetax');
                var amount = replaceAll($(this).find('td:eq(3) input').val(), ',', '');

                totamount += parseFloat(amount);

                if ($(this).attr('data-gsthsttype') == '%') {
                    tax1 = parseFloat(amount) * parseFloat(tax1) / 100;
                }
                if ($(this).attr('data-psttype') == '%') {
                    tax2 = parseFloat(amount) * parseFloat(tax2) / 100;
                }
                if ($(this).attr('data-statetaxtype') == '%') {
                    tax3 = parseFloat(amount) * parseFloat(tax3) / 100;
                }

                tottax1 += parseFloat(tax1);
                tottax2 += parseFloat(tax2);
                tottax3 += parseFloat(tax3);

                tottax += parseFloat(tax1) + parseFloat(tax2) + parseFloat(tax3);

            });

            $('#txt_TotalTax1').val(formatNumber(tottax1));
            $('#txt_TotalTax2').val(formatNumber(tottax2));
            $('#txt_TotalTax3').val(formatNumber(tottax3));
            $('#txt_SubtotalInvoice').val(formatNumber(totamount));
            $('#txt_TotalInvoice').val(formatNumber(tottax1 + tottax2 + tottax3 + totamount));

        }

        $(document).on('click', '#unselectSelected', function () {

            $('.selectedrow').each(function () {
                $(this).remove();
                var poitemidinvoice = $(this).attr('data-poli');

                $('#item_selector tbody tr').each(function () {
                    var poitemidselector = $(this).data('poliid');
                    if (poitemidselector == poitemidinvoice) { $(this).removeClass('noselect'); $(this).removeClass('selected') }
                });

            });

            if ($('#invoice_items tbody tr').length === 0) {
                $('#invoice_items tbody').append('<tr><td colspan="4" class="text-center">No data available</td></tr>');
            }
            calculatetaxes();
        });

        $(document).on('click', '#unselectAll', function () {
            $('#invoice_items tbody tr').each(function () {
                $(this).remove();

            });

            $('#item_selector tbody tr').each(function () {
                $(this).removeClass('noselect');
                $(this).removeClass('selected');
            });

            $('#invoice_items tbody').append('<tr><td colspan="4" class="text-center">No data available</td></tr>');

            //SyncAll();
            calculatetaxes();
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

        $(document).on('click', '#item_selector tbody tr', function (event) {

            if ($(event.target).closest('a').length) {
                return;
            }

            //if ($(event.target).closest('.getotherinvoice').length) {
            //	return;
            //}
            if ($(this).find('td').length <= 1) return;

            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#item_selector tbody tr').not(':hidden');
            if (event.ctrlKey) {
                //rows.removeClass('selected');
                currentRow.toggleClass('selected');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selected').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selected');

                } else {
                    currentRow.addClass('selected');
                }

            }
            else {
                var ln = $('.selected').length;
                var hclass = false;
                hclass = $(this).hasClass('selected');

                $('.selected').each(function () {
                    $(this).removeClass('selected');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selected');
                }
                else if (ln == 1) {
                    $(this).removeClass('selected');
                }


            }

            $('.selected').each(function () {
                const poliid = $(this).data('poliid');
                if (poliid) {
                    polids += (polids ? "," : "") + poliid;
                }
            });

            //console.log(polids)
        });

        $(document).on('click', '#invoice_items tbody tr ', function (event) {

            if ($(event.target).closest('tr').hasClass('theader')) {
                return;
            }

            // Ignore clicks on rows without .selectable class
            if (!$(event.target).hasClass('selectable')) {
                return;
            }
            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#invoice_items tbody tr').not(':hidden');
            if (event.ctrlKey) {
                currentRow.toggleClass('selectedrow');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selectedrow').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selectedrow');

                } else {

                    currentRow.addClass('selectedrow');
                }

            }
            else {

                //rows.removeClass('selectedrow');
                //currentRow.toggleClass('selectedrow');
                var ln = $('.selectedrow').length;
                var hclass = false;
                hclass = $(this).hasClass('selectedrow');

                $('.selectedrow').each(function () {
                    $(this).removeClass('selectedrow');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selectedrow');
                }
                else if (ln == 1) {
                    $(this).removeClass('selectedrow');
                }
            }

            var selectedrows = parseInt($('.selectedrow').length);
            //if (selectedrows > 0) {
            //	$('#adjustbtn').removeClass('d-none');
            //}
            //else {
            //	$('#adjustbtn').addClass('d-none');
            //}

        });

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";
            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);
            //item selector table.
            POItemSelectorinCN(poids, true);
        });

        $(document).on('click', '#singleSelect', function () {

            var poidall = "";
            $(document).find('.noselect').each(function () {
                if ($(this).length > 0) {

                    let poid = $(this).data('poliid');
                    if (poid != undefined) {

                        poidall += poidall == "" ? poid : "^" + poid;
                    }
                }



            });

            $(document).find('.selected').each(function () {
                //if ($(this).hasClass('selected') && !$(this).hasClass('noselect'))
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('noselect');
                }

                let poid = $(this).data('poliid');
                if (poid != undefined) {

                    poidall += poidall == "" ? poid : "^" + poid;
                }

            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            //getInvoiceLineItems(poidall);
            getInvoiceLineItemsinCN(poidall, true);
            calculatetaxes();

        });

        $(document).on('click', '#selectall', function () {

            let poidall = "";
            $('#item_selector tbody tr').each(function () {
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('selected  noselect');
                    //let poli = $(this).attr('data-poli');
                    let poli = $(this).data('poliid');
                    if (poli != undefined) {

                        poidall += poidall == "" ? poli : "^" + poli;
                    }
                    //poidall += poidall == "" ? poid : "," + poid;
                }
                else {
                    let poli = $(this).data('poliid');
                    if (poli != undefined) {

                        poidall += poidall == "" ? poli : "^" + poli;
                    }
                }
            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            getInvoiceLineItemsinCN(poidall, true);
            calculatetaxes();
        });

        $(document).on('click', '#btn_Save', function () {

            var invnumber = $('#txt_InvoiceNumber').val();
            var account = $('#Ddl_ProjectAccount').val();

            var memo = $('#txt_InvoiceMemo').val();

            var idate = $('#txt_InvoiceDate').val();
            var InvoiceAmount = $('#txt_SubtotalInvoice').val();
            InvoiceAmount = replaceAll(InvoiceAmount, ',', '');
            var Subtotal = $('#txt_SubtotalInvoice').val();
            Subtotal = replaceAll(Subtotal, ',', '');

            var TotalInvoice = $('#txt_TotalInvoice').val();
            TotalInvoice = replaceAll(TotalInvoice, ',', '');

            var Exrate = '1.00';
            var VendorId = $('#Ddl_Vendors').val();

            var Tax1 = $('#txt_TotalTax1').val();
            Tax1 = replaceAll(Tax1, ',', '');

            var Tax2 = $('#txt_TotalTax2').val();
            Tax2 = replaceAll(Tax2, ',', '');

            var Tax3 = $('#txt_TotalTax3').val();
            Tax3 = replaceAll(Tax3, ',', '');


            if (invnumber == 'CR-') {
                $.notify.warning('Caution', 'Add Credit memo number');
                return;
            }
            if (account == '0') {
                $.notify.warning('Caution', 'Please select account');
                return;
            }
            if ($('#txt_InvoiceNumber').val() != '') {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {

                    $.notify.warning('Caution', 'Please enter the Credit Note in correct format');
                    return false;
                }

            }
            var polineitemid = '';
            var podata = [];
            var Amount = 0.00;
            $('#invoice_items tbody tr').each(function () {
                polineitemid += polineitemid == '' ? $(this).attr('data-poli') : '^' + $(this).attr('data-poli');
                podata.push({
                    POLI: $(this).attr('data-poli'),
                    Amount: parseFloat($(this).find('td:eq(3) input').val()?.replace(',', ''))
                });
                //amount += amount == '' ? $(this).find('td:eq(4) input').val() : '^' + $(this).find('td:eq(4) input').val();
                //poid += poid == '' ? $(this).attr('data-poid') : '^' + $(this).attr('data-poid');
                //PurchaseOrderNumber += PurchaseOrderNumber == '' ? $(this).find('td:eq(1)').html() : '^' + $(this).find('td:eq(1)').html();
                //POLineItemNumber += POLineItemNumber == '' ? $(this).find('td:eq(2)').html() : '^' + $(this).find('td:eq(2)').html();
                //Description += Description == '' ? $(this).find('td:eq(3)').html() : '^' + $(this).find('td:eq(3)').html();

            });


            if (polineitemid == "") {
                $.notify.warning('Caution', 'Please Select Invoice Items');
                return;

            }

            $.ajax({
                url: "/Invoice/GetItemsDetailsonSave",
                data: JSON.stringify({
                    POLIDS: polineitemid,
                    POLIData: podata
                }),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "HTML",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {

                        $('#itemonsavebind').html('');
                        $('#itemonsavebind').html(data);
                        itemDetailsonSaveDatatable();
                        $('#itemeditpopup').modal('show');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }


            });
        });

        function itemDetailsonSaveDatatable() {
            if ($.fn.DataTable.isDataTable("#tblitemeditor")) {
                $('#tblitemeditor').DataTable().clear().destroy();
            }

            var table = $("#tblitemeditor").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },


                ],
                "order": [[1, "asc"]],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();
                    //itemeditorbalance();

                    $('#itemeditpopup').modal({
                        backdrop: 'static',
                        keyboard: false
                    });


                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#tblitemeditor tbody').html(
                            '<tr><td colspan="8" class="empty_cell">No data available</td></tr>'
                        );
                    }


                }

            });
        }
        function itemeditorbalance() {

            $('#tblitemeditor tbody tr').each(function () {

                var cost = replaceAll($(this).find('td:eq(3) input').val(), ',', '');
                var qty = replaceAll($(this).find('td:eq(4) input').val(), ',', '');

                var extcst = $(this).find('td:eq(5)').attr('data-ext');
                var camt = replaceAll($(this).find('td:eq(6)').html(), ',', '');



                var amount = parseFloat(cost) * parseFloat(qty);

                $(this).find('td:eq(5)').html(formatNumber(amount));
                $(this).find('td:eq(7)').html(formatNumber(camt - (parseFloat(extcst) - parseFloat(amount))));

                if (parseFloat($(this).find('td:eq(7)').html()) == 0) {
                    $(this).addClass('matched');
                    $(this).removeClass('notmatched');
                }
                else {
                    $(this).removeClass('matched');
                    $(this).addClass('notmatched');

                }

            });
        }

        $(document).on('keyup', '.costchange,.qtychange', function () {
            itemeditorbalance();
        });

        function calculatetaxes() {

            var tottax = 0;
            var tottax1 = 0;
            var tottax2 = 0;
            var tottax3 = 0;
            var totamount = 0;
            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody tr').each(function () {

                    var tax1 = $(this).attr('data-gsthst');
                    var tax2 = $(this).attr('data-pst');
                    var tax3 = $(this).attr('data-statetax');
                    var amount = replaceAll($(this).find('td:eq(3) input').val(), ',', '');

                    amount = isNaN(amount) ? 0 : amount;

                    totamount += parseFloat(amount);

                    if ($(this).attr('data-gsthsttype') == '%') {
                        tax1 = parseFloat(amount) * parseFloat(tax1) / 100;
                    }
                    if ($(this).attr('data-psttype') == '%') {
                        tax2 = parseFloat(amount) * parseFloat(tax2) / 100;
                    }
                    if ($(this).attr('data-statetaxtype') == '%') {
                        tax3 = parseFloat(amount) * parseFloat(tax3) / 100;
                    }

                    tottax1 += parseFloat(tax1);
                    tottax2 += parseFloat(tax2);
                    tottax3 += parseFloat(tax3);

                    tottax += parseFloat(tax1) + parseFloat(tax2) + parseFloat(tax3);

                });
            }

            $('#txt_TotalTax1').val(formatNumber(tottax1));
            $('#txt_TotalTax2').val(formatNumber(tottax2));
            $('#txt_TotalTax3').val(formatNumber(tottax3));
            $('#txt_SubtotalInvoice').val(formatNumber(totamount));
            $('#txt_TotalInvoice').val(formatNumber(tottax1 + tottax2 + tottax3 + totamount));

        }

        async function handleSaveCreditNoteClick() {

            if ($('.notmatched').length > 0) {
                showNotMatchedConfirmForUpdateCredit();
                return;
            }

            await UpdateInvoiceCN();
        }

        function showNotMatchedConfirmForUpdateCredit() {
            $.confirm({
                title: 'Warning',
                message: 'There are items which are not adjusted as per the Credit Memo. Do you want to continue?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: async function () {
                    await UpdateInvoiceCN();
                }
            });
        }

        async function UpdateInvoiceCN() {
            var invoiceId = $('#Hdn_InvoiceNumber').val();
            var account = $('#Ddl_ProjectAccount').val();
            var invnumber = $('#txt_InvoiceNumber').val();
            var memo = $('#txt_InvoiceMemo').val();

            var idate = $('#txt_InvoiceDate').val();
            var InvoiceAmount = $('#txt_SubtotalInvoice').val();
            InvoiceAmount = replaceAll(InvoiceAmount, ',', '');
            var Subtotal = $('#txt_SubtotalInvoice').val();
            Subtotal = replaceAll(Subtotal, ',', '');

            var TotalInvoice = $('#txt_TotalInvoice').val();
            TotalInvoice = replaceAll(TotalInvoice, ',', '');

            var Exrate = $('#exchngrate').val();
            var VendorId = $('#Ddl_Vendors').val().toString();


            var Tax1 = $('#txt_TotalTax1').val();
            Tax1 = replaceAll(Tax1, ',', '');

            var Tax2 = $('#txt_TotalTax2').val();
            Tax2 = replaceAll(Tax2, ',', '');

            var Tax3 = $('#txt_TotalTax3').val();
            Tax3 = replaceAll(Tax3, ',', '');



            if (invnumber == 'CR-') {
                $.notify.warning('Caution', 'Add Credit memo number');
                return;
            }

            var poid = '';

            $('#invoice_items tbody tr').each(function () {
                poid += poid == '' ? $(this).attr('data-poid') : '^' + $(this).attr('data-poid');
            });

            let fd = {
                InvoiceId: invoiceId,
                InvoiceNumberVendor: invnumber,
                InvoiceDate: idate,
                InvoiceAmount: 0 - parseFloat(InvoiceAmount),
                Memo: memo,
                ProjectAccount: account,
                Subtotal: 0 - parseFloat(Subtotal),
                VendorId: BigInt(VendorId),
                Tax1: 0 - parseFloat(Tax1),
                Tax2: 0 - parseFloat(Tax2),
                Tax3: 0 - parseFloat(Tax3),
                TotalInvoice: 0 - parseFloat(TotalInvoice),
                Exrate: parseFloat(Exrate),
                POID: poid,

            };

            try {
                $(".loader").css("display", "flex");
                let response = await $.ajax({
                    url: "/Invoice/UpdateCreditNote",
                    type: "POST",
                    dataType: "JSON",
                    data: fd,
                });

                if (response.IsSuccess) {
                    var InvoiceItems = new Array();
                    var InvoiceID = response.Result.invoiceID;

                    $('#invoice_items tbody tr').each(function () {

                        var PONumber = $(this).find('td').eq(0).text();
                        var ItemNumber = $(this).find('td').eq(1).text();
                        var description = $(this).find('td').eq(2).text();
                        var amount = replaceAll($(this).find('input').val(), ',', '');
                        var polineitemid = $(this).attr('data-poli');
                        var poid = $(this).attr('data-poid');

                        InvoiceItems.push({
                            PurchaseOrderNumber: PONumber,
                            POLineItemID: Number(polineitemid),
                            POLineItemNumber: ItemNumber,
                            Description: description,
                            LineItemTotal: 0 - parseFloat(amount),
                            InvoiceID: Number(InvoiceID),
                        });

                    });

                    let cninvitemsresponse = await $.ajax({
                        url: "/Invoice/SaveInvoiceItemsinCN",
                        type: "POST",
                        data: JSON.stringify(InvoiceItems),
                        dataType: "JSON",
                        contentType: 'application/json',
                    });

                    if (cninvitemsresponse.IsSuccess) {
                        var itemeditorupdate = new Array();

                        $('#tblitemeditor tbody tr').each(function () {
                            var cost = $(this).find('td:eq(3) input').val();
                            var qty = $(this).find('td:eq(4) input').val();
                            var itemid = $(this).attr('data-poli');
                            itemeditorupdate.push({
                                POLineItemID: Number(itemid),
                                Quantity: parseFloat(qty),
                                Cost: parseFloat(cost)

                            });

                        });

                        if (itemeditorupdate.length == 0) return;

                        let udpateLIRes = await $.ajax({
                            url: "/Invoice/UpdatePOLineItem",
                            type: "POST",
                            data: JSON.stringify(itemeditorupdate),
                            dataType: "JSON",
                            contentType: 'application/json',
                        });

                        if (udpateLIRes.IsSuccess) {
                            $.notify.success('Success', udpateLIRes.Result);

                            setTimeout(function () {
                                window.location.reload();
                            }, 3000);
                        }
                        else {
                            $.notify.error('Error', udpateLIRes.ErrorMessages);
                        }
                    }
                    else {
                        $.notify.error('Error', cninvitemsresponse);
                    }

                }
                else {
                    $.notify.error('Error', response.ErrorMessages);
                }
            } catch (err) {
                console.error("An error occurred:", err);
            }
            finally {
                $(".loader").css("display", "none");
            }
        }        

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        $(document).on('click', '#btn_delete', function () {

            if ($(this).hasClass('inactivenow')) return;
            var invoiceNumber = $('#Hdn_InvoiceNumber').val();
            $.confirm({
                title: '',
                message: '"Do you want to delete this invoice?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/DeleteInvoice",
                        data: { invoiceId: invoiceNumber },
                        type: "POST",
                        dataType: "JSON",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                setTimeout(function () {
                                    $(".loader").css("display", "none");
                                    var urld = '/Invoice/invoicesearch';
                                    window.location.href = urld;
                                }, 4000);

                            }
                            else {
                                $.notify.error('Error', 'Something went wrong');
                                $(".loader").css("display", "none");
                            }


                        }
                    });
                },
                onCancel: function () {
                    
                }
            });
            
        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calcsubtotal();
        });
        function calcsubtotal() {

            var t1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val(), ',', '');



            var totamount = parseFloat(replaceAll($('#txt_SubtotalInvoice').val(), ',', ''));

            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }


            $('#txt_TotalInvoice').val(formatNumber(parseFloat(t1) + parseFloat(t2) + parseFloat(t3) + totamount));


        }

        $(document).on('keyup', '.setQty', function (eve) {
            var val = $(this).val();

            val = val.replace(/-/g, '');

            $(this).val(val);
            if ($(this).val().length == '1' && (eve.which == 8 || eve.which == 46)) {
                eve.preventDefault();
                $(this).val('0');
            }
            if ($(this).val().indexOf('0') == 0 && $(this).val().length > 1) {
                if ($(this).val().indexOf('0.') == -1) {
                    $(this).val($(this).val().substring(1));
                }
            }

            if ($(this).val().length == 0) {
                $(this).val(0);
            }
            calculatetaxes();
        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty.');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            })


        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calcsubtotal();
        });
    }
    // #endregion

    //#region :: InvoiceEdit without items
    if (action_name === 'invoiceedit_tax') {
        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });


        $('#ddl_project').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,
        });

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        togglebutton();
        function togglebutton() {
            var paymentcount = $('#hdn_paymentcount').val();
            var subtotal = $('#hdn_subtotal').val();
            if (subtotal == 0) {
                $('#btn_void').remove();
            }
            if (paymentcount > 0) {
                $('#btn_void').remove();
                $('#btn_delete').remove();

            }

        }

        allonLoadCall();

        async function allonLoadCall() {
            try {
                $(".loader").css("display", "flex");
                await ProjectAccount();
                await VendorAddress();
                await POSeletor();


            } catch (error) {
                console.error(error);
            }
            finally {
                $(".loader").css("display", "none");
            }

        }

        //ProjectAccount();
        //VendorAddress();
        //POSeletor();
        async function ProjectAccount() {

            var projectId = $('#ddl_project').val()?.toString();

            if (projectId == "0" || projectId == null || projectId == undefined) {

                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append('<option value="0">No Project Account</option>');

                return;
            }

            $.ajax({
                url: "/Invoice/ProjectAccount",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.description}</option>`);
                        }
                        let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
                        let formData = {
                            accountId: accountNumber
                        };

                        $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                        $.ajax({
                            url: url,
                            type: "GET",
                            data: formData,
                            dataType: "text",
                            success: function (data) {
                                if (data.IsSuccess) {
                                    if (data.Result != "INVALID") {
                                        $('#bnkbalance').html(data.Result);
                                    }
                                    else {
                                        $('#bnkbalance').html('No Such Account In QBO');
                                    }
                                }
                                else {
                                    $('#bnkbalance').html('No Such Account In QBO');

                                }
                            },
                            error: function (error) {
                                console.error(error);
                                $('#bnkbalance').html('No Such Account In QBO');
                            }


                        })
                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                        $('#bnkbalance').html('No Such Account In QBO');
                    }
                    $(".loader").css("display", "none");

                }

            });
        }

        async function VendorAddress() {

            var vendorid = $('#Ddl_Vendors').val()?.toString();

            $.ajax({
                url: "/Invoice/GetVendorAddress",
                data: { VendorID: vendorid },
                type: "GET",
                dataType: "JSON",
                success: function (data) {

                    if (data.IsSuccess) {
                        var response = data.Result.result;
                        $('#lblAddress').text(response.split('%%%')[0]);
                        $('#lblLegal').text(response.split('%%%')[1]);
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid=' + vendorid);
                    }
                    else {
                        $('#lblAddress').text('');
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid' + vendorid);
                        $('#lblLegal').text('');
                    }

                }
            });
        }

        async function POSeletor() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();
            var invoiceid = $('#hdn_invoiceid').val();
            var poid = $('#hdn_poid').val();

            $.ajax({
                url: "/Invoice/GetPoselector_EditTax",
                type: "GET",
                data: { VendorId: vendorId, ProjectId: projectId, invoicepoid: poid },
                dataType: "HTML",


                success: function (data) {
                    if (data != "") {
                        $('#poselector_Tax').html('');
                        $('#poselector_Tax').html(data);

                        POSelectorDatatable();
                        //ProjectConvRate_Tax();
                    }
                    else {
                        $('#poselector_Tax').html('');
                    }
                    //$(".loader").css("display", "none");

                }
            })

        }

        function ProjectConvRate_Tax() {

            if ($('#exchngrate').attr('data-edited') == 'Y') {
                return;
            }
            var remainingValues = [];
            if ($('#po_selector_Tax tbody').find('tr').eq(0).find('td').length > 1) {

                $("#po_selector_Tax tbody tr").each(function () {

                    var remaining = $(this).find("td:eq(4)").text()?.trim();
                    var poid = $(this).attr('data-poid');
                    var cr = $(this).find("td:eq(8)").text()?.trim();

                    var vendorcurrcode = $('#Ddl_Vendors option:selected')?.data('curr');
                    var projectCurrCode = $('#ddl_project option:selected')?.data('curr');

                    if (poid != "" && poid != null && poid != undefined) {

                        remainingValues.push(
                            {
                                Remaining: parseFloat(remaining),
                                POIDs: parseInt(poid),
                                ConversionRate: vendorcurrcode.trim().toLocaleLowerCase() != projectCurrCode.trim().toLocaleLowerCase() ? 1 : parseFloat(cr)
                            }
                        );
                    }

                });

                if (remainingValues.length == 0) return;

                $.ajax({
                    url: "/Invoice/ConversionrateForProject_Tax",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(remainingValues),
                    dataType: "json",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },

                    success: function (data) {
                        if (data.IsSuccess) {
                            var totalafterconv = data.Result.totalAfterConvert;
                            var totalbeforeconv = data.Result.totalBeforeConvert;
                            $('#exchngrate').val('');
                            $('#exchngrate').val(formatNumber(parseFloat(isNaN(totalafterconv / totalbeforeconv) ? 1.0000 : totalafterconv / totalbeforeconv)));
                            $(".loader").css("display", "none");

                        }
                        else {
                            //notify(false, data.ErrorMessages, true);
                            $('#exchngrate').val('');
                            $(".loader").css("display", "none");
                        }
                    }

                });

            }

        }

        function POSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#po_selector")) {
                $('#po_selector').DataTable().clear().destroy();
            }

            $("#po_selector thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#po_selector thead");

            var table = $("#po_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,

                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },

                    { "targets": [5, 6, 7, 8, 9, 10, 11], "className": "d-none" }

                ],




                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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
                        $('#po_selector tbody').html(
                            '<tr><td colspan="12" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }

        //$(document).on('click', '.redirectpoedit', function () {
        //		var poid = $(this).data('poid');
        //		var url = "/Purchaseorder/POEdit?POId=" + poid;
        //		window.open(url, '_blank');

        //});

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.error('Error', data.Errors[0]);
                    }
                }
            })

        });

        $(document).on('click', '#btn_Save', function () {

            var goAhead = true;
            var ttmp = 1;
            //$('#invoice_items tbody tr').each(function () {
            //		var ProjectAccount = $(this).find('td').eq(11).find('select').val();
            //		if (ProjectAccount == "0") {
            //				notify("Row number " + ttmp + " Does not have any Project account associated.");
            //				goAhead = false;
            //				return;
            //		}
            //		ttmp++;
            //});

            if (!goAhead) {
                return;
            }
            var i = 0;
            var probrow = new Array();

            //$('#invoice_items tbody tr').each(function () {

            //		var total = replaceAll($(this).attr('data-remaining').replace(',', ''), ',', '');



            //		var t1 = 0;
            //		var t2 = 0;
            //		var t3 = 0;

            //		t1 = replaceAll($(this).find('td:eq(8)').find('input').val()?.replace(',', ''), ',', '');
            //		t2 = replaceAll($(this).find('td:eq(9)').find('input').val()?.replace(',', ''), ',', '');
            //		t3 = replaceAll($(this).find('td:eq(10)').find('input').val()?.replace(',', ''), ',', '');

            //		t1 = isNaN(parseFloat(t1)) ? 0 : parseFloat(t1);
            //		t2 = isNaN(parseFloat(t2)) ? 0 : parseFloat(t2);
            //		t3 = isNaN(parseFloat(t3)) ? 0 : parseFloat(t3);

            //		var vl = replaceAll($(this).find('td:eq(5) input').val().replace(',', ''), ',', '');
            //		vl = isNaN(parseFloat(vl)) ? 0 : parseFloat(vl);


            //		var tottax = parseFloat(t1) + parseFloat(t2) + parseFloat(t3);



            //		// vl -= parseFloat(tottax);//.replace(',', '')



            //		i++;

            //		total = parseFloat(total).toFixed(2);
            //		vl = parseFloat(vl).toFixed(2);
            //		var Fxrate = $('#exchngrate').val();

            //		if (parseFloat(vl / Fxrate) > parseFloat(total)) {

            //				probrow.push({ 'rownumber': i });
            //		}


            //});

            var htm = '';
            var rnum = '';

            if (probrow.length > 0) {
                for (var a = 0; a < probrow.length; a++) {
                    rnum += rnum == '' ? probrow[a].rownumber : ", " + probrow[a].rownumber;


                }

                htm += 'Row number(s) ' + rnum + ' exceeding total remaining value.';
                $('#invexceedtotal_text').html(htm);
                $('#invexceedtotal').modal('show');

            }
            else {
                UpdateInvoice2();
            }

        });

        $(document).on('click', '#btn_save2', function () {
            UpdateInvoice2();
        });

        function UpdateInvoice2() {

            var goAhead = true;

            //$('#invoice_items tbody tr').each(function () {
            //		var ProjectAccount = $(this).find('td').eq(11).find('select').val();
            //		if (ProjectAccount == "0") {
            //				notify(false, "Row number " + ($(this).index() + 1) + " Does not have any Project account associated.", false);
            //				goAhead = false;
            //				return;
            //		}
            //});

            if (!goAhead) return;

            //if ($('#invoice_items tbody').find('tr').eq(0).find('td').length <= 1) {
            //		notify(false, 'Please Add items in Invoice first', false);
            //		return;
            //}
            var InvoiceID = $('#hdn_invoiceid').val();
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var POID = $('#hdn_poid').val();

            var tmp = true;
            var i = 0;
            var probrow = 0;

            //$('#invoice_items tbody tr').each(function () {
            //		var total = $(this).attr('data-remaining');
            //		var t1 = 0;
            //		var t2 = 0;
            //		var t3 = 0;

            //		t1 = $(this).find('td:eq(8)').find('input').val()?.trim().replace(',', '');
            //		t2 = $(this).find('td:eq(9)').find('input').val()?.trim().replace(',', '');
            //		t3 = $(this).find('td:eq(10)').find('input').val()?.trim().replace(',', '');

            //		t1 = isNaN(parseFloat(t1)) ? 0 : parseFloat(t1);
            //		t2 = isNaN(parseFloat(t2)) ? 0 : parseFloat(t2);
            //		t3 = isNaN(parseFloat(t3)) ? 0 : parseFloat(t3);

            //		var vl = replaceAll($(this).find('td:eq(7)').html().replace(',', ''), ',', '');

            //		vl = isNaN(parseFloat(vl)) ? 0 : parseFloat(vl);

            //		i++;

            //		total = (precise_round(total, 2));
            //		vl = precise_round(vl, 2);
            //		vl = (precise_round(vl, 2));

            //		if (parseFloat(vl) > parseFloat(total)) {

            //				if (probrow == "0") {
            //						probrow = i;
            //				}



            //				tmp = false;
            //				return;
            //		}

            //});

            //if (probrow != "0") {
            //		notify(false, 'Row number ' + (probrow) + ' is exceeding total remaining value.', false);

            //}

            //if (!tmp) return;

            var projectId = $('#ddl_project').val()?.toString();

            //validation start

            if (vendorId == "0" || vendorId == null) {
                $.notify.warning('Caution', 'Please Select Vendors.');
                return;
            }

            if ($('#hdn_poid').val() == "0" || $('#hdn_poid').val() == "" || $('#hdn_poid').val() == null || $('#hdn_poid').val() == undefined) {
                $.notify.warning('Caution', 'Please Select POs.');
                return;
            }

            if ($('#txt_InvoiceNumber').val() != '' || $('#txt_InvoiceNumber').val() != null) {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the InvoiceNumber in correct format');
                    return false;

                }

            }

            if ($('#txt_InvoiceDate').val()?.trim() == '') {
                $('#' + "txt_InvoiceDate").val($('#' + 'txt_InvoiceDate').val()?.trim());
                $('#' + 'txt_InvoiceDate').attr('placeholder', 'Please insert Invoice Date.');
                $('#' + 'txt_InvoiceDate').effect("shake", { times: 2 }, 700);
                $('#' + 'txt_InvoiceDate').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date.');
                return;
            }

            var InvoiceDate = $('#txt_InvoiceDate').val();
            if ($('#ddl_terms').val()?.trim() == '' || $('#ddl_terms').val()?.trim() == '0' || $('#ddl_terms').val() == null) {
                $('#ddl_terms').val($('#' + 'ddl_terms').val().trim());
                $('#ddl_terms').attr('placeholder', 'Please Select Terms.');
                $('#ddl_terms').effect("shake", { times: 2 }, 700);
                $('#ddl_terms').trigger('focus');
                $.notify.warning('Caution', 'Please Select Terms.');
                return;
            }

            var Terms = $('#ddl_terms').val();
            if ($('#Ddl_ProjectAccount').val() == '0') {
                $('#Ddl_ProjectAccount').val($('#' + 'Ddl_ProjectAccount').val()?.trim());
                $('#Ddl_ProjectAccount').attr('placeholder', 'Please Select Project Account.');
                $('#Ddl_ProjectAccount').effect("shake", { times: 2 }, 700);
                $('#Ddl_ProjectAccount').trigger('focus');
                $.notify.warning('Caution', 'Please Select Project Account.');

                return;
            }
            var projectAccount = $('#Ddl_ProjectAccount').val();
            if ($('#exchngrate').val() == '' || !$('#exchngrate').val()) {
                $.notify.warning('Caution', 'Please insert Invoice Date.');
                return;
            }
            if ($('#txt_InvoiceNumber').val()?.trim() == '') {
                $('#txt_InvoiceNumber').val($('#' + 'txt_InvoiceNumber').val()?.trim());
                $('#txt_InvoiceNumber').attr('placeholder', 'Please enter Invoice Number.');
                $('#txt_InvoiceNumber').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceNumber').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Number.');

                return;
            }

            var InvoiceNumber = escape($('#txt_InvoiceNumber').val().trim());

            if ($('#txt_TotalInvoiceAmount').val()?.replace(',', '').trim() == '0' || $('#txt_TotalInvoiceAmount').val().replace(',', '').trim() == '') {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val()?.trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Please enter Total Invoice Amount.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Please enter Total Invoice Amount.');

                return;
            }

            var TotalInvoiceAmount = replaceAll($('#txt_TotalInvoiceAmount').val().replace(',', ''), ',', '');

            if ($('#txt_InvoiceMemo').val()?.trim() == '0') {
                $('#txt_InvoiceMemo').val($('#' + 'txt_InvoiceMemo').val()?.trim());
                $('#txt_InvoiceMemo').attr('placeholder', 'Please enter Invoice Memo.');
                $('#txt_InvoiceMemo').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceMemo').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date.');

                return;
            }
            var InvoiceMemo = $('#txt_InvoiceMemo').val();

            //var SubtotalInvoice = replaceAll($('#txt_SubtotalInvoice').val().replace(',', ''), ',', '');
            //SubtotalInvoice = Math.round((SubtotalInvoice * 100)) / 100;
            var TotalTax1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var TotalTax2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var TotalTax3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            var TotalInvoice = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            var TotalInvoiceor = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            //TotalInvoice = parseFloat(TotalInvoice / FxRate);
            TotalInvoice = Math.round((TotalInvoice * 100)) / 100;

            if (parseFloat(TotalInvoiceAmount) != parseFloat(TotalInvoiceor)) {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val().trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Invoice totals does not match.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');

                $.notify.warning('Caution', 'Invoice total does not match with each other.');
                return;

            }

            var Exrate = replaceAll($('#exchngrate').val(), ',', '');


            let fd = {
                InvoiceNumber: InvoiceID,
                InvoiceNumberVendor: InvoiceNumber,
                InvoiceDate: InvoiceDate,
                InvoiceAmount: TotalInvoiceAmount,
                Terms: Terms,
                Memo: InvoiceMemo,
                ProjectAccount: projectAccount,
                Subtotal: 0,
                VendorId: BigInt(vendorId),
                Tax1: parseFloat(TotalTax1),
                Tax2: parseFloat(TotalTax2),
                Tax3: parseFloat(TotalTax3),
                TotalInvoice: parseFloat(TotalInvoiceor),
                Exrate: parseFloat(Exrate),
                POID: POID.replace(',', '^'),


            };

            $.ajax({
                url: "/Invoice/UpdateInvoice",
                type: "POST",
                dataType: "JSON",
                data: fd,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        var InvoiceItems = new Array();
                        var InvoiceID = data.Result.invoiceId;

                        if (InvoiceID === '0') {
                            $.notify.error('Error', 'Can not update, duplicate invoicenumber exists');
                            $(".loader").css("display", "none");
                            return;
                        }
                        $.notify.success('Success', 'Updated invoice');
                        setTimeout(function () {
                            irrrrr = 0;
                            window.location.reload();
                        }, 3000);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);

                    }

                    $(".loader").css("display", "none");
                }

            });

        }

        $(document).on('click', '#btn_delete', function () {

            if ($(this).hasClass('inactivenow')) return;
            var invoiceNumber = $('#hdn_invoiceid').val();
            $.confirm({
                title: '',
                message: 'Do you want to delete this invoice?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/DeleteInvoice",
                        data: { invoiceId: invoiceNumber },
                        type: "POST",
                        dataType: "JSON",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                setTimeout(function () {
                                    var urld = '/Invoice/invoicesearch';
                                    window.location.href = urld;
                                }, 4000);

                            }
                            else {
                                $.notify.error('Error', 'Something went wrong');
                            }
                            $(".loader").css("display", "none");

                        }
                    });
                },
                onCancel: function () {
                    
                }
            });

                        
        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calculatefortaxfields();
        });
        function calculatefortaxfields() {
            var st = 0;
            var t1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }

            var tot = parseFloat(st) + parseFloat(t1) + parseFloat(t2) + parseFloat(t3);

            $('#txt_TotalInvoice').val(formatNumber(tot));
        }

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }
            })


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

    // #region :: Invoice Edit
    if (action_name === 'invoiceedit') {

        $('#Ddl_Vendors').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,

        });

        $('#ddl_project').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,
        });

        $('#txt_InvoiceDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });

        togglebutton();
        function togglebutton() {
            var paymentcount = $('#hdn_paymentcount').val();
            var subtotal = $('#hdn_subtotal').val();
            if (subtotal == 0) {
                $('#btn_void').remove();
            }
            if (paymentcount > 0) {
                $('#btn_void').addClass('inactivenow');
                $('#btn_delete').addClass('inactivenow');

            }

        }

        //ProjectAccount();
        //VendorAddress();
        //POSeletor();
        callonLoad();
        async function callonLoad() {
            try {
                $(".loader").css("display", "flex");
                await ProjectAccount();
                await VendorAddress();
                await POSeletor();


            } catch (error) {
                console.error("Error sending data:", error);
            }
            finally {
                $(".loader").css("display", "none");
            }
        }
        async function ProjectAccount() {
            var projectId = $('#ddl_project').val()?.toString();
            if (projectId == "0" || projectId == null || projectId == undefined) {
                $('#Ddl_ProjectAccount').empty();
                $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                return;
            }

            $.ajax({
                url: "/Invoice/ProjectAccount",
                data: { ProjectId: projectId },
                type: "GET",
                dataType: "JSON",
                success: function (data) {

                    if (data.IsSuccess) {
                        $('#Ddl_ProjectAccount').empty();
                        for (var item of data.Result) {
                            $('#Ddl_ProjectAccount').append(`<option data-accountname="${item.accountNumber}" value="${item.fldId}" >${item.description}</option>`);
                        }
                        let accountNumber = $('#Ddl_ProjectAccount option:selected').attr('data-accountname');
                        const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
                        let formData = {
                            accountId: accountNumber
                        };

                        $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                        $.ajax({
                            url: url,
                            type: "GET",
                            data: formData,
                            dataType: "text",
                            success: function (data) {
                                if (data.IsSuccess) {
                                    if (data.Result != "INVALID") {
                                        $('#bnkbalance').html(data.Result);
                                    }
                                    else {
                                        $('#bnkbalance').html('No Such Account In QBO');
                                    }
                                }
                                else {
                                    $('#bnkbalance').html('No Such Account In QBO');
                                }
                            },
                            error: function (error) {
                                console.log(error);
                                $('#bnkbalance').html('No Such Account In QBO');
                            }

                        })

                    }
                    else {
                        //notify(false, data.ErrorMessages, true);
                        $('#Ddl_ProjectAccount').empty();
                        $('#Ddl_ProjectAccount').append(`<option value="0">No Project Account</option>`);
                        $('#bnkbalance').html('No Such Account In QBO');
                    }
                },

            });
        }
        async function VendorAddress() {

            var vendorid = $('#Ddl_Vendors').val()?.toString();

            $.ajax({
                url: "/Invoice/GetVendorAddress",
                data: { VendorID: vendorid },
                type: "GET",
                dataType: "JSON",


                success: function (data) {

                    if (data.IsSuccess) {
                        var response = data.Result.result;
                        $('#lblAddress').text(response.split('%%%')[0]);
                        $('#lblLegal').text(response.split('%%%')[1]);
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid=' + vendorid);
                    }
                    else {
                        $('#lblAddress').text('');
                        $('#lblAddress').parent().attr('href', _BaseURL + '/Vendors/EditVendor?vendorid' + vendorid);
                        $('#lblLegal').text('');
                    }
                    //	$(".loader").css("display", "none");
                }
            });
        }
        async function POSeletor() {
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var projectId = $('#ddl_project').val()?.toString();
            var invoiceid = $('#hdn_invoiceid').val();
            var poid = $('#hdn_poid').val();

            $.ajax({
                url: "/Invoice/POSelectorInvoiceEdit",
                data: { VendorId: vendorId, ProjectId: projectId, InvoiceNumber: invoiceid, POID: poid },
                type: "GET",
                dataType: "HTML",
                //async: false,

                //beforeSend: function () {
                //		$(".loader").css("display", "flex");
                //},
                success: function (data) {

                    if (data != "") {
                        $('#poselectortblbind').html('');
                        $('#poselectortblbind').html(data);

                        POSelectorDatatable();
                        //conversionRateForProject();
                        //ApplyFxRate();
                        var poids = "";
                        $('.poselector_chk').each(function () {
                            //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                            if ($(this).is(':checked')) {

                                //poids.push($(this).data('poid'));
                                poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                            }
                        });
                        $('#hdn_poid').val(poids);
                        ItemSelectortbl(poids, false);

                    }
                    else {
                        //notify(false, "Something Went Wrong.", true);
                        $('#poselectortblbind').html('');

                    }
                    //$(".loader").css("display", "none");

                }

            });

        }

        function POSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#po_selector")) {
                $('#po_selector').DataTable().clear().destroy();
            }

            $("#po_selector thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#po_selector thead");

            var table = $("#po_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,

                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },

                    { "targets": [5, 6, 7, 8, 9, 10, 11], "className": "d-none" }

                ],




                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filters th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        //cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();




                        // Handle keyup event for filtering
                        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
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
                        $('#po_selector tbody').html(
                            '<tr><td colspan="12" class="empty_cell">No data available in table</td></tr>'
                        );
                    }



                    //$('#btns').removeClass('d-flex').addClass('d-none');
                }


            });
        }

        $(document).on('click', '.redirectpoedit', function () {
            var poid = $(this).data('poid');
            var url = "/Purchaseorder/POEdit?POId=" + poid;
            window.open(url, '_blank');

        });

        function ItemSelectortbl(poids, clicked) {


            if (poids == "") {
                $('#polineitemtblbind').html('');
                var html = `
						<table id="item_selector" class="table table-striped table-hover item_selector_table" style="width:100%">
							<thead>
								<tr>
									<th>Item#</th>
									<th>PO#</th>
									<th>Description</th>
									<th>Qty</th>
									<th>Curr</th>
									<th>PO Cost</th>
									<th>Total</th>
									<th>Rem</th>
									<th>%</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td colspan="9" class="text-center">No data available </td>
								</tr>
							</tbody>
						</table>
						`;

                $('#polineitemtblbind').html(html);
                getInvoicLieneItems("");
                $('.dt-search').css("display", "none");
                //ItemSelectorDatatable();
                return;

            }

            var invoiceid = $('#hdn_invoiceid').val();
            $.ajax({
                url: "/Invoice/POLineItemSelectorBasedonPOInvEdit",
                type: "GET",
                data: { poids: poids, invoiceid: invoiceid, clicked: clicked },
                dataType: "HTML",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },

                success: function (data) {
                    if (data != "") {
                        $('#polineitemtblbind').html('');
                        $('#polineitemtblbind').html(data);
                        ItemSelectorDatatable();
                        //convRate();
                        //getInvoiceLineItems("");
                        //ApplyFxRate();
                        $(".loader").css("display", "none");

                        if (clicked == true) {
                            getInvoicLieneItems("");

                        }
                        else {

                            getInvoicLieneItems(invoiceid);
                        }
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");

                    }
                }


            });

        }
        function ItemSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#item_selector")) {
                $('#item_selector').DataTable().clear().destroy();
            }



            var table = $("#item_selector").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { "orderable": false, targets: 0 },
                    { "orderable": true, targets: "_all" },
                    { "targets": [9], "className": "d-none" }
                ],

                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even'],
                initComplete: function () {
                    //var api = this.api();

                    $('.dt-search').css("display", "none");

                },
                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#item_selector tbody').html(
                            '<tr><td colspan="10" class="empty_cell">No data available</td></tr>'
                        );
                    }
                    $('.dt-search').css("display", "none");

                }


            });
        }
        function getInvoicLieneItems(invoiceid) {
            if (invoiceid == "" || invoiceid == undefined || invoiceid == null) {

                var html = `<table id="invoice_items" class="table table-striped table-hover invoice_items_table" style="width:100%">
							<thead>
								<tr>
									<th>%</th>
									<th><a href="#">PO#</a></th>
									<th>Item #</th>
									<th>Description</th>
									<th>Qty</th>
									<th>Amount</th>
									<th>Sub Total</th>
									<th>Line Item Total</th>
								</tr>
							</thead>

							<tbody>
								<tr>
								   <td colspan="11" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invoiceitemtblbind').html('');
                $('#invoiceitemtblbind').html(html);

                return;
            }

            //var percent = $('#percentage').val();

            $.ajax({
                url: "/Invoice/GetInvoiceItemInvEdit",
                data: { Invoiceid: invoiceid, },
                dataType: "HTML",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {

                        $('#invoiceitemtblbind').html('');
                        $('#invoiceitemtblbind').html(data);
                        //calCulateOtherFields();
                        //SyncAll();
                        //convRate();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }


            });

            //ApplyFxRate();
        }

        $(document).on('click', '#invoice_items tbody tr ', function (event) {

            if ($(event.target).closest('tr').hasClass('theader')) {
                return;
            }

            // Ignore clicks on rows without .selectable class
            if (!$(event.target).hasClass('selectable')) {
                return;
            }
            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#invoice_items tbody tr').not(':hidden');
            if (event.ctrlKey) {
                currentRow.toggleClass('selectedrow');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selectedrow').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selectedrow');

                } else {

                    currentRow.addClass('selectedrow');
                }

            }
            else {

                //rows.removeClass('selectedrow');
                //currentRow.toggleClass('selectedrow');
                var ln = $('.selectedrow').length;
                var hclass = false;
                hclass = $(this).hasClass('selectedrow');

                $('.selectedrow').each(function () {
                    $(this).removeClass('selectedrow');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selectedrow');
                }
                else if (ln == 1) {
                    $(this).removeClass('selectedrow');
                }
            }

            var selectedrows = parseInt($('.selectedrow').length);
            if (selectedrows > 0) {
                $('#adjustbtn').removeClass('d-none');
            }
            else {
                $('#adjustbtn').addClass('d-none');
            }

        });

        $(document).on('click', '#item_selector tbody tr', function (event) {

            if ($(event.target).closest('a').length) {
                return;
            }

            //if ($(event.target).closest('.getotherinvoice').length) {
            //	return;
            //}
            if ($(this).find('td').length <= 1) return;

            var polids = "";

            const currentRow = $(this).closest('tr');
            const currentIndex = currentRow.index();
            const rows = $('#item_selector tbody tr').not(':hidden');
            if (event.ctrlKey) {
                //rows.removeClass('selected');
                currentRow.toggleClass('selected');
            }
            else if (event.shiftKey) {
                //const lastSelectedRow = $('#item_selector tbody tr.selected').last();
                event.preventDefault();
                const lastSelectedRow = rows.filter('.selected').last();

                if (lastSelectedRow.length) {
                    const lastIndex = lastSelectedRow.index();

                    const startIndex = Math.min(lastIndex, currentIndex);
                    const endIndex = Math.max(lastIndex, currentIndex);

                    // Select all rows in the range
                    rows.slice(startIndex, endIndex + 1).addClass('selected');

                } else {
                    currentRow.addClass('selected');
                }

            }
            else {
                var ln = $('.selected').length;
                var hclass = false;
                hclass = $(this).hasClass('selected');

                $('.selected').each(function () {
                    $(this).removeClass('selected');
                });


                if (!hclass || ln > 1 || ln == 0) {
                    $(this).addClass('selected');
                }
                else if (ln == 1) {
                    $(this).removeClass('selected');
                }


            }

            $('.selected').each(function () {
                const poliid = $(this).data('poliid');
                if (poliid) {
                    polids += (polids ? "," : "") + poliid;
                }
            });

            //console.log(polids)
        });

        $(document).on('click', '#unselectSelected', function () {

            $('.selectedrow').each(function () {
                $(this).remove();
                var poitemidinvoice = $(this).attr('data-poli');

                $('#item_selector tbody tr').each(function () {
                    var poitemidselector = $(this).data('poliid');
                    if (poitemidselector == poitemidinvoice) { $(this).removeClass('noselect'); $(this).removeClass('selected') }
                });

            });

            if ($('#invoice_items tbody tr').length === 0) {
                $('#invoice_items tbody').append('<tr><td colspan="11" class="text-center">No data available</td></tr>');
            }
            SyncAll();
        });

        $(document).on('click', '#unselectAll', function () {

            $('#invoice_items tbody tr').each(function () {
                $(this).remove();

            });

            $('#item_selector tbody tr').each(function () {
                $(this).removeClass('noselect');
                $(this).removeClass('selected');
            });

            $('#invoice_items tbody').append('<tr><td colspan="11" class="text-center">No data available</td></tr>');

            SyncAll();

        });

        $(document).on('click', '.getotherinvoice', function () {
            lineitemId = $(this).data('itemid');
            $.ajax({
                url: "/Invoice/PreviousInvoices",
                data: { POLIId: lineitemId },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {
                        $('#previnvlistbind').html('');
                        $('#previnvlistbind').html(data);
                        if ($('#tblprevinvoice tbody tr').length > 0) {
                            prevInvoiceDatatable();
                            $('#previnvoice').modal('show');
                        } else {
                            $.notify.error('Error', 'No previous invoice found.');
                        }

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    $(".loader").css("display", "none");
                }

            })
        });
        function calCulateOtherFields() {

            var TotalTax1 = 0.00;
            var TotalTax2 = 0.00;
            var TotalTax3 = 0.00;
            var TotalInvoice = 0;
            var Amount = 0.00;

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {
                $('#invoice_items tbody tr').each(function () {
                    Amount += parseFloat($(this).find('td:eq(7)').text().replace(/,/g, ""));

                    //TotalTax1 += parseFloat(isNaN($(this).find('td.d-none:eq(0) input').val()) ? 0 : $(this).find('td.d-none:eq(0) input').val());
                    //TotalTax2 += parseFloat(isNaN($(this).find('td.d-none:eq(1) input').val()) ? 0 : $(this).find('td.d-none:eq(1) input').val());
                    //TotalTax3 += parseFloat(isNaN($(this).find('td.d-none:eq(2) input').val()) ? 0 : $(this).find('td.d-none:eq(2) input').val());
                    var tax1 = $(this).find('td.d-none:eq(0) input').val()?.trim().replace(/[^0-9.]/g, '');
                    var tax2 = $(this).find('td.d-none:eq(1) input').val()?.trim().replace(/[^0-9.]/g, '');
                    var tax3 = $(this).find('td.d-none:eq(2) input').val()?.trim().replace(/[^0-9.]/g, '');

                    TotalTax1 += isNaN(parseFloat(tax1)) ? 0 : parseFloat(tax1);
                    TotalTax2 += isNaN(parseFloat(tax2)) ? 0 : parseFloat(tax2);
                    TotalTax3 += isNaN(parseFloat(tax3)) ? 0 : parseFloat(tax3);
                });

                //TotalInvoice = parseFloat(parseFloat(TotalTax1).toFixed(2) + parseFloat(TotalTax2).toFixed(2) + parseFloat(TotalTax3).toFixed(2));
                TotalInvoice = TotalTax1 + TotalTax2 + TotalTax3;
                TotalInvoice = parseFloat(TotalInvoice.toFixed(2));
                $('#txt_SubtotalInvoice').val(formatNumber(Amount));

                $('#txt_TotalTax1').val(formatNumber(isNaN(TotalTax1) ? 0 : TotalTax1));
                $('#txt_TotalTax2').val(formatNumber(isNaN(TotalTax2) ? 0 : TotalTax2));
                $('#txt_TotalTax3').val(formatNumber(isNaN(TotalTax3) ? 0 : TotalTax3));

                var ttinv = Amount + TotalInvoice;

                $('#txt_TotalInvoice').val(formatNumber(ttinv));
            }
            else {
                $('#txt_SubtotalInvoice').val(0);

                $('#txt_TotalTax1').val(0);
                $('#txt_TotalTax2').val(0);
                $('#txt_TotalTax3').val(0);
                $('#txt_TotalInvoice').val(0);
            }

        }
        function SyncAll() {

            if ($('#item_selector tbody').find('tr').eq(0).find('td').length > 1) {
                $('#item_selector tbody tr').each(function () {

                    var invoicedamount = 0;
                    var totamnt = replaceAll($(this).find("td:eq(7)").html().toString(), ',', '');
                    var poitemid = $(this).attr('data-poliid');

                    $('#invoice_items tbody').find('tr').each(function () {
                        if ($(this).attr('data-rowid') == poitemid) {
                            var p = $(this).find('td:eq(0)').find('input').val().replace(',', '');
                            p = isNaN(parseFloat(p)) ? 0 : parseFloat(p);
                            var total = $(this).attr('data-total');
                            var vl = parseFloat(total) * parseFloat(p) / 100;
                            invoicedamount += vl;
                        }
                    });

                    $(this).find("td:eq(5) input").val(formatNumber(parseFloat(totamnt) - parseFloat(invoicedamount)));

                });
                calCulateOtherFields();
            }
        }
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

        $(document).on('change', '#percentage', function () {
            var val = $(this).val()?.trim();
            var maxVal = $(this).attr('data-maxval');
            if (val == "" || val == null || val == " ") {
                $(this).val(maxVal);
                return;
            }
            parseFloat(val) > parseFloat(maxVal) ? $(this).val(maxVal) : $(this).val(val);
        });

        function prevInvoiceDatatable() {
            if ($.fn.DataTable.isDataTable("#tblprevinvoice")) {
                $('#tblprevinvoice').DataTable().clear().destroy();
            }

            var table = $("#tblprevinvoice").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: false,
                orderCellsTop: true,
                //scrollX: true,

                //columnDefs: [
                //	{ className: "dt-head-nowrap", targets: "_all" },
                //	{ "orderable": false, targets: 0 },
                //	{ "orderable": true, targets: "_all" },
                //	{ "targets": [9], "className": "d-none" }
                //],
                order: [[2, 'asc']],
                fixedHeader: true,
                "paging": false,
                stripeClasses: ['odd', 'even']




            });
        }

        $(document).on('click', '.poselector_chk', function () {

            var poids = "";
            $('.poselector_chk').each(function () {
                //poids += poids == "" ? $(this).data('poid') : "," + $(this).data('poid');
                if ($(this).is(':checked')) {

                    //poids.push($(this).data('poid'));
                    poids += poids == "" ? $(this).data('poid') : "^" + $(this).data('poid');
                }
            });

            $('#hdn_poid').val(poids);
            ItemSelectortbl(poids, true);

        });


        function fetch(poidall, invoiceid) {
            if (poidall == "" || poidall == undefined || poidall == null) {

                var html = `<table id="invoice_items" class="table table-striped table-hover invoice_items_table" style="width:100%">
							<thead>
								<tr>
									<th>%</th>
									<th><a href="#">PO#</a></th>
									<th>Item #</th>
									<th>Description</th>
									<th>Qty</th>
									<th>Amount</th>
									<th>Sub Total</th>
									<th>Line Item Total</th>
								</tr>
							</thead>

							<tbody>
								<tr>
								   <td colspan="11" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invoiceitemtblbind').html('');
                $('#invoiceitemtblbind').html(html);

                return;
            }

            var percent = $('#percentage').val();

            $.ajax({
                url: "/Invoice/GetInvoiceDataAfterSelectingInvEdit",
                data: { poli: poidall, percent: percent, Invoiceid: invoiceid },
                dataType: "HTML",
                //async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != "") {

                        $('#invoiceitemtblbind').html('');
                        $('#invoiceitemtblbind').html(data);
                        calCulateOtherFields();
                        SyncAll();
                        //convRate();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }


            });
            ApplyFxRate();
        }

        function ApplyFxRate() {
            var currentExchngRate = parseFloat($('#exchngrate').val().trim());

            if ($('#po_selector tbody').find('tr').eq(0).find('td').length > 1) {

                $('#tblPOSelector tbody tr').each(function () {
                    var remainingAmount = $(this).find('td:eq(9)').html().replace(",", "");
                    var orAmount = $(this).find('td:eq(3)').html().replace(",", "");

                    if (currentExchngRate > 0) {
                        $(this).find('td:eq(4)').html(formatNumber(parseFloat(remainingAmount * currentExchngRate).toFixed(2)));
                        $(this).find('td:eq(3)').html(formatNumber(parseFloat(orAmount * currentExchngRate).toFixed(2)));

                    }
                    //else {

                    //}

                });

            }

            if ($('#item_selector tbody').find('tr').eq(0).find('td').length > 1) {

                $('#item_selector tbody tr').each(function () {
                    var remainingAmount = $(this).find('td:eq(7)').html();
                    var orAmount = $(this).find('td:eq(6)').html();
                    remainingAmount = remainingAmount != undefined || remainingAmount != null || remaining != "" ? remainingAmount.replace(",", "") : 0;

                    if (currentExchngRate > 0) {
                        $(this).find('td:eq(8)').html(formatNumber(parseFloat(remainingAmount * currentExchngRate).toFixed(2)));
                        $(this).find('td:eq(7)').html(formatNumber(parseFloat(orAmount * currentExchngRate).toFixed(2)));
                    }
                });
            }

            //Invoice Items table logic here
            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    //calculate taxes function simplified and modified
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val().replace(',', '');
                    var quantity = $(rw).find('td:eq(4) input').val().replace(',', '');
                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var val = cost * quantity * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';
                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1val');
                    Taxtype = $(this).attr('data-Tax1type');
                    tottax1 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2val');
                    Taxtype = $(this).attr('data-Tax2type');
                    tottax2 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3val');
                    Taxtype = $(this).attr('data-Tax3type');
                    tottax3 = Taxtype == '%' ? TaxVal * val / 100 : isNaN(val) ? 0 : val;

                    //Update LineItemtotal
                    $(this).find('td:eq(7)').html(isNaN(val) ? 0 : formatNumber(val));

                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));
                });
            }

            //$('#invoice_items tbody tr td:eq(0)').val() > 100 ? $('#tblInvoiceItems tbody tr td:eq(1)').val('100') : 0;

            CalculatePercent($('#tblInvoiceItems tbody tr td:eq(1)'));

            function CalculatePercent(obj) {

                if ($(obj).val() > 100) {
                    $(obj).val('100');
                }

                if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                    $('#invoice_items tbody').find('tr').each(function () {
                        var rw = $(this);
                        var percent = $(rw).find('td:eq(0) input').val();
                        var qty = $(rw).find('td:eq(4) input').val();

                        var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                        var vl = cost * qty * percent / 100;

                        var TaxVal = '';
                        var Taxtype = '';

                        var tottax1 = 0;
                        TaxVal = $(this).attr('data-tax1Val');
                        Taxtype = $(this).attr('data-tax1type');

                        //CalculateTaxes() function logic from the old solution start
                        if (Taxtype == "%") {
                            tottax1 = (TaxVal * vl / 100);
                        }
                        else {
                            tottax1 = TaxVal;
                        }
                        tottax1 = isNaN(tottax1) ? 0 : tottax1;

                        var tottax2 = 0;
                        TaxVal = $(this).attr('data-tax2Val');
                        Taxtype = $(this).attr('data-tax2type');

                        if (Taxtype == "%") {
                            tottax2 = (TaxVal * vl / 100);
                        }
                        else {
                            tottax2 = TaxVal;
                        }
                        tottax2 = isNaN(tottax2) ? 0 : tottax2;

                        var tottax3 = 0;
                        TaxVal = $(this).attr('data-tax3Val');
                        Taxtype = $(this).attr('data-tax3type');

                        if (Taxtype == "%") {
                            tottax3 = (TaxVal * vl / 100);
                        }
                        else {
                            tottax3 = TaxVal;
                        }
                        tottax3 = isNaN(tottax3) ? 0 : tottax3;

                        $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                        $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                        $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                        $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                    });
                }


                SyncAll();
            }

        }


        $(document).on('click', '#singleSelect', function () {

            var poidall = "";
            $(document).find('.noselect').each(function () {
                if ($(this).length > 0) {

                    let poid = $(this).data('poliid');
                    if (poid != undefined) {

                        poidall += poidall == "" ? poid : "^" + poid;
                    }
                }



            });

            $(document).find('.selected').each(function () {
                //if ($(this).hasClass('selected') && !$(this).hasClass('noselect'))
                if (!$(this).hasClass('noselect')) {
                    $(this).addClass('noselect');
                }

                let poid = $(this).data('poliid');
                if (poid != undefined) {

                    poidall += poidall == "" ? poid : "^" + poid;
                }

            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            var invoiceid = $('#hdn_invoiceid').val();
            fetch(poidall, invoiceid);


        });

        $(document).on('click', '#selectall', function () {

            let poidall = "";
            $('#item_selector tbody tr').each(function () {
                // if (!$(this).hasClass('noselect')) {
                $(this).addClass('noselect');
                //let poli = $(this).attr('data-poli');
                let poli = $(this).data('poliid');
                if (poli != undefined) {

                    poidall += poidall == "" ? poli : "^" + poli;
                }
                //poidall += poidall == "" ? poid : "," + poid;
                //}
            });

            if (poidall == "" || poidall == undefined || poidall == null) return;

            var invoiceid = $('#hdn_invoiceid').val();
            fetch(poidall, invoiceid);

        });

        $(document).on('click', '#addnewterms', function () {

            if ($("#txtInvoiceTerms").val() == '') {
                $('#' + "txtInvoiceTerms").val($('#' + 'txtInvoiceTerms').val().trim());
                $('#' + 'txtInvoiceTerms').attr('placeholder', 'Invoice Terms cannot be empty.');
                $('#' + 'txtInvoiceTerms').effect("shake", { times: 2 }, 700);
                $('#' + 'txtInvoiceTerms').trigger('focus');
                $.notify.warning('Caution', 'Invoice Terms cannot be empty');
                return false;
            }
            var terms = $('#txtInvoiceTerms').val().trim();

            $.ajax({
                url: "/Invoice/TermsManagement",
                data: { Terms: terms },
                type: "POST",
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result.message);
                        var checked = $('#selectafterchecking').is(':checked');
                        $('#ddl_terms').append(`<option value="${data.Result.termsId}">${terms}</option>`);

                        if (checked) {
                            $('#ddl_terms').val(data.Result.termsId);
                        }
                        $('#txtInvoiceTerms').val('');
                        $('#selectafterchecking').prop('checked', true);
                        $('#terms_popup').modal('hide');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                }

            })


        });

        $(document).on('click', '#increaseval', function () {
            ChangeItemadjust('+');

        });

        $(document).on('click', '#decreaseval', function () {

            ChangeItemadjust('-');
        });

        function ChangeItemadjust(op) {

            var percent, qty, amnt, total, step, totalshow, newp, newtotal, remaining;
            $('.selectedrow').each(function () {
                remaining = parseFloat($(this).attr('data-remaining'));
                qty = replaceAll($(this).find('td:eq(4) input').val(), ',', '');
                amnt = replaceAll($(this).find('td:eq(5) input').val(), ',', '');
                percent = replaceAll($(this).find('td:eq(0) input').val(), ',', '');
                total = parseFloat(qty) * parseFloat(amnt) * parseFloat(percent) / 100;
                totalshow = replaceAll($(this).find('td:eq(7)').html(), ',', '');
                totalshow = parseFloat(totalshow);

                if (op == '+') {
                    newtotal = totalshow + 1 / 100;
                    totalshow = totalshow + 1 / 100;
                }

                else {
                    newtotal = totalshow - 1 / 100;
                    totalshow = totalshow - 1 / 100;

                }
                newp = 100 * newtotal / (parseFloat(qty) * parseFloat(amnt));
                if (remaining < totalshow) {
                    $.notify.warning('Caution', 'Can not exceed remaining!');
                    return;
                }
                $(this).find('td:eq(0) input').val(newp);
                $(this).find('td:eq(0) input').trigger('keyup');

            });
        }

        $(document).on('keyup', '.percentChange', function () {

            CalculatePercent($(this));
        });

        function CalculatePercent(obj) {

            if ($(obj).val() > 100) {
                $(obj).val('100');
            }

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val();
                    var qty = $(rw).find('td:eq(4) input').val();

                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var vl = cost * qty * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';

                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1Val');
                    Taxtype = $(this).attr('data-tax1type');

                    //CalculateTaxes() function logic from the old solution start
                    if (Taxtype == "%") {
                        tottax1 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax1 = TaxVal;
                    }
                    tottax1 = isNaN(tottax1) ? 0 : tottax1;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2Val');
                    Taxtype = $(this).attr('data-tax2type');

                    if (Taxtype == "%") {
                        tottax2 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax2 = TaxVal;
                    }
                    tottax2 = isNaN(tottax2) ? 0 : tottax2;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3Val');
                    Taxtype = $(this).attr('data-tax3type');

                    if (Taxtype == "%") {
                        tottax3 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax3 = TaxVal;
                    }
                    tottax3 = isNaN(tottax3) ? 0 : tottax3;

                    $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                });
            }


            SyncAll();
        }

        $(document).on('change', '#Ddl_ProjectAccount', function () {

            let accountNumber = $(this).find('option:selected').data('accountname');
            const url = `${_BaseURL}/Quickbook/GetAccountDetailsById`;
            let formData = {
                accountId: accountNumber
            };
            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result != "INVALID") {

                            $('#bnkbalance').html(data.Result);
                        }
                        else {
                            $('#bnkbalance').html('No Such Account In QBO');
                        }
                    }
                    else {
                        //console.log(data);
                        $.notify.error('Error', data.Errors[0]);
                    }
                }
            })           
        });

        $(document).on('click', '#btn_Save', function () {

            var goAhead = true;
            var ttmp = 1;
            $('#invoice_items tbody tr').each(function () {
                var ProjectAccount = $(this).find('td').eq(11).find('select').val();
                if (ProjectAccount == "0") {
                    $.notify.warning('Caution', "Row number " + ttmp + " Does not have any Project account associated.");
                    goAhead = false;
                    return;
                }
                ttmp++;
            });

            if (!goAhead) {
                return;
            }
            var i = 0;
            var probrow = new Array();

            $('#invoice_items tbody tr').each(function () {

                var total = replaceAll($(this).attr('data-remaining').replace(',', ''), ',', '');



                var t1 = 0;
                var t2 = 0;
                var t3 = 0;

                t1 = replaceAll($(this).find('td:eq(8)').find('input').val()?.replace(',', ''), ',', '');
                t2 = replaceAll($(this).find('td:eq(9)').find('input').val()?.replace(',', ''), ',', '');
                t3 = replaceAll($(this).find('td:eq(10)').find('input').val()?.replace(',', ''), ',', '');

                t1 = isNaN(parseFloat(t1)) ? 0 : parseFloat(t1);
                t2 = isNaN(parseFloat(t2)) ? 0 : parseFloat(t2);
                t3 = isNaN(parseFloat(t3)) ? 0 : parseFloat(t3);


                var vl = replaceAll($(this).find('td:eq(7)').text().replace(',', ''), ',', '');
                vl = isNaN(parseFloat(vl)) ? 0 : parseFloat(vl);


                var tottax = parseFloat(t1) + parseFloat(t2) + parseFloat(t3);



                // vl -= parseFloat(tottax);//.replace(',', '')



                i++;

                total = parseFloat(total).toFixed(2);
                vl = parseFloat(vl).toFixed(2);
                var Fxrate = $('#exchngrate').val();

                if (parseFloat(vl / Fxrate) > parseFloat(total)) {

                    probrow.push({ 'rownumber': i });
                }


            });

            var htm = '';
            var rnum = '';

            if (probrow.length > 0) {
                for (var a = 0; a < probrow.length; a++) {
                    rnum += rnum == '' ? probrow[a].rownumber : ", " + probrow[a].rownumber;


                }

                htm += 'Row number(s) ' + rnum + ' exceeding total remaining value.';
                $('#invexceedtotal_text').html(htm);
                $('#invexceedtotal').modal('show');

            }
            else {
                UpdateInvoice2();
            }

        });

        $(document).on('click', '#btn_save2', function () {
            UpdateInvoice2();
        });

        function UpdateInvoice2() {

            var goAhead = true;

            $('#invoice_items tbody tr').each(function () {
                var ProjectAccount = $(this).find('td').eq(11).find('select').val();
                if (ProjectAccount == "0") {
                    $.notify.warning('Caution', "Row number " + ($(this).index() + 1) + " Does not have any Project account associated.");
                    goAhead = false;
                    return;
                }
            });

            if (!goAhead) return;

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length <= 1) {
                $.notify.warning('Caution', 'Please Add items in Invoice first');
                return;
            }
            var InvoiceID = $('#hdn_invoiceid').val();
            var vendorId = $('#Ddl_Vendors').val()?.toString();
            var POID = $('#hdn_poid').val();

            var tmp = true;
            var i = 0;
            var probrow = 0;

            $('#invoice_items tbody tr').each(function () {
                var total = $(this).attr('data-remaining');
                var t1 = 0;
                var t2 = 0;
                var t3 = 0;

                t1 = $(this).find('td:eq(8)').find('input').val()?.trim().replace(',', '');
                t2 = $(this).find('td:eq(9)').find('input').val()?.trim().replace(',', '');
                t3 = $(this).find('td:eq(10)').find('input').val()?.trim().replace(',', '');

                t1 = isNaN(parseFloat(t1)) ? 0 : parseFloat(t1);
                t2 = isNaN(parseFloat(t2)) ? 0 : parseFloat(t2);
                t3 = isNaN(parseFloat(t3)) ? 0 : parseFloat(t3);

                var vl = replaceAll($(this).find('td:eq(7)').html().replace(',', ''), ',', '');

                vl = isNaN(parseFloat(vl)) ? 0 : parseFloat(vl);

                i++;

                total = (precise_round(total, 2));
                vl = precise_round(vl, 2);
                vl = (precise_round(vl, 2));

                if (parseFloat(vl) > parseFloat(total)) {

                    if (probrow == "0") {
                        probrow = i;
                    }



                    tmp = false;
                    return;
                }

            });

            if (probrow != "0") {
                $.notify.warning('Caution', 'Row number ' + (probrow) + ' is exceeding total remaining value.');

            }

            if (!tmp) return;

            var projectId = $('#ddl_project').val()?.toString();

            //validation start

            if (vendorId == "0" || vendorId == null) {
                $.notify.warning('Caution', 'Please Select Vendors.');
                return;
            }

            if ($('#po_selector tbody').find('tr').eq(0).find('td').length <= 1) {
                $.notify.warning('Caution', 'Please Select POs.');
                return;
            }

            if ($('#txt_InvoiceNumber').val() != '' || $('#txt_InvoiceNumber').val() != null) {
                var invonum = $("#txt_InvoiceNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the InvoiceNumber in correct format');
                    return false;

                }

            }

            if ($('#txt_InvoiceDate').val()?.trim() == '') {
                $('#' + "txt_InvoiceDate").val($('#' + 'txt_InvoiceDate').val()?.trim());
                $('#' + 'txt_InvoiceDate').attr('placeholder', 'Please insert Invoice Date.');
                $('#' + 'txt_InvoiceDate').effect("shake", { times: 2 }, 700);
                $('#' + 'txt_InvoiceDate').trigger('focus');
                $.notify.warning('Caution', 'Please insert Invoice Date.');

                return;
            }

            var InvoiceDate = $('#txt_InvoiceDate').val();
            if ($('#ddl_terms').val()?.trim() == '' || $('#ddl_terms').val()?.trim() == '0' || $('#ddl_terms').val() == null) {
                $('#ddl_terms').val($('#' + 'ddl_terms').val().trim());
                $('#ddl_terms').attr('placeholder', 'Please Select Terms.');
                $('#ddl_terms').effect("shake", { times: 2 }, 700);
                $('#ddl_terms').trigger('focus');
                $.notify.warning('Caution', 'Please check input');
                return;
            }

            var Terms = $('#ddl_terms').val();
            if ($('#Ddl_ProjectAccount').val() == '0') {
                $('#Ddl_ProjectAccount').val($('#' + 'Ddl_ProjectAccount').val()?.trim());
                $('#Ddl_ProjectAccount').attr('placeholder', 'Please Select Project Account.');
                $('#Ddl_ProjectAccount').effect("shake", { times: 2 }, 700);
                $('#Ddl_ProjectAccount').trigger('focus');
                $.notify.warning('Caution', 'Please Select Project Account.');

                return;
            }
            var projectAccount = $('#Ddl_ProjectAccount').val();
            if ($('#exchngrate').val() == '' || !$('#exchngrate').val()) {
                $.notify.warning('Caution', 'Please Add FX Rate in Invoice first');
                return;
            }
            if ($('#txt_InvoiceNumber').val()?.trim() == '') {
                $('#txt_InvoiceNumber').val($('#' + 'txt_InvoiceNumber').val()?.trim());
                $('#txt_InvoiceNumber').attr('placeholder', 'Please enter Invoice Number.');
                $('#txt_InvoiceNumber').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceNumber').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Number.');

                return;
            }

            var InvoiceNumber = escape($('#txt_InvoiceNumber').val().trim());

            if ($('#txt_TotalInvoiceAmount').val()?.replace(',', '').trim() == '0' || $('#txt_TotalInvoiceAmount').val().replace(',', '').trim() == '') {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val()?.trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Please enter Total Invoice Amount.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');
                $.notify.warning('Caution', 'Please enter Total Invoice Amount.');

                return;
            }

            var TotalInvoiceAmount = replaceAll($('#txt_TotalInvoiceAmount').val().replace(',', ''), ',', '');

            if ($('#txt_InvoiceMemo').val()?.trim() == '0') {
                $('#txt_InvoiceMemo').val($('#' + 'txt_InvoiceMemo').val()?.trim());
                $('#txt_InvoiceMemo').attr('placeholder', 'Please enter Invoice Memo.');
                $('#txt_InvoiceMemo').effect("shake", { times: 2 }, 700);
                $('#txt_InvoiceMemo').trigger('focus');
                $.notify.warning('Caution', 'Please enter Invoice Memo.');

                return;
            }
            var InvoiceMemo = $('#txt_InvoiceMemo').val();

            var SubtotalInvoice = replaceAll($('#txt_SubtotalInvoice').val().replace(',', ''), ',', '');
            SubtotalInvoice = Math.round((SubtotalInvoice * 100)) / 100;
            var TotalTax1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var TotalTax2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var TotalTax3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            var TotalInvoice = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            var TotalInvoiceor = replaceAll($('#txt_TotalInvoice').val(), ',', '');
            //TotalInvoice = parseFloat(TotalInvoice / FxRate);
            TotalInvoice = Math.round((TotalInvoice * 100)) / 100;

            if (parseFloat(TotalInvoiceAmount) != parseFloat(TotalInvoiceor)) {
                $('#txt_TotalInvoiceAmount').val($('#' + 'txt_TotalInvoiceAmount').val().trim());
                $('#txt_TotalInvoiceAmount').attr('placeholder', 'Invoice totals does not match.');
                $('#txt_TotalInvoiceAmount').effect("shake", { times: 2 }, 700);
                $('#txt_TotalInvoiceAmount').trigger('focus');

                $.notify.warning('Caution', 'Invoice total does not match with each other.');
                return;

            }

            var Exrate = replaceAll($('#exchngrate').val(), ',', '');


            let fd = {
                InvoiceNumber: InvoiceID,
                InvoiceNumberVendor: InvoiceNumber,
                InvoiceDate: InvoiceDate,
                InvoiceAmount: TotalInvoiceAmount,
                Terms: Terms,
                Memo: InvoiceMemo,
                ProjectAccount: projectAccount,
                Subtotal: SubtotalInvoice,
                VendorId: BigInt(vendorId),
                Tax1: parseFloat(TotalTax1),
                Tax2: parseFloat(TotalTax2),
                Tax3: parseFloat(TotalTax3),
                TotalInvoice: TotalInvoice,
                Exrate: parseFloat(Exrate),
                POID: POID.replace(',', '^'),


            };

            $.ajax({
                url: "/Invoice/UpdateInvoice",
                type: "POST",
                dataType: "JSON",
                data: fd,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        var InvoiceItems = new Array();
                        var InvoiceID = data.Result.invoiceID;

                        if (InvoiceID === '0') {
                            $.notify.error('Error', 'Can not update, duplicate invoicenumber exists');
                            $(".loader").css("display", "none");
                            return;
                        }

                        $('#invoice_items tbody tr').each(function () {

                            var Percentage = $(this).find('td').eq(0).find('.percentChange').val()?.replace(',', '');
                            Percentage = isNaN(parseFloat(Percentage)) ? 0 : parseFloat(Percentage);

                            var PONumber = $(this).find('td').eq(1).text();
                            var ItemNumber = $(this).find('td').eq(2).text();
                            var Spec = $(this).find('td').eq(12).text();
                            var Description = $(this).find('td').eq(3).html();
                            //var Note = $(this).find('td').eq(6).find('input[type="text"]').val();
                            var Qty = $(this).find('td').eq(4).find('input[type="text"]').val().replace(',', '');
                            Qty = isNaN(parseFloat(Qty)) ? 0 : parseFloat(Qty);

                            var Amount = $(this).find('td').eq(5).find('input').val().replace(',', '');
                            Amount = isNaN(parseFloat(Amount)) ? 0 : parseFloat(Amount);
                            var Tax1 = $(this).find('td').eq(8).find('input[type="text"]').val()?.replace(',', '');
                            Tax1 = isNaN(parseFloat(Tax1)) ? 0 : parseFloat(Tax1);

                            var Tax2 = $(this).find('td').eq(9).find('input[type="text"]').val()?.replace(',', '');
                            Tax2 = isNaN(parseFloat(Tax2)) ? 0 : parseFloat(Tax2);


                            var Tax3 = $(this).find('td').eq(10).find('input[type="text"]').val()?.replace(',', '');
                            Tax3 = isNaN(parseFloat(Tax3)) ? 0 : parseFloat(Tax3);


                            var Taxes = parseFloat(Tax1) + parseFloat(Tax2) + parseFloat(Tax3);

                            Taxes = parseFloat(Taxes).toFixed(2);

                            var LineItemTotal = $(this).find('td').eq(7).text().replace(',', '');

                            LineItemTotal = Math.round((LineItemTotal * 100)) / 100;
                            var ProjectAccount = $(this).find('td').eq(11).find('select').val();
                            var POLineItemID = $(this).attr('data-poli');

                            InvoiceItems.push({
                                PurchaseOrderNumber: PONumber,
                                POLineItemID: POLineItemID,
                                POLineItemNumber: ItemNumber,
                                Percent: Percentage,
                                Spec: Spec,
                                Description: Description,
                                Note: "",
                                Quantity: Qty,
                                Amount: Amount,
                                Tax1: Tax1,
                                Tax2: Tax2,
                                Tax3: Tax3,
                                Tax: Taxes,
                                LineItemTotal: LineItemTotal,
                                ProjectAccount: ProjectAccount,
                                InvoiceID: Number(InvoiceID),
                            });

                        });

                        if (InvoiceItems.length == 0) return;

                        $.ajax({
                            url: "/Invoice/SaveInvoiceItems",
                            type: "POST",
                            data: JSON.stringify(InvoiceItems),
                            dataType: "JSON",
                            contentType: 'application/json',
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                if (data.IsSuccess) {
                                    $.notify.success('Success', '"Updated Invoice.');
                                    setTimeout(function () {
                                        irrrrr = 0;
                                        window.location.reload();
                                    }, 3000);

                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);

                                }
                                $(".loader").css("display", "none");

                            },
                            error: function (error) {
                                console.error(error);
                                $(".loader").css("display", "none");
                            }
                        });
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }

                    $(".loader").css("display", "none");
                }

            });

        }

        function precise_round(num, dec) {

            if ((typeof num !== 'number') || (typeof dec !== 'number'))
                return false;

            var num_sign = num >= 0 ? 1 : -1;

            return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
        }

        $(document).on('click', '#btn_void', function () {

            if ($(this).hasClass('inactivenow')) return;

            var invoiceNumber = $('#hdn_invoiceid').val();

            $.confirm({
                title: '',
                message: 'Do you want to void this invoice?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/VoidInvoice",
                        data: { invoiceId: invoiceNumber },
                        type: "POST",
                        dataType: "JSON",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                setTimeout(function () {
                                    window.location.reload();
                                }, 4000);

                            }
                            else {

                                // Do nothing like the old one.
                            }
                            $(".loader").css("display", "none");

                        }

                    });
                },
                onCancel: function () {

                }
            });
       

        });

        $(document).on('click', '#btn_delete', function () {

            if ($(this).hasClass('inactivenow')) return;

            var invoiceNumber = $('#hdn_invoiceid').val();

            $.confirm({
                title: '',
                message: 'Do you want to delete this invoice?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/DeleteInvoice",
                        data: { invoiceId: invoiceNumber },
                        type: "POST",
                        dataType: "JSON",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {

                            if (data.IsSuccess) {
                                $.notify.success('Success', data.Result);
                                setTimeout(function () {
                                    var urld = '/Invoice/invoicesearch';
                                    window.location.href = urld;
                                }, 4000);

                            }
                            else {
                                $.notify.error('Error', 'Something went wrong');

                            }
                            $(".loader").css("display", "none");

                        }
                    });
                },
                onCancel: function () {                    
                }
            });

        });

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        $(document).on('keyup', '.setQty', function () {

            if ($('#invoice_items tbody').find('tr').eq(0).find('td').length > 1) {

                $('#invoice_items tbody').find('tr').each(function () {
                    var rw = $(this);
                    var percent = $(rw).find('td:eq(0) input').val();
                    var qty = $(rw).find('td:eq(4) input').val();

                    var cost = replaceAll($(rw).find('td:eq(5) input').val(), ',', '');
                    var vl = cost * qty * percent / 100;

                    var TaxVal = '';
                    var Taxtype = '';

                    var tottax1 = 0;
                    TaxVal = $(this).attr('data-tax1Val');
                    Taxtype = $(this).attr('data-tax1type');

                    //CalculateTaxes() function logic from the old solution start
                    if (Taxtype == "%") {
                        tottax1 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax1 = TaxVal;
                    }
                    tottax1 = isNaN(tottax1) ? 0 : tottax1;

                    var tottax2 = 0;
                    TaxVal = $(this).attr('data-tax2Val');
                    Taxtype = $(this).attr('data-tax2type');

                    if (Taxtype == "%") {
                        tottax2 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax2 = TaxVal;
                    }
                    tottax2 = isNaN(tottax2) ? 0 : tottax2;

                    var tottax3 = 0;
                    TaxVal = $(this).attr('data-tax3Val');
                    Taxtype = $(this).attr('data-tax3type');

                    if (Taxtype == "%") {
                        tottax3 = (TaxVal * vl / 100);
                    }
                    else {
                        tottax3 = TaxVal;
                    }
                    tottax3 = isNaN(tottax3) ? 0 : tottax3;

                    $(this).find('td:eq(7)').html(isNaN(vl) ? 0 : formatNumber(vl));
                    $(this).find('td:eq(8)').find('input').val(formatNumber(tottax1));
                    $(this).find('td:eq(9)').find('input').val(formatNumber(tottax2));
                    $(this).find('td:eq(10)').find('input').val(formatNumber(tottax3));

                });
            }


            SyncAll();
        });

        $(document).on('keyup', '#txt_TotalTax1, #txt_TotalTax2, #txt_TotalTax3', function () {
            calculatefortaxfields();
        });
        function calculatefortaxfields() {
            var st = replaceAll($('#txt_SubtotalInvoice').val(), ',', '');
            var t1 = replaceAll($('#txt_TotalTax1').val(), ',', '');
            var t2 = replaceAll($('#txt_TotalTax2').val(), ',', '');
            var t3 = replaceAll($('#txt_TotalTax3').val(), ',', '');


            if (t1 == '') {
                t1 = 0;
                $('#txt_TotalTax1').val(0);
            }
            if (t2 == '') {
                t2 = 0;
                $('#txt_TotalTax2').val(0);
            }
            if (t3 == '') {
                t3 = 0;
                $('#txt_TotalTax3').val(0);
            }

            var tot = parseFloat(st) + parseFloat(t1) + parseFloat(t2) + parseFloat(t3);

            $('#txt_TotalInvoice').val(formatNumber(tot));
        }


    }
    // #endregion

}); 