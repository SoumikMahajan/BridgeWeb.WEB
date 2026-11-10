$(document).on("UserPreferencesReady", function () {
    //var _BaseURL = window.location.origin;
    let _QueryParameter = window.location.pathname.split("/");
    let _ActionName = _QueryParameter[2].toLocaleLowerCase();

    // #region :: Budget Summary
    if (_ActionName === "budgetsummary") {
        let isDirty = false;

        $(document).on('change keyup', '#add_budget_section_modal_form input, #add_budget_section_modal_form select, #add_budget_section_modal_form textarea', function () {
            isDirty = true;
        });

        $(document).on('change keyup', '#add_approval_group_form input, #add_approval_group_form select, #add_approval_group_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        const projectIdsStr = _UserPreferences["Dropdown.ProjectId"] || "";
        const projectIds = projectIdsStr.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        if (projectIds.length > 0) {
            $('#PrjtDdl').val(projectIds[0]);
            Load_Section_Group();
        }

        $(".multislct").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
            single: true
        });

        $(document).on('change', '#PrjtDdl', function () {
            Load_Section_Group();
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
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

        function handleSearch(e) {
            let _this = e.currentTarget;
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            let searchNumber = $(_this).val();
            let searchName = $("#searchByNameId").val();

            GetAllProjectSection(projectId, searchNumber, searchName)
                .catch((err) => {
                    console.error(err);
                });
        };

        $(document).on('keyup', '#searchByNumberId', debounce(handleSearch, 600));
        $(document).on('keyup', '#searchByNameId', debounce(handleSearch, 600));

        $(document).on('click', '#approvalGroupId', function () {
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            if (projectId == undefined) {
                $("#addGrpList").html("");
                return;
            }            

            $.ajax({
                url: "/Budget/GetBudgetSection",
                data: { ProjectId: projectId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        var result = data.Result;
                        let html = `<li class="default"><label>Default? <input type="checkbox" id="chkIsDefault"></label></li>`;
                        for (var i = 0; i < result.length; i++) {
                            html += `<li><label><input type="checkbox" class="checkedAdd_Id" data-secid="${result[i].budgetSectionID}" />
                        ${result[i].sectionnumber}-${result[i].name}</label></li>`;
                        }
                        $("#addGrpList").html("");
                        $("#addGrpList").html(html);
                    }
                    else {
                        $.notify.error('Error', response.Errors);
                    }
                    $(".loader").css("display", "none");
                }
                
            });            
        });

        $(document).on('click', '#editGroupModalId', function (e) {
            let _this = e.currentTarget;
            let groupId = $(_this).attr('data-groupid');
            $("#editGroupBody").html("");
            let formData = {
                GroupId: groupId
            };

            $.ajax({
                url: "/Budget/GetApprovalGroupByGroupId",
                data: { GroupId: groupId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        let Result = data.Result;
                        let headerHtml = "";
                        let bodyHtml = `<ul class="add_grpList">`;
                        for (let i = 0; i < Result.length; i++) {
                            let addField = Result[i].isAssigned != "0" ? "disabled checked" : "";
                            if (i == 0) {
                                headerHtml =
                                    `<div class="frm_fld_wrp">
                                <label for="" class="form-label">Group Name</label>
                                <input type="text" class="form-control text-uppercase" id='txtEditGroupName' data-id="${Result[i].fldID}" value="${Result[i].groupname}" />
                            </div>`;
                            }
                            if (Result[i].sectionnumber != null && Result[i].name != null) {
                                bodyHtml +=
                                    `<li>
                                <label>
                                    <input type="checkbox" class="checkedEdit_Id" data-secid="${Result[i].budgetSectionID}" ${addField} />
                                    ${Result[i].sectionnumber}-${Result[i].name}
                                </label>
                            </li>`;
                            }
                            else {
                                bodyHtml += '';
                            }
                        }
                        bodyHtml += `</ul>`;

                        let html = headerHtml + bodyHtml;
                        $("#editGroupBody").html("");
                        $("#editGroupBody").html(html);
                    }
                    else {
                        $.notify.error('Error', data.Errors);
                    }
                    $(".loader").css("display", "none");
                }
            });           
        });

        $(document).on('click', '#editSectionModalId', function (e) {
            let _this = e.currentTarget;
            let id = $(_this).attr('data-id');
            let name = $(_this).parent().parent().find('.name').text();
            let sectionNumber = $(_this).parent().parent().find('.order').text();

            $("#sectionEditorId").val(id);
            $("#sectionEditorNumber").val(sectionNumber);
            $("#sectionEditorName").val(name);
        });

        $(document).on('click', '#removeSectionBtn', function () {
            let budgetId = $("#sectionEditorId").val();

            let formData = {
                BudgetId: budgetId
            }

            $.ajax({
                url: "/Budget/RemoveSection",
                data: { BudgetId: budgetId },
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                    $('#edit_section').modal('hide');
                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }

            });
        });

        $(document).on('click', '#editSectionBtn', async function () {
            let budgetId = $("#sectionEditorId").val().trim();
            let sectionNumberString = $("#sectionEditorNumber").val().trim();
            let sectionName = $("#sectionEditorName").val().trim();
            let projectId = $("#PrjtDdl option:selected").attr('data-id');

            let sectionNumber = parseInt(sectionNumberString);

            if (isNaN(sectionNumber)) {
                $.notify.warning('Caution', 'Please enter a valid section number!');
                return;
            }

            if (sectionNumber == 0 || sectionNumber > 999) {
                $.notify.warning('Caution', 'Please use numbers between 1 - 999 !');
                return;
            }

            let secNum = formatNumber(sectionNumber);

            let formData = {
                BudgetId: budgetId,
                SectionNumber: secNum,
                SectionName: sectionName,
                ProjectId: projectId,
            };

            $.ajax({
                url: '/Budget/EditSection',
                type: "GET",
                data: formData,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (response) {                    
                    if (response.IsSuccess && response.Result === "SUCCESS") {
                        $(".loader").css("display", "none");
                        $.notify.success('Success', 'Successfully updated');
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', response.Errors);
                    }
                    $('#edit_section').modal('hide');
                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }
            })            
        });

        $(document).on('click', '#addSectionBtn', async function () {
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            if (projectId == "" || projectId == 0 || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                $("#sectionAddNumber").val("");
                $("#sectionAddName").val("");
                $('#add_section').modal('hide');
                return;
            }
            let sectionNumberString = $("#sectionAddNumber").val().trim();
            let sectionName = $("#sectionAddName").val().trim();

            let sectionNumber = parseInt(sectionNumberString);

            if (isNaN(sectionNumber)) {
                $.notify.warning('Caution', 'Please enter a valid section number!');
                return;
            }

            if (sectionNumber == 0 || sectionNumber > 999) {
                $.notify.warning('Caution', 'Please use numbers between 1 - 999 !');
                return;
            }

            let secNum = formatNumber(sectionNumber);

            let formData = {
                ProjectId: projectId,
                SectionNumber: secNum,
                SectionName: sectionName
            }

            $.ajax({
                url: "/Budget/AddSection",
                type: "GET",
                data: formData,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess == true) {
                        isDirty = false;
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $("#sectionAddNumber").val("");
                    $("#sectionAddName").val("");

                    $('#add_section').modal('hide');

                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }

            })            
        });

        $(document).on('click', '#addGroupBtn', function () {
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            if (projectId == "" || projectId == 0 || projectId == undefined) {
                $.notify.warning('Caution', 'Please select project!');
                $("#txtGroupName").val("");
                $("#new_approval_grp").modal("hide");
                return;
            }
            let groupName = $("#txtGroupName").val();
            let isDefault = $("#chkIsDefault").is(":checked");
            if (groupName.trim() == "") {
                $.notify.warning('Caution', 'Please enter Group Name!');
                return;
            }

            let sectionIds = "";
            $('.checkedAdd_Id').each(function () {
                if ($(this).is(':checked')) {
                    sectionIds += sectionIds == '' ? $(this).attr('data-secid') : ',' + $(this).attr('data-secid');
                }
            });
            let formData = {
                ProjectId: projectId,
                IsDefault: isDefault,
                GroupName: groupName,
                SectionIds: sectionIds
            }

            $.ajax({
                url: "/Budget/AddGroup",
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.Errors);
                    }
                    $(".loader").css("display", "none");
                    $("#txtGroupName").val("");
                    $("#add_grpList").html("");
                    $("#new_approval_grp").modal("hide");

                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }
            });
        });

        $(document).on('click', '#editGroupBtn', function () {
            let groupName = $('#editGroupBody').find('div input').val();
            let groupId = $('#editGroupBody').find('div input').attr('data-id');
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            let sectionIds = "";
            $('.checkedEdit_Id').each(function () {
                if ($(this).is(':checked')) {
                    sectionIds += sectionIds == '' ? $(this).attr('data-secid') : ',' + $(this).attr('data-secid');
                }
            });
            let formData = {
                GroupId: groupId,
                GroupName: groupName,
                SectionIds: sectionIds,
                ProjectId: projectId
            }

            $.ajax({
                url: "/Budget/EditGroup",
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.Errors);
                    }
                    $(".loader").css("display", "none");
                    $("#editGroupBody").html("");

                    $("#edit_approval_grp").modal("hide");
                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }
            });
        });

        $(document).on('click', '#deleteGroupBtn', function () {
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            let groupName = $('#editGroupBody').find('div input').val();
            let groupId = $('#editGroupBody').find('div input').attr('data-id');
            let sectionIds = "";
            $('.checkedEdit_Id').each(function () {
                if ($(this).is(':checked')) {
                    sectionIds += sectionIds == '' ? $(this).attr('data-secid') : ',' + $(this).attr('data-secid');
                }
            });
            let formData = {
                ProjectId: projectId,
                GroupId: groupId,
                GroupName: groupName,
                SectionIds: sectionIds
            }

            $.ajax({
                url: "/Budget/DeleteGroup",
                data: formData,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess == true) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $(".loader").css("display", "none");
                    $("#edit_approval_grp").modal("hide");

                    setTimeout(() => {
                        Load_Section_Group();
                    }, 800);
                }
            });
        });

        $("#sortable").sortable({
            update: function (event, ui) {
                let previousObj = ui.item.prev();
                let presentObj = ui.item;
                let nextObj = ui.item.next();

                let previousIndex = $(previousObj).attr('data-orderindex');
                let presentIndex = $(presentObj).attr('data-orderindex');
                let nextIndex = $(nextObj).attr('data-orderindex');

                if (previousIndex == undefined || parseInt(previousIndex) < parseInt(presentIndex)) {
                    previousIndex = nextIndex;
                }

                let projectId = $("#PrjtDdl option:selected").attr('data-id');

                let formData = {
                    ProjectId: projectId,
                    PreviousIndex: previousIndex,
                    PresentIndex: presentIndex
                }
                $.ajax({
                    url: "/Budget/SortSection",
                    data: formData,
                    type: 'GET',
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                        }
                        else {
                            $.notify.error('Error', data.Errors);
                        }
                        Load_Section_Group();
                        $(".loader").css("display", "none");
                    }
                });
            }
        });

        function GetBudgetGroups(projectId) {
            return new Promise((resolve, reject) => {
                if (!projectId) {
                    $("#appGroup").html("");
                    return reject("Project ID is missing.");
                }

                let formData = {
                    ProjectId: projectId == undefined ? "" : projectId,
                };
                $("#appGroup").html("");

                $(".loader").css("display", "flex");
                let url = "/Budget/GetBudgetGroups";

                $.ajax({
                    url: url,
                    type: "GET",
                    data: formData,
                    dataType: "text"
                }).done((response) => {
                    $("#appGroup").html(response);
                    resolve("Success");
                }).fail((jqXHR, textStatus, errorThrown) => {
                    console.warn("AJAX error:", errorThrown);
                    reject("AJAX failed: " + errorThrown);
                }).always(() => {
                    $(".loader").css("display", "none");
                });
            });
        }

        function GetAllProjectSection(projectId, searchNumber = "", searchName = "") {
            return new Promise((resolve, reject) => {
                if (projectId == undefined) {
                    $("#filteredSubTotal").text('');
                    return reject("Project ID is undefined");
                }
                let formData = {
                    ProjectId: projectId,
                    SearchNumber: searchNumber,
                    SearchName: searchName
                };
                let url = "/Budget/GetAllProjectSection";
                $(".loader").css("display", "flex");

                $.ajax({
                    url: url,
                    type: "GET",
                    data: formData,
                    dataType: "text"
                }).done((response) => {
                    $("#sortable").html("");
                    $("#sortable").html(response);
                    GetSubTotalCost();
                    resolve("Success");
                }).fail((jqXHR, textStatus, errorThrown) => {
                    console.warn("AJAX error:", errorThrown);
                    reject("AJAX failed: " + errorThrown);
                }).always(() => {
                    $(".loader").css("display", "none");
                });
            });
        }

        function GetProjectDetailsCostTotal(projectId) {
            return new Promise((resolve, reject) => {
                if (!projectId) {
                    $("#projectbudgetdtls").html("");
                    return reject("Project ID is undefined");
                }
                let formData = {
                    ProjectId: projectId
                };
                $(".loader").css("display", "flex");

                let url = "/Budget/GetProjectDetailsCostTotal";
                $.ajax({
                    url: url,
                    type: "GET",
                    data: formData,
                    dataType: "json"
                }).done((response) => {
                    if (response.IsSuccess) {
                        let result = response.Result;
                        $("#projectbudgetdtls").html("");
                        let html = `<div class="current_budget">
									<span class="current_project_name">Current Budget Sections for ${result.projectName} (${result.currency}) </span>
									<span class="total_budget">Total : ${result.total}</span>
								</div>`;
                        $("#projectbudgetdtls").html(html);
                        resolve("Section loaded successfully");
                    }
                    else {
                        $.notify.error('Error', response.Errors);
                        reject("API returned error: " + response.Errors);
                    }
                }).fail((jqXHR, textStatus, errorThrown) => {
                    console.warn("AJAX error:", errorThrown);
                    reject("AJAX failed: " + errorThrown);
                }).always(() => {
                    $(".loader").css("display", "none");
                });
            });
        }

        function GetSubTotalCost() {
            setTimeout(() => {
                let subTotalCost = $("#subTotalCost").val();
                if (subTotalCost != undefined) {
                    $("#filteredSubTotal").text("Filtered Subtotal : " + subTotalCost);
                }
            }, 800);
        }

        function Load_Section_Group() {
            let projectId = $("#PrjtDdl option:selected").attr('data-id');
            if (projectId == undefined) {
                $("#sortable").html("");
                $("#appGroup").html("");
                $("#projectbudgetdtls").html("");
                $("#filteredSubTotal").html("");
                return;
            }
            let searchNumber = $("#searchByNumberId").val();
            let searchName = $("#searchByNameId").val();
            GetAllProjectSection(projectId, searchNumber, searchName)
                .then(() => GetBudgetGroups(projectId))
                .then(() => GetProjectDetailsCostTotal(projectId))
                .catch((err) => {
                    console.error("Failed during budget load process:", err);
                });
        }

        $(document).on('input', '#txtEditGroupName', function (e) {
            let value = e.target.value;
            e.target.value = value.toUpperCase();
        });

        $(document).on('input', '#txtGroupName', function (e) {
            let value = e.target.value;
            e.target.value = value.toUpperCase();
        });

        $(document).on('input', '#sectionEditorName', function (e) {
            let value = e.target.value;
            e.target.value = value.toUpperCase();
        });

        $(document).on('input', '#sectionAddName', function (e) {
            let value = e.target.value;
            e.target.value = value.toUpperCase();
        });

        function formatNumber(num) {
            if (num < 10) {
                return '00' + num;
            } else if (num < 100) {
                return '0' + num;
            } else {
                return String(num);
            }
        }
    }
    // #endregion

    // #region :: Budget Lineitems
    if (_ActionName === "lineitems") {
        let isDirty = false;

        $(document).on('change keyup', '#add_budget_lineitem_modal_form input, #add_budget_lineitem_modal_form select, #add_budget_lineitem_modal_form textarea', function () {
            isDirty = true;
        });

        window.addEventListener('beforeunload', function (e) {
            if (!isDirty) return;

            e.preventDefault();
            e.returnValue = '';   // Chrome requires this
        });

        //const UserPreferProjectId = parseInt(window._UserPreferences["Dropdown.ProjectId"]) || '0';
        //const ModelSelectedProjectId = parseInt('@Model.SelectedProjectID') || 0;

        //const preferences = [];

        //$("#Project_Name_List").multipleSelect({
        //    filter: true,
        //    showClear: true,
        //    placeholder: "Please Select",
        //    filterPlaceholder: "Enter Keyword",
        //    single: true,
        //    onAfterCreate: function () {

        //        if (ModelSelectedProjectId > 0) {
        //            $('#Project_Name_List').multipleSelect('setSelects', [ModelSelectedProjectId.toString()]);
        //        }
        //        else if (UserPreferProjectId > 0) {
        //            $('#Project_Name_List').multipleSelect('setSelects', [UserPreferProjectId.toString()]);
        //        }

        //    }

        //});

        const ModelSelectedProjectId = window._SelectedProjectId || 0;
        const UserPreferProjectId = window._UserPreferences["Dropdown.ProjectId"] || "0";

        $("#Project_Name_List").multipleSelect({
            filter: true,
            showClear: true,
            placeholder: "Please Select",
            filterPlaceholder: "Enter Keyword",
            single: true,

            onAfterCreate: function () {
                setTimeout(function () {
                    let pid = 0;

                    // 🔥 PRIORITY: Model (Dashboard redirect)
                    if (ModelSelectedProjectId !== 0) {
                        pid = ModelSelectedProjectId;

                        // 🔥 IMPORTANT — update preference so layout stops overriding
                        window._UserPreferences["Dropdown.ProjectId"] = pid;
                    }
                    else if (UserPreferProjectId !== 0) {
                        pid = UserPreferProjectId;
                    }

                    if (pid !== "0") {
                        $('#Project_Name_List')
                            .multipleSelect('setSelects', [pid.toString()]);
                    }

                }, 0);
            }
        });


        //if (UserPreferProjectId != "0") {
        //    $('#Project_Name_List').multipleSelect('setSelects', [UserPreferProjectId]);
        //}
        //if (ModelSelectedProjectId > 0) {
        //    $('#Project_Name_List').multipleSelect('setSelects', [ModelSelectedProjectId]);
        //}
        //else if (UserPreferProjectId > 0) {
        //    $('#Project_Name_List').multipleSelect('setSelects', [UserPreferProjectId]);
        //}
        $(document).on('click', '.icon-close', function () {
            let $dropdown = $(this).closest('.ms-parent').prev('select');
            let firstOption = $dropdown.find('option:first').val();
            $dropdown.multipleSelect('setSelects', [firstOption]);
            //$('#Project_Name_List').multipleSelect('setSelects', ['0']);
        });

        var keyCode = "0";

        $(document).on('change', '#Project_Name_List', function () {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            $('#currentV').val("0");
            if (projectId != "0") {

                ProjectSection();
                Versionnames();
                getapproverstatus();
                checkmanagerforversionedit();
                getApprovalStatus();
            }
            else {

                ProjectSection();
                Versionnames();
            }

        });
        function getapproverstatus() {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            if (projectId != "0") {
                $.ajax({
                    url: "/Budget/GetApprovalStatus?ProjectId=" + projectId,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.Result == "") {
                            data.Result = 1;
                        }
                        if (parseInt(data.Result) > 0) {
                            $('#cansendforapproval').val('false');
                            const url1 = "/Project/ProjectTeam?pid=" + projectId + "&n=" + "";
                            var html = `Does not have enough Budget approvers <a target='_blank' href=${url1}>Click to assign approvers now</a>`;
                            $.notify.error('Error', html, { position: 'topCenter' }, { duration: 10000 });
                        }
                        else {
                        }
                    }
                })
            }
        }

        function getApprovalStatus() {
            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            if (projectId != "0") {
                $.ajax({
                    url: "/Budget/GetBudgetApprovalStatus?ProjectId=" + projectId,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (parseInt(data.Result) > 0) {
                            $('#svsndAprvl').hide();
                        }
                        else {
                            $('#svsndAprvl').show();
                        }
                    }
                });
            }
        }
        $(document).on("click", '#budgetHistory', function () {
            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            $.ajax({
                url: "/Budget/AllBudgetHistoryTable?ProjectId=" + projectId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#BudgetHistoryDataTable').html('');
                        $('#BudgetHistoryDataTable').html(data);
                        $('#budget_hist_table').dataTable({
                            pageLength: 10,
                            "orderCellsTop": false,
                            "order": [[0, "desc"], [3, "desc"]],
                            //"columnDefs": [
                            //    { "orderable": false, "targets": [0, 1, 2, 3] }
                            //]
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

        $(document).on('click', '.getChangedLIBS', function () {
            var type = $(this).data('type').trim();

            var FldId = $(this).data('fldid');
            if (type == "LINEITEMS") {
                $.ajax({
                    url: "/Budget/GetChangedLI?FldID=" + FldId,
                    type: "GET",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {
                            $('#ChangedLI').html('');
                            $('#ChangedLI').html(data);
                            ChangeLITable();
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
                $.ajax({
                    url: "/Budget/GetChangedBS?FldID=" + FldId,
                    type: "GET",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $('#ChangedLI').html('');
                        $('#ChangedLI').html(data);
                        ChangeBSTable();
                        $(".loader").css("display", "none");
                    }
                });
            }
        });

        ProjectSection();
        function ProjectSection() {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            var VersionId = $('#currentV').val();

            if (VersionId == "0" || VersionId == undefined || VersionId == null) {

                //setTimeout(function () {
                $.ajax({
                    url: "/Budget/GetAllProjectSectioninBudgetDetails?ProjectId=" + projectId + "&VersionId=" + VersionId,
                    type: "GET",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {

                            $('#ProjectSectionList').html('');
                            $('#ProjectSectionList').html(data);

                            let userpreferSectionId = parseInt(window._UserPreferences["Dropdown.SectionId"]) || '0';
                            if (userpreferSectionId != '0' && projectId == UserPreferProjectId) {
                                //$("#ProjectSectionDropDown").val(userpreferSectionId);
                                let hasPreferredOption = $("#ProjectSectionDropDown option[value='" + userpreferSectionId + "']").length > 0;
                                if (hasPreferredOption) {
                                    $("#ProjectSectionDropDown").val(userpreferSectionId);
                                }
                                else {
                                    let firstOption = $("#ProjectSectionDropDown option:first").val();
                                    $("#ProjectSectionDropDown").val(firstOption);
                                }
                            }

                            $("#ProjectSectionDropDown").multipleSelect({
                                filter: true,
                                // showClear: true,
                                placeholder: "Please Select",
                                filterPlaceholder: "Enter Keyword",
                                single: true,
                            });

                            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                            var currentVersion = $('#currentV').val() == undefined || $('#currentV').val() == null ? "0" : $('#currentV').val();
                            $(".loader").css("display", "none");
                            if (budgetSectionId == null || budgetSectionId == undefined) {
                                budgetSectionId = "0";
                                $.notify.warning('Caution', 'No Project Section Found!');
                                return;
                            }

                            GetLineItems(budgetSectionId, currentVersion);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }

                    }
                })
                //}, 0);
            }
            else if (VersionId != "0" || VersionId != undefined || VersionId != null) {
                //for previous version section list
                $.ajax({
                    url: "/Budget/GetAllProjectSectioninBudgetDetails?ProjectId=" + projectId + "&VersionId=" + VersionId,
                    type: "GET",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != null) {
                            $('#ProjectSectionList').html('');
                            $('#ProjectSectionList').html(data);
                            $("#PreviousProjectSection").multipleSelect({
                                filter: true,
                                showClear: true,
                                placeholder: "Please Select",
                                filterPlaceholder: "Enter Keyword",
                                single: true,
                            });
                            var budgetSectionId = $('#PreviousProjectSection option:selected').val();
                            if (budgetSectionId == null || budgetSectionId == undefined) {
                                budgetSectionId = "0";
                            }
                            var currentVersion = $('#currentV').val();
                            $(".loader").css("display", "none");
                            GetLineItems(budgetSectionId, currentVersion);
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }

                    }
                })
            }
        }

        Versionnames();
        function Versionnames() {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");

            $.ajax({
                url: "/Budget/GetVersionDetailsByProjectName?ProjectId=" + projectId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#currentVersion').html('');
                        $('#currentVersion').html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }

        $(document).on('click', '#approvalHistory', function () {

            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            var versionId = $('#currentV').val();
            var SectionId = versionId == "0" ? $("#ProjectSectionDropDown").find("option:selected").val() : $('#PreviousProjectSection option:selected').val();
            if (SectionId == null || SectionId == undefined) {
                SectionId = "0";
            }
            //var groupId = "0";
            $.ajax({
                url: "/Budget/GetApprovalHistoryTable?ProjectId=" + projectId + "&SectionId=" + SectionId,
                type: "GET",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data && data.trim() !== "") {
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
                complete: function ()
                {
                    $(".loader").css("display", "none");
                }
            });
        });
        function ChangeLITable() {
            if ($.fn.DataTable.isDataTable("#changedLItable")) {
                $('#changedLItable').DataTable().clear().destroy();
            }
            $("#changedLItable thead tr")
                .clone(true)
                .addClass("filters")
                .appendTo("#changedLItable thead");

            var table = $("#changedLItable").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 10,
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
                            // For other columns, add input elements
                            $(cell).html(
                                '<input type="text" class="form-control" placeholder="🔍 Search..." />'
                            );

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

                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#changedLItable tbody').html(
                            '<tr><td colspan="11" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });
        }
        function ChangeBSTable() {
            if ($.fn.DataTable.isDataTable("#changedBStable")) {
                $('#changedBStable').DataTable().clear().destroy();
            }
            $("#changedBStable thead tr")
                .clone(true)
                .addClass("filterss")
                .appendTo("#changedBStable thead");

            var table = $("#changedBStable").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 10,
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
                            var cell = $(".filterss th").eq(
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
                                $(".filterss th").eq($(api.column(colIdx).header()).index())
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
                        $('#changedBStable tbody').html(
                            '<tr><td colspan="11" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                }
            });
        }

        $(document).on('click', '#btn_CreateBudget', function () {

            var BudgetsectionID = $('#ProjectSectionDropDown').val();
            var itemheader = $('#itemheader').val().trim();

            var itemdescription = $('#itemdescription').val().trim();
            var specnum = $('#specnum').val().trim();
            var modelno = $('#modelno').val();
            var vendor = $('#vendor').val();
            var uom = $('#uomdd').val() == "0" ? 56 : $('#uomdd').val();
            var itemquantity = $('#itemquantity').val().trim() == "" || isNaN($('#itemquantity').val().trim()) ? "0" : $('#itemquantity').val().trim();
            var cost = $('#cost').val().trim() == "" || isNaN($('#cost').val().trim()) ? "0" : $('#cost').val().trim();
            var taxable = $('#taxable').is(':checked') ? "true" : "false";
            var nonfreight = $('#duty').is(':checked') ? "true" : "false";
            var note = $('#notes').val().trim();
            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            let fd = {
                Item: "",
                ItemDescription: itemdescription,
                SpecNum: specnum,
                Vendor: vendor,
                Quantity: itemquantity,
                UOMID: uom,
                Cost: cost,
                Note: note,
                ToWarehouse: false,
                Model: modelno,
                Header: itemheader,
                CommitAmountAdjust: "",
                BudgetSectionID: BudgetsectionID,
                Taxable: taxable,
                nonfreight: nonfreight,
            };
            var isValid = CreateBudgetValidation(fd);
            if (isValid) {
                $.ajax({
                    url: "/Budget/AddNewLineItems",
                    data: fd,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function (xhr) {
                        $(".loader").css("display", "flex");
                        xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                    },
                    success: function (data) {
                        var success = data.IsSuccess;
                        var IsValid = true;
                        if (data.IsSuccess === true) {
                            isDirty = false;
                            $.notify.success('Success', data.Result);
                            //$(".loader").css("display", "none");
                            //reset fields
                            $('#itemdescription').val('');
                            $('#specnum').val('');
                            $('#modelno').val('');
                            $('#vendor').val('');
                            $('#uomdd').val("56");
                            $('#itemheader').val('');
                            $('#itemquantity').val("0.00");
                            $('#cost').val("0.00");
                            $('#taxable').prop('checked', true);
                            $('#duty').prop('checked', false);
                            $('#notes').val('');


                            window.setTimeout(function () {
                                var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                var VersionId = $('#currentV').val();
                                GetLineItems(BudgetSectionId, VersionId);
                            }, 2000);

                            document.activeElement.blur();
                            $('#add_budget_tab').modal('hide');
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);

                        }
                    }
                });
            }
        });
        function CreateBudgetValidation(fd) {
            var IsValid = true;
            var Title = "";
            var IsSuccess = false;
            if (fd.BudgetSectionID == "0" || fd.BudgetSectionID == undefined || fd.BudgetSectionID == null) {
                IsValid = false;
                Title = "Please Select a Budget section";
                $('#ProjectSectionDropDown').trigger('focus');
                $.notify.warning('Caution', Title);
            }
            else if (fd.ItemDescription == "" || fd.ItemDescription == null || fd.ItemDescription == undefined) {
                IsValid = false;
                Title = "Please enter item description";
                $('#itemdescription').trigger('focus');
                $.notify.warning('Caution', Title);
            }

            return IsValid;
        }
        $(document).on('click', '#editCV', function () {
            var selectedOption = $('#currentV option:selected');
            var versionName = selectedOption.data('versionname');
            var versionId = $('#currentV').val();

            if (versionId != "0" && versionId != undefined) {
                $('#CurrversionName').val(versionName);
                $('#hiddenFldID').val(versionId);
                $('#currentVersionEdit').modal('show');
            }
            else {
                $.notify.warning('Caution', 'Can not Edit/Remove Current Version!');
            }
        });
        $(document).on('click', '#updateVersion', function () {
            var versionName = $('#CurrversionName').val().trim();
            var versionId = $('#currentV').val();
            if (versionName != "" || versionName != null) {
                $.ajax({
                    url: "/Budget/UpdateVersion?VersionId=" + versionId + "&VersionName=" + versionName,
                    type: "POST",
                    dataType: "JSON",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        var Title = "";
                        var isValid = data.IsSuccess;
                        if (data.IsSuccess) {
                            Title = `Version Name Updated ${versionId}`;
                            $(".loader").css("display", "none");
                            $.notify.success('Success', Title);
                            Versionnames();
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                })
            }
            else {
                $.notify.warning('Caution', 'Version Name Cannot Be Empty');
            }
        });
        $(document).on('click', '#deleteCV', function () {
            var versionId = $('#currentV').val();
            if (versionId == "0" || versionId == null || versionId == undefined) {
                $.notify.warning('Caution', 'Can not Edit/Remove Current Version');
                return;
            }
            var versionName = $('#currentV option:selected').text();

            $.confirm({
                title: 'Delete?',
                message: `You want to Delete The Current Version? ${versionName}`,
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Budget/DeleteVersion?VersionId=" + versionId,
                        type: "POST",
                        dataType: "JSON",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var Title = "";
                            var isValid = data.IsSuccess;
                            if (data.IsSuccess) {
                                Title = `Version Deleted ${versionId}`;
                                $.notify.success('Success', Title);
                                $(".loader").css("display", "none");
                                Versionnames();
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
        //$('#ProjectSectionDropDown').on('change', function () {

        //	var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
        //	GetLineItems(budgetSectionId);
        //});

        $(document).on('change', '#ProjectSectionDropDown', function () {
            var preferences = [];
            preferences.push({
                PreferenceKey: 'Dropdown.ProjectId',
                PreferenceValue: $('#Project_Name_List').val().toString()
            });

            const selectedValues = $('#ProjectSectionDropDown').multipleSelect('getSelects');
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();

            preferences.push({
                PreferenceKey: 'Dropdown.SectionId',
                PreferenceValue: budgetSectionId.toString()
            });

            SetProjectPreference(preferences);

            if (selectedValues.length === 0) {
                budgetSectionId = $('#ProjectSectionDropDown option:first').val();
                $('#ProjectSectionDropDown').multipleSelect('setSelects', [budgetSectionId]);
                return;
            }

            var currentVersion = $('#currentV').val();
            GetLineItems(budgetSectionId, currentVersion);
        });
        //var BudgetSectionId = "0";
        //var VersionId ="0";

        //	GetLineItems(BudgetSectionId, VersionId);

        $(document).on('change', '#currentV', function () {
            var currentVersion = $('#currentV').val();
            var budgetSectionId = $('#PreviousProjectSection option:selected').val();

            ProjectSection();
        });
        function GetLineItems(BudgetSectionId, VersionId) {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val() == undefined || $('#ProjectSectionDropDown option:selected').val() == null ? "0" : $('#ProjectSectionDropDown option:selected').val();
            if (VersionId == "0") {
                if (budgetSectionId != undefined && budgetSectionId != null) {
                    $.ajax({
                        url: "/Budget/CheckLock?ProjectId=" + projectId + "&SectionId=" + budgetSectionId,
                        type: "GET",
                        dataType: "json",
                        async: false,
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var isbudgetApproved = "";
                            var versionnumber = "";
                            var isBudgetLocked = "";
                            var isSentForApproval = "";
                            var currentVersion = "";
                            var BudgetChanged = "";

                            if (data.IsSuccess) {
                                isbudgetApproved = data.Result.isBudgetApproved;
                                versionnumber = data.Result.versionNumber;
                                isBudgetLocked = data.Result.isBudgetLocked;
                                isSentForApproval = data.Result.isSentForApproval;
                                currentVersion = data.Result.currentVersion;
                                BudgetChanged = data.Result.budgetChanged;
                                $('#IsBudgetApproved').val(isbudgetApproved);
                                $('#IsBudgetLocked').val(isBudgetLocked);
                                $('#IsSentForApproval').val(isSentForApproval);
                                $('#VersionNumberForApproval').val(versionnumber);
                                $('#Currentversion').val(currentVersion);
                                $('#IsBudgetChanged').val(BudgetChanged);
                                $(".loader").css("display", "none");
                            }
                            else {
                                $(".loader").css("display", "none");
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }
                    })
                }
                $.ajax({
                    url: "/Budget/GetLineItemsinBudgetDetails?BudgetSectionId=" + BudgetSectionId + "&VersionId=" + VersionId + "&ProjectId=" + projectId,
                    type: "GET",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != "") {
                            $('#lineItemsTable').html('');
                            $('#lineItemsTable').html(data);
                            LineItemsDataTable();

                            $('#AdjustRemaining').css('display', 'flex');
                            $('#addBudgetBtn').css('display', 'block');
                            var keyCode = "";
                            LockUnlockBudgetbtn();
                            if ($('#IsBudgetLocked').val() == "0") {
                                $('#ImportExportLineItems').css('display', '');
                            }
                            else {
                                $('#ImportExportLineItems').css('display', 'none');
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
            else {
                $.ajax({
                    url: "/Budget/GetLineItemsinBudgetDetails?BudgetSectionId=" + BudgetSectionId + "&VersionId=" + VersionId + "&ProjectId=" + projectId,
                    type: "GET",
                    async: false,
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        if (data != "") {
                            $('#lineItemsTable').html('');
                            $('#lineItemsTable').html(data);
                            $('#AdjustRemaining').css('display', 'none');
                            $('#addBudgetBtn').css('display', 'none');
                            $('#changedline_table').dataTable({
                                pageLength: 50,
                                "orderCellsTop": false,
                                "order": [[12, "asc"]],
                                "columnDefs": [
                                    { "orderable": false, "targets": "_all" }
                                ],
                                "searching": false,
                                "paging": false
                            });
                            $('#lckbtn').css('display', 'none');
                            $('#unlockbtn').css('display', 'none');
                            $('#addBudgetBtn').css('display', 'none');
                            $('#ImportExportLineItems').css('display', 'none');
                            $(".loader").css("display", "none");
                            $('#svsndAprvl').css('display', 'none');
                            //$('#saveNoteBtn').css('display', 'none');
                        }
                        else {
                            $(".loader").css("display", "none");
                            $.notify.error('Error', 'Something went wrong');
                        }

                    }
                });
            }
        }
        var budget = [];
        //function LineItemsDataTable() {
        //	if ($.fn.DataTable.isDataTable("#line_table")) {
        //		$('#line_table').DataTable().clear().destroy();
        //	}
        //	$("#line_table thead tr")
        //		.clone(true)
        //		.addClass("filtersline")
        //		.appendTo("#line_table thead");

        //	var table = $("#line_table").DataTable({
        //		"language": {
        //			"lengthMenu": "_MENU_ Entries Per Page"
        //		},
        //		"pageLength": 10,
        //		orderCellsTop: true,
        //		//scrollX: true,

        //		columnDefs: [
        //			{ className: "dt-head-nowrap", targets: "_all" },
        //			{ className: "dt-center", targets: [1, 2] },
        //			//{ width: "10%", targets: 1 },  // Explicitly set column widths
        //			{ width: "1%", targets: 2 },
        //			//{ width: "20%", targets: 3 },
        //			{ "orderable": false, "targets": "_all" },
        //			{
        //				targets: 17,
        //				visible: false,
        //				searchable: false
        //			},
        //		],

        //		"paging": false,

        //		initComplete: function () {
        //			var api = this.api();

        //			api.columns().eq(0).each(function (colIdx) {
        //				var cell = $(".filtersline th").eq($(api.column(colIdx).header()).index());
        //				var title = $(cell).text();

        //				// Remove unnecessary classes
        //				cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();

        //				if (colIdx === 0) {
        //					$(cell).html('<button type="button" class="porde_list_reset_btn" id="resetLineItemsTbl">Reset</button>');
        //				}
        //				else if (colIdx === 15) {
        //					var select = $(
        //						'<select class="form-select" ><option value="0"selected>All</option><option value="Yes">Yes</option><option value="No">No</option>'
        //					).appendTo($(cell));
        //					select.on("change", function () {
        //						var val = $(this).val();
        //						if (val == "0") {
        //							api.column(colIdx).search('').draw();
        //						} else {
        //							api.column(colIdx).search(val, false, false).draw();
        //						}
        //					});
        //				}
        //				else if (colIdx === 16) {
        //					var select = $(
        //						'<select class="form-select" ><option value="0"selected>All</option><option value="Yes">Yes</option><option value="No">No</option>'
        //					).appendTo($(cell));
        //					select.on("change", function () {
        //						var val = $(this).val();
        //						if (val == "0") {
        //							api.column(colIdx).search('').draw();
        //						} else {
        //							api.column(colIdx).search(val, false, false).draw();
        //						}
        //					});
        //				}
        //				else if (colIdx === 10) {
        //					var total = $('#totalForTable').val();
        //					$(cell).html(
        //						`<input type="text" class="form-control total_input" placeholder="" value="${total}" readonly/>`
        //					);
        //				}
        //				else if (colIdx === 11) {
        //					var total = $('#totalCommitForTable').val();
        //					$(cell).html(
        //						`<input type="text" class="form-control commit_input" placeholder="" value="${total}" readonly/>`
        //					);
        //				}
        //				else if (colIdx === 17) {
        //					$(cell).html(`<div style="display:none"></div>`)
        //				}
        //				//else {
        //				//	$(cell).html
        //				//		(
        //				//			'<input type="text" class="form-control" placeholder="' +
        //				//			title +
        //				//			'" />'
        //				//		);
        //				//}
        //				else if (![7, 12, 13, 14].includes(colIdx)) { // Check if colIdx is NOT 7, 12, 13, or 14
        //					$(cell).html(
        //						'<input type="text" class="form-control" placeholder="' +
        //						title +
        //						'" />'
        //					);
        //				}

        //				// Handle keyup event for filtering
        //				$("input", $(".filtersline th").eq($(api.column(colIdx).header()).index()))
        //					.off("keyup")
        //					.on("keyup", function () {
        //						var searchTerm = $(this).val();
        //						$(this).attr("title", searchTerm);

        //						var regexr = "({search})";
        //						api.column(colIdx)
        //							.search(
        //								searchTerm !== "" ? regexr.replace("{search}", "(((" + searchTerm + ")))") : "",
        //								searchTerm !== "",
        //								searchTerm === ""
        //							)
        //							.draw();
        //					});
        //				$('.dt-search').css("display", "none");

        //				//add the sortable function
        //				/*sortLineItemsOrder();*/
        //			});
        //			$('#resetLineItemsTbl').on('click', function () {
        //				$('.filtersline input').each(function () {
        //					if (!$(this).is('[readonly]')) {
        //						$(this).val('');
        //					}
        //				});
        //				//api.columns().every(function () {
        //				//	if (!$(this).is('[readonly]')) {
        //				//		this.search('');
        //				//	}
        //				//});
        //				$('.filtersline select').each(function () {
        //					$(this).val('0').change();
        //				});
        //				/*api.draw();*/
        //				api.columns().search('').draw();
        //			});
        //		},

        //		drawCallback: function (settings) {
        //			var api = this.api();
        //			if (api.rows({ page: 'current' }).data().length === 0) {
        //				$('#line_table tbody').html(
        //					'<tr><td colspan="18" class="empty_cell">No data available in table</td></tr>'
        //				);
        //			}
        //			budget = api.rows().data().toArray();

        //			$('#btns').removeClass('d-flex').addClass('d-none');
        //		}
        //	});
        //}

        function LineItemsDataTable() {
            if ($.fn.DataTable.isDataTable("#line_table")) {
                $('#line_table').DataTable().clear().destroy();
            }
            $("#line_table thead tr")
                .clone(true)
                .addClass("filtersline")
                .appendTo("#line_table thead");

            var table = $("#line_table").DataTable({
                "language": {
                    "lengthMenu": "_MENU_ Entries Per Page"
                },
                "pageLength": 10,
                orderCellsTop: true,
                //scrollX: true,
                fixedHeader: {
                    headerOffset: $("#main-navbar").outerHeight(),
                    //   headerOffset: 50,
                },


                columnDefs: [
                    //{ className: "dt-head-nowrap", targets: "_all" },

                    { className: "dt-center", targets: [1, 2] },
                    //{ width: "2%", targets: 1 },  // Explicitly set column widths
                    //{ width: "124px", targets: 2 },
                    // { width: "10%", targets: 3 },
                    //{ width: "225px", targets: 4 },
                    //{ width: "2%", targets: 5 },
                    //{ width: "2%", targets: 6 },
                    //{ width: "1%", targets: 7 },
                    //{ width: "1", targets: 8 },
                    //{ width: "1.5%", targets: 9 },
                    //{ width: "225px", targets: 10 },
                    //{ width: "1.5%", targets: 11},
                    //{ width: "1%", target: 12 },
                    //{ width: "50%", target: 13 },
                    //{ width: "1%", targets: 14 },
                    //{ width: "1.5%", targets: 15 },
                    //{ width: "1.5%", targets: 16 },
                    //{ width: "0%", targets: 17 },
                    //{ width: '114px', targets: 0 },
                    { "orderable": false, "targets": "_all" },
                    {
                        targets: 16,
                        visible: false,
                        searchable: false
                    },
                    //{ targets: 3, width: '150px' }
                ],
                //fixedHeader: true,
                "paging": false,

                initComplete: function () {
                    var api = this.api();

                    api.columns().eq(0).each(function (colIdx) {
                        var cell = $(".filtersline th").eq($(api.column(colIdx).header()).index());
                        var title = $(cell).text();

                        // Remove unnecessary classes
                        cell.find('.dt-column-title, .dt-column-order, .dt-head-nowrap, .dt-type-numeric').remove();

                        if (colIdx === 0) {
                            $(cell).html('<button type="button" class="porde_list_reset_btn" id="resetLineItemsTbl">Reset</button>');
                        }
                        else if (colIdx === 15) {
                            var select = $(
                                '<select class="form-select" ><option value="0"selected>All</option><option value="Yes">Yes</option><option value="No">No</option>'
                            ).appendTo($(cell));
                            select.on("change", function () {
                                var val = $(this).val();
                                if (val == "0") {
                                    api.column(colIdx).search('').draw();
                                } else {
                                    api.column(colIdx).search(val, false, false).draw();
                                }
                            });
                        }
                        //else if (colIdx === 16) {
                        //    var select = $(
                        //        '<select class="form-select" ><option value="0"selected>All</option><option value="Yes">Yes</option><option value="No">No</option>'
                        //    ).appendTo($(cell));
                        //    select.on("change", function () {
                        //        var val = $(this).val();
                        //        if (val == "0") {
                        //            api.column(colIdx).search('').draw();
                        //        } else {
                        //            api.column(colIdx).search(val, false, false).draw();
                        //        }
                        //    });
                        //}
                        else if (colIdx === 10) {
                            var total = $('#totalForTable').val();
                            $(cell).html(
                                `<input type="text"  class="form-control total_input" placeholder="" value="${total}" disabled="disabled" style=" cursor: default; pointer-events: none;border: 1px solid;  text-align:right;   font-weight: 400;padding-left: 8px;padding-right: 8px;border-color: darkgrey; font-weight: 400; padding: 2px"/>`
                            );
                        }
                        else if (colIdx === 11) {
                            var total = $('#totalCommitForTable').val();
                            $(cell).html(
                                `<input type="text" class="form-control commit_input" placeholder="" value="${total}" disabled="disabled" style=" cursor: default; pointer-events: none;border: 1px solid;  text-align:right;   font-weight: 400;padding-left: 8px;padding-right: 8px;   border-color: darkgrey; font-weight: 400; padding: 2px"/>`
                            );
                        }
                        //else if (colIdx === 17) {
                        //	$(cell).html(`<div style="display:none"></div>`)
                        //}
                        //else {
                        //	$(cell).html
                        //		(
                        //			'<input type="text" class="form-control" placeholder="' +
                        //			title +
                        //			'" />'
                        //		);
                        //}
                        else if (![7, 12, 13, 14, 16, 3].includes(colIdx)) { // Check if colIdx is NOT 7, 12, 13, or 14
                            $(cell).html(
                                '<input type="text" class="form-control" style="padding: 2px 2%;width: 100%;" placeholder="🔍 Search..." />'
                            );
                        }
                        else if (colIdx === 3) {
                            $(cell).html(
                                '<input type="text" class="form-control" style="padding: 2px 2%;width: 100%;" placeholder="🔍 Search..." />'
                            );
                        }

                        // Handle keyup event for filtering
                        $("input", $(".filtersline th").eq($(api.column(colIdx).header()).index()))
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
                        $('.dt-search').css("display", "none");

                        //add the sortable function
                        window.setTimeout(function () {

                            sortLineItemsOrder();
                        }, 50);

                    });
                    $('#resetLineItemsTbl').on('click', function () {
                        $('.filtersline input').each(function () {
                            if (!$(this).is('[readonly]')) {
                                $(this).val('');
                            }
                        });
                        //api.columns().every(function () {
                        //	if (!$(this).is('[readonly]')) {
                        //		this.search('');
                        //	}
                        //});
                        $('.filtersline select').each(function () {
                            $(this).val('0').change();
                        });
                        /*api.draw();*/
                        api.columns().search('').draw();
                    });
                },


                drawCallback: function (settings) {
                    var api = this.api();
                    if (api.rows({ page: 'current' }).data().length === 0) {
                        $('#line_table tbody').html(
                            '<tr><td colspan="17" class="empty_cell">No data available in table</td></tr>'
                        );
                    }
                    budget = api.rows().data().toArray();

                    $('#btns').removeClass('d-flex').addClass('d-none');
                }
            });
        }

        function LockUnlockBudgetbtn() {

            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");

            if (projectId == "0") {
                $('#lckbtn').css('display', 'none');
                $('#unlockbtn').css('display', 'none');
                $('#unlockbtn').parent().css('display', 'none');
                $('#saveNoteBtn').css('display', 'none');
                $('#svsndAprvl').css('display', 'none');
                $(".loader").css("display", "none");
                return;
            }

            if (projectId != "0") {
                $('#svsndAprvl').css('display', '');
            }
            if ($('#IsBudgetLocked').val() == 1) {
                $('#lckbtn').css('display', 'none');
                $('#unlockbtn').css('display', 'block');
                $('#unlockbtn').parent().css('display', '');
                $('#saveNoteBtn').css('display', 'none');
                $('#addBudgetBtn').css('display', 'none');
            }

            else {
                $('#lckbtn').css('display', 'block');
                $('#unlockbtn').css('display', 'none');
                $('#saveNoteBtn').css('display', 'block');
                $('#addBudgetBtn').css('display', 'block');
            }

            if ($('#IsSentForApproval').val() == "0") {
                $('#svsndAprvl').css('display', '');
                //$('#svsndAprvl').parent().css('display', '');
            }
            else if ($('#IsSentForApproval').val() == "1" && $('#IsBudgetApproved').val() == "1" && ($('#VersionNumberForApproval').val() != $('#Currentversion').val())) {
                $('#svsndAprvl').css('display', '');
                //$('#svsndAprvl').parent().css('display', '');
            }
            else {
                $('#svsndAprvl').css('display', 'none');
                //$('#svsndAprvl').parent().css('display', 'none');
            }
            if ($('#IsSentForApproval').val() == "1" && $('#IsBudgetApproved').val() == "0") {
                $('#unlockbtn').css('display', 'none');
                $('#unlockbtn').parent().css('display', 'none');
            }
            if ($('#IsSentForApproval').val() == "1" && $('#IsBudgetApproved').val() == "0" && $('#IsBudgetLocked').val() == "1") {
                //console.log('*****' + 'HI')
                $('#unlockbtn').css('display', '');
                $('#unlockbtn').parent().css('display', '');
            }
            if ($('#IsBudgetApproved').val() == "1") {
                $('.isapproved').css('display', 'none');
            }
            else {
                $('.isapproved').css('display', '');
            }
        }
        let enterPressed = false;

        $(document).on('keyup', '.uAdjust', function (e) {
            if (e.keyCode === 13) {
                enterPressed = true;
                var lineItemId = $(this).data('lineitemid');
                var AdjustItem = $(this).val();
                var adjustrealValue = $(this).attr('data-adj');

                var $row = $(this).closest('tr'); //  Find the row that contains the input
                var commit = parseFloat(($row.find("td:eq(11)").text() || "0").replace(/,/g, '')).toFixed(2);
                var budget_cost = parseFloat(($row.find("td:eq(10)").text() || "0").replace(/,/g, '')).toFixed(2);

                var remaining = Math.max((budget_cost - commit), 0);
                remaining = Math.round(parseFloat(remaining) * 100) / 100;
                if (parseFloat(AdjustItem) > parseFloat(remaining)) {
                    $.notify.warning('Caution', 'Adjustment is greater than remaining. Not updated!');
                    $(this).val(adjustrealValue);
                    return;
                }
                AdjustLineItems(lineItemId, AdjustItem);
            }
            else {
                enterPressed = false;
            }
        });

        $(document).on('focusout', '.uAdjust', function (e) {

            var lineItemId = $(this).data('lineitemid');
            var AdjustItem = $(this).val();
            var adjustrealValue = $(this).attr('data-adj');

            var $row = $(this).closest('tr'); // 🔍 Find the row that contains the input
            var commit = parseFloat(($row.find("td:eq(11)").text() || "0").replace(/,/g, '')).toFixed(2);
            var budget_cost = parseFloat(($row.find("td:eq(10)").text() || "0").replace(/,/g, '')).toFixed(2);

            var remaining = Math.max((budget_cost - commit), 0);
            remaining = Math.round(parseFloat(remaining) * 100) / 100;

            if (!enterPressed) {
                //if condition to only execute focusout event when enterPressed is false
                if (parseFloat(AdjustItem) > parseFloat(remaining)) {
                    $.notify.warning('Caution', 'Adjustment is greater than remaining. Not updated!');
                    $(this).val(adjustrealValue);
                    return;
                }

                AdjustLineItems(lineItemId, AdjustItem);
            } else {
                enterPressed = false;
            }

            /*AdjustLineItems(lineItemId, AdjustItem);*/
        });
        function AdjustLineItems(lineItemId, AdjustItem) {
            var flag = "0";
            $.ajax({
                url: "/Budget/UpdateAdjust?AdjustedAmount=" + AdjustItem + "&LineItemID=" + lineItemId + "&flag=" + flag,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var Title = "";
                    var isValid = data.IsSuccess;
                    if (data.IsSuccess) {
                        $(".loader").css("display", "none");
                        Title = `Successfully Updated.`;
                        $.notify.success('Success', Title);
                        var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var VersionId = $('#currentV').val();
                        GetLineItems(BudgetSectionId, VersionId);

                        $('#btns').removeClass('d-flex').addClass('d-none');
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }

        $(document).on('click', '#cancelSelectionBtn', function () {
            $('.selected').each(function () {
                $(this).removeClass('selected');
            });
            $('#btns').removeClass('d-flex').addClass('d-none');
        });
        $(document).on('click', '.editNote', function () {
            var note = $(this).data('note');
            var totalPid = $(this).closest('tr').find('.itemtotal').text().trim();
            $('#savnot .noteItem').text('Notes for item: ' + totalPid);
            var lineItemId = $(this).data('lineitemidhidden');
            $('#hiddenLineItemId').val(lineItemId);
            var textarea = $('#savnot .noteDesc');
            textarea.val(note);
            if ($('#IsBudgetLocked').val() == "0") {
                textarea.prop("disabled", false);
            }
            else {
                textarea.prop("disabled", true);
            }
        });


        var currentRow = null;

        $(document).on('click', '.editLineItemsmodal', function () {

            var row = $(this).closest('tr');

            LoadLineItem(row);

            $('#edit_line_item').modal('show');

            // var description = $(this).closest('tr').find('.itmDesc').text().trim();
            // var spec = $(this).closest('tr').find('.itmSpecNum').text().trim();
            // var model = $(this).closest('tr').find('.itmModel').text().trim();
            // var vendor = $(this).closest('tr').find('.itmVendor').text().trim();
            // var category = $(this).closest('tr').find('.itmheader').text().trim();
            // var quantity = $(this).closest('tr').find('.itmQty').text().trim();
            // var UOM = $(this).closest('tr').find('.itmUOM').text().trim();
            // var cost = $(this).closest('tr').find('.itmCost').text().trim();
            // var taxable = $(this).closest('tr').find('.itmTx').text().trim() == "Yes" ? true : false;
            // var freight = $(this).data('freightval').toLocaleLowerCase() == 'false' ? false : true;
            // var notes = $(this).closest('tr').find('.editNote').data('note');
            // var lineItemId = $(this).data('lineitemid');
            // var adjust = $(this).closest('tr').find('.uAdjust').val().trim();
            // var remaining = $(this).closest('tr').find('.itmRemaining').text().trim();
            // var commit = $(this).closest('tr').find('.itmCommit').text().trim();
            // var totalID = $(this).closest('tr').find('.itemtotal').text().trim();

            // $.ajax({
            //     url: "/Budget/GetAllUOMinBudgetDetails",
            //     type: "GET",
            //     dataType: "json",
            //     beforeSend: function () {
            //         $(".loader").css("display", "flex");
            //     },
            //     success: function (data) {

            //         // Reference the dropdown within the modal
            //         var dropdown = modal.find('.editUOM');
            //         dropdown.empty();
            //         dropdown.append('<option value="0">--Select UOM--</option>');

            //         if (data.IsSuccess) {
            //             data.Result.forEach(function (item) {
            //                 var option = $('<option></option>')
            //                     .val(item.uoM_ID)
            //                     .text(item.uom);

            //                 // Set selected based on UOM value
            //                 if (UOM === item.uom) {
            //                     option.prop('selected', true);
            //                 }
            //                 //} else if ( UOM === 'EACH') {
            //                 //	option.prop('selected', true);
            //                 //}

            //                 dropdown.append(option);
            //             });
            //             $(".loader").css("display", "none");
            //         } else {
            //             $(".loader").css("display", "none");
            //             console.error("Error loading data:", data.ErrorMessages);
            //             $.notify.error('Error', data.ErrorMessages);
            //         }
            //     }
            // });
            // var modal = $('#edit_line_item');
            // modal.find('.editDesc').val(description);
            // modal.find('.editSpec').val(spec);
            // modal.find('.editModel').val(model);
            // modal.find('.editVendor').val(vendor);
            // modal.find('.editCategory').val(category);
            // modal.find('.editQty').val(quantity);
            // modal.find('.editCost').val(cost);
            // modal.find('.editNotes').val(notes);

            // // Set checkboxes for taxable and freight
            // modal.find('#taxb').prop('checked', taxable);
            // modal.find('#freig').prop('checked', freight);
            // modal.find('.edtitemcommitted').val(commit);
            // modal.find('.edtitemremaining').val(remaining);
            // modal.find('.edtitemadjust').val(adjust);
            // modal.find('.lineItemID').val(lineItemId);
            // modal.find('.lineItemTotalId').text('');
            // modal.find('.lineItemTotalId').text('Edit Line Item- ' + totalID);
        });       

        function LoadLineItem(row) {

            currentRow = row;

            var description = row.find('.itmDesc').text().trim();
            var spec = row.find('.itmSpecNum').text().trim();
            var model = row.find('.itmModel').text().trim();
            var vendor = row.find('.itmVendor').text().trim();
            var category = row.find('.itmheader').text().trim();
            var quantity = row.find('.itmQty').text().trim();
            var UOM = row.find('.itmUOM').text().trim();
            var cost = row.find('.itmCost').text().trim();
            var taxable = row.find('.itmTx').text().trim() == "Yes";
            var notes = row.find('.editNote').data('note');
            var adjust = row.find('.uAdjust').val().trim();
            var remaining = row.find('.itmRemaining').text().trim();
            var commit = row.find('.itmCommit').text().trim();
            var totalID = row.find('.itemtotal').text().trim();

            var editButton = row.find('.editLineItemsmodal');

            var freight = String(editButton.data('freightval')).toLowerCase() === 'true';
            var lineItemId = editButton.data('lineitemid');

            var modal = $('#edit_line_item');

            modal.find('.editDesc').val(description);
            modal.find('.editSpec').val(spec);
            modal.find('.editModel').val(model);
            modal.find('.editVendor').val(vendor);
            modal.find('.editCategory').val(category);
            modal.find('.editQty').val(quantity);
            modal.find('.editCost').val(cost);
            modal.find('.editNotes').val(notes);

            modal.find('#taxb').prop('checked', taxable);
            modal.find('#freig').prop('checked', freight);

            modal.find('.edtitemcommitted').val(commit);
            modal.find('.edtitemremaining').val(remaining);
            modal.find('.edtitemadjust').val(adjust);

            modal.find('.lineItemID').val(lineItemId);
            modal.find('.lineItemTotalId').text('Edit Line Item - ' + totalID);

            updatePrevNextButtons();

            loadUOM(UOM);
        }

        function loadUOM(selectedUOM) {

            var modal = $('#edit_line_item');

            $.ajax({
                url: "/Budget/GetAllUOMinBudgetDetails",
                type: "GET",
                dataType: "json",
                success: function (data) {

                    var dropdown = modal.find('.editUOM');

                    dropdown.empty();
                    dropdown.append('<option value="0">--Select UOM--</option>');

                    if (data.IsSuccess) {

                        $.each(data.Result, function (_, item) {

                            dropdown.append(
                                $('<option>', {
                                    value: item.uoM_ID,
                                    text: item.uom,
                                    selected: item.uom === selectedUOM
                                })
                            );
                        });
                    }
                }
            });
        }

        function updatePrevNextButtons() {

            $('#Move_Previous').prop(
                'disabled',
                currentRow.prev('tr').length === 0
            );

            $('#Move_Next').prop(
                'disabled',
                currentRow.next('tr').length === 0
            );
        }

        $(document).on('click', '#saveNoteBtn', function () {
            var note = $('.noteDesc').val().trim();

            // Get the line item ID from the hidden input field
            var lineItemId = $('#hiddenLineItemId').val();
            $.ajax({
                url: "/Budget/UpdateNoteInBudgetDetailsLineItems?LineItemId=" + lineItemId + "&Note=" + note,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var Title = "";
                    var isValid = data.IsSuccess;
                    if (data.IsSuccess) {
                        Title = data.Result;
                        $('#savnot').modal('hide');
                        $(".loader").css("display", "none");
                        $.notify.success('Success', Title);
                        var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var VersionId = $('#currentV').val();
                        GetLineItems(BudgetSectionId, VersionId);

                        $('#btns').removeClass('d-flex').addClass('d-none');
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on('click', '#edtsvbtn', function () {

            const description = $('.editDesc').val()?.trim() ?? '';
            const spec = $('.editSpec').val()?.trim() ?? '';
            const model = $('.editModel').val()?.trim() ?? '';
            const vendor = $('.editVendor').val()?.trim() ?? '';
            const category = $('.editCategory').val()?.trim() ?? '';
            const qty = parseFloat($('.editQty').val()) || 0;
            const uom = parseInt($('.editUOM').val()) || null;
            const cost = parseFloat($('.editCost').val()) || 0;
            const notes = $('.editNotes').val()?.trim() ?? '';
            const isTaxable = $('#taxb').is(':checked');
            const isFreight = $('#freig').is(':checked');
            const lineItemId = parseInt($('.lineItemID').val()) || 0;
            const adjust = parseFloat($('.edtitemadjust').val()) || 0;
            const budgetSectionId = parseInt($('#ProjectSectionDropDown').val()) || null;
            const commit = parseFloat($('.edtitemcommitted').val()) || 0;

            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            if (!description) {
                $.notify.warning('Caution', 'Please enter item description');
                $('.editDesc').focus();
                return;
            }

            const checkStatusDto = {
                LineItemID: lineItemId,
                Quantity: qty,
                Cost: cost,
                nonfreight: isFreight
            };

            const fdUpdate = {
                LineItemID: lineItemId,
                Quantity: qty,
                Cost: cost,
                ItemDescription: description,
                SpecNum: spec,
                Vendor: vendor,
                UOMID: uom,
                Note: notes,
                Category: category,
                Taxable: isTaxable,
                Model: model,
                nonfreight: isFreight,
                Adjust: adjust,
                BudgetSectionID: budgetSectionId,
                CommitAmountAdjust: commit
            };

            $(".loader").css("display", "flex");

            $.ajax({
                url: "/Budget/CheckStatus",
                type: "GET",
                data: checkStatusDto,
                dataType: "json",
                success: function (data) {

                    if (data.Result === "1" && $('#IsBudgetApproved').val() === "1") {

                        $(".loader").hide();

                        $.confirm({
                            title: 'Warning',
                            message: 'This is an approved budget. Changing the total will make the budget unapproved. Do you want to continue?',
                            type: 'warning',
                            confirmText: 'Continue',
                            cancelText: 'Go Back',

                            onConfirm: function () {

                                let versionName = prompt("Please enter a budget version name:");

                                if (versionName === null) {
                                    return;
                                }

                                if (versionName === '') {

                                    $.confirm({
                                        title: '',
                                        message: 'Want to save with blank version name?',
                                        type: 'confirm',
                                        confirmText: 'Yes, Proceed',
                                        cancelText: 'Cancel',

                                        onConfirm: function () {
                                            UpdateLineItems(fdUpdate,versionName,true,antiForgeryToken);
                                        }
                                    });

                                    return;
                                }

                                UpdateLineItems(fdUpdate,versionName,false,antiForgeryToken);
                            }
                        });

                        return;
                    }

                    if ($('#IsSentForApproval').val() === '1' && data.Result === '1') {

                        $(".loader").hide();

                        $.confirm({
                            title: 'Warning',
                            message: 'Budget already sent for approval. Changing the item total will cancel the approval request. Do you want to continue?',
                            type: 'warning',
                            confirmText: 'Continue',
                            cancelText: 'Go Back',

                            onConfirm: function () {
                                UpdateLineItems(fdUpdate,'',false,antiForgeryToken);
                            }
                        });

                        return;
                    }

                    UpdateLineItems(fdUpdate,'',false,antiForgeryToken);
                },
                complete: function () {
                    $(".loader").hide();
                }
            });           
        });

        function UpdateLineItems(fdUpdate, versionName, isUnlockRequired, antiForgeryToken) {

            $.ajax({
                url: "/Budget/UpdateLineItems",
                type: "POST",
                data: fdUpdate,
                dataType: "json",

                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },

                success: function (data) {

                    if (!data.IsSuccess) {
                        $.notify.error('Error', 'Listitem not updated(Duplicate exists).');
                        return;
                    }

                    if (isUnlockRequired) {
                        UnLockBudget2(versionName);
                        return;
                    }

                    $('#edit_line_item').modal('hide');

                    $.notify.success('Success', 'Lineitem Successfully Updated.');

                    GetLineItems(fdUpdate.BudgetSectionID, "0");

                    if ($('#IsSentForApproval').val() === "1" && $('#IsBudgetChanged').val() === "1") {
                        $("#svsndAprvl").css("display", "none");
                    }
                    
                },

                complete: function () {
                    $(".loader").hide();
                }
            });
        }

        function UnLockBudget2(budgetVersionName) {
            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            var SectionId = $("#ProjectSectionDropDown").find("option:selected").val();
            var IsBudgetLocked = 0;
            var IsNewVersion = 1;
            let fd = {
                ProjectID: projectId,
                SectionID: SectionId,
                IsBudgetLocked: IsBudgetLocked,
                IsNewVersion: IsNewVersion,
                BudgetVersionName: budgetVersionName
            }
            $.ajax({
                url: "/Budget/LockUnlockBudget",
                type: "POST",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var Title = "";
                    var isValid = data.IsSuccess;
                    if (data.IsSuccess) {
                        Title = data.Result;
                        $(".loader").css("display", "none");
                        $.notify.success('Success', data.Result);
                        Versionnames();
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }

        function sortLineItemsOrder() {
            $('#line_table tbody').off('click').on('click', 'tr', function (e) {

                $('#line_table tbody tr').removeClass('ui-sortable-handle');
                if (budget.length == 0) {

                    return;
                }
                if ($('#IsBudgetLocked').val() == "1") {
                    return;
                }
                const isCtrlPressed = e.ctrlKey;
                const isShiftPressed = e.shiftKey;

                // Prevent row selection when clicking icons or links
                if ($(e.target).closest('a').length) {
                    return;
                }

                const currentRow = $(this).closest('tr');
                const currentIndex = currentRow.index();

                if (isCtrlPressed) {
                    // Toggle selection for the current row
                    currentRow.toggleClass('selected');
                    keyCode = "ctrl";
                }
                else if (isShiftPressed) {
                    keyCode = "shift";

                    const lastSelectedRow = $('#line_table tbody tr.selected').last();
                    if (lastSelectedRow.length) {
                        const lastIndex = lastSelectedRow.index();
                        const rows = $('#line_table tbody tr');

                        // Calculate range and apply selection
                        const startIndex = Math.min(lastIndex, currentIndex);
                        const endIndex = Math.max(lastIndex, currentIndex);

                        rows.removeClass('selected');
                        rows.each(function (index) {
                            if (index >= startIndex && index <= endIndex) {
                                $(this).addClass('selected');
                            }
                        });
                    } else {
                        currentRow.addClass('selected').siblings().removeClass('selected');
                    }
                }
                else {
                    // Deselect all rows and select the current one
                    $('#line_table tbody tr').removeClass('selected');
                    currentRow.addClass('selected');
                    keyCode = "0";
                }


                if ($('#IsBudgetLocked').val() != "1") {

                    const selectedRowsCount = $('#line_table tbody tr.selected').length;

                    if (selectedRowsCount > 0) {
                        // If all rows are selected (budget.length == selectedRowsCount), show the buttons
                        //if (selectedRowsCount === budget.length) {
                        //	$('#btns').removeClass('d-flex').addClass('d-none');
                        //} else {
                        //	$('#btns').removeClass('d-none').addClass('d-flex');
                        //}
                        $('#btns').removeClass('d-none').addClass('d-flex');
                    } else {
                        // No rows selected, hide the buttons
                        $('#btns').removeClass('d-flex').addClass('d-none');
                    }
                }

            }).sortable({
                connectWith: 'table',
                cursor: 'move',
                delay: 150,
                revert: 0,

                helper: function (e, item) {
                    if (budget.length == 0) {

                        return;
                    }
                    if ($('#IsBudgetLocked').val() == "1") {
                        return;
                    }
                    if (!item.hasClass('selected')) {
                        item.addClass('selected').siblings().removeClass('selected');
                    }
                    const elements = item.parent().children('.selected').clone();
                    item.data('multidrag', elements).siblings('.selected').remove();
                    const helper = $('<tr/>');
                    return helper.append(elements);
                },

                stop: function (e, ui) {
                    if (budget.length == 0) {

                        return;
                    }
                    if ($('#IsBudgetLocked').val() == "1") {
                        return;
                    }

                    const elements = ui.item.data('multidrag');
                    elements.insertAfter(ui.item);
                    var currentRow = "";
                    var rowCount = 0; //i variable in old solution
                    var previousRow = "";
                    var shiftIndex = 0;
                    var temp;
                    var st = "";
                    var curr = 0;
                    var calNextPosition = "";
                    $('#line_table tbody tr').each(function () {
                        currentRow = $(this); //Current table row

                        if ($(currentRow).hasClass('selected')) {
                            // Handle the first or second selected rows
                            if (rowCount <= 1) {
                                rowCount++; //Increment the selected row counter

                                // Get the row before the current one
                                var previousRowbeforeCurrentrow = currentRow.prev('tr');
                                // Compare the data-id attributes of the current row and the previous row
                                if (parseInt(previousRowbeforeCurrentrow.attr('data-index')) < parseInt(currentRow.attr('data-index'))) {
                                    previousRow = currentRow.prev('tr');
                                    if (rowCount != 1) {
                                        shiftIndex++; // Increment the shift index for subsequent rows
                                    }
                                    temp = previousRow.attr('data-index'); //Store the data-id of the previous row
                                    st = currentRow.attr('data-index'); // Store the data-id of the current row
                                    if (temp != undefined) {
                                        curr = parseInt(temp); // Update the current index if the temp value exists
                                    }


                                }
                                else {
                                    previousRow = currentRow.prev('tr');
                                    if (rowCount != 1) {
                                        shiftIndex++; // Increment the shift index for subsequent rows
                                    }
                                    if (temp == undefined) {
                                        temp = previousRow.attr('data-index');
                                    }
                                    if (temp == undefined) {
                                        temp = 0;
                                    }
                                    temp = temp;

                                    st = currentRow.attr('data-index');
                                    // Update the current index if temp is a valid number
                                    if (temp != NaN) {
                                        curr = parseInt(temp);
                                    }
                                }

                            }
                            else {
                                if (temp != undefined) {
                                    calNextPosition = parseInt(temp) + shiftIndex;
                                    st += ',' + currentRow.attr('data-index');
                                    curr += ',' + calNextPosition;
                                    rowCount++;
                                }
                            }

                        }


                        //if (currentRow.hasClass('selected')) {
                        //	const previousRow = currentRow.prev('tr');
                        //	const currentRowDataId = currentRow.attr('data-index');
                        //	if (rowCounter === 0) {

                        //		//const previousRow = currentRow.prev('tr');
                        //		//lastPrevRowId = previousRow.attr('data-index') || 0;

                        //		//// Process the previous row if available
                        //		//const previousRowDataId = previousRow.attr('data-index');
                        //		//const currentRowDataId = currentRow.attr('data-index');
                        //		lastPrevRowId = previousRow.attr('data-index') || 0;
                        //		// Process the previous row if available
                        //		const previousRowDataId = previousRow.attr('data-index');

                        //		if (parseInt(previousRowDataId) < parseInt(currentRowDataId)) {
                        //			temp = currentRowDataId;
                        //			st = previousRowDataId;
                        //			curr = parseInt(temp);
                        //		} else {
                        //			temp = previousRowDataId || 0;
                        //			st = currentRowDataId;
                        //			curr = parseInt(temp);
                        //		}
                        //	}
                        //	else {
                        //		//currentRowId = currentRow.attr('data-index');
                        //		//rowCounter++;
                        //		//if (temp !== undefined) {
                        //		//	const lt = (parseInt(temp) + j);
                        //		//	st += ',' + currentRow.attr('data-index');
                        //		//	curr += ',' + lt;

                        //		//	j++;
                        //		//}
                        //		if (rowCounter === 1) {
                        //			// Initialize `st` and `curr` with the first row's data if multiple rows are selected
                        //			st = temp;
                        //			curr = temp;
                        //		}
                        //		const lt = (parseInt(temp) + j);
                        //		st += ',' + currentRowDataId;
                        //		curr += ',' + lt;
                        //		j++;
                        //	}
                        //	rowCounter++;

                        //}



                    });
                    //console.log("prev :", st);
                    //console.log("Curr", curr);
                    $('.selected').each(function () {
                        $(this).removeClass('selected');
                    });
                    var SectionId = $('#ProjectSectionDropDown option:selected').val();
                    $(".loader").css("display", "flex");
                    setTimeout(() => {
                        let fd = {
                            prev: st,
                            current: curr,
                            SectionId: SectionId,
                            keycode: keyCode
                        };
                        $.ajax({
                            url: "/Budget/NewSortLineItemForShift",
                            data: fd,
                            type: "POST",
                            async: false,
                            dataType: "json",


                            success: function (data) {
                                $(".loader").css("display", "none");
                                if (data.IsSuccess) {
                                    $.notify.success('Success', data.Result);
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                }
                            }

                        });

                        var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var currentVersion = $('#currentV').val();
                        GetLineItems(budgetSectionId, currentVersion);
                        ui.item.after(elements).remove();

                    }, 0)
                }
            });
        }

        $(document).on('click', '#UpldLineItems', function () {
            var formData = new FormData();
            var totalFiles = $("#FileUpload")[0].files.length;

            if (totalFiles == 0) {
                $.notify.warning('Caution', 'Please select a file!');
                return;
            }

            if (totalFiles > 1) {
                $.notify.warning('Caution', 'Single file at a time!');
                return;
            }
            for (var i = 0; i < totalFiles; i++) {
                var file = $("#FileUpload")[0].files[i];
                formData.append("FileUpload", file);
            }

            var sectionId = $("#ProjectSectionDropDown option:selected").val();
            $.ajax({
                url: "/Budget/LineItemschecksheet",
                type: "POST",
                data: formData,
                dataType: "html",
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $('#lineItemExcelModel').modal("show");
                        $("#LineitemExcelSheetList").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }
                }
            })
        });

        $(document).on('click', '#UpldLineItems2', function () {
            var formData = new FormData();
            var totalFiles = $("#FileUpload")[0].files.length;

            if (totalFiles == 0) {
                $.notify.warning('Caution', 'Please select a file!');
                return;
            }

            if (totalFiles > 1) {
                $.notify.warning('Caution', 'Single file at a time!');
                return;
            }
            for (var i = 0; i < totalFiles; i++) {
                var file = $("#FileUpload")[0].files[i];
                formData.append("FileUpload", file);
            }

            var selectedSheet = $(".sheetselect:checked").val();
            var sectionId = $("#ProjectSectionDropDown option:selected").val();
            $.ajax({
                url: "/Budget/UploadLineItems?sectionId=" + sectionId + "&selectedSheet=" + encodeURIComponent(selectedSheet),
                type: "POST",
                data: formData,
                dataType: "json",
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    //console.log(data);					
                    if (data.IsSuccess) {
                        $.notify.success('Success', data.Result);
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $('#lineItemExcelModel').modal('hide');
                    $("#FileUpload").val("");
                    $(".loader").css("display", "none");
                    var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                    var VersionId = $('#currentV').val();
                    GetLineItems(BudgetSectionId, VersionId);
                },
                error: function (xhr, status, error) {
                    $('#lineItemExcelModel').modal('hide');
                    $("#FileUpload").val("");
                    $(".loader").css("display", "none");

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
            })
        });


        $(document).on('click', '#Move_Previous', function () {

            var prevRow = currentRow.prev('tr');

            if (!prevRow.length) {
                $(this).prop('disabled', true);
                return;
            }

            SaveEditDetails();
            var LineItemsId = $('#edit_line_item').find('.lineItemID').val();
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            var mode = 'Previous';
            GetNavAndLineItems(LineItemsId, budgetSectionId, mode, prevRow);
        });       

        $(document).on('click', '#Move_Next', function () {

            var nextRow = currentRow.next('tr');
            if (!nextRow.length) {
                $(this).prop('disabled', true);
                return;
            }

            SaveEditDetails();
            var LineItemsId = $('#edit_line_item').find('.lineItemID').val();
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            var mode = 'Next';
            GetNavAndLineItems(LineItemsId, budgetSectionId, mode, nextRow);
        });

        function SaveEditDetails() {

            const description = $('.editDesc').val()?.trim() ?? '';
            const spec = $('.editSpec').val()?.trim() ?? '';
            const model = $('.editModel').val()?.trim() ?? '';
            const vendor = $('.editVendor').val()?.trim() ?? '';
            const category = $('.editCategory').val()?.trim() ?? '';
            const qty = parseFloat($('.editQty').val()) || 0;
            const uom = parseInt($('.editUOM').val()) || null;
            const cost = parseFloat($('.editCost').val()) || 0;
            const notes = $('.editNotes').val()?.trim() ?? '';
            const isTaxable = $('#taxb').is(':checked');
            const isFreight = $('#freig').is(':checked');
            const lineItemId = parseInt($('.lineItemID').val()) || 0;
            const adjust = parseFloat($('.edtitemadjust').val()) || 0;
            const budgetSectionId = parseInt($('#ProjectSectionDropDown').val()) || null;
            const commit = parseFloat($('.edtitemcommitted').val()) || 0;

            let antiForgeryToken = $('input[name="__RequestVerificationToken"]').val();

            if (!description) {
                $.notify.warning('Caution', 'Please enter item description');
                $('.editDesc').trigger('focus');
                return;
            }

            const checkStatusDto = {
                LineItemID: lineItemId,
                Quantity: qty,
                Cost: cost,
                nonfreight: isFreight
            };

            const fdUpdate = {
                LineItemID: lineItemId,
                Quantity: qty,
                Cost: cost,
                ItemDescription: description,
                SpecNum: spec,
                Vendor: vendor,
                UOMID: uom,
                Note: notes,
                Category: category,
                Taxable: isTaxable,
                Model: model,
                nonfreight: isFreight,
                Adjust: adjust,
                BudgetSectionID: budgetSectionId,
                CommitAmountAdjust: commit
            };

            $(".loader").css("display", "flex");

            $.ajax({
                url: "/Budget/CheckStatus",
                type: "GET",
                data: checkStatusDto,
                dataType: "json",
                success: function (data) {

                    if (data.Result === "1" && $('#IsBudgetApproved').val() === "1") {

                        $(".loader").hide();

                        $.confirm({
                            title: 'Warning',
                            message: 'This is an approved budget. Changing the total will make the budget unapproved. Do you want to continue?',
                            type: 'warning',
                            confirmText: 'Continue',
                            cancelText: 'Go Back',

                            onConfirm: function () {

                                let versionName = prompt("Please enter a budget version name:");

                                if (versionName === null) {
                                    return;
                                }

                                if (versionName === '') {

                                    $.confirm({
                                        title: '',
                                        message: 'Want to save with blank version name?',
                                        type: 'confirm',
                                        confirmText: 'Yes, Proceed',
                                        cancelText: 'Cancel',

                                        onConfirm: function () {
                                            UpdateLineItemsForMoveNextOrPrev(fdUpdate, true, antiForgeryToken);
                                        }
                                    });

                                    return;
                                }

                                UpdateLineItemsForMoveNextOrPrev(fdUpdate, false, antiForgeryToken);
                            }
                        });

                        return;
                    }

                    if ($('#IsSentForApproval').val() === '1' && data.Result === '1') {

                        $(".loader").hide();

                        $.confirm({
                            title: 'Warning',
                            message: 'Budget already sent for approval. Changing the item total will cancel the approval request. Do you want to continue?',
                            type: 'warning',
                            confirmText: 'Continue',
                            cancelText: 'Go Back',

                            onConfirm: function () {
                                UpdateLineItemsForMoveNextOrPrev(fdUpdate, false, antiForgeryToken);
                            }
                        });

                        return;
                    }

                    UpdateLineItemsForMoveNextOrPrev(fdUpdate, false, antiForgeryToken);
                },
                complete: function () {
                    $(".loader").hide();
                }
            });


        }

        function UpdateLineItemsForMoveNextOrPrev(fdUpdate, isUnlockRequired, antiForgeryToken) {

            $.ajax({
                url: "/Budget/UpdateLineItems",
                type: "POST",
                data: fdUpdate,
                dataType: "json",

                beforeSend: function (xhr) {
                    $(".loader").css("display", "flex");
                    xhr.setRequestHeader("RequestVerificationToken", antiForgeryToken);
                },

                success: function (data) {

                    if (!data.IsSuccess) {
                        $.notify.error('Error', 'Listitem not updated(Duplicate exists).');
                        return;
                    }

                    if (isUnlockRequired) {
                        return;
                    }

                    GetLineItems(fdUpdate.BudgetSectionID, "0");

                    if ($('#IsSentForApproval').val() === "1" && $('#IsBudgetChanged').val() === "1") {
                        $("#svsndAprvl").css("display", "none");
                    }

                },

                complete: function () {
                    $(".loader").hide();
                }
            });
        }

        function GetNavAndLineItems(LineItemID, budgetSectionId, mode, row) {

            currentRow = row;

            $.ajax({
                url: "/Budget/GetNavAndLineItems?LineItemID=" + LineItemID + "&BudgetSectionId=" + budgetSectionId + "&mode=" + mode,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    var temp = data.Result;
                    if (data.IsSuccess) {
                        var modal = $('#edit_line_item');
                        modal.find('.editDesc').val("");
                        modal.find('.editSpec').val("");
                        modal.find('.editModel').val("");
                        modal.find('.editVendor').val("");
                        modal.find('.editCategory').val("");
                        modal.find('.editQty').val("");
                        modal.find('.editCost').val("");
                        modal.find('.editNotes').val("");
                        var dropdown = modal.find('.editUOM');
                        dropdown.empty();
                        dropdown.append('<option value="0">--Select UOM--</option>');
                        modal.find('#taxb').prop('checked', false);
                        modal.find('#freig').prop('checked', false);
                        modal.find('.edtitemcommitted').val("");
                        modal.find('.edtitemremaining').val("");
                        modal.find('.edtitemadjust').val("");
                        modal.find('.lineItemID').val("");

                        var TotalId = temp[0].totalID;
                        var LineItemId = temp[0].lineItemID;
                        var items = temp[0].items;
                        var description = temp[0].itemDescriptions;
                        var Spec = temp[0].specNum;
                        var model = temp[0].model;
                        var vendor = temp[0].vendor;
                        var category = temp[0].header;
                        var quantity = temp[0].quantity;
                        var cost = temp[0].cost;
                        var notes = temp[0].note;
                        var UOM = temp[0].uom;
                        var adjust = temp[0].adjust;
                        var taxable = temp[0].taxable;
                        var nonfrieght = temp[0].nonfrieght;
                        var commit = parseFloat(temp[0].commit).toFixed(2);

                        modal.find('.editDesc').val(description);
                        modal.find('.editSpec').val(Spec);
                        modal.find('.editModel').val(model);
                        modal.find('.editVendor').val(vendor);
                        modal.find('.editCategory').val(category);
                        modal.find('.editQty').val(quantity);
                        modal.find('.editCost').val(cost);
                        modal.find('.editNotes').val(notes);
                        // Set checkboxes for taxable and freight
                        modal.find('#taxb').prop('checked', taxable);
                        modal.find('#freig').prop('checked', nonfrieght);
                        modal.find('.edtitemcommitted').val(commit);

                        modal.find('.edtitemadjust').val(adjust);
                        modal.find('.lineItemID').val(LineItemId);
                        modal.find('.lineItemTotalId').text('');
                        modal.find('.lineItemTotalId').text('Edit Line Item- ' + TotalId);

                        loadUOM(UOM);

                    }
                },
                complete: function () {
                    $(".loader").hide();
                }
            });

            updatePrevNextButtons();
        }

        function magnifydiv(mode) {
            var zoomval = 0;
            if ($('#line_table_wrapper').attr('data-zoomval') == undefined || $('#line_table_wrapper').attr('data-zoomval') == '') {
                zoomval = 1.0;
            }
            else {
                zoomval = parseFloat($('#line_table_wrapper').attr('data-zoomval'));
            }
            if (mode == 'in') {
                zoomval += 0.1;
            }
            else {
                zoomval -= 0.1;
            }
            if (zoomval > 1) {
                zoomval = 1;
            }
            if (zoomval <= 0.6) {
                zoomval = 0.6;
            }
            $('#line_table_wrapper').css('zoom', zoomval);
            $('#line_table_wrapper').attr('data-zoomval', zoomval);
        };

        $(document).on('click', '#MagnifyPlus', function () {
            var mode = "in";
            magnifydiv(mode);
        });
        $(document).on('click', '#MagnifyMinus', function () {
            var mode = "out";
            magnifydiv(mode);
        });
        $(document).on('click', '#AdjustRemaining', function () {
            $.confirm({
                title: 'Warning',
                message: 'Are you sure you want to adjust all line items in this section to move remaining values to variance? Click OK to adjust or Cancel to leave the line items as they are?',
                type: 'warning',
                confirmText: 'OK',
                cancelText: 'Cancel',
                onConfirm: function () { 
                    var lineItemsId = '';
                    var totalcost = '';
                    var commitcost = '';
                    var adjust = '';
                    if (budget.length == 0) {
                        return;
                    }
                    for (var i = 0; i < budget.length; i++) {
                        lineItemsId = $(budget[i][13]).data('lineitemid');
                        totalcost = parseFloat(budget[i][10].replace(/,/g, ''));
                        commitcost = parseFloat(budget[i][11].replace(/,/g, ''));
                        adjust = Math.max((totalcost - commitcost), 0);


                        $.ajax({
                            url: "/Budget/UpdateAdjust?AdjustedAmount=" + adjust + "&LineItemID=" + lineItemsId + "&flag=" + "1",
                            type: "POST",
                            dataType: "json",
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                var Title = "";
                                var isValid = data.IsSuccess;

                                if (data.IsSuccess) {
                                    $.notify.success('Success', data.Result);
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                }
                            }
                        });
                    }

                    window.setTimeout(function () {
                        $.notify.success('Success', 'Updated successfully.');
                        $(".loader").css("display", "none");
                        var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var VersionId = $('#currentV').val();
                        GetLineItems(BudgetSectionId, VersionId);
                        $('#btns').removeClass('d-flex').addClass('d-none');
                    }, 3000);
                }
            });            
        });

        $(document).on('click', '#deleteSelection', function () {
            var lineItemIds = [];

            $('#line_table tbody tr.selected').each(function () {
                var lineItemId = $(this).find('a').data('lineitemid');
                lineItemIds.push(lineItemId);
            });
            var ids = lineItemIds.join(",");
            var itemLength = lineItemIds.length;

            $.confirm({
                title: 'Delete',
                message: "Do you really want to delete " + itemLength + " items?",
                type: 'danger',
                confirmText: 'Yes',
                cancelText: 'No',
                onConfirm: function () {
                    $.ajax({
                        url: "/Budget/DeleteMultipleLineItems?LineItemId=" + ids,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var Title = "";
                            if (data.IsSuccess) {
                                if (data.Result == "SUCCESS") {
                                    Title = `${itemLength} ${itemLength > 1 ? 'items' : 'item'} deleted successfully.`;
                                    $(".loader").css("display", "none");
                                    $.notify.success('Success', Title);
                                    var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                    var VersionId = $('#currentV').val();
                                    GetLineItems(BudgetSectionId, VersionId);
                                }
                                else {
                                    Title = `${data.Result} item(s) could not be Deleted.`;
                                    $.notify.error('Error', Title);
                                    var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                    var VersionId = $('#currentV').val();
                                    GetLineItems(BudgetSectionId, VersionId);
                                }
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

        $(document).on('click', '.deleteSingleLineItem', function () {
            var LineItemId = $(this).data('id');

            $.confirm({
                title: 'Delete',
                message: 'Do you really want to delete?',
                type: 'danger',
                confirmText: 'Delete',
                cancelText: 'Keep It',
                onConfirm: function () {
                    $.ajax({
                        url: "/Budget/DeleteLineItems?LineItemId=" + LineItemId,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            var Title = "";
                            if (data.IsSuccess) {
                                Title = data.Result;
                                $(".loader").css("display", "none");
                                $.notify.success('Success', Title);
                                var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                var VersionId = $('#currentV').val();
                                GetLineItems(BudgetSectionId, VersionId);
                            }
                            else {
                                Title = data.ErrorMessages;
                                $(".loader").css("display", "none");
                                if (data.ErrorMessages[0] == "Not Found") {
                                    $.notify.error('Error', 'Item Already Deleted')
                                    var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                    var VersionId = $('#currentV').val();
                                    GetLineItems(BudgetSectionId, VersionId);
                                }
                                else {
                                    $.notify.error('Error', data.ErrorMessages);
                                }
                            }
                        }
                    });
                },
                onCancel: function () {                   
                },
                onContentReady: function () {
                    var self = this;

                    $(document).on('keydown.deleteConfirm', function (e) {
                        $.ajax({
                            url: "/Budget/DeleteLineItems?LineItemId=" + LineItemId,
                            type: "POST",
                            dataType: "json",
                            beforeSend: function () {
                                $(".loader").css("display", "flex");
                            },
                            success: function (data) {
                                var Title = "";
                                if (data.IsSuccess) {
                                    Title = data.Result;
                                    $(".loader").css("display", "none");
                                    $.notify.success('Success', Title);
                                    var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                    var VersionId = $('#currentV').val();
                                    GetLineItems(BudgetSectionId, VersionId);
                                }
                                else {
                                    Title = data.ErrorMessages;
                                    $(".loader").css("display", "none");
                                    if (data.ErrorMessages[0] == "Not Found") {
                                        $.notify.error('Error', 'Item Already Deleted')
                                        var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                                        var VersionId = $('#currentV').val();
                                        GetLineItems(BudgetSectionId, VersionId);
                                    }
                                    else {
                                        $.notify.error('Error', data.ErrorMessages);
                                    }
                                }
                            }
                        });

                        
                    });
                },
            });            
        });

        $(document).on('click', '#lckbtn', function () {
            /*$('#chk_VrsnCrt').removeAttr('checked');*/

            $('#chk_VrsnCrt').prop('checked', false);
            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            var IsNewVersion = $('#chk_VrsnCrt').is(':checked') ? "1" : "0";
            let fd = {
                ProjectId: projectId,
                SectionId: budgetSectionId,
                IsNewVersion: IsNewVersion,
                IsBudgetLocked: 1,
            };
            if (projectId == "0" || projectId == undefined || projectId == null) {
                return;
            }
            if (budgetSectionId == "0" || budgetSectionId == undefined || budgetSectionId == null) {
                $.notify.warning('Caution', 'No Project Section Found.!');
                return;
            }

            $.ajax({
                url: "/Budget/LockBudget",
                type: "POST",
                data: fd,
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var currentVersion = $('#currentV').val();
                        GetLineItems(budgetSectionId, currentVersion);
                        $.notify.success('Success', 'Budget Locked Successfully');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on('click', "#unlockyes", function () {
            var budgetVersionName = $('#newversionname').val()?.trim();
            $('#chk_VrsnCrt').prop('checked', 'checked');
            var IsNewVersion = $('#chk_VrsnCrt').is(':checked') ? "1" : "0";
            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            let fd = {
                ProjectId: projectId,
                SectionId: budgetSectionId,
                IsNewVersion: IsNewVersion,
                IsBudgetLocked: 0,
                VersionName: budgetVersionName
            };
            if (budgetVersionName == null || budgetVersionName == "" || budgetVersionName == undefined) {
                $.notify.warning('Caution', 'Please enter new version...!');
                return;
            }
            if (projectId == "0" || projectId == undefined || projectId == null) {
                return;
            }
            if (budgetSectionId == "0" || budgetSectionId == undefined || budgetSectionId == null) {
                $.notify.warning('Caution', 'No Project Section Found!');
                return;
            }
            $.ajax({
                url: "/Budget/UnlockBudget",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var currentVersion = $('#currentV').val();
                        $('#newversionname').val('');
                        GetLineItems(budgetSectionId, currentVersion);
                        Versionnames();
                        if ($('#svsndAprvl').is(':hidden')) {
                            $('#svsndAprvl').show();
                        }
                        $.notify.success('Success', 'Budget Unlocked Successfully');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });
        $(document).on('click', "#unlckno", function () {
            /*$('#chk_VrsnCrt').removeAttr('checked');*/
            $('#chk_VrsnCrt').prop('checked', false);
            var budgetVersionName = $('#newversionname').val();
            var IsNewVersion = $('#chk_VrsnCrt').is(':checked') ? "1" : "0";
            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            let fd = {
                ProjectId: projectId,
                SectionId: budgetSectionId,
                IsNewVersion: IsNewVersion,
                IsBudgetLocked: 0,
                VersionName: budgetVersionName
            };
            if (projectId == "0" || projectId == undefined || projectId == null) {
                return;
            }
            if (budgetSectionId == "0" || budgetSectionId == undefined || budgetSectionId == null) {
                $.notify.warning('Caution', 'No Project Section Found!');
                return;
            }
            $.ajax({
                url: "/Budget/UnlockBudget",
                data: fd,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        var budgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                        var currentVersion = $('#currentV').val();
                        GetLineItems(budgetSectionId, currentVersion);
                        if ($('#svsndAprvl').is(':hidden')) {
                            $('#svsndAprvl').show();
                        }
                        $.notify.success('Success', 'Budget Unlocked Successfully');
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        $(document).on('click', '#btnExporToExcel', function () {
            var ProjectName = $("#Project_Name_List option:checked").text().trim();
            var ProjectId = $("#Project_Name_List option:checked").attr('data-id');

            $.ajax({
                url: "/Budget/ExportFile",
                type: "POST",
                data: { ProjectId: ProjectId, ProjectName: encodeURIComponent(ProjectName) },
                xhrFields: {
                    responseType: 'blob'
                },
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data, status, xhr) {
                    $(".loader").css("display", "none");

                    var disposition = xhr.getResponseHeader('Content-Disposition');

                    var fileName = "Budget.xlsx";

                    if (disposition && disposition.indexOf('filename=') !== -1) {

                        var fileNameMatch = disposition.match(/filename="?([^"]+)"?/);

                        if (fileNameMatch.length > 1) {
                            fileName = fileNameMatch[1];
                        }
                    }

                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

                    var link = document.createElement('a');

                    link.href = window.URL.createObjectURL(blob);

                    link.download = fileName;

                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(link.href);

                    $.notify.success('Success', 'Export to Excel');
                }
            })
        });

        $(document).on('change', '#PreviousProjectSection', function () {
            var budgetSectionId = $('#PreviousProjectSection option:selected').val();
            var currentVersion = $('#currentV').val();
            GetLineItems(budgetSectionId, currentVersion);
        });

        $(document).on('click', '#svsndAprvl', function () {

            var ProjectId = $("#Project_Name_List option:checked").attr('data-id');

            if (ProjectId == '0' || ProjectId == null || ProjectId === undefined) {
                $.notify.warning('Caution', 'Please Select Project');
                return;
            }

            if ($('#cansendforapproval').val() == "false") {
                $.notify.warning('Caution', 'Does not have enough approvers');
                return;
            }

            if ($('#IsBudgetApproved').val() == "1") {

                $.confirm({
                    title: 'Warning',
                    message: 'Budget already approved. Resend budget for approval?',
                    type: 'warning',
                    confirmText: 'Continue',
                    cancelText: 'Go Back',
                    onConfirm: function () {
                        GetBudgetGroup(ProjectId);
                        $('#svsndAprvl').hide();
                    },
                    onCancel: function () {                       
                    }
                });                          
            }
            else {
                GetBudgetGroup(ProjectId);
                $('#svsndAprvl').hide();
            }
        });

        function GetBudgetGroup(ProjectId) {
            $.ajax({
                url: "/Budget/GetGroupForApproval",
                type: "GET",
                data: { ProjectId: ProjectId },
                dataType: "html",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data != null) {
                        $("#ListOfBudgetGroupModel").modal("show");
                        $("#ListOfBudgetGroupList").html("");
                        $("#ListOfBudgetGroupList").html(data);
                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Something went wrong');
                    }

                }
            })
        }

        //$(document).on('click', '#sendbudgetgrpBtn', function () {
        //    let groupIds = '';
        //    let shouldProceed = true;


        //    $('.groupid:checked').each(function () {
        //        const groupId = $(this).data('groupid');
        //        const isSent = $(this).data('issent');
        //        const groupName = $(this).data('gname');

        //        if (isSent == '1') {
        //            shouldProceed = confirm(`${groupName} has already been sent for approval. Do you want to send again?`);
        //        }

        //        if (shouldProceed) {
        //            groupIds += groupIds ? `,${groupId}` : groupId;
        //        } else {
        //            return false;
        //        }
        //    });

        //    if (!shouldProceed) return;

        //    if (groupIds == '') {
        //        $.notify.warning('Caution', 'Please select atleast 1 group to send for approval');
        //        return;
        //    }

        //    var ProjectId = $("#Project_Name_List option:checked").attr('data-id') == null || $("#Project_Name_List option:checked").attr('data-id') === undefined ? 0 : $("#Project_Name_List option:checked").attr('data-id');

        //    var c = confirm("Do you want to send the approvers a notification email? OK for yes, cancel for no.");

        //    var IsNewVersion = $('#chk_VrsnCrt').is(':checked') ? "1" : "0";

        //    let fd = {
        //        ProjectID: ProjectId,
        //        SectionID: groupIds,
        //        IsNewVersion: IsNewVersion,
        //        Sendmail: c
        //    };

        //    $.ajax({
        //        url: "/Budget/SaveAndSendFrApprvl",
        //        type: "POST",
        //        data: fd,
        //        dataType: "json",
        //        beforeSend: function () {
        //            $(".loader").css("display", "flex");
        //        },
        //        success: function (data) {
        //            $(".loader").css("display", "none");
        //            if (data.IsSuccess) {
        //                if (c) {
        //                    $.notify.success('Success', 'Group sent for approval, Sent mail to ' + data.Result);
        //                } else {
        //                    $.notify.success('Success', 'Sent budget for approval');
        //                }
        //                window.setTimeout(function () {
        //                    window.location.reload();
        //                }, 4000);
        //            }
        //            else {
        //                $.notify.error('Error', data.ErrorMessages);
        //            }
        //        }
        //    })

        //    //console.log(groupIds);
        //});

        $(document).on('click', '#sendbudgetgrpBtn', function () {
            let groupIds = '';
            let shouldProceed = true;
            let groupsToCheck = [];

            $('.groupid:checked').each(function () {
                const groupId = $(this).data('groupid');
                const isSent = $(this).data('issent');
                const groupName = $(this).data('gname');

                groupsToCheck.push({
                    groupId: groupId,
                    isSent: isSent,
                    groupName: groupName
                });                
            });

            if (groupsToCheck.length === 0) {
                $.notify.warning('Caution', 'Please select at least 1 group to send for approval');
                return;
            }

            processGroupsSequentially(0);

            function processGroupsSequentially(index) {
                if (index >= groupsToCheck.length) {
                    if (groupIds === '') {
                        return; // User cancelled all groups
                    }
                    showEmailConfirmation();
                    return;
                }

                const group = groupsToCheck[index];

                if (group.isSent == '1') {
                    $.confirm({
                        title: 'Resend for Approval?',
                        message: `${group.groupName} has already been sent for approval. Do you want to send again?`,
                        type: 'warning',
                        confirmText: 'Ok',
                        cancelText: 'Cancel',
                        onConfirm: function () {
                            // Add to groupIds and continue
                            groupIds += groupIds ? `,${group.groupId}` : group.groupId;
                            processGroupsSequentially(index + 1);
                        },
                        onCancel: function () {
                            // Skip this group and continue
                            processGroupsSequentially(index + 1);
                        }
                    });
                } else {
                    // Not sent yet, add directly and continue
                    groupIds += groupIds ? `,${group.groupId}` : group.groupId;
                    processGroupsSequentially(index + 1);
                }
            }

            function showEmailConfirmation() {
                $.confirm({
                    title: 'Send Notification Email?',
                    message: 'Do you want to send the approvers a notification email?',
                    type: 'confirm',
                    confirmText: 'Ok',
                    cancelText: 'Cancel',
                    onConfirm: function () {
                        sendBudgetForApproval(true);
                    },
                    onCancel: function () {
                        sendBudgetForApproval(false);
                    }
                });
            }

            function sendBudgetForApproval(sendEmail) {
                var ProjectId = $("#Project_Name_List option:checked").attr('data-id');
                ProjectId = (ProjectId == null || ProjectId === undefined) ? 0 : ProjectId;
                var IsNewVersion = $('#chk_VrsnCrt').is(':checked') ? "1" : "0";

                let fd = {
                    ProjectID: ProjectId,
                    SectionID: groupIds,
                    IsNewVersion: IsNewVersion,
                    Sendmail: sendEmail
                };

                $.ajax({
                    url: "/Budget/SaveAndSendFrApprvl",
                    type: "POST",
                    data: fd,
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            if (sendEmail) {
                                $.notify.success('Success', 'Group sent for approval, Sent mail to ' + data.Result);
                            } else {
                                $.notify.success('Success', 'Sent budget for approval');
                            }
                            window.setTimeout(function () {
                                window.location.reload();
                            }, 4000);
                        } else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    },
                    error: function () {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', 'Failed to send budget for approval');
                    }
                });
            }            
        });

        function checkmanagerforversionedit() {
            var projectId = $("#Project_Name_List").find("option:selected").data("id");
            $.ajax({
                url: "/Budget/GetManagerForBudget?ProjectId=" + projectId,
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    $(".loader").css("display", "none");
                    if (data.IsSuccess) {
                        if (data.Result == true) {
                            $('#editCV').show();
                            $('#deleteCV').show();
                        }
                        else {
                            $('#editCV').hide();
                            $('#deleteCV').hide();
                        }
                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }

        $(document).on('click', '.itmTx', function () {
            var check = $('#IsBudgetLocked').val();
            if (check != "1") {
                var lineItemId = $(this).data('id');
                $.ajax({
                    url: "/Budget/ChangeTaxable?LineItemId=" + lineItemId,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                            var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                            var VersionId = $('#currentV').val();
                            GetLineItems(BudgetSectionId, VersionId);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }
        });

        $(document).on('click', '.itmSpc', function () {
            var check = $('#IsBudgetLocked').val();
            if (check != "1") {
                //setTimeout(function () {
                //	$('#line_table tbody tr').removeClass('selected');
                //}, 0);
                var LineItemId = $(this).data('id');
                var spacing = $(this).text().trim() == "No" ? 5 : 0;
                $.ajax({
                    url: "/Budget/ChangeSpacing?LineItemId=" + LineItemId + "&Spacing=" + spacing,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").css("display", "flex");
                    },
                    success: function (data) {
                        $(".loader").css("display", "none");
                        if (data.IsSuccess) {
                            $.notify.success('Success', data.Result);
                            var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
                            var VersionId = $('#currentV').val();
                            GetLineItems(BudgetSectionId, VersionId);
                        }
                        else {
                            $.notify.error('Error', data.ErrorMessages);
                        }
                    }
                });
            }
        });

        $(document).on('click', '#btn_CopyBudget', function () {
            var projectId = $("#Project_Name_List").find("option:selected").data("id") == null || $("#Project_Name_List").find("option:selected").data("id") == undefined ? "0" : $("#Project_Name_List").find("option:selected").data("id");
            var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();

            $.ajax({
                url: "/Budget/GetProjectNameForCopyBudget",
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var projectNameDropDown = $('#Ddl_SelProCopy');
                        var projectId = $("#Project_Name_List").find("option:selected").data("id");
                        projectNameDropDown.empty();
                        if (projectId == null || projectId == "0" || projectId == "") {
                            projectNameDropDown.append('<option value="0"selected>--Select Project--</option>');
                        }
                        $.each(data.Result, function (index, project) {
                            if (projectId == project.projectID) {
                                projectNameDropDown.append(`<option value="${project.projectID}" data-projectnumber=${project.projectNumber}  selected>${project.projectName}</option>`);
                            }

                            else {
                                projectNameDropDown.append(`<option value="${project.projectID}" data-projectnumber=${project.projectNumber} >${project.projectName}</option>`);
                            }
                        });
                        $(".multislctCopy").multipleSelect("destroy");
                        $(".multislctCopy").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            single: true,
                        });
                        var projectId = $("#Project_Name_List").find("option:selected").data("id");

                        ProjectSectionForCopyBudget(projectId);

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        });

        function ProjectSectionForCopyBudget(ProjectId) {
            var BudgetSectionId = $('#ProjectSectionDropDown option:selected').val();
            $.ajax({
                url: "/Budget/GetProjectSectionForBudgetCopy?ProjectId=" + ProjectId,
                type: "GET",
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {
                    if (data.IsSuccess) {
                        var version = $('#currentV').val();
                        var html = "";
                        var sectionForCopy = $('#Ddl_SelSecCopy');

                        $.each(data.Result, function (index, section) {

                            if (BudgetSectionId != section.budgetSectionId || (BudgetSectionId == section.budgetSectionId && version != "0")) {
                                html += "<option value='" + section.budgetSectionId + "'>" + section.sectionNumber + "-" + section.sectionName + "</option>";
                            }
                        });
                        $('#Ddl_SelSecCopy').html(html);
                        $('#Ddl_SelSecCopy option:first').prop('selected', true);
                        $("#Ddl_SelSecCopy").multipleSelect("destroy");
                        $("#Ddl_SelSecCopy").multipleSelect({
                            filter: true,
                            showClear: true,
                            placeholder: "Please Select",
                            filterPlaceholder: "Enter Keyword",
                            single: true,

                        });
                        $(".ms-choice span.placeholder").removeClass("placeholder");

                        $(".loader").css("display", "none");
                    }
                    else {
                        $(".loader").css("display", "none");
                        $.notify.error('Error', data.ErrorMessages);
                    }
                }
            })
        }
        $(document).on('change', '#Ddl_SelProCopy', function () {
            var projectId = $('#Ddl_SelProCopy').val();
            ProjectSectionForCopyBudget(projectId);
        });

        $(document).on('click', "#saveCopyBudget", function () {

            var projectToCopyId = $('#Ddl_SelProCopy').val();
            var projectNumber = $('#Ddl_SelProCopy option:selected').text();
            var section = $('#Ddl_SelSecCopy option:selected').text();
            if (projectToCopyId == 0) {
                $.notify.warning('Caution', 'Please select Project!');
                return;
            }
            if (section == "" || section == null || section == undefined) {
                $.notify.warning('Caution', 'Please select Section!');
                return;
            }

            $.confirm({
                title: 'Warning',
                message: "Are You sure you want to copy this budget to " + projectNumber + " - " + section + "?",
                type: 'warning',
                confirmText: 'Continue',
                cancelText: 'Go Back',
                onConfirm: function () {
                    var ProjectId = $('#Ddl_SelProCopy option:selected').val();
                    var SectionId = $('#Ddl_SelSecCopy').val();
                    var sourceProjectId = $("#Project_Name_List").find("option:selected").data("id");
                    var sourceSectionId = $('#ProjectSectionDropDown option:selected').val();
                    var versionId = $('#currentV').val();
                    if (versionId != "0") {
                        sourceSectionId = $('#PreviousProjectSection option:selected').val();
                    }
                    if (sourceSectionId == undefined || sourceSectionId == null) {
                        $.notify.warning('Caution', 'Please Select Source Section!');
                        return;
                    }
                    let fd = {
                        ProjectId: ProjectId,
                        SectionId: SectionId,
                        SourceProjectId: sourceProjectId,
                        SourceSectionId: sourceSectionId,
                        VersionId: versionId,

                    };
                    $.ajax({
                        url: "/Budget/CopyBudget",
                        data: fd,
                        type: "POST",
                        dataType: "json",
                        beforeSend: function () {
                            $(".loader").css("display", "flex");
                        },
                        success: function (data) {
                            $(".loader").css("display", "none");
                            if (data.IsSuccess) {
                                var rowCount = data.Result;
                                $.notify.success('Success', `${rowCount} new rows added to ${projectNumber} - ${section}`);
                            }
                            else {
                                $.notify.error('Error', data.ErrorMessages);
                            }
                        }

                    })
                },
                onCancel: function () {
                    
                }
            });
           
        });

        function getApprovalStatusForSentBudget(ProjectId, SectionId) {
            $.ajax({
                url: "/Budget/GetApprovalStatusForSentBudget",
                type: "GET",
                data: { ProjectId: ProjectId, SectionId: SectionId },
                dataType: "json",
                beforeSend: function () {
                    $(".loader").css("display", "flex");
                },
                success: function (data) {

                    $('#budgetsentforapprovalyes').html('');
                    $(".loader").css("display", "none");
                    var html = "";
                    var title = "";
                    var SentForApprovalDate = "";
                    var DateWhenBudgetApproved = "";
                    var NumOfUserToAprv_Budget;
                    var AlreadyApprovedvr;
                    var alreadyapproved = "";
                    var alreadyapproved1 = "";
                    var SentForApprovalDate = "";
                    var toapprove = "";
                    var toapprove1 = "";
                    var textstatusforapproval = "";
                    var tempData = data.Result;
                    if (tempData != "0") {
                        //	for (var i = 0; i < tempData.length; i++)
                        //	{
                        //		SentForApprovalDate = tempData[i].sentForApprovalDate;
                        //		if (tempData.approved == "1") {
                        //			if (tempData[i].managerName != "") {
                        //				title = "By " + tempData[i].managerName + ". ";
                        //			}
                        //			else {
                        //				title = "Self Approved";
                        //			}
                        //			title += "On " + tempData[i].userApprovedDate;
                        //			if (alreadyapproved1 == "") {
                        //				alreadyapproved1 += '<span style="cursor:pointer;" title="' + title + '"><i class="fa fa-check mrg5R" style="color: #449d44;"></i>' + tempData.userName + "</span>";
                        //			}
                        //			else {
                        //				alreadyapproved1 += ', <span style="cursor:pointer;" title="' + title + '"><i title="' + title + '" class="fa fa-check mrg5R" style="color: #449d44;"></i>' + tempData.userName + "</span>";
                        //			}
                        //			if (tempData.alreadyAproved == "0") {
                        //				alreadyapproved += tempData.userName;
                        //			}
                        //			else {
                        //				alreadyapproved += ", " + tempData.userName;
                        //			}

                        //		}
                        //		else {
                        //			if (toapprove1 == "") {
                        //				toapprove1 += '<i class="fa fa-times mrg5R" style="color: #E33747;"></i>' + tempData.userName;
                        //			}
                        //			else {
                        //				toapprove1 += ', <i class="fa fa-times mrg5R" style="color: #E33747;"></i>' + tempData.userName;
                        //			}
                        //			if (toapprove == "") {
                        //				toapprove += tempData.userName;
                        //			}
                        //			else {
                        //				toapprove += ", " + tempData.userName;
                        //			}

                        //		}
                        //		if (parseInt(tempData.numOfUserToAprove_Budget) > parseInt(tempData.alreadyAproved)) {
                        //			textstatusforapproval = ".Budget is not yet approved.";
                        //		}
                        //		else {
                        //			textstatusforapproval = ". Budget was approved on " + tempData.dateWhenApproved + ".";
                        //			toapprove1 = "";
                        //		}
                        //		var totapp = parseInt(tempData[i].numOfUserToAprove_Budget);
                        //		var widthAlreadyApproved = (100 / totapp) * parseInt(tempData[i].dateWhenApproved);
                        //		var widthNumOfUserToAprv_Budget = 100 - parseInt(widthAlreadyApproved);
                        //		if (alreadyapproved1.trim() != "" && parseInt(tempData.numOfUserToAprove_Budget) > parseInt(tempData.alreadyAproved)) {
                        //			alreadyapproved1 += " | ";
                        //		}
                        //	}
                        //	html = `
                        //	<div class='col-sm-12'>
                        //		<label>Sent for approval on ${SentForApprovalDate}${textstatusforapproval}</label>
                        //		<div class='progress displaynone'>
                        //			<div class='progress-bar progress-bar-success' 
                        //				title='${alreadyapproved}' 
                        //				role='progressbar' 
                        //				style='width:${parseInt(widthAlreadyApproved)}%'>
                        //				${tempData.alreadyAproved} Has Approved (${alreadyapproved})
                        //			</div>
                        //			<div class='progress-bar progress-bar-warning' 
                        //				title='${toapprove}' 
                        //				role='progressbar' 
                        //				style='width:${parseInt(widthNumOfUserToAprv_Budget)}%'>
                        //				${parseInt(totapp) - parseInt(tempData.alreadyAproved)} To Approve (${toapprove})
                        //			</div>
                        //		</div>
                        //	</div>
                        //	<div class='col-sm-12'><strong>${alreadyapproved1}${toapprove1}</strong></div>
                        //`;
                        for (var i = 0; i < tempData.length; i++) {
                            var ManagerName = tempData[i].managerName;
                            var UserName = tempData[i].userName;
                            var Approved = tempData[i].approved;
                            SentForApprovalDate = tempData[i].sentForApprovalDate;
                            NumOfUserToAprv_Budget = tempData[i].numOfUserToAprv_Budget;
                            DateWhenBudgetApproved = tempData[i].dateWhenBudgetApproved;
                            AlreadyApprovedvr = tempData[i].alreadyApproved;
                            var UserApprovedDate = tempData[i].userApprovedDate;
                            var titleinner = '';

                            if (Approved == "1") {
                                if (ManagerName != "") {
                                    titleinner = "By " + ManagerName + ". ";
                                } else {
                                    titleinner = "Self Approved";
                                }
                                titleinner += " On " + UserApprovedDate;

                                if (alreadyapproved1 == "") {
                                    alreadyapproved1 += '<span style="cursor:pointer;" title="' + titleinner + '"><i class="fa fa-check mrg5R" style="color: #449d44;"></i>' + UserName + "</span>";
                                } else {
                                    alreadyapproved1 += ', <span style="cursor:pointer;" title="' + titleinner + '"><i class="fa fa-check mrg5R" style="color: #449d44;"></i>' + UserName + "</span>";
                                }

                                if (alreadyapproved == "") {
                                    alreadyapproved += UserName;
                                } else {
                                    alreadyapproved += ", " + UserName;
                                }
                            } else {
                                if (toapprove1 == "") {
                                    toapprove1 += '<i class="fa fa-times mrg5R" style="color: #E33747;"></i>' + UserName;
                                } else {
                                    toapprove1 += ', <i class="fa fa-times mrg5R" style="color: #E33747;"></i>' + UserName;
                                }

                                if (toapprove == "") {
                                    toapprove += UserName;
                                } else {
                                    toapprove += ", " + UserName;
                                }
                            }
                        }

                        // After the loop

                        if (AlreadyApprovedvr == "") {
                            AlreadyApprovedvr = 0;
                        }

                        if (parseInt(NumOfUserToAprv_Budget) > parseInt(AlreadyApprovedvr)) {
                            textstatusforapproval = ". Budget is not yet approved.";
                        } else {
                            textstatusforapproval = ". Budget was approved on " + DateWhenBudgetApproved + ".";
                            toapprove1 = "";
                        }

                        var totapp = parseInt(NumOfUserToAprv_Budget);
                        var widthAlreadyApproved = (100 / totapp) * AlreadyApprovedvr;
                        var widthNumOfUserToAprv_Budget = 100 - parseInt(widthAlreadyApproved);

                        if (alreadyapproved1.trim() != "" && parseInt(NumOfUserToAprv_Budget) > parseInt(AlreadyApprovedvr)) {
                            alreadyapproved1 += " | ";
                        }



                        var html = `
								<div class='col-sm-12'>
									<label>Sent for approval on ${SentForApprovalDate}${textstatusforapproval}</label>
									<div class='progress d-none'>
										<div class='progress-bar progress-bar-success' 
											title='${alreadyapproved}' 
											role='progressbar' 
											style='width:${parseInt(widthAlreadyApproved)}%'>
											${AlreadyApprovedvr} Has Approved (${alreadyapproved})
										</div>
										<div class='progress-bar progress-bar-warning' 
											title='${toapprove}' 
											role='progressbar' 
											style='width:${parseInt(widthNumOfUserToAprv_Budget)}%'>
											${parseInt(totapp) - parseInt(AlreadyApprovedvr)} To Approve (${toapprove})
										</div>
									</div>
								</div>
								<div class='col-sm-12'><strong>${alreadyapproved1}${toapprove1}</strong></div>
								`;

                    }
                    else if (tempData == "0") {
                        html = "Budget not yet submitted for approval.";

                    }
                    else {
                        $.notify.error('Error', data.ErrorMessages);
                    }
                    $('#budgetsentforapprovalyes').html(html);

                }

            });

        }
    }
    // #endregion
});