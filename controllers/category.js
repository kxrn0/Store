const binary_to_image = require("../utilities/binary_to_image");
const Customer = require("../models/customer");
const Category = require("../models/category");
const Item = require("../models/item");

exports.page = async (req, res, next) => {
	const categories = await Category.find({}, "name background").sort({
		creationDate: -1,
	});
	const catData = categories.map((cat) => ({
		name: cat.name,
		url: cat.url,
		background: binary_to_image(
			cat.background.data,
			cat.background.contentType
		),
	}));

	res.render("index", {
		categories: catData,
		credits: req.cookies.credits,
	});
};

exports.add_get = (req, res, next) => {
	if (req.cookies.store_customer)
		return res.render("add_category", { errors: req.query.errors });

	const message = "Please log in to make a category.";

	res.redirect(`../login?errors=${encodeURIComponent(message)}`);
};

exports.add_post = async (req, res, next) => {
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
};

exports.get_category = async (req, res, next) => {
	const [category, items] = await Promise.all([
		Category.findById(req.params.id),
		Item.find({ category: req.params.id }, "price thumbnail").sort({
			creationDate: 1,
		}),
	]);

	const catData = {
		name: category.name,
		background: binary_to_image(
			category.background.data,
			category.background.contentType
		),
	};
	const itemData = items.map((item) => ({
		price: item.price,
		thumbnail: binary_to_image(
			item.thumbnail.data,
			item.thumbnail.contentType
		),
		id: item._id,
	}));

	res.render("category", {
		category: catData,
		items: itemData,
		credits: req.cookies.credits,
	});
};
