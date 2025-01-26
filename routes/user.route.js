const express = require("express");
const userRouter = express.Router();
const Task = require("../models/task.model");
const userAuthenticated = require("../middlewares/userAuthenticated");
const { checkTaskData } = require("../utils/validations");
// console.log(userAuthenticated);

userRouter.post("/api/tasks", userAuthenticated, async (req, res) => {
  try {
    checkTaskData(req);
    const { title, description, status, dueDate } = req.body;

    const request = req.body;
    const TaskPayload = {
      title,
      ...(request?.description && { description: request.description }),
      ...(request?.status && { description: request.status }),
      ...(request?.dueDate && { description: request.dueDate }),
    };

    const task = new Task(TaskPayload);
    const savedTask = await task.save();
    console.log(savedTask);
    res.json({ data: savedTask, message: "Task added Successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Unexpected error occured",
      errors: { list: error.message.split("`") },
    });
  }
});

module.exports = userRouter;
