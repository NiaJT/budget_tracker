import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./connectDB.js";
import { UserController } from "./user/user.controller.js";
import cors from "cors";
import { CategoryTable } from "./category/category.schema.js";
import { CategoryController } from "./category/category.controller.js";
import { TransactionController } from "./transaction/transaction.controller.js";
import { budgetPlanController } from "./budget/budget.controller.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json());
app.use("/user", UserController);
app.use("/category", CategoryController);
app.use("/transaction", TransactionController);
app.use("/budget", budgetPlanController);
await connectDB();

app.listen(PORT, () => {
  console.log(`App is listening at port:${PORT}`);
});
