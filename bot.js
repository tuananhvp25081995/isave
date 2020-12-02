require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
var faker = require("faker");
let moment = require("moment");
const Joi = require("joi");
let mongoose = require("mongoose")
let DashboardModel = mongoose.model("DashboardModel")
let UserModel = mongoose.model("UserModel")
let sparkles = require("sparkles")();
let nodemailer = require("nodemailer");
let WAValidator = require('wallet-address-validator');
let parse = require('url-parse');
const chalk = require("chalk");
const queryString = require('query-string');

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
    isPause = false,
    group_invite_link = null,
    bot_username = null,
    domain_verify_endpoint = null,
    BOT_WELCOM_AFTER_START = "",
    BOT_BEFORE_DAY = "",
    BOT_BEFORE_HOUR = "",
    BOT_STATUS_SWITCH = true,
    CONFIG_webinarId = null;

let BOT_STEP_1 = "🎄 Step 1: Join the Isave Wallet Group by clicking this:\n";
let BOT_STEP_2 = "🎄 Step 2: Enter your email to confirm registration:";
let BOT_WRONG_EMAIL = "Your email is not valid. Please check and enter your email again.";
let BOT_EMAIL_SUCCESS = "Email is successfully verified.";
let BOT_STEP_3 = `Step 3:
🧨 Follow our [Isave Wallet Channel](https://t.me/isavewalletchannel)
🧨 Follow our [Twitter](https://twitter.com/IsaveWallet)
🧨 Retweet [this tweet](https://twitter.com/IsaveWallet/status/1333968142326894593) with hashtags #IST #IsaveWallet #cryptocurrencies #bestwallet and tag your friends.\n
*Submit your Twitter profile link: *\n(Example: [https://twitter.com/your_username](https://twitter.com/your_username))`

// The reward is 1, 000, 000 Tokens for the entire campaign.Let's share the campaign to receive bonuses by press 'Share' button
let BOT_STEP_5 = "Step 5: The Opening event starts at 13:00 UTC – December 5, 2020. Please stay tuned and participate at least 45 minutes to claim rewards";
let BOT_CHANGE_WALLET = "✨ Enter your ERC-20 wallet address to claim airdrop:\n(ex: 0xa9CdF87D7f988c0ae5cc24754C612D3cff029F80)"

let BOT_Statstics_Temple = `🎁Estimated Balance: $ETKREF IST
Total Balance: $TOKEN IST 
Tokens for airdop event will be updated after verifying manually by bounty manager at the end of airdrop.\n 
📎Referral link: REFLINK
👬Referrals: REFCOUNT
-------------------\nYour details: 
Email: EMAIL 
Telegram ID: TELEGRAM  
Twitter: TWITTER  
ERC-20 wallet address: WALLET \n`


let inviteTemple = `
🔊🔊Isave Wallet Opening Airdrop
🎉 Time: 01/12/2020  -->  05/12/2020
💲 Total Airdrop Reward: $30.000 IST
🔖 Start now: URL\n
🎁Reward: 
$ 15 IST when completed all steps
$ 3 IST for each user from your 👬 Referral.
Isave Wallet: https://isavewallet.org
`


let BOT_EVENT_END = "Airdrop Event has end. Thank you for contact to me.\nPlease keeps this chat, we will notify other airdrop."
let emailDomainAllow = ["aol.com", "gmail.com", "hotmail.com", "hotmail.co.uk", "live.com", "yahoo.com", "yahoo.co.uk", "yandex.com", "hotmail.it"];

//14:00 5/12/2020 GMT+0
let timeEnd = 1607176800000

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
        isPause = config.status.isPause
        BOT_STATUS_SWITCH = config.status.switch;
        CONFIG_webinarId = config.webinarId;
        console.log(curentTime(7), "config updated in bot.js");
    } catch (e) {
        console.error("update config have error", e);
    }
});



// let reply_markup_keyboard = {
//     keyboard: [[{ text: "Statstics" }, { text: "Change Wallet" }]],
//     // [{ text: "Change Wallet" }]],
//     // [{ text: "Change Wallet" }, { text: "Zoom" }]],
//     // keyboard: [[{ text: "Share" }, { text: "Statistics" }, { text: "Zoom" }]],
//     resize_keyboard: true,
// };
let reply_markup_keyboard = {
    keyboard: [[{ text: "Share" }, { text: "Statistics" }],
    [{ text: "Change Wallet" }, { text: "Zoom" }]],
    resize_keyboard: true,
};



let reply_markup_keyboard_end = {
    keyboard: [[{ text: "News" }, { text: "Conin Exchange" }]],
    resize_keyboard: true,
};

let reply_markup_keyboard_good = {
    keyboard: [[{ text: "Statistics" }, { text: "Change Wallet" }],
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
    if (type === "sticker") {
        console.log(`${curentTime(7)} ${chalk.blue(title)}(${chatId}) receive sticker from ${chalk.blue(fullName)}(${telegramID}): ${msg.sticker.set_name} `);
        return
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

let limit = {}


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

    if (limit[telegramID] !== undefined) {
        if (Date.now() - limit[telegramID].last < 300) {
            console.log("reach rate limit 3msg/sec: ", telegramID, fullName);
            limit[telegramID].last = Date.now()
            return
        } else limit[telegramID].last = Date.now()
    } limit[telegramID] = { last: Date.now() }

    if (isPause) {
        console.log("stop", telegramID);
        return bot.sendMessage(telegramID, "Airdrop will temporary pause to mantain for good experience.\nAirdrop will resume soon. Sorry for inconvenient.")
    }

    //this is text message
    if (type === "text") {

        if (msg.chat.type === "private") {
            let user = await UserModel.findOne({ telegramID }, { registerFollow: 1, social: 1, wallet: 1 }).exec();

            if (Date.now() > timeEnd) {
                if (!user || !user.registerFollow.step4.isTwitterOK) {
                    console.log(curentTime(7), fullName, telegramID, "End event. With text:", text);
                    bot.sendMessage(telegramID, BOT_EVENT_END).catch(e => { console.log(e) })
                    return;
                }
            }

            //user didn't have in database
            if (!user && text.startsWith("/start")) {
                bot.sendMessage(telegramID,
                    BOT_WELCOM_AFTER_START.replace("USERNAME", `[${fullName}](tg://user?id=${telegramID})`),
                    { parse_mode: "Markdown" }).catch(e => { console.log("error in first start!", e) })

                //handle for new user without ref invite
                if (msg.text === "/start") {
                    return handleStart(bot, msg, null);
                }

                //handle with ref invite
                let id = text.slice(7).replace(/\D/g, "");
                if (!id) {
                    console.log(curentTime(7), telegramID, fullName, "invite link is not valid");
                    return handleStart(bot, msg, null);
                } else return handleStart(bot, msg, id.toString());
            }


            if (!user) {
                console.log(curentTime(7), fullName, telegramID, "No user in db. With text:", text);
                return bot.sendMessage(telegramID,
                    "Have an error when handle your request.\nPlease click /start to start again.", {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }

            //have this user in database. check it out
            if (user && !user.registerFollow.passAll) {

                if (!user.registerFollow.step2.isJoined) {
                    return bot.sendMessage(telegramID, "Please join telegram group in Step 1.").catch(e => { console.log("error in check first step!", e) });
                }

                if (text === "change email" && !user.registerFollow.passAll) {
                    return handleReEnterEmailAgain(bot, msg);
                }

                if (text === "resend email" && user.registerFollow.step3.isWaitingVerify) {
                    return handleReSendEmailAgain(bot, msg);
                }

                if (user.registerFollow.step3.isWaitingEnterEmail) {
                    console.log(curentTime(7), telegramID, "email receive from user typeing:", text);
                    return handleEnterEmail(bot, msg);
                }

                if (user.registerFollow.log === "step3" && user.registerFollow.step3.isWaitingVerify) {
                    return bot.sendMessage(telegramID, "Access the email to confirm registration",
                        { reply_markup: reply_markup_keyboard_verify_email }
                    ).catch(e => console.log("have error in send email noti!", e))
                }
                else {
                    return console.log(curentTime(7), fullName, fullName, telegramID, "have not dont registerFollow with text", text);
                }
            };


            if (user && !user.registerFollow.step4.isTwitterOK) {
                console.log("in step4 ok with text link", telegramID, fullName, text);
                let checkTwitter = null
                try {
                    checkTwitter = await parse(text, true);
                } catch (e) {
                    console.log("have err in checkTwitter", e);
                }

                if (checkTwitter.hostname === "twitter.com" || checkTwitter.hostname === "mobile.twitter.com") {
                    await UserModel.updateOne({ telegramID }, { "registerFollow.step4.isTwitterOK": true, "social.twitter": text, "wallet.changeWallet": true }).exec();
                    return bot.sendMessage(telegramID, BOT_CHANGE_WALLET);
                } else {
                    return bot.sendMessage(telegramID, "You has enter an valid link, please submit again: ")
                }
            }

            if (user && user.wallet.changeWallet) {
                var valid = WAValidator.validate(text, 'ETH');
                console.log(curentTime(), fullName, telegramID, "in changeWallet text:", text);
                if (valid) {
                    await UserModel.updateOne({ telegramID }, { "wallet.changeWallet": false, "wallet.erc20": text.toUpperCase() });

                    if (!user.registerFollow.sendAllStep) {
                        await UserModel.findOneAndUpdate({ telegramID }, { "registerFollow.sendAllStep": true });
                        await sendStep4_Finish({ telegramID, msg });
                        return;
                    }
                    return bot.sendMessage(telegramID, "Your wallet was updated.");
                } else {
                    if (!user.registerFollow.sendAllStep) {
                        return bot.sendMessage(telegramID, "Oops\nYou was enter an valid wallet address. Press submit wallet address again");
                    }
                    await UserModel.updateOne({ telegramID }, { "wallet.changeWallet": false });
                    return bot.sendMessage(telegramID, "Oops\nYou was enter an valid wallet address. Press *Change Wallet* to change again", { parse_mode: "markdown", });
                }
            }

            //switch commands without payload
            if (BOT_STATUS_SWITCH && user.registerFollow.step4.isTwitterOK) {
                switch (text) {
                    case "share":
                    case "/share":
                        handleInvite(bot, msg);
                        break;
                    case "statistics":
                    case "/statistics":
                        handleStatstics(bot, msg);
                        break;

                    case "zoom":
                    case "/zoom":
                        // bot.sendMessage(
                        //     msg.from.id,
                        //     "Zoom event has ended. We will notify you when have news.",
                        //     {
                        //         disable_web_page_preview: true,
                        //         reply_markup: reply_markup_keyboard_end
                        //     }
                        // );
                        bot.sendMessage(telegramID,
                            "✨ Your unique link to join zoom event: " +
                            (await handleLinkZoom({ telegramID })) + "\n\nPlease keep it save and don't share this link to other people",
                            { disable_web_page_preview: true, reply_markup: reply_markup_keyboard }
                        );
                        break;


                    case "news":
                        bot.sendMessage(telegramID,
                            "Currently do not have any news yet, we will notify for you in futher news.\nHope you have a nice day",
                            { disable_web_page_preview: true }
                        );
                        break;


                    // case "conin exchange":
                    //     bot.sendMessage(
                    //         msg.from.id,
                    //         "Join our exchange at https://conin.ai",
                    //         {
                    //             disable_web_page_preview: true,
                    //             reply_markup: reply_markup_keyboard_end
                    //         }
                    //     );
                    //     break;

                    case "change wallet":
                        await UserModel.updateOne({ telegramID }, { "wallet.changeWallet": true });
                        bot.sendMessage(telegramID, BOT_CHANGE_WALLET, { disable_web_page_preview: true, reply_markup: reply_markup_keyboard });
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

        await UserModel.findOneAndUpdate(
            { telegramID: id },
            { $set: { "isLeftGroup": true } },
            { useFindAndModify: false }
        ).exec();

        // await UserModel.findOneAndRemove({ telegramID: id }, { useFindAndModify: false }).exec();
        let totalUsers = await UserModel.find({ "registerFollow.step4.isTwitterOK": true }).countDocuments().exec();
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

//this send for user register ok, have link to join zoom metting
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
            let users = await UserModel.find({
                "remind.isBeforeHour": false,
                "webminar.join_url": { $ne: "" },
                "social.telegram.isBlock": false
            }, { telegramID: 1, webminar: 1, fullName: 1 })
                .limit(15)
            console.log(users);
            if (users.length) {
                for (user of users) {
                    console.log(curentTime(), "found user", user.telegramID, user.webminar.join_url);
                    // let toSend = BOT_BEFORE_HOUR.toString().replace("EVENTLINK", users[i].webminar.join_url);
                    let toSend = BOT_BEFORE_HOUR.toString().split("\\n").join("\n");
                    toSend = toSend.replace("FULLNAME", `${user.fullName}`);
                    let url = "https://t.me/" + bot_username + "?start=" + user.telegramID;
                    toSend = toSend.replace("INVITELINK", url);

                    UserModel.updateOne({ telegramID: user.telegramID }, { $set: { "remind.isBeforeHour": true } })
                        .catch(e => console.log(e))

                    bot.sendMessage(
                        user.telegramID,
                        toSend,
                        {
                            disable_web_page_preview: true,
                            reply_markup: reply_markup_keyboard
                        }
                    ).then(ok => {
                        console.log("send ok to user", { username: ok.chat.username, id: ok.chat.id, text: ok.text });
                    }).catch(er => {

                        let q = queryString.parse(er.response.request.body)
                        let { chat_id } = q
                        let { body } = er.response
                        console.log({ text: q.text });
                        if (body.error_code === 429) {
                            console.log("to many request");
                            console.log({ chat_id, body: body.description });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "remind.isBeforeHour": false } })
                                .catch(e => console.log(e))
                            sparkles.emit("remind", { type: "hour", status: "stoped" });
                            console.log(curentTime(), "to many request, clear sendRemindHour interval");
                            clearInterval(beforeHour);
                            beforeHour = null;
                            sendRemindHour_doing = false;
                        } else if (body.error_code === 403) {
                            console.log("user block bot");
                            console.log({ chat_id, body: body.description });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "social.telegram.isBlock": true } })
                                .catch(e => console.log(e))
                        } else {
                            console.log("other err");
                            console.log({ chat_id, body });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "remind.isBeforeDay": false } })
                                .catch(e => console.log(e))
                        }
                    })
                }
                sendRemindHour_doing = false;
            } else {
                sparkles.emit("remind", { type: "hour", status: "stoped" });
                console.log(curentTime(), "no user left, clear sendRemindHour interval");
                clearInterval(beforeHour);
                beforeHour = null;
                sendRemindHour_doing = false;
            }
        } catch (e) {
            console.error(e);
            sendRemindHour_doing = false;
            sparkles.emit("remind", { type: "hour", status: "error" });
        }
    }, 2000);
});

sparkles.on("sendRemindHour_Cancel", async () => {
    if (beforeHour) {
        clearInterval(beforeHour);
        beforeHour = null;
    }
    sparkles.emit("remind", { type: "hour", status: "stoped" });
});



let sendRemindDay_doing = false;

sparkles.on("sendRemindDay", async () => {
    console.log(curentTime(), "on sendRemindDay");
    sparkles.emit("remind", { type: "day", status: "sending" });
    beforeDay = setInterval(async () => {
        try {
            if (sendRemindDay_doing) {
                console.log("sendRemindDay_doing is true, skip this tick");
                return;
            }
            sendRemindDay_doing = true;
            let users = await UserModel.find({
                "remind.isBeforeDay": false,
                "webminar.join_url": { $ne: "" },
                "social.telegram.isBlock": false
            }, { telegramID: 1, webminar: 1, fullName: 1 })
                .limit(15)

            if (users.length) {
                for (user of users) {
                    console.log(curentTime(), "found user", user.telegramID, user.webminar.join_url);
                    // let toSend = BOT_BEFORE_HOUR.toString().replace("EVENTLINK", users[i].webminar.join_url);
                    let toSend = BOT_BEFORE_DAY.toString().split("\\n").join("\n");
                    toSend = toSend.replace("FULLNAME", `${user.fullName}`);
                    let url = "https://t.me/" + bot_username + "?start=" + user.telegramID;
                    toSend = toSend.replace("INVITELINK", url);
                    UserModel.updateOne({ telegramID: user.telegramID }, { $set: { "remind.isBeforeDay": true } })
                        .catch(e => console.log(e))

                    bot.sendPhoto(
                        user.telegramID,
                        "image/bonus.jpeg",
                        {
                            caption: toSend,
                            disable_web_page_preview: true,
                            reply_markup: reply_markup_keyboard
                        }
                    ).then(ok => {
                        console.log("send img ok to user", { username: ok.chat.username, id: ok.chat.id, caption: ok.caption });
                    }).catch(er => {
                        let q = queryString.parse(er.response.request.body)
                        let { chat_id } = q
                        let { body } = er.response
                        console.log({ text: q.text });
                        if (body.error_code === 429) {
                            console.log("to many request");
                            console.log({ chat_id, body: body.description });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "remind.isBeforeDay": false } })
                                .catch(e => console.log(e))
                            sparkles.emit("remind", { type: "day", status: "stoped" });
                            console.log(curentTime(), "to many request, clear sendRemindDay interval");
                            clearInterval(beforeDay);
                            beforeDay = null;
                            sendRemindDay_doing = false;
                        } else if (body.error_code === 403) {
                            console.log("user block bot");
                            console.log({ chat_id, body: body.description });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "social.telegram.isBlock": true } })
                                .catch(e => console.log(e))
                        } else {
                            console.log("other err");
                            console.log({ chat_id, body });
                            UserModel.updateOne({ telegramID: chat_id }, { $set: { "remind.isBeforeDay": false } })
                                .catch(e => console.log(e))
                        }

                    })
                }
                sendRemindDay_doing = false;
            } else {
                sparkles.emit("remind", { type: "hour", status: "stoped" });
                console.log(curentTime(), "no user left, clear sendRemindHour interval");
                clearInterval(beforeDay);
                beforeHour = null;
                sendRemindDay_doing = false;
            }
        } catch (e) {
            console.error(e);
            clearInterval(beforeDay);
            sendRemindDay_doing = false;
            sparkles.emit("remind", { type: "day", status: "error" });
        }
    }, 2000);
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
        let users = await UserModel
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
                UserModel
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




async function sendStep3_Twitter({ telegramID }) {
    await bot.sendMessage(telegramID, BOT_STEP_3, {
        parse_mode: "Markdown", disable_web_page_preview: true, reply_markup: {
            remove_keyboard: true
        }
    });
}

async function sendStep4_Finish({ telegramID }) {

    let user = await UserModel.findOne({ telegramID }).exec();
    if (!user) return;
    user.registerFollow.step4.isTwitterOK = true;
    await user.save();

    // await UserModel.findOneAndUpdate({ telegramID }, { "user.registerFollow.step4.isTwitterOK": true }, { useFindAndModify: false }).exec();

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
        let totalUsers = await UserModel.find({ "registerFollow.step4.isTwitterOK": true }).countDocuments().exec();
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

    let user = await UserModel.findOne({ telegramID });
    if (!user) return;
    let url = "https://t.me/" + bot_username + "?start=" + telegramID;



    if (back.result && user) {
        // if (user.webminarLog.reportTime < 30) {
        //     let toSend = "After the data analysis process, we acknowledged that your meeting time is less than 30 minutes, which does not meet the reward claim requirement. Therefore, we regret to announce that your account is not qualified enough to claim the reward in this Airdrop Campaign."
        //         + "\n\nWe hope you will always follow and support us as we will organize many other airdrop campaigns in the future. We will bring the latest airdrop news to you. Thank you for joining us!"

        //     try {
        //         bot.sendMessage(telegramID, toSend, { disable_web_page_preview: true, reply_markup: reply_markup_keyboard_end });
        //     } catch (e) {
        //         console.log(e);
        //     }
        //     return;
        // }

        let toSend = BOT_Statstics_Temple.toString()
            .replace("EMAIL", user.mail.email.toString())
            .replace("WALLET", user.wallet.erc20.toString())
            .replace("TELEGRAM", telegramID)
            .replace("ETKREF", back.ETKREF.toString())
            .replace("TOKEN", back.FTTTotal.toString())
            .replace("REFCOUNT", back.inviteTotal.toString())
            .replace("REFCOUNT", back.inviteGetGiftSuccess.toString())
            .replace("REFLINK", url.toString())
            .replace("TWITTER", user.social.twitter.toString())

        bot.sendMessage(telegramID, toSend, { disable_web_page_preview: true, reply_markup: reply_markup_keyboard })
            .catch(e => console.log(e))

    }
}

async function handleReSendEmailAgain(bot, msg) {
    let telegramID = msg.from.id;
    try {
        let user = await UserModel.findOne({ telegramID, "mail.isVerify": false }, { mail: 1 }).exec();
        if (!user) {
            console.log("have error when handle resend email:", msg.from);
            return bot.sendMessage(telegramID, "have error when handle your request, please contact support support@isavewallet.org!")
        }
        let email = user.mail.email;
        let verifyCode = user.mail.verifyCode;
        let href = domain_verify_endpoint + "?code=" + verifyCode + "&telegramID=" + telegramID;
        console.log(curentTime(7), href);

        let msg = {
            to: email,
            from: sendFrom,
            subject: 'Please confirm your email to join Airdrop event',
            html: MAIL_TEMPLE.split("linklinklink").join(href)
        }

        transporter.sendMail(msg).catch(e => {
            console.log("have error in send email again", e);
        })

        bot.sendMessage(telegramID, "Email verify was resent to you, please check it out");
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
        let msg = {
            to: value.email,
            from: sendFrom,
            subject: 'Please confirm your email to join Airdrop event',
            html: MAIL_TEMPLE.split("linklinklink").join(href)

        }

        transporter.sendMail(msg).catch(e => { console.log("have error when send mail to", value.email) })
        return bot.sendMessage(telegramID, "🎄 Please check your email to confirm!",
            { reply_markup: reply_markup_keyboard_verify_email }
        );

    } else if (back.error === "used") {
        console.log(curentTime(), telegramID, msg.text, "this mail have been used");
        bot.sendMessage(telegramID, "Your email you type have been used, please use different email");
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
        bot.sendMessage(ref.toString(), "🎉Your have one people join with your ref.\n Each people join and finish all step require, you will get $3 IST bunus.\Keep going sir🎉")
            .then((a) => console.log(curentTime(), "send to parent ref ok")).catch(e => { console.log(curentTime(), "send to parent ref fail!!", e); })
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


function handleInvite(bot, msg, first = false) {


    let toSend = "🎉🎢 Share your referral link to get $3 IST each user completed all step above:\n";
    let url = "https://t.me/" + bot_username + "?start=" + msg.from.id;
    toSend += url;
    let full = inviteTemple.replace("URL", url)
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
                    ...reply_markup_keyboard
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
