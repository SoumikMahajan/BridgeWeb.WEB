$(document).on("UserPreferencesReady", function () {
    const _BaseURL = window.location.origin;
    const _QueryParameter = window.location.pathname.split('/');
    const _ActionName = _QueryParameter[2].toLocaleLowerCase();

    // #region :: Reports
    if (_ActionName === 'report') {

        const UserPreferProjectId = window._UserPreferences["Dropdown.ProjectId"] || '0';

        $('.fromsearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'

        });
        $('.tosearch').datepickercustom({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy/mm/dd'
        });

        $("#txt_Project").multipleSelect({
            placeholder: "Please Select Project",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: false,
            onClick: function (e) {
                if ($("#txt_Project").multipleSelect("getSelects").length > 5) {
                    var lastSelectedValue = e.value;
                    var allSelectedvalues = $("#txt_Project").val();
                    var index = allSelectedvalues.indexOf(lastSelectedValue);
                    allSelectedvalues.splice(index, 1);
                    $("#txt_Project").multipleSelect("setSelects", allSelectedvalues, true);
                    $.notify.warning('Caution', 'Select maximum five projects!');
                }
            },
            onClose: function (e) {
                const projectValues = $("#txt_Project").val();
                if (!projectValues) {
                    return;
                }
                const ProjectId = projectValues.join(',');
                UpdateUserPreferense(ProjectId);
                bind_section(ProjectId);

            }
        });
        if (UserPreferProjectId && UserPreferProjectId !== "0") {
            let selectedProjects = UserPreferProjectId.split(",");

            if (selectedProjects.length > 5) {
                selectedProjects = selectedProjects.slice(0, 5); // take only first 5               
            }

            $("#txt_Project").multipleSelect("setSelects", selectedProjects);
            bind_section(UserPreferProjectId);
        }

        $(document).on('click', '#txt_Project + .ms-parent .icon-close', function () {
            UpdateUserPreferense("");
            bind_section("");
        });

        $(".txtSection").multipleSelect({
            placeholder: "Please Select Sections",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".txtVendor").multipleSelect({
            placeholder: "Please Select Vendors",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".txt_Ship_To").multipleSelect({
            placeholder: "Please Select Ship",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".ddl_ItemStatus").multipleSelect({
            placeholder: "Please Select",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".ddl_approvaltype").multipleSelect({
            placeholder: "Please Select",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".ddl_approvalstatus").multipleSelect({
            placeholder: "Please Select Status",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });
        $(".ddl_BankAcount").multipleSelect({
            placeholder: "Please Select Bank",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: false,
            single: true
        });
        $(".txt_PaymentMode").multipleSelect({
            placeholder: "Please Select Payment Mode",
            filter: true,
            filterPlaceholder: "Enter Keyword",
            showClear: true,
            selectAll: true
        });

        //GetAllProjectList();
        //function GetAllProjectList() {
        //    $.ajax({
        //        url: '/Reports/GetListOfProjectForReport',
        //        type: 'GET',
        //        dataType: 'JSON',               
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (data) {
        //            $(".loader").css("display", "none");
        //            if (data.IsSuccess) {
        //                const $select = $("#txt_Project");
        //                $select.empty();

        //                data.Result.forEach(function (project) {
        //                    const option = `<option value="${project.projectID}">${project.proName}</option>`;
        //                    $select.append(option);
        //                });

        //                $select.multipleSelect('refresh');                      
        //            }
        //            else {
        //                notify(data.IsSuccess, data.ErrorMessages, false);
        //            }
        //        },
        //        error: function (error) {
        //            $(".loader").css("display", "none");
        //            notify(false, error, false);
        //            console.error(error);
        //        }
        //    });
        //}

        function bind_section(ProjectId) {

            $.ajax({
                url: '/Reports/GetSectionVendor',
                type: 'GET',
                dataType: 'JSON',
                data: { ProjectIds: ProjectId },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        const $selectSec = $(".txtSection");
                        $selectSec.empty();
                        data.Result.sectionList.forEach(function (section) {
                            const option = `<option value="${section.id}">${section.name}</option>`;
                            $selectSec.append(option);
                        });
                        $selectSec.multipleSelect('refresh');


                        const $selectVen = $(".txtVendor");
                        $selectVen.empty();
                        data.Result.vendorList.forEach(function (vendor) {
                            const option = `<option value="${vendor.id}">${vendor.name}</option>`;
                            $selectVen.append(option);
                        });
                        $selectVen.multipleSelect('refresh');

                        const $selectShip = $(".txt_Ship_To");
                        $selectShip.empty();
                        data.Result.shipToList.forEach(function (ship) {
                            const option = `<option value="${ship.id}">${ship.name}</option>`;
                            $selectShip.append(option);
                        });
                        $selectShip.multipleSelect('refresh');

                    }
                    else {
                        //notify(data.IsSuccess, data.ErrorMessages, false);
                        const $selectSec = $(".txtSection");
                        $selectSec.empty();
                        $selectSec.multipleSelect('refresh');

                        const $selectVen = $(".txtVendor");
                        $selectVen.empty();
                        $selectVen.multipleSelect('refresh');

                        const $selectShip = $(".txt_Ship_To");
                        $selectShip.empty();
                        $selectShip.multipleSelect('refresh');

                    }
                }
            });
        }

        $('.datecontrol').on('change', function () {

            //var activeTab = $('.tab_container .nav-link.active').data('bs-target');
            //var activeTabContent = $(activeTab);

            //var from = activeTabContent.find('.' + $(this).data('from'));
            //var to = activeTabContent.find('.' + $(this).data('to'));

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

        $(document).on("click", ".exportToPDF", function (e) {

            e.preventDefault();

            var exportFormat = $(this).data('format');

            const projectValues = $("#txt_Project").val();
            if (!projectValues) {
                $.notify.warning('Caution', 'Please Select Projects!');
                return;
            }
            const ProjectId = projectValues.join(',');


            var activeTab = $('.tab_container .nav-link.active').data('bs-target');
            if (activeTab === '#systab1') {
                if ($("#systab1 .txtBudgetReportCategory").val() == "0") {
                    $.notify.warning('Caution', 'Please select report type!!');
                    return;
                }
                if ($("#systab1 .txtBudgetReportCategory").val() == "1") {
                    BudgetReportByItemReportGenerationFilter(ProjectId, exportFormat);
                }
                else if ($("#systab1 .txtBudgetReportCategory").val() == "2") {
                    BudgetReportSummaryReportGenerationFilter(ProjectId, exportFormat);
                }
            }
            else if (activeTab === '#systab2') {
                var GroupType = $('#systab2 .txtStatusReportCategory').val();
                if (GroupType == '0') {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                else {
                    PurchaseCommitmentReportGenerationFilter(ProjectId, GroupType, exportFormat);
                }

            }
            else if (activeTab === '#systab3') {
                var GroupType = $('#systab3 .txtBudgetReportCategory').val();
                if (GroupType == '0') {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                else {
                    CommittedCostReportGenerationFilter(ProjectId, GroupType, exportFormat);
                }

            }
            else if (activeTab === '#systab4') {
                var GroupType = $('#systab4 .txtStatusReportCategory').val();
                if (GroupType == '0') {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                else if (GroupType == '4' || GroupType == '5') {
                    ApprovalStatusReportGenerationFilter(ProjectId, exportFormat);
                }
                else {
                    ExpeditNoteReportGenerationFilter1(ProjectId, exportFormat);
                }

            }
            else if (activeTab === '#systab5') {
                NewFabStatusReportGeneration(ProjectId, exportFormat);
            }
            else if (activeTab === '#systab6') {
                ReceivingReportSectionReportGenerationFilter(ProjectId, exportFormat);
            }
            else if (activeTab === '#systab7') {
                var ReportType = $('#systab7 .txtBudgetReportCategory').val();
                if (ReportType == '0') {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                var GroupType = $('#systab7 .txtStatusReportCategory').val();
                if (GroupType == null) {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                if (ReportType == '1') {
                    PODetailReportGenerationByDetails(ProjectId, ReportType, GroupType, exportFormat);
                }
                if (ReportType == '2') {
                    PODetailReportGenerationBySummery(ProjectId, ReportType, GroupType, exportFormat);
                }
            }
            else if (activeTab === '#systab8') {
                var ReportType = $('#systab8 .txtBudgetReportCategory').val();
                if (ReportType == '0') {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                var GroupType = $('#systab8 .txtStatusReportCategory').val();
                if (GroupType == null) {
                    $.notify.warning('Caution', 'Please Select Type of Report!');
                    return;
                }
                InvoiceReportGenerationFilter(ProjectId, ReportType, GroupType, exportFormat);
            }
            else if (activeTab === '#systab9') {
                PrintedChequeListReportGenerationFilter(ProjectId, exportFormat);
            }
            else {
                console.log('No active tab detected.');
            }
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
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            });
        }

        function UpdateUserPreferense(ProjectId) {
            const preferences = [];
            preferences.push({
                PreferenceKey: 'Dropdown.ProjectId',
                PreferenceValue: ProjectId || '0'
            });
            SetProjectPreference(preferences);
        }

        /**************************** START OF BUDGET REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        function BudgetReportByItemReportGenerationFilter(ProjectId, exportFormat) {

            let AllSectionID = $('#systab1 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            fetchReportData(
                '/Reports/BudgetReportByItemReportGeneration',
                { ProjectId: ProjectId, SectionIDs: SectionId, exportFormat: exportFormat }
            );
        }

        function BudgetReportSummaryReportGenerationFilter(ProjectId, exportFormat) {

            let AllSectionID = $('#systab1 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            fetchReportData(
                '/Reports/BudgetReportSummaryReportGeneration',
                { ProjectId: ProjectId, SectionIDs: SectionId, exportFormat: exportFormat }
            );
        }

        /**************************** END OF BUDGET REPORT GENERATIONS *****************************/
        /*******************************************************************************************/

        /**************************** START OF PURCHASE COMMITMENT REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        function PurchaseCommitmentReportGenerationFilter(ProjectId, GroupType, exportFormat) {

            let AllSectionID = $('#systab2 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            fetchReportData(
                '/Reports/PurchaseCommitmentReportGeneration',
                { ProjectId: ProjectId, SectionIDs: SectionId, GroupType: GroupType, exportFormat: exportFormat }
            );

        }

        /**************************** END OF PURCHASE COMMITMENT REPORT GENERATIONS *****************************/
        /*******************************************************************************************/

        /**************************** START OF COMMITMENT COST REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        function CommittedCostReportGenerationFilter(ProjectId, GroupType, exportFormat) {

            commCostUrl = '';
            if (GroupType == "1") {
                commCostUrl = '/Reports/CommittedCostReportDetailReportGeneration';
            }
            if (GroupType == "2") {
                commCostUrl = '/Reports/CommittedCostReportSummeryReportGeneration'
            }
            let AllSectionID = $('#systab3 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            fetchReportData(
                commCostUrl,
                { ProjectId: ProjectId, SectionIDs: SectionId, exportFormat: exportFormat }
            );

        }

        /**************************** END OF COMMITMENT COST REPORT GENERATIONS *****************************/
        /*******************************************************************************************/


        /**************************** START OF STATUS REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        $(document).on("change", "#systab4 .txtStatusReportCategory", function () {

            $('#systab4 .txt_Ship_To option:selected').remove();
            $('#systab4 .txt_Ship_To').multipleSelect('refresh');

            $('#systab4 .ddl_ItemStatus option:selected').remove();
            $('#systab4 .ddl_ItemStatus').multipleSelect('refresh');

            $('#systab4 .ddl_approvaltype option:selected').remove();
            $('#systab4 .ddl_approvaltype').multipleSelect('refresh');

            $('#systab4 .ddl_approvalstatus option:selected').remove();
            $('#systab4 .ddl_approvalstatus').multipleSelect('refresh');


            if ($(this).val() == '4' || $(this).val() == '5') {
                $("#statusHideShow").hide();
                $("#hideShowApprovaltype").show();
                if ($(this).val() == '4') {
                    $("#systab4 .ddl_Sort").html("");
                    $("#systab4 .ddl_Sort").html("<option value='1'>Item</option>\n<option value='2'>PO</option>\n<option value='3'>Required Date</option>");
                }
                else {
                    $("#systab4 .ddl_Sort").html("");
                    $("#systab4 .ddl_Sort").html("<option value='1'>PO</option>");
                }
            }
            else {
                $("#hideShowApprovaltype").hide();
                $("#statusHideShow").show();
                $("#systab4 .ddl_Sort").html("");
                $("#systab4 .ddl_Sort").html("<option value='1'>Item</option>\n<option value='2'>PO</option>\n<option value='3'>Arrival Date</option>");
            }
        });

        function ExpeditNoteReportGenerationFilter1(AllProjectID, exportFormat) {
            let AllSectionID = $('#systab4 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }
            let AllVendorID = $('#systab4 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }
            let AllShipToID = $("#systab4 .txt_Ship_To").val();
            let ShipId = "";
            if (AllShipToID) {
                ShipId = AllShipToID.join(',');
            }

            let ALlStatusID = $("#systab4 .ddl_ItemStatus").val();
            let Status = "";
            if (ALlStatusID) {
                Status = ALlStatusID.join(',');
            }

            var POWoutItems = $("#systab4 #itva").is(":checked") ? "1" : "0";

            var From_Date;
            var To_date;
            if ($("#systab4 .fromsearch").val() != '')
                From_Date = ($("#systab4 #fromsearch").val());
            else
                From_Date = null;
            if ($("#systab4 .tosearch").val() != '')
                To_date = ($("#systab4 #tosearch").val());
            else
                To_date = null;

            var NoteStatus = $("#systab4 .ddl_NoteStatus").val();

            var OrderPattern = $('#systab4 .ddl_Sort').val();

            var ReportOption = parseInt(($('#systab4 .txtStatusReportCategory').val() - 1) * 3) + parseInt($('#systab4 .ddl_Sort').val());

            fetchReportData(
                '/Reports/ExpeditNoteReportGenerationByVendor',
                {
                    ProjectID: AllProjectID,
                    SectionID: SectionId,
                    VendorID: VendorId,
                    ShipTo: ShipId,
                    Status: Status,
                    POWoutItems: POWoutItems,
                    StartDate: From_Date,
                    EndDate: To_date,
                    NoteStatus: NoteStatus,
                    order: OrderPattern,
                    ReportOption: ReportOption,
                    exportFormat: exportFormat
                }
            );

        }

        function ApprovalStatusReportGenerationFilter(AllProjectID, exportFormat) {
            let AllSectionID = $('#systab4 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }
            let AllVendorID = $('#systab4 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }
            let AllApprovalTypeID = $('#systab4 .ddl_approvaltype').val();
            let ApprovalType = "";
            if (AllApprovalTypeID) {
                ApprovalType = AllApprovalTypeID.join(',');
            }

            let AllApprovalStatusID = $('#systab4 .ddl_approvalstatus').val();
            let ApprovalStatus = "";
            if (AllApprovalStatusID) {
                ApprovalStatus = AllApprovalStatusID.join(',');
            }


            var ReportOption = parseInt(($('#systab4 .txtStatusReportCategory').val() - 1) * 3) + parseInt($('#systab4 .ddl_Sort').val());

            fetchReportData(
                '/Reports/ApprovalStatusReportGeneration',
                {
                    ProjectID: AllProjectID,
                    SectionID: SectionId,
                    VendorID: VendorId,
                    ApprovalType: ApprovalType,
                    ApprovalStatus: ApprovalStatus,
                    ReportOption: ReportOption,
                    exportFormat: exportFormat
                }
            );

        }

        /**************************** END OF STATUS REPORT GENERATIONS *****************************/
        /*******************************************************************************************/

        /**************************** START OF FABRICATION REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        function NewFabStatusReportGeneration(AllProjectID, exportFormat) {

            let AllVendorID = $('#systab5 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            let AllStatusID = $('#systab5 .ddl_approvalstatus').val();
            let StatusId = "";
            if (AllStatusID) {
                StatusId = AllStatusID.join(',');
            }

            fetchReportData(
                '/Reports/FabStatusReportGeneration',
                {
                    ProjectId: AllProjectID,
                    VendorId: VendorId,
                    StatusID: StatusId,
                    exportFormat: exportFormat
                }
            );
        }

        /**************************** END OF FABRICATION REPORT GENERATIONS *****************************/
        /*******************************************************************************************/

        /**************************** START OF RECEIVING REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        $(document).on("change", "#systab6 .txtStatusReportCategory", function () {

            $('#systab6 .txtVendor option:selected').remove();
            $('#systab6 .txtVendor').multipleSelect('refresh');

            $('#systab6 .txtSection option:selected').remove();
            $('#systab6 .txtSection').multipleSelect('refresh');

            $('#systab6 .ddl_ItemStatus').multipleSelect('refresh');

            if ($(this).val() == '1') {
                $("#systab6 #HideShowVendor").hide();
                $("#systab6 #HideItemAndDate").hide();
                $("#systab6 .ddl_Sort").html("");
                $("#systab6 .ddl_Sort").html("<option value='1' selected>Item</option>\n<option value='2'>PO</option>");
            }
            if ($(this).val() == '2') {
                $("#systab6 #HideShowVendor").show();
                $("#systab6 #HideItemAndDate").hide();
                $("#systab6 .ddl_Sort").html("");
                $("#systab6 .ddl_Sort").html("<option value='1' selected>PO</option>\n<option value='2'>Vendor</option>\n<option value='3'>Item</option>");
            }
            if ($(this).val() == '3') {
                $("#systab6 #HideShowVendor").show();
                $("#systab6 #HideItemAndDate").show();
                $("#systab6 .ddl_Sort").html("");
                $("#systab6 .ddl_Sort").html("<option value='1' selected>PO</option>\n<option value='2'>Item</option>");
            }
        });

        function ReceivingReportSectionReportGenerationFilter(AllProjectID, exportFormat) {


            var GroupType = $('#systab6 .txtStatusReportCategory').val();
            if (GroupType == '0') {
                $.notify.warning('Caution', 'Please Select Type of Report!');
                return;
            }

            let AllSectionID = $('#systab6 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            let AllVendorID = $('#systab6 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }
            var ReportOption;
            var OrderPattern = "";

            let ALlStatusID = $("#systab6 .ddl_ItemStatus").val();
            let Status = "";
            if (ALlStatusID) {
                Status = ALlStatusID.join(',');
            }

            var From_Date;
            var To_date;
            if ($("#systab6 .fromsearch").val() != '')
                From_Date = ($("#systab6 #fromsearch").val());
            else
                From_Date = null;
            if ($("#systab6 .tosearch").val() != '')
                To_date = ($("#systab6 #tosearch").val());
            else
                To_date = null;

            if ($('#systab6 .txtStatusReportCategory').val() == '1' && $('#systab6 .ddl_Sort').val() == '1') {
                OrderPattern += '1' + ",";
                ReportOption = "1";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '1' && $('#systab6 .ddl_Sort').val() == '2') {
                OrderPattern += '2' + ",";
                ReportOption = "2";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '2' && $('#systab6 .ddl_Sort').val() == '1') {
                OrderPattern += '1' + ",";
                ReportOption = "3";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '2' && $('#systab6 .ddl_Sort').val() == '2') {
                OrderPattern += '2' + ",";
                ReportOption = "4";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '2' && $('#systab6 .ddl_Sort').val() == '3') {
                OrderPattern += '3' + ",";
                ReportOption = "5";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '3' && $('#systab6 .ddl_Sort').val() == '1') {
                OrderPattern += '1' + ",";
                ReportOption = "6";
            }
            else if ($('#systab6 .txtStatusReportCategory').val() == '3' && $('#systab6 .ddl_Sort').val() == '2') {
                OrderPattern += '2' + ",";
                ReportOption = "7";
            }
            //else if ($('#systab6 .txtStatusReportCategory').val() == '3' && $('#systab6 .ddl_Sort').val() == '3') {
            //    OrderPattern += '3' + ",";
            //    ReportOption = "8";
            //}

            fetchReportData(
                '/Reports/ReceivingReportSectionReportGeneration',
                {
                    ProjectID: AllProjectID,
                    SectionID: SectionId,
                    VendorID: VendorId,
                    order: OrderPattern,
                    option: ReportOption,
                    Status: Status,
                    StartDate: From_Date,
                    EndDate: To_date,
                    exportFormat: exportFormat
                }
            );
        }

        /**************************** END OF RECEIVING REPORT GENERATIONS ***************************** /
        /*******************************************************************************************/

        /**************************** START OF PO REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        $(document).on("change", "#systab7 .txtBudgetReportCategory", function () {

            $("#systab7 #hideShowInvoideDt .datecontrol").val('All');
            $("#systab7 #hideShowPayment .ddl_PaymentStatus").val('1');

            if ($(this).val() == '1') {
                $("#systab7 #hideShowInvoideDt").show();
                $("#systab7 #hideShowPayment").show();
            }
            else {
                $("#systab7 #hideShowInvoideDt").hide();
                $("#systab7 #hideShowPayment").hide();
            }
        });
        $(document).on("change", "#systab7 .txtStatusReportCategory", function () {

            if ($(this).val() == '0') {
                $("#systab7 .ddl_Sort").html("");
                $("#systab7 .ddl_Sort").html("<option value='1'>PO</option>\n<option value='2' selected>Date</option>");
            }
            else if ($(this).val() == '2') {
                $("#systab7 .ddl_Sort").html("");
                $("#systab7 .ddl_Sort").html("<option value='1' selected>PO</option>\n<option value='2'>Vendor</option>");
            }
            else {
                $("#systab7 .ddl_Sort").html("");
                $("#systab7 .ddl_Sort").html("<option value='1'>PO</option>\n<option value='2' selected>Date</option>\n<option value='3'>Vendor</option>");
            }
        });


        function PODetailReportGenerationByDetails(ProjectId, ReportType, GroupType, exportFormat) {
            let AllVendorID = $('#systab7 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            var From_Date, To_date;
            var From_DatePayment, To_datePayment;
            if ($('#systab7 .row:has(label:contains("PO Date")) .fromsearch').val() != '')
                From_Date = $('#systab7 .row:has(label:contains("PO Date")) .fromsearch').val();
            else
                From_Date = null;
            if ($('#systab7 .row:has(label:contains("PO Date")) .tosearch').val() != '')
                To_date = $('#systab7 .row:has(label:contains("PO Date")) .tosearch').val();
            else
                To_date = null;

            if ($('#systab7 .row:has(label:contains("Invoice Date")) .fromsearch').val() != '')
                From_DatePayment = $('#systab7 .row:has(label:contains("Invoice Date")) .fromsearch').val();
            else
                From_DatePayment = null;
            if ($('#systab7 .row:has(label:contains("Invoice Date")) .tosearch').val() != '')
                To_datePayment = $('#systab7 .row:has(label:contains("Invoice Date")) .tosearch').val();
            else
                To_datePayment = null;

            var InvoiceStatus = $("#systab7 .ddl_InvoiceStatus").val();
            var PaymentStatus = $("#systab7 .ddl_PaymentStatus").val();

            let AllSectionID = $('#systab7 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            var OrderPattern = $("#systab7 .ddl_Sort").val();

            fetchReportData(
                '/Reports/POReportGenerationDetailsFIlter',
                {
                    AllProjectID: ProjectId,
                    ReportType: ReportType,
                    GroupTye: GroupType,
                    AllVendorID: VendorId,
                    From_Date: From_Date,
                    To_date: To_date,
                    InvoiceStatus: InvoiceStatus,
                    OrderPattern: OrderPattern,
                    SectionID: SectionId,
                    PaymentStatus: PaymentStatus,
                    From_DatePayment: From_DatePayment,
                    To_DatePayment: To_datePayment,
                    exportFormat: exportFormat
                }
            );
        }

        function PODetailReportGenerationBySummery(ProjectId, ReportType, GroupType, exportFormat) {
            let AllVendorID = $('#systab7 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            var From_Date, To_date;

            if ($('#systab7 .row:has(label:contains("PO Date")) .fromsearch').val() != '')
                From_Date = $('#systab7 .row:has(label:contains("PO Date")) .fromsearch').val();
            else
                From_Date = null;
            if ($('#systab7 .row:has(label:contains("PO Date")) .tosearch').val() != '')
                To_date = $('#systab7 .row:has(label:contains("PO Date")) .tosearch').val();
            else
                To_date = null;

            var InvoiceStatus = $("#systab7 .ddl_InvoiceStatus").val();

            let AllSectionID = $('#systab7 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            var OrderPattern = $("#systab7 .ddl_Sort").val();

            fetchReportData(
                '/Reports/POReportGenerationSummeryFilter',
                {
                    AllProjectID: ProjectId,
                    ReportType: ReportType,
                    GroupTye: GroupType,
                    AllVendorID: VendorId,
                    From_Date: From_Date,
                    To_date: To_date,
                    InvoiceStatus: InvoiceStatus,
                    OrderPattern: OrderPattern,
                    SectionID: SectionId,
                    exportFormat: exportFormat
                }
            );
        }

        /**************************** END OF PO REPORT GENERATIONS ***************************** /
       /*******************************************************************************************/

        /**************************** START OF INVOICE REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        $(document).on("change", "#systab8 .txtBudgetReportCategory", function () {

            $("#systab8 #sys8hideshowPayment .datecontrol").val('All');
            //$("#systab8 #hideShowPayment .ddl_PaymentStatus").val('1');

            if ($(this).val() == '1') {
                $("#systab8 #sys8hideshowPayment").show();
                //$("#systab7 #hideShowPayment").show();
            }
            else {
                $("#systab8 #sys8hideshowPayment").hide();
                //$("#systab7 #hideShowPayment").hide();
            }
        });

        $(document).on("change", "#systab8 .txtStatusReportCategory", function () {

            if ($(this).val() == '1') {
                $("#systab8 .ddl_Sort").html("");
                $("#systab8 .ddl_Sort").html("<option value='1'>Invoice Number</option>\n<option value='2' selected>Date</option>");
            }
            else {
                $("#systab8 .ddl_Sort").html("");
                $("#systab8 .ddl_Sort").html("<option value='1'>Invoice Number</option>\n<option value='2' selected>Date</option>\n<option value='3'>Vendor</option>");
            }
        });
        function InvoiceReportGenerationFilter(ProjectId, ReportType, GroupType, exportFormat) {
            let AllVendorID = $('#systab8 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            let AllBankID = $('#systab8 .ddl_BankAcount').val();
            let BankId = "";
            if (AllBankID) {
                BankId = AllBankID.join(',');
            }

            var From_Date, To_date;
            var From_DatePayment, To_datePayment;
            if ($('#systab8 .row:has(label:contains("Invoice Date")) .fromsearch').val() != '')
                From_Date = $('#systab8 .row:has(label:contains("Invoice Date")) .fromsearch').val();
            else
                From_Date = null;
            if ($('#systab8 .row:has(label:contains("Invoice Date")) .tosearch').val() != '')
                To_date = $('#systab8 .row:has(label:contains("Invoice Date")) .tosearch').val();
            else
                To_date = null;

            if ($('#systab8 .row:has(label:contains("Payment Date")) .fromsearch').val() != '')
                From_DatePayment = $('#systab8 .row:has(label:contains("Payment Date")) .fromsearch').val();
            else
                From_DatePayment = null;
            if ($('#systab8 .row:has(label:contains("Payment Date")) .tosearch').val() != '')
                To_datePayment = $('#systab8 .row:has(label:contains("Payment Date")) .tosearch').val();
            else
                To_datePayment = null;

            var InvoiceStatus = $("#systab8 .ddl_InvoiceStatus").val();

            let AllSectionID = $('#systab8 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            let AllPaymentID = $('#systab8 .txt_PaymentMode').val();
            let PaymentId = "";
            if (AllPaymentID) {
                PaymentId = AllPaymentID.join(',');
            }

            var OrderPattern = $("#systab8 .ddl_Sort").val();

            fetchReportData(
                '/Reports/InvoiceReportGenerationDetailsFIlter',
                {
                    AllProjectID: ProjectId,
                    ReportType: ReportType,
                    GroupTye: GroupType,
                    AllVendorID: VendorId,
                    From_Date: From_Date,
                    To_date: To_date,
                    From_PDate: From_DatePayment,
                    To_Pdate: To_datePayment,
                    InvoiceStatus: InvoiceStatus,
                    OrderPattern: OrderPattern,
                    AllBankAccountID: BankId,
                    SectionID: SectionId,
                    paymentMode: PaymentId,
                    exportFormat: exportFormat
                }
            );
        }

        /**************************** END OF INVOICE REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        /**************************** START OF PAYMENT REPORT GENERATIONS ***************************/
        /*******************************************************************************************/

        function PrintedChequeListReportGenerationFilter(ProjectId, exportFormat) {
            let AllSectionID = $('#systab9 .txtSection').val();
            let SectionId = "";
            if (AllSectionID) {
                SectionId = AllSectionID.join(',');
            }

            let AllVendorID = $('#systab9 .txtVendor').val();
            let VendorId = "";
            if (AllVendorID) {
                VendorId = AllVendorID.join(',');
            }

            let AllBankID = $('#systab9 .ddl_BankAcount').val();
            let BankId = "";
            if (AllBankID) {
                BankId = AllBankID.join(',');
            }

            var From_Date, To_date;

            if ($('#systab9 .row:has(label:contains("Date Range")) .fromsearch').val() != '')
                From_Date = $('#systab9 .row:has(label:contains("Date Range")) .fromsearch').val();
            else
                From_Date = null;
            if ($('#systab9 .row:has(label:contains("Date Range")) .tosearch').val() != '')
                To_date = $('#systab9 .row:has(label:contains("Date Range")) .tosearch').val();
            else
                To_date = null;

            let AllPaymentID = $('#systab9 .txt_PaymentMode').val();
            let PaymentId = "";
            if (AllPaymentID) {
                PaymentId = AllPaymentID.join(',');
            }

            var OrderPattern = $("#systab9 .ddl_Sort").val();

            fetchReportData(
                '/Reports/PrintedChequeListReportGeneration',
                {
                    ProjectID: ProjectId,
                    SectionID: SectionId,
                    VendorID: VendorId,
                    BankAccountID: BankId,
                    StartDate: From_Date,
                    EndDate: To_date,
                    order: OrderPattern,
                    pamymentMode: PaymentId,
                    exportFormat: exportFormat
                }
            );
        }

        /**************************** END OF PAYMENT REPORT GENERATIONS ***************************/
        /*******************************************************************************************/


    }
    // #endregion
});