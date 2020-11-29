var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
    const ref = req.query.ref;
    if (ref) {
        return res.render("invite", { ref });
    }
    res.redirect("/invite?ref=default");
});

router.post("/new", function (req, res, next) {
    console.log(req.body);
    res.json(req.body);
});

module.exports = router;
