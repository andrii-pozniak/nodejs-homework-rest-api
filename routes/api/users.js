const express = require('express');
const ctrlUsers = require("../../controllers/signup");
const { auth } = require("../../middleware/auth");
const upload = require("../../middleware/multerConfig");

const { validationUser, validateToggleSubscription, validationVerifyEmail } = 
require("../../middleware/validationUserSchema");

const router = express.Router();

router.post('/signup', validationUser, ctrlUsers.signup);

router.post('/login', validationUser, ctrlUsers.login);

router.post("/verify", validationVerifyEmail, ctrlUsers.resendVerifyEmail )

router.get('/logout', auth, ctrlUsers.logout);

router.get('/verify/:verificationToken', ctrlUsers.verifyEmail)

router.patch("/subscription", auth, validateToggleSubscription, ctrlUsers.updateSubscription)

router.patch("/avatars", auth, upload.single("avatar"), ctrlUsers.updateAvatar);

module.exports = router;
