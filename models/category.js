const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
	name: { type: String, required: true },
	background: { data: mongoose.Schema.Types.Buffer, contentType: String },
	creationDate: { type: Date, default: Date.now },
});

categorySchema.virtual("url").get(function () {
	return `/categories/${this._id}`;
});

module.exports = mongoose.model("Category", categorySchema);
