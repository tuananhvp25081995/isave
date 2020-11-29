const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaDashboard = new Schema(
    {
        config: { type: Number, default: 1 },
        username: { type: String, default: "admin" },
        password: { type: String, default: "Liecoin!" },

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
        },

        user_oauth_code: { type: String, default: "" },
        app_client_id: { type: String, default: "bpcThYtThGoff_o0g4a9w" },
        app_client_secret: {
            type: String,
            default: "tXG7CtViLEA1o6ikow1nSZpSwxK8DtJB",
        },

        webinarId: { type: String, default: "82703277688" },

        group_id: { type: String, default: "-483832284" },
        group_invite_link: {
            type: String,
            default: "https://t.me/FinFineGroup",
        },

        appInstallLink: {
            type: String,
            default:
                "https://zoom.us/oauth/authorize?response_type=code&client_id=bpcThYtThGoff_o0g4a9w&redirect_uri=https%3A%2F%2Fef6cf576a219.ngrok.io%2Fapi%2Foauth_redirect",
        },

        redirect_uri: { type: String, default: "" },

        bot_username: { type: String, default: "isavewallet_bot" },

        domain_verify_endpoint: {
            type: String,
            default: "https://airdrop.isavewallet.org/email_verify",
        },

        bot_text: {
            BOT_WELCOM_AFTER_START: { type: String, default: "USERNAME" },
            BOT_DESCRIPTION: {
                type: String,
                default: "🎉🎉🎉 Chào mừng bạn đến chiến dịch Airdrop",
            },
        },

        remind: {
            beforeHour: {
                type: String,
                default:
                    "Opening event will be start within 60min next, remember your join link to join event. If you don't remember, please press 'Zoom' button",
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

module.exports.DashboardModel =
    mongoose.models.DashboardModel ||
    mongoose.model("dashboard", schemaDashboard);

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
