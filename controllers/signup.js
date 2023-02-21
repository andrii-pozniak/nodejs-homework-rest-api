const { User } = require('../model/user');
const { Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { sendEmail } = require("../helpers/sendEmail");
const { v4: uuidv4 } = require('uuid');

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Conflict("$Email in use")
        }
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const avatarURL = gravatar.url(email);
        const verificationToken = uuidv4();
        const result = await User.create({ email, password: hashPassword, avatarURL, verificationToken });
        const mail = {
            to: email,
            subject: "website registration confirmation",
            html: `<a href="localhost:3000/api/users/verify/${verificationToken}">click to confirm registration</a>`
        }
        await sendEmail(mail);
        res.status(201).json({
            email,
            subscription: result.subscription,
            avatarURL
        })
    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Unauthorized(`"${email} is wrong"`)
        }
        const passwordCompare = bcrypt.compareSync(password, user.password);
        if (!passwordCompare) {
            throw new Unauthorized(`"${password} is wrong"`)
        }
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
        await User.findByIdAndUpdate(user._id, { token })
        return res.status(200).json({ token })
    } catch (error) {
        next(error)
    }
};

const getCurrent = async (req, res) => {
    const { email } = req.user;
    res.status(200).json({
        data: {
            user: { email }
        }
    })
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
};

const updateSubscription = async (req, res) => {
    try {
        const { _id, email } = req.user;
        const { subscription } = req.body;
        await User.findByIdAndUpdate(_id, { subscription }, { new: true });
        return res.status(200).json({
            email,
            subscription
        })

    } catch (error) {

    }
};

const avatarDir = path.join(__dirname, "../", "public", "avatars")
const updateAvatar = async (req, res) => {
    const HOST = "http://localhost:3000";
    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const imageName = `${id}_${originalname}`
    try {

        const resultUpdate = path.join(avatarDir, imageName);

        await fs.rename(tempUpload, resultUpdate);
        const avatarURL = `${HOST}/avatars/${imageName}`;
        console.log(avatarURL)
        await User.findByIdAndUpdate(req.user._id, { avatarURL });
        res.json({ avatarURL });

    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        return res.status(404).json({
            massage: "User not found"
        })
    }
    await User.findByIdAndUpdate(user.id, { verify: true, verificationToken: "" });
    res.status(200).json({
        massage: 'Verification successful'
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            massage: "missing required field email"
        });
    };
    if (user.verify) {
        return res.status(400).json({
            massage: "Verification has already been passed"
        });
    }
    const mail = {
        to: email,
        subject: "website registration confirmation",
        html: `<a href="localhost:3000/api/users/verify/${user.verificationToken}">click to confirm registration</a>`
    }
    await sendEmail(mail);
    res.json({
        massage: "Email verify send"
    })
}

module.exports = {
    signup,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail

};