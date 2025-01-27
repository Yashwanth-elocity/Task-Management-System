const express = require("express");
const userRouter = express.Router();
const Task = require("../models/task.model");
const userAuthenticated = require("../middlewares/userAuthenticated");
const { checkTaskData } = require("../utils/validations");
const mongoose = require("mongoose");
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

userRouter.get("/api/tasks/:id", userAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // const taskExists = await Task.findById({ _id: id });
    const taskExists = await Task.findById(new mongoose.Types.ObjectId(id));
    if (!taskExists) {
      return res
        .status(404)
        .json({ message: "Task Not found", data: taskExists });
    }

    res.json({ message: "ok", data: taskExists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.get("/api/tasks", userAuthenticated, async (req, res) => {
  try {
    const queryFilters = req.query;
    console.log(queryFilters);

    const allowedQueries = ["status", "dueDate", "sortBy", "order"];
    const queryKeys = Object.keys(queryFilters);

    const isValid =
      queryKeys.every((key) => allowedQueries.includes(key)) &&
      queryKeys.length <= allowedQueries.length;

    if (!isValid) {
      throw new Error("Query parameters not supported");
    }

    const {
      status,
      dueDate,
      sortBy = "createdAt",
      order = "asc",
    } = queryFilters;

    const filter = {
      ...(status && { status }),
      ...(dueDate && { dueDate }),
    };

    const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort({ [sortBy]: sortOrder });

    console.log(tasks);
    res.json({ message: "All Tasks fetched", data: tasks });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unexpected error occurred", error: error.message });
  }
});

userRouter.delete("/api/tasks/:id", userAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // check if tasks exists to delete it
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ message: "Task Doesn't Exist To delete" });
    }

    const deletedTask = await Task.findByIdAndDelete({ _id: id });
    res.json({ message: "ok", data: deletedTask });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unexpected Error Occured", error: error.message });
  }
});

userRouter.put("/api/tasks/:id", userAuthenticated, async (req, res) => {
  try {
    // Check task data
    checkTaskData(req);

    const { id } = req.params;

    // check if Task Exists or not
    const taskExists = await Task.findById({ _id: id });
    if (!taskExists) {
      return res.status(404).json({ message: "Task Not found to Update" });
    }

    // if exists update the task
    const { title, description, status, dueDate } = req.body;

    const newTask = {
      title,
      ...(description && { description: req.body.description }),
      ...(status && { status: req.body.status }),
      ...(dueDate && { dueDate: req.body.dueDate }),
    };

    console.log(newTask);

    const updatedTask = await Task.findByIdAndUpdate({ _id: id }, newTask, {
      returnDocument: "after",
      runValidators: true,
    });

    res.json({ message: "Task Updated Successfully", data: updatedTask });
  } catch (error) {
    if (typeof error !== String) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({
        message: "Unexpected error occured",
        errors: { list: error.message.split("`") },
      });
    }
  }
});

module.exports = userRouter;
