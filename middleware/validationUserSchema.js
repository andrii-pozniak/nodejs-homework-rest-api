const Joi = require('joi');

const validationUser = (req, res, next) => {
    const userSchema = Joi.object({
        password: Joi.string()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        subscription: Joi.string(),
        token: Joi.string()
    });
    const validationSchemaJoi = userSchema.validate(req.body);
    if (validationSchemaJoi.error) {
        return res.status(404).json({ status: validationSchemaJoi.error.message });
    };
    next();
};

const validateToggleSubscription = (req, res, next) => {
        const addSchema = Joi.object({
        subscription: Joi.valid("starter", "pro", "business").required()
    });
    const validationSchemaJoi = addSchema.validate(req.body);
    if (validationSchemaJoi.error) {
        return res.status(400).json({ message: "Invalid subscription field" });
    }

    next();
};

module.exports = {
    validationUser,
    validateToggleSubscription
}

