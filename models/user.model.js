const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
    },
    username: {
      type: String,
      trim: true,
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
