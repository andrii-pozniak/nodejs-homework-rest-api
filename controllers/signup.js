const { User } = require('../model/user');
const { Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
    // console.log(req.body)
    try {
        const { email, password } = req.body;
        // console.log(req.body)
        const user = await User.findOne({ email });
        if (user) {
            throw new Conflict("$Email in use")
        }
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        const result = await User.create({ email, password: hashPassword });
        // console.log(result)
        res.status(201).json(result)
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
         await User.findByIdAndUpdate(user._id, {token})       
        return res.status(200).json({ token })
    } catch (error) {
        next(error)
    }
};

const getCurrent = async (req, res) => {
    const { name, email } = req.user;
    res.status(200).json({
        data: {
            user: { name, email }
        }
    })
};

const logout = async(req, res) => {
const {_id} = req.user;
await User.findByIdAndUpdate(_id, {token: null});
res.status(204).json();
};

const updateSubscription = async(req, res) => {
    try {
        const {_id, email} = req.user;
      const {subscription} = req.body;
      await User.findByIdAndUpdate(_id, {subscription}, { new: true });         
      return res.status(200).json({
            email,
            subscription            
        })
    
    } catch (error) {
        
    }
  }

module.exports = {
    signup,
    login,
    getCurrent,
    logout,
    updateSubscription
};