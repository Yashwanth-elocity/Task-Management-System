require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const connectDb = require("./db/db.connect");

const Task = require("./models/task.model");

const authRouter = require("./routes/auth.route");

app.use("/", authRouter);

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
