var platform, $output;


function onDeviceReady() {
    $output = $('#log-output');
    $('#platform').text(device.platform);
    $('#os-version').text(device.version);

    platform = device.platform.toLowerCase();

    $('body').addClass(platform);

    $('#schedule-notification').on('click', scheduleNotification);

    var defaults = cordova.plugins.notification.local.getDefaults();
    log('Notification plugin defaults: ' + JSON.stringify(defaults));
}

function scheduleNotification(){
    var opts = {
        title: "Test notification",
        text: "Test notification body",
        trigger: { in: 5, unit: 'second' }
    };
    opts.foreground = $('#foreground').is(':checked');

    showAlert("Notification will trigger in 5 seconds of dimissing this prompt", "Notification scheduled", function(){
        cordova.plugins.notification.local.schedule(opts);
    });
}


// UI logging
function prependLogMessage(message){
    $output.prepend('<span class="'+(message.logLevel ? message.logLevel : '')+'">' +message.msg + '</span>' + (message.nobreak ? "<br/>" : "<br/><br/>" ));
}

function log(msg, opts){
    opts = opts || {};

    opts.logLevel = opts.logLevel || "log";
    console[opts.logLevel](msg);

    opts.msg = msg;
    prependLogMessage(opts);
}

function logError(msg, error){
   if(typeof error === 'object'){
        msg += ': ' + JSON.stringify(error);
    }else if(typeof error === 'string'){
        msg += ': ' + error;
    }
    log(msg, {
        logLevel: "error"
    });
}

function handleError(error){
    logError(error.message, error);
}

function showAlert(msg, title, resultHandler, buttonLabel){
    navigator.notification.alert(msg, resultHandler,title, buttonLabel);
}

function showConfirm(resultHandler, msg, title, buttonLabels){
    navigator.notification.confirm(msg, resultHandler, title, buttonLabels || ["Yes", "No"]);
}

$(document).on("deviceready", onDeviceReady);
