const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
	name: { type: String, required: true },
	background: { data: Buffer, contentType: String, required: true },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);
