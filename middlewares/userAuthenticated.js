const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const redisClient = require("../redis/redisConfig");

const userAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized Access Please Login!" });
    }

    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(tokenData);

    // Check if user is present or not bymistake if loginned in then token will be present but user wont exist in such case we should not authenticate to protected apis

    const { _id } = tokenData;

    const cachedUser = await redisClient.get(`user:${_id}`);
    console.log(cachedUser);

    if (cachedUser) {
      console.log("🚀 Serving User from Cache");
      req.user = JSON.parse(cachedUser);
      return next();
    }

    const userExists = await User.findById(_id);
    console.log(userExists);

    if (!userExists) {
      await redisClient.del(`user:${_id}`);
      return res
        .status(401)
        .json({ message: "Unauthorized Access Please Login!!" });
    }
    req.user = userExists;
    next();
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

module.exports = userAuthenticated;
