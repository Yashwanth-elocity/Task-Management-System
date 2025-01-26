const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkvalidUser = async (req, res, next) => {
  const request = req.body;

  const { username, password } = request;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please Provide username and password" });
  }
  //check if username exists in the database
  const userExists = await User.findOne({ username: request.username });

  // console.log(userExists);

  if (!userExists) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  //   check if password is correct
  const user = userExists;

  console.log(user);
  const isPassword = await bcrypt.compare(password, user.password);

  console.log(isPassword);
  if (!isPassword) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // Create a JWt token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  console.log(token);

  // send that in response through a cookie to the user allowing him to login

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    expires: expiryDate,
  });

  // also provide an expiry time for the token
  // (To prevent browsers from deleting the cookie as soon as browser is closed even though token is valid)
  next();
};

module.exports = checkvalidUser;
