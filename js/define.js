let { mail_temple } = require("./temple");

function base64encode(text) {
    let buff = new Buffer.from(text.toString(), "utf-8");
    return buff.toString("base64");
}

let BOT_PREFIX = "/";
let BOT_INVITE_STRING_PREFIX = "invite";
let BOT_LIST_STRING_PREFIX = "list";
let BOT_COUNT_STRING_PREFIX = "count";
let BOT_ENCODE_STRING_PREFIX = "encode";
let BOT_DECODE_STRING_PREFIX = "decode";
let BOT_GET_GROUPID_PREFIX = "groupid";

let BOT_USERNAME = "minar80_bot";
let BOT_ID = "1316284308";

let BOT_WELCOM_NEW_USER = "Welcom to join our group";

let GROUP_IDGROUP = "-1001386682491";
let GROUP_INVITELINK = "https://t.me/FinFineGroup";

// let APP_OAUTH_AUTHORIZED_USER = "rHyaa36zXW_FUr1m2ZpQDim0r14iB9Mag"
let APP_CLIENT_ID = "bpcThYtThGoff_o0g4a9w";
let APP_CLIENT_SECRET = "tXG7CtViLEA1o6ikow1nSZpSwxK8DtJB";

let APP_AUTHORIZATION_BASIC_STRING =
    "Basic " + base64encode(APP_CLIENT_ID + ":" + APP_CLIENT_SECRET);
let APP_REDIRECT_URI = "https://f8d10f0747f4.ngrok.io/oauth_redirect";

let BOT_WELCOM_AFTER_START =
    "🎉 Welcom $$$$\n" +
    "Please follow Campaign details :\n" +
    "————————————————————————\n" +
    "Conditions of participation\n" +
    "✅Step 1: Join the FinFine Telegram Group\n" +
    "✅Step 2: Enter Email address and access Email to confirm\n" +
    "✅Step 3: Join in \n" +
    "✅Step 4: Opening event start at 3:00PM  29th October 2020. Follow it and join event at least 30 minutes to receive reward\n" +
    "————————————————————————\n" +
    "Rewards: \n" +
    "🎁 $20 FFT rewards when compeleting the above 4 conditions \n" +
    "🎁 Affiliate campaign: $3 FFT rewards each user you invite (their have to compelete all step above) \n" +
    "Let's get start ✨🎊\n";

let BOT_DESCRIPTION =
    "🎉🎉🎉 Chào mừng bạn đến chiến dịch Airdrop cho sự kiện trực tuyến ra mắt trao đổi tiền điện tử Conin - Trao đổi tiền điện tử đầu tiên xử lý trên 5 triệu giao dịch mỗi giây\n" +
    "—————————————————————-\n" +
    "🎁 Phần thưởng cho toàn bộ chiến dịch là 1.000.000 FFT\n" +
    "—————————————————————-\n" +
    "💎 hiện tại 1 FFT = $0.0143 và sẽ được niêm yết giao dịch trên https://conin.ai";

let DOMAIN_VERIFY_ENDPOINT = "http://162.241.137.37:80/email_verify";
// let DOMAIN_VERIFY_ENDPOINT = "http://192.168.1.55:3210/email_verify"

let EMAIL_TEMPLE = "";

module.exports = {
    BOT_PREFIX,
    BOT_INVITE_STRING_PREFIX,
    BOT_LIST_STRING_PREFIX,
    BOT_COUNT_STRING_PREFIX,
    BOT_ENCODE_STRING_PREFIX,
    BOT_DECODE_STRING_PREFIX,
    BOT_GET_GROUPID_PREFIX,
    BOT_USERNAME,
    BOT_ID,

    BOT_DESCRIPTION,
    BOT_WELCOM_NEW_USER,
    BOT_WELCOM_AFTER_START,

    GROUP_IDGROUP,
    GROUP_INVITELINK,

    // APP_OAUTH_AUTHORIZED_USER,
    APP_CLIENT_ID,
    APP_CLIENT_SECRET,
    APP_AUTHORIZATION_BASIC_STRING,
    APP_REDIRECT_URI,

    MAIL_TEMPLE: mail_temple,

    DOMAIN_VERIFY_ENDPOINT,
};
