import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://travel-360:travel-360@travel-360.glkqyae.mongodb.net/travel-360DB?appName=travel-360"
    );
    console.log("Connected to Travel-360 DB!");
    server = app.listen(5000, () => {
      console.log("app is listing");
    });
  } catch (error) {}
};

startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
