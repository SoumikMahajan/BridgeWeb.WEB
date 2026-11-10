$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const QueryParameter = window.location.pathname.split("/");
    const action_name = QueryParameter[2].toLocaleLowerCase();

    // #region :: Manual Payment Search
    if (action_name === "manualpaymentsearch") {

        const pageLength = parseInt(window._UserPreferences["DataTable.PageLength"]) || 50;

        $("#Ddl_Vendors").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
        });

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

        $('#fromsearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd'

        });

        $('#tosearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy.mm.dd'
        });

        PayementTableOnpageLoad();

        function PayementTableOnpageLoad() {

            $('#paymentlistonLoad').dataTable({
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
                        $('#paymentlistonLoad tbody').html(
                            '<tr><td colspan="11" class="empty_cell text-center">No data available in table</td></tr>'
                        );
                    }
                    $('.dt-search').css('display', 'none');
                },
                drawCallback: function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).data();

                    if (rows.length === 0) {
                        $('#paymentlistonLoad tbody').html(
                            '<tr><td colspan="11" class="empty_cell text-center">No data available in table</td></tr>'
                        );
                    }
                }
            });

            // Listen to page length change event
            $('#paymentlistonLoad').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });

        }

        function PaymentSearchonClick(prevPN) {
            var fromdate = $('#fromsearch').val();
            var todate = $('#tosearch').val();
            var VendorIDs = $("#Ddl_Vendors").val()?.join(",");
            var PaymentTypeID = $("#Ddl_PaymentType").val();
            var BankAccountId = $("#DDl_Bank").val();
            var PaymentNumber = $("#txtPaymentNumber").val();
            if (prevPN == "" || prevPN == null) {
                if (VendorIDs == null || VendorIDs == "0") {
                    $.notify.warning('Caution', 'Please select Vendor');
                    return;
                }
            }
            $('#paymentlistonLoad').css('display', 'none');
            $('#paymentlistonLoad').DataTable().clear().destroy();
            let fd = {};

            //if (prevPN == "" || prevPN == null) {

            $('#payment_listredirected').DataTable().clear().destroy();
            if (prevPN == "" || prevPN == null) {
                fd = {
                    PaymentTypeID: PaymentTypeID,
                    BankAccountID: BankAccountId,
                    PaymentNumber: PaymentNumber,
                    fromdate: fromdate,
                    todate: todate,
                    VendorID: VendorIDs
                }
            }
            else {
                fd.previousPN = prevPN;
            }
            $.ajax({
                url: "/Invoice/PaymentSearchTable",
                type: "GET",
                data: fd,
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#paymenttbl').html('');
                        $('#paymenttbl').html(data);
                        PaymentListDataTable();
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }

            });

        }

        function PaymentListDataTable() {
            if ($.fn.DataTable.isDataTable("#payment_list")) {
                $('#payment_list').DataTable().clear().destroy();
            }
            $("#payment_list thead tr")
                .clone(true)
                .addClass("filtersinvoice")
                .appendTo("#payment_list thead");

            var table = $("#payment_list").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: true,
                orderCellsTop: true,
                scrollX: true,
                "order": [[1, "desc"]],
                "pageLength": pageLength,
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



                            if (colIdx != 0 && colIdx != 9) {
                                $(cell).html(
                                    '<input type="text" class="form-control srch" placeholder="🔍 Search..." />'
                                );
                            }

                            else if (colIdx == 9) {
                                $(cell).html(
                                    `<select class= "form-control srch"">
								<option value="">All</option>
								<option value="Void">Void</option>
								<option value="Pending">Pending</option>
								<option value="Posted">Posted</option>

								</select>`
                                );
                            }
                            // For other columns, add input elements



                            // On every keypress in this input
                            //$(
                            //	"input",
                            //	$(".filtersinvoice th").eq($(api.column(colIdx).header()).index())
                            //)
                            //	.off("keyup input paste")
                            //	.on("keyup input paste", function () {
                            //		// Get the search value
                            //		$(this).attr("title", $(this).val());
                            //		var regexr = "({search})";

                            //		// Search the column for that value
                            //		api
                            //			.column(colIdx)
                            //			.search(
                            //				this.value !== ""
                            //					? regexr.replace("{search}", "(((" + this.value + ")))")
                            //					: "",
                            //				this.value !== "",
                            //				this.value === ""
                            //			)
                            //			.draw();
                            //	});

                            $('.srch').on('keyup change', function () {

                                //var indx = $(this).eq($(api.column(colIdx).header()).index());
                                var colIdx = $(this).closest('th').index();
                                var txt = this.value;
                                table
                                    .column(colIdx)
                                    .search(txt)
                                    .draw();

                            });
                        });

                    $('.dt-search').css('display', 'none');
                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#payment_list tbody').html(
                            '<tr><td colspan="11" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }

            });

            // Listen to page length change event
            $('#payment_list').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on('click', '#payemtdetailsadvcbtn', function () {
            PaymentSearchonClick("");
        });

        var previd = $('#prevpaymentids').val();
        if (previd != "" && previd != null) {
            PaymentSearchonClick(previd);
        }


        $(document).on('click', '#payment_list tbody tr', function (event) {

            if ($(event.target).closest('.chkMultipleQBO, .notclickable').length) {
                return;
            }

            $('#btnStopPayment').hide();
            $('#Editable_Div').find('a').addClass('d-none');

            var status = $(this).data('status');
            var PaymentID = $(this).data('id');
            var amt = $(this).find('td:eq(8)').text();
            var pnumbaer = $(this).find('td:eq(5)').text();
            var cid = $(this).data('cid');
            var ptype = $(this).find('td:eq(4)').text();

            if (cid != 0) {
                $('#Editable_Div').find('a').removeClass('d-none');
            }


            switch (status) {
                case 'Void':
                    $('#btnsendpayment').hide();
                    //$('#btnsendpayment').off('click');
                    $('#btnvoidpayment').hide();
                    //$('#btnvoidpayment').off('click');
                    $('#btndeletepayment').show();
                    //$('#btndeletepayment').off('click');
                    break;
                case 'Pending':
                    if (cid == '0' && pnumbaer != "") {
                        $('#btnStopPayment').show();
                    }
                    $('#btnUpdatePayment').show();
                    $('#btnsendpayment').show();
                    $('#btnsendpayment').off('click');
                    $('#btnvoidpayment').show();
                    $('#btndeletepayment').show();
                    break;
                case 'Posted':
                    if (amt < 0) {
                        $('#btnUpdatePayment').show();
                        $('#btnsendpayment').hide();
                        //$('#btnsendpayment').off('click');
                        $('#btnvoidpayment').show();
                        //$('#btnvoidpayment').off('click');
                        $('#btndeletepayment').show();
                        //$('#btndeletepayment').off('click');
                    }
                    else {
                        $('#btnUpdatePayment').show();
                        if (cid == '0' && pnumbaer != "") {
                            $('#btnStopPayment').show();
                        }
                        $('#btnsendpayment').hide();
                        //$('#btnsendpayment').off('click');
                        $('#btnvoidpayment').show();
                        //$('#btnvoidpayment').off('click');
                        $('#btndeletepayment').show();
                        //$('#btndeletepayment').off('click');
                    }
                    break;

                case 'Printed':
                    $('#btnUpdatePayment').show();
                    if (amt > 0) {
                        if (cid == '0' && pnumbaer != "" && ptype == 'Cheque') {
                            $('#btnStopPayment').show();
                        }
                    }
                    $('#btnsendpayment').hide();
                    //$('#btnsendpayment').off('click');
                    $('#btnvoidpayment').show();
                    //$('#btnvoidpayment').off('click');
                    $('#btndeletepayment').hide();
                    //$('#btndeletepayment').off('click');
                    break;
            }

            if (parseFloat(amt) < 0) {
                $('#btnStopPayment').hide();
            }

            $.ajax({
                url: "/Invoice/EditPaymentModal",
                data: { PaymentId: PaymentID },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#paymentdetailsdatabind').html('');
                        $('#paymentdetailsdatabind').html(data);
                        $('#txt_EditPaymentDate').datepickercustom({
                            changeMonth: true,
                            changeYear: true,
                            dateFormat: 'MM dd yy',

                        });
                        $('#hdnEditPayment').val(PaymentID);
                        PaymentItemsDataTable(PaymentID);
                        $('#edit_payment_modal').modal('show');
                        $(".loader").css("display", "none");

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }

                }

            });


        });

        function PaymentItemsDataTable(ManualPaymentID) {
            $.ajax({
                url: "/Invoice/PaymentItemTable",
                data: { ManualPaymentID: ManualPaymentID },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != null) {
                        $('#paymentitemdetials').html('');
                        $('#paymentitemdetials').html(data);

                        $('#edit_payment_table').dataTable({
                            //pageLength: 50,
                            "paging": false,
                            "orderCellsTop": false,
                            "order": [],
                            "columnDefs": [
                                { "orderable": false, "targets": [4, 5, 6] }
                            ],
                            initComplete: function () {
                                $('.dt-search').css('display', 'none');
                            },


                            drawCallback: function (settings) {
                                var api = this.api();
                                if (api.rows({ page: 'current' }).data().length === 0) {
                                    $('#edit_payment_table tbody').html(
                                        '<tr><td colspan="7" class="empty_cell">No data available in table</td></tr>'
                                    );
                                }
                            }
                        });

                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }
                }

            })
        }

        $(document).on('click', '#btnhistory', function () {
            $('#payment_history_modal').modal('hide');
            var paymentId = $('#hdnEditPayment').val();

            $.ajax({
                url: "/Invoice/PaymentHistory",
                data: { ManualPaymentID: paymentId },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#paymenthistorybind').html('');
                        $('#paymenthistorybind').html(data);
                        PaymentHistoryDataTable();
                        $('#payment_history_modal').modal('show');
                        $(".loader").css("display", "none");

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }

                }

            });

        });

        function PaymentHistoryDataTable() {
            if ($.fn.DataTable.isDataTable("#payment_history_table")) {
                $('#payment_history_table').DataTable().clear().destroy();
            }
            $("#payment_history_table thead tr")
                .clone(true)
                .addClass("filterpaymenthistory")
                .appendTo("#payment_history_table thead");

            var table = $("#payment_history_table").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: true,
                orderCellsTop: true,
                scrollX: true,
                "order": false,
                "pageLength": pageLength,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },


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
                            var cell = $(".filterpaymenthistory th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();



                            //if (colIdx != 0) {
                            //	$(cell).html(
                            //		'<input type="text" class="form-control srch" placeholder="' +
                            //		title +
                            //		'" />'
                            //	);
                            //}

                            if (colIdx == 0) {
                                $(cell).html(
                                    '<button id="resetfields" class="offwhite_btn">Reset</button>'
                                );
                            }
                            else {
                                $(cell).html(
                                    '<input type="text" class="form-control srch" placeholder="🔍 Search..." />'
                                );
                            }

                            $('.srch').on('keyup change', function () {

                                //var indx = $(this).eq($(api.column(colIdx).header()).index());
                                var colIdx = $(this).closest('th').index();
                                var txt = this.value;
                                table
                                    .column(colIdx)
                                    .search(txt)
                                    .draw();

                            });

                        });

                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#payment_history_table tbody').html(
                            '<tr><td colspan="3" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }

            });

            // Listen to page length change event
            $('#payment_history_table').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on("click", "#resetfields", function () {

            $(".filterpaymenthistory .srch").val("");

            // Clear search for each column and redraw the table
            var table = $("#payment_history_table").DataTable();
            table.columns().search("").draw();
        });

        $(document).on('click', '.viewicon', function () {

            var FldId = $(this).data('id');
            var mode = $(this).data('mode');

            var userName = $(this).find('td:eq(0)').text();
            var date = $(this).find('td:eq(2)').text();

            if (mode == "itemupdatedetails") {
                $('#headerupdatedetails').text(`${userName}-Update - ${date}`);
            }


            $.ajax({
                url: "/Invoice/PaymentUpdateandItemUpdateDetails",
                data: { FldID: FldId, mode: mode },
                type: "GET",
                dataType: "HTML",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#paymentanditemupdatebind').html('');
                        $('#paymentanditemupdatebind').html(data);
                        paymentitemsupdatedetailsDatatable();
                        $(".loader").css("display", "none");

                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");
                    }

                }

            });

        });

        function paymentitemsupdatedetailsDatatable() {
            if ($.fn.DataTable.isDataTable("#updatepaymentdetailstbl")) {
                $('#updatepaymentdetailstbl').DataTable().clear().destroy();
            }
            $("#updatepaymentdetailstbl thead tr")
                .clone(true)
                .addClass("filtertbl")
                .appendTo("#updatepaymentdetailstbl thead");

            var table = $("#updatepaymentdetailstbl").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                paging: true,
                orderCellsTop: true,
                scrollX: true,
                "order": [[2, "asc"]],
                "pageLength": pageLength,
                columnDefs: [
                    { className: "dt-head-nowrap", targets: "_all" },
                    { className: "dt-center", targets: [1, 2] },


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
                            var cell = $(".filtertbl th").eq(
                                $(api.column(colIdx).header()).index()
                            );
                            var title = $(cell).text();

                            $(cell).html(
                                '<input type="text" class="form-control srch" placeholder="🔍 Search..." />'
                            );


                            $('.srch').on('keyup change', function () {

                                //var indx = $(this).eq($(api.column(colIdx).header()).index());
                                var colIdx = $(this).closest('th').index();
                                var txt = this.value;
                                table
                                    .column(colIdx)
                                    .search(txt)
                                    .draw();

                            });

                        });

                },

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#updatepaymentdetailstbl tbody').html(
                            '<tr><td colspan="3" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }

            });

            // Listen to page length change event
            $('#updatepaymentdetailstbl').on('length.dt', function (e, settings, len) {
                const preferences = [];
                preferences.push({
                    PreferenceKey: 'DataTable.PageLength',
                    PreferenceValue: len.toString()
                });

                SetProjectPreference(preferences);
            });
        }

        $(document).on('click', '#btnvoidpayment', function () {
            let ManualPaymentId = $('#hdnEditPayment').val();
            $.ajax({
                url: "/Invoice/VoidPayment",
                data: { ManualPaymentId: ManualPaymentId },
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: async function (data) {
                    if (data.IsSuccess) {
                        const PaymentId = data.Result;
                        const response = await ChangePaymentQbo(PaymentId);
                        if (response.success) {
                            $.notify.success('Success', 'Payment successfully voided!');
                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }
                        else {
                            $.notify.error('Error', response.error);
                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }
                }
            });
        });

        async function ChangePaymentQbo(PaymentId) {
            try {
                const response = await $.ajax({
                    url: "/Quickbook/ChangePayment",
                    type: "POST",
                    data: { PaymentId: PaymentId },
                    dataType: "json"
                });
                return { success: true, data: response };
            } catch (error) {
                return { success: false, error: error };
            }
        }

        $(document).on('click', '#btnStopPayment', function () {

            var paymentId = $('#hdnEditPayment').val();

            $.confirm({
                title: 'Warning',
                message: 'Do you want to reverse the payment ?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/ReversePayment",
                        data: { PaymentId: paymentId },
                        type: "GET",
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                debugger;
                                var newPayid = data.Result.paymentid;
                                var Status = data.Result.status;
                                var amt = data.Result.amount;
                                var cid = data.Result.cid;
                                var pnumber = data.Result.pnumber;
                                $.notify.success('Success', 'Saving and sending data to reverse payment.');
                                debugger;

                                ReversePayment(newPayid, "0", amt, Status)
                                    .then(function () {

                                        $.confirm({
                                            title: 'Warning',
                                            message: 'The data has been saved. Do you want to send the data to QBO right now?',
                                            type: 'warning',
                                            confirmText: 'Continue',
                                            cancelText: 'Go Back',
                                            onConfirm: function () {
                                                ReversePayment(newPayid, "1");
                                            }
                                        });

                                    })
                                    .catch(function (err) {
                                        console.error(err);
                                    });

                                // ReversePayment(newPayid, "0", amt, Status);
                                // debugger;
                                // //GetEditPaymentModalDataonRevise(newPayid, Status, amt, cid, pnumber, "Reverse Payment");
                                // $.confirm({
                                //     title: 'Warning',
                                //     message: 'The data has been saved.Do you want to send the data to QBO right now?',
                                //     type: 'warning',
                                //     confirmText: 'Continue',
                                //     cancelText: 'Go Back',
                                //     onConfirm: function () {
                                //         ReversePayment(newPayid, "1","","");
                                //     },
                                //     onCancel: function () {
                                //         return;
                                //     }
                                // });

                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");

                            }

                        }

                    });
                },
                onCancel: function () {
                    return;
                }
            });

        });

        function ReversePayment(paymentId, mode, amount, status) {
            debugger;
            $('#btnStopPayment').hide();

            // let status;
            let cancelId = 0;
            // let amount;
            let ptype = '';
            let pnumber = '';
            $('#payment_list tbody tr').each(function () {
                const id = $(this).data('id');
                if (id == paymentId) {
                    cancelId = $(this).data('cid');
                    status = $(this).data('status');
                    ptype = $(this).find('td').eq(4).text().trim();
                    pnumber = $(this).find('td').eq(5).text().trim();
                    amount = parseFloat($(this).find('td').eq(8).text().trim());
                }
            });
            //$('#hdn_manualpaymentid').val(paymentId);
            switch (status) {
                case 'Void':
                    $('#btnsendpayment').hide();
                    $('#btnvoidpayment').hide();
                    $('#btndeletepayment').show();
                    break;
                case 'Pending':
                    if (cancelId == '0' && pnumber != "") {
                        $('#btnStopPayment').show();
                    }
                    $('#btnUpdatePayment').show();
                    $('#btnsendpayment').show();
                    $('#btnsendpayment').attr('data-mode', '1');
                    $('#btnvoidpayment').show();
                    $('#btndeletepayment').show();
                    break;
                case 'Posted':
                    if (amount < 0) {
                        $('#btnUpdatePayment').show();
                        $('#btnsendpayment').hide();
                        $('#btnvoidpayment').show();
                        $('#btndeletepayment').show();
                    }
                    else {
                        $('#btnUpdatePayment').show();
                        if (cancelId == '0' && pnumber != "") {
                            $('#btnStopPayment').show();
                        }
                        $('#btnsendpayment').hide();
                        $('#btnvoidpayment').show();
                        $('#btndeletepayment').show();
                    }
                    break;
                case 'Printed':
                    $('#btnUpdatePayment').show();
                    if (amount > 0 && cancelId == '0' && pnumber != "" && ptype == 'Cheque') {
                        $('#btnStopPayment').show();
                    }
                    $('#btnsendpayment').hide();
                    $('#btnvoidpayment').show();
                    $('#btndeletepayment').hide();
                    break;
            }

            if (parseFloat(amount) < 0) {
                $('#btnStopPayment').hide();
            }

            //$("#hdnEditPayment").val(paymentId);
            return populateBankAccount(paymentId)
                .then(() => gatPaymentDetailsByPaymentId(paymentId, mode))
                .then(({ paymentId, mode }) => getPaymentItemDetailsByPaymentId(paymentId, mode))
                .then(({ mode }) => {
                    if (mode !== "1") {
                        return null;
                    }

                    $('#qboModal').modal('show');
                    return checkQBO();
                })
                .then(bankAccountId => {
                    if (!bankAccountId) return;
                    return checkQBOBankAccount(bankAccountId);
                });
        }

        // function GetEditPaymentModalDataonRevise(payid, status, amount, cid, pnumber, ptype) {
        //     $('#btnStopPayment').hide();

        //     var status = status;
        //     var PaymentID = payid;
        //     var amt = amount;

        //     switch (status) {
        //         case 'Void':
        //             $('#btnsendpayment').hide();
        //             $('#btnvoidpayment').hide();
        //             $('#btndeletepayment').show();
        //             break;
        //         case 'Pending':
        //             if (cid == '0' && pnumber != "") {
        //                 $('#btnStopPayment').show();
        //             }

        //             $('#btnUpdatePayment').show();
        //             $('#btnsendpayment').show();
        //             $('#btnsendpayment').off('click');
        //             $('#btnvoidpayment').show();

        //             $('#btndeletepayment').show();


        //             break;
        //         case 'Posted':
        //             if (amt < 0) {
        //                 $('#btnUpdatePayment').show();
        //                 $('#btnsendpayment').hide();
        //                 $('#btnvoidpayment').show();
        //                 $('#btndeletepayment').show();
        //             }
        //             else {

        //                 $('#btnUpdatePayment').show();
        //                 if (cid == '0' && pnumber != "") {
        //                     $('#btnStopPayment').show();
        //                 }

        //                 $('#btnsendpayment').hide();
        //                 $('#btnvoidpayment').show();
        //                 $('#btndeletepayment').show();
        //             }
        //             break;

        //         case 'Printed':
        //             $('#btnUpdatePayment').show();

        //             if (amt > 0) {
        //                 if (cid == '0' && pnumber != "" && ptype == 'Cheque') {
        //                     $('#btnStopPayment').show();
        //                 }
        //             }
        //             $('#btnsendpayment').hide();
        //             $('#btnvoidpayment').show();
        //             $('#btndeletepayment').hide();
        //             break;
        //     }

        //     if (parseFloat(amt) < 0) {
        //         $('#btnStopPayment').hide();
        //     }

        //     $.ajax({
        //         url: "/Invoice/EditPaymentModal",
        //         data: { PaymentId: PaymentID },
        //         type: "GET",
        //         dataType: "HTML",
        //         beforeSend: function () {
        //             $(".loader").css("display", "flex");
        //         },
        //         success: function (data) {
        //             if (data != "") {
        //                 $('#paymentdetailsdatabind').html('');
        //                 $('#paymentdetailsdatabind').html(data);
        //                 $('#txt_EditPaymentDate').datepickercustom({
        //                     changeMonth: true,
        //                     changeYear: true,
        //                     dateFormat: 'MM dd yy',

        //                 });
        //                 $('#hdnEditPayment').val(PaymentID);
        //                 PaymentItemsDataTable(PaymentID);
        //                 $('#edit_payment_modal').modal('show');
        //                 PaymentSearchonClick("");
        //                 $(".loader").css("display", "none");

        //                 $.confirm({
        //                     title: 'Warning',
        //                     message: 'The data has been saved.Do you want to send the data to QBO right now?',
        //                     type: 'warning',
        //                     confirmText: 'Continue',
        //                     cancelText: 'Go Back',
        //                     onConfirm: function () {
        //                         //call qbocheck function
        //                     },
        //                     onCancel: function () {
        //                         return;
        //                     }
        //                 });
        //             }
        //             else {
        //                 $.notify.error('Error', 'Something went wrong');
        //                 $(".loader").css("display", "none");
        //             }

        //         }

        //     });

        // }

        $(document).on('click', '#btnUpdatePayment', function () {
            debugger;
            if ($("#txt_EditPaymentDate").val() == '') {
                $.notify.warning('Caution', 'Please Select Payment Date!');
                return false;
            }

            if ($("#Ddl_EditPaymentType").val() == '-1') {
                $.notify.warning('Caution', '"Please Select Payment Type!');
                return false;
            }

            if ($("#DDl_EditBank").val() == '0') {
                $.notify.warning('Caution', 'Please Select Bank Account!');
                return false;
            }

            if ($("#Ddl_EditPaymentType").val() == '1' && $("#txtEditPaymentNumber").val() == '' || $("#txtEditPaymentNumber").val() == null) {
                $.notify.warning('Caution', 'Please Enter Payment Number!');
                return false;
            }

            let fd = {
                ManualPaymentID: $('#hdnEditPayment').val(),
                PaymentDate: $('#txt_EditPaymentDate').val(),
                PaymentType: $("#Ddl_EditPaymentType").val(),
                BankAccountID: $("#DDl_EditBank").val(),
                PaymentNumber: $("#txtEditPaymentNumber").val(),
                TotalPayment: $("#txtEditTotalAmount").val(),
                Memo: $("#txtEditMemo").val(),
                ConvRate: $("#txtEditExrate").val(),
                ConvRate2: $('#txtEditExrate1').val(),
            }



            $.ajax({
                url: "/Invoice/UpdatePaymentMainDetails",
                data: fd,
                type: "POST",
                dataType: "json",
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data.IsSuccess) {
                        //Update PaymentItems function call.
                        UpdatePaymentItems();

                        var result = data.Result;

                        if (result != 0) {
                            //sync QBO
                            $.confirm({
                                title: 'Proceed',
                                message: `This payment is associated with a QBO Payment, Do you want to update to QBO?`,
                                type: 'confirm',
                                confirmText: 'Yes, Proceed',
                                cancelText: 'Cancel',
                                onConfirm: function () {
                                    $.notify.success('Success', 'Payment successfully updated');
                                    $(".loader").css("display", "none");

                                    deleteCookie("UPDATEQBO");
                                    setCookie("UPDATEQBO", result);
                                    EditPayment($("#hdnEditPayment").val(), "1");
                                    return;
                                },
                                onCancel: function () {
                                    $.notify.success('Success', 'Payment successfully updated');
                                    $(".loader").css("display", "none");
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 4000);
                                }
                            });
                        }
                        else {
                            $.notify.success('Success', 'Payment successfully updated');
                            $(".loader").css("display", "none");
                            setTimeout(function () {
                                window.location.reload();
                            }, 4000);
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                        $(".loader").css("display", "none");
                    }

                },
                error: function () {
                    notify('QBO is not accessible/Some error occuurred!');
                    setTimeout(function () {
                        window.location.reload();
                    }, 4000);
                }


            })


        });

        function UpdatePaymentItems() {

            let fd = [];

            $("#edit_payment_table tbody tr").each(function () {
                var InvoiceAmount = $(this).find("td:eq(6)").find("input[type=text]").val();
                var PaymentItemID = $(this).find("td:eq(0)").data('paymentid');

                fd.push({
                    FldID: PaymentItemID.toString(),
                    InvoiceAmount: InvoiceAmount
                });

            });

            $.ajax({
                url: "/Invoice/UpdatePaymentItemDetails",
                data: JSON.stringify(fd),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.Result == 'Error') {
                        $.notify.error('Error', 'Something went wrong');
                        $(".loader").css("display", "none");

                    }

                }

            });

        }

        function EditPayment(paymentId, mode) {
            debugger;
            $('#btnStopPayment').hide();

            let status;
            let cancelId = 0;
            let amount;
            let ptype = '';
            let pnumber = '';
            $('#payment_list tbody tr').each(function () {
                const id = $(this).data('id');
                if (id == paymentId) {
                    cancelId = $(this).data('cid');
                    status = $(this).data('status');
                    ptype = $(this).find('td').eq(4).text().trim();
                    pnumber = $(this).find('td').eq(5).text().trim();
                    amount = parseFloat($(this).find('td').eq(8).text().trim());
                }
            });
            //$('#hdn_manualpaymentid').val(paymentId);
            switch (status) {
                case 'Void':
                    $('#btnsendpayment').hide();
                    $('#btnvoidpayment').hide();
                    $('#btndeletepayment').show();
                    break;
                case 'Pending':
                    if (cancelId == '0' && pnumber != "") {
                        $('#btnStopPayment').show();
                    }
                    $('#btnUpdatePayment').show();
                    $('#btnsendpayment').show();
                    $('#btnsendpayment').attr('data-mode', '1');
                    $('#btnvoidpayment').show();
                    $('#btndeletepayment').show();
                    break;
                case 'Posted':
                    if (amount < 0) {
                        $('#btnUpdatePayment').show();
                        $('#btnsendpayment').hide();
                        $('#btnvoidpayment').show();
                        $('#btndeletepayment').show();
                    }
                    else {
                        $('#btnUpdatePayment').show();
                        if (cancelId == '0' && pnumber != "") {
                            $('#btnStopPayment').show();
                        }
                        $('#btnsendpayment').hide();
                        $('#btnvoidpayment').show();
                        $('#btndeletepayment').show();
                    }
                    break;
                case 'Printed':
                    $('#btnUpdatePayment').show();
                    if (amount > 0 && cancelId == '0' && pnumber != "" && ptype == 'Cheque') {
                        $('#btnStopPayment').show();
                    }
                    $('#btnsendpayment').hide();
                    $('#btnvoidpayment').show();
                    $('#btndeletepayment').hide();
                    break;
            }

            if (parseFloat(amount) < 0) {
                $('#btnStopPayment').hide();
            }

            //$("#hdnEditPayment").val(paymentId);
            populateBankAccount(paymentId)
                .then(() => gatPaymentDetailsByPaymentId(paymentId, mode))
                .then(({ paymentId, mode }) => getPaymentItemDetailsByPaymentId(paymentId, mode))
                .then(({ mode }) => {
                    if (mode !== "1") {
                        return null;
                    }

                    $('#qboModal').modal('show');
                    return checkQBO();
                })
                .then(bankAccountId => {
                    if (!bankAccountId) return;
                    console.log("bankAccountId_"+ bankAccountId);
                    return checkQBOBankAccount(bankAccountId);
                })
                .catch(err => console.error(err));
        }

        $(document).on('click', '.sync-qbo', async function () {

            let row = $(this);
            let qboid = row.attr('data-qboid');
            let poNumber = row.attr('data-number');
            let amount = parseFloat(row.attr('data-amount'));

            $('#qbStatus').html('Fetching information from QBO for ' + poNumber + '. Please wait... ');
            $('#qboDetailsModal').modal('show');

            let tableheader = `<thead>
								<tr>
									<th style='display:none;'>Action</th>
									<th>Check #</th>
									<th style='display:none;'>Status</th>
									<th>Vendor</th>
									<th  class='rightposition'>Total</th>
								</tr>
							</thead> <tbody>`;

            let response = await SyncPaymentWithQBO(qboid, amount);
            //console.log(response);
            if (response && response.IsSuccess) {

                if (response.Result.length == 0) {
                    $.notify.error('Error', 'Could not update payment!');
                    $('#qboDetailsModal').modal('hide');
                    return;
                }

                const result = response.Result;
                if (result.QBOID == "") {
                    row = row.parent();
                    row.html('-');
                    row.prev('td').html('Pending');
                    $('#qboDetailsModal').modal('hide');
                    return;
                }
                let total = 0;
                for (let i = 0; i < result.length; i++) {
                    total += parseFloat(result[i].Total);
                    if (result[i].Status == "Voided") {
                        tableheader += `<tr>
										<td>${result[i].CheckNumber}</td>
										<td style='display:none;'>${result[i].Status}</td>
										<td>${result[i].Vendor}</td>
										<td class='rightposition'>${result[i].Total}</td>
									</tr>`;
                    }
                    else {
                        tableheader += `<tr data-SystemToken='${result[i].SystemToken}' data-SyncToken='${result[i].SyncToken}' data-QBOID='${result[i].QBOID}' >
										<td>${result[i].CheckNumber}</td>
										<td style='display:none;'>${result[i].Status}</td>
										<td>${result[i].Vendor}</td>
										<td class='rightposition'>${result[i].Total}</td>
									</tr>`;
                    }
                }

                tableheader += `<tr><td colspan='2' style='text-align:right;'>Total:</td><td style='text-align:right;'>${total}</td> </tr> </tbody>`;
                let table = `<table id='qboDetailsTable' class='table' style='width:100%'>${tableheader}</table>`;
                $('#qbStatus').html('');
                $('#qbStatus').html(table);

                if (result[0].CheckNumber == '' || result[0].CheckNumber == '-') {
                    $('#qbStatus').html('Not yet printed');
                    row.prev('span').html('Not Printed');
                }
                else {
                    $('#qbStatus').html('Payment number is: ' + result[0].CheckNumber);
                    row.prev('span').html(result[0].CheckNumber);
                }

                setTimeout(function () {
                    $('#qboDetailsModal').modal('hide');
                }, 2000);

            }
            else {
                $.notify.error('Error', 'Could not update payment!');
                setTimeout(function () {
                    $('#qboDetailsModal').modal('hide');
                }, 5000);
            }
        });

        $(document).on('click', '#btnSyncPayment', async function () {

            const selectedrows = $('#payment_list tbody tr').filter(function () {
                return $(this).find('.chkMultipleQBO').is(':disabled');
            }).toArray();

            if (selectedrows.length <= 0) {
                return;
            }

            $.confirm({
                title: 'Sync All Payments?',
                message: 'Are you sure, you want to Sync all payments? This may take some time depending on the number of payments.?',
                type: 'warning',
                confirmText: 'Yes, Sync Now',
                cancelText: 'Cancel',
                onConfirm: async function () {
                    $('#qboDetailsModal').modal('show');
                    $('#qbStatus').html('');
                    $('#qbStatus').html("Syncing data from QBO. Please wait...");

                    let count = 0;

                    //const rows = $('#payment_list tbody tr').toArray();

                    const rows = $('#payment_list tbody tr').filter(function () {
                        return $(this).find('.chkMultipleQBO').is(':disabled');
                    }).toArray();

                    for (const row of rows) {

                        const $row = $(row);

                        const hasIcons = $row.find('td:eq(10) i').length > 0;
                        if (!hasIcons)
                            continue;

                        const qboid = $row.data('id');
                        const amount = parseFloat($row.find('td:eq(8)').text());

                        const response = await SyncPaymentWithQBO(qboid, amount);

                        if (response?.IsSuccess && response.Result.length > 0) {

                            const result = response.Result;
                            const checknum = result[0]?.CheckNumber;

                            if (checknum == '' || checknum == '-') {
                                $row.find('td:eq(10) span').html('Not Printed');
                            }
                            else {
                                $row.find('td:eq(10) span').html(checknum);
                            }

                            count++;
                        }
                    }

                    $.notify.success('Success', `Synced ${count} payment(s).`);
                    $('#qboDetailsModal').modal('hide');

                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                },
                onCancel: function () {
                }
            });
        });

        async function SyncPaymentWithQBO(qboid, amount) {
            try {
                let response = await $.ajax({
                    url: "/Quickbook/SyncPaymentNumber",
                    type: "POST",
                    data: { PaymentId: qboid, Amount: amount },
                    dataType: "json"
                });
                return response;
            } catch (error) {
                console.error("Error syncing payment with QBO:", error);;
                $.notify.error('Error', 'Error syncing payment with QBO');
            }
        }

        $(document).on('click', '#btndeletepayment', function () {

            let ManualPaymentId = $('#hdnEditPayment').val();

            $.confirm({
                title: 'Delete',
                message: 'Are you sure you want to delete this payment?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Invoice/Deletepayment",
                        data: { ManualPaymentId: ManualPaymentId },
                        type: "POST",
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: async function (data) {
                            if (data.IsSuccess) {

                                const PaymentId = data.Result;
                                const res = await DeletePaymentQbo(PaymentId);
                                if (res.success) {
                                    $.notify.success('Success', 'Payment successfully deleted.');
                                    setTimeout(function () {
                                        location.reload();
                                    }, 4000);
                                }
                                else {
                                    $.notify.error('Error', res.error);
                                }
                                $(".loader").css("display", "none");
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                                $(".loader").css("display", "none");
                            }
                        }
                    });
                },
                onCancel: function () {

                }
            });


        });

        async function DeletePaymentQbo(PaymentId) {
            try {
                const response = await $.ajax({
                    url: "/Quickbook/DeletePayment",
                    type: "POST",
                    data: { PaymentId: PaymentId, mode: "DELETE" },
                    dataType: "json"
                });
                return { success: true, data: response };
            } catch (error) {
                return { success: false, error: error };
            }
        }

        let selectedIds = [];
        let currsendingindx = 0;
        let ismultiplepayment = false;

        $(document).on('change', '.chkMultipleQBO', function () {
            const isChecked = $(this).is(':checked');
            const tr = $(this).closest('tr');
            const id = tr.data('id');
            const cid = tr.data('cid');
            const status = tr.data('status');
            const ptype = tr.find('td').eq(4).text().trim();
            const pnumber = tr.find('td').eq(5).text().trim();
            const amount = parseFloat(tr.find('td').eq(8).text().trim());

            if (isChecked) {
                if (!selectedIds.some(item => item.id === id)) {
                    selectedIds.push({ id, status, cid, amount, ptype, pnumber });
                }
            } else {
                selectedIds = selectedIds.filter(item => item.id !== id);
            }
            let count = selectedIds.length;
            if (count > 0) {
                $('#spanNoOfQBO').text("Send " + count + " payment(s) to QBO");
                $('#btnUpdateCheckedQBO').removeClass('d-none');
                $('#btnUncheck').removeClass('d-none');
            }
            else {
                $('#btnUpdateCheckedQBO').addClass('d-none');
                $('#btnUncheck').addClass('d-none');
            }
        });

        $(document).on('click', '#btnUncheck', function () {
            $('.chkMultipleQBO').prop('checked', false).trigger('change');
            selectedIds = [];
            $('#spanNoOfQBO').text('');
            $('#btnUpdateCheckedQBO').addClass('d-none');
            $('#btnUncheck').addClass('d-none');
        });

        $(document).on('click', "#btnUpdateCheckedQBO", SendMultiplePayments);


        let hasQboError = false;
        function SendMultiplePayments() {
            if (currsendingindx < selectedIds.length) {
                debugger;
                $.notify.success('Success', `Sending Payment ${currsendingindx + 1} / ${selectedIds.length}`);
                setTimeout(function () {
                    ismultiplepayment = true;
                    let { id } = selectedIds[currsendingindx++];
                    $(`#payment_list tbody tr[data-id="${id}"]`).trigger('click');
                    setTimeout(() => {
                        EditPayment(id, "1");
                    }, 300);
                }, 100);
            } else {
                debugger;
                currsendingindx = 0;
                selectedIds = [];
                ismultiplepayment = false;

                if (hasQboError) {
                    $.notify.warning('Warning','Batch processing completed. One or more payments could not be sent to QBO.');
                }
                else {
                    $.notify.success('Success',`Sent all Payments to QBO successfully.`);

                }

                hasQboError = false;

                setTimeout(function () {
                    location.reload();
                }, 4000);
            }
        }



        function populateBankAccount(paymentId) {
            return new Promise((resolve, reject) => {
                $(".loader").css("display", "flex");
                $.ajax({
                    url: "/Invoice/PopulateBankAccount",
                    type: "GET",
                    data: { PaymentId: paymentId },
                    dataType: "json"
                })
                    .done((response) => {
                        const data = response;
                        if (data.IsSuccess) {
                            $('#DDl_EditBank').empty();
                            data.Result.forEach(function (v) {
                                let option = `<option data-bankname='${v.bank_Account}' data-currid='${v.currencyID}' value='${v.fld_ID}'>${v.bankAccountName}</option>`;
                                $('#DDl_EditBank').append(option);
                            });
                        }
                        resolve();
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        console.warn("AJAX error:", errorThrown);
                        reject("AJAX failed: " + errorThrown);
                    })
                    .always(() => $(".loader").css("display", "none"));
            });
        }

        function gatPaymentDetailsByPaymentId(paymentId, mode) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/Invoice/GetInvoiceDetails",
                    type: "GET",
                    data: { PaymentId: paymentId },
                    dataType: "json"
                })
                    .done((response) => {
                        const data = response;
                        data.Result.forEach((v) => {
                            $('#Ddl_EditPaymentType').val(v.paymentType);
                            $('#DDl_EditBank').val(v.bankAccountID);
                            $('#txt_EditPaymentDate').datepickercustom({
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'MM dd yy',
                            }).datepicker("setDate", new Date(v.paymentDate));
                            $('#txtEditPaymentNumber').val(v.paymentNumber);
                            $('#txtEditTotalAmount').val(v.totalPayment);
                            $('#txtEditTotalAmount').val(v.totalPayment);
                            $('#txtEditExrate').val(v.convRate);
                            $('#txtEditExrate1').val(v.convRate2);
                            $('#txtEditMemo').val(v.memo);

                            $('#hdnEditPaymentType').val(v.paymentType);
                            $('#hdnEditBankAccount').val(v.bankAccountID);
                            $('#hdnEditPaymentNumber').val(v.paymentNumber);
                        });

                        resolve({ paymentId, mode });
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        console.warn("AJAX error:", errorThrown);
                        reject("AJAX failed: " + errorThrown);
                    });
            });
        }

        function getPaymentItemDetailsByPaymentId(paymentId, mode) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/Invoice/GetPaymentItemDetailsByPaymentId",
                    type: "GET",
                    data: { PaymentId: paymentId },
                    dataType: "json"
                })
                    .done((response) => {
                        const data = response;
                        if ($.fn.DataTable.isDataTable('#edit_payment_table')) {
                            $('#edit_payment_table').DataTable().destroy();
                            $('#edit_payment_table tbody').empty();
                        }
                        let html = data.Result.map((v) => {
                            return `<tr data-invoiceid='${v.invoicenumber}' data-brigervendorid='${v.parentvendor_id}'>
                                <td data-paymentid='${v.fldid}'>${v.legalname}</td>
                                <td><a href='/Invoice/InvoiceEdit/${v.invoicenumber}' target='_blank'>${v.invoicenumbervendor}</a></td>
                                <td>${v.invoiceDate}</td>
                                <td>${v.terms}</td>
                                <td>${v.currencycode}</td>
                                <td>${v.amountOwing}</td>
                                <td><input type="text" class="form-control right-txt" value="${v.invoiceAmountPaid}"></td>
                            </tr>`;
                        }).join('');

                        $('#edit_payment_table tbody').html(html);
                        $('#edit_payment_table').dataTable({
                            "paging": false,
                            "orderCellsTop": false,
                            "order": [],
                            "columnDefs": [
                                { "orderable": false, "targets": [4, 5, 6] }
                            ],
                            initComplete: function () {
                                $('.dt-search').css('display', 'none');
                            },
                            drawCallback: function (settings) {
                                let api = this.api();
                                if (api.rows({ page: 'current' }).data().length === 0) {
                                    $('#edit_payment_table tbody').html(
                                        '<tr><td colspan="7" class="empty_cell">No data available in table</td></tr>'
                                    );
                                }
                            }
                        });

                        resolve({ paymentId, mode });
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        console.warn("AJAX error:", errorThrown);
                        reject("AJAX failed: " + errorThrown);
                    });
            });
        }

        function checkQBO() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let bankAccountId = $('#DDl_EditBank option:selected').attr('data-bankname');

                    $('#qbCheck').html(
                        `<span id="bnkchk">
                            Checking Bank Account - ${bankAccountId}
                            <i class="fa fa-spinner fa-spin mrg5L"></i>
                        </span>`
                    );

                    resolve(bankAccountId);
                }, 300);
            });
            // setTimeout(() => {
            //     let bankAccountId = $('#DDl_EditBank option:selected').attr('data-bankname');
            //     $('#qbCheck').html("<span id='bnkchk'>Checking Bank Account- " + bankAccountId + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');

            //     return new Promise((resolve) => {
            //         resolve(bankAccountId);
            //     });
            // }, 300);
        }

        function checkQBOBankAccount(bankAccountId) {
            $.ajax({
                url: "/Quickbook/CheckBankAccount",
                type: "GET",
                data: { accountId: bankAccountId },
                dataType: "json"
            })
                .done((response) => {
                    const data = response;
                    if (data.Result == 'Unauthorized-401') {
                        $.notify.error('Error', 'Unauthorized access to QBO. System not yet authorized to use any QB account');
                        let htm = '<i style="color:red;" class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
                        $('#qbCheck').html(htm + " Unauthorized access to QBO.");
                        setTimeout(function () {
                            $('#qboModal').modal('hide');
                        }, 5000);
                    }
                    else if (data.Result != "INVALID") {
                        let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                        $('#qbCheck').html(htm + bankAccountId + " Balance:" + data.Result.split('^^^')[0]);
                        $('#DDl_EditBank').attr('data-qboid', data.Result.split('^^^')[1]);
                        let invoices = new Array();

                        $('#edit_payment_table tbody tr').each(function () {
                            let invoiceid = $(this).attr('data-invoiceid');
                            let obj = $(this);
                            $.ajax({
                                type: "GET",
                                url: '/Invoice/GetAllInvoiceAccounts',
                                data: { InvoiceId: invoiceid },
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: false,
                                success: function (res) {
                                    const data = res;
                                    const result = data.Result;
                                    for (let a = 0; a < result.length; a++) {
                                        let accountname = result[a].accountNumber;
                                        let accountdesc = result[a].description;
                                        invoices.push({ 'accountname': accountname, 'accountdesc': accountdesc });
                                        obj.attr('data-accountname', accountname);
                                        obj.attr('data-accountdesc', accountdesc);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log("AJAX error:", errorThrown);
                                }
                            });
                        });

                        setTimeout(() => {
                            invoiceAccountCheck(invoices);
                        }, 500);
                    }
                    else {
                        let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $('#qbCheck').html(htm + bankAccountId + " does not exist.");
                        setTimeout(function () {
                            $.notify.error('Error', 'QBO Validation error');
                            $('#qboModal').modal('hide');
                        }, 3000);

                        if (ismultiplepayment) {
                            SendMultiplePayments();
                        }
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log("AJAX error:", errorThrown);
                });
        }

        let indexAccountCheck = 0;
        function invoiceAccountCheck(obj) {
            let accountName = obj[indexAccountCheck].accountname;
            let accountDescription = obj[indexAccountCheck].accountdesc;
            let name = `${accountName}-${accountDescription}`;

            $('#qbCheck').append(`<br /><span id='invchk_${indexAccountCheck}'>Checking Invoice Account -${name} <i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>`);

            $.ajax({
                url: "/Quickbook/CheckInvoiceAccount",
                data: { AccountId: accountName },
                type: "GET",
                dataType: "json"
            })
                .done((res) => {
                    const data = res;
                    if (data.Result != "INVALID") {
                        let balance = data.Result.split('^^^')[0];
                        let accountid = data.Result.split("^^^")[1];
                        let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid=""></i>';
                        $(`#invchk_${indexAccountCheck}`).html(`${htm} ${name}  Balance: ${balance}`);
                        $('#edit_payment_table tbody tr').each(function () {
                            const obj = $(this);
                            let accountnamenow = obj.attr('data-accountname');
                            if (accountnamenow == accountName) {
                                obj.attr('data-accountid', accountid);
                            }
                        });

                        setTimeout(() => {
                            indexAccountCheck++;
                            if (obj.length > indexAccountCheck) {
                                invoiceAccountCheck(obj);
                            }
                            else {
                                indexAccountCheck = 0;
                                vendorLoad();
                            }
                        }, 300);

                    }
                    else {
                        let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $(`#invchk_${indexAccountCheck}`).html(`${htm} ${name} does not exist.`);

                        setTimeout(function () {
                            $.notify.error('Error', 'QBO Validation error');
                            $('#qboModal').modal('hide');
                            if (ismultiplepayment) {
                                SendMultiplePayments();
                            }
                        }, 3000);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.warn("AJAX error:", errorThrown);
                    $.notify.error('Error', 'QBO is not accessible/Some error occuurred!');
                    setTimeout(function () {
                        location.reload();
                    }, 4000);
                });
        };

        function vendorLoad() {
            let vnames = new Array();
            $('#edit_payment_table tbody tr').each(function () {
                let vname = $(this).find('td:eq(0)').html();
                let vcurr = $(this).find('td:eq(4)').html();
                let VLegalName = $(this).find('td:eq(0)').html();
                let tmp = 0;
                for (let i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        tmp++;
                    }
                }
                if (tmp == 0) {
                    vnames.push({ 'vname': vname, 'vcurr': vcurr, 'VLegalName': VLegalName });
                }
            });
            qbCheckVendor(vnames);
        }

        let indexCheckVendor = 0;
        async function qbCheckVendor(vnames) {
            let cr = $('#DDl_EditBank option:selected').attr('data-currid');
            let bridge_name = vnames[indexCheckVendor].vname;
            let name = `${bridge_name} ( ${cr} )`;
            let name2 = `${vnames[indexCheckVendor].VLegalName} ${cr}`;

            $('#qbCheck').append("<br /><span id='vndchk_" + indexCheckVendor + "'>Checking Vendor- " + bridge_name + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');

            let formData = {
                Name: bridge_name,
                VendorName: name2,
                Curr: cr
            };

            try {
                const response = await $.ajax({
                    url: "/Quickbook/CheckVendor",
                    type: "POST",
                    data: formData,
                    dataType: "json",
                    cache: false
                });

                if (response.IsSuccess) {
                    if (response.Result != "INVALID" && response.Result != "0") {
                        const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + response.Result + '"></i>';

                        $('#vndchk_' + indexCheckVendor).html(htm + name);
                        let vendorid = response.Result;
                        $('#edit_payment_table tbody tr').each(function () {
                            let obj = $(this);
                            let vendorname = obj.find('td:eq(0)').html();
                            if (vendorname == vnames[indexCheckVendor].vname) {
                                obj.attr('data-vendorid', vendorid);
                                let currncy = $('#DDl_EditBank option:selected').attr('data-currid');
                                obj.attr('data-vendorcurr', currncy);
                            }
                        });

                        setTimeout(() => {
                            indexCheckVendor++;
                            if (vnames.length > indexCheckVendor) {
                                qbCheckVendor(vnames);
                            }
                            else {
                                indexCheckVendor = 0;
                                qbGenerateCheck();
                            }
                        }, 300);
                    }
                    else if (response.Result != "0") {
                        $('#vndchk_' + indexCheckVendor).html('Creating Vendor- ' + name2 + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i>');

                        const saveResponse = await $.ajax({
                            url: "/Quickbook/SaveVendor",
                            type: "POST",
                            data: formData,
                            dataType: "json",
                            cache: false
                        });

                        if (saveResponse.IsSuccess) {
                            let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + saveResponse.Result + '"></i>';
                            $('#vndchk_' + indexCheckVendor).html(htm + "New vendor created - " + name + "");
                            let vendorid = saveResponse.Result;
                            $('#edit_payment_table tbody tr').each(function () {
                                let obj = $(this);
                                let vendorname = obj.find('td:eq(0)').html();
                                if (vendorname == vnames[indexCheckVendor].vname) {
                                    obj.attr('data-vendorid', vendorid);
                                    obj.attr('data-vendorcurr', cr);
                                }
                            });

                            setTimeout(() => {
                                indexCheckVendor++;
                                if (vnames.length > indexCheckVendor) {
                                    qbCheckVendor(vnames);
                                }
                                else {
                                    indexCheckVendor = 0;
                                    qbGenerateCheck();
                                }
                            }, 300);
                        }
                        else {
                            $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                        }

                    }
                    else if (response.Result == "0") {

                        let currncy = $('#DDl_EditBank option:selected').attr('data-currid');
                        const savedata = { Curr: currncy };

                        const saveResponse = await $.ajax({
                            url: "/Quickbook/CheckandSaveVendor",
                            type: "POST",
                            data: savedata,
                            dataType: "json",
                            cache: false
                        });

                        if (saveResponse.IsSuccess) {
                            if (saveResponse.Result == "0") {
                                $.notify.error('Error', 'Payment exists for this vendor');
                                $('#qboModal').modal('hide');
                                if (ismultiplepayment) {
                                    SendMultiplePayments();
                                }
                                return;
                            }
                            let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + saveResponse.Result + '"></i>';
                            $('#vndchk_' + indexCheckVendor).html(htm + name);
                            let vendorid = saveResponse.Result;

                            $('#edit_payment_table tbody tr').each(function () {
                                const obj = $(this);
                                let vendorname = $(obj).find('td:eq(0)').html();
                                if (vendorname == vnames[indexCheckVendor].vname) {
                                    $(obj).attr('data-vendorid', vendorid);
                                    let currncy = $('#DDl_EditBank option:selected').attr('data-currid');
                                    $(obj).attr('data-vendorcurr', currncy);
                                }
                            });

                            setTimeout(() => {
                                indexCheckVendor++;
                                if (vnames.length > indexCheckVendor) {
                                    qbCheckVendor(vnames);
                                }
                                else {
                                    indexCheckVendor = 0;
                                    qbGenerateCheck();
                                }
                            }, 300);

                            return;
                        }
                        else {
                            $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                        }
                    }
                }
                else {
                    $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                }
            }
            catch (e)
            {
                console.error('AJAX error:', e);
                $.notify.error('Error', 'QBO is not accessible/Some error occuurred!');
            }
        }

        let indexFinalInvoice = 0;
        async function qbGenerateCheck() {
            debugger;
            $.notify.success('Success', 'QBO Validation completed successfully');
            $('#qboModal').modal('hide');
            $('#qbgeratemodal').modal('show');

            const vnames = [];

            $('#edit_payment_table tbody tr').each(function () {
                let vname = $(this).find('td:eq(0)').html();
                let vcurr = $(this).find('td:eq(4)').html();
                let BridgeVendorID = $(this).attr('data-brigervendorid');
                let VLegalName = $(this).find('td:eq(0)').html();

                let tmp = 0;
                for (let i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        tmp++;
                    }
                }
                if (tmp == 0) {
                    vnames.push({ 'vname': vname, 'vcurr': vcurr, 'BridgeVendorID': BridgeVendorID, 'VLegalName': VLegalName });
                }
            });

            let hasError = false;

            for (indexFinalInvoice = 0; indexFinalInvoice < vnames.length; indexFinalInvoice++) {
                debugger;
                const result = await generateFinalInvoice(vnames[indexFinalInvoice], indexFinalInvoice, vnames.length);
                if (!result) {
                    hasError = true;
                }
            }
            indexFinalInvoice = 0;

            setTimeout(function () {
                $('#qbsendinfo').html('');
                $('#qbgeratemodal').modal('hide');
                $('#edit_payment_modal').modal('hide');
            }, 1000);

            const currid = returncurrentoperationidforqbosendbatch();
            if (currid != '0') {
                if (hasError) {
                    $.notify.warning('Warning','Some cheques failed to send. Generating the next payment.');
                }
                else {
                    $.notify.success('Success','Please Wait, Generating next cheque.');
                }

                setTimeout(function () {
                    EditPayment(currid, "1");
                }, 2000);
            }
            else {
                if (hasError) {
                    $.notify.warning('Warning','Completed processing. Some cheques failed to send to QBO.');
                }
                else {
                    $.notify.success('Success','Successfully sent data to QBO');
                }
                
                setTimeout(function () {
                    if (ismultiplepayment) {
                        SendMultiplePayments();
                    }
                    else {
                        window.location.reload();
                    }
                }, 3000);
            }

        }
        
        function generateFinalInvoice(vendor, index, totalVendor) {
            debugger;

            return new Promise((resolve, reject) => {

                const vname = vendor.vname;
                const vcurr = vendor.vcurr;
                const BridgeVendorID = vendor.BridgeVendorID;
                debugger;
                if ($('#qbsendinfo').html() != '') {
                    $('#qbsendinfo').append("<br /><span id='finalsendinvoice_" + index + "'>Generating Payment for -" + vname + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');
                }
                else {
                    $('#qbsendinfo').append("<span id='finalsendinvoice_" + index + "'>Generating Payment for -" + vname + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');
                }

                setTimeout(() => {

                    let total = 0;
                    let allTotal = 0;
                    let vendorid = '';
                    let vendornewcurr = '';

                    const items = [];

                    $('#edit_payment_table tbody tr').each(function () {
                        const obj = $(this);
                        let vnamenow = $(this).find('td:eq(0)').html();

                        if (vname == vnamenow) {

                            vendorid = obj.attr('data-vendorid');
                            vendornewcurr = obj.attr('data-vendorcurr');
                            let vl = parseFloat(obj.find('td:eq(6)').find('input').val());

                            if (vcurr != vendornewcurr || 1 > 0) {
                                let tmpcrate = $('#txtEditExrate').val();
                                total = parseFloat(tmpcrate) * vl;
                                allTotal += parseFloat(tmpcrate) * vl;
                                items.push({
                                    'AccountId': obj.attr('data-accountid'),
                                    'Description': obj.attr('data-accountdesc'),
                                    'Total': total.toString()
                                });
                            }
                            else {
                                vendorid = obj.attr('data-vendorid');
                                let tmpcrate = $('#txtEditExrate').val();
                                total = parseFloat(tmpcrate) * vl;
                                allTotal += parseFloat(tmpcrate) * vl;

                                items.push({
                                    'AccountId': obj.attr('data-accountid'),
                                    'Description': obj.attr('data-accountdesc'),
                                    'Total': total.toString()
                                });
                            }
                        }
                    });

                    let checknumber = $('#txtEditPaymentNumber').val();
                    if (totalVendor > 1) {
                        checknumber += "/" + (index + 1);
                    }

                    const invobject = {};
                    invobject.Paymentdate = $('#txt_EditPaymentDate').val();
                    invobject.Bank = $('#DDl_EditBank').attr('data-qboid');
                    invobject.Checknumber = checknumber;
                    invobject.Memo = $('#txtEditMemo').val();
                    invobject.Total = allTotal.toString();
                    invobject.Items = items;
                    invobject.VendorID = vendorid;
                    invobject.VendorCurrency = vendornewcurr;
                    invobject.BankCurr = $('#DDl_EditBank option:selected').attr('data-currid');
                    invobject.ExchangeRate = $('#txtEditExrate').val();
                    invobject.BridgeVendorID = BridgeVendorID;
                    invobject.BridgePaymentID = $("#hdnEditPayment").val();
                    invobject.MailingAddress = "hi";
                    invobject.Type = $('#Ddl_EditPaymentType option:selected').text();

                    setTimeout(async function () {
                        try {
                            let UpdatedId = getCookie("UPDATEQBO");
                            deleteCookie("UPDATEQBO");
                            debugger;
                            const response = await $.ajax({
                                url: `${_BaseURL}/Quickbook/SenddataToQBO?UpdatedId=${UpdatedId}`,
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(invobject),
                                cache: false,
                                processData: false,
                                dataType: 'json'
                            });

                            if (response.IsSuccess && response.Result != "INVALID") {
                                debugger;
                                let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                                $('#finalsendinvoice_' + index).html(htm + "Cheque(" + checknumber + ") generated for -" + vname + "");

                                resolve(true);
                            }
                            else {  
                                hasQboError = true;
                                let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                                $('#finalsendinvoice_' + index).html(htm + "Unable to send Cheque(" + checknumber + ") to QBO");

                                resolve(false);
                            }
                        } catch (e) {
                            console.error(e);
                            hasQboError = true;
                            let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                            $('#finalsendinvoice_' + index).html(htm + "Unable to send Cheque(" + checknumber + ") to QBO");

                            resolve(false);
                        }
                    }, 300);

                }, 300);

            })

        }

        function returncurrentoperationidforqbosendbatch() {
            let tmp = getCookie("checker");
            let tmp2 = '';
            let rtn = '0';

            for (let a = 0; a < tmp.split(',').length; a++) {
                if (a == 0) {
                    rtn = tmp.split(',')[a];
                }
                else {
                    tmp2 += tmp2 == "" ? tmp.split(',')[a] : ',' + tmp.split(',')[a];
                }
            }
            deleteCookie("checker");
            if (tmp != '') {
                setCookie("checker", tmp2, 3);
            }
            else {
                rtn = '0';
            }
            return rtn;
        }

        $(document).on('click', "#btnsendpayment", function () {
            let paymentId = $('#hdnEditPayment').val();
            EditPayment(paymentId, "1");
        });
    }
    // #endregion

}); 