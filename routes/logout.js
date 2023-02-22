const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	res.clearCookie("store_customer");

	res.redirect("/");
});

module.exports = router;
