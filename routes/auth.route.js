const express = require("express");

const authRouter = express.Router();
const User = require("../models/user.model");
const { checkSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const checkvalidUser = require("../middlewares/checkvalidUser");

authRouter.post("/api/register", async (req, res) => {
  try {
    // validating signup data from payload
    checkSignUpData(req);

    const { username, password } = req.body;

    const request = req.body;
    const userExists = await User.findOne({ username: request.username });
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
    res.json({ data: savedUser, message: "user registered successfully" });
  } catch (error) {
    res.json({
      message: "Unexpected error occured",
      errors: { list: error.message.split("`") },
    });
  }
});

authRouter.post("/api/login", checkvalidUser, (req, res) => {
  try {
    res.send({ message: "login Successful" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "unexpected error occured", error: error.message });
  }
});

authRouter.post("/api/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "Logged Out Sucessfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "unexpected error occured", error: error.message });
  }
});

module.exports = authRouter;
