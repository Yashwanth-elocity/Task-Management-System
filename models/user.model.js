const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
    },
    lastName: {
      type: String,
      minLength: 3,
    },
    username: {
      type: String,
      required: true,
      minLength: 3,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
