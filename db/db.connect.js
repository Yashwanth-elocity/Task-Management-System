const mongoose = require("mongoose");

async function connectDb() {
  try {
    return await mongoose.connect(process.env.DB_URI || "");
  } catch (error) {
    console.error(`Error: `, error);
  }
}

module.exports = connectDb;
