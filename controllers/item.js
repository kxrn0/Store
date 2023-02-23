const sxarp = require("sharp");
const Item = require("../models/item");
const Category = require("../models/category");

exports.add_get = async (req, res, next) => {
	console.log(Item)
	try {
		const categories = await Category.find({}, "name _id");

		res.render("add_item", { categories });
	} catch (error) {
		next(error);
	}
};

exports.add_post = async (req, res, next) => {
	try {
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
			image: { data: req.file.buffer, contentType: req.file.mimetype },
		});

		await item.save();

		//res.redirect(`../categories/${req.body.category}`);
		res.redirect("/");
	} catch (error) {
		next(error);
	}
};
