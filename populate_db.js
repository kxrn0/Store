require("dotenv").config();

const fs = require("fs");
const path = require("path");
const random = require("./utilities/random");
const sxarp = require("sharp");
const dbURI = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.ax9vjdn.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
const Category = require("./models/category");
const Item = require("./models/item");
const root = "./categories";

async function main() {
	await mongoose.connect(dbURI);

	console.log("connected to db");

	populate_database();
}

mongoose.set("strictQuery", false);

main().catch((error) => console.log(error));

function upload_file(path, category) {
	fs.readFile(path, async (error, data) => {
		const thumbnail = await sxarp(data).resize(300).toBuffer();
		const contentType = `image/${path.split(".").at(-1)}`;
		const item = new Item({
			price: random(1, 101),
			category,
			thumbnail: { data: thumbnail, contentType },
			image: { data, contentType },
		});

		await item.save();
	});
}

function create_category(categoryName) {
	fs.readdir(path.join(root, categoryName), async (error, files) => {
		if (error)
			return console.log(
				`ERROR GETTING BACKGROUND: ${error}`
			);

		const background = files.filter((file) => {
			const extension = file.split(".").at(-1);

			return extension === "jpg" || extension === "png";
		})[0];
		const image = fs.readFile(
			path.join(root, categoryName, background),
			async (error, data) => {
				if (error)
					return console.log(
						`ERROR CREATING CATEGORY: ${error}`
					);

				const category = new Category({
					name: categoryName.split("_").join(" "),
					background: {
						data,
						contentType: `image/${background
							.split(".")
							.at(-1)}`,
					},
				});

				await category.save();

				fs.readdir(
					path.join(root, categoryName, "images"),
					(error, files) => {
						if (error)
							return console.log(
								`ERROR READING IMAGES: ${error}`
							);

						files.forEach((file) =>
							upload_file(
								path.join(
									root,
									categoryName,
									"images",
									file
								),
								category
							)
						);
					}
				);
			}
		);
	});
}

function populate_database() {
	fs.readdir(root, (error, files) => {
		if (error) return console.log(`ERROR GETTING INFO: ${error}`);

		const directories = files.filter((file) =>
			fs.statSync(`${root}/${file}`).isDirectory()
		);

		directories.forEach((directory) => create_category(directory));
	});
}
