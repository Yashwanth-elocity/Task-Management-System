const Joi = require("joi");

const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9@$!%*?&#]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.",
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
  firstName: Joi.string().optional().min(3).max(10),
  lastName: Joi.string().optional().min(1).max(30),
});

const checkSignUpData = (req) => {
  const options = { abortEarly: false };
  const response = signUpSchema.validate(req.body, options);
  console.log(response);

  // console.log(response.error.details);
  if (response.error !== undefined) {
    const errorMessages = response.error.details.map(
      (detail) => detail.message
    );
    console.log(errorMessages);
    throw new Error(errorMessages.join("` "));
  }
};

module.exports = { checkSignUpData };
