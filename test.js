


// // const sgMail = require('@sendgrid/mail')
// // sgMail.setApiKey("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") //mail

// const { resolve } = require("tinyurl");

// // const msg = {
// //     to: 'thanhdatppro@gmail.com', // Change to your recipient
// //     from: 'admin@airdrop.conin.ai', // Change to your verified sender
// //     subject: 'Sending with SendGrid is Fun',
// //     text: 'and easy to do anywhere, even with Node.js',
// //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// // }
// // sgMail
// //     .send(msg)
// //     .then(() => {
// //         console.log('Email sent')
// //     })
// //     .catch((error) => {
// //         console.error(error)
// //         console.error(error.response.body)
// //     })


// // var nodemailer = require("nodemailer");

// // async function main() {
// //     let transporter = nodemailer.createTransport({
// //         host: "mail.smtp2go.com",port: 587,secure: false, 
// //         auth: {
// //             user: "zo", // generated ethereal user
// //             pass: "cTU2cjVkNmRwbjAw", // generated ethereal password
// //             // user: "AKIARM5645MV2MGGLT6D", // generated ethereal user
// //             // pass: "BGruOS0EnRc3xZ00Y7MXndjqKpXp3Q8NREXzcfkeY4Zw", // generated ethereal password
// //         },
// //     });

// //     let info = await transporter.sendMail({

// //         from: 'Conin Airdrop Verify <no_reply@airdrop.conin.ai>',
// //         to: "patrickvie98@gmail.com", // list of receivers
// //         subject: "Hello ✔", // Subject line
// //         html: "<b>Hello world?</b>", 
// //     });
// //     console.log("Message sent: %s", info.messageId);
// // }
// // async function main() {
// //     let transporter = nodemailer.createTransport({
// //         host: "in-v3.mailjet.com", port: 587, secure: false,
// //         auth: {
// //             // user: "patrickvie98@gmail.com", // generated ethereal user
// //             // pass: "mTZDpHOY7UJcQxBL", // generated ethereal password
// //             user: "3a8bb8f1f188dbd4cc59d2c138b87c00", // generated ethereal user
// //             pass: "364f4bd60798d49c62e97fdbd8fdf0b6", // generated ethereal password
// //             // user: "AKIARM5645MV2MGGLT6D", // generated ethereal user
// //             // pass: "BGruOS0EnRc3xZ00Y7MXndjqKpXp3Q8NREXzcfkeY4Zw", // generated ethereal password
// //         },
// //     });

// //     let info = await transporter.sendMail({

// //         from: 'Conin Airdrop Verify <no_reply@jet.conin.ai>',
// //         to: "patrickvie98@gmail.com", // list of receivers
// //         subject: "Hello ✔", // Subject line
// //         html: "<b>Hello world?</b>",
// //     });
// //     console.log("Message sent: %s", info.messageId);
// // }

// // main().catch(console.error);

// let count = 0;
// let countb = 0;


// let fakeDB = [];
// let sent = new Set();

// ((num) => {
//     for (let i = 0; i < num; i++) {
//         let ranId = Math.round(Math.random() * (99999999 - 10000000) + 10000000);
//         // console.log("ranId", ranId);
//         sent.add(ranId);

//         fakeDB.push(ranId)
//     }
// })(10)



// // console.log(fakeDB);



// let moment = require("moment");

// let sendMessageAsync = async (id) => {

//     console.log(" start send to ", id, " at", new moment().format("HH:MM:ss:SS"));
//     sent.delete(id);
//     console.log(sent);
//     setTimeout(() => {
//         console.log("sent to", id, new moment().format("HH:MM:ss:SS"));
//     }, 300)
// }

// let countid = 0;
// // let send = setInterval(async () => {

// //     sendMessageAsync(fakeDB[countid]);
// //     ++countid;
// //     if (countid > fakeDB.length - 1) clearInterval(send)

// // }, 3)

// let z = new Set([1, 3, 4, 5, 3]);
// for (let i = 0; i < 10; i++) {
//     z.add(i);
// }

// console.log(z);



// while (z.size !== 0) {
//     let z_iterator = z.values();
//     let id = z_iterator.next().value;
//     z.delete(id);
//     console.log(id, z);
//     console.log();
// }


// console.log(z.values().next());



// let a = {
//     "keyboard": [1,2,32,332]
// }


// let b = {
//     reply:a
// }


// console.log(b);
const TelegramBot = require("node-telegram-bot-api");
const queryString = require('query-string');
let bot = new TelegramBot("1492427487:AAFyxSUDMt1iomndZGs1Ku0qsZrmcQxa0dw", { polling: true, });
let i
let time = Date.now()
let c = 0
bot.on("message", async (...parameters) => {
    console.log(parameters);
    console.log(parameters[0].from.id, parameters[0].text);
    let id = parameters[0].from.id

    bot.sendMessage(id, `Hello FULLNAME,\nGreat news coming🎉🎉!!\n\nYou have invited REFCOUNT referrals successfully. Only REFNEED referral(s) to go to get $5 IST bonus\nInvite more to get bigger profit!\n\n🥉 Achieve 25 referrals, you will get $5 IST extra\n 🥈 Achieve 75 referrals, you will get $15 IST extra\n 🏅 Achieve 150 referrals, you will get $50 IST extra\n 🛰 Achieve 500 referrals, you will get $100 IST extra\nDon't forget to complete all tasks to claim rewards
`).then(a => console.log(a))
    // bot.sendPhoto(id, "image/bonus.jpeg",{caption: 

    // `📣📣NEW BONUS RELEASED🎉🎉✨
    // Invite your friends to get more profits

    //  🥉 Achieve 25 referrals, you will get $5 IST extra
    //  🥈 Achieve 75 referrals, you will get $15 IST extra
    //  🏅 Achieve 150 referrals, you will get $50 IST extra
    //  🛰 Achieve 500 referrals, you will get $100 IST extra
    // Don't forget to complete all tasks to claim rewards`
    // }).then(a=>{
    //     console.log(a);
    // }).catch(e=>{
    //     console.log(e);
    // })

})


/*-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAh7NhQdIsXpVVm0Ow2JQWF2F8mClIJrYToP42jw6XdVoo6+SX
tiO8ZwDybZmWvSa0GPWs5joto/TS5KuK2Kkt5ETv3I65YAicmWBydfcsDxuUrARI
on+ZKNBfOrnh6Hi5F0DuaRa90vovWs3kzeoMwwNHfVJzt1KjNaN0c9CyB3TJ2fUb
1gUc/wqb/kJnGTsMLx/QKWCGuZuNwxh8NYSDe3PvXYTPSxfqX/u570bmVZNqpNV1
CqcxlxtaRLh4aARJCDywg9pKradu2OCNqgeDRQmE8AcoLY7wb1LqfSjqj2vrqu+H
348lZL7aKAaTpdtSHjVnDWL2xALiaToYJYJg7wIDAQABAoIBADtlqvZylnU4DGaP
tIK4HwtQ4oZ/21MGc4UOgLcRff4h3rOSNU3GSpsTcQnEJpTYshASyQFlCcEwUndB
Ft9K/glim1MBLeb5HgKMks1LyX87ZVH99gUasOGKg4RjBJ0K6olhJHnfOGt2ku++
G55+CeP6NXqHcpsVktbRmxFukd5s/xeTTXA3ghXYTr60muV/26f+lspp06BSv9ig
ooPIRvsyfXY1qujxKrDz/a+HJAf5JbI+oTsKa5TqDmdQ62uLugcTpyVeQF4Pc9FW
mq3EU6kaMzcUuY/AID41o0mb8vYrgRPeaT+pbhuJfMllc/gJiH68M/F6ZOUYNEpZ
oehwnWECgYEAvLPz/vLkyIyjzeQXry9PNXc08VfIbbA4rrj67uECveSq/JOH+B6m
8dLCrw77sATlz4nge4J8FGucC9+Pu7Pk4TA8iDwuCQqGtPANt0SD+NzFKL1YsxpG
zirl3x61DdlydhZmPQFfVVLmr6VnfMB4gu1TJGYmO0wcDv29rGOC93kCgYEAuBh4
wnireThtJ2OMLKQ798Zof5s0V7N/CNiZf8waJ6coHD6iiQurv8HDM5Mp0lqghqN6
BYdsAVmjgklADvZ9oZyoTi5QzaxW1/6vI/Zl/R/NvJX9m/+dl5mQY4dwe9QZM1Ub
iFHEYpi/FgxNVNo8Msz2TE/m4MaxUl7r4c6BOacCgYAkHZDiR5yP4ZLsMe5ygex4
ACOq2TEsBSEkF5U3KOt8aoprItVQIJW1DLBkDssO6jENoobLPLMAuYO5JgV9WDXC
/5dmP5ZT9qbHdHY7kCpt89rsLCkQxkOs67rpFBh02Rw2C51vqZaUXvR1w4Nl9fRa
oo9aFQ7WJH/uQpQNrVIAiQKBgQCrc78j/xZT80VVZdTqzpo7DMHN9lItS7KIHpH2
/7NsMrWceIkPcZsnH+IYanqMunK+cgn2lET2jPFHKclLJi2jEi99gI0ov9SxnTSo
HZamw7PsaxSi8NFom1BqIX2VFdfSgvT9ZImt+ewdMJ/k4ssl1NWeBNxVgzcqK9Ur
nBOmCQKBgGQ7k9V//0NqrnnpvuVLzateBfm5BHid0nKPIcOHNkzChINjWv6UR3+T
7b5lLXRGh9Np0mWq6oCWVfC8j6S5k4mlSbwUXNqIvlmoNr+yjVQm22q9BOhJs80g
tPEcnNnzUJ0Uby2e2O0GMQ+ML40OP/3KTr9pt3qfDDeOhME/SJQ8
-----END RSA PRIVATE KEY-----*/