var express = require("express");
var router = express.Router();
let mongoose = require("mongoose")
let DashboardModel = mongoose.model("DashboardModel")
let UsersModel = mongoose.model("DashboardModel")
let passport = require("passport");
var apiRouter = require("../routes/api");
let { getStatstics } = require("../controllers/userControllers");
var sparkles = require("sparkles")();

function authChecker(req, res, next) {
    console.log((req.path));
    if (req.path === "/webhook") next();
    else if (req.path === "/fake") next();
    else if (req.path === "/sendcustom") {
        sparkles.emit("sendCustom", { body: req.body });
        res.send("ok");
        return;
    }
    else if (req.isAuthenticated()) next();
    else res.redirect("/login");
}
passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
    DashboardModel.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

router.use("/api", authChecker, apiRouter);

router.get("/", authChecker, function (req, res, next) {
    res.render("settings");
});


router.get("/email_verify", async (req, res) => {
    if (req.query.code && req.query.telegramID) {
        console.log(req.query);
        let { code, telegramID } = req.query;
        telegramID = telegramID.replace(/\D/g, "");

        try {
            let user = await UsersModel
                .findOne({
                    telegramID,
                })
                .exec();
            if (user) {
                if (user.mail.verifyCode === code && !user.mail.isVerify) {
                    user.mail.verifyCode = "";
                    user.mail.isVerify = true;
                    user.mail.verifiedAt = Date.now();
                    user.registerFollow.passAll = true;
                    user.registerFollow.log = "step4";
                    user.registerFollow.step3 = {
                        isPass: true,
                        isWaitingEnterEmail: false,
                        isWaitingVerify: false,
                    };

                    user.registerFollow.step4.isTwitterOK = false;

                    await user.save();
                    console.log(telegramID, "was verified with code", code);
                    sparkles.emit("email_verify_success", {
                        telegramID: req.query.telegramID,
                    });
                    res.redirect("https://t.me/" + bot_username);
                    return;
                } else {
                    res.send(
                        "An error when verify your email, please enter /resend to send email again  or enter /mail to change your mail"
                    );
                    return;
                }
            }
            {
                res.send(
                    "An error when verify your email, please enter /resend to send email again  or enter /mail to change your mail"
                );
                return;
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        res.redirect("https://conin.ai");
    }
});

router.get("/login", function (req, res, next) {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res, next) {
        res.redirect("/settings");
    }
);

router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/login");
});

router.get("/settings", authChecker, (req, res) => {
    res.render("settings");
});

router.get("/users", authChecker, async function (req, res, next) {
    const page = parseInt(req.query.page || 1);
    const limit = 100;
    const skip = (page - 1) * limit;
    const totalDocuments = await UsersModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const range = [];
    const rangerForDot = [];
    const detal = 1;

    const left = page - detal;
    const right = page + detal;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            range.push(i);
        }
    }

    let temp;
    range.map((i) => {
        if (temp) {
            if (i - temp === 2) {
                rangerForDot.push(i - 1);
            } else if (i - temp !== 1) {
                rangerForDot.push("...");
            }
        }
        temp = i;
        rangerForDot.push(i);
    });

    const users = await UsersModel.find().sort({ "webminarLog.totalTime": -1 }).limit(limit).skip(skip);

    res.render("users", {
        users,
        range: rangerForDot,
        page,
        totalPages,
    });

    return;
});
router.get("/statistics", authChecker, async function (req, res, next) {

    const page = parseInt(req.query.page || 1);
    const limit = 200;
    const skip = (page - 1) * limit;
    const totalDocuments = await UsersModel.find({
        "registerFollow.step4.isTwitterOK": true,
        "webminarLog.isEnough30min": true
    }).countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const range = [];
    const rangerForDot = [];
    const detal = 1;
    const left = page - detal;
    const right = page + detal;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            range.push(i);
        }
    }
    let temp;
    range.map((i) => {
        if (temp) {
            if (i - temp === 2) {
                rangerForDot.push(i - 1);
            } else if (i - temp !== 1) {
                rangerForDot.push("...");
            }
        }
        temp = i;
        rangerForDot.push(i);
    });

    let users = await UsersModel.find({
        "registerFollow.step4.isTwitterOK": true,
        "webminarLog.isEnough30min": true,
    }, {
        telegramID: 1,
        fullName: 1,
        refTelegramID: 1,
        "mail.email": 1,
        "wallet.erc20": 1
    }).sort({ "webminarLog.totalTime": -1 }).limit(limit).skip(skip);

    let toSendUsers = [];


    for (let i = 0; i < users.length; i++) {
        let { telegramID, fullName, refTelegramID } = users[i];
        let email = users[i].mail.email;
        let erc20 = users[i].wallet.erc20;
        console.time("one")
        let getStatstics_back = await getStatstics({
            telegramID
        });
        let FTTTotal, totalTime;
        if (!getStatstics_back.result) {
            FTTTotal = 0;
            totalTime = 0;
        } else {
            FTTTotal = getStatstics_back.FTTTotal
            totalTime = (Math.round(getStatstics_back.totalTime / 1000) / 60).toFixed(1);
        }

        let toReturn = {
            telegramID,
            fullName,
            email,
            FTTTotal,
            totalTime,
            refTelegramID,
            erc20
        }

        console.log(toReturn);
        console.timeEnd("one")

        toSendUsers.push(toReturn)
    }




    res.render("statistics", {
        users: toSendUsers,
        range: rangerForDot,
        page,
        totalPages,
    });
    return;

});

module.exports = router;
