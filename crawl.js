let XLSX = require('xlsx');
require("./js/datebase").connect();

let { UserModel } = require("./js/Models/users");


let workbook = XLSX.readFile('report.xlsx');
let worksheet = workbook.Sheets["85124394379"];
// console.log(worksheet);

let a = async () => {

    for (let i = 17; i <= 2359; i++) {
        let email = worksheet["E" + i].v;
        let time = worksheet["J" + i].v;
        console.log(email, time);
        try {
            let user = await UserModel.findOne({ "mail.email": email });
            if (!user) user = new UserModel({ telegramID: 1 });
            user.webminarLog.reportTime = Number(user.webminarLog.reportTime + Number(time))
            await user.save();
        } catch (e) {
            console.log(e);
        }
    }
}


a();