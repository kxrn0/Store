const express = require("express");
const router = express.Router();
const binary_to_image = require("../utilities/binary_to_image");
const customerController = require("../controllers/customer");
const Customer = require("../models/customer");
const Item = require("../models/item");

router.get("/", customerController.account);

router.post("/", customerController.update_account);

router.get("/login", customerController.get_log_in);

router.post("/login", customerController.post_log_in);

router.get("/signup", customerController.get_sign_up);

router.post("/signup", customerController.post_sign_up);

router.get("/get_credits", customerController.get_credits);

router.post("/get_credits", customerController.post_credits);

router.get("/logout", customerController.log_out);

module.exports = router;
