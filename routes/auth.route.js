const express = require("express");

const authRouter = express.Router();
const User = require("../models/user.model");
const { checkSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const checkvalidUser = require("../middlewares/checkvalidUser");

authRouter.post("/register", async (req, res) => {
  res;
  try {
    // validating signup data from payload
    checkSignUpData(req);

    const { username, password } = req.body;

    const request = req.body;
    const userExists = await User.findOne({ username: request.username });
    4;
    if (userExists) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const userPayload = {
      username,
      password: hashedPassword,
      ...(request?.firstName && { firstName: request.firstName }),
      ...(request?.lastName && { lastName: request.lastName }),
    };

    const user = new User(userPayload);
    console.log(user);
    const savedUser = await user.save();
    console.log(savedUser);
    res.json({ data: user, message: "user registered successfully" });
  } catch (error) {
    res.json({
      message: "Unexpected error occured",
      errors: { list: error.message.split("`") },
    });
  }
});

authRouter.post("/login", checkvalidUser, (req, res) => {
  try {
    res.send({ message: "login Successful" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "unexpected error occured", error: error.message });
  }
});
module.exports = authRouter;
