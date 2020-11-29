require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
var faker = require("faker");
let moment = require("moment");
const Joi = require("joi");
let mongoose = require("mongoose")
let DashboardModel = mongoose.model("DashboardModel")
let UsersModel = mongoose.model("DashboardModel")
let sparkles = require("sparkles")();
let nodemailer = require("nodemailer");
let WAValidator = require('wallet-address-validator');
let parse = require('url-parse');
const chalk = require("chalk");
let {
    handleNewUserNoRef,
    handleNewUserWithRef,
    handleNewUserJoinGroup,
    setWaitingEnterEmail,
    setEmailAndUpdate,
    removeEmailandUpdate,
    getStatstics,
} = require("./controllers/userControllers");
let {
    getOrCreateRegistrants,
} = require("./controllers/zoomControllers");

const { MAIL_TEMPLE } = require("./js/define");

let beforeHour = null;
let beforeDay = null;



let bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true, });

let MAIL_SERVER_HOST, MAIL_SERVER_USER, MAIL_SERVER_PASS

if (process.env.MAIL_SERVER === "smtp2go") {
    MAIL_SERVER_HOST = process.env.MAIL_SERVER_HOST_1
    MAIL_SERVER_USER = process.env.MAIL_SERVER_USER_1
    MAIL_SERVER_PASS = process.env.MAIL_SERVER_PASS_1
} else {
    MAIL_SERVER_HOST = process.env.MAIL_SERVER_HOST_2
    MAIL_SERVER_USER = process.env.MAIL_SERVER_USER_2
    MAIL_SERVER_PASS = process.env.MAIL_SERVER_PASS_2
}

let sendFrom = "ISave Wallet Airdrop <no_reply@isavewallet.org>"
let transporter = nodemailer.createTransport({
    host: MAIL_SERVER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: MAIL_SERVER_USER,
        pass: MAIL_SERVER_PASS,
    },
});


let group_id,
    group_invite_link = null,
    bot_username = null,
    domain_verify_endpoint = null,
    BOT_WELCOM_AFTER_START = "",
    BOT_BEFORE_DAY = "",
    BOT_BEFORE_HOUR = "",
    BOT_STATUS_SWITCH = true,
    CONFIG_webinarId = null;

let BOT_STEP_1 = "🎄 Step 1: Join the FinFine Telegram Group by clicking this:\n";
// let BOT_STEP_2 = "🎄 Step 2: Enter your email and access the email to confirm registration.";
let BOT_STEP_2 = "🎄 Step 2: Enter your email to confirm registration:";
let BOT_WRONG_EMAIL = "Your email is not valid. Please check and enter your email again.";
let BOT_EMAIL_SUCCESS = "Email is successfully verified.";
let BOT_STEP_3 = "Step 3:\n🧨 Follow our [Finfine Channel](https://t.me/finfinechannel) \n🧨 Follow our [Twitter](https://twitter.com/ConinExchange) \n🧨 Retweet [this tweet](https://twitter.com/ConinExchange/status/1317019011503116290) with hashtags #FFT #CONIN #cryptocurrencies #exchange and tag your friends.\n\n"
    + "*Submit your Twitter profile link(send 'skip' if you didn't have twitter):*\n(Example: [https://twitter.com/finfine_admin](https://twitter.com/finfine_admin))";
// The reward is 1, 000, 000 Tokens for the entire campaign.Let's share the campaign to receive bonuses by press 'Share' button
let BOT_STEP_5 = "Step 5: The Opening event starts at 15:00 UTC – October 25, 2020. Please stay tuned and participate at least 30 minutes to claim rewards";
let BOT_CHANGE_WALLET = "✨ Enter your ERC-20 wallet address to claim airdrop:\n(ex: 0x6B0359f95796327475ad4F12aE4E1047c3A67fA3)"

let BOT_Statstics_Temple = "🎁Estimated Balance: $ETKREF FFT\n"
    + "Total Balance: $TOKEN FFT\n"
    + "Tokens for joining Social Media will be updated after verifying manually by bounty manager at the end of airdrop.\n\n"
    + "📎Referral link: REFLINK\n"
    + "👬Referrals: REFCOUNT\n"
    + "-------------------\nYour details: \n"
    + "Email: EMAIL \n"
    + "Telegram ID: TELEGRAM \n"
    + "Twitter: TWITTER \n"
    + "Finfine wallet: WALLET \n"



let BOT_Statstics_End_Temple = "🎁Estimated Balance: $ETKREF FFT\n"
    + "Total Balance: $TOKEN FFT\n"
    + "Tokens for joining Social Media will be updated after verifying manually by bounty manager at the end of airdrop.\n\n"
    + "📎Referral link: REFLINK\n"
    + "👬Referrals: REFCOUNT\n"
    + "-------------------\nYour details: \n"
    + "Email: EMAIL \n"
    + "Telegram ID: TELEGRAM \n"
    + "Twitter: TWITTER \n"
    + "Finfine wallet: WALLET \n"

let BOT_EVENT_END = "Airdrop Event has end. Thank you for contact to me.\nPlease keeps this chat, we will notify other airdrop."

let emailDomainAllow = ["aol.com", "gmail.com", "hotmail.com", "hotmail.co.uk", "live.com", "yahoo.com", "yahoo.co.uk", "yandex.com", "hotmail.it"];

//15:00GMT 25/10/2020
let timeEnd = 1603638000000;


sparkles.on("config_change", async () => {
    try {
        let config = await DashboardModel.findOne({ config: 1 });
        group_id = config.group_id;
        group_invite_link = config.group_invite_link;
        bot_username = config.bot_username;
        domain_verify_endpoint = config.domain_verify_endpoint;
        BOT_WELCOM_AFTER_START = config.bot_text.BOT_WELCOM_AFTER_START;
        BOT_BEFORE_HOUR = config.remind.beforeHour;
        BOT_BEFORE_DAY = config.remind.beforeDay;
        BOT_STATUS_PRIVATE_CHAT = config.status.privateChat;
        BOT_STATUS_GROUP_CHAT = config.status.groupChat;
        BOT_STATUS_SWITCH = config.status.switch;
        CONFIG_webinarId = config.webinarId;
        console.log(curentTime(7), "config updated in bot.js");
    } catch (e) {
        console.error("update config have error", e);
    }
});



let reply_markup_keyboard = {
    keyboard: [[{ text: "Statstics" }, { text: "Change Wallet" }]],
    // [{ text: "Change Wallet" }]],
    // [{ text: "Change Wallet" }, { text: "Zoom" }]],
    // keyboard: [[{ text: "Share" }, { text: "Statstics" }, { text: "Zoom" }]],
    resize_keyboard: true,
};
// let reply_markup_keyboard = {
//     keyboard: [[{ text: "Statstics" }, { text: "Share" }],
//     [{ text: "Change Wallet" }]],
//     // [{ text: "Change Wallet" }, { text: "Zoom" }]],
//     // keyboard: [[{ text: "Share" }, { text: "Statstics" }, { text: "Zoom" }]],
//     resize_keyboard: true,
// };



let reply_markup_keyboard_end = {
    keyboard: [[{ text: "News" }, { text: "Conin Exchange" }]],
    resize_keyboard: true,
};

let reply_markup_keyboard_good = {
    keyboard: [[{ text: "Statstics" }, { text: "Change Wallet" }],
    [{ text: "News" }, { text: "Conin Exchange" }]],
    resize_keyboard: true,
};


let reply_markup_keyboard_verify_email = {
    keyboard: [[{ text: "Change email" }, { text: "Resend email" }]],
    resize_keyboard: true,
};

let reply_markup_keyboard_twitter = {
    keyboard: [[{ text: "Done ✔" }], [{ text: "Not yet" }]],
    resize_keyboard: true,
};


const schemaEmail = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 1,
        tlds: { allow: ["com", "net", "dev", "uk", "it"] },
    }),
});

function curentTime(offset = 7) {
    return chalk.green(
        new moment().utcOffset(offset).format("YYYY/MM/DD HH:mm:ss Z")
    );
}

async function logMsg(msg, type = "text") {
    let { id, first_name, last_name } = msg.from;
    let telegramID = id;
    let chatId = msg.chat.id;
    let title = msg.chat.title ? msg.chat.title : "";
    let fullName = (first_name ? first_name : "") + " " + (last_name ? last_name : "");

    if (type === "text") {
        text = msg.text;
        text = text.toString().split("\n").join(" ");
        console.log(`${curentTime(7)} ${chalk.blue(title)}(${chatId}) receive from ${chalk.blue(fullName)}(${telegramID}): ${text} `);
        return;
    }
    if (type === "new_chat_members") {
        console.log(`${curentTime(7)} ${chalk.blue(fullName)}(${telegramID}) joined ${chalk.blue(title)}(${chatId})`);
    }
    else if (type === "left_chat_member") {
        console.log(`${curentTime(7)} ${chalk.blue(fullName)}(${telegramID}) left ${chalk.blue(title)}(${chatId})`);
    } else {
        console.log(curentTime(7), "undifine type", type, msg)
    }
}


bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.sendMessage(chatId, resp);
});


bot.on("message", async (...parameters) => {
    let msg = parameters[0];
    let type = parameters[1].type;
    let chatId = msg.chat.id;
    let telegramID = msg.from.id;
    let { first_name, last_name } = msg.from;
    let fullName = (first_name ? first_name : "") + " " + (last_name ? last_name : "");
    logMsg(msg, type);
    let text = "";
    if (type === "text") text = msg.text.toLowerCase();


    if (!BOT_STATUS_SWITCH) {
        console.log(curentTime(7), "BOT_STATUS_SWITCH: off");
        return;
    }
    //this is text message
    if (type === "text") {


        // bot.sendMessage(telegramID, "Airdrop will temporary pause to mantain for good experience.\nAirdrop will resume soon. Sorry for inconvenient.")
        // console.log("stop", telegramID);
        // return;

        if (msg.chat.type === "private") {
            let user = await UsersModel.findOne({ telegramID }, { registerFollow: 1, social: 1, wallet: 1 }).exec();

            if (Date.now() > timeEnd) {
                if (!user || !user.registerFollow.step4.isTwitterOK) {
                    try {
                        console.log(curentTime(7), fullName, telegramID, "End event. With text:", text);
                        await bot.sendMessage(telegramID, BOT_EVENT_END);
                    } catch (e) {
                        console.log(e);
                    }
                    return;
                }

            }
            //user didn't have in database
            if (!user && text.startsWith("/start")) {
                await bot.sendMessage(telegramID,
                    BOT_WELCOM_AFTER_START.replace("USERNAME", `[${fullName}](tg://user?id=${telegramID})`),
                    { parse_mode: "Markdown" });

                //handle for new user without ref invite
                if (msg.text === "/start") {
                    handleStart(bot, msg, null);
                    return;
                }
                //handle with ref invite
                let id = text.slice(7).replace(/\D/g, "");
                if (!id) {
                    console.log(curentTime("+7000"), telegramID, fullName, "invite link is not valid");
                    handleStart(bot, msg, null);
                } else handleStart(bot, msg, id.toString());
                return;
            }




            if (!user) {
                console.log(curentTime(7), fullName, telegramID, "No user in db. With text:", text);
                return;
            }


            //have this user in database. check it out
            if (user && !user.registerFollow.passAll) {

                if (!user.registerFollow.step2.isJoined) {
                    await bot.sendMessage(telegramID, "Please join telegram group in Step 1.");
                    return;
                }


                if (text === "change email" && !user.registerFollow.passAll) {
                    await handleReEnterEmailAgain(bot, msg);
                    return;
                }

                if (text === "resend email" && user.registerFollow.step3.isWaitingVerify) {
                    await handleReSendEmailAgain(bot, msg);
                    return;
                }

                if (user.registerFollow.step3.isWaitingEnterEmail) {
                    console.log(curentTime("+7000"), telegramID, "email receive from user typeing:", text);
                    await handleEnterEmail(bot, msg);
                    return;
                }

                if (user.registerFollow.log === "step3" && user.registerFollow.step3.isWaitingVerify) {
                    await bot.sendMessage(telegramID, "Access the email to confirm registration",
                        { reply_markup: reply_markup_keyboard_verify_email }
                    );
                    return;
                }
                else {
                    console.log(curentTime(7), fullName, fullName, telegramID, "have not dont registerFollow with text", text);
                    return;
                }
            };


            if (user && !user.registerFollow.step4.isTwitterOK) {
                console.log("in step4 ok with text link", telegramID, fullName, text);

                let back = await parse(text, true);
                // console.log(back)

                // if (!back.slashes || back.hostname !== "twitter.com") {

                // }

                if (back.hostname === "twitter.com" || back.hostname === "mobile.twitter.com") {
                    await UsersModel.findOneAndUpdate({ telegramID }, { "registerFollow.step4.isTwitterOK": true, "social.twitter": text, "wallet.changeWallet": true }, { useFindAndModify: false }).exec();
                    bot.sendMessage(telegramID, BOT_CHANGE_WALLET);
                    return;
                } else {
                    bot.sendMessage(telegramID, "You has enter an valid link, please submit again: ")
                    return;
                }

            }

            if (user && user.wallet.changeWallet) {
                var valid = WAValidator.validate(text, 'ETH');
                console.log(curentTime(), fullName, telegramID, "in changeWallet text:", text);
                if (valid) {
                    await UsersModel.findOneAndUpdate({ telegramID }, { "wallet.changeWallet": false, "wallet.erc20": text.toUpperCase() }, { useFindAndModify: false });

                    if (!user.registerFollow.sendAllStep) {
                        await UsersModel.findOneAndUpdate({ telegramID }, { "registerFollow.sendAllStep": true, }, { useFindAndModify: false });
                        await sendStep4_Finish({ telegramID, msg });
                        return;
                    }
                    await bot.sendMessage(telegramID, "Your wallet was update.");
                    return;
                } else {

                    if (!user.registerFollow.sendAllStep) {
                        await bot.sendMessage(telegramID, "Oops\nYou was enter an valid wallet address. Press submit wallet address again");
                        return;
                    }
                    await UsersModel.findOneAndUpdate({ telegramID }, { "wallet.changeWallet": false }, { useFindAndModify: false });
                    await bot.sendMessage(telegramID, "Oops\nYou was enter an valid wallet address. Press *Change Wallet* to change again", { parse_mode: "markdown", });
                    return;
                }
            }

            //switch commands without payload
            if (BOT_STATUS_SWITCH && user.registerFollow.step4.isTwitterOK) {
                switch (text) {
                    case "share":
                    case "/share":
                        // handleInvite(bot, msg);
                        break;
                    case "statstics":
                    case "/statstics":
                        handleStatstics(bot, msg);
                        break;

                    case "zoom":
                    case "/zoom":
                        bot.sendMessage(
                            msg.from.id,
                            "Zoom event has ended. We will notify you when have news.",
                            {
                                disable_web_page_preview: true,
                                reply_markup: reply_markup_keyboard_end
                            }
                        );
                        // bot.sendMessage(
                        //     msg.from.id,
                        //     "✨ Your unique link to join zoom event: " +
                        //     (await handleLinkZoom({ telegramID: msg.from.id })),
                        //     { disable_web_page_preview: true }
                        // );
                        break;


                    case "news":
                        bot.sendMessage(
                            msg.from.id,
                            "Currently do not have any airdrop yet, we will notify for you in futher event.\nHope you have a nice day",
                            {
                                disable_web_page_preview: true,
                                reply_markup: reply_markup_keyboard_end
                            }
                        );
                        break;


                    case "conin exchange":
                        bot.sendMessage(
                            msg.from.id,
                            "Join our exchange at https://conin.ai",
                            {
                                disable_web_page_preview: true,
                                reply_markup: reply_markup_keyboard_end
                            }
                        );
                        break;

                    case "change wallet":
                        await UsersModel.findOneAndUpdate({ telegramID }, { "wallet.changeWallet": true }, { useFindAndModify: false });
                        bot.sendMessage(telegramID, BOT_CHANGE_WALLET, { disable_web_page_preview: true });
                        break;

                    case "/check":
                        bot.sendMessage(telegramID, "ok", {
                            reply_markup: reply_markup_keyboard
                        })

                    default:
                        break;
                }
            }

        }


    } else if (type === "left_chat_member") {
        handleLeftChatMember(bot, msg);
    } else if (type === "new_chat_members") {
        handleNewChatMember(bot, msg);
    }
});

bot.on("error", (...parameters) => {
    console.error(parameters);
});

bot.on("polling_error", (error) => {
    console.log(curentTime(), error); // => 'EFATAL'
});

async function handleNewChatMember(bot, msg) {
    try {
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        console.log(`${curentTime(7)} ${chalk.blue(fullName)}(${telegramID}) joined ${chalk.blue(msg.chat.title)}(${msg.chat.id}): joined mess was deleted`)
    } catch (e) {
        console.log("was deleted")
    }
    let telegramID = msg.from.id;
    let { first_name, last_name, id } = msg.from;
    let fullName = (first_name ? first_name : "") + " " + (last_name ? last_name : "");
    // console.log(curentTime(7), telegramID, fullName, "join group chat", msg.chat.title);
    let user = await handleNewUserJoinGroup({ telegramID, fullName });

    if (user) {
        if (user.registerFollow.log === "step3") {
            if (user.registerFollow.step3.isWaitingEnterEmail) {
                await sendStep3_1({ telegramID }, bot);
            }
        }
    }

}



let handleLeftChatMember = async (bot, msg) => {
    let { first_name, last_name, id } = msg.from;
    let fullName = (first_name ? first_name : "") + " " + (last_name ? last_name : "");
    console.log(curentTime(7), id, fullName, "left group chat, starting delete them in database");
    try {

        await UsersModel.findOneAndUpdate(
            { telegramID: id },
            { $set: { "isLeftGroup": true } },
            { useFindAndModify: false }
        ).exec();

        // await UsersModel.findOneAndRemove({ telegramID: id }, { useFindAndModify: false }).exec();
        let totalUsers = await UsersModel.find({ "registerFollow.step4.isTwitterOK": true }).countDocuments().exec();
        sparkles.emit("totalUsers", { totalUsers });
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        await bot.sendMessage(id, "Warning: you left group, your ref will be delete.", {
            reply_markup: {
                remove_keyboard: true
            }
        });
    } catch (e) {
        console.error(e);
    }
};


let sendRemindHour_doing = false;
sparkles.on("sendRemindHour", async () => {
    console.log(curentTime(), "on sendRemindHour");
    sparkles.emit("remind", { type: "hour", status: "sending" });
    beforeHour = setInterval(async () => {
        try {
            if (sendRemindHour_doing) {
                console.log("sendRemindHour_doing is true, skip this tick");
                return;
            }
            sendRemindHour_doing = true;
            let users = await UsersModel
                .find(
                    {
                        "remind.isBeforeHour": false,
                        "registerFollow.step4.isTwitterOK": true,
                        "webminarLog.isEnough30min": true,

                        // "webminar.join_url": {$ne : ""}
                    },
                    { telegramID: 1, webminar: 1, fullName: 1 }
                )
                .limit(15)
                .exec();

            if (users.length) {
                // console.log(users);
                for (let i = 0; i < users.length; i++) {
                    let join_url = null;

                    //temporary disable webiminar link
                    // if (users[i].webminar.join_url === "" || users[i].webminar.id.toString() !== CONFIG_webinarId.toString()) {
                    //     console.log(
                    //         curentTime(),
                    //         "this user have't join_url or have old webinarId, so create new join_url"
                    //     );
                    //     let getOrCreateRegistrantsBack = await getOrCreateRegistrants(
                    //         { telegramID: users[i].telegramID }
                    //     );
                    //     if (getOrCreateRegistrantsBack.result)
                    //         join_url = getOrCreateRegistrantsBack.join_url;
                    // } else join_url = users[i].webminar.join_url;

                    console.log(
                        curentTime(),
                        "found user",
                        users[i].telegramID,
                        users[i].webminar.join_url
                    );


                    // let toSend = BOT_BEFORE_HOUR.toString().replace("EVENTLINK", users[i].webminar.join_url);
                    let toSend = BOT_BEFORE_HOUR.toString().split("\\n").join("\n");
                    toSend = toSend.replace("USERNAME", `[${users[i].fullName}](tg://user?id=${users[i].telegramID})`);


                    try {
                        await bot.sendMessage(
                            users[i].telegramID,
                            toSend,
                            {
                                disable_web_page_preview: true,
                                parse_mode: "Markdown",
                                reply_markup: reply_markup_keyboard
                            }
                        );
                    } catch (e) {
                        console.log("this user block bot", users[i].telegramID);
                    }

                    await UsersModel
                        .findOneAndUpdate(
                            { telegramID: users[i].telegramID },
                            { $set: { "remind.isBeforeHour": true } },
                            { useFindAndModify: false }
                        )
                        .exec();
                }
                sendRemindHour_doing = false;
            } else {
                sparkles.emit("remind", { type: "hour", status: "stoped" });
                console.log(
                    curentTime(),
                    "no user left, clear sendRemindHour interval"
                );
                clearInterval(beforeHour);
                beforeHour = null;
                sendRemindHour_doing = false;
            }
        } catch (e) {
            console.error(e);
            sendRemindHour_doing = false;
            sparkles.emit("remind", { type: "hour", status: "error" });
        }
    }, 1000);
});

sparkles.on("sendRemindHour_Cancel", async () => {
    if (beforeHour) {
        clearInterval(beforeHour);
        beforeHour = null;
    }
    sparkles.emit("remind", { type: "hour", status: "stoped" });
});

let sendRemindDay_doing = false;


//test send bulk message;

let sendMessageAsync = async ({ telegramID }) => {
    let user = await UsersModel.findOne({ telegramID }, { telegramID: 1, fullName: 1 }).exec();

    if (user) {
        sparkles.emit("remind", { type: "day", status: "sending" });

        console.log(curentTime(), "found user", user.fullName);
        let toSend = BOT_BEFORE_DAY.toString()
        toSend = toSend.split("\\n").join("\n");

        bot.sendMessage(telegramID, toSend, { disable_web_page_preview: true }).then(e => {
            console.log(("sent okkk", telegramID));
        }).catch(err => {
            console.error(telegramID, err)
        }).finally(fn => {
            UsersModel
                .findOneAndUpdate(
                    { telegramID: telegramID },
                    { $set: { "remind.isBeforeDay": true } },
                    { useFindAndModify: false }
                )
                .exec();
        })

    } else {
        console.log("not found user in db");
    }
}

let sendRemindDay_SET_notSend = null;

sparkles.on("sendRemindDay", async () => {
    sendRemindDay_SET_notSend = new Set();
    console.log(curentTime(), "on sendRemindDay for users didn't enough 30min");

    //grab list users didnt sent into sendRemindDay_SET_notSend
    try {
        let users = await UsersModel
            .find({
                "webminarLog.totalTime": { $gte: 1, $lt: 1800000, },
                "remind.isBeforeDay": false,
            }, { telegramID: 1 }).exec();

        for (let i = 0; i < users.length; i++) {
            sendRemindDay_SET_notSend.add(users[i].telegramID);
            console.log("add", users[i].telegramID, "to set ok");

        }

        console.log(sendRemindDay_SET_notSend);
    } catch (e) {
        console.log("error in sendRemindDay_SET_notSend", e);
    }

    beforeDay = setInterval(() => {
        for (let i = 0; i < 20; i++) {
            let z_iterator = sendRemindDay_SET_notSend.values();
            let id = z_iterator.next().value;
            if (!id) {
                console.log("end of set");
                console.log(curentTime(), "no user left, clear sendRemindDay interval");
                clearInterval(beforeDay);
                beforeDay = null;
                sparkles.emit("remind", { type: "day", status: "stoped" });
                break;
            };
            sendRemindDay_SET_notSend.delete(id);
            sendMessageAsync({ telegramID: id })
            console.log("found id in Set", id)
        }
    }, 1500);
});

sparkles.on("sendRemindDay_Cancel", async () => {
    if (beforeDay) {
        sendRemindDay_SET_notSend = new Set();
        clearInterval(beforeDay);
        beforeDay = null;
    }
    sparkles.emit("remind", { type: "day", status: "stoped" });
});



sparkles.on("sendCustom", async ({ body }) => {
    console.log(body);
    sendRemindDay_SET_notSend = new Set();
    console.log(curentTime(), "on sendCustom for users didn't enough 30min");

    //grab list users didnt sent into sendRemindDay_SET_notSend
    try {
        let users = await UsersModel
            .find({
                "webminarLog.reportTime": { $gte: 30 },
                "remind.isBeforeDay": true,
            }, { telegramID: 1, fullName: 1 }).exec();

        for (let i = 0; i < users.length; i++) {
            let { telegramID, fullName } = users[i];
            console.log("start send custom", telegramID, fullName);
            let toSend = "After receiving responses from users, we have worked with Zoom system and confirmed that you have attended the meeting enough time to claim rewards. Sorry about the inconvenience that may cause. Thank you for your understanding!";
            try {
                await bot.sendMessage(telegramID, toSend, { reply_markup: reply_markup_keyboard_good });
            } catch (e) {
                console.log(e);
            } finally {
                UsersModel
                    .findOneAndUpdate(
                        { telegramID: users[i].telegramID },
                        { $set: { "remind.isBeforeDay": true, "remind.isCustom": true } },
                        { useFindAndModify: false }
                    )
                    .exec();
            }
            console.log(("okkk", users[i].telegramID));
        }

    } catch (e) {
        console.log("error in sendCustom", e);
    }

});



// sparkles.on("sendRemindDay", async () => {
//     console.log(curentTime(), "on sendRemindDay");
//     sparkles.emit("remind", { type: "day", status: "sending" });
//     beforeDay = setInterval(async () => {
//         try {
//             if (sendRemindDay_doing) {
//                 console.log("sendRemindDay_doing is true, skip this tick");
//                 return;
//             }
//             sendRemindDay_doing = true;
//             let users = await UsersModel
//                 .find(
//                     {
//                         "remind.isBeforeDay": false,
//                         "registerFollow.passAll": true,
//                         "registerFollow.step4.isTwitterOK": true,
//                     },
//                     { telegramID: 1, webminar: 1 }
//                 )
//                 .limit(10)
//                 .exec();

//             if (users.length) {
//                 for (let i = 0; i < users.length; i++) {
//                     let join_url = null;
//                     if (
//                         users[i].webminar.join_url === "" ||
//                         users[i].webminar.id.toString() !==
//                         CONFIG_webinarId.toString()
//                     ) {
//                         console.log(
//                             curentTime(),
//                             "this user have't join_url or have old webinarId, so create new join_url"
//                         );
//                         let getOrCreateRegistrantsBack = await getOrCreateRegistrants(
//                             { telegramID: users[i].telegramID }
//                         );
//                         if (getOrCreateRegistrantsBack.result)
//                             join_url = getOrCreateRegistrantsBack.join_url;
//                     } else {
//                         join_url = users[i].webminar.join_url;
//                     }
//                     console.log(
//                         curentTime(),
//                         "found user",
//                         users[i].telegramID,
//                         users[i].webminar.join_url
//                     );

//                     let toSend = BOT_BEFORE_DAY.toString().replace("EVENTLINK", users[i].webminar.join_url);
//                     toSend = toSend.split("\\n").join("\n");


//                     await bot.sendMessage(
//                         users[i].telegramID,
//                         toSend,
//                         { disable_web_page_preview: true }
//                     ).then(e => {
//                         console.log(("okkk", users[i].telegramID));
//                     }).catch(err => {
//                         console.error(err)
//                     }).finally(fn => {
//                         UsersModel
//                             .findOneAndUpdate(
//                                 { telegramID: users[i].telegramID },
//                                 { $set: { "remind.isBeforeDay": true } },
//                                 { useFindAndModify: false }
//                             )
//                             .exec();
//                     })
//                 }
//                 sendRemindDay_doing = false;
//             } else {
//                 console.log(
//                     curentTime(),
//                     "no user left, clear sendRemindDay interval"
//                 );
//                 clearInterval(beforeDay);
//                 beforeDay = null;
//                 sendRemindDay_doing = false;
//                 sparkles.emit("remind", { type: "day", status: "stoped" });
//             }
//         } catch (e) {
//             console.error(e);
//             sendRemindDay_doing = false;
//             sparkles.emit("remind", { type: "day", status: "error" });
//         }
//     }, 1000);
// });

// sparkles.on("sendRemindDay_Cancel", async () => {
//     if (beforeDay) {
//         clearInterval(beforeDay);
//         beforeDay = null;
//     }
//     sparkles.emit("remind", { type: "day", status: "stoped" });
// });



async function sendStep3_Twitter({ telegramID }) {
    await bot.sendMessage(telegramID, BOT_STEP_3, {
        parse_mode: "Markdown", disable_web_page_preview: true, reply_markup: {
            remove_keyboard: true
        }
    });
}

async function sendStep4_Finish({ telegramID }) {

    let user = await UsersModel.findOne({ telegramID }).exec();
    if (!user) return;
    user.registerFollow.step4.isTwitterOK = true;
    await user.save();

    // await UsersModel.findOneAndUpdate({ telegramID }, { "user.registerFollow.step4.isTwitterOK": true }, { useFindAndModify: false }).exec();

    await bot.sendMessage(telegramID, "Step 4: Save your Zoom Meeting Opening event: " + (await handleLinkZoom({ telegramID })),
        { disable_web_page_preview: true }
    );



    await bot.sendMessage(telegramID, BOT_STEP_5, {
        disable_web_page_preview: true,
        reply_markup: reply_markup_keyboard,
    });


    let msg = {
        from: {
            id: telegramID
        }
    };

    handleInvite(bot, msg, true)

    try {
        let totalUsers = await UsersModel.find({ "registerFollow.step4.isTwitterOK": true }).countDocuments().exec();
        sparkles.emit("totalUsers", { totalUsers });
    } catch (e) {
        console.error(e);
    }
}





sparkles.on("email_verify_success", async ({ telegramID }) => {
    await bot.sendMessage(telegramID, BOT_EMAIL_SUCCESS);
    sendStep3_Twitter({ telegramID });
    return;

});

async function handleStatstics(bot, msg) {
    let telegramID = msg.from.id;
    let back = await getStatstics({ telegramID });

    let user = await UsersModel.findOne({ telegramID });
    if (!user) return;
    let url = "https://t.me/" + bot_username + "?start=" + telegramID;



    if (back.result && user) {


        if (user.webminarLog.reportTime < 30) {

            let toSend = "After the data analysis process, we acknowledged that your meeting time is less than 30 minutes, which does not meet the reward claim requirement. Therefore, we regret to announce that your account is not qualified enough to claim the reward in this Airdrop Campaign."
                + "\n\nWe hope you will always follow and support us as we will organize many other airdrop campaigns in the future. We will bring the latest airdrop news to you. Thank you for joining us!"

            try {
                bot.sendMessage(telegramID, toSend, { disable_web_page_preview: true, reply_markup: reply_markup_keyboard_end });
            } catch (e) {
                console.log(e);
            }
            return;
        }

        let toSend = BOT_Statstics_Temple.toString()
            .replace("EMAIL", user.mail.email.toString())
            .replace("WALLET", user.wallet.erc20.toString())
            .replace("TELEGRAM", telegramID)
            .replace("ETKREF", back.ETKREF.toString())
            .replace("TOKEN", back.FTTTotal.toString())
            .replace("REFCOUNT", back.inviteTotal.toString())
            // .replace("REFCOUNT", back.inviteGetGiftSuccess.toString())
            .replace("REFLINK", url.toString())
            .replace("TWITTER", user.social.twitter.toString())
        try {

            // await bot.sendMessage(telegramID, toSend, { parse_mode: "Markdown", disable_web_page_preview: true });
            await bot.sendMessage(telegramID, toSend, { disable_web_page_preview: true, reply_markup: reply_markup_keyboard });
        } catch (e) {
            console.log(e);
        }
    }
}

async function handleReSendEmailAgain(bot, msg) {
    //this code will resend email to confirm
    let telegramID = msg.from.id;
    try {
        let user = await UsersModel.findOne({ telegramID }, { mail: 1 }).exec();
        let email = user.mail.email;
        let verifyCode = user.mail.verifyCode;
        let href =
            domain_verify_endpoint +
            "?code=" +
            verifyCode +
            "&telegramID=" +
            telegramID;
        console.log(curentTime(7), href);

        let msg = {
            to: email,
            from: sendFrom,
            subject: 'Please confirm your email to join Airdrop event',
            html: MAIL_TEMPLE.replace("linklinklink", href),
        }
        try {
            await transporter.sendMail(msg);
        } catch (e) {
            console.log(e);
        }

        await bot.sendMessage(
            telegramID,
            "Email verify was resent to you, please check it out"
        );
    } catch (e) {
        console.error(e);
    }
}

async function handleEnterEmail(bot, msg) {
    let telegramID = msg.from.id;

    let listMail = "";
    emailDomainAllow.forEach((item, index) => {
        let toJoin = "@" + item;
        if (index !== emailDomainAllow.length - 1) toJoin += ", ";
        listMail += toJoin
    })
    let toSend = BOT_WRONG_EMAIL + "\n Only accept: " + listMail;

    let { value, error } = schemaEmail.validate({ email: msg.text });
    if (error) {
        await bot.sendMessage(msg.from.id, toSend);
        return;
    }

    let email = value.email;
    let domain = email.split("@")[1];
    if (!emailDomainAllow.includes(domain)) {
        await bot.sendMessage(msg.from.id, toSend);
        return;
    }

    let back = await setEmailAndUpdate({ telegramID, email: value.email });

    if (back.result) {
        let href = domain_verify_endpoint + "?code=" + back.verifyCode + "&telegramID=" + telegramID;
        console.log(curentTime(7), href);
        const msg = {
            to: value.email, // Change to your recipient
            from: sendFrom,
            subject: 'Please confirm your email to join Airdrop event',
            html: MAIL_TEMPLE.replace("linklinklink", href),
        }
        try {

            await transporter.sendMail(msg);
        } catch (e) {
            console.log(e);
        }
        await bot.sendMessage(
            telegramID,
            "🎄 Please check your email to confirm!",
            { reply_markup: reply_markup_keyboard_verify_email }
        );

        return;
    } else {
        if (back.error === "used") {
            await bot.sendMessage(
                telegramID,
                "Your email you type have been used, please use different email"
            );
        }
        console.log(
            curentTime(),
            telegramID,
            msg.text,
            "this mail have been used"
        );
    }
}

async function handleReEnterEmailAgain(bot, msg) {
    let telegramID = msg.from.id;

    let back = await removeEmailandUpdate({ telegramID });
    if (back) {
        bot.sendMessage(
            telegramID,
            "Enter your new email to receive email confirm"
        );
        return;
    } else {
        console.error("handleReEnterEmailAgain has an error");
    }
}



async function sendStep1({ telegramID }, bot) {
    bot.sendMessage(telegramID, BOT_STEP_1 + group_invite_link);
    return;
}
async function sendStep3_1({ telegramID }, bot) {
    bot.sendMessage(telegramID, BOT_STEP_2);
    await setWaitingEnterEmail({ telegramID }, true);
    return;
}

async function handleStart(bot, msg, ref) {
    let telegramID = msg.from.id;
    let { first_name, last_name } = msg.from;
    let fullName = (first_name ? first_name : "") + " " + (last_name ? last_name : "");
    let result = null;

    //with ref id
    if (ref) {
        console.log(curentTime(7), "handleStart with ref id", telegramID, fullName, ref);
        result = await handleNewUserWithRef({ telegramID, fullName, ref });
    }

    //without ref id
    else {
        console.log(curentTime(7), "handleStart without ref id", telegramID, fullName);
        result = await handleNewUserNoRef({ telegramID, fullName });
    }

    if (!result.result) {
        console.log(curentTime(), "result false in handleStart");
        console.error(result);
        return;
    }

    console.log(curentTime(), "handleStart done", telegramID, fullName);


    let getChatMember = await bot.getChatMember(group_id.toString(), telegramID);

    if (getChatMember.status === "member") {
        console.log("user already in group but in db still false, so update it");
        await handleNewUserJoinGroup({ telegramID, fullName });
        await sendStep3_1({ telegramID }, bot);
        return;
    } else {
        await sendStep1({ telegramID }, bot);
        return;
    }


}

async function handleLinkZoom({ telegramID }) {
    let getOrCreateRegistrantsBack = await getOrCreateRegistrants({
        telegramID,
    });
    if (getOrCreateRegistrantsBack.result)
        return getOrCreateRegistrantsBack.join_url;
    return null;
}

// async function fakerRegistrant(bot, msg) {
//     let fakeData = {
//         telegramID: msg.from.id,
//         email: faker.internet.email(),
//         first_name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//     };

//     let createRegistrantsBack = await createRegistrants(fakeData);

//     if (createRegistrantsBack.result) {
//         console.log(curentTime(), "createRegistrantsBack ok");
//         bot.sendMessage(msg.from.id, createRegistrantsBack.toString());
//     } else {
//         console.log(
//             curentTime(),
//             "createRegistrantsBack failed",
//             createRegistrantsBack
//         );
//         bot.sendMessage(msg.from.id, "createRegistrantsBack failed");
//     }
// }



// function handleGetGroupID(bot, msg) {
//     // console.log(msg)
//     if (
//         msg.chat.type &&
//         (msg.chat.type === "group" || msg.chat.type === "supergroup")
//     ) {
//         console.log(
//             curentTime(),
//             msg.from.id,
//             msg.from.first_name,
//             msg.from.last_name,
//             "get groupid in: ",
//             msg.chat.id
//         );
//         bot.sendMessage(msg.chat.id, "Group id is: " + msg.chat.id);
//     }
// }

function handleInvite(bot, msg, first = false) {


    let toSend = "🎉🎢 Share your referral link to get $3 FFT each user completed all step above:\n";
    let url = "https://t.me/" + bot_username + "?start=" + msg.from.id;
    toSend += url;

    let full = "🔊🔊Conin Opening Airdrop\n"
        + "🎉 Time: 16/10/2020  -->  25/10/2020\n"
        + "💲 Total Airdrop Reward: $10.000 FFT \n"
        + "🔖 Start now: " + url + "\n\n"
        + "🎁🎁Reward: \n"
        + "$ 20 FFT when completed all steps\n"
        + "$ 3 FFT for each user from your 👬 Referral.\n"
        + "Conin Exchange: https://conin.ai\n"



    if (first) {
        bot.sendMessage(
            msg.from.id,
            toSend,
            {
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Click to share",
                                url:
                                    "https://t.me/share/url?url=" +
                                    url +
                                    "&text=Join Airdrop event to claim free gift 🎁🎁",
                            },
                        ],
                    ],
                },
            }
        );
    } else {
        bot.sendMessage(
            msg.from.id,
            full,
            {
                disable_web_page_preview: true,
            }
        );
    }
    return;
}
