function loadConfig() {
    $.get("/api/config", function (data) {
        if (data.requestResult === true) {
            console.log(data);
            $("#user_oauth_code").val(data.result.user_oauth_code);
            $("#app_client_id").val(data.result.app_client_id);
            $("#app_client_secret").val(data.result.app_client_secret);
            $("#access_token").val(data.result.access_token);
            $("#refresh_token").val(data.result.refresh_token);
            $("#webinarId").val(data.result.webinarId);
            $("#group_id").val(data.result.group_id);
            $("#renewOauth").attr("link", data.result.appInstallLink);
            $("#redirect_uri").val(data.result.redirect_uri);
        }
    });
}

function loadBotConfig() {
    $.get("/api/botconfig", function (data) {
        if (data.requestResult === true) {
            console.log(data);
            $("#BOT_DESCRIPTION").val(data.result.BOT_DESCRIPTION);
            $("#BOT_WELCOM_AFTER_START").val(
                data.result.BOT_WELCOM_AFTER_START
            );
            $("#bot_username").val(data.result.bot_username);
            $("#group_invite_link").val(data.result.group_invite_link);
            $("#domain_verify_endpoint").val(
                data.result.domain_verify_endpoint
            );
        }
    });
}

function loadBotRemind() {
    $.get("/api/botremind", function (data) {
        if (data.requestResult === true) {
            console.log(data);
            $("#beforeHour").val(data.result.beforeHour);
            $("#beforeHourCount").text(data.result.beforeHourCount);
            $("#beforeHourStatus").text(data.result.hour);

            $("#beforeDay").val(data.result.beforeDay);
            $("#beforeDayCount").text(data.result.beforeDayCount);
            $("#beforeDayStatus").text(data.result.day);
            loadBotRemindCount();
        }
    });
}
function loadBotRemindCount() {
    $.get("/api/botremind", function (data) {
        if (data.requestResult === true) {
            console.log(data);
            $("#beforeHourCount").text(data.result.beforeHourCount);
            $("#beforeHourStatus").text(data.result.hour);
            $("#beforeDayCount").text(data.result.beforeDayCount);
            $("#beforeDayStatus").text(data.result.day);

            if (data.result.hour === "stoped" && data.result.day === "stoped") {
                if (intervalRemindCount) {
                    clearInterval(intervalRemindCount);
                    intervalRemindCount = null;
                }
            } else {
                if (!intervalRemindCount) {
                    intervalRemindCount = setInterval(() => {
                        loadBotRemindCount();
                    }, 1000);
                }
            }
        }
    });
}

async function saveRemind({ remind }) {
    if (remind === "hour") {
        let back = await $.ajax({
            type: "POST",
            url: "/api/botremind",
            data: {
                beforeHour: $("#beforeHour").val(),
            },
        });

        console.log(back);
        if (back.requestResult) {
            console.log(
                "btn_beforeHourSave ok, so load new remind config to web"
            );
            loadBotRemind();
            toastr.success("Before hour remind saved");
            return;
        } else {
            toastr.error("Before hour remind error");
            return;
        }
    }

    if (remind === "day") {
        let back = await $.ajax({
            type: "POST",
            url: "/api/botremind",
            data: {
                beforeDay: $("#beforeDay").val(),
            },
        });

        console.log(back);
        if (back.requestResult) {
            console.log("btn_botConfigSave ok, so load new config to web");
            loadBotRemind();
            toastr.success("Before day remind saved");
            return;
        } else {
            toastr.error("Before day remind error");
            return;
        }
    }
}

function loadUserOnlineTotal() {
    $.get("/api/userOnline", function (data) {
        if (data.requestResult === true) {
            console.log(data);
            $("#userOnline").text(data.result.userOnline);
            $("#totalUsers").text(data.result.totalUsers);
        }
    });
}

let intervalRemindCount = null;

$(document).ready(function () {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "500",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    loadConfig();
    loadBotConfig();
    loadBotRemind();

    loadUserOnlineTotal();

    var socket = io();

    socket.on("userOnline", function ({ userOnline }) {
        $("#userOnline").text(userOnline);
    });
    socket.on("totalUsers", function ({ totalUsers }) {
        $("#totalUsers").text(totalUsers);
    });

    $("#renewOauth").click(() => {
        let confirmBack = confirm("Are you sure to get new Oauth?");
        if (confirmBack) window.open($("#renewOauth").attr("link"));
    });

    $("#btn_configSave").click((event) => {
        // event.preventDefault()

        let confirmBack = confirm("Are you sure to update?");
        if (confirmBack) {
            console.log("btn_configSave click");

            $.ajax({
                type: "POST",
                url: "/api/config",
                data: {
                    user_oauth_code: $("#user_oauth_code").val(),
                    app_client_id: $("#app_client_id").val(),
                    app_client_secret: $("#app_client_secret").val(),
                    access_token: $("#access_token").val(),
                    refresh_token: $("#refresh_token").val(),
                    webinarId: $("#webinarId").val(),
                    group_id: $("#group_id").val(),
                    redirect_uri: $("#redirect_uri").val(),
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log(
                            "btn_configSave ok, so load new config to web"
                        );
                        loadConfig();
                        toastr.success("Zoom App config saved");
                    } else {
                        toastr.error("Have error when save Zoom App config");
                    }
                },
                dataType: "json",
            });
        }
    });
    $("#btn_configCancel").click(() => {
        console.log("btn_configCancel clicked");
        loadConfig();
    });

    $("#btn_botConfigSave").click((event) => {
        let confirmBack = confirm("Are you sure to update?");
        if (confirmBack) {
            console.log("btn_botConfigSave click");
            $.ajax({
                type: "POST",
                url: "/api/botconfig",
                data: {
                    BOT_DESCRIPTION: $("#BOT_DESCRIPTION").val(),
                    BOT_WELCOM_AFTER_START: $("#BOT_WELCOM_AFTER_START").val(),
                    bot_username: $("#bot_username").val(),
                    group_invite_link: $("#group_invite_link").val(),
                    domain_verify_endpoint: $("#domain_verify_endpoint").val(),
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log(
                            "btn_botConfigSave ok, so load new config to web"
                        );
                        loadBotConfig();
                        toastr.success("Bot config saved");
                    } else {
                        toastr.error("Have error when save Bot config");
                    }
                },
                dataType: "json",
            });
        }
    });
    $("#btn_botConfigCancel").click(() => {
        console.log("btn_configCancel clicked");
        loadBotConfig();
    });

    $("#btn_beforeHourSave").click((event) => {
        let confirmBack = confirm("Are you sure to update?");
        if (confirmBack) {
            console.log("btn_beforeHourSave click");
            saveRemind({ remind: "hour" });
        }
    });
    $("#btn_beforeDaySave").click((event) => {
        let confirmBack = confirm("Are you sure to update?");
        if (confirmBack) {
            console.log("btn_botConfigSave click");
            saveRemind({ remind: "day" });
        }
    });

    $("#btn_beforeHourSend").click(async (event) => {
        let confirmBack = confirm("Are you sure to send?");
        if (confirmBack) {
            console.log("btn_beforeHourSend click");
            await saveRemind({ remind: "hour" });
            $.ajax({
                type: "POST",
                url: "/api/botremindsend",
                data: {
                    beforeHour: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log(
                            "btn_beforeHourSend ok, so load new remind config to web"
                        );
                        loadBotRemind();
                        toastr.success("Started send remind before a hour");
                    } else {
                        toastr.error("Fail to send remind");
                    }
                },
                dataType: "json",
            });
        }
    });
    $("#btn_beforeDaySend").click(async (event) => {
        let confirmBack = confirm("Are you sure to send?");
        if (confirmBack) {
            console.log("btn_beforeDaySend click");
            await saveRemind({ remind: "day" });
            $.ajax({
                type: "POST",
                url: "/api/botremindsend",
                data: {
                    beforeDay: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log("btn_beforeDaySend ok");
                        loadBotRemind();
                        toastr.success("Started send remind before a day");
                    } else {
                        toastr.error("Fail to send remind");
                    }
                },
                dataType: "json",
            });
        }
    });

    $("#btn_beforeHourReset").click((event) => {
        let confirmBack = confirm("Are you sure to reset all?");
        if (confirmBack) {
            console.log("btn_beforeHourReset click");
            $.ajax({
                type: "POST",
                url: "/api/botremindreset",
                data: {
                    beforeHourReset: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log("btn_beforeHourReset ok");
                        loadBotRemind();
                        toastr.success("Reset remind a hour");
                    } else {
                        toastr.error("Fail to reset remind a hour");
                    }
                },
                dataType: "json",
            });
        }
    });
    $("#btn_beforeDayReset").click((event) => {
        let confirmBack = confirm("Are you sure to reset all?");
        if (confirmBack) {
            console.log("btn_beforeDayReset click");
            $.ajax({
                type: "POST",
                url: "/api/botremindreset",
                data: {
                    beforeDayReset: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log("btn_beforeDayReset ok");
                        loadBotRemind();
                        toastr.success("Reset remind a day");
                    } else {
                        toastr.error("Fail to reset remind a day");
                    }
                },
                dataType: "json",
            });
        }
    });

    $("#btn_beforeHourStopSend").click((event) => {
        let confirmBack = confirm("Are you sure to stop send remind hour?");
        if (confirmBack) {
            console.log("btn_beforeHourStopSend click");
            $.ajax({
                type: "POST",
                url: "/api/botremindstopsend",
                data: {
                    beforeHourStop: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log("btn_beforeHourStopSend ok");
                        loadBotRemind();
                        toastr.success("Stoped remind a hour");
                    } else {
                        toastr.error("Fail to stop remind a hour");
                    }
                },
                dataType: "json",
            });
        }
    });
    $("#btn_beforeDayStopSend").click((event) => {
        let confirmBack = confirm("Are you sure to stop send remind a day?");
        if (confirmBack) {
            console.log("btn_beforeDayStopSend click");
            $.ajax({
                type: "POST",
                url: "/api/botremindstopsend",
                data: {
                    beforeDayStop: true,
                },
                success: (data) => {
                    console.log(data);
                    if (data.requestResult) {
                        console.log("btn_beforeDayStopSend ok");
                        loadBotRemind();
                        toastr.success("Stoped remind a day");
                    } else {
                        toastr.error("Fail to stop remind a day");
                    }
                },
                dataType: "json",
            });
        }
    });

    $("#btnTestToken").click(() => {
        console.log("btnTestToken clicked");
        $.ajax({
            type: "POST",
            url: "https://api.zoom.us/v2/users/me",
            data: {},
            headers: {
                Authorization: "Bearer " + $("#access_token").val(),
            },
            success: (data) => {
                console.log(data);
            },
        });
    });
});
