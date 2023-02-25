const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Category = require("./models/category");
const Item = require("./models/item");

// Set up mongoose connection
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Define function to upload an image to the database
async function uploadImage(imagePath, contentType, category) {
	const image = fs.readFileSync(imagePath);
	const thumbnail = await sharp(image).resize(200).toBuffer();
	const item = new Item({
		price: Math.floor(Math.random() * 100) + 1,
		category,
		thumbnail: { data: thumbnail, contentType },
		image: { data: image, contentType },
	});
	await item.save();
}

// Define function to create a category and upload images to it
async function createCategory(categoryName) {
	const category = new Category({ name: categoryName });
	await category.save();

	const categoryDir = path.join(__dirname, "categories", categoryName);
	const files = fs.readdirSync(categoryDir);

	for (const file of files) {
		const filePath = path.join(categoryDir, file);
		const contentType = mime.getType(filePath);
		await uploadImage(filePath, contentType, category._id);
	}
}

// Define function to iterate over categories and create them
async function createCategories() {
	const categoriesDir = path.join(__dirname, "categories");
	const categories = fs.readdirSync(categoriesDir);

	for (const category of categories) {
		await createCategory(category);
	}
}

// Call createCategories function to start the process
createCategories()
	.then(() => {
		console.log("Done!");
		mongoose.connection.close();
	})
	.catch((err) => {
		console.error(err);
		mongoose.connection.close();
	});
