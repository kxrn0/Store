const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const Category = require("../models/category");
const Item = require("../models/item");

router.get("/", categoryController.page);

router.get("/add", (req, res, next) => {
	res.render("add");
});

router.get("/category/add", categoryController.add_get);

router.post(
	"/category/add",
	upload.single("background"),
	categoryController.add_post
);

router.get("/:id", async (req, res, next) => {
	const [category, items] = await Promise.all([
		Category.findById(req.params.id),
		Item.find({ category: req.params.id }),
	]);

	console.log("category:");
	console.log(category);
	console.log("items:");
	console.log(items);

	//res.send("hi");
	res.render("category", { category, items });
});

module.exports = router;
