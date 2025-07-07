import express from "express";
import { isUser } from "../middleware/authentication.middleware.js";
import { validateReqbody } from "../middleware/validate.reqbody.js";
import { transactionValidationSchema } from "./transaction.validation.js";
import TransactionTable from "./transaction.model.js";
import { CategoryTable } from "../category/category.schema.js";
import {
  addTransactionHandler,
  listTransactionHandler,
} from "./transaction.service.js";
const router = express.Router();
router.post(
  "/add",
  validateReqbody(transactionValidationSchema),
  isUser,
  addTransactionHandler
);

router.get("/list", isUser, listTransactionHandler);

export default router;

export { router as TransactionController };
