const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	res.render("account", { store_customer: req.cookies.store_customer });
});

module.exports = router;
