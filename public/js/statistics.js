// var statistics_table = $("#statistics_table").DataTable({
//     responsive: true,
//     dom: "Bfrtip",
//     buttons: ["csv", "excel"],
// });

// $(".buttons-csv, .buttons-excel").addClass("btn btn-primary mr-1");

// $("#statistics_table tfoot th").each(function () {
//     var title = $(this).text();
//     $(this).html('<input type="text" placeholder="Search ' + title + '" />');
// });

// // Apply the search
// statistics_table.columns().every(function () {
//     var that = this;
//     $("input", this.footer()).on("keyup change", function () {
//         if (that.search() !== this.value) {
//             that.search(this.value).draw();
//         }
//     });
// });

// let tableId = Date.now().toString();

$(document).ready(() => {

    var zero_config = $("#statistics_table").DataTable({
        "paging": false,
    })
    // var socket = io();
    // socket.on("statistics", ({ command, payload }) => {
    //     if (command === "getAllReturn") {
    //         console.log(
    //             "reveive statistics with command: getAllReturn",
    //             payload
    //         );

    //         if (payload.tableId.toString() === tableId && payload.total) {
    //             let {
    //                 telegramID,
    //                 fullName,
    //                 email,
    //                 FTTTotal,
    //                 totalTime,
    //                 refTelegramID,
    //                 erc20
    //             } = payload.item;
    //             statistics_table.row
    //                 .add([
    //                     telegramID,
    //                     fullName,
    //                     email,
    //                     FTTTotal,
    //                     totalTime + " min",
    //                     refTelegramID,
    //                     erc20
    //                 ])
    //                 .draw(false);
    //         }
    //     }
    // });

    // socket.on("connect", () => {
    //     socket.emit("join", "statistics");
    //     console.log("socket connected", new Date().toString());
    //     console.log("emiting to get users statistics");
    //     socket.emit("statistics", {
    //         command: "getAll",
    //         payload: {
    //             tableId,
    //         },
    //     });
    // });

    // $("#btn_reload").click(() => {
    //     statistics_table.clear().draw();
    //     socket.emit("statistics", {
    //         command: "getAll",
    //         payload: {
    //             tableId,
    //         },
    //     });
    // });
});
