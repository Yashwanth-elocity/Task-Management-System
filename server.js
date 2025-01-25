require("dotenv").config();

const express = require("express");
const app = express();

const cookieparser = require("cookie-parser");
app.use(cookieparser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const connectDb = require("./db/db.connect");

const Task = require("./models/task.model");

const authRouter = require("./routes/auth.route");

const userRouter = require("./routes/user.route");

app.use("/", authRouter);
app.use("/", userRouter);

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
