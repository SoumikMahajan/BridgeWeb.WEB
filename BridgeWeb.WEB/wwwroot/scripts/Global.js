const _BaseURL = window.location.origin;
const currentlocation = window.location.href;
const _QueryParameter = window.location.pathname.split('/');
const actionName = _QueryParameter[2] || '';

// Global preference store
window._UserPreferences = {};

const styles = [
    'background: linear-gradient(#204d74, #7792a8)'
    , 'border: 1px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 20px'
].join(';');

console.log('%c Thank you for using The Bridge By Tcg.', styles);
console.log('%c This console is used by developers for development purpose, please avoid writing codes here to avoid malfunction of Website.', styles);

$(function () {
    initializeApp();
});

async function initializeApp() {
    try {
        $(".loader").css("display", "flex");
        const _ActionName = actionName.toLowerCase();
        const isExcluded = ['forgetpassword', 'index', 'resetpassword', 'useractivation', 'otpverification', 'error'].includes(_ActionName);
        if (!isExcluded && currentlocation !== _BaseURL + "/") {
            await SetUserUrl();
            window._UserPreferences = await GetUserPreference();
        }
        //window._UserPreferences = await GetUserPreference();
        $(document).trigger("UserPreferencesReady");
    } catch (err) {
        console.error("An error occurred in Global.js:", err);
        $.notify.error('Error', 'Failed to initialize user context');
    } finally {
        $(".loader").css("display", "none");
    }
}

function SetUserUrl() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: _BaseURL + "/Home/SetUserUrl",
            type: 'POST',
            data: { currentlocation },
            dataType: 'json',
            success: function (response) {

                if (response.IsSuccess) {
                    MenuBuild().then(resolve).catch(reject);
                }
                else {
                    resolve();
                    $.notify.error('Error', response.ErrorMessages);
                }
            },
            error: function (error) {
                $.notify.error('Error', error);
                reject(error);
            }
        });
    });
}

function MenuBuild() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/Home/MenuBuilder",
            type: 'GET',
            dataType: 'html',
            beforeSend: function () {
                $(".loader").css("display", "flex");
            },
            success: function (response) {
                $("#menuBuild").html(response || '');
                resolve();
            },
            error: function (xhr, status, error) {
                $.notify.error('Error', error);
                reject(error);
            },
            complete: function () {
                $(".loader").css("display", "none");
            }
        });
    });
}

function GetUserPreference() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Home/GetUserPreferences',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.IsSuccess) {
                    const prefs = {};
                    data.Result.forEach(p => prefs[p.preferenceKey] = p.preferenceValue);
                    //console.log("Final preferences object:", prefs);
                    resolve(prefs);
                } else {
                    reject("Preference load failed");
                }
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function SetProjectPreference(preferences) {
    $.ajax({
        url: '/Home/SetUserPreferences',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(preferences),

        success: function (data) {
            if (!data.IsSuccess) {
                $.notify.error('Error', data.ErrorMessages);
            }
            else {
                const prefs = {};
                preferences.forEach(p => prefs[p.PreferenceKey] = p.PreferenceValue);
                window._UserPreferences = prefs;
            }
        },
        error: function (error) {
            console.error('Error saving user preference:', error);
        }
    });
}

$.ajaxSetup({
    statusCode: {
        401: handleAuthRedirect,
        403: handleAuthRedirect
    },
    error: handleAjaxError
});
function handleAuthRedirect(xhr) {
    try {
        const response = JSON.parse(xhr.responseText);
        $.notify.error('Error', response.message || "Something went wrong. Redirecting...");
        window.location.href = response.redirectUrl || '/Home/Index';
    } catch (e) {
        console.warn("Auth redirect JSON parsing failed", e);
        window.location.href = '/Home/Index';
    }
}

function handleAjaxError(xhr, status, error) {
    $(".loader").css("display", "none");

    if (xhr.status === 401 || xhr.status === 403) return;

    let errorMessage = "Something went wrong.";

    if (xhr.status === 0) {
        errorMessage = "Cannot connect to the server";
    } else {
        try {
            const response = JSON.parse(xhr.responseText);
            if (response?.ErrorMessages) {
                errorMessage = response.ErrorMessages;
            }
            else if (response?.message)
            {
                errorMessage = response?.message;
            }
            else if (xhr.statusText) {
                errorMessage = xhr.statusText;
            }
        } catch {
            errorMessage = error || xhr.statusText || "Unexpected error occurred.";
        }
    }

    $.notify.error('Error', errorMessage);
    console.error(`[AJAX Error] ${xhr.status}: ${errorMessage}`);
}


(function ($) {


    //Global System Notifications
    $.notify = function (type, title, message, options) {
        var settings = $.extend({
            duration: 4000,
            position: 'topRight'
        }, options);

        var icons = {
            success: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
            error: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
            warning: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
            info: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        };

        var $container = $('#toastContainer');

        var $toast = $('<div>', {
            class: 'toast ' + type,
            html: `
                        <div class="toast-icon">${icons[type]}</div>
                        <div class="toast-content">
                            <div class="toast-title">${title}</div>
                            <div class="toast-message">${message}</div>
                        </div>
                        <button class="toast-close">
                            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <div class="toast-progress"></div>
                    `
        });

        $container.append($toast);

        // Trigger animation
        setTimeout(function () {
            $toast.addClass('show');
        }, 10);

        // Animate progress bar
        var $progress = $toast.find('.toast-progress');
        var remainingTime = settings.duration;
        var startTime = Date.now();
        var animationFrame;
        var autoRemoveTimeout;
        var isPaused = false;

        function startProgress() {
            isPaused = false;
            startTime = Date.now();

            // Animate progress bar
            $progress.stop(true).animate({
                width: '0%'
            }, remainingTime, 'linear');

            // Auto remove after duration
            autoRemoveTimeout = setTimeout(function () {
                removeToast($toast);
            }, remainingTime);
        }

        function pauseProgress() {
            if (isPaused) return;
            isPaused = true;

            // Calculate remaining time
            var elapsed = Date.now() - startTime;
            remainingTime = Math.max(0, remainingTime - elapsed);

            // Stop animations
            $progress.stop(true);
            clearTimeout(autoRemoveTimeout);
        }

        function resumeProgress() {
            if (!isPaused) return;
            startProgress();
        }

        $toast.on('mouseenter', function () {
            pauseProgress();
        });

        $toast.on('mouseleave', function () {
            resumeProgress();
        });

        startProgress();

        $toast.find('.toast-close').on('click', function () {
            clearTimeout(autoRemoveTimeout);
            removeToast($toast);
        });

        function removeToast($element) {
            clearTimeout(autoRemoveTimeout);
            $element.addClass('removing');
            setTimeout(function () {
                $element.remove();
            }, 300);
        }

        return $toast;
    };

    // Convenience methods
    $.notify.success = function (title, message, options) {
        return $.notify('success', title, message, options);
    };

    $.notify.error = function (title, message, options) {
        return $.notify('error', title, message, options);
    };

    $.notify.warning = function (title, message, options) {
        return $.notify('warning', title, message, options);
    };

    $.notify.info = function (title, message, options) {
        return $.notify('info', title, message, options);
    };

    //Global System Confirmation Dialog

    $.confirm = function (options) {
        var settings = $.extend({
            title: 'Confirm',
            message: 'Are you sure?',
            type: 'confirm', // confirm, warning, danger
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: function () { },
            onCancel: function () { }
        }, options);

        var icons = {
            confirm: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            warning: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
            danger: '<svg fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
        };

        // Create overlay and dialog
        var $overlay = $('<div>', {
            class: 'confirm-overlay',
            html: `
                        <div class="confirm-dialog type-${settings.type}">
                            <div class="confirm-header">
                                <div class="confirm-icon">${icons[settings.type]}</div>
                                <div class="confirm-title">${settings.title}</div>
                            </div>
                            <div class="confirm-body">
                                <div class="confirm-message">${settings.message}</div>
                            </div>
                            <div class="confirm-footer">
                                <button class="confirm-btn confirm-btn-cancel">${settings.cancelText}</button>
                                <button class="confirm-btn confirm-btn-confirm">${settings.confirmText}</button>
                            </div>
                        </div>
                    `
        });

        // Append to body
        $('body').append($overlay);

        // Show with animation
        setTimeout(function () {
            $overlay.addClass('show');
        }, 10);

        // Handle cancel
        $overlay.find('.confirm-btn-cancel').on('click', function () {
            closeDialog();
            settings.onCancel();
        });

        // Handle confirm
        $overlay.find('.confirm-btn-confirm').on('click', function () {
            closeDialog();
            settings.onConfirm();
        });

        // Close on overlay click - REMOVED (user must click a button)
        // $overlay.on('click', function(e) {
        //     if ($(e.target).hasClass('confirm-overlay')) {
        //         closeDialog();
        //         settings.onCancel();
        //     }
        // });

        // Close on ESC key - REMOVED (user must click a button)
        // $(document).on('keydown.confirm', function(e) {
        //     if (e.key === 'Escape') {
        //         closeDialog();
        //         settings.onCancel();
        //     }
        // });

        function closeDialog() {
            $overlay.removeClass('show');
            setTimeout(function () {
                $overlay.remove();
            }, 300);
        }

        return {
            close: closeDialog
        };
    };


})(jQuery);

function notify(IsSuccess, Title, IsValid, position, timeout) {
    if (IsSuccess) {
        $.notify.success('Success', Title, { duration: timeout || 4000 });
    } else {
        if (IsValid) {
            $.notify.error('Error', Title, { duration: timeout || 4000 });
        } else {
            $.notify.warning('Caution', Title, { duration: timeout || 4000 });
        }
    }
}


function showConfirmationDialog(title, message, confirmCallback, cancelCallback) {


    let modalContent = document.querySelector('.modal-content');

    iziToast.show({
        title: title,
        message: message,
        timeout: 10000,
        buttons: [
            ['<button>Yes</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                if (confirmCallback) {
                    confirmCallback();
                }
            }, true],
            ['<button>No</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                if (cancelCallback) {
                    cancelCallback();
                }
            }]
        ],
        overlay: true,
        close: false,
        timeout: false, // disables auto-close
        pauseOnHover: true,
        position: 'topCenter',
        onOpening: function (instance, toast) {
            if (modalContent) {
                $('.modal-content').find('input, button, select, textarea').prop('disabled', true);
            }


        },
        onClosing: function (instance, toast, closedBy) {
            if (modalContent) {
                $('.modal-content').find('input, button, select, textarea').prop('disabled', false);
            }
        }
    });
}


function errorfunc(obj, message) {
    $('#' + obj).attr('placeholder', message);
    $('#' + obj).effect("shake", { times: 2 }, 700);
    $('#' + obj).trigger("focus");
}


/*Custome Date Picker*/
//(function ($) {
//    $.fn.datepickercustom = function (options) {

//        return this.each(function () {
//            options.dateFormat = 'yy.mm.dd';

//            $(this).datepicker(options);
//            $(this).removeAttr('onkeypress');
//            $(this).removeAttr('onkeyup');

//            $(this).attr('onkeyup', 'datevalidatekeyup(event,this);');
//            $(this).attr('onblur', 'makevaliddate(event,this);');
//        });
//    };
//})(jQuery);
(function ($) {
    $.fn.datepickercustom = function (options) {
        return this.each(function () {
            options.dateFormat = 'yy.mm.dd';

            $(this).datepicker(options);
            $(this).removeAttr('onkeypress');
            $(this).removeAttr('onkeyup');

            $(this).attr('onkeyup', 'datevalidatekeyup(event,this);');
            $(this).attr('onblur', 'makevaliddate(event,this);');

            $(this).on('change', function (e) {
                makevaliddate(e, this);
            });
        });
    };
})(jQuery);

function makevaliddate(e, obj) {
    let d = $(obj).val();
    if (d.trim() == "") {
        return;
    }
    let isok = false;
    if (d.split('.').length == 3) {
        let year = d.split('.')[0];
        let month = parseInt(d.split('.')[1]) - 1;
        let day = d.split('.')[2];
        isok = isValidDate(year, month, day);
    }
    if (!isok) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (parseInt(dd) < 10) { dd = "0" + dd; }
        if (parseInt(mm) < 10) { mm = "0" + mm; }


        $(obj).val(yyyy + '.' + mm + '.' + dd);
    }
    else {
        let today = new Date(d);

        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (parseInt(dd) < 10) { dd = "0" + dd; }
        if (parseInt(mm) < 10) { mm = "0" + mm; }
        $(obj).val(yyyy + '.' + mm + '.' + dd);
    }
    $(obj).removeClass('errorClass');
}

function datevalidatekeyup(e, obj) {
    let d = $(obj).val();
    let isok = false;
    if (d.split('.').length == 3) {
        let year = d.split('.')[0];
        let month = parseInt(d.split('.')[1]) - 1;
        let day = d.split('.')[2];
        isok = isValidDate(year, month, day);
    }
    if (!isok) { $(obj).addClass('errorClass'); }
    else { $(obj).removeClass('errorClass'); }
}

function isValidDate(year, month, day) {
    source_date = new Date(year, month, day);
    if (year != source_date.getFullYear()) {
        return false;
    }
    if (month != source_date.getMonth()) {
        return false;
    }
    if (day != source_date.getDate()) {
        return false;
    }
    return true;
}


//GLOBAL AJAX FUNCTION
function globalAjax(url, methodType = "GET", data = {}, dataType = "text", processData = true, contentTypeHeader = true, async = true, cache = true) {
    let type = typeof (data);
    let contentType = "application/x-www-form-urlencoded"
    if (type === "string") {
        contentType = "application/json"
    }
    //console.log(contentType);

    return $.ajax({
        url: url,
        type: methodType,
        async: async,
        cache: cache,
        processData: processData,
        contentType: contentTypeHeader ? contentType : false,
        data: data,
        dataType: dataType,
        beforeSend: function () {
            $(".loader").css("display", "flex");
        },
    }).then(
        function (response) {
            const json = JSON.parse(response);
            if (json.IsSuccess) {
                return {
                    IsSuccess: true,
                    Result: json.Result,
                    Errors: null
                };
            }
            else {
                return {
                    IsSuccess: false,
                    Result: null,
                    Errors: json.ErrorMessages
                };
            }
        },
        function (jqXHR, textStatus, errorThrown) {
            const errors = {
                StatusText: textStatus,
                ErrorMessage: errorThrown,
                ResponseText: jqXHR.responseText
            };
            console.error(errors);
            return {
                IsSuccess: false,
                Result: null,
                Errors: jqXHR.ResponseText + " " + errorThrown
            };
        }
    );
}

function globalHtmlAjax(url, methodType = "GET", data = {}, dataType = "html", processData = true, contentTypeHeader = true, async = true, cache = true) {
    let type = typeof (data);
    let contentType = "application/x-www-form-urlencoded"
    if (type === "string") {
        contentType = "application/json"
    }

    return $.ajax({
        url: url,
        type: methodType,
        async: async,
        cache: cache,
        processData: processData,
        contentType: contentTypeHeader ? contentType : false,
        data: data,
        dataType: dataType,
        beforeSend: function () {
            $(".loader").css("display", "flex");
        },
    }).then(
        function (response) {
            return {
                IsSuccess: true,
                Result: response,
                Errors: null
            };
        },
        function (jqXHR, textStatus, errorThrown) {
            const errors = {
                StatusText: textStatus,
                ErrorMessage: errorThrown,
                ResponseText: jqXHR.responseText
            };
            console.log(errors)
            return {
                IsSuccess: false,
                Result: null,
                Errors: jqXHR.ResponseText + " " + errorThrown
            };
        }
    );
}

function SyncQBSAccount() {

    return $.ajax({
        url: `${_BaseURL}/Quickbook/UpdateAccountsQBS`,
        type: 'GET',
        dataType: 'json'
    });

    // globalAjax(url, 'GET', {}, 'text', true, true, false, false).then(function (data) {
    //     result = data.Result;
    //     $(".loader").css("display", "none");
    // }).fail(function (err) {
    //     result = err.responseText;
    //     console.error(err);
    // });
}

//tooltip
const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

//globalreplaceall
replaceAll = function (str, search, replacement) {
    var target = str;
    return target.split(search).join(replacement);
};

function setCookie(name, value, days = 1, path = '/', secure = true, sameSite = 'Strict') {
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);

    const cookieExists = document.cookie
        .split('; ')
        .some(cookie => cookie.startsWith(`${encodedName}=`));

    if (cookieExists) {
        document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }

    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));

    let cookie = `${encodedName}=${encodedValue}; expires=${d.toUTCString()}; path=${path}`;
    if (secure) cookie += '; Secure';
    if (sameSite) cookie += `; SameSite=${sameSite}`;

    document.cookie = cookie;
}

function getCookie(name) {
    const decodedName = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(decodedName)) {
            return decodeURIComponent(cookie.substring(decodedName.length));
        }
    }
    return "";
}

function deleteCookie(name, path = '/') {
    const encodedName = encodeURIComponent(name);

    const cookieExists = document.cookie
        .split('; ')
        .some(cookie => cookie.startsWith(`${encodedName}=`));

    if (cookieExists) {
        document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }
}

$(document).on('keyup', '.floatonly', function (eve) {

    var val = $(this).val();

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

});

$(document).on('keydown', '.floatonly', function (eve) {

    var val = $(this).val();

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

});


$(document).on('keypress', '.floatonly', function (eve) {

    if ((eve.which != 46 || $(this).val().indexOf('.') != -1) && (eve.which < 48 || eve.which > 57)) {
        eve.preventDefault();
    }

    $(document).on('keyup', '.floatonly', function (eve) {

        if ($(this).val().indexOf('0') == 0 && $(this).val().length > 1) {

            if ($(this).val().indexOf('0.') == -1) {
                $(this).val($(this).val().substring(1));
            }
        }
        if ($(this).val().indexOf('.') == 0) {
            $(this).val($(this).val().substring(1));

        }
        if (isNaN($(this).val())) {
            $(this).val(0);
        }

        if ($(this).val().length == 0) {
            $(this).val(0);
        }

    });

});

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


$(document).on('keyup', ".postalcode", function (e) {
    $(this).val($(this).val().toUpperCase());
});

function IsNumber(e) {
    var keyCode = e.which ? e.which : e.keyCode
    if ((keyCode > 47 && keyCode < 58) || (keyCode == 8) || (keyCode == 46)) {
        return true;
    }
    else {
        $.notify.warning('Caution', 'Use Only Numeric value');
        return false;
    }
}

$(document).on('blur', '.phonenumber', function (e) {
    var obj = e.target;
    var str = $(obj).val();
    var patt = /^[+]?[0-9]{0,3}[- ]?\(?([0-9]{3,5})\)?([ .-]?)([0-9]{3})\2([0-9]{4,5})$/g;
    var res = patt.test(str);
    if (!res) {
        $(obj).css('background', 'rgb(238, 241, 234)');
        $(obj).css('color', 'red');
    }
    else {
        $(obj).css('background', 'none');
        $(obj).css('color', '#555');

    }
});

$(document).on('paste', "input:text", function () {
    var input = $(this);
    setTimeout(function () {
        input.val($.trim(input.val()));
    }, 0);
});

document.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});

$(document).on('click', ".master_gotourl", function () {
    var url = $(this).data("hrefurl");
    if (url != "") {
        window.location.href = url;
    }
});

$(document).on("click", "#OpnFeedBack", function () {
    $("#feedback_mdl").modal("show");
});

$(document).on("click", "#feedbackBtn", function () {

    var sub = $("#feebBackSub option:selected").val();
    var body = $("#feedbackBody").val().trim();
    var page = window.location.href;

    if (sub == "" || sub == null || sub == undefined) {
        $.notify.warning('Caution', 'Please select subject');
        return;
    }

    if (body == "") {
        $.notify.warning('Caution', 'Please select body');
        return;
    }

    var formData = new FormData();
    formData.append("Subject", sub);
    formData.append("Body", encodeURIComponent(body));
    formData.append("Page", page);

    $.ajax({
        url: "/About/SendFeedbackMail",
        type: "POST",
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
                $.notify.success('Success', 'Thank you for your feedback');
            }
            else {
                $.notify.error('Error', data.ErrorMessages);
            }

        }
    });

});

$(document).on('keyup', ".avoidKeyPressForDate", function (e) {
    var keyCode = e.which || e.keyCode;

    // Allow Backspace (8), Tab (9), Delete (46)
    if (keyCode === 8 || keyCode === 9 || keyCode === 46) {
        return true;
    }
    $(this).val("");
    alert("Use Calendar");
    e.preventDefault();
    return false;
});

$(document).on('hide.bs.modal', '.modal', function () {
    if (this.contains(document.activeElement)) {
        document.activeElement.blur();
    }
});