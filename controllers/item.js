const sxarp = require("sharp");
const binary_to_image = require("../utilities/binary_to_image");
const Item = require("../models/item");
const Category = require("../models/category");
const Customer = require("../models/customer");

exports.add_get = async (req, res, next) => {
	try {
		if (!req.cookies.store_customer) {
			const message =
				"You need to be logged in to add items.";

			return res.redirect(
				`/account/login?errors=${encodeURIComponent(
					message
				)}`
			);
		}

		const categories = await Category.find({}, "name _id");

		res.render("add_item", {
			categories,
		});
	} catch (error) {
		next(error);
	}
};

exports.add_post = async (req, res, next) => {
	try {
		if (req.body.password !== process.env.PASSWORD_OF_CREATION) {
			const categories = await Category.find({}, "name _id");

			return res.render("add_item", {
				errors: "Incorrect Password",
				categories,
			});
		}
		const resized = await sxarp(req.file.buffer)
			.resize({ width: 300 })
			.toBuffer();
		const item = new Item({
			price: req.body.price,
			category: req.body.category,
			thumbnail: {
				data: resized,
				contentType: req.file.mimetype,
			},
			image: {
				data: req.file.buffer,
				contentType: req.file.mimetype,
			},
		});

		await item.save();

		res.redirect(`../categories/${req.body.category}`);
	} catch (error) {
		next(error);
	}
};

exports.page = async (req, res, next) => {
	try {
		if (!req.cookies.store_customer) {
			const message = "Please log in to continue";

			return res.redirect(
				`/account/login?errors=${encodeURIComponent(message)}`
			);
		}
		const customer = await Customer.findOne(
			{ name: req.cookies.store_customer },
			"items"
		);
		const item = await Item.findById(
			req.params.id,
			"price thumbnail"
		);
		const itemData = {
			price: item.price,
			id: item._id,
			thumbnail: binary_to_image(
				item.thumbnail.data,
				item.thumbnail.contentType
			),
			purchased: customer.items.some(
				(item) => item.toString() === req.params.id
			),
		};

		res.render("item", {
			item: itemData,
			credits: req.cookies.credits,
		});
	} catch (error) {
		next(error);
	}
};

exports.full = async (req, res, next) => {
	try {
		const customer = await Customer.findOne(
			{ name: req.cookies.store_customer },
			"credits items"
		);
		const item = await Item.findById(req.params.id, "price");
		const purchased = customer.items.some(
			(item) => item.toString() === req.params.id
		);
		const subs = customer.credits - item.price;

		if (subs >= 0 || purchased) {
			const full = await Item.findById(
				req.params.id,
				"image"
			);

			if (!purchased) {
				customer.credits -= item.price;
				customer.items.push(item._id);
				res.cookie("credits", subs);

				await customer.save();
			}

			res.render("full", {
				image: binary_to_image(
					full.image.data,
					full.image.contentType
				),
				credits: purchased ? req.cookies.credits : subs,
			});
		} else res.render("insufficient");
	} catch (error) {
		next(error);
	}
};

exports.get_delete_item = async (req, res, next) => {
	res.render("delete_item", { errors: req.query.errors });
};

exports.post_delete_item = async (req, res, next) => {
	const password = req.body.password;

	if (password !== process.env.PASSWORD_OF_CREATION) {
		const message = "Wrong Password.";

		return res.redirect(
			`/item/delete/${
				req.params.id
			}?errors=${encodeURIComponent(message)}`
		);
	}

	try {
		const customers = await Customer.find({ items: req.params.id });

		customers.forEach(
			(customer) =>
				(customer.items = customer.items.filter(
					(item) =>
						item.toString() !==
						req.params.id
				))
		);

		await Promise.all(customers.map((customer) => customer.save()));

		await Item.findByIdAndDelete(req.params.id);

		res.redirect("/");
	} catch (error) {
		next(error);
	}
};
