const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", (req, res, next) => {
	if (req.cookies.store_customer)
		return res.render("add_category", { errors: req.query.errors });

	const message = "Please log in to make a category.";

	res.redirect(`../login?errors=${encodeURIComponent(message)}`);
});

router.post("/", upload.single("background"), async (req, res, next) => {
	try {
		const password = req.body.password;

		if (password !== process.env.PASSWORD_OF_CREATION) {
			const message = "Wrong password, please try again.";

			return res.redirect(
				`?errors=${encodeURIComponent(message)}`
			);
		}

		const category = new Category({
			name: req.body.name,
			background: {
				data: req.file.buffer,
				contentType: req.file.mimetype,
			},
		});

		await category.save();

		res.redirect("/");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
