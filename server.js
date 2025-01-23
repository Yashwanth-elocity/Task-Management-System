require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const connectDb = require("./db/db.connect");

const Task = require("./models/task.model");

app.get("/", (req, res, next) => {
  res.send("hello world");
});

connectDb()
  .then(() => {
    console.log(`Database Connected successfully`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
