const express = require("express");
const userRouter = express.Router();
const Task = require("../models/task.model");
const userAuthenticated = require("../middlewares/userAuthenticated");
// console.log(userAuthenticated);

userRouter.post("/api/tasks", userAuthenticated, (req, res) => {
  try {
    res.json({ message: "Task added Successfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = userRouter;
