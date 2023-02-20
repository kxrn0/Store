const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	hash: { type: String, required: true },
	credits: { type: Number, required: true, default: 0 },
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = mongoose.model("Customer", customerSchema);
