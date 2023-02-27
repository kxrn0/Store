const binary_to_image = require("../utilities/binary_to_image");
const random = require("../utilities/random");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

exports.account = async (req, res, next) => {
	if (!req.cookies.store_customer) return res.render("not_logged_in");

	try {
		const customer = await Customer.findOne({
			name: req.cookies.store_customer,
		}).populate("items", "thumbnail");
		const thumbData = customer.items.map((item) => ({
			thumbnail: binary_to_image(
				item.thumbnail.data,
				item.thumbnail.contentType
			),
			id: item._id,
		}));

		res.render("account", { customer, items: thumbData });
	} catch (error) {
		next(error);
	}
};

exports.update_account = async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const newPassword = req.body["new-password"];
		const customer = await Customer.findOne({
			name: req.cookies.store_customer,
		}).populate("items", "thumbnail");
		const thumbData = customer.items.map((item) => ({
			thumbnail: binary_to_image(
				item.thumbnail.data,
				item.thumbnail.contentType
			),
			id: item._id,
		}));
		const passwordMatch = await bcrypt.compare(
			password,
			customer.hash
		);
		let alert, errors;

		alert = null;
		errors = null;

		if (passwordMatch) {
			const newHash = await bcrypt.hash(newPassword, 12);

			customer.name = name;
			customer.hash = newHash;
			res.cookie("store_customer", name);
			alert = "Credentials updated successfully.";

			await customer.save();
		} else errors = "Wrong password, please try again.";

		res.render("account", {
			customer,
			items: thumbData,
			errors,
			alert,
		});
	} catch (error) {
		next(error);
	}
};

exports.get_log_in = (req, res, next) => {
	if (req.cookies.store_customer) return res.redirect("/");

	res.render("form", { title: "Log In", errors: req.query.errors });
};

exports.post_log_in = async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const customer = await Customer.findOne({ name });

		if (!customer) {
			const message =
				"Username not found in the database, please sign up to continue.";

			return res.redirect(
				`/account/signup?errors=${encodeURIComponent(
					message
				)}`
			);
		}

		const passwordMatch = await bcrypt.compare(
			password,
			customer.hash
		);

		if (!passwordMatch) {
			const message = "Wrong password.";

			return res.redirect(
				`?errors=${encodeURIComponent(message)}`
			);
		}
		res.cookie("store_customer", name);
		res.cookie("credits", customer.credits);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
};

exports.get_sign_up = (req, res, next) => {
	if (req.cookies.store_customer) return res.redirect("/");

	res.render("form", { title: "Sign Up", errors: req.query.errors });
};

exports.post_sign_up = async (req, res, next) => {
	try {
		const { name, password } = req.body;
		const existing = await Customer.findOne({ name });

		if (existing) {
			const message = "Username already taken.";

			return res.redirect(
				`?errors=${encodeURIComponent(message)}`
			);
		}

		const hash = await bcrypt.hash(password, 12);
		const customer = new Customer({ name, hash });

		await customer.save();

		res.cookie("store_customer", name);
		res.cookie("credits", customer.credits);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
};

exports.get_credits = (req, res, next) => {
	if (!req.cookies.store_customer) {
		const message =
			"You need to be logged in to access this place.";

		return res.redirect(
			`/account/login?errors=${encodeURIComponent(message)}`
		);
	}

	res.render("get_credits", { credits: req.cookies.credits });
};

exports.post_credits = async (req, res, next) => {
	try {
		const customer = await Customer.findOne({
			name: req.cookies.store_customer,
		});
		const credits = random(0, 25);

		customer.credits += credits;
		await customer.save();

		console.log(`GOT ${credits} CREDITS!`);

		res.cookie("credits", customer.credits);
		res.render("credits_page", {
			credits: customer.credits,
			wonCredits: credits,
		});
	} catch (error) {
		next(error);
	}
};

exports.log_out = (req, res, next) => {
	res.clearCookie("store_customer");
	res.clearCookie("credits");

	res.redirect("/");
};
