const axios = require("axios").default;
var qs = require("qs");
var TinyURL = require("tinyurl");
let mongoose = require("mongoose")
let DashboardModel = mongoose.model("DashboardModel")
let UserModel = mongoose.model("UserModel")
let { create } = require("apisauce");
let moment = require("moment");
let sparkles = require("sparkles")();
let chalk = require("chalk");
let { v4 } = require("uuid");

let webinarId = null;
let domain = null;
let lastRefresh = Date.now();



function curentTime(offset = "+0000") {
    return chalk.green(
        new moment().utcOffset(offset).format("YYYY/MM/DD HH:mm:ss Z")
    );
}
sparkles.on("config_change", async () => {
    try {
        let config = await DashboardModel.findOne({ config: 1 });
        webinarId = config.webinarId;
        domain = config.domain
        console.log(curentTime(7), "config updated in zoomControllers.js");
    } catch (e) {
        console.error("update config have error", e);
    }
});

function createBasicAuth(id, secret) {
    function base64encode(text) {
        let buff = new Buffer.from(text.toString(), "utf-8");
        return buff.toString("base64");
    }
    return "Basic " + base64encode(id + ":" + secret);
}

async function handleOauthRedirectUri(data) {
    let code = data.code;
    try {
        let config = await DashboardModel.findOne({ config: 1 }).exec();
        config.user_oauth_code = code;
        let getNewTokenBack = await getNewToken(
            code,
            createBasicAuth(config.app_client_id, config.app_client_secret)
        );

        if (getNewTokenBack.result) {
            config.token.access_token = getNewTokenBack.access_token;
            config.token.refresh_token = getNewTokenBack.refresh_token;
            config.token.token_refresh_at = Date.now();
            // config.token.scope = getNewTokenBack.scope;
            await config.save();
            console.log(curentTime(), "handleOauthRedirectUri success");

            return { result: true };
        } else {
            return { result: false };
        }
    } catch (e) {
        console.log(curentTime(), "handleOauthRedirectUri has an error");
        console.error(e);
        return { result: false };
    }
}

async function getNewToken(code, authBasic) {
    let config = await DashboardModel.findOne({ config: 1 }).exec();
    if (!code && !authBasic) {
        code = config.user_oauth_code;
        authBasic = createBasicAuth(
            config.app_client_id,
            config.app_client_secret
        );
    }

    let toReturn = {
        result: true,
        access_token: null,
        refresh_token: null,
        raw: null,
    };

    let url =
        "https://zoom.us/oauth/token?grant_type=authorization_code&code=" +
        code +
        "&redirect_uri=" +
        config.redirect_uri.toString();
    console.log(curentTime(), url);
    const request = create({
        baseURL: "https://zoom.us",
        headers: {
            Authorization: authBasic,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    try {
        let t = await request.post(url);

        console.log(curentTime(), t.data);
        if (t.status === 200) {
            let access_token = t.data.access_token;
            let refresh_token = t.data.refresh_token;
            toReturn.access_token = access_token;
            toReturn.refresh_token = refresh_token;
            console.log(curentTime(), "access_token", access_token);
            console.log(curentTime(), "refresh_token", refresh_token);

            let dashboard = await DashboardModel.findOne({ config: 1 }).exec();

            dashboard.token.access_token = access_token;
            dashboard.token.refresh_token = refresh_token;
            dashboard.token.token_refresh_at = Date.now();
            await dashboard.save();
            return toReturn;
        } else {
            toReturn.raw = t.data;
            toReturn.result = false;
            console.log(curentTime(), t.data);
            return toReturn;
        }
    } catch (e) {
        toReturn.result = false;
        toReturn.raw = e.response.data;
        console.error(e.response.data);
        return toReturn;
    }
}

async function refreshToken() {
    try {
        let config = await DashboardModel.findOne({ config: 1 }).exec();

        if (config) {
            let { app_client_id, app_client_secret } = config;
            let { refresh_token, token_refresh_at } = config.token;

            var data = qs.stringify({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            });

            var axios_config = {
                method: "post",
                url: "https://zoom.us/oauth/token",
                headers: {
                    Authorization: createBasicAuth(
                        app_client_id,
                        app_client_secret
                    ),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: data,
            };

            try {
                let t = await axios(axios_config);
                if (t.status === 200) {
                    config.token.access_token = t.data.access_token;
                    config.token.refresh_token = t.data.refresh_token;
                    config.token.scope = t.data.scope;
                    config.token.token_refresh_at = Date.now();
                    await config.save();
                    console.log(
                        curentTime(),
                        "refreshed token with refresh token: ",
                        config.token.refresh_token
                    );
                    return;
                } else {
                    console.log(curentTime(), t);
                    console.log(curentTime(), "refresh token failed");
                }
            } catch (e) {
                console.log("refresh token failed");
                console.error(e.response.status);
                console.error(e.response.data);
                throw e;
            }
        }
    } catch { }
}

let getOrCreateRegistrants = async ({ telegramID }) => {
    try {
        let user = await UserModel.findOne({ telegramID }).exec();

        if (user) {
            if (
                user.webminar.join_url &&
                user.webminar.id.toString() === webinarId.toString()
            ) {
                console.log(
                    curentTime(),
                    "this user have invite link, so get it"
                );
                return {
                    result: true,
                    join_url: `${domain}/join?id=${user.webminar.shortLink}`,
                    start_time: user.webminar.start_time,
                };
            } else {
                if (user.webminar.id !== webinarId) {
                    console.log(curentTime(), "this user have old webminarid, so create new and replace");
                } else console.log(curentTime(), "this user haven't invite link, so create it");
                let createRegistrantsBack = await createRegistrants({
                    email: user.mail.email,
                    first_name: user.fullName,
                    telegramID: user.telegramID,
                });

                if (createRegistrantsBack.result) return createRegistrantsBack;
                return { result: false };
            }
        } else {
            return { result: false };
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

let createRegistrants = async (data) => {
    try {
        let config = await DashboardModel.findOne({ config: 1 }).exec();
        let { access_token } = config.token;
        if (!access_token) {
            let getNewTokenBack = await getNewToken();
            if (getNewTokenBack.result) {
                access_token = getNewTokenBack.access_token;
            }
        }
        let { email, first_name, last_name, telegramID } = data;
        let webinarId = config.webinarId;

        var dataToSend = JSON.stringify({
            email: email,
            last_name: last_name ? last_name : first_name,
            custom_questions: [
                {
                    title: "telegramID",
                    value: telegramID,
                },
            ],
        });

        var axios_config = {
            method: "post",
            url:
                "https://api.zoom.us/v2/webinars/" + webinarId + "/registrants",
            headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
            },
            data: dataToSend,
        };

        try {
            let oneUser = await UserModel
                .findOne({ telegramID: telegramID })
                .exec();

            if (oneUser.webminar.id === webinarId) {
                console.log(
                    curentTime(),
                    "this user have register with webminar info, skip createRegistrants",
                    telegramID
                );
                return { result: true, ...oneUser.webminar };
            }

            let t = await axios(axios_config);
            if (t.status === 201) {
                let { registrant_id, id, topic, start_time, join_url } = t.data;

                // let newurl = await TinyURL.shorten(join_url);
                // console.log(newurl);
                let short = v4().toString().slice(0, 8)
                oneUser.webminar = {
                    id,
                    join_url,
                    shortLink: short,
                    registrant_id,
                    start_time,
                    topic,
                    time: Date.now(),
                };

                await oneUser.save();
                return { result: true, join_url: `${domain}/join?id=${short}`, start_time };
            }
        } catch (e) {
            console.log(curentTime(), "createRegistrants failed with code:", "data", e.response.status, e.response.data);

            if (
                e.response.status === 401 &&
                e.response.data.code &&
                e.response.data.code === 124
            ) {
                if (Date.now() - lastRefresh > 5000) {
                    console.log(curentTime(), "try refresh new token");
                    lastRefresh = Date.now();
                    await refreshToken();
                    return await createRegistrants(data);
                } else {
                    console.log(
                        curentTime(),
                        "last refresh token wihtin 1min, so cannel"
                    );
                }
            }
            return { result: false, raw: e.response.data };
        }
    } catch (e) {
        console.error(e);
        return { result: false };
    }
};

async function ad() { }

module.exports = {
    handleOauthRedirectUri,
    refreshToken,
    getNewToken,
    createRegistrants,
    getOrCreateRegistrants,
};
