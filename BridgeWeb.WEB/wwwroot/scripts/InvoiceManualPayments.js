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

            $('#bnkbalance').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

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

            const projectId = $('#PrjtDdl').val()?.toString();
            const currcode = $('#CurrDdl').val();

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
                console.error('GetAllInvoiceListByVendor2 failed:', error);
                $.notify.error('Error', 'Unable to load invoices');
            }
            finally {
                $(".loader").css("display", "none");
            }

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

        $(document).on('click', '#btn_SavePayment', async function () {
            debugger;

            let paymentSavedSuccessfully = false;

            const stopSave = () => {
                deleteCookie('isSendToQBO');
                return;
            };

            try {
                $('.loader').css('display', 'flex');
                const invoiceStatusIsValid = await checkInvoicestatus();

                if (!invoiceStatusIsValid) {
                    return stopSave();
                }

                await checkpaymentnumberexistence($('#txtPaymentNumber'));

                if ($('#txtPaymentNumber').hasClass('existingnumber')) {
                    $.notify.warning('Caution', 'Use another Payment Number');
                    return;
                }

                const paymentNumberValue = $('#txtPaymentNumber').val().trim();

                if (paymentNumberValue != '') {
                    const validNumberPattern = /^[\w-]+$/;
                    if (!validNumberPattern.test(paymentNumberValue)) {
                        $.notify.warning('Caution', 'Please enter the Payment Number in correct format');
                        return stopSave();
                    }
                }

                const table = $('#inv_selector').dataTable();
                if (table.data().length === 0) {
                    $.notify.warning('Caution', 'You have nothing to save');
                    return stopSave();
                }

                if ($('#txt_PaymentDate').val() === '') {
                    $.notify.warning('Caution', 'Please Select Date');
                    return stopSave();
                }

                if ($('#DDl_Bank').val() === '0' && $('#Ddl_PaymentType').val() === '1') {
                    $.notify.warning('Caution', 'Please Select Bank Account');
                    return stopSave();
                }

                if ($('#Ddl_PaymentType').val() === '1') {
                    if (paymentNumberValue === '') {
                        $.notify.warning('Caution', 'Please Enter Payment Number');
                        return stopSave();
                    }
                }

                if (selection_couter == 0) {
                    $.notify.warning('Caution', 'You have nothing to save');
                    return stopSave();
                }

                const varray = [];
                $('#inv_selector tbody tr').each(function () {
                    if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked')) {
                        const vendorid = $(this).attr('data-parentvendorid');

                        let alreadyAdded = false;
                        for (let a = 0; a < varray.length; a++) {
                            if (vendorid == varray[a]) {
                                alreadyAdded = true;
                            }
                        }
                        if (!alreadyAdded) {
                            varray.push(vendorid);
                        }
                    }
                });

                let ss = 0;
                let pnumber = 0;
                let total = 0;
                const PaymentType = $('#Ddl_PaymentType').val();

                for (let a = 0; a < varray.length; a++) {
                    const cat = paymentNumberValue.split('-')[0];
                    const val = parseInt(paymentNumberValue.split('-')[1]);
                    if (isNaN(val) && PaymentType != '2') {
                        $.notify.warning('Caution', 'Enter a valid Payment number');
                        return stopSave();
                    }

                    let nm = val + ss;
                    if (nm < 10) {
                        nm = '000' + nm;
                    } else if (nm < 100) {
                        nm = '00' + nm;
                    } else if (nm < 1000) {
                        nm = '0' + nm;
                    }
                    pnumber = `${cat}-${nm}`;
                    ss++;

                    total = 0;
                    $('#inv_selector tbody').find('tr').each(function () {
                        const vendorid = $(this).attr('data-parentvendorid');
                        if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked') && vendorid == varray[a]) {
                            total += parseFloat($(this).find('td:eq(7)').find('input:text').val());
                        }
                    });
                }

                let PaymentNumber = pnumber;
                if (PaymentType == '2') {
                    PaymentNumber = paymentNumberValue;
                }

                const Memo = $('#txtMemo').val().trim();
                let convrate = $('#txtconvrate').val().trim();
                const convrate1 = $('#txtconvrate1').val().trim();
                convrate = isNaN(convrate) ? '1.00' : convrate;
                const BankAccount_ID = $('#DDl_Bank').val();
                const antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

                let PaymentDate;
                if ($('#txt_PaymentDate').val() != '') {
                    PaymentDate = $('#txt_PaymentDate').val();
                } else {
                    PaymentDate = null;
                }

                const fd = {
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

                let saveResponse = null;
                try {
                    saveResponse = await $.ajax({
                        url: '/Invoice/SaveManualPayment',
                        data: fd,
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('RequestVerificationToken', antiForgeryToken);
                        }
                    });
                } catch (err) {
                    deleteCookie('isSendToQBO');
                    console.error('SaveManualPayment failed:', err);
                    $.notify.error('Error', 'Something went wrong while saving the payment');
                    return;
                }



                if (saveResponse && saveResponse.IsSuccess) {

                    isDirty = false;
                    let InvoiceID = '';
                    let vl = '';
                    const ManualPaymentId = saveResponse.Result.fldId;

                    ManualPaymentIdArray.push(ManualPaymentId);

                    for (let a = 0; a < varray.length; a++) {
                        $('#inv_selector tbody').find('tr').each(function () {
                            const vendorid = $(this).attr('data-parentvendorid');
                            if ($(this).find('td:eq(0)').find('input:checkbox').is(':checked') && vendorid == varray[a]) {
                                InvoiceID += InvoiceID == '' ? $(this).attr('data-invid') : '^' + $(this).attr('data-invid');
                                vl += vl == '' ? parseFloat($(this).find('td:eq(7)').find('input:text').val()) : '^' + parseFloat($(this).find('td:eq(7)').find('input:text').val());
                            }
                        });
                    }

                    InvoiceID = InvoiceID.replace(/,/g, '');
                    vl = vl.replace(/,/g, '');

                    const paymentItemFd = {
                        InvoiceID: InvoiceID,
                        vl: vl.toString(),
                        ManualPaymentID: ManualPaymentId.toString()
                    };


                    try {
                        const paymentItemResponse = await $.ajax({
                            type: 'POST',
                            url: '/Invoice/SavePaymentItem',
                            dataType: 'json',
                            data: paymentItemFd
                        });


                        if (paymentItemResponse.IsSuccess) {
                            paymentSavedSuccessfully = true;
                            $.notify.success('Success', 'Successfully generated ' + varray.length + ' Payment(s)');
                            await invoiceSelectortbl();
                        } else {
                            deleteCookie('isSendToQBO');
                            $.notify.error('Error', paymentItemResponse.ErrorMessages);
                            return;
                        }
                    } catch (err) {
                        console.error('SavePaymentItem failed:', err);
                        $.notify.error('Error', 'Something went wrong');
                        return;
                    }
                } else if (saveResponse) {
                    deleteCookie('isSendToQBO');
                    $.notify.error('Error', saveResponse.ErrorMessages);
                }

                if (paymentSavedSuccessfully) {

                    const isSendToQBO = getCookie('isSendToQBO');

                    if (isSendToQBO === 'true') {
                        generateInvoicesInBatch();
                    } else {
                        setTimeout(function () {
                            location.reload();
                        }, 4000);
                    }

                } else {
                    deleteCookie('isSendToQBO');
                }

            }
            catch (err) {
                deleteCookie('isSendToQBO');
                console.error('btn_SavePayment handler failed:', err);
                $.notify.error('Error', 'Something went wrong');
            } finally {
                $('.loader').css('display', 'none');
            }

        });

        async function checkInvoicestatus() {
            let rflag = true;
            const rows = $('#inv_selector tbody tr').toArray();

            for (const rowEl of rows) {
                if (!rflag) {
                    break;
                }

                const row = $(rowEl);
                if (!row.find('td:eq(0)').find('.chkItems').is(':checked')) {
                    continue;
                }

                const invn = row.attr('data-invid');

                try {
                    const data = await $.ajax({
                        url: '/Invoice/CheckItemStatus',
                        data: { Invoicenumber: invn },
                        type: 'GET',
                        dataType: 'json'
                    });

                    if (data.IsSuccess) {
                        const o = data.Result;
                        if (parseFloat(o.paid) + parseFloat(row.find('td:eq(7) input').val()) > parseFloat(o.totalInvoice)) {
                            $.notify.error('Error', 'You are trying to pay extra for Invoice ' + row.find('td:eq(2)').html() + '(' + formatNumber(parseFloat(o.paid)) + ' is already paid.)');
                            rflag = false;
                        }
                    }
                } catch (err) {
                    console.error('CheckItemStatus failed:', err);
                }
            }

            return rflag;
        }

        async function checkpaymentnumberexistence(obj) {
            const paymentnumber = $(obj).val().trim();

            if (paymentnumber != '') {
                const accntnum = $('#DDl_Bank').val();
                const ptype = $('#Ddl_PaymentType').val();

                let allowedwirenumber = true;
                if (ptype == '3') {
                    const pint = parseInt($('#txtPaymentNumber').val().trim().split('-')[1]);
                    if (pint > 99999) {
                        allowedwirenumber = false;
                    }
                }

                try {
                    const response = await $.ajax({
                        type: 'GET',
                        url: '/Invoice/CheckPaymentNumber',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: { PaymentNumber: paymentnumber, PaymentType: ptype, BankAccountID: accntnum }
                    });

                    if (response.IsSuccess) {
                        if (response.Result.result != '0') {
                            $(obj).addClass('existingnumber');
                        }
                    } else {
                        if (allowedwirenumber) {
                            $(obj).removeClass('existingnumber');
                        } else {
                            $(obj).addClass('existingnumber');
                        }
                    }
                } catch (err) {
                    console.error('CheckPaymentNumber failed:', err);
                }

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
            debugger;
            let arr = '';
            for (let i = 0; i < ManualPaymentIdArray.length; i++) {
                arr += arr == '' ? ManualPaymentIdArray[i] : ',' + ManualPaymentIdArray[i];
            }

            deleteCookie('checker');
            setCookie('checker', arr, 1);
            debugger;
            const currid = returncurrentoperationidforqbosendbatch();
            debugger;
            $.notify.success('Success', 'Sending to QBO');
            setTimeout(() => {
                EditPayment(currid, 1);
            }, 300);
        }

        function returncurrentoperationidforqbosendbatch() {
            debugger;
            const tmp = getCookie("checker");
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
            debugger;
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
            debugger;
            try {
                const html = await $.ajax({
                    url: `${_BaseURL}/Invoice/PopulateEditModalDataByPaymentId`,
                    type: 'POST',
                    data: { ManualPaymentId: PaymentId },
                    dataType: 'html',
                });
                $('#editPaymentModalBody').html(html);

            } catch (e) {
                console.warn(e);
                $.notify.error('Error', 'Unable to load payment details');
            }
        }

        let index1 = 0;
        let index2 = 0;
        let index3 = 0;

        function QBCheck() {
            const accountNumber = $('#DDl_Bank option:selected').attr('data-accountname');
            $('#qbchecker').html("<span id='bnkchk'>Checking Bank Account- " + accountNumber + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');

            setTimeout(() => {
                CheckQboAccount(accountNumber);
            }, 300);
        }

        async function CheckQboAccount(accountNumber) {
            try {

                const formData = { accountId: accountNumber };

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

                        const htm = '<i style="color:red;" class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
                        $('#bnkchk').html(htm + " Unauthorized access to QBO.");

                        setTimeout(() => {
                            $('#qbmodal').modal('hide');
                        }, 3000);

                        return;
                    }
                    if (response.Result != "INVALID") {
                        const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                        $('#bnkchk').html(htm + accountNumber + " Balance:" + response.Result.split('^^^')[0]);
                        $('#DDl_EditBank').attr('data-qboid', response.Result.split('^^^')[1]);

                        const invoices = [];
                        const promises = [];

                        $('#tblInvoiceDetails tbody tr').each(function () {

                            const invoiceid = $(this).find('td:eq(7)').html();
                            const row = $(this);

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
                console.error('CheckBankAccount failed:', e);
                $.notify.error('Error', 'Unable to verify the bank account with QBO');
            }
        }

        async function invoiceaccountcheck(invoices) {
            const accountName = invoices[index1].accountname;
            const name = invoices[index1].accountname + "-" + invoices[index1].accountdesc;

            try {
                const response = await $.ajax({
                    url: `${_BaseURL}/Quickbook/CheckInvoiceAccount`,
                    data: { AccountId: accountName },
                    type: "POST",
                    dataType: "json",
                    cache: false,
                });
                if (response.IsSuccess) {
                    if (response.Result != "INVALID") {
                        const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + "" + '"></i>';
                        $('#invchk_' + index1).html(htm + name + " Balance:" + response.Result.split('^^^')[0]);
                        const accountid = response.Result.split('^^^')[1];

                        $('#tblInvoiceDetails tbody tr').each(function () {
                            const accountnamenow = $(this).attr('data-accountname');
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
                        const html = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                        $('#invchk_' + index1).html(html + name + " does not exist.");
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
            const vnames = [];

            $('#tblInvoiceDetails tbody tr').each(function () {
                const vname = $(this).find('td:eq(0)').html();
                const vcurr = $(this).find('td:eq(4)').html();
                const VLegalName = $(this).find('td:eq(8)').html();

                let count = 0;
                for (let i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        count++;
                    }
                }
                if (count == 0) {
                    vnames.push({ vname: vname, vcurr: vcurr, VLegalName: VLegalName });
                }
            });

            qbcheckvendor(vnames);
        }

        async function qbcheckvendor(vnames) {
            const name = vnames[index2].vname;
            const currId = $('#DDl_EditBank option:selected').attr('data-currid');
            const vName = `${vnames[index2].VLegalName} ${currId}`;

            //const modalHtml = `<br /><span id='vndchk_${index2}'>Checking Vendor- ${name} </span>`;
            $('#qbchecker').append("<br /><span id='vndchk_" + index2 + "'>Checking Vendor- " + name + '<i class="fa fa-spinner fa-spin mrg5L" aria-hidden="true"></i><span>');

            //$('#qbchecker').append(modalHtml);

            const inputData = {
                Name: name,
                VendorName: vName,
                Curr: currId
            };

            try {
                const response = await $.ajax({
                    url: `${_BaseURL}/Quickbook/CheckVendor`,
                    type: "POST",
                    data: inputData,
                    dataType: "json",
                    cache: false
                });
                if (response.IsSuccess) {
                    if (response.Result != "INVALID" && response.Result != "0") {
                        const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + response.Result + '"></i>';
                        $('#vndchk_' + index2).html(`${htm} ${name}(${currId})`);

                        const vendorId = response.Result;
                        $('#tblInvoiceDetails tbody tr').each(function () {
                            const vendorname = $(this).find('td:eq(0)').html();
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
                        const name2 = `${vName} ${currId}`;
                        $('#vndchk_' + index2).html('Creating Vendor- ' + name2);

                        const savedata = {
                            Name: name,
                            VendorName: vName,
                            Curr: currId
                        };

                        const saveResponse = await $.ajax({
                            url: `${_BaseURL}/Quickbook/SaveVendor`,
                            type: "POST",
                            data: savedata,
                            dataType: "json",
                            cache: false
                        });

                        if (saveResponse.IsSuccess) {
                            const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + saveResponse.Result + '"></i>';
                            $('#vndchk_' + index2).html(htm + "New vendor created - " + name2);
                            const vendorId = saveResponse.Result;

                            $('#tblInvoiceDetails tbody tr').each(function () {
                                const vendorname = $(this).find('td:eq(0)').html();
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

                        const savedata = { Curr: currId };

                        const saveResponse = await $.ajax({
                            url: `${_BaseURL}/Quickbook/CheckandSaveVendor`,
                            type: "POST",
                            data: savedata,
                            dataType: "json",
                            cache: false
                        });

                        if (saveResponse.IsSuccess) {

                            if (saveResponse.Result != "INVALID") {
                                const name2 = `${vName} ${currId}`;
                                const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true" data-qboid="' + saveResponse.Result + '"></i>';
                                $('#vndchk_' + index2).html(htm + name2);

                                const vendorId = saveResponse.Result;

                                $('#tblInvoiceDetails tbody tr').each(function () {
                                    const vendorname = $(this).find('td:eq(0)').html();
                                    if (vendorname == vnames[index2].vname) {
                                        $(this).attr('data-vendorid', vendorId);
                                        const currncy = $('#DDl_EditBank option:selected').attr('data-currid');
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
                console.error('CheckVendor/SaveVendor chain failed:', e);
                $.notify.error('Error', 'Something went wrong while checking the vendor in QBO');
            }
        }

        async function qbgeneratecheck() {
            $.notify.success('Success', 'QBO Validation completed successfully');
            $('#qbmodal').modal('hide');
            $('#qbgeratemodal').modal('show');

            const vnames = [];

            $('#tblInvoiceDetails tbody tr').each(function () {
                const vname = $(this).find('td:eq(0)').html();
                const vcurr = $(this).find('td:eq(4)').html();
                const BridgeVendorID = $(this).find('td:eq(9)').html();
                const VLegalName = $(this).find('td:eq(8)').html();

                let count = 0;
                for (let i = 0; i < vnames.length; i++) {
                    if (vnames[i].vname == vname) {
                        count++;
                    }
                }
                if (count == 0) {
                    vnames.push({ vname: vname, vcurr: vcurr, BridgeVendorID: BridgeVendorID, VLegalName: VLegalName });
                }
                //generatefinalinvoice(vnames);
                // console.log(vnames);
            });

            for (index3 = 0; index3 < vnames.length; index3++) {
                await generatefinalinvoice(vnames[index3], index3, vnames.length);
            }
            index3 = 0;

            $('#qbsendinfo').html('');

            $('#qbgeratemodal').modal('hide');

            $('#editPaymentModal').modal('hide');

            const currid = returncurrentoperationidforqbosendbatch();

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

        function generatefinalinvoice(vendor, index, totalVendor) {

            return new Promise((resolve, reject) => {
                const vname = vendor.vname;
                const vcurr = vendor.vcurr;
                const BridgeVendorID = vendor.BridgeVendorID;

                if ($('#qbsendinfo').html() != '') {
                    $('#qbsendinfo').append("<br /><span id='finalsendinvoice_" + index + "'>Generating Cheque for -" + vname + "<i class='fa fa-spinner fa-spin mrg5L' aria-hidden='true'></i></span>");
                }
                else {
                    $('#qbsendinfo').append("<span id='finalsendinvoice_" + index + "'>Generating Cheque for -" + vname + "<i class='fa fa-spinner fa-spin mrg5L' aria-hidden='true'></i></span>");
                }

                setTimeout(() => {
                    let allTotal = 0;
                    let vendorid = '';
                    const items = [];

                    $('#tblInvoiceDetails tbody tr').each(function () {
                        const row = $(this);
                        const vnamenow = row.find('td:eq(0)').html();

                        if (vname == vnamenow) {
                            vendorid = row.attr('data-vendorid');

                            const tmpcrate = $('#txtEditExrate').val();
                            const vl = parseFloat(row.find('td:eq(6)').find('input').val());
                            const total = parseFloat(tmpcrate) * vl;
                            allTotal += total;

                            items.push({
                                AccountId: row.attr('data-accountid'),
                                Description: row.attr('data-accountdesc'),
                                Total: total.toString()
                            });
                        }
                    });

                    let checknumber = $('#txtEditPaymentNumber').val();
                    if (totalVendor > 1) {
                        checknumber += "/" + (index + 1);
                    }

                    const invObject = {};
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

                        try {
                            const response = await $.ajax({
                                url: _BaseURL + "/Quickbook/SenddataToQBO",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(invObject),
                                cache: false,
                                processData: false,
                                dataType: 'json'
                            });

                            if (response.IsSuccess && response.Result != "INVALID") {
                                const htm = '<i style="color:green;" class="fa fa-check-circle mrg5R" aria-hidden="true"></i>';
                                $('#finalsendinvoice_' + index).html(htm + "Cheque(" + checknumber + ") generated for -" + vname + "");

                                resolve();
                            }
                            else {
                                $.notify.error('Error', 'Something went wrong in Send data to QBO');
                                const htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                                $('#finalsendinvoice_' + index).html(htm + "Unable to send Cheque(" + checknumber + ") to QBO");

                                resolve();
                            }
                        }
                        catch (e) {
                            console.error('SenddataToQBO failed:', e);
                            $.notify.error('Error', 'Something went wrong in Send data to QBO');
                            const htm = '<i style="color:red;" class="fa fa-times-circle mrg5R" aria-hidden="true"></i>';
                            $('#finalsendinvoice_' + index).html(htm + 'Unable to send Cheque(' + checknumber + ') to QBO');

                            resolve();
                        }

                    }, 300);

                }, 300);
            });
            
        }
    }
    // #endregion

}); 