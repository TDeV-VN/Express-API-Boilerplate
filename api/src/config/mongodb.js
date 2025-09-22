import mongoose from "mongoose";
import { env } from "./environment.js";
import { myLogger } from "~/loggers/myLogger.js";

export const CONNECT_DB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    // --- Các sự kiện cần theo dõi ---
    db.on("error", (err) => {
      myLogger.error("MongoDB connection error:", err);
    });

    db.on("reconnected", () => {
      myLogger.info("MongoDB reconnected!");
    });

    db.on("disconnected", () => {
      myLogger.error("MongoDB disconnected!");
    });
  } catch (error) {
    myLogger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};
