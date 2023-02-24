const binary_to_image = require("../utilities/binary_to_image");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");

exports.account = async (req, res, next) => {
	if (!req.cookies.store_customer) return res.render("not_logged_in");

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
		let message;

		if (passwordMatch) {
			const newHash = await bcrypt.hash(newPassword, 12);

			customer.name = name;
			customer.hash = newHash;
			res.cookie("store_customer", name);
			errors = "Credentials updated successfully.";

			await customer.save();
		} else errors = "Wrong password, please try again.";

		res.render("account", { customer, items: thumbData, errors });
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
				`?errors=${encodeURIComponent(message)}`
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

		return res.redirect(`/login?errors=${encodeURIComponent}`);
	}

	res.render("get_credits");
};

exports.post_credits = async (req, res, next) => {
	
}

exports.log_out = (req, res, next) => {
	res.clearCookie("store_customer");
	res.clearCookie("credits");

	res.redirect("/");
};
