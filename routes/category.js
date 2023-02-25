const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const binary_to_image = require("../utilities/binary_to_image");
const Category = require("../models/category");
const Item = require("../models/item");

router.get("/", categoryController.page);

router.get("/add", categoryController.home_add);

router.get("/category/add", categoryController.add_get);

router.post(
	"/category/add",
	upload.single("background"),
	categoryController.add_post
);

router.get("/delete/:id", categoryController.get_delete_category);

router.post("/delete/:id", categoryController.post_delete_category);

router.get("/:id", categoryController.get_category);

module.exports = router;
