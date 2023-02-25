const binary_to_image = require("../utilities/binary_to_image");
const Category = require("../models/category");
const Item = require("../models/item");

exports.page = async (req, res, next) => {
	try {
		const categories = await Category.find(
			{},
			"name background"
		).sort({
			creationDate: -1,
		});
		const catData = categories.map((cat) => ({
			name: cat.name,
			id: cat._id,
			background: binary_to_image(
				cat.background.data,
				cat.background.contentType
			),
		}));

		res.render("index", {
			categories: catData,
			credits: req.cookies.credits,
		});
	} catch (error) {
		next(error);
	}
};

exports.home_add = (req, res, next) => res.render("add");

exports.add_get = (req, res, next) => {
	if (req.cookies.store_customer)
		return res.render("add_category", { errors: req.query.errors });

	const message = "Please log in to make a category.";

	res.redirect(`/account/login?errors=${encodeURIComponent(message)}`);
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
	try {
		const [category, items] = await Promise.all([
			Category.findById(req.params.id),
			Item.find(
				{ category: req.params.id },
				"price thumbnail"
			).sort({
				creationDate: 1,
			}),
		]);

		const catData = {
			name: category.name,
			background: binary_to_image(
				category.background.data,
				category.background.contentType
			),
			id: req.params.id,
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
	} catch (error) {
		next(error);
	}
};

exports.get_delete_category = async (req, res, next) => {
	try {
		const [category, items] = await Promise.all([
			Category.findById(req.params.id),
			Item.find({ category: req.params.id }),
		]);
		const itemsData = items.map((item) => ({
			id: item._id,
			src: binary_to_image(
				item.thumbnail.data,
				item.thumbnail.contentType
			),
		}));

		res.render("delete_category", {
			items: itemsData,
			errors: req.query.errors,
		});
	} catch (error) {
		next(error);
	}
};

exports.post_delete_category = async (req, res, next) => {
	const password = req.body.password;

	if (password !== process.env.PASSWORD_OF_CREATION) {
		const message = "Wrong password.";

		return res.redirect(
			`/categories/delete/${req.params.id}?errors=${encodeURIComponent(
				message
			)}`
		);
	}
	try {
		await Category.findByIdAndRemove(req.params.id);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
};
