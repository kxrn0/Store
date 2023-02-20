const express = require("express");
const router = express.Router();
const Category = require("../models/category");

/* GET home page. */
router.get("/", async (req, res, next) => {
	const categories = await Category.find({});

	console.log("categories:");
	console.log(categories);
	console.log("---------------");
	res.render("index", {
		categories,
		store_customer: req.cookies.store_customer,
	});
});

module.exports = router;
