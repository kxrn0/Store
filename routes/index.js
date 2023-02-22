const express = require("express");
const router = express.Router();
const Category = require("../models/category");

/* GET home page. */
router.get("/", async (req, res, next) => {
	const categories = await Category.find({}, "name background");
	const catData = categories.map((cat) => {
		const base64 = Buffer.from(cat.background.data).toString("base64");

		return {
			name: cat.name,
			background: `data:${cat.background.contentType};base64,${base64}`,
			url: cat.url
		};
	});

	res.render("index", {
		categories: catData,
		store_customer: req.cookies.store_customer,
	});
});

module.exports = router;
