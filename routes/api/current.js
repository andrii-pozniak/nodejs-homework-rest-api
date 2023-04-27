const express = require("express");
const ctrlUsers = require("../../controllers/signup");
const { auth } = require("../../middleware/auth");

const router = express.Router();

router.get("/current", auth, ctrlUsers.getCurrent);

module.exports = router;
