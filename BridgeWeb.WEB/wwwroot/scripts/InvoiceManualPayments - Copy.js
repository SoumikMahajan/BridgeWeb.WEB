$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const QueryParameter = window.location.pathname.split("/");
    const action_name = QueryParameter[2].toLocaleLowerCase();

    // #region :: Manual Payment
    if (action_name === "manualpayment") {

        deleteCookie('isSendToQBO');

        let isDirty = false;

        $(document).on('change keyup', '#manual_payment_form input, #manual_payment_form select, #manual_payment_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        let ManualPaymentIdArray = Array();

        $('#PrjtDdl').multipleSelect({
            filter: true,
            showClear: false,
            placeholder: 'Please Select',
            filterPlaceholder: 'Enter Keyword',
            single: true,
        });

        $('#txt_PaymentDate').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'MM dd yy',

        }).datepicker("setDate", new Date());

        currencyddlchange();
        GetProjectAccount();
        invoiceSelectortbl();
        async function currencyddlchange() {
            var projectId = $('#PrjtDdl').val()?.toString();
            if (projectId == "0") {
                $('#CurrDdl').empty();
                $('#CurrDdl').html('<option value="0">No Currency</option>');
                return;
            }
            try {
                $(".loader").css("display", "flex");
                let response = await $.ajax({
                    url: "/Invoice/GetCurrency",
                    type: "GET",
                    data: { ProjectId: projectId },
                    dataType: "json",
                });

                if (response.IsSuccess) {
                    $('#CurrDdl').empty();

                    for (var item of response.Result) {
                        $('#CurrDdl').append(`<option value="${item.currencyId}">${item.currency}</option>`);
                    }
                    //invoiceSelectortbl();
                }
                else {
                    $('#CurrDdl').empty();
                    $('#CurrDdl').html('<option value="0">No Currency</option>');
                }

                await invoiceSelectortbl();
            } catch (error) {
                console.error("Error sending data:", error);
            } finally {
                $(".loader").css("display", "none");
            }


            //$.ajax({
            //	url: "/Invoice/GetCurrency",
            //	type: "GET",
            //	data: { ProjectId: projectId },
            //	dataType: "json",
            //	beforeSend: function () {
            //		$(".loader").css("display", "flex");
            //	},
            //	success: function (data) {
            //		if (data.IsSuccess) {
            //			$('#CurrDdl').empty();

            //			for (var item of data.Result) {
            //				$('#CurrDdl').append(`<option value="${item.currencyId}">${item.currency}</option>`);
            //			}
            //			//invoiceSelectortbl();
            //		}
            //		else {
            //			$('#CurrDdl').empty();
            //			$('#CurrDdl').html('<option value="0">No Currency</option>');
            //		}
            //		//$(".loader").css("display", "none");

            //	},
            //	error: function (error) {
            //		console.error(error);
            //		$(".loader").css("display", "none");

            //	},
            //	complete: function () {
            //		$(".loader").css("display", "none");

            //	}
            //});

        }

        $(document).on('change', '#PrjtDdl', async function () {

            if ($(this).find('option:selected').val() == "0") {
                $('#txtPaymentNumber').val('CR-');
                invoiceSelectortbl();
            }

            await currencyddlchange();
            GetProjectAccount();
            calculateexrate();
            //invoiceSelectortbl();
        });

        async function GetProjectAccount() {

            var projectId = $('#PrjtDdl').val()?.toString();

            if (projectId == "0") {
                $('#DDl_Bank').empty();
                $('#DDl_Bank').html('<option value="0">---Select Bank Account---</option>');
                $('#bnkbalance').html('');
                $('#bnkbalance').html('No Such Account In QBO');
                return;
            }
            try {
                $(".loader").css("display", "flex");
                let response = await $.ajax({
                    url: "/Invoice/GetProjectAccountinMP",
                    type: "GET",
                    data: { ProjectId: projectId },
                    dataType: "json",
                });
                if (response.IsSuccess) {
                    $('#DDl_Bank').empty();

                    for (var item of response.Result) {
                        $('#DDl_Bank').append(`<option data-accountname="${item.bank_Account}" data-currid="${item.currencyID}" value="${item.fld_ID}" ${item.isProjectCurrency == "Y" ? "selected" : ""}>${item.bank_Account}-${item.description}(${item.currencyCode})</option>`);
                    }

                    getBalance();

                }
                else {
                    $('#DDl_Bank').empty();
                    $('#DDl_Bank').html('<option value="0">---Select Bank Account---</option>');
                    $('#bnkbalance').html('');
                    $('#bnkbalance').html('No Such Account In QBO');
                }


                await getallpaymentnumber();
            }
            catch (error) {
                console.error("Error sending data:", error);
            } finally {
                $(".loader").css("display", "none");
            }

            //$.ajax({
            //	url: "/Invoice/GetProjectAccountinMP",
            //	type: "GET",
            //	data: { ProjectId: projectId },
            //	dataType: "json",
            //	async: false,
            //	beforeSend: function () {
            //		$(".loader").css("display", "flex");
            //	},
            //	success: function (data) {
            //		if (data.IsSuccess) {
            //			$('#DDl_Bank').empty();

            //			for (var item of data.Result) {
            //				$('#DDl_Bank').append(`<option data-accountname="${item.bank_Account}" data-currid="${item.currencyID}" value="${item.fld_ID}" ${item.isProjectCurrency == "Y" ? "selected" : ""}>${item.bank_Account}-${item.description}(${item.currencyCode})</option>`);
            //			}

            //			getBalance();

            //		}
            //		else {
            //			$('#DDl_Bank').empty();
            //			$('#DDl_Bank').html('<option value="0">---Select Bank Account---</option>');
            //			$('#bnkbalance').html('');
            //			$('#bnkbalance').html('No Such Account In QBO');
            //		}

            //	},
            //	error: function (error) {
            //		console.error(error);
            //		$(".loader").css("display", "none");

            //	},

            //});
        }

        async function getallpaymentnumber() {

            var ic = $('#Ddl_PaymentType').attr('data-changed');
            if (ic == '1')
                return;


            try {
                var bankaccnt = $('#DDl_Bank').val();
                $(".loader").css("display", "flex");

                let response = await $.ajax({
                    url: "/Invoice/GetAllpaymentNumber",
                    type: "GET",
                    data: { BankAccount: bankaccnt },
                    dataType: "json",
                });

                if (response.IsSuccess) {
                    if (response.Result.paymentType == '8') {
                        $('#Ddl_PaymentType').val('2');
                    }
                    else {

                        $('#Ddl_PaymentType').val(response.Result.paymentType);
                    }

                }
                else {
                    $('#Ddl_PaymentType').val('2');
                }

                $("#Ddl_PaymentType").trigger("change");
                var tmp = 0;

                $('.chkItems').each(function () {
                    if ($(this).is(':checked')) {
                        tmp++;
                    }
                });

                if (tmp == 0) {
                    return;
                }



                var ptype = $('#Ddl_PaymentType').val();

                let data = await $.ajax({
                    url: "/Invoice/GetPaymentNumberForAll",
                    type: "GET",
                    data: { PaymentType: ptype, BankAccountId: bankaccnt },
                    dataType: "json",
                });

                if (data.IsSuccess) {
                    //$('#txtPaymentNumber').val($("#Ddl_PaymentType option:selected").attr('data-code') + '-' + data.Result.result);
                    //$('#txtPaymentNumber').removeClass('existingnumber');

                    if ($("#Ddl_PaymentType option:selected").val() == '2') {
                        $('#txtPaymentNumber').val('To be printed');

                    }
                    else {
                        $('#txtPaymentNumber').val($("#Ddl_PaymentType option:selected").attr('data-code') + '-' + data.Result.result);
                        $('#txtPaymentNumber').removeClass('existingnumber');
                    }
                }
                else {
                    $('#txtPaymentNumber').val('CR-');
                }



            }
            catch (error) {
                console.error("Error sending data:", error);
                $(".loader").css("display", "none");

            } finally {
                $(".loader").css("display", "none");
            }

            //$.ajax({
            //	url: "/Invoice/GetAllpaymentNumber",
            //	type: "GET",
            //	data: { BankAccount: bankaccnt },
            //	dataType: "json",
            //	async: false,
            //	beforeSend: function () {
            //		$(".loader").css("display", "flex");
            //	},
            //	success: function (data) {
            //		if (data.IsSuccess) {

            //			$('#Ddl_PaymentType').val(data.Result.paymentType);

            //		}
            //		else {
            //			$('#Ddl_PaymentType').val('2');
            //		}

            //		//$(".loader").css("display", "none");

            //	},
            //	error: function (error) {
            //		console.error(error);
            //		$(".loader").css("display", "none");

            //	},
            //	complete: function () {
            //		$(".loader").css("display", "none");

            //	}
            //});

            //$("#Ddl_PaymentType").trigger("change");
            //var ptype = $('#Ddl_PaymentType').val();
            //$.ajax({
            //	url: "/Invoice/GetPaymentNumberForAll",
            //	type: "GET",
            //	data: { PaymentType: ptype, BankAccountId: bankaccnt },
            //	dataType: "json",
            //	async: false,
            //	beforeSend: function () {
            //		$(".loader").css("display", "flex");
            //	},
            //	success: function (data) {
            //		if (data.IsSuccess) {
            //			$('#txtPaymentNumber').val($("#Ddl_PaymentType option:selected").attr('data-code') + '-' + data.Result.result);
            //			//$('#txtPaymentNumber').removeClass('existingnumber');
            //		}
            //		else {
            //			$('#txtPaymentNumber').val('CR-');
            //		}

            //		$(".loader").css("display", "none");

            //	},
            //	error: function (error) {
            //		console.error(error);
            //		$(".loader").css("display", "none");

            //	},
            //	complete: function () {
            //		$(".loader").css("display", "none");

            //	}
            //});
        }
        function getBalance() {
            let accountNumber = $('#DDl_Bank option:selected').attr('data-accountname');

            let formData = {
                accountId: accountNumber
            };

            $.ajax({
                url: `${_BaseURL}/Quickbook/GetAccountDetailsById`,
                data: formData,
                type: "GET",
                dataType: "json",
                async: true,
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

        async function invoiceSelectortbl() {

            var projectId = $('#PrjtDdl').val()?.toString();
            var currcode = $('#CurrDdl').val();

            if (projectId == "0" && currcode == "0") {
                var html = `<table id="inv_selector" class="table table-striped table-hover inv_selector_table" style="width:100%">
								<thead>
									<tr>
										<th><input type="checkbox" style="width: 5%;"></th>
										<th style="width: 15%;">Vendor</th>
										<th style="width: 5%;">Invoice #</th>
										<th style="width: 10%;">Date</th>
										<th style="width: 20%;">Terms</th>
										<th style="width: 10%;">Currency</th>
										<th style="width: 10%;">Amount Owing</th>
										<th style="width: 10%;">Payment Amount</th>
									</tr>
								</thead>
							<tbody>
								<tr>
								   <td colspan="8" class="text-center">No Data Available</td>
								</tr>
							</tbody>
						</table>`;

                $('#invselectorbind').html('');
                $('#invselectorbind').html(html);
                $('.dt-search').css("display", "none");
                return;
            }
            try {

                $(".loader").css("display", "flex");
                let response = await $.ajax({
                    url: "/Invoice/GetAllInvoiceListByVendor2",
                    type: "GET",
                    data: { ProjectId: projectId, Currcode: currcode }
                });

                if (response != "") {
                    $('#invselectorbind').html('');
                    $('#invselectorbind').html(response);
                    invoiceSelectorDatatable();
                }
                else {
                    $.notify.error('Error', 'Something went wrong');
                }


            } catch (error) {
                console.error(error);
            }
            finally {
                $(".loader").css("display", "none");
            }

            //$.ajax({
            //	url: "/Invoice/GetAllInvoiceListByVendor2",
            //	data: { ProjectId: projectId, Currcode: currcode },
            //	type: "GET",
            //	dataType: "HTML",

            //	beforeSend: function () {
            //		$(".loader").css("display", "flex");
            //	},
            //	success: function (data) {

            //		if (data != "") {
            //			$('#invselectorbind').html('');
            //			$('#invselectorbind').html(data);
            //			invoiceSelectorDatatable();
            //		}
            //		else {
            //			notify(false, "Something Went Wrong.", false);
            //		}
            //		$(".loader").css("display", "none");
            //	},
            //	error: function (error) {
            //		console.error(error);
            //		$(".loader").css("display", "none");

            //	}
            //});
        }
        function invoiceSelectorDatatable() {

            if ($.fn.DataTable.isDataTable("#inv_selector")) {
                $('#inv_selector').DataTable().clear().destroy();
            }

            var table = $("#inv_selector").DataTable({
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
                "order": [[1, "asc"], [3, "asc"], [2, "asc"]],
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
                        $('#inv_selector tbody').html(
                            '<tr><td colspan="8" class="empty_cell">No data available</td></tr>'
                        );
                    }
                    $('.dt-search').css("display", "none");

                }


            });
        }
        function calculateexrate() {

            $('#Ddl_PaymentType option[value="1"]').removeAttr('disabled');
            $('#Ddl_PaymentType option[value="2"]').removeAttr('disabled');
            $('#Ddl_PaymentType option[value="3"]').removeAttr('disabled');
            $('#Ddl_PaymentType option[value="4"]').removeAttr('disabled');
            $('#Ddl_PaymentType option[value="5"]').removeAttr('disabled');
            $('#Ddl_PaymentType option[value="6"]').removeAttr('disabled');


            $('#Ddl_PaymentType option[value="6"]').attr('disabled', 'disabled');
            $('#Ddl_PaymentType option[value="7"]').attr('disabled', 'disabled');


            //console.log($('#DDl_Bank option:selected').attr('data-currid') + "==" +  $('#CurrDdl').val());
            if ($('#DDl_Bank option:selected').attr('data-currid') == $('#CurrDdl option:selected').attr('data-id')) {
                $('#txtconvrate').val("1.00");
                //$('#txtconvrate').attr("disabled", "disabled");
                return;
            }

            $('#txtconvrate').removeAttr("disabled");

            if ($('#txtconvrate').attr('data-edited') == "true") {
                return;
            }
            var tot = 0;
            var totconverted = 0;

            $('.chkItems').each(function () {
                if ($(this).is(':checked')) {
                    var totowed = $(this).parent().parent().find('td:eq(6)').html();
                    var conv = $(this).parent().parent().find('td:eq(7) input').attr('data-exrate');
                    tot += parseFloat(totowed);
                    totconverted += parseFloat(totowed) * parseFloat(conv);

                }

            });

            var convrate = isNaN(totconverted / tot) ? 1.00 : totconverted / tot;
            $('#txtconvrate').val(formatNumber4(convrate));

        }

        $(document).on('change', '#DDl_Bank', function () {

            if ($("#DDl_Bank").val() == 0 && $("#Ddl_PaymentType").val() === "1") {
                $.notify.warning('Caution', 'Please Select Bank Account');
                $("#txtPaymentNumber").val("");
                return;
            }
            getallpaymentnumber();
            calculateexrate();
            getBalance();

        });

        var selection_couter = 0;

        $(document).on('change', '.chkItems', function () {

            var obj = $(this);
            var ischecked;
            calculateexrate();
            if ($(obj).is(':checked')) {
                ischecked = true;

            }
            else {
                ischecked = false;
            }
            var iscontinue = true;

            if (!iscontinue) {
                return;
            }
            var totalAmount = 0;

            if (ischecked) {
                var totalRecords = $('#inv_selector tbody tr').length;
                selection_couter++;

                if (selection_couter == totalRecords) {
                    $('#inv_selector thead tr').find('th:eq(0)').find("input:checkbox").prop('checked', true);
                }

                //$(obj).prop('checked', true);

                var oamt = $(obj).parent("td").parent("tr").find("td:eq(6)").html();
                oamt = replaceAll(oamt, ',', '');
                obj.parent("td").parent("tr").find("td:eq(7)")
                    .find("input:text").val(oamt);

                obj.parent("td").parent("tr").find("td:eq(7)")
                    .find("input:text").attr("disabled", false);

                totalAmount = $("#txtTotalAmount").val().replace(',', '');


                totalAmount = parseFloat(totalAmount) + parseFloat(obj.parent("td").parent("tr").find("td:eq(7)")
                    .find("input:text").val());

                $("#txtTotalAmount").val(formatNumber(totalAmount));
            }

            else {
                selection_couter--;
                $('#inv_selector thead tr').find('th:eq(0)').find("input:checkbox").prop('checked', false);

                obj.parent("td").parent("tr").find("td:eq(7)").find("input:text").attr("disabled", true);
                obj.parent("td").parent("tr").find("td:eq(7)").find("input:text")
                    .val(obj.parent("td").parent("tr").find("td:eq(6)").html().replace(',', ''));

                obj.parent("td").parent("tr").find("td:eq(7)")
                    .find("input:text").val('0.00');

                $('#inv_selector tbody tr').each(function () {
                    if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) {
                        totalAmount += parseFloat($(this).find('td:eq(7)').find('input:text').val());

                    }
                });

                $("#txtTotalAmount").val(formatNumber(totalAmount));
            }

            if (totalAmount < 0) {

                $('#Ddl_PaymentType').val('6');

                $('#Ddl_PaymentType option[value="6"]').removeAttr('disabled');
                $('#Ddl_PaymentType option[value="7"]').removeAttr('disabled');
                $('#Ddl_PaymentType option[value="1"]').attr('disabled', 'disabled');
                $('#Ddl_PaymentType option[value="2"]').attr('disabled', 'disabled');
                $('#Ddl_PaymentType option[value="3"]').attr('disabled', 'disabled');
                $('#Ddl_PaymentType option[value="4"]').attr('disabled', 'disabled');
                $('#Ddl_PaymentType option[value="5"]').attr('disabled', 'disabled');

                $("#Ddl_PaymentType").trigger("change");
            }
            else {
                var indexes = ["2", "1", "3", "4", "5"];
                var selectedVal = Ddl_PaymentType.options[Ddl_PaymentType.selectedIndex].value;
                if (indexes.includes(selectedVal)) {
                    $('#Ddl_PaymentType').val(selectedVal);

                }
                else {
                    $('#Ddl_PaymentType').val('2');
                }

                getallpaymentnumber();
            }

        });

        $(document).on('change', '#Ddl_PaymentType', function () {
            $(this).attr('data-changed', '1');

            getallpaymentnumberforchange();


        });

        async function getallpaymentnumberforchange() {
            $(".loader").css("display", "flex");
            try {

                var ptype = $('#Ddl_PaymentType').val();
                var bankaccnt = $('#DDl_Bank').val();
                if (ptype == '2') {

                    $('#txtPaymentNumber').val('To be printed');
                    return;
                }

                let data = await $.ajax({
                    url: "/Invoice/GetPaymentNumberForAll",
                    type: "GET",
                    data: { PaymentType: ptype, BankAccountId: bankaccnt },
                    dataType: "json",
                });

                if (data.IsSuccess) {
                    $('#txtPaymentNumber').val($("#Ddl_PaymentType option:selected").attr('data-code') + '-' + data.Result.result);
                    $('#txtPaymentNumber').removeClass('existingnumber');
                }
                else {
                    $('#txtPaymentNumber').val('CR-');
                }
            } catch (error) {
                console.error("Error sending data:", error);
                $(".loader").css("display", "none");

            } finally {
                $(".loader").css("display", "none");
            }
        }
        function formatNumber4(number) {
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

        $(document).on('change', '#checkAll', function () {

            var obj = this;
            var ischecked;
            var totalAmount = 0;

            if ($(obj).is(':checked')) {
                ischecked = true;

            }
            else {
                ischecked = false;
            }

            $('#inv_selector tr').each(
                function () {

                    $(this).find('td:eq(0)').find("input:checkbox").prop('checked', ischecked);
                }
            );

            if (ischecked == true) {
                $('#inv_selector tbody tr').each(function () {
                    $(this).find("td:eq(7)").find("input:text").attr("disabled", false);
                    $(this).find("td:eq(7)").find("input:text")
                        .val($(this).find("td:eq(6)").html().replace(',', ''));
                    totalAmount += parseFloat($(this).find('td:eq(7)').find('input:text').val());
                });
                $("#txtTotalAmount").val(formatNumber(totalAmount));

                //var table = $('#inv_selector').dataTable();

                var totalRecords = $('#inv_selector tbody tr').length;
                selection_couter = totalRecords;

            }
            else {
                $('#inv_selector tbody tr').each(function () {
                    $(this).find("td:eq(7)").find("input:text").attr("disabled", true);
                    $(this).find("td:eq(7)").find("input:text")
                        .val('0.00');

                });
                $("#txtTotalAmount").val(formatNumber(totalAmount));

                selection_couter = 0;
            }

            calculateexrate();
        });

        $(document).on('keyup', '.itempa', function () {
            var obj = this;
            var currval = parseFloat($(obj).val());
            currval = isNaN(parseFloat(currval)) ? 0 : currval;

            var tot = 0;
            $('#inv_selector tr').each(function () {
                if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) {
                    var vl = $(this).find('td:eq(7)').find('input:text').val();
                    //console.log(vl);
                    vl = isNaN(parseFloat(vl)) ? 0 : vl;
                    tot += parseFloat(vl);
                }
            });
            $("#txtTotalAmount").val(formatNumber(tot));;
        });

        $(document).on('click', '#btn_SavePayment', function () {

            //if ($('.chkItems').length > 0 && $('.chkItems:checked').length > 0) {
            //	notify(false, 'please select invoice items.', false)
            //	return;
            //}
            var flag = checkInvoicestatus();

            if (!flag)
                return;

            checkpaymentnumberexistence($('#txtPaymentNumber'));

            if ($('#txtPaymentNumber').hasClass('existingnumber')) {
                $.notify.warning('Caution', 'Use another Payment Number');
                return;
            }
            if ($('#txtPaymentNumber').val() != '') {
                var invonum = $("#txtPaymentNumber").val();
                var filter = RegExp(/^[\w-]+$/);
                if (!filter.test(invonum)) {
                    $.notify.warning('Caution', 'Please enter the Payment Number in correct format');
                    return false;
                }
            }

            var table = $('#inv_selector').dataTable();

            if (table.data().length === 0) {
                $.notify.warning('Caution', 'You have nothing to save');
                return;
            }

            if ($('#txt_PaymentDate').val() === '') {
                //errorfunc('txt_PaymentDate', "Please Select Date");
                $.notify.warning('Caution', 'Please Select Date');
                return;
            }

            if ($("#DDl_Bank").val() === "0" && $("#Ddl_PaymentType").val() === "1") {
                //errorfunc('DDl_Bank', "Please Select Bank Account");
                $.notify.warning('Caution', 'Please Select Bank Account');
                return;
            }

            if ($("#Ddl_PaymentType").val() === "1") {

                if ($("#txtPaymentNumber").val() === '') {
                    $.notify.warning('Caution', 'Please Enter Payment Number');
                    return;
                }
            }

            if (selection_couter == 0) {

                $.notify.warning('Caution', 'You have nothing to save');
                return;
            }

            var varray = new Array();

            $('#inv_selector tbody tr').each(function () {
                if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) {
                    var vendorid = $(this).attr('data-parentvendorid');

                    var tmp = 0;
                    for (var a = 0; a < varray.length; a++) {
                        if (vendorid == varray[a]) {
                            tmp = 1;
                        }
                    }
                    if (tmp == 0) {
                        varray.push(vendorid);
                    }
                }
            });

            var ss = 0;

            var pnumber = 0;
            var PaymentType = $("#Ddl_PaymentType").val();

            for (var a = 0; a < varray.length; a++) {
                var cat = $("#txtPaymentNumber").val().split('-')[0];
                var val = parseInt($("#txtPaymentNumber").val().split('-')[1]);
                if (isNaN(val) && PaymentType != '2') {
                    $.notify.warning('Caution', 'Enter a valid Payment number');
                    return;
                }
                var nm = val + ss;
                if (nm < 10) {
                    nm = '000' + nm;
                }
                else if (nm < 100) {
                    nm = '00' + nm;
                }
                else if (nm < 1000) {
                    nm = '0' + nm;
                }
                var pnumber = cat + '-' + nm;

                ss++;

                var total = 0;

                $("#inv_selector tbody").find("tr").each(function () {

                    var vendorid = $(this).attr('data-parentvendorid');

                    if (($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) && vendorid == varray[a]) {

                        total += parseFloat($(this).find('td:eq(7)').find('input:text').val());
                    }

                });
            }

            var PaymentNumber = pnumber;

            if (PaymentType == '2') {
                PaymentNumber = $('#txtPaymentNumber').val();
            }
            var Memo = $("#txtMemo").val();
            var convrate = $('#txtconvrate').val();
            var convrate1 = $('#txtconvrate1').val();
            convrate = isNaN(convrate) ? '1.00' : convrate;
            var BankAccount_ID = $("#DDl_Bank").val();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();
            if ($("#txt_PaymentDate").val() != '')
                PaymentDate = ($("#txt_PaymentDate").val());
            else
                PaymentDate = null;

            let fd = {
                PaymentDate: PaymentDate,
                PaymentType: PaymentType,
                PaymentNumber: PaymentNumber,
                TotalPayment: total,
                Memo: Memo,
                BankAccountID: BankAccount_ID,
                Vendor_ID: 0,
                ConvRate: convrate,
                ConvRate2: convrate1
            };

            $.ajax({
                url: "/Invoice/SaveManualPayment",
                data: fd,
                type: "POST",
                dataType: "json",
                async: false,
                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        isDirty = false;
                        var InvoiceID = '';
                        var vl = '';
                        var ManualPaymentId = data.Result.fldId;

                        ManualPaymentIdArray.push(ManualPaymentId);

                        for (var a = 0; a < varray.length; a++) {
                            $("#inv_selector tbody").find("tr").each(function () {
                                var vendorid = $(this).attr('data-parentvendorid');

                                if (($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) && vendorid == varray[a]) {
                                    InvoiceID += InvoiceID == "" ? $(this).attr('data-invid') : '^' + $(this).attr('data-invid');
                                    vl += vl == "" ? parseFloat($(this).find('td:eq(7)').find('input:text').val()) : '^' + parseFloat($(this).find('td:eq(7)').find('input:text').val());
                                }
                            });
                        }
                        InvoiceID = InvoiceID.replace(",", "");
                        vl = vl.replace(",", "");
                        let fd = {
                            InvoiceID: InvoiceID,
                            vl: vl.toString(),
                            ManualPaymentID: ManualPaymentId.toString()
                        }
                        $.ajax({
                            type: "POST",
                            url: "/Invoice/SavePaymentItem",
                            dataType: "json",
                            data: fd,
                            async: false,
                            success: function (data) {
                                if (data.IsSuccess) {
                                    //window.location.reload();
                                    $.notify.success('Success', 'Successfully generated ' + varray.length + ' Payment(s)');
                                    invoiceSelectortbl();
                                    //qbo logic
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages)
                                }
                            },
                            error: function ()
                            {
                                $.notify.error('Error', 'Something went wrong');
                            }
                        });
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages)
                    }
                    $(".loader").css("display", "none");
                }

            });

            //QBO Call.
            let isSendToQBO = getCookie('isSendToQBO');
            if (isSendToQBO == 'true') {
                generateInvoicesInBatch();
            }
            else {
                setTimeout(function () {
                    location.reload();
                }, 4000);
            }
        })
        function checkInvoicestatus() {

            var rflag = true;


            $('#inv_selector tbody tr').each(function () {
                if (rflag && $(this).find('td:eq(0)').find('.chkItems').is(':checked')) {
                    var invn = $(this).attr('data-invid');

                    $.ajax({
                        url: "/Invoice/CheckItemStatus",
                        data: { Invoicenumber: invn },
                        type: "GET",
                        dataType: "json",
                        async: false,

                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            if (data.IsSuccess) {
                                var o = data.Result;
                                //if (o.length > 0) {
                                if (parseFloat(o.paid) + parseFloat($(this).find('td:eq(7) input').val()) > parseFloat(o.totalInvoice)) {
                                    $.notify.error('Error', "You are trying to pay extra for Invoice " + $(this).find('td:eq(2)').html() + "(" + formatNumber(parseFloat(o.paid)) + " is already paid.)");
                                    rflag = false;
                                }
                                //}
                            }


                        }

                    });



                }



            });
            $(".loader").css("display", "none");

            return rflag;
        }
        function checkpaymentnumberexistence(obj) {
            var paymentnumber = $(obj).val();
            if (paymentnumber != '') {

                var accntnum = $('#DDl_Bank').val();
                var ptype = $('#Ddl_PaymentType').val();

                var allowedwirenumber = true;

                if (ptype == '3') {
                    var pint = parseInt($('#txtPaymentNumber').val().split('-')[1]);
                    if (pint > 99999) {
                        allowedwirenumber = false;
                    }
                }

                $.ajax({
                    type: "GET",
                    url: "/Invoice/CheckPaymentNumber",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: { PaymentNumber: paymentnumber, PaymentType: ptype, BankAccountID: accntnum },
                    async: false,
                    success: function (response) {
                        if (response.IsSuccess) {
                            if (response.Result.result != "0") {
                                $(obj).addClass('existingnumber');
                            }
                        }
                        else {
                            if (allowedwirenumber) {
                                $(obj).removeClass('existingnumber');
                            }
                            else {
                                $(obj).addClass('existingnumber');
                            }
                        }
                    }
                });

                //$.get(url11)
                // .success(function (response) {

                //     if (response != '0') {
                //         $(obj).addClass('existingnumber');
                //     }
                //    else {
                //         $(obj).removeClass('existingnumber');
                //     }

                // });

            }
            else {
                $(obj).addClass('existingnumber');
            }
        }

        $(document).on('click', '#btn_Cancel', function () {
            window.location.reload();
        });

        //QBO FUNCTIONS

        $(document).on('click', '#btn_SavePaymentWithQBO', function () {
            deleteCookie('isSendToQBO');
            setCookie('isSendToQBO', 'true', 1);

            setTimeout(function () {
                $("#btn_SavePayment").trigger("click");
            }, 200);
        });

        function generateInvoicesInBatch() {
            let arr = '';
            for (let i = 0; i < ManualPaymentIdArray.length; i++) {
                arr += arr == '' ? ManualPaymentIdArray[i] : ',' + ManualPaymentIdArray[i];
            }

            deleteCookie('checker');
            setCookie('checker', arr, 1);

            let currid = returncurrentoperationidforqbosendbatch();

            $.notify.success('Success', 'Sending to QBO');
            setTimeout(() => {
                EditPayment(currid, 1);
            }, 300);
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

        function EditPayment(PaymentId, mode) {
            let checker = getCookie("checker");
            setCookie(`checker-${checker}`, "false", 7);

            //Populate Bank Account
            PopulateEditModalData(PaymentId);

            if (mode == 1) {
                $('#qbmodal').modal({ backdrop: 'static', keyboard: false });
                $('#qbmodal').modal('show');

                QBCheck()
            }

        }

        async function PopulateEditModalData(PaymentId) {
            try {
                const html = await $.ajax({
                    url: `${_BaseURL}/Invoice/PopulateEditModalDataByPaymentId`,
                    type: 'POST',
                    data: { ManualPaymentId: PaymentId },
                    dataType: 'html',
                });
                $('#editPaymentModalBody').html(html);

            } catch (e) {
                console.warn(e)
            }
        }

        let index1 = 0;
        let index2 = 0;
        let index3 = 0;

        function QBCheck() {
            let accountNumber = $('#DDl_Bank option:selected').attr('data-accountname');
            $('#qbchecker').html(`<span id='bnkchk'>Checking Bank Account-${accountNumber}></i><span>`);

            setTimeout(() => {
                CheckQboAccount(accountNumber);
            }, 300);
        }

        async function CheckQboAccount(accountNumber) {
            try {

                let formData = {
                    accountId: accountNumber
                };

                let response = await $.ajax({
                    url: `${_BaseURL}/Quickbook/CheckBankAccount`,
                    data: formData,
                    type: "GET",
                    dataType: "json",
                    cache: false,
                });

                if (response.IsSuccess) {
                    if (response.Result == 'Unauthorized-401') {
                        $.notify.error('Error', 'Unauthorized access to QBO. System not yet authorized to use any QB account');
                        let htm = '<i style="color:red;" class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
                        $('#bnkchk').html(htm + " Unauthorized access to QBO.");

                        setTimeout(() => {
                            $('#qbmodal').modal('hide');
                        }, 3000);

                        return;
                    }
                    if (response.Result != "INVALID") {
                        let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                        $('#bnkchk').html(htm + accountNumber + " Balance:" + response.Result.split('^^^')[0]);
                        $('#DDl_EditBank').attr('data-qboid', response.Result.split('^^^')[1]);
                        let invoices = [];
                        let promises = [];
                        $('#tblInvoiceDetails tbody tr').each(function () {

                            let invoiceid = $(this).find('td:eq(7)').html();
                            let row = $(this);

                            promises.push(
                                $.ajax({
                                    url: `${_BaseURL}/Invoice/GetInvoiceAccountForQBO`,
                                    data: { InvoiceId: invoiceid },
                                    type: "POST",
                                    dataType: "json"
                                }).then(function (response) {
                                    response.forEach(function (item) {

                                        row.attr('data-accountname', item.accountNumber);
                                        row.attr('data-accountdesc', item.description);

                                        invoices.push({
                                            accountname: item.accountNumber,
                                            accountdesc: item.description
                                        });
                                    });

                                })
                            );

                            // try {
                            //     let response = await $.ajax({
                            //         url: `${_BaseURL}/Invoice/GetInvoiceAccountForQBO`,
                            //         data: { InvoiceId: invoiceid },
                            //         type: "POST",
                            //         dataType: "json",
                            //         cache: false,
                            //     });
                            //     console.log(response);
                            //     debugger;
                            //     for (let i = 0; i < response.length; i++) {

                            //         $(obj).attr('data-accountname', response[i].accountNumber);
                            //         $(obj).attr('data-accountdesc', response[i].description);

                            //         let invoiceObj = {
                            //             accountname: response[i].accountNumber,
                            //             accountdesc: response[i].description
                            //         };
                            //         invoices.push(invoiceObj);
                            //     }
                            //     console.log(invoices);
                            // } catch (e) {
                            //     console.log(e);
                            // }
                        });
                        await Promise.all(promises);
                        if (invoices.length > 0) {
                            invoiceaccountcheck(invoices);
                        }
                    }
                    else {
                        $.notify.error('Error', 'QBO Validation error');
                        let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $('#bnkchk').html(htm + accountNumber + " does not exist.");


                        setTimeout(() => {
                            $('#qbmodal').modal('hide');
                        }, 3000);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }

        async function invoiceaccountcheck(invoices) {
            let accountName = invoices[index1].accountname;
            let name = invoices[index1].accountname + "-" + invoices[index1].accountdesc;

            try {
                let response = await $.ajax({
                    url: `${_BaseURL}/Quickbook/CheckInvoiceAccount`,
                    data: { AccountId: accountName },
                    type: "POST",
                    dataType: "json",
                    cache: false,
                });

                if (response.IsSuccess) {
                    if (response.Result != "INVALID") {
                        let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + "" + '"></i>';
                        $('#invchk_' + index1).html(htm + name + " Balance:" + response.Result.split('^^^')[0]);
                        let accountid = response.Result.split('^^^')[1];

                        $('#tblInvoiceDetails tbody tr').each(function () {
                            let accountnamenow = $(this).attr('data-accountname');
                            if (accountnamenow == accountName) {
                                $(this).attr('data-accountid', accountid);
                            }
                        });

                        setTimeout(function () {
                            index1++;
                            if (invoices.length > index1) {
                                invoiceaccountcheck(invoices);
                            }
                            else {
                                index1 = 0;
                                vendorloadnow();
                            }
                        }, 500);
                    }
                    else {
                        debugger
                        let html = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $('#invchk_' + index1).html(htm + name + " does not exist.");
                        setTimeout(function () {
                            $.notify.error('Error', 'QBO Validation error');
                            $('#qbmodal').modal('hide');
                        }, 500);
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }

        function vendorloadnow() {
            let vnames = new Array();

            $('#tblInvoiceDetails tbody tr').each(function () {
                let vname = $(this).find('td:eq(0)').html();
                let vcurr = $(this).find('td:eq(4)').html();
                let VLegalName = $(this).find('td:eq(8)').html();

                let count = 0;
                for (let i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        count++;
                    }
                }
                if (count == 0) {
                    let obj = {
                        vname: vname,
                        vcurr: vcurr,
                        VLegalName: VLegalName
                    }
                    vnames.push(obj);
                }
            });

            qbcheckvendor(vnames);
        }

        async function qbcheckvendor(vnames) {
            let name = vnames[index2].vname;
            let currId = $('#DDl_EditBank option:selected').attr('data-currid');
            let vName = `${vnames[index2].VLegalName} ${currId}`;

            let modalHtml = `<br /><span id='vndchk_${index2}'>Checking Vendor- ${name} </span>`;

            $('#qbchecker').append(modalHtml);

            let inputData = {
                Name: name,
                VendorName: vName,
                Curr: currId
            };

            try {
                let response = await $.ajax({
                    url: `${_BaseURL}/Quickbook/CheckVendor`,
                    type: "POST",
                    data: inputData,
                    dataType: "json",
                    cache: false
                });

                if (response.IsSuccess) {
                    if (response.Result != "INVALID" && response.Result != "0") {
                        let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + response.Result + '"></i>';
                        $('#vndchk_' + index2).html(`${htm} ${name}(${currId})`);

                        let vendorId = response.Result;
                        $('#tblInvoiceDetails tbody tr').each(function () {

                            let vendorname = $(this).find('td:eq(0)').html();

                            if (vendorname == vnames[index2].vname) {
                                $(this).attr('data-vendorid', vendorId);
                            }
                        });
                        setTimeout(() => {
                            index2++;
                            if (vnames.length > index2) {
                                qbcheckvendor(vnames);
                            }
                            else {
                                index2 = 0;
                                qbgeneratecheck();
                            }
                        }, 300);
                    }
                    else if (response.Result != "0") {
                        let name2 = `${vName} ${currId}`;
                        $('#vndchk_' + index2).html('Creating Vendor- ' + name2);
                        let savedata = {
                            Name: name,
                            VendorName: vName,
                            Curr: currId
                        };

                        let response = await $.ajax({
                            url: `${_BaseURL}/Quickbook/SaveVendor`,
                            type: "POST",
                            data: savedata,
                            dataType: "json",
                            cache: false
                        });

                        if (response.IsSuccess) {
                            let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + response.Result + '"></i>';
                            $('#vndchk_' + index2).html(htm + "New vendor created - " + name2);
                            let vendorId = response.Result;

                            $('#tblInvoiceDetails tbody tr').each(function () {
                                let vendorname = $(this).find('td:eq(0)').html();

                                if (vendorname == vnames[index2].vname) {
                                    $(this).attr('data-vendorid', vendorId);
                                }
                            });
                            setTimeout(function () {
                                index2++;
                                if (vnames.length > index2) {
                                    qbcheckvendor(vnames);
                                }
                                else {
                                    index2 = 0;
                                    qbgeneratecheck();
                                }
                            }, 300);
                        }
                        else {
                            $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                        }
                    }
                    else if (response.Result == "0") {

                        let savedata = {
                            Curr: currId
                        };

                        let response = await $.ajax({
                            url: `${_BaseURL}/Quickbook/CheckandSaveVendor`,
                            type: "POST",
                            data: savedata,
                            dataType: "json",
                            cache: false
                        });

                        if (response.IsSuccess) {

                            if (response.Result != "INVALID") {
                                let name2 = `${vName} ${currId}`;
                                let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + response.Result + '"></i>';
                                $('#vndchk_' + index2).html(htm + name2);
                                let vendorId = response.Result;

                                $('#tblInvoiceDetails tbody tr').each(function () {

                                    let vendorname = $(this).find('td:eq(0)').html();

                                    if (vendorname == vnames[index2].vname) {
                                        $(this).attr('data-vendorid', vendorId);

                                        let currncy = $('#DDl_EditBank option:selected').attr('data-currid');
                                        $(this).attr('data-vendorcurr', currncy);
                                    }

                                });
                                setTimeout(function () {
                                    index2++;
                                    if (vnames.length > index2) {
                                        qbcheckvendor(vnames);
                                    }
                                    else {
                                        index2 = 0;
                                        qbgeneratecheck();
                                    }
                                }, 300);
                            }
                        }
                        else {
                            $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                        }
                    }
                }
                else {
                    $.notify.error('Error', 'Something went wrong in Quick book check vendor');
                }
            } catch (e) {
                console.log(e);
            }
        }

        function qbgeneratecheck() {
            $.notify.success('Success', 'QBO Validation completed successfully');
            $('#qbmodal').modal('hide');
            $('#qbgeratemodal').modal('show');

            let vnames = new Array();
            $('#tblInvoiceDetails tbody tr').each(function () {
                let vname = $(this).find('td:eq(0)').html();
                let vcurr = $(this).find('td:eq(4)').html();
                let BridgeVendorID = $(this).find('td:eq(9)').html();
                let VLegalName = $(this).find('td:eq(8)').html();

                let count = 0;
                for (var i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        count++;
                    }
                }
                if (count == 0) {
                    vnames.push({ vname: vname, vcurr: vcurr, BridgeVendorID: BridgeVendorID, VLegalName: VLegalName });
                }
                generatefinalinvoice(vnames);
            });

        }

        async function generatefinalinvoice(vnames) {
            let vname = vnames[index3].vname;
            let vcurr = vnames[index3].vcurr;
            let BridgeVendorID = vnames[index3].BridgeVendorID;

            if ($('#qbsendinfo').html() != '') {
                $('#qbsendinfo').append("<br /><span id='finalsendinvoice_" + index3 + "'>Generating Cheque for -" + vname + "</span>");
            }
            else {
                $('#qbsendinfo').append("<span id='finalsendinvoice_" + index3 + "'>Generating Cheque for -" + vname + "</span>");
            }
            let items = [];
            setTimeout(() => {
                let allTotal = 0;
                let vendorid = '';

                $('#tblInvoiceDetails tbody tr').each(function () {
                    let row = $(this);
                    let vnamenow = row.find('td:eq(0)').html();

                    if (vname == vnamenow) {
                        vendorid = row.attr('data-vendorid');

                        let tmpcrate = $('#txtEditExrate').val();
                        let vl = parseFloat(row.find('td:eq(6)').find('input').val());

                        let total = parseFloat(tmpcrate) * vl;
                        allTotal += total;

                        let item = {
                            AccountId: row.attr('data-accountid'),
                            Description: row.attr('data-accountdesc'),
                            Total: total.toString()
                        };
                        items.push(item);
                    }
                });


                let checknumber = $('#txtEditPaymentNumber').val();
                if (vnames.length > 1) {
                    checknumber += "/" + (index3 + 1);
                }

                let invObject = {};
                invObject.Paymentdate = $('#txt_EditPaymentDate').val();
                invObject.Bank = $('#DDl_EditBank').attr('data-qboid');
                invObject.Checknumber = checknumber;
                invObject.Memo = $('#txtEditMemo').val();
                invObject.Total = allTotal.toString();
                invObject.Items = items;
                invObject.VendorID = vendorid;
                invObject.VendorCurrency = vcurr;
                invObject.BankCurr = $('#DDl_EditBank option:selected').attr('data-currid');
                invObject.ExchangeRate = $('#txtEditExrate').val();
                invObject.BridgeVendorID = BridgeVendorID;
                invObject.BridgePaymentID = $("#hdnEditPayment").val();
                invObject.MailingAddress = "hi";
                invObject.Type = $('#Ddl_EditPaymentType option:selected').text();

                setTimeout(async function () {
                    let Sendobj = JSON.stringify(invObject);

                    let UpdatedId = getCookie("");

                    let response = await $.ajax({
                        url: _BaseURL + "/Quickbook/SenddataToQBO",
                        type: "POST",
                        contentType: "application/json",
                        data: Sendobj,
                        cache: false,
                        processData: false,
                        dataType: 'json'
                    });

                    if (response.IsSuccess) {
                        debugger;
                        let res = response.Result;
                        if (res != "INVALID") {
                            let htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                            $('#finalsendinvoice_' + index3).html(htm + "Cheque(" + checknumber + ") generated for -" + vname + "");

                            setTimeout(function () {
                                index3++;
                                if (vnames.length > index3) {
                                    generatefinalinvoice(vnames);
                                }
                                else {
                                    index3 = 0;
                                    setTimeout(function () {
                                        $('#qbsendinfo').html('');
                                        $('#qbgeratemodal').modal('hide');
                                        $('#editPaymentModal').modal('hide');
                                    }, 1000);

                                    let currid = returncurrentoperationidforqbosendbatch();
                                    if (currid != '0') {
                                        $.notify.success('Success', 'Please Wait, Generating next cheque.');
                                        setTimeout(function () {
                                            EditPayment(currid, 1);
                                        }, 2000);
                                    }
                                    else {
                                        $.notify.success('Success', 'Successfully sent data to QBO');
                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 3000);
                                    }
                                }
                            }, 300);
                        }
                        else {
                            $.notify.error('Error', 'Something went wrong in Send data to QBO');
                            let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                            $('#finalsendinvoice_' + index3).html(htm + "Unable to send Cheque(" + checknumber + ") to QBO");
                        }
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong in Send data to QBO');
                        let htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $('#finalsendinvoice_' + index3).html(htm + "Unable to send Cheque(" + checknumber + ") to QBO");
                    }
                }, 300);

            }, 300);
        }
    }
    // #endregion

}); 