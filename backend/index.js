import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./connectDB.js";
import { UserController } from "./user/user.controller.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use("/user",UserController);
await connectDB();
app.listen(PORT, () => {
  console.log(`App is listening at port:${PORT}`);
});
