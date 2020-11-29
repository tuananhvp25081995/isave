// var zero_config = $("#zero_config").DataTable({
//     // scrollY: "80vh",
//     // scrollX: false,
//     // scrollCollapse: true,
//     dom: "Bfrtipl",
//     lengthMenu: [
//         [100, 25, 50, -1],
//         [100, 25, 50, "All"],
//     ],
//     buttons: ["csv", "excel"],
//     columns: [
//         { data: "telegramID" },
//         { data: "fullName" },
//         { data: "email" },
//         { data: "isVerify" },
//         { data: "inviteLogsCount" },
//         { data: "totalTime" },
//         { data: "isEnough30min", searchable: false },
//         { data: "refTelegramID" },
//         { data: "erc20" },
//         { data: "joinDate", searchable: false },
//     ],
//     fixedColumns: true,
// });

// $("#zero_config tfoot th").each(function () {
//     var title = $(this).text();
//     $(this).html('<input type="text" placeholder="Search ' + title + '" />');
// });

// zero_config.columns().every(function () {
//     var that = this;
//     $("input", this.footer()).on("keyup change", function () {
//         if (that.search() !== this.value) {
//             that.search(this.value).draw();
//         }
//     });
// });

function loadDataToScheduleTable() {
    console.time("loading all schedule take ");
    $.get("/api/getalluser", (result) => {
        console.log(result);
        zero_config.clear();
        zero_config.rows.add(result.result);
        zero_config.draw();
        console.timeEnd("loading all schedule take ");
    });
}

$(document).ready(function () {
    // $(".buttons-csv, .buttons-excel").addClass("btn btn-primary mr-1");

    // loadDataToScheduleTable();

    var zero_config = $("#zero_config").DataTable({
        "paging": false,
    })
});
