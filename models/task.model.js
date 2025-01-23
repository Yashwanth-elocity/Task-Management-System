const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
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
      value: ["pending", "in-progress", "completed"],
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
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
