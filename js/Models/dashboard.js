const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaDashboard = new Schema(
    {
        config: { type: Number, default: 1 },
        username: { type: String, default: "admin" },
        password: { type: String, default: "hi" },

        token: {
            access_token: { type: String, default: "" },
            refresh_token: { type: String, default: "" },
            token_refresh_at: { type: Date, default: Date.now() },
            scope: { type: String, default: "" },
            token_type: { type: String, default: "bearer" },
        },

        status: {
            privateChat: { type: Boolean, default: true },
            groupChat: { type: Boolean, default: true },
            switch: { type: Boolean, default: true },
            isPause: { type: Boolean, default: false }
        },

        user_oauth_code: { type: String, default: "VuMT59Uxyj_FUr1m2ZpQDim0r14iB9Mag" },
        app_client_id: { type: String, default: "bpcThYtThGoff_o0g4a9w" },
        app_client_secret: { type: String, default: "tXG7CtViLEA1o6ikow1nSZpSwxK8DtJB" },

        //846 2720 4564 for test
        webinarId: { type: String, default: "84627204564" },

        //-1001417029522  for test group
        //-1001420387772 for main group
        group_id: { type: String, default: "-1001420387772" },

        // https://t.me/istest1 for test group
        // https://t.me/isavewalletgroup for main group
        group_invite_link: { type: String, default: "https://t.me/isavewalletgroup", },

        appInstallLink: {
            type: String,
            default: "https://zoom.us/oauth/authorize?response_type=code&client_id=bpcThYtThGoff_o0g4a9w&redirect_uri=https%3A%2F%2Fairdrop.isavewallet.org%2Foauth",
        },

        redirect_uri: { type: String, default: "https%3A%2F%2Fairdrop.isavewallet.org%2Foauth" },
        bot_username: { type: String, default: "isavewallet_bot" },
        domain: { type: String, default: "https://airdrop.isavewallet.org" },
        domain_verify_endpoint: {
            type: String,
            default: "https://airdrop.isavewallet.org/email_verify",
        },

        bot_text: {
            BOT_WELCOM_AFTER_START: {
                type: String,
                default: `Welcome USERNAME
Please follow up to get started in the campaign
————————————————————————
Conditions of participation
✅Step 1: Join our Telegram Group and Channel
✅Step 2: Access to your email and confirm registration
✅Step 3: Like our Twitter Channel
✅Step 4: Participate in FinFine ecosystem online launching event. The event starts at 14:00 UTC on December 5, 2020

- $15 IST token reward for completing the 4 steps above
Rewards:
- $3 IST token reward for each successful referral (the member you referred to must also complete 4 steps of the campaign)
`
            },
            BOT_DESCRIPTION: {
                type: String,
                default: `🎉🎉🎉 Welcome you to Airdrop Campaign for  Isave Wallet Launching Event  – The new and absolutely secure crypto wallet\n
                        —————————————————————-\n
                        🎁 The entire campaign reward is $30000 IST\n
                        —————————————————————-\n
                        💎 Currently 1 FFT = $0.1. Isave Token will be traded on cryptocurrency exchanges by the end of December 2020\n
                        💎 We will distribute IST immediately after the e nd of the campaign\n
                        ▶️ Please click on “Start” to have a look through the campaign`,
            },
        },

        remind: {
            beforeHour: {
                type: String,
                default:
                    "Opening event will be start within 60 min next, remember your join link to join event. If you don't remember, please press 'Zoom' button",
            },
            beforeDay: {
                type: String,
                default:
                    "In 24 hours next, opening event will be host at Zoom. Please take a look at by you event join link: EVENTLINK",
            },
        },
    },

    {
        versionKey: false,
    }
);
console.log("loaded DashboardModel");
mongoose.model("DashboardModel", schemaDashboard, "dashboard");

// /**
// * Paste one or more documents here
// */
// {
//     "config": 1,
//     "token": {
//         "access_token": "eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiIxZjEyOGRlOC1hZmZmLTQyNzAtOTgzZS1hYWEzZjcxNjBhNzkifQ.eyJ2ZXIiOjcsImF1aWQiOiJiNWU0OGNlZDk4YjlmMThmZTg5YjkzYmVmYjFjNjU5ZSIsImNvZGUiOiJDZldBRkxUVkI3X0ZVcjFtMlpwUURpbTByMTRpQjlNYWciLCJpc3MiOiJ6bTpjaWQ6YnBjVGhZdFRoR29mZl9vMGc0YTl3IiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6IkZVcjFtMlpwUURpbTByMTRpQjlNYWciLCJuYmYiOjE2MDA4NDUyOTUsImV4cCI6MTYwMDg0ODg5NSwiaWF0IjoxNjAwODQ1Mjk1LCJhaWQiOiJCNlN0TWcxV1M3SzNuQ0tkU0xUWWx3IiwianRpIjoiYzY5MDRmMGItYjMxNi00ODBlLTljY2QtOTg0YjVhMjI3NTkzIn0.rS2UgLyVWz3NZxMxT2ovUVTcF82bDvnT9ytNuslfIsm6x1a34evt88K0s6MWybUGlBNoN6Ns831Mph3WVfgSUQ",
//         "refresh_token": "eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiIzMzliODM5MS0yNWI0LTRmZGEtODA4NC0zOGVkMDIyYmE4YTcifQ.eyJ2ZXIiOjcsImF1aWQiOiJiNWU0OGNlZDk4YjlmMThmZTg5YjkzYmVmYjFjNjU5ZSIsImNvZGUiOiJDZldBRkxUVkI3X0ZVcjFtMlpwUURpbTByMTRpQjlNYWciLCJpc3MiOiJ6bTpjaWQ6YnBjVGhZdFRoR29mZl9vMGc0YTl3IiwiZ25vIjowLCJ0eXBlIjoxLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6IkZVcjFtMlpwUURpbTByMTRpQjlNYWciLCJuYmYiOjE2MDA4NDUyOTUsImV4cCI6MjA3Mzg4NTI5NSwiaWF0IjoxNjAwODQ1Mjk1LCJhaWQiOiJCNlN0TWcxV1M3SzNuQ0tkU0xUWWx3IiwianRpIjoiMjdkYTIxZTItYTI3YS00MDczLWFkMjYtNmZkNDVjNGEyMWJkIn0.Zmi_55-G4JIraqlp8EIqQwWxlftUxIN9juf3fJSvZK1nMxZDb_tUvAI-oY7FWrgnQIqWWRjKRvpkgNNTIYY7HA",
//         "token_refresh_at": {
//             "$date": "2020-09-23T07:14:56.574Z"
//         },
//         "scope": "account:master account:read:admin account:write:admin chat_channel:read:admin chat_channel:write:admin chat_message:read:admin chat_message:write:admin contact:read:admin dashboard:master dashboard_crc:read:admin dashboard_home:read:admin dashboard_im:read:admin dashboard_meetings:read:admin dashboard_webinars:read:admin dashboard_zr:read:admin group:master group:read:admin group:write:admin imchat:bot imchat:read:admin imchat:write:admin imcontact:read:admin imgroup:master imgroup:read:admin imgroup:write:admin meeting:master meeting:read:admin meeting:write:admin pac:master pac:read:admin pac:write:admin phone:read:admin phone:write:admin recording:master recording:read:admin recording:write:admin report:master report:read:admin role:master role:read:admin role:write:admin room:master room:read:admin room:write:admin user:master user:read:admin user:write:admin webinar:master webinar:read:admin webinar:write:admin",
//         "token_type": "bearer"
//     },
//     "username": "admin",
//     "password": ".",
//     "user_oauth_code": "CfWAFLTVB7_FUr1m2ZpQDim0r14iB9Mag",
//     "app_client_id": "bpcThYtThGoff_o0g4a9w",
//     "app_client_secret": "tXG7CtViLEA1o6ikow1nSZpSwxK8DtJB",
//     "webinarId": "89621788001",
//     "group_id": "-1001386682491",
//     "redirect_uri": "https://ef6cf576a219.ngrok.io/api/oauth_redirect",
//     "appInstallLink": "https://zoom.us/oauth/authorize?response_type=code&client_id=bpcThYtThGoff_o0g4a9w&redirect_uri=https%3A%2F%2Fef6cf576a219.ngrok.io%2Fapi%2Foauth_redirect",
//     "redirectUri": ""
// }
