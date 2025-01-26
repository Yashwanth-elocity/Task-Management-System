const Joi = require("joi");

const signUpSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
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
  firstName: Joi.string().trim().optional().min(3).max(10),
  lastName: Joi.string().trim().optional().min(1).max(30),
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

const StatusEnum = ["pending", "In-progress", "completed"];

const taskDataSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(30).messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 30 characters.",
  }),
  description: Joi.string().optional().trim().min(3).messages({
    "string.min": "Description must be at least 3 characters long.",
  }),
  status: Joi.string()
    .optional()
    .trim()
    .valid(...StatusEnum)
    .insensitive()
    .messages({
      "any.only":
        "Status must be one of PENDING, APPROVED, or REJECTED (case-insensitive).",
    }),
  dueDate: Joi.string()
    .optional()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/) // Regex to match yyyy-mm-dd format
    .custom((value, helpers) => {
      // Check if the date is a valid date and in the future
      const date = new Date(value);
      if (isNaN(date)) {
        return helpers.message(
          '"dueDate" must be a valid date in yyyy-mm-dd format'
        );
      }
      if (date <= new Date()) {
        return helpers.message(
          '"dueDate" must be a date in the future (yyyy-mm-dd format)'
        );
      }
      return value;
    })
    .message({
      "string.base": '"dueDate" must be a string',
      "string.pattern.base": '"dueDate" must be in the format yyyy-mm-dd',
    }),
});

const checkTaskData = (req) => {
  const options = { abortEarly: false };
  const response = taskDataSchema.validate(req.body, options);
  console.log(response);
  if (response.error !== undefined) {
    const errorMessages = response.error.details.map(
      (detail) => detail.message
    );
    console.log(errorMessages);
    throw new Error(errorMessages.join("` "));
  }
};

module.exports = { checkSignUpData, checkTaskData };
