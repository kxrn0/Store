const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	res.render("form", {title: "Sign Up"});
});

router.post("/", (req, res, next) => {});

module.exports = router;
