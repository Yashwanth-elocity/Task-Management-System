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
    if (Object.keys(queryFilters).length === 0) {
      const allTasks = await Task.find({});
      console.log(allTasks);
      return res.json({ message: "All Tasks Fetched", data: allTasks });
    }
    const allowedQueries = ["status", "dueDate"];
    const queryObject = req.query;

    const queryKeys = Object.keys(queryObject);
    const isValid =
      queryKeys.every((key) => allowedQueries.includes(key)) &&
      queryKeys.length <= allowedQueries.length;

    if (!isValid) {
      throw new Error("QueryParameters not supported");
    }
    const { status, dueDate } = queryFilters;

    // if (status) {
    //   const filteredTasks = await Task.find({ status: status });
    //   console.log(filteredTasks);
    //   return res.json({ message: "All Tasks fetched", data: filteredTasks });
    // }
    // if (dueDate) {
    //   const filteredTasks = await Task.find({ dueDate: dueDate });
    //   console.log(filteredTasks);
    //   return res.json({ message: "All Tasks fetched", data: filteredTasks });
    // }
    if (status || dueDate) {
      const filteredTasks = await Task.find({
        ...(status && { status: status }),
        ...(dueDate && { dueDate: dueDate }),
      });
      console.log(filteredTasks);
      return res.json({ message: "All Tasks fetched", data: filteredTasks });
    }
    res.json({ message: "ok" });
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
