const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

router.get("/", (req, res, next) => {
	if (req.cookies.store_customer) return res.redirect("/");
	res.render("form", { title: "Sign Up", errors: req.query.errors });
});

router.post("/", async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const existing = await Customer.findOne({ name });

		if (existing) {
			const message = "username already taken";

			return res.redirect(
				`?errors=${encodeURIComponent(message)}`
			);
		}

		const hash = await bcrypt.hash(password, 12);
		const customer = new Customer({ name, hash });

		await customer.save();

		res.cookie("store_customer", name);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
