const express = require('express');
const ctrlUsers = require("../../controllers/signup");
const { auth } = require("../../middleware/auth")

const { validationUser, validateToggleSubscription } = require("../../middleware/validationUserSchema");

const router = express.Router();

router.post('/signup', validationUser, ctrlUsers.signup);

router.post('/login', validationUser, ctrlUsers.login);

router.get('/logout', auth, ctrlUsers.logout);

router.patch("/subscription", auth, validateToggleSubscription, ctrlUsers.updateSubscription)

module.exports = router;
