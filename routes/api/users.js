const express = require("express");
const ctrlUsers = require("../../controllers/signup");
const { auth } = require("../../middleware/auth");
const upload = require("../../middleware/multerConfig");

const {
  validationRegister,
  validationUser,
  validateToggleSubscription,
} = require("../../middleware/validationUserSchema");

const router = express.Router();

router.post("/signup", validationRegister, ctrlUsers.signup);

router.post("/login", validationUser, ctrlUsers.login);


router.post("/logout", auth, ctrlUsers.logout);

router.get("/verify/:verificationToken", ctrlUsers.verifyEmail);

router.patch(
  "/subscription",
  auth,
  validateToggleSubscription,
  ctrlUsers.updateSubscription
);

router.patch("/avatars", auth, upload.single("avatar"), ctrlUsers.updateAvatar);

module.exports = router;
