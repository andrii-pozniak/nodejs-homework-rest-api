const { User } = require('../model/user');
const { Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Conflict("$Email in use")
        }
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const avatarURL = gravatar.url(email);
        const result = await User.create({ email, password: hashPassword, avatarURL });
        
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
            user: {  email }
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
        const avatarURL =  `${HOST}/avatars/${imageName}`;
        console.log(avatarURL)
        await User.findByIdAndUpdate(req.user._id, { avatarURL });
        res.json({ avatarURL });

    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }
};

module.exports = {
    signup,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar
};