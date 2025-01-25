const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minLength: 3,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: `{Value not supported}`,
      },
      default: "pending",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => {
          return value >= new Date();
        },
        message: "Date must be from the future",
      },
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
