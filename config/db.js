const mongoose = require("mongoose");

const dataBase = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.set("bufferCommands", false); // This disables buffering

    await mongoose.connect(process.env.URL); // ✅ This line must be awaited!

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ Initial DB connection error:", error);
    throw error; // ⛔ Important! Rethrow so server doesn't start
  }
};
// testing
module.exports = dataBase;
