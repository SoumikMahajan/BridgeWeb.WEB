// on scroll add body class
document.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
});

// multiselect from
$(document).ready(function () {
  $(".multislct").multipleSelect({
    filter: true,
    showClear: true,
    placeholder: "Please Select",
    filterPlaceholder: "Enter Keyword",
  });
});

// Initialize CKEditor
document.addEventListener("DOMContentLoaded", function () {
  var textareas = document.querySelectorAll(".ckeditor");

  textareas.forEach(function (textarea) {
    ClassicEditor.create(textarea)
      .then((textarea) => {
        console.log("Editor was initialized", editor);
      })
      .catch((error) => {
        console.error("Error initializing editor", error);
      });
  });
});

// Project List Data table
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#project_list thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#project_list thead");

  var table = $("#project_list").DataTable({
    orderCellsTop: true,
    responsive: true,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      { className: "projectlist_textcenter", targets: [0, 1] },
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
            // For the first column, add a reset button
            $(cell).html(
              '<button class="reset-btn btn btn-default">Reset</button>'
            );
            $(cell)
              .find(".reset-btn")
              .on("click", function () {
                // Reset the search input for the first column
                var searchInput = $(
                  "input",
                  $(".filters th").eq($(api.column(colIdx).header()).index())
                );
                searchInput.val("").trigger("keyup");
              });
          } else {
            // For other columns, add input elements
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
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
    },
  });
});

// Contact List Data table
$(document).ready(function () {
  // Setup - add a text input or select input to each footer cell
  $("#contact_list thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#contact_list thead");

  var table = $("#contact_list").DataTable({
    orderCellsTop: true,
    responsive: true,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      { className: "dt-body-center", targets: [0, 2] },
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
            // For the first column, add a reset button
            $(cell).html(
              '<button class="reset-btn btn btn-default">Reset</button>'
            );
            $(cell)
              .find(".reset-btn")
              .on("click", function () {
                // Reset the search input for the first column
                var searchInput = $(
                  "input",
                  $(".filters th").eq($(api.column(colIdx).header()).index())
                );
                searchInput.val("").trigger("keyup");
              });
          } else if (colIdx === 1) {
            // For the second column, add select inputs with specific options
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Inactive- System-User">Inactive System User</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          } else if (colIdx === 2) {
            // For the third column, add select inputs with specific options
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          } else {
            // For other columns, add text inputs
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
            );
          }

          // On every keypress in text input
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
  });
});

// Vendor List Data table
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#vendor_table thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#vendor_table thead");

  var table = $("#vendor_table").DataTable({
    orderCellsTop: true,
    responsive: false,
    scrollX: true,
    columnDefs: [
      { width: "20%", targets: [0, 1, 3] },
      { width: "25%", targets: 2 },
      { width: "15%", targets: 4 },
      { className: "dt-head-nowrap", targets: "_all" },
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

          $(cell).html(
            '<input type="text" class="form-control search_fld" placeholder="' +
            title +
            '" />'
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
  });
});


// Popover init
$(document).ready(function () {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
});

// line itmes datatable
$(document).ready(function () {
  // Setup - add a text input or select input to each footer cell
  $("#line_table thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#line_table thead");

  $("#line_table").DataTable({
    paging: false,
    searching: false,
    fixedHeader: true,
    scrollX: true,
    fixedHeader: {
      headerOffset: $("#main-navbar").outerHeight(),
      //   headerOffset: 50,
    },
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      //   { width: "220px", targets: [0,1,2] },
      { className: "line_firstcol", targets: 0 },
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
            // For the first column, add a reset button
            $(cell).html(
              '<button class="reset-btn btn btn-default">Reset</button>'
            );
            $(cell)
              .find(".reset-btn")
              .on("click", function () {
                // Reset the search input for the first column
                var searchInput = $(
                  "input",
                  $(".filters th").eq($(api.column(colIdx).header()).index())
                );
                searchInput.val("").trigger("keyup");
              });
          } else if (colIdx === 1) {
            // For the second column, add select inputs with specific options
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Inactive- System-User">Inactive System User</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          } else if (colIdx === 2) {
            // For the third column, add select inputs with specific options
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          } else {
            // For other columns, add text inputs
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
            );
          }

          // On every keypress in text input
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
  });
});

// budget modal table
$(document).ready(function () {
  $("#budget_hist_table").DataTable({
    paging: true,
    searching: true,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// table zoom function
function magnifydiv(mode) {
  var zoomval = 0;
  if (
    $("#line_table_wrapper").attr("data-zoomval") == undefined ||
    $("#line_table_wrapper").attr("data-zoomval") == ""
  ) {
    zoomval = 1.0;
  } else {
    zoomval = parseFloat($("#line_table_wrapper").attr("data-zoomval"));
  }
  if (mode == "in") {
    zoomval += 0.1;
  } else {
    zoomval -= 0.1;
  }
  if (zoomval > 1) {
    zoomval = 1;
  }
  if (zoomval <= 0.6) {
    zoomval = 0.6;
  }
  $("#line_table_wrapper").css("zoom", zoomval);
  $("#line_table_wrapper").attr("data-zoomval", zoomval);
}

// invoice list datatable
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#inv_list_tab thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#inv_list_tab thead");

  var table = $("#inv_list_tab").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
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
            '<input type="text" class="form-control" placeholder="' +
            title +
            '" />'
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
  });
});

// payment list datatable
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#payment_list thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#payment_list thead");

  var table = $("#payment_list").DataTable({
    orderCellsTop: true,
    searching: false,
    // ordering: false,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      { targets: 0, orderable: false },
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
            $(cell).html("");
          } else if (colIdx === 9) {
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Void">Void</option><option value="Pending">Pending</option><option value="Posted">Posted</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          } else {
            // For other columns, add input elements
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
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
    },
  });
});

// Invoice selector table list datatable
$(document).ready(function () {
  var table = $("#inv_selector").DataTable({
    orderCellsTop: true,
    searching: false,
    // ordering: false,
    scrollX: true,
    columnDefs: [
      { targets: 0, orderable: false },
      { className: "dt-head-nowrap", targets: "_all" },
    ],
  });
});

// PO selector table list datatable
$(document).ready(function () {
  var table = $("#po_selector").DataTable({
    orderCellsTop: true,
    // info: false,
    paging: false,
    scrollX: true,
    columnDefs: [
      { targets: 0, orderable: false },
      { className: "dt-head-nowrap", targets: "_all" },
    ],
  });
});

// Item selector table list datatable
$(document).ready(function () {
  var table = $("#item_selector").DataTable({
    orderCellsTop: true,
    // info: false,
    searching: false,
    paging: false,
    scrollX: true,
    columnDefs: [
      { targets: 0, orderable: false },
      { className: "dt-head-nowrap", targets: "_all" },
    ],
  });
});

// Invoice items table list datatable
$(document).ready(function () {
  var table = $("#invoice_items").DataTable({
    orderCellsTop: true,
    info: false,
    paging: false,
    scrollX: true,
    orderable: false,
    searching: false,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// invoice term table
$(document).ready(function () {
  var table = $("#invoice_term_tabl").DataTable({
    orderCellsTop: true,
    searching: false,
    paging: false,
    info: false,
    scrollX: true,
    ordering: false,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// classification table
$(document).ready(function () {
  var table = $("#classification_tabl").DataTable({
    orderCellsTop: true,
    scrollCollapse: true,
    scroller: true,
    scrollY: 400,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// shipment method table
$(document).ready(function () {
  var table = $("#ship_method_table").DataTable({
    orderCellsTop: true,
    scrollCollapse: true,
    scroller: true,
    scrollY: 400,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// favrication approval table
$(document).ready(function () {
  var table = $("#fav_appr_table").DataTable({
    orderCellsTop: true,
    scrollCollapse: true,
    scroller: true,
    scrollY: 400,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// classification table
$(document).ready(function () {
  var table = $("#pay_scdl").DataTable({
    orderCellsTop: true,
    scrollCollapse: true,
    scroller: true,
    scrollY: 400,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// invoice_term table
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#invoice_term thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#invoice_term thead");

  var table = $("#invoice_term").DataTable({
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 400,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
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
              '<button type="button" class="porde_list_reset_btn">Reset</button>'
            );
          }
          else if (colIdx === 1) {
            var select = $(
              '<input type="text" class="form-control"></input>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
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
    },
  });
});

// combobox js
$(function () {
  $.widget("custom.combobox", {
    _create: function () {
      this.wrapper = $("<span>")
        .addClass("custom-combobox")
        .insertAfter(this.element);

      this.element.hide();
      this._createAutocomplete();
      this._createShowAllButton();
    },

    _createAutocomplete: function () {
      var selected = this.element.children(":selected"),
        value = selected.val() ? selected.text() : "";

      this.input = $("<input>")
        .appendTo(this.wrapper)
        .val(value)
        .attr("title", "")
        .addClass(
          "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left"
        )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: this._source.bind(this),
        })
        .tooltip({
          classes: {
            "ui-tooltip": "ui-state-highlight",
          },
        });

      this._on(this.input, {
        autocompleteselect: function (event, ui) {
          ui.item.option.selected = true;
          this._trigger("select", event, {
            item: ui.item.option,
          });
        },

        autocompletechange: "_removeIfInvalid",
      });
    },

    _createShowAllButton: function () {
      var input = this.input,
        wasOpen = false;

      $("<a>")
        .attr("tabIndex", -1)
        .attr("title", "Show All Items")
        .tooltip()
        .appendTo(this.wrapper)
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s",
          },
          text: false,
        })
        .removeClass("ui-corner-all")
        .addClass("custom-combobox-toggle ui-corner-right")
        .on("mousedown", function () {
          wasOpen = input.autocomplete("widget").is(":visible");
        })
        .on("click", function () {
          input.trigger("focus");

          // Close if already visible
          if (wasOpen) {
            return;
          }

          // Pass empty string as value to search for, displaying all results
          input.autocomplete("search", "");
        });
    },

    _source: function (request, response) {
      var matcher = new RegExp(
        $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        this.element.children("option").map(function () {
          var text = $(this).text();
          if (this.value && (!request.term || matcher.test(text)))
            return {
              label: text,
              value: text,
              option: this,
            };
        })
      );
    },

    _removeIfInvalid: function (event, ui) {
      // Selected an item, nothing to do
      if (ui.item) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children("option").each(function () {
        if ($(this).text().toLowerCase() === valueLowerCase) {
          this.selected = valid = true;
          return false;
        }
      });

      // Found a match, nothing to do
      if (valid) {
        return;
      }

      // Remove invalid value
      this.input
        .val("")
        .attr("title", value + " didn't match any item")
        .tooltip("open");
      this.element.val("");
      this._delay(function () {
        this.input.tooltip("close").attr("title", "");
      }, 2500);
      this.input.autocomplete("instance").term = "";
    },

    _destroy: function () {
      this.wrapper.remove();
      this.element.show();
    },
  });

  $(".mySelect").combobox();
  $("#toggle").on("click", function () {
    $("#combobox").toggle();
  });
});

// purchase order datatable
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#purchs_ordr_tab thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#purchs_ordr_tab thead");

  var table = $("#purchs_ordr_tab").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      { width: "100px", targets: 0 },
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
              '<button type="button" class="porde_list_reset_btn">Reset</button>'
            );
          } else {
            // For other columns, add input elements
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
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
    },
  });
});

// User list datatable
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#user_list_table thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#user_list_table thead");

  var table = $("#user_list_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
      { className: "dt-center", targets: [1, 2] },
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
              '<button type="button" class="porde_list_reset_btn">Reset</button>'
            );
          }
          else if (colIdx === 1) {
            var select = $(
              '<select class="form-select"><option value="">All</option><option value="Active">Active</option><option value="Deactive">Deactive</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          }
          else if (colIdx === 6) {
            var select = $(
              '<select class="form-select"><option value="">All</option> <option value="Administrator">Administrator</option><option value="Buyer">Buyer</option><option value="Client/Operator">Client/Operator</option> <option value="Consultant">Consultant</option><option value="Accountant">Accountant</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          }
          else if (colIdx === 7) {
            var select = $(
              '<select class="form-select"><option value="">All</option><option>Yes</option><option>No</option></select>'
            )
              .appendTo($(cell))
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());

                api
                  .column(colIdx)
                  .search(val ? "^" + val + "$" : "", true, false)
                  .draw();
              });
          }
          else {
            // For other columns, add input elements
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
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
    },
  });
});


// delete purchase order table
$(document).ready(function () {
  var table = $("#del_po_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [
      { className: "dt-head-nowrap", targets: "_all" },
    ],
  });
})


// jquery shortable
$(function () {
  $("#sortable").sortable();
});

// datepicker js
$(function () {
  $(".datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

// // show loder
function showLoader() {
  const loader = document.getElementById("global_loader");
  loader.style.display = "flex"; // Make the loader visible
}

function hideLoaderAfterDelay(delay) {
  setTimeout(() => {
    const loader = document.getElementById("global_loader");
    loader.style.display = "none"; // Hide the loader
  }, delay);
}

window.addEventListener("load", () => {
  showLoader(); // Show the loader
  hideLoaderAfterDelay(4000); // Hide it after 4 seconds
});

// pdt breakdown table
$(document).ready(function () {
  var table = $("#pdt-breakdown").DataTable({
    searching: false,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// po comment list table
$(document).ready(function () {
  var table = $("#poCommentList").DataTable({
    searching: false,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// team members table
$(document).ready(function () {
  var table = $("#teamMemberTable").DataTable({
    searching: true,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
  });
});

// purchase order history table
$(document).ready(function () {
  var table = $("#po_history_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [
      {
        className: "dt-head-nowrap dt-head-left dt-body-left",
        targets: "_all",
      },
      {
        className: "dt-nowrap",
        targets: [0, 1],
      },
    ],
  });
});

// line items table
$(document).ready(function () {
  var table = $("#line_item_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [
      {
        className: "dt-head-nowrap",
        targets: "_all",
      },
    ],
  });
});

// history table
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#history_table thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#history_table thead");

  var table = $("#history_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
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
              '<button type="button" class="new_resetbtn">Reset</button>'
            );
          } else {
            // For other columns, add input elements
            $(cell).html(
              '<input type="text" class="form-control" placeholder="' +
              title +
              '" />'
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
    },
  });
});

// history detail modal
$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#historydetails_table thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#historydetails_table thead");

  var table = $("#historydetails_table").DataTable({
    orderCellsTop: true,
    scrollX: true,
    columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
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
            '<input type="text" class="form-control" placeholder="' +
            title +
            '" />'
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
  });
});

// check uncheck function
let project_check = document.querySelectorAll(".project_check");
let vendor_check = document.querySelectorAll(".vendor_check");
let budget_check = document.querySelectorAll(".budget_check");
let po_check = document.querySelectorAll(".po_check");
let exp_chk = document.querySelectorAll(".exp_chk");
let account_chk = document.querySelectorAll(".account_chk");
let report_chk = document.querySelectorAll(".report_chk");
let user_check = document.querySelectorAll(".user_check");

let allChecklist = document.querySelectorAll(".check_wrp input");
let allChecklist2 = document.querySelectorAll(".check_list input");

let uncheckBtn = document.getElementById("uncheck");
let checkBtn = document.getElementById("check");

// for uncheck all checkBox
uncheckBtn.addEventListener("click", () => {
  allChecklist.forEach((e) => {
    e.checked = false;
  });
});

// for Check all checkBox
checkBtn.addEventListener("click", () => {
  allChecklist2.forEach((e) => {
    e.checked = true;
  });
});

function isChecked(inputBox) {
  if (inputBox.value === "project" && inputBox.checked == true) {
    project_check.forEach((element) => {
      element.checked = true;
    });
  } else {
    project_check.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked2(inputBox) {
  if (inputBox.value === "vendor" && inputBox.checked == true) {
    vendor_check.forEach((element) => {
      element.checked = true;
    });
  } else {
    vendor_check.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked3(inputBox) {
  if (inputBox.value === "budget" && inputBox.checked == true) {
    budget_check.forEach((element) => {
      element.checked = true;
    });
  } else {
    budget_check.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked4(inputBox) {
  if (inputBox.value === "po" && inputBox.checked == true) {
    po_check.forEach((element) => {
      element.checked = true;
    });
  } else {
    po_check.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked5(inputBox) {
  if (inputBox.value === "expedit" && inputBox.checked == true) {
    exp_chk.forEach((element) => {
      element.checked = true;
    });
  } else {
    exp_chk.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked6(inputBox) {
  if (inputBox.value === "account" && inputBox.checked == true) {
    account_chk.forEach((element) => {
      element.checked = true;
    });
  } else {
    account_chk.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked7(inputBox) {
  if (inputBox.value === "reporting" && inputBox.checked == true) {
    report_chk.forEach((element) => {
      element.checked = true;
    });
  } else {
    report_chk.forEach((element) => {
      element.checked = false;
    });
  }
}

function isChecked8(inputBox) {
  if (inputBox.value === "user" && inputBox.checked == true) {
    user_check.forEach((element) => {
      element.checked = true;
    });
  } else {
    user_check.forEach((element) => {
      element.checked = false;
    });
  }
}

// open index page
function openWin() {
  window.open("index.html");
}

// open project team page
function openProjectTeam() {
  location.href = "ProjectTeam.html";
}

// open edit project page
function openEditProject() {
  location.href = "EditProject.html";
}

// open task manager page
function openTaskManager() {
  location.href = "Taskmanager.html";
}

// open purchase order history page
function openPOHistory() {
  location.href = "PurchaseOrderHistory.html";
}
// deleted purchase order page
function delPOpage() {
  location.href = "DeletePurchaseOrder.html";
}
// deleted purchase order page
function searchPurchaseOrder() {
  location.href = "SearchPurchaseOrder.html";
}

// referesh task
function refreshtask() {
  $("#refreshtask").addClass("fa-spin");
  window.setTimeout(function () {
    $("#refreshtask").removeClass("fa-spin");
  }, 1000);
}

// // table action panel funcions

// let downloadOrder = document.getElementById('odr_download');
// let sendApproval = document.getElementById('send_approval');
// let sendMail = document.getElementById('send_mail');

// let btn_sendbatchapproval = document.getElementById('btn_sendbatchapproval');
// let btn_sendbatchvendor = document.getElementById('btn_sendbatchvendor');
// let btn_sendbatchatt = document.getElementById('btn_sendbatchatt');

// $(document).ready(function () {
//   let download = document.querySelectorAll('.fa-download')

//   console.log(download);
// });



function EditVendorContacts() {
	location.href = "EditVendorContacts.html";
}
// back to ContactList page
function ContactList() {
	location.href = "ContactList.html";
}


/*added Date-08-08-2024*/

// All vendor datatable modal
//$(document).ready(function () {
//	// Setup - add a text input to each footer cell
//	$("#all_vendor_modalTable thead tr")
//		.clone(true)
//		.addClass("filters")
//		.appendTo("#all_vendor_modalTable thead");

//	var table = $("#all_vendor_modalTable").DataTable({
//		orderCellsTop: true,
//		responsive: true,
//		scrollX: true,
//		searching: true,
//		paging: true,
//		// bLengthChange: false,

//		columnDefs: [{ className: "dt-head-nowrap", targets: "_all" }],
//		initComplete: function () {
//			var api = this.api();

//			// For each column
//			api
//				.columns()
//				.eq(0)
//				.each(function (colIdx) {
//					// Set the header cell to contain the input element
//					var cell = $(".filters th").eq(
//						$(api.column(colIdx).header()).index()
//					);
//					var title = $(cell).text();

//					// On every keypress in this input
//					$(
//						"input",
//						$(".filters th").eq($(api.column(colIdx).header()).index())
//					)
//						.off("keyup")
//						.on("keyup", function () {
//							// Get the search value
//							$(this).attr("title", $(this).val());
//							var regexr = "({search})";

//							// Search the column for that value
//							api
//								.column(colIdx)
//								.search(
//									this.value !== ""
//										? regexr.replace("{search}", "(((" + this.value + ")))")
//										: "",
//									this.value !== "",
//									this.value === ""
//								)
//								.draw();
//						});
//				});
//		},
//	});
//});


/* ---> end Date -08 -08 - 2024*/