$(function () {
    let _QueryParameter = window.location.pathname.split("/");
    let _ActionName = _QueryParameter[2].toLocaleLowerCase();

    // #region :: Dashboard
    if (_ActionName === "dashboard") {
        BuildDashBoardHeaderProjectList();
        function BuildDashBoardHeaderProjectList() {
            $.ajax({
                url: "/Home/GetDashboardHeaderTop",
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#mytasklist").html('');
                        $("#mytasklist").html(data);
                        $.notify.success('Success', 'Dashboard is ready');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                },
                error: function (xhr, status, error) {
                    $(".loader").css("display", "none");
                    $.notify.error('Error', error);
                    //console.error(error);
                }
            });
        }

        $(document).on("click", "#refreshtask", function (e) {
            BuildDashBoardHeaderProjectList();
        });

        $(document).on("click", ".projectHeaderList", function (e) {

            var obj = $(this);
            if ($(e.target).attr("id") === "refreshPdata") {
                getpdata(obj, true);
                return;
            }

            if (obj.hasClass('loaded')) {
                return;
            }

            getpdata(obj, false);


        });

        function getpdata(obj, isRefresh) {
            var ProjectId = obj.data('pid');

            //obj.find('#refreshPdata').remove();

            if (!isRefresh) {
                obj.append('<i class="fa fa-refresh" aria-hidden="true" id="refreshPdata" title="Refresh"></i>');
            }

            $.ajax({
                url: "/Home/GetDashboardProjectTask",
                type: "GET",
                data: { ProjectID: ProjectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $('#acc_lev_' + ProjectId + ' .accordion-body').html('');
                        $('#acc_lev_' + ProjectId + ' .accordion-body').html(data);
                        if (isRefresh) {
                            $('#acc_lev_' + ProjectId).collapse('show');
                        }

                        $(obj).addClass('loaded');
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });
        }

        $(document).on("click", ".indvProjectTask", function (e) {
            const obj = $(this);
            if ($(e.target).attr("id") === "refreshIndvPdata") {
                getpIndvData(obj, true);
                return;
            }
            if (obj.hasClass('loaded')) {
                return;
            }

            getpIndvData(obj, false);
        });

        function getpIndvData(obj, isRefresh) {
            const id = obj.attr('data-id');
            const type = id.split('_')[0];
            const ProjectID = id.split('_')[1];

            var badgeValue = obj.find('span.itemcount').text();


            const typeMap = {
                "INCINFO": "buildIncompletePONew",
                "INCINFOP": "buildIncompleteProjectNew",
                "INCINFOV": "buildIncompleteVendorNew",
                "BDGTAPPR": "buildBudgetApprovalsNew",
                "POAPPR": "buildPOApprovalsNew",
                "POITEMAPPR": "buildFabApprovalsNew",
                "APPRSNDTOVNDRS": "buildapprovedpotasknew",
                "POACCEPT": "buildPOAcceptTasknew",
                "POREJECT": "buildPORejectTasknew",
                "REJBUD": "buildBudgetRejectTasknew",
                "POCHECKBACK": "buildPOCheckBackTasknew",
                "POITEMSTATUSCHANGE": "buildChangeStatustask",
                "POAC": "buildPOACTask",
                "APPSNDVNDRS": "buildVendorConfirmationTasknew"
            };

            const actionName = typeMap[type] || "";
            const url = "/Home/BuildIndvProjectTaskListData";

            if (!actionName) return;

            if (!isRefresh) {
                obj.append('<i class="fa fa-refresh" aria-hidden="true" id="refreshIndvPdata"></i>');
            }

            $.ajax({
                url: url,
                type: "GET",
                data: { ProjectID: ProjectID, actionName: actionName.trim() },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    if (data != '') {
                        $('#' + id + ' .accordion-body').html('');
                        $('#' + id + ' .accordion-body').html(data);

                        const $buttonDiv = obj.find('.newbuttonDiv').html('');
                        buildButtonsByType(type, ProjectID, $buttonDiv);

                        if (type == 'POITEMAPPR') {
                            $(".fabdate").datepickercustom({
                                changeMonth: true,
                                changeYear: true,
                                maxDate: 0,
                                altFormat: "yy.mm.dd",
                            });
                        }
                        $(obj).addClass('loaded');
                        if (isRefresh) {
                            $('#' + id).collapse('show');
                            var itemCount = $('#' + id + '_Count').attr('data-itemcount');
                            obj.find('span.itemcount').text(itemCount);

                        }
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });
        }

        function buildButtonsByType(type, ProjectID, $buttonDiv) {
            const templates = [];

            switch (type) {
                case 'POAPPR':
                    templates.push(
                        `<input type="button" class="gray_checkbtn ReadviewstatusSendvndr" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`,
                        `<input type="button" class="gray_checkbtn multipostatussaveAll" value="Save All"/>`,
                        `<input type="button" class="gray_checkbtn" value="Download All"/>`
                    );
                    break;

                case 'POITEMAPPR':
                    templates.push(`<input type="button" class="gray_checkbtn ReadviewstatusFabappr" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`);
                    break;
                case 'APPRSNDTOVNDRS':
                    templates.push(
                        `<input type="button" class="gray_checkbtn openpopupformailtovendormulti2" value="Dismiss Task"/>`,
                        `<input type="button" class="gray_checkbtn openpopupformailtovendormulti" id="sendingpo_${ProjectID}" data-projectid="${ProjectID}" value="Send PO"/>`,
                        `<input type="button" class="gray_checkbtn acceptpo" data-projectid="${ProjectID}" value="Accept PO"/>`,
                        `<input type="button" class="gray_checkbtn openpopupformailtovendormultiNew" id="pdfsend_${ProjectID}" data-projectid="${ProjectID}" value="Send PDF"/>`,
                        `<input type="button" class="gray_checkbtn ReadviewstatusSendvndr" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'POCHECKBACK':
                    templates.push(
                        `<input type="button" class="gray_checkbtn pocheckbacktaskcompleteAll" value="Dismiss All"/>`,
                        `<input type="button" class="gray_checkbtn pocheckbacktaskcomplete" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn Readviewstatuschkbck" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'POITEMSTATUSCHANGE':
                    templates.push(
                        `<input type="button" class="gray_checkbtn changestatustaskcompleteAll" value="Dismiss All"/>`,
                        `<input type="button" class="gray_checkbtn changestatustaskcomplete" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn ReadviewstatusFabstatus" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'POACCEPT':
                    templates.push(
                        `<input type="button" class="gray_checkbtn poaccepttastcompleteAll" value="Dismiss All"/>`,
                        `<input type="button" class="gray_checkbtn poaccepttastcomplete" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn ReadviewstatusAcpt" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'POAC':
                    templates.push(
                        `<input type="button" class="gray_checkbtn changestatuspoacommentall" value="Dismiss All"/>`,
                        `<input type="button" class="gray_checkbtn changestatuspoacomment" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn ReadviewstatusComment" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'POREJECT':
                    templates.push(
                        `<input type="button" class="gray_checkbtn porejecttaskcomplete" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn ReadviewstatusReject" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                    break;
                case 'APPSNDVNDRS':
                    templates.push(`<input type="button" class="gray_checkbtn acknowledgementcompleteallchecked" data-mode="ACCEPT" value="Accept Checked"/>`);

                    if ($('#hdn_usertype').val() === "6") {
                        templates.push(`<input type="button" class="gray_checkbtn opendownloadpospopupAll" value="Download All"/>`);
                    }

                    templates.push(`<input type="button" class="gray_checkbtn ReadviewstatusNotaccept" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`);
                    break;
                case 'REJBUD':
                    templates.push(
                        `<input type="button" class="gray_checkbtn budgettaskcompleteall" value="Dismiss All"/>`,
                        `<input type="button" class="gray_checkbtn budgettaskcomplete" value="Dismiss Checked"/>`,
                        `<input type="button" class="gray_checkbtn ReadViewBudgetStatusReject" data-mode="${type}" data-projectid="${ProjectID}" value="Mark All Read"/>`
                    );
                default:
                    break;
            }

            if (templates.length) {
                $buttonDiv.append(templates.join(''));
            }
        }

        $(document).on("click", ".viewBudgetReport", function () {

            var ProjerctId = $(this).attr('data-projectid');
            var SecionIds = $(this).attr('data-sectionids');

            $.ajax({
                url: "/Reports/BudgetReportByItemReportGeneration",
                type: 'GET',
                dataType: 'JSON',
                data: { ProjectId: ProjerctId, SectionIDs: SecionIds },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        window.open(data.Result, '_blank');
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".openBudgetApprovalhistory", function () {

            var ProjerctId = $(this).attr('data-projectid');
            var GroupId = $(this).attr('data-groupid');
            var sectionIDs = $(this).attr('data-sectionids');
            var SectionID = sectionIDs.split(',')[0];

            $.ajax({
                url: "/Home/GetBudgetApprovalHistory",
                type: 'GET',
                data: { ProjectID: ProjerctId, SectionID: SectionID, GroupID: GroupId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#partailBudgetApprovalHistory").html('');
                        $("#partailBudgetApprovalHistory").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });

        });

        $(document).on("click", ".ChangViewStatus", function () {
            var ProjerctId = $(this).attr('data-projectid');
            var VendorId = $(this).attr('data-id');
            var VCount = $(this).attr('data-vcount');
            var Mode = $(this).attr('data-mode');
            if (Mode == "REJBUD") {
                VendorId = "0";
            }

            $.ajax({
                url: "/Home/ChangViewStatusDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { ProjectId: ProjerctId, VendorId: VendorId, Number: VCount, Mode: Mode },
                success: function (data) {
                    if (data.IsSuccess) {

                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".ProffPO", function () {

            var poId = $(this).data('poid');
            var Iscommited = "N";
            var mode = 0;
            $.ajax({
                url: "/Reports/PurchaseOrderReportGeneration",
                data: { PurchaseOrderID: poId, showImageFlag: mode, IsCommited: Iscommited },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $('.loader').css('display', 'none');
                    if (data.IsSuccess) {
                        window.open(data.Result + "?v=" + new Date().getTime(), "_blank");
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on("click", ".openpohistory", function () {

            var level = $(this).attr('data-levelstatus');
            var POID = $(this).attr('data-poid');
            //var totl = parseInt(level.split('^')[0]);
            //var approved = parseInt(level.split('^')[1]);

            $.ajax({
                url: "/Home/GetPOApprovalHistory",
                type: 'GET',
                data: { LevelApprovalStatus: level, POID: POID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#partailPoApprovalHistory").html("");
                        $("#partailPoApprovalHistory").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            });

        });


        $(document).on("click", ".openOverCommited", function () {

            var ProjectId = $(this).attr('data-projectid');
            var POID = $(this).attr('data-poid');

            $.ajax({
                url: "/Home/GetPOOverCommited",
                type: 'GET',
                data: { POID: POID, ProjectId: ProjectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $("#PoOverCommitedModal").html("");
                        $("#PoOverCommitedModal").html(data);
                        $(".Committedlist").DataTable({
                            orderCellsTop: true,
                            scrollX: true,
                            language: {
                                emptyTable: "No data Available!"
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

        $(document).on('change', '.ddl_actiontype_change', function () {
            var Id = $(this).data('polineiteam');
            var ProjectId = $(this).data('projectid');
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
                BindUserOnchange(modeMappings[ddlid], Id, ProjectId);
            } else {
                userlist.empty().append("<option value='0'>---Select User---</option>");
            }

        });

        function BindUserOnchange(Mode, Id, ProjectId) {
            const $selectSec = $('#ddl_selectuser_' + Id);
            $.ajax({
                url: '/Home/GetProjectUserTypeOnDashboard',
                type: 'GET',
                dataType: 'JSON',
                data: { POItemApprovalID: Id },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        const PUtype = data.Result;

                        if (Mode === "GETUSERSFORAPPROVEREJECT" && PUtype === '4') {
                            $selectSec.attr('disabled', 'disabled');
                            return;
                        }
                        $selectSec.removeAttr('disabled');
                        fetchUsers(Mode, Id, ProjectId, $selectSec);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        function fetchUsers(Mode, Id, ProjectId, $selectSec) {
            $.ajax({
                url: '/PurchaseOrder/GetUsersOnFabrication',
                type: 'GET',
                dataType: 'JSON',
                data: { Mode: Mode, ApprovalID: Id, ProjectID: ProjectId },
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

        $(document).on('change', '.ddl_approvalpath_change', async function () {

            var $drpDown = $(this);

            var POLineItemID = $drpDown.data("item");
            var POLineItemApprovalID = $drpDown.data("id");
            var ProjectID = $drpDown.data("projectid");
            var CurrChangePathId = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    $.notify.error('Error', 'FabCurrentResponse cannot be null');
                    return;
                }

                var responseParts = FabCurrentResponse.split("^^");
                var FabPathApprovalID = responseParts[0];
                var currentstatus = responseParts[1];

                if (FabPathApprovalID === CurrChangePathId) {
                    getpIndvData($drpDown.parents('.accordion-collapse').eq(1).prev('.accordion-button.indvProjectTask'), true);
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
                            getpIndvData($drpDown.parents('.accordion-collapse').eq(1).prev('.accordion-button.indvProjectTask'), true);
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


        /*************** START OF "APPROVED PURCHASED ORDER SEND TO VENDORs" ****************/
        $(document).on('click', '.openindvfabhistory', function () {
            var PoLineItemApprovalID = $(this).data('approval');

            $.ajax({
                url: "/Home/GetFabIndvHistoryOnDashboard",
                type: "GET",
                dataType: "HTML",
                data: { PoLineItemApprovalID: PoLineItemApprovalID },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != '') {
                        $('#partialDashboardFabHistory').html('');
                        $('#partialDashboardFabHistory').html(data);
                    }
                    $(".loader").css("display", "none");
                }
            });

        });

        $(document).on("click", ".insidevendorcheckItems", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.vendormailtochk').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.vendormailtochk').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".vendormailtochk", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.vendormailtochk');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.insidevendorcheckItems');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });



        $(document).on("click", ".openpopupformailtovendormulti2", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.vendormailtochk:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Purchase Order Before Select Dismiss Task');
                //var collapseId = $button.closest('button.accordion-button').attr('data-id');
                //setTimeout(function () {
                //	$('#' + collapseId).collapse('show');
                //}, 500);				
                return;
            }           
            $.confirm({
                title: 'Warning',
                message: `Do you want to remove these ${count} PO(s) from the list to send?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    var POIDSSS = poIds.join("^");
                    ApprovePOSendToVendorDismissTask(POIDSSS);
                }
            });
        });       

        function ApprovePOSendToVendorDismissTask(POIDSSS) {
            $.ajax({
                url: "/Home/ApprovePOSendToVendorDismissTask",
                type: 'GET',
                dataType: 'JSON',
                data: { PoIds: POIDSSS },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        //window.open(data.Result, '_blank');
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        $(document).on("click", ".openpopupformailtovendormulti", function () {

            const $button = $(this);
            let poIds = [];
            let emails = [];
            let contactIds = [];

            const ProjectID = $button.attr('data-projectid');
            const Addcc = 1;

            $button.parent().parent().next('div').find('.vendormailtochk:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
                emails.push($(this).attr('data-email'));
                contactIds.push($(this).attr('data-contactid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.error('Error', 'Please Select Purchase Order Before Select Send PO');
                return;
            }

            // Get only unique emails
            emails = [...new Set(emails)];
            contactIds = [...new Set(contactIds)];

            $.ajax({
                url: "/PurchaseOrder/GetPOMailTemplate",
                type: 'GET',
                dataType: 'JSON',
                /*data: { PoIds: poIds.join("^") },*/
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (result) {
                    if (result.IsSuccess) {
                        let mailBody = result.Result.mailBody;
                        let subject = result.Result.subject;

                        $('#vendormailto').val(emails.join(", "));
                        $('#vendormailto').attr('data-email', emails.join(","));
                        $('#vendormailto').attr('data-contactid', contactIds.join(","));

                        $('#subject').val('');
                        $('#subject').val(subject);
                        var editor = tinymce.get('editor');

                        $('#send_mail_modal').modal('show');

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

                        $('#mailsendvendorbtn').attr('data-poid', poIds.join(","));
                        $('#mailsendvendorbtn').attr('data-projectid', ProjectID);
                    }
                    else {
                        $.notify.error('Error', result.Result);
                    }
                    $('.loader').css('display', 'none');
                }
            });

        });

        $(document).on("click", "#mailsendvendorbtn", function () {

            const $button = $(this);
            const poids = $button.attr('data-poid');
            const projectId = $button.attr('data-projectid');

            var mailbody = encodeURIComponent(tinyMCE.get('editor').getContent());
            var mailtosend = $('#vendormailto').val();
            var mailsubject = $('#subject').val();
            var mailtoreal = $('#vendormailto').attr('data-contactid');

            var addcc = $('#sendaddcc').is(':checked') ? "1" : "0";

            if (mailtosend.trim() == "") {
                $.notify.warning('Caution', 'Please Add recipient');
                return;
            }

            if (mailbody.trim() == "") {
                $.notify.warning('Caution', 'Please Add Body');
                return;
            }

            var mailArray = mailtosend.split(',').map(x => x.trim());
            var contactIdArray = mailtoreal.split(',').map(x => x.trim());

            // Combine into desired format
            var combinedList = [];
            for (var i = 0; i < contactIdArray.length; i++) {
                if (contactIdArray[i] && mailArray[i]) {
                    combinedList.push(contactIdArray[i] + '^' + mailArray[i]);
                }
            }
            var fd = new FormData();
            fd.append("mailsubject", mailsubject);
            fd.append("mailbody", mailbody);
            fd.append("poid", poids);
            fd.append("Project_ID", projectId);
            fd.append("addcc", addcc);
            fd.append("mailContactMap", JSON.stringify(combinedList));

            $.ajax({
                url: "/Home/VendorMailSendDashboard",
                type: 'POST',
                dataType: 'JSON',
                data: fd,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (result) {
                    if (result.IsSuccess) {
                        $.notify.success('Success', result.Result);
                        $('#send_mail_modal').modal('hide');

                        var $obj = $("#sendingpo_" + projectId);
                        setTimeout(function () {
                            getpIndvData($obj.closest('button.accordion-button'), true);
                        }, 4000);

                    }
                    else {
                        $.notify.error('Error', result.ErrorMessages);
                        setTimeout(function () {
                            $('#send_mail_modal').modal('hide');
                        }, 4000);
                    }
                    $('.loader').css('display', 'none');
                }
            });

        });

        $(document).on("click", ".acceptpo", function () {

            const $button = $(this);
            let poIds = [];


            $button.parent().parent().next('div').find('.vendormailtochk:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.error('Error', 'Please select PO to send');
                return;
            }

            $.ajax({
                url: "/Home/CompleteVendorConfirmation",
                type: 'GET',
                dataType: 'JSON',
                data: { Poids: poIds.join(","), Comment: "" },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".openpopupformailtovendormultiNew", function () {

            const $button = $(this);
            let poIds = [];
            let emails = [];
            let contactIds = [];

            const ProjectID = $button.attr('data-projectid');
            const Addcc = 1;

            $button.parent().parent().next('div').find('.vendormailtochk:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
                emails.push($(this).attr('data-email'));
                contactIds.push($(this).attr('data-contactid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.error('Error', 'Please Select Purchase Order Before Select Send PO Pdf');
                return;
            }

            // Get only unique emails
            emails = [...new Set(emails)];
            contactIds = [...new Set(contactIds)];

            $.ajax({
                url: "/User/getMailContent",
                type: 'GET',
                dataType: 'JSON',
                data: { mode: "PDFSEND" },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (result) {
                    if (result.IsSuccess) {
                        let mailBody = decodeURIComponent(result.Result.split('!##!')[0]);
                        let subject = result.Result.split('!##!')[1];

                        $('#vendormailto_new').val(emails.join(", "));
                        $('#vendormailto_new').attr('data-email', emails.join(","));
                        $('#vendormailto_new').attr('data-vid', contactIds.join(","));

                        $('#vendormailsubject_new').val('');
                        $('#vendormailbody_new').val('');
                        $('#vendormailsubject_new').val(subject);
                        var editor = tinymce.get('vendormailbody_new');

                        $('#sendmailtovendor_new').modal('show');

                        if (editor == null) {
                            tinymce.init({
                                selector: "#vendormailbody_new",
                                plugins: "textcolor",
                                toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent| forecolor backcolor"
                                , menubar: false
                                , height: "300px"
                                , init_instance_callback: function () { tinyMCE.get('vendormailbody_new').setContent(mailBody); }
                            });
                        }
                        else {
                            editor.setContent(mailBody);
                        }

                        $('#mailsendvendorbtn_new').attr('data-poid', poIds.join(","));
                        $('#mailsendvendorbtn_new').attr('data-projectid', ProjectID);
                        $('#mailsendvendorbtn_new').attr('data-vendorid', contactIds.join(","));
                    }
                    else {
                        $.notify.error('Error', result.Result);
                    }
                    $('.loader').css('display', 'none');
                }
            });

        });

        $(document).on("click", "#mailsendvendorbtn_new", function () {

            const $button = $(this);
            const poids = $button.attr('data-poid');
            const projectId = $button.attr('data-projectid');
            const vendorId = $button.attr('data-vendorid');

            var mailbody = encodeURIComponent(tinyMCE.get('vendormailbody_new').getContent());
            var mailtosend = $('#vendormailto_new').val();
            var mailsubject = $('#vendormailsubject_new').val();

            var addcc = $('#sendaddcc_new').is(':checked') ? "1" : "0";

            if (mailtosend.trim() == "") {
                $.notify.warning('Caution', 'Please Add recipient');
                return;
            }

            if (mailbody.trim() == "") {
                $.notify.warning('Caution', 'Please Add Body');
                return;
            }

            var mailArray = mailtosend.split(',').map(x => x.trim());
            var vendorIdArray = vendorId.split(',').map(x => x.trim());

            // Combine into desired format
            var combinedList = [];
            for (var i = 0; i < vendorIdArray.length; i++) {
                if (vendorIdArray[i] && mailArray[i]) {
                    combinedList.push(vendorIdArray[i] + '^' + mailArray[i]);
                }
            }
            var fd = new FormData();
            fd.append("mailsubject", mailsubject);
            fd.append("mailbody", mailbody);
            fd.append("poid", poids);
            fd.append("Project_ID", projectId);
            fd.append("addcc", addcc);
            fd.append("mailContactMap", JSON.stringify(combinedList));

            $.ajax({
                url: "/Home/VendorMailSendPDF",
                type: 'POST',
                dataType: 'JSON',
                data: fd,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (result) {

                    if (result.IsSuccess) {
                        $.notify.success('Success', result.Result);
                        $('#sendmailtovendor_new').modal('hide');

                        var $obj = $("#pdfsend_" + projectId);
                        setTimeout(function () {
                            getpIndvData($obj.closest('button.accordion-button'), true);
                        }, 4000);

                    }
                    else {
                        $.notify.error('Error', result.ErrorMessages);
                        setTimeout(function () {
                            $('#send_mail_modal').modal('hide');
                        }, 4000);
                    }
                    $('.loader').css('display', 'none');
                }
            });

        });

        $(document).on("click", ".ReadviewstatusSendvndr", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_Sendvndrs:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.error('Error', 'Please Select Vendors  Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                }
            });

        });

        /*************** END OF "APPROVED PURCHASED ORDER SEND TO VENDORs" ****************/

        /*************** START OF "PURCHASED ORDERS PENDING APPROVAL" ****************/

        //$(document).on("click", ".multipostatussaveAll", function () {
        //    debugger;
        //    const $button = $(this);
        //    var approvestat = 0;
        //    var rejectstat = 0;
        //    var commentstat = 0;
        //    var tmp = 0;

        //    var farray = new Array();
        //    var calls = [];

        //    $button.parent().parent().next('div').find('.poapproverejectchk:checked').each(function () {
        //        var id = $(this).attr('data-id');
        //        if ($(this).hasClass('approve')) {
        //            //var res = '';
        //            //res = approvePOBatch(id, $(this));
        //            //if (res != 'Failed') {
        //            //    tmp += res.split('|')[0];
        //            //    if (res.split('|')[1] != '') {
        //            //        farray.push(res.split('|')[1])
        //            //    }
        //            //    approvestat++;
        //            //}
        //            calls.push(approvePOBatch(id, $(this)));
        //        }
        //        else if ($(this).hasClass('reject')) {
        //            var returnRejecttmp = rejectPOBatch(id, $(this));
        //            if (returnRejecttmp === 1) {
        //                tmp += returnRejecttmp;
        //                rejectstat++;
        //            }

        //        }
        //        else if ($(this).hasClass('comment')) {
        //            var returnCommtmp = commentPO(id, $(this));
        //            if (returnCommtmp === 1) {
        //                tmp += returnCommtmp;
        //                commentstat++;
        //            }

        //        }

        //    });
        //    $.when.apply($, calls).done(function () {
        //        var responses = [];

        //        // If only ONE ajax call
        //        if (calls.length === 1) {
        //            responses.push(arguments[0]);  // arguments[0] is data directly
        //        }
        //        else {
        //            // Multiple ajax calls
        //            for (var i = 0; i < arguments.length; i++) {
        //                responses.push(arguments[i][0]); // [data, status, xhr]
        //            }
        //        }
        //        for (var j = 0; j < responses.length; j++) {
        //            var data = responses[j];

        //            var res = '1|' + data.Result;

        //            tmp += res.split('|')[0];
        //            if (res.split('|')[1] != '') {
        //                farray.push(res.split('|')[1]);
        //            }
        //            approvestat++;
        //        }
        //    });

        //    if (tmp != 0) {
        //        var mailDetails = new Array();
        //        var Innerarry = new Array();
        //        for (var k = 0; k < farray.length; k++) {
        //            for (var v = 0; v < farray[k].split(',').length; v++) {
        //                Innerarry.push(farray[k].split(',')[v]);
        //            }
        //        }
        //        mailDetails = Innerarry;
        //        for (var j = 0; j < Innerarry.length; j++) {
        //            for (var i = 0; i < Innerarry.length; i++) {
        //                var temp = '';
        //                if (Innerarry[j].split('^')[0] == Innerarry[Innerarry.length - 1 - i].split('^')[0]) {
        //                    if (Innerarry[j].split('^')[3] != Innerarry[Innerarry.length - 1 - i].split('^')[3]) {
        //                        temp = Innerarry[j].split('^')[0] + '^' + Innerarry[j].split('^')[1] + '^' + Innerarry[j].split('^')[2] + '^' + Innerarry[j].split('^')[3] + ',' + Innerarry[Innerarry.length - 1 - i].split('^')[3];
        //                        Innerarry.splice(j, 1, temp);
        //                        Innerarry.splice(Innerarry.length - 1 - i, 1);
        //                        //mailDetails.push(temp);
        //                    }
        //                }

        //            }
        //        }
        //        for (var z = 0; z < Innerarry.length; z++) {
        //            $.ajax({
        //                type: "GET",
        //                url: "/Home/SendMailForPOApprovalBatch_New",
        //                async: false,
        //                data: { 'TempEmailID': Innerarry[z].split('^')[0], 'USERNAME': Innerarry[z].split('^')[1], 'POS': Innerarry[z].split('^')[3], 'PROJECTNAME': Innerarry[z].split('^')[2] },
        //                beforeSend: function () {
        //                    $(".loader").css("display", "flex");
        //                },
        //                success: function (data) {
        //                    $(".loader").css("display", "none");
        //                    if (data.IsSuccess) {

        //                    } else {
        //                        $.notify.error('Error', data.ErrorMessages);
        //                    }
        //                },
        //                error: function (error) {
        //                    $(".loader").css("display", "none");
        //                    $.notify.error('Error', error);
        //                    console.error(error);
        //                }
        //            });
        //        }
        //    }

        //    window.setTimeout(function () {

        //        if (approvestat != 0) {
        //            var message = "Successfully  approved " + approvestat + " PO(s) ";
        //            $.notify.success('Success', message);
        //        }
        //        if (rejectstat != 0) {
        //            var message = "Successfully rejected " + rejectstat + " PO(s). ";
        //            $.notify.success('Success', message);
        //        }
        //        if (commentstat != 0) {
        //            var message = "Successfully commented " + commentstat + " PO(s). ";
        //            $.notify.success('Success', message);
        //        }

        //    }, 2000);
        //    getpIndvData($button.closest('button.accordion-button'), true);

        //});

        $(document).on("click", ".multipostatussaveAll", function () {
            const $button = $(this);

            var approvestat = 0;
            var rejectstat = 0;
            var commentstat = 0;
            var tmp = 0;
            var farray = [];

            var calls = [];

            $button.parent().parent().next('div')
                .find('.poapproverejectchk:checked').each(function () {

                    var id = $(this).attr('data-id');

                    if ($(this).hasClass('approve')) {
                        calls.push(approvePOBatch(id, $(this)));
                    }
                    else if ($(this).hasClass('reject')) {
                        var returnRejecttmp = rejectPOBatch(id, $(this));
                        if (returnRejecttmp === 1) {
                            tmp += returnRejecttmp;
                            rejectstat++;
                        }
                    }
                    else if ($(this).hasClass('comment')) {
                        var returnCommtmp = commentPO(id, $(this));
                        if (returnCommtmp === 1) {
                            tmp += returnCommtmp;
                            commentstat++;
                        }
                    }

                });

            $.when.apply($, calls).done(function () {

                var responses = [];

                if (calls.length === 1) {
                    responses.push(arguments[0]);
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        responses.push(arguments[i][0]);
                    }
                }

                for (var j = 0; j < responses.length; j++) {

                    var data = responses[j];

                    if (data.IsSuccess) {
                        var res = '1|' + data.Result;

                        tmp += parseInt(res.split('|')[0]);

                        if (res.split('|')[1] !== '') {
                            farray.push(res.split('|')[1]);
                        }

                        approvestat++;
                    }
                }

                if (tmp != 0) {

                    var Innerarry = [];

                    for (var k = 0; k < farray.length; k++) {
                        var parts = farray[k].split(',');
                        for (var v = 0; v < parts.length; v++) {
                            Innerarry.push(parts[v]);
                        }
                    }

                    for (var j = 0; j < Innerarry.length; j++) {
                        for (var i = 0; i < Innerarry.length; i++) {
                            if (Innerarry[j].split('^')[0] ==
                                Innerarry[Innerarry.length - 1 - i].split('^')[0]) {

                                if (Innerarry[j].split('^')[3] !=
                                    Innerarry[Innerarry.length - 1 - i].split('^')[3]) {

                                    var temp =
                                        Innerarry[j].split('^')[0] + '^' +
                                        Innerarry[j].split('^')[1] + '^' +
                                        Innerarry[j].split('^')[2] + '^' +
                                        Innerarry[j].split('^')[3] + ',' +
                                        Innerarry[Innerarry.length - 1 - i].split('^')[3];

                                    Innerarry.splice(j, 1, temp);
                                    Innerarry.splice(Innerarry.length - 1 - i, 1);
                                }
                            }
                        }
                    }

                    // Send mails
                    for (var z = 0; z < Innerarry.length; z++) {

                        $.ajax({
                            type: "GET",
                            url: "/Home/SendMailForPOApprovalBatch_New",
                            async: false,
                            data: {
                                'TempEmailID': Innerarry[z].split('^')[0],
                                'USERNAME': Innerarry[z].split('^')[1],
                                'POS': Innerarry[z].split('^')[3],
                                'PROJECTNAME': Innerarry[z].split('^')[2]
                            }
                        });
                    }
                }

                if (approvestat != 0) {
                    $.notify.success('Success',
                        "Successfully approved " + approvestat + " PO(s)");
                }

                if (rejectstat != 0) {
                    $.notify.success('Success',
                        "Successfully rejected " + rejectstat + " PO(s).");
                }

                if (commentstat != 0) {
                    $.notify.success('Success',
                        "Successfully commented " + commentstat + " PO(s).");
                }
                getpIndvData($button.closest('button.accordion-button'), true);

            });

        });

        function approvePOBatch(POID, obj) {
            var res = 'Failed';
            var Comment = $(obj).parent().parent().find('td:eq(7)').find('input').val();
            var ismanager = $('#ismanager_' + POID).val();
            var UserID = "0";


            var f = $(obj).parent().parent().find('td:eq(6)').find('input');
            //console.log(f);
            var fd = new FormData();
            for (var i = 0; i < f[0].files.length; i++) {
                fd.append('file' + i, f[0].files[i]);
            }



            if (ismanager == "1") {
                UserID = $('#userddl_' + POID).val();
                if (UserID == "0") {
                    $.notify.warning('Caution', 'Please select an user');
                    return 0;
                }
            }
            fd.append('POID', POID);
            fd.append('Comment', Comment);
            fd.append('UserID', UserID);
            return $.ajax({
                type: "POST",
                url: "/Home/ApprovePOBatch",
                dataType: "JSON",
                data: fd,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                //success: function (data) {
                //    debugger;
                //    console.log(data);                    
                //    if (data.IsSuccess) {
                //        res = '1|' + data.Result;
                //    } else {
                //        $.notify.error('Error', data.ErrorMessages);
                //    }
                //    $(".loader").css("display", "none");
                //}
            });
           /* return res;*/

        }
        function rejectPOBatch(POID, obj) {
            var result = 0;
            var Comment = $(obj).parent().parent().find('td:eq(7)').find('input').val();
            if (Comment.trim() == "") {
                $.notify.warning('Caution', 'Enter comment to reject the PO');
                return;
            }
            var f = $(obj).parent().parent().find('td:eq(6)').find('input');
            var fd = new FormData();
            for (var i = 0; i < f[0].files.length; i++) {
                fd.append('file' + i, f[0].files[i]);
            }

            var ismanager = $('#ismanager_' + POID).val();
            var UserID = "0";



            if (ismanager == "1") {
                UserID = $('#userddl_' + POID).val();
                if (UserID == "0") {
                    $.notify.warning('Caution', 'Please select an user');
                    return;
                }
            }
            fd.append('POID', POID);
            fd.append('Comment', Comment);
            fd.append('UserID', UserID);
            $.ajax({
                type: "POST",
                url: "/Home/RejectPO",
                dataType: "JSON",
                data: fd,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        result = 1;
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                        result = 0;
                    }

                }
            });

            return result;
        }
        function commentPO(POID, obj) {
            var result = 0;
            var Comment = $(obj).parent().parent().find('td:eq(7)').find('input').val();
            if (Comment.trim() == "") {
                $.notify.warning('Caution', 'Enter comment!');
                return;
            }
            var f = $(obj).parent().parent().find('td:eq(6)').find('input');
            var fd = new FormData();
            for (var i = 0; i < f[0].files.length; i++) {
                fd.append('file' + i, f[0].files[i]);
            }

            var ismanager = $('#ismanager_' + POID).val();
            var UserID = "0";

            if (ismanager == "1") {
                UserID = $('#userddl_' + POID).val();
                if (UserID == "0") {
                    $.notify.warning('Caution', 'Please select an user');
                    return;
                }
            }
            fd.append('POID', POID);
            fd.append('Comment', Comment);
            fd.append('UserID', UserID);
            $.ajax({
                type: "POST",
                url: "/Home/CommentPO",
                dataType: "JSON",
                data: fd,
                contentType: false,
                processData: false,
                async: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        result = 1;
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                        result = 0;
                    }

                }
            });

            return result;
        }

        $(document).on("click", ".poapproverejectchk", function () {

            const $button = $(this);
            var status = $button.is(':checked');
            var id = $button.attr('data-id');
            if (status != true) {
                return;
            }
            if ($('#ismanager_' + id).val() == '1' && $('#userddl_' + id).val() == '0' && !$button.hasClass('comment')) {
                $.notify.warning('Caution', 'Please Select a User first');
                $button.prop('checked', !status);
                return;
            }
            if ($button.hasClass('approve')) {
                $('#poreject_' + id).prop('checked', !status);
                $('#pocomment_' + id).prop('checked', !status);
            }
            else if ($button.hasClass('reject')) {
                var Comments = $button.parent().parent().find('td:eq(7)').find('input').val();
                if (Comments.trim() == "") {
                    $.notify.warning('Caution', 'You cannot select reject without a comment');
                    $button.prop('checked', !status);
                }
                else {
                    $('#poapprove_' + id).prop('checked', !status);
                    $('#pocomment_' + id).prop('checked', !status);
                }

            }
            else if ($button.hasClass('comment')) {
                var Comments = $button.parent().parent().find('td:eq(7)').find('input').val();
                if (Comments.trim() == "") {
                    $.notify.warning('Caution', 'You must put a comment');
                    $button.prop('checked', !status);
                }
                else {
                    $('#poapprove_' + id).prop('checked', !status);
                    $('#poreject_' + id).prop('checked', !status);
                }

            }
        });

        $(document).on("keyup", ".poapproverejectchk2", function () {

            var $button = $(this);
            var id = $button.attr('data-id');
            var rw = $button.parent().parent().parent();
            var user = rw.find('td:eq(6)').find('select').val();
            var comment = rw.find('td:eq(7)').find('input').val().trim();
            var ismanager = rw.find('td:eq(6)').find('input').val();

            if (ismanager == '1' && user == '0') {
                $('#poapprove_' + id).prop('checked', false);
                $('#poreject_' + id).prop('checked', false);
            }

            if (comment == '') {
                $('#poreject_' + id).prop('checked', false);
                $('#pocomment_' + id).prop('checked', false);
            }
        });

        /*************** END OF "PURCHASED ORDERS PENDING APPROVAL" ****************/

        /*************** START OF "BUDGET APPROVAL" ****************/

        $(document).on('click', '.approveBudget', function () {
            const obj = $(this);
            var ProjectID = obj.attr('data-projectid');
            var groupid = obj.attr('data-groupid');
            var Commentval = obj.parent().parent().find('td:eq(3) input').val();
            var ismanager = $('#ismanager_budget_' + ProjectID + '_' + groupid).val();

            var ManagerID = "0";
            if (ismanager == "1") {
                ManagerID = $('#userddl_budget_' + ProjectID + '_' + groupid).val();
                if (ManagerID == "0" || ManagerID == null) {
                    $.notify.warning('Caution', 'Please select an user.');
                    return;
                }
            }

            let fd = {
                ProjectID: ProjectID,
                Comment: Commentval,
                ManagerID: ManagerID,
                GroupID: groupid
            }

            $.ajax({
                url: "/Home/ApproveBudget",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        var accordionButton = obj.closest('.accordion-collapse')
                            .prev('.accordion-button.indvProjectTask');

                        getpIndvData(accordionButton, true);
                    }
                    else {
                        $.notify.error('Error', 'Something went Wrong.');
                    }
                    $(".loader").css("display", "none");

                }

            })
        });

        $(document).on('click', '.rejectBudget', function () {
            const obj = $(this);
            var ProjectID = $(this).attr('data-projectid');
            var groupid = $(this).attr('data-groupid');
            var Commentval = $(this).parent().parent().find('td:eq(3) input').val();
            var ismanager = $('#ismanager_budget_' + ProjectID + '_' + groupid).val();

            if (Commentval == "" || Commentval == null || Commentval?.trim() == "") {
                $.notify.warning('Caution', 'Enter comment to reject the budget');
                return;
            }
            var ManagerID = "0";
            if (ismanager == "1") {
                ManagerID = $('#userddl_budget_' + ProjectID + '_' + groupid).val();
                if (ManagerID == "0" || ManagerID == null) {
                    $.notify.warning('Caution', 'Please select a user.');
                    return;
                }
            }

            let fd = {
                ProjectID: ProjectID,
                Comment: Commentval,
                ManagerID: ManagerID,
                GroupID: groupid
            }

            $.ajax({
                url: "/Home/RejectBudget",
                type: "POST",
                data: fd,
                dataType: "JSON",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        var accordionButton = obj.closest('.accordion-collapse')  // Find parent accordion collapse div
                            .prev('.accordion-button.indvProjectTask');

                        getpIndvData(accordionButton, true);
                    }
                    else {
                        $.notify.error('Error', 'Something went Wrong.');
                    }
                    $(".loader").css("display", "none");

                }

            })
        });

        /*************** END OF "BUDGET APPROVAL" ****************/

        var selectedpoidsatt = new Array();
        var selectedponumberatt = [];

        $(document).on('click', '.download_btn', function () {

            var poid = $(this).data('poid');
            var ponumber = $(this).data('showid');

            $(this).toggleClass('checked');
            var ischecked = $(this).hasClass('checked');
            if (ischecked) {
                selectedpoidsatt.push(poid);
                selectedponumberatt.push(ponumber);
            }
            else {
                var index = selectedpoidsatt.indexOf(poid);

                if (index > -1) {
                    selectedpoidsatt.splice(index, 1);
                }

                index = selectedponumberatt.indexOf(ponumber);

                if (index > -1) {
                    selectedponumberatt.splice(index, 1);
                }



            }
            if (selectedpoidsatt.length > 0) {
                $('#downloadBtn').removeClass('d-none');
                $('#downloadBtn').find('#downloadCount').html(selectedpoidsatt.length);
            }
            else {
                $('#downloadBtn').addClass('d-none');
            }

        });

        $(document).on('click', '#downloadBtn', async function () {
            if (selectedpoidsatt.length > 0) {
                try {
                    $(".loader").css("display", "flex");

                    await GetPoDetailsForDownload(selectedpoidsatt.join(','));
                    await GetPoFilesToDownload(selectedpoidsatt.join(','));

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
                    data: { PoIds },
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
                    data: { PoIds },
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

        function CheckTermsPDFCheckbox() {
            const po_attachment_checkboxes = document.querySelectorAll('#poAttachmentDownload input[type="checkbox"]');
            const po_attachment_isChecked = Array.from(po_attachment_checkboxes).every(checkbox => checkbox.checked);
            if (po_attachment_isChecked) {
                $('#checkuncheckallattachments').prop('checked', true);
            }
            else {
                $('#checkuncheckallattachments').prop('checked', false);
            }
        }

        function CheckPOPDFCheckbox() {
            const po_PDF_checkboxes = document.querySelectorAll('#poPDFDownload input[type="checkbox"]');
            const po_PDF_isChecked = Array.from(po_PDF_checkboxes).every(checkbox => checkbox.checked);

            if (po_PDF_isChecked) {
                $('#checkuncheckallpdfs').prop('checked', true);
            }
            else {
                $('#checkuncheckallpdfs').prop('checked', false);
            }
        }

        //$(document).on('click', '#downloadBtn', function () {

        //    var poids = selectedpoidsatt.join(",");

        //    if (selectedpoidsatt.length > 0) {
        //        GetPoDetailsForDownload(selectedpoidsatt.join(','));
        //        GetPoFilesToDownload(selectedpoidsatt.join(','));
        //    }

        //});
        //function GetPoDetailsForDownload(PoIds) {

        //    $.ajax({
        //        url: "/PurchaseOrder/GetPoDetailsForDownload",
        //        type: 'GET',
        //        dataType: 'JSON',
        //        data: { PoIds: PoIds },
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (result) {                   
        //            if (result.IsSuccess) {
        //                let data = result.Result;
        //                let response =
        //                    data.map(d => {
        //                        return `
        //                        <input checked data-poid='${d.purchaseOrderID}' type='checkbox' class='downloadablepopdfs mrg5L mrg5R' style='margin-top:1px;' />
        //                        <span>
        //                            ${d.poNumber} - ${d.parentVendorName} - ${d.contactName} 
        //                            ${d.remarks}
        //                        </span>
        //                    `;
        //                    }).join('<br/>');
        //                $('#poPDFDownload').html('');
        //                $('#poPDFDownload').html(response);
        //            } else {
        //                $('#poPDFDownload').html('');
        //                $('#poPDFDownload').html("<span> No data Found.</span >");
        //            }
        //        },
        //        complete: function () {
        //            $(".loader").css("display", "none");
        //        }
        //    });           
        //}
        //function GetPoFilesToDownload(PoIds) {
        //    let attachmentHtml = '';
        //    let termsHtml = '';

        //    $.ajax({
        //        url: "/PurchaseOrder/GetPoFilesToDownload",
        //        type: 'GET',
        //        dataType: 'JSON',
        //        data: { PoIds: PoIds },
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (result) {
        //            if (result.IsSuccess) {
        //                let data = result.Result;
        //                if (data.length > 0) {
        //                    attachmentHtml = data.map(v => {
        //                        let filename = v.fileName;
        //                        return `
        //                        <input data-filename='${filename}' type='checkbox' class='downloadablepoattachments mrg5L mrg5R' style='margin-top:1px;' />
        //                        <a target='_blank' href ='${baseurl}ProjectFiles/${filename}' title='Download this file'>${filename}</a>
        //                    `;
        //                    }).join('<br/>');
        //                }
        //            } else {
        //                $.notify.error('Error', result.Result);
        //            }
        //        },
        //        complete: function () {
        //            $(".loader").css("display", "none");
        //        }
        //    }); 

        //    $.ajax({
        //        url: "/PurchaseOrder/GetPoTermsFiles",
        //        type: 'GET',
        //        dataType: 'JSON',
        //        data: { PoIds: PoIds },
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (result) {
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
        //                            <a target='_blank' href ='/Assets/SystemTermsFiles/${fileName}' title='Download this file'>${FileNameshow}</a>`;
        //                        }
        //                        else {
        //                            for (var i = 0; i < filenames.length; i++) {
        //                                if (i > 0) {
        //                                    html += "<br>";
        //                                }
        //                                html += `<input checked data-projectid='${ProjectID}' data-filename='${fileName}' type='checkbox' class='downloadabletermsfile mrg5L mrg5R' style='margin-top:1px;' />
        //                            <a target='_blank' href ='/Assets/TermsConditionFiles/${fileName}' title='Download this file'>${FileNameshow}</a>`;
        //                            }
        //                        }
        //                    });
        //                }
        //                termsHtml += html;
        //            } else {
        //                $.notify.error('Error', result.Result);
        //            }
        //        },
        //        complete: function () {
        //            $(".loader").css("display", "none");
        //        }
        //    });           

        //    if (termsHtml != "") { termsHtml += "<br />"; }
        //    termsHtml = termsHtml + attachmentHtml;

        //    $('#poAttachmentDownload').html('');
        //    $('#poAttachmentDownload').html(termsHtml);
        //}

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

        //$(document).on('click', '#downloadFilesBtn', function () {
        //	ReadyAttatchmentFile();
        //	ReadyTermsFile();
        //	//Add the PO RDLC report
        //	DownloadZipFile();
        //});
        //function ReadyAttatchmentFile() {
        //	let attachments = '';
        //	$('.downloadablepoattachments').each(function () {
        //		if ($(this).is(':checked')) {
        //			let filename = $(this).attr('data-filename');
        //			attachments += attachments == "" ? filename : "^" + filename;
        //		}
        //	});

        //	const url = '/PurchaseOrder/InsertToFolder';
        //	const formData = { attachments: attachments };

        //	$.ajax({
        //		url: url,
        //		type: 'GET',
        //		data: formData,
        //		async: false,
        //		cache: false,
        //		success: function () {
        //			$('.loader').css('display', 'none');
        //		},
        //		error: function (err) {
        //			$('.loader').css('display', 'none');
        //			console.log(err)
        //		}
        //	});



        //}
        //function ReadyTermsFile() {
        //	let projectid = '';
        //	$('.downloadabletermsfile').each(function () {
        //		if ($(this).is(':checked')) {
        //			projectid += projectid == '' ? $(this).attr('data-projectid') : '^' + $(this).attr('data-projectid');
        //		}
        //	});

        //	const url = '/PurchaseOrder/InsertTerms';
        //	const formData = { poids: projectid };

        //	$.ajax({
        //		url: url,
        //		type: 'GET',
        //		data: formData,
        //		async: false,
        //		cache: false,
        //		success: function () {
        //			$('.loader').css('display', 'none');
        //		},
        //		error: function (err) {
        //			$('.loader').css('display', 'none');
        //			console.log(err)
        //		}
        //	});


        //}
        //function DownloadZipFile() {
        //	const url = '/PurchaseOrder/DownloadZipFile';

        //	$.ajax({
        //		url: url,
        //		type: 'GET',
        //		data: {},
        //		async: false,
        //		cache: false,
        //		success: function (result) {
        //			$('#btn_sendbatchatt').hide();
        //			$('.fa-download').removeClass('checked');
        //			selectedpoidsatt = [];
        //			selectedponumberatt = [];
        //			notify(true, "Zip file created", true);
        //			$('#download_files').modal('hide');
        //			setTimeout(() => {
        //				window.open(result, "_blank");
        //			}, 2000);
        //			$('.loader').css('display', 'none');
        //		},
        //		error: function (err) {
        //			$('.loader').css('display', 'none');
        //			console.log(err);
        //		}
        //	});			
        //}
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
                notify(false, "There are no files selected for download.");
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
                    $.notify.success('Success', 'Zip file created');
                    //$('#btn_sendbatchatt').hide();
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
            //selectedpoidsatt.length = 0;
            //selectedPoNumber.length = 0;
            //let length = selectedPoIds.length;
            //$('#approvalCount').text(length);
            //$('#approvalBtn').hide();

            //selectedPoIdsVendor.length = 0;
            //selectedEMailVendor.length = 0;
            //length = selectedPoIdsVendor.length;
            //$('#mailCount').text(length);
            //$('#mailBtn').hide();

            //selectedPoidsAtt.length = 0;
            //selectedPoNumberAtt.length = 0;
            //length = selectedPoidsAtt.length;
            selectedpoidsatt = [];
            $('#downloadCount').text("0");
            $('#downloadBtn').addClass('d-none');
        }
        $(document).on('click', '#unselectBtn', function () {
            selectedpoidsatt = [];
            selectedponumberatt = [];
            $('#downloadBtn').addClass('d-none');
            $('.fa-download').removeClass('checked');
            $('#download_files').modal('hide');
        });


        /*************** START OF "PENDING FABRICATION APPROVAL" ****************/

        $(document).on('click', '.saveData', async function () {

            var $button = $(this);

            var POLineItemID = $(this).data("item");
            var POLineItemApprovalID = $(this).data("approval");
            var ProjectID = $(this).data("projectid");
            var FabPathGrpName = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").text();
            var ApprovalPathID = $('#ddl_grpname_' + POLineItemApprovalID).children("option:selected").val();
            var IsManager = $(this).data("ismanager");


            var ActionType = $('#ddl_actiontype_' + POLineItemApprovalID).val();
            var ActionDate = '';
            var CommentFab = $('#textarea_' + POLineItemApprovalID).val().trim();
            var ActionByProjectManager = "0";

            try {
                var FabCurrentResponse = await CheckFabPathApprovedID(POLineItemApprovalID);
                if (!FabCurrentResponse) {
                    $.notify.error('Error', 'FabCurrentResponse cannot be null');
                    return;
                }

                var responseParts = FabCurrentResponse.split("^^");
                var FabPathApprovalID = responseParts[0];
                var currentstatus = responseParts[1];


                if ((currentstatus == "Received" || currentstatus == "Approved" || currentstatus == "PathSet" || currentstatus == "Rejected") && (FabPathApprovalID == ApprovalPathID)) {
                    if (ActionType == 0) {
                        $.notify.error('Error', 'Please select an Action');
                        return;
                    }
                }

                if (IsManager == "1") {
                    var ActionByProjectManager = $('#ddl_selectuser_' + POLineItemApprovalID).val();
                    var putype = await getUserTypeProject(POLineItemApprovalID, ProjectID);
                    if (putype != "4") {
                        if (IsManager == "1" && ActionByProjectManager == "0" && (ActionType == "1" || ActionType == "6" || ActionType == "2" || ActionType == "3")) {
                            $.notify.error('Error', 'Please select an user');
                            return;
                        }
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
                            return;
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

                                var message = ActionType === '2' ? "Approved Successfully"
                                    : ActionType === '3' ? "Rejected Successfully"
                                        : ActionType === '4' ? "Added comment Successfully"
                                            : ActionType === '6' ? "Sent Successfully"
                                                : ActionType === '1' ? "Received Successfully"
                                                    : "Action completed successfully";

                                $.notify.success('Success', message);
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                            setTimeout(function () {
                                var accordionButton = $button.parents('.accordion-collapse').eq(1).prev('.accordion-button.indvProjectTask');
                                getpIndvData(accordionButton, true);
                            }, 500);

                        }
                    });
                }

            } catch (error) {
                $.notify.error('Error', error);
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

        function getUserTypeProject(Id, ProjectId) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/Home/GetProjectUserTypeOnDashboard',
                    type: 'GET',
                    dataType: 'JSON',
                    data: { POItemApprovalID: Id },
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

        $(document).on("click", ".ReadviewstatusFabappr", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.ChangViewStatus').each(function () {
                vendorIds.push($(this).attr('data-id'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors  Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                    
                }
            });           
        });


        /*************** END OF "PENDING FABRICATION APPROVAL" ****************/

        /*************** START OF "PO NOT YET ACCEPTED BY VENDOR" ****************/

        $(document).on("click", ".vendorcheck_notaccept", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.vendorchk').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.vendorchk').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".acknowledgementcompleteallchecked", async function () {

            const $button = $(this);
            const utype = $('#hdn_usertype').val();
            const mode = $button.attr('data-mode');
            const $checkedItems = $button.parent().parent().next('div').find('.vendorchk:checked');

            if ($checkedItems.length === 0) return;

            if (utype === '6') {                
                $.confirm({
                    title: 'Accept Purchase Order?',
                    message: 'By accepting this Purchase Order the Vendor agrees to the Terms and Conditions and accepts all associated documents included.',
                    type: 'confirm',
                    confirmText: 'Accept',
                    cancelText: 'Decline',
                    onConfirm: async function () {                      
                        await processAcknowledgement($button, $checkedItems, mode);
                    },
                    onCancel: function () {
                    }
                });
            }
            else {
                await processAcknowledgement($button, $checkedItems, mode);
            }           
        });
        async function processAcknowledgement($button, $checkedItems, mode) {
            $(".loader").css("display", "flex");

            const promises = [];
            $checkedItems.each(function () {
                const comment = $(this).closest('tr').find('td:eq(4) input').val();
                const poid = $(this).attr('data-poid');
                promises.push(acknowledgementcomplete1(poid, comment, mode));
            });

            try {
                await Promise.all(promises);
                $.notify.success('Success', 'Purchase Order(s) accepted successfully');
            } catch (error) {
                console.error("One or more PO accepted failed", error);
                $.notify.error('Error', 'Failed to accept one or more Purchase Orders');
            } finally {
                $(".loader").css("display", "none");
                getpIndvData($button.closest('button.accordion-button'), true);
            }
        }

        async function acknowledgementcomplete1(poid, comment, mode) {

            const utype = $('#hdn_usertype').val();

            if (utype === '6') {                
                $.confirm({
                    title: 'Are You Sure?',
                    message: `By accepting this Purchaseorder the vendor agrees to the Terms and Conditions and accepts all associated documents included.`,
                    type: 'confirm',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        CompleteVendorConfirmation();
                    },
                    onCancel: function () {
                        return;
                    }
                });
                return;
            }

            await CompleteVendorConfirmation();

            async function CompleteVendorConfirmation() {
                try {
                    const result = await $.ajax({
                        url: "/Home/CompleteVendorConfirmation",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { Poids: poid, Comment: comment }
                    });

                    if (result.IsSuccess) {
                        $.notify.success('Success', 'PO accepted successfully.');
                    } else {
                        $.notify.error('Error', result.ErrorMessages);
                        throw new Error(result.ErrorMessages);
                    }
                } catch (error) {
                    $.notify.error('Error', error.message || error);
                    throw error;
                }
            }          
        }

        $(document).on("click", ".ReadviewstatusNotaccept", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_notaccept:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors  Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {                    
                }
            });

        });

        $(document).on("click", ".vendorchk", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.vendorchk');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_notaccept');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });

        /*************** END OF "PO NOT YET ACCEPTED BY VENDOR" ****************/

        /*************** START OF "PURCHASE ORDER REJECTED" ****************/

        $(document).on("click", ".vendorcheck_reject", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.completereject').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.completereject').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".porejecttaskcomplete", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completereject:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed Checked');
                return;
            }

            $.ajax({
                url: "/Home/CompleteRejectedTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { poids: poIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".budgettaskcomplete", function () {
            const $button = $(this);
            let budgetIds = [];
            $button.parent().parent().next('div').find('.completebudgetreject:checked').each(function () {
                budgetIds.push($(this).attr('data-budgetid'));
            });
            const count = budgetIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Selecting Dismiss Checked');
                return;
            }
            $.ajax({
                url: "/Home/CompleteRejectedBudgetTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { budgetIds: budgetIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        });       

        $(document).on("click", ".budgettaskcompleteall", function () {
            const $button = $(this);
            let budgetIds = [];

            $button.parent().parent().next('div').find('.completebudgetreject').each(function () {
                budgetIds.push($(this).attr('data-budgetid'));
            });

            $.ajax({
                url: "/Home/CompleteRejectedBudgetTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { budgetIds: budgetIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");

                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".ReadviewstatusReject", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_reject:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors  Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });

            

        });

        $(document).on("click", ".ReadViewBudgetStatusReject", function () {
            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let budgets = [];

            //$button.parent().parent().next('div').find('.budgetcheck_reject:checked').each(function () {
            //    budgets.push($(this).attr('data-budgetid'));
            //});

            let count = 0;

            $('.budgetcheck_reject:checked').each(function () {
                const vcount = $(this)
                    .closest('.accordion-button')   // go to the button
                    .data('vcount');               // read the stored count

                count += parseInt(vcount);
            });
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Budget(s)  Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: "0", Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });
        })

        $(document).on('change', '.budgetcheck_reject', function () {
            const budgetId = $(this).data('budgetid');
            const isChecked = $(this).is(':checked');

            $('.completebudgetreject[data-budgetgroup="' + budgetId + '"]')
                .prop('checked', isChecked);
        });

        $(document).on('click', '#approvalHistory', function () {

            var projectId = $(this).data("projectid");
            var budgetid = $(this).data("groupid");            
            //var groupId = "0";
            $.ajax({
                url: "/Home/GetApprovalHistoryTableInDashboard?ProjectId=" + projectId + "&GroupId=" + budgetid,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $('#approvedBudgetHistoryTable').html('');
                        $('#approvedBudgetHistoryTable').html(data);
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    //var projectId = $("#Project_Name_List").find("option:selected").data("id");
                    //var versionId = $('#currentV').val();
                    //var SectionId = versionId == "0" ? $("#ProjectSectionDropDown").find("option:selected").val() : $('#PreviousProjectSection option:selected').val();

                    //if (SectionId == null || SectionId == undefined) {
                    //    SectionId = "0";
                    //}
                    //getApprovalStatusForSentBudget(projectId, SectionId);

                },
                complete: function () {
                    $(".loader").css("display", "none");
                }
            });
        });

        $(document).on("click", ".completereject", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.completereject');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_reject');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });

        /*************** END OF "PURCHASE ORDER REJECTED" ****************/

        /*************** START OF "PURCHASE ORDER COMMENT" ****************/

        $(document).on("click", ".vendorcheck_comment", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.completepoacomment').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.completepoacomment').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".changestatuspoacommentall", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completepoacomment').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: `Are you sure you want to dismiss these ${count} notifications?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/CompletePoCommentTaskDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { poids: poIds.join("^") },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });

        });

        $(document).on("click", ".changestatuspoacomment", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completepoacomment:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.ajax({
                url: "/Home/CompletePoCommentTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { poids: poIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        // $(document).on("click", ".ReadviewstatusComment", function () {

        //     const $button = $(this);
        //     const ProjectID = $button.attr('data-projectid');
        //     const mode = $button.attr('data-mode');
        //     let vendorIds = [];

        //     $button.parent().parent().next('div').find('.vendorcheck_comment :checked').each(function () {
        //         vendorIds.push($(this).attr('data-vendorid'));
        //     });

        //     const count = vendorIds.length;
        //     if (count == 0) {
        //         $.notify.warning('Caution', 'Please Select Vendors Before Select Mark all read');
        //         return;
        //     }

        //     $.confirm({
        //         title: 'Warning',
        //         message: 'Do you want to remove the NEW notification from all of these?',
        //         type: 'warning',
        //         confirmText: 'Continue',
        //         cancelText: 'Go Back',
        //         onConfirm: function () {
        //             $.ajax({
        //                 url: "/Home/ChangViewStatusDashboard",
        //                 type: 'GET',
        //                 dataType: 'JSON',
        //                 data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
        //                 beforeSend: function () {
        //                     $(".loader").css("display", "flex");
        //                 },
        //                 success: function (data) {
        //                     $(".loader").css("display", "none");
        //                     if (data.IsSuccess) {
        //                         getpIndvData($button.closest('button.accordion-button'), true);
        //                     } else {
        //                         $.notify.error('Error', data.ErrorMessages);
        //                     }
        //                 }
        //             });
        //         },
        //         onCancel: function () {
        //         }
        //     });
        // });

        $(document).on("click", ".ReadviewstatusComment", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            // Auto-select all vendor checkboxes
            const $checkboxes = $button.parent().parent().next('div').find('.vendorcheck_comment');
            $checkboxes.prop('checked', true);

            // Collect all vendor IDs after auto-select
            $checkboxes.each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;

            if (count == 0) {
                $.notify.warning('Caution', 'No vendors found');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: {
                            ProjectId: ProjectID,
                            VendorId: vendorIds.join(","),
                            Number: count,
                            Mode: mode
                        },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                }
            });
        });

        $(document).on("click", ".completepoacomment", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.completepoacomment');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_comment');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });

        /*************** END OF "PURCHASE ORDER COMMENT" ****************/

        /*************** START OF "PURCHASE ORDER ACCEPTED BY VENDOR" ****************/

        $(document).on("click", ".vendorcheck_Sendvndrs", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.completeaccept').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.completeaccept').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".poaccepttastcompleteAll", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completeaccept').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }


            $.confirm({
                title: 'Warning',
                message: `Are you sure you want to dismiss these ${count} notifications?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/CompletePoAcceptTaskDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { poids: poIds.join("^") },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           
            
        });

        $(document).on("click", ".poaccepttastcomplete", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completeaccept:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.ajax({
                url: "/Home/CompletePoAcceptTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { poids: poIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".ReadviewstatusAcpt", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_Sendvndrs:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           
        });

        $(document).on("click", ".completeaccept", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.completeaccept');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_Sendvndrs');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });


        /*************** END OF "PURCHASE ORDER ACCEPTED BY VENDOR" ****************/

        /*************** START OF "FABRICATION APPROVAL STATUS" ****************/

        $(document).on("click", ".vendorcheck_fabstatus", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.completechangestatus').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.completechangestatus').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".changestatustaskcompleteAll", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completechangestatus').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: `Are you sure you want to dismiss these ${count} notifications?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/CompleteChangeStatusTaskDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { poids: poIds.join("^") },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           

        });

        $(document).on("click", ".changestatustaskcomplete", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completechangestatus:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.ajax({
                url: "/Home/CompleteChangeStatusTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { poids: poIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".ReadviewstatusFabstatus", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_fabstatus:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: 'Do you want to remove the NEW notification from all of these?',
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           

        });

        $(document).on("click", ".completechangestatus", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.completechangestatus');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_fabstatus');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });

        /*************** END OF "FABRICATION APPROVAL STATUS" ****************/

        /*************** START OF "CHECKBACK PO" ****************/

        $(document).on("click", ".vendorcheck_chkbck", function () {

            var obj = $(this);
            var flag = false;

            if (obj.is(':checked') == true) {
                flag = true;
                obj.parent().parent().next('div').find('.completecheckback').each(function () {
                    $(this).prop('checked', flag);
                });

                obj.prop('checked', true);
            }
            else {
                flag = false;
                obj.parent().parent().next('div').find('.completecheckback').each(function () {
                    $(this).prop('checked', flag);
                });
                obj.prop('checked', false);
            }

            var collapseId = obj.parent().parent().next('div').attr('id');
            setTimeout(function () {
                $('#' + collapseId).collapse('show');
            }, 500);


        });

        $(document).on("click", ".completecheckback", function () {

            const $table = $(this).closest('table');
            const $checkboxes = $table.find('.completecheckback');
            const checkedCount = $checkboxes.filter(':checked').length;
            const uncheckedCount = $checkboxes.length - checkedCount;

            const $collapseDiv = $(this).closest('.accordion-collapse');
            const vendorId = $collapseDiv.attr('id').split('_').pop();

            const $headerCheckbox = $('.accordion-button[data-id="' + vendorId + '"]').find('.vendorcheck_chkbck');
            $headerCheckbox.prop('checked', true);

            if (uncheckedCount === 0) {
                $headerCheckbox.prop('checked', true);
            } else {
                $headerCheckbox.prop('checked', false);
            }

        });

        $(document).on("click", ".pocheckbacktaskcompleteAll", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completecheckback').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }


            $.confirm({
                title: 'Warning',
                message: `Are you sure you want to dismiss these ${count} notifications?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/CompletePoCheckBackTaskDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { poids: poIds.join("^") },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           
        });

        $(document).on("click", ".pocheckbacktaskcomplete", function () {

            const $button = $(this);
            let poIds = [];

            $button.parent().parent().next('div').find('.completecheckback:checked').each(function () {
                poIds.push($(this).attr('data-poid'));
            });

            const count = poIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Items Before Select Dismissed All');
                return;
            }

            $.ajax({
                url: "/Home/CompletePoCheckBackTaskDashboard",
                type: 'GET',
                dataType: 'JSON',
                data: { poids: poIds.join("^") },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        getpIndvData($button.closest('button.accordion-button'), true);
                    } else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });

        });

        $(document).on("click", ".Readviewstatuschkbck", function () {

            const $button = $(this);
            const ProjectID = $button.attr('data-projectid');
            const mode = $button.attr('data-mode');
            let vendorIds = [];

            $button.parent().parent().next('div').find('.vendorcheck_chkbck:checked').each(function () {
                vendorIds.push($(this).attr('data-vendorid'));
            });

            const count = vendorIds.length;
            if (count == 0) {
                $.notify.warning('Caution', 'Please Select Vendors Before Select Mark all read');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: `Do you want to remove the NEW notification from all of these?`,
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    $.ajax({
                        url: "/Home/ChangViewStatusDashboard",
                        type: 'GET',
                        dataType: 'JSON',
                        data: { ProjectId: ProjectID, VendorId: vendorIds.join(","), Number: count, Mode: mode },
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                getpIndvData($button.closest('button.accordion-button'), true);
                            } else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    });
                },
                onCancel: function () {
                }
            });           
        });

        /*************** END OF "CHECKBACK PO" ****************/

        $(document).on('click', '.openbudgetgroup', function () {
            var Groupid = $(this).attr('data-itemid');

            $.ajax({
                url: "/Home/GetGroupById",
                type: "GET",
                data: { GroupId: Groupid },
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != "") {
                        $("#ListOfBudgetGroupList").html("");
                        $("#ListOfBudgetGroupList").html(data);
                        $('#approvalsec').modal('show');
                    }
                    else {
                        $.notify.error('Error', 'Something went wrong');
                    }
                    $(".loader").css("display", "none");
                }
            })
        });


        //#region Redirections

        $(document).on('click', '.pohistoryredirect', function () {
            var poid = $(this).data('poid');
            const url = "/PurchaseOrder/ViewPOHistory?PoId=" + poid;
            window.open(url, "_blank");

        });


        //#endregion Redirections

    }
    // #endregion

    // #region :: Dashboard Settings
    if (_ActionName === "mysettings") {

        $(document).on("input", "#txt_newpassword", function (e) {
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

        $(document).on("input", "#txt_retypenewpassword", function (e) {
            let password = $("#txt_newpassword").val();
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


        $(document).on('click', '#UpdatePassword_btn', function () {

            if ($('#txt_oldpassword').val().trim() == '') {
                errorfunc('txt_oldpassword', 'Please insert old Password.');
                return;
            }
            var oldpassword = $('#txt_oldpassword').val().trim();

            if ($('#txt_newpassword').val().trim() == '') {
                errorfunc('txt_newpassword', 'Please insert new Password.');
                return;
            }

            var newpassword = $('#txt_newpassword').val()?.trim();
            //var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,15}$/;
            var val = newpassword;
            if (val.length > 7 && val.length < 16) {
                if (val.match(decimal)) {
                }
                else {
                    $('#txt_newpassword').val('');
                    errorfunc('txt_newpassword', 'Password Must contains atleast one lower case,one upper case,one digit and one special character.');
                    return false;
                }
            }
            else {
                $('#txt_newpassword').val('');
                errorfunc('txt_newpassword', 'Password must be between 8 to 15 character');
                return false;
            }


            if ($('#txt_retypenewpassword').val()?.trim() == '') {
                errorfunc('txt_retypenewpassword', 'Please re insert new Password.');
                return;
            }
            if ($('#txt_retypenewpassword').val()?.trim() != $('#txt_newpassword').val()?.trim()) {
                $('#txt_retypenewpassword').val('');
                errorfunc('txt_retypenewpassword', 'Password mismatched!');
                return;
            }

            var retypenewpassword = $('#txt_retypenewpassword').val()?.trim();

            let fd = {
                oldpassword: oldpassword,
                newpassword: val,
                retypenewpassword: retypenewpassword

            }

            $.ajax({
                url: "/Home/UpdatepassWord",
                data: fd,
                type: "POST",
                dataType: "json",

                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                    else {
                        let title = data.ErrorMessages.join(",");
                        $.notify.error('Error', title);
                    }
                    $(".loader").css("display", "none");
                }
            });

        });
    }
    // #endregion
});