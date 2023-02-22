const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	hash: { type: String, required: true },
	credits: { type: Number, required: true, default: 10 },
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item", default: [] }],
});

module.exports = mongoose.model("Customer", customerSchema);
