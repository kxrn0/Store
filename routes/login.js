const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

router.get("/", (req, res, next) => {
	if (req.cookies.store_customer) return res.redirect("/");

	res.render("form", { title: "Log In", errors: req.query.errors });
});

router.post("/", async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const customer = await Customer.findOne({ name });

		if (!customer) {
			const message =
				"username not found in the database, please sign up to continue";

			return res.redirect(
				`../signup?errors=${encodeURIComponent(
					message
				)}`
			);
		}

		const passwordMatch = await bcrypt.compare(password, customer.hash);

		if (!passwordMatch) {
			const message = "wrong password";

			return res.redirect(
				`?errors=${encodeURIComponent(message)}`
			);
		}
		res.cookie("store_customer", name);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
