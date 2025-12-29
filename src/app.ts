import cors from "cors";
import express from "express";
import { router } from "./routes";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to travel-360 backend 🚀",
  });
});

export default app;
