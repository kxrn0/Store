const mongoose = require("mongoose");
const itemSchema = mongoose.Schema({
	price: { type: Number, required: true },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
	thumbnail: { data: Buffer, contentType: String },
	image: { data: Buffer, contentType: String },
	creationDate: { type: Date, default: Date.now },
});
