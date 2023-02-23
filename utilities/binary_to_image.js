module.exports = function binary_to_image(bin, contentType) {
	const base64 = Buffer.from(bin).toString("base64");

	return `data:${contentType};base64,${base64}`;
};
