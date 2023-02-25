const express = require("express");
const itemController = require("../controllers/item");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/add", itemController.add_get);

router.post("/add", upload.single("content"), itemController.add_post);

router.get("/:id", itemController.page);

router.get("/:id/full", itemController.full);

router.get("/delete/:id", itemController.get_delete_item);

router.post("/delete/:id", itemController.post_delete_item);

module.exports = router;
