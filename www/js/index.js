var platform, $output, noticationPlugin;


function onDeviceReady() {
    $output = $('#log-output');
    $('#platform').text(device.platform);
    $('#os-version').text(device.version);

    platform = device.platform.toLowerCase();

    $('body').addClass(platform);

    $('#schedule-notification').on('click', scheduleNotification);
    $('#notification-now').on('click', notificationNow);

    $('#settings').on('click', cordova.plugins.diagnostic.switchToSettings);

    $('#check-notification-permission').on('click', checkNotificationPermission);
    $('#request-notification-permission').on('click', requestNotificationPermission);
    $('#check-alarm-permission').on('click', checkAlarmPermission);
    $('#request-alarm-permission').on('click', requestAlarmPermission);


    noticationPlugin = cordova.plugins.notification.local;

    var defaults = noticationPlugin.getDefaults();
    log('Notification plugin defaults: ' + JSON.stringify(defaults));
}

function scheduleNotification(){
    var opts = {
        channelId: "test_channel",
        channelName: "Test Channel",
        title: "Test notification",
        text: "Test notification body",
        trigger: { in: 5, unit: 'second' }
    };
    opts.foreground = $('#foreground').is(':checked')
    opts.priority = $('#priority').val();



    showAlert("Notification will trigger in 5 seconds of dimissing this prompt", "Notification scheduled", function(){
        log('Scheduled notification with options: ' + JSON.stringify(opts));
        noticationPlugin.schedule(opts);
    });
}

function notificationNow(){
    var opts = {
        channelId: "test_channel",
        channelName: "Test Channel",
        title: "Test notification",
        text: "Test notification body",
        trigger: { in: 0, unit: 'second' }
    };
    opts.foreground = $('#foreground').is(':checked')
    opts.priority = $('#priority').val();

    log('Triggering notification now with options: ' + JSON.stringify(opts));
    noticationPlugin.schedule(opts);
}

function checkNotificationPermission(){
    noticationPlugin.hasPermission(function(granted){
        showAlert("Notification permission: " + (granted ? "Granted" : "Not granted"), "Notification permission");
    });
}

function requestNotificationPermission(){
    noticationPlugin.hasPermission(function(granted){
        if(granted){
            showAlert("Notification permission already granted", "Notification permission");
        }else{
            noticationPlugin.requestPermission(function(granted){
                showAlert("Notification permission: " + (granted ? "Granted" : "Not granted"), "Notification permission");
            });
        }
    });
}

function checkAlarmPermission(){
    noticationPlugin.canScheduleExactAlarms(function(granted){
        showAlert("Alarm permission: " + (granted ? "Granted" : "Not granted"), "Alarm permission");
    });
}

function requestAlarmPermission(){
    noticationPlugin.canScheduleExactAlarms(function(granted){
        if(granted){
            showAlert("Alarm permission already granted", "Alarm permission");
        }else{
            showAlert("You must grant alarm permission to schedule exact alarms", "Alarm permission", function(){
                noticationPlugin.openAlarmSettings();
            });
        }
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
