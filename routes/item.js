const express = require("express");
const itemController = require("../controllers/item");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/add", itemController.add_get);

router.post("/add", upload.single("content"), itemController.add_post);

module.exports = router;
