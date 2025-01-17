const Joi = require("joi");

const validationRegister = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string().optional(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    subscription: Joi.string(),
    token: Joi.string(),
  });
  const validationSchemaJoi = userSchema.validate(req.body);
  if (validationSchemaJoi.error) {
    return res.status(404).json({ status: validationSchemaJoi.error.message });
  }
  next();
};

const validationUser = (req, res, next) => {
  const userSchema = Joi.object({
    name: Joi.string().optional(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    subscription: Joi.string(),
    token: Joi.string(),
  });
  const validationSchemaJoi = userSchema.validate(req.body);
  if (validationSchemaJoi.error) {
    return res.status(404).json({ status: validationSchemaJoi.error.message });
  }
  next();
};

const validateToggleSubscription = (req, res, next) => {
  const addSchema = Joi.object({
    subscription: Joi.valid("starter", "pro", "business").required(),
  });
  const validationSchemaJoi = addSchema.validate(req.body);
  if (validationSchemaJoi.error) {
    return res.status(400).json({ message: "Invalid subscription field" });
  }

  next();
};

const validationVerifyEmail = (req, res, next) => {
  const verifySchema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });
  const verifyEmail = verifySchema.validate(req.body);
  if (verifyEmail.error) {
    return res.status(400).json({ message: "Invalid subscription field" });
  }

  next();
};

module.exports = {
  validationUser,
  validationRegister,
  validateToggleSubscription,
  validationVerifyEmail,
};
