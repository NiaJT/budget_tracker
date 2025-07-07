import express from "express";
import { validateReqbody } from "../middleware/validate.reqbody.js";
import { budgetPlanValidationSchema } from "./budget.validation.js";
import {
  budgetPlanAdder,
  budgetPlanUpdate,
  getBudgetPlan,
  removeBudgetPlan,
} from "./budget.service.js";
import { isUser } from "../middleware/authentication.middleware.js";
const router = express.Router();
router.post(
  "/add",
  isUser,
  validateReqbody(budgetPlanValidationSchema),
  budgetPlanAdder
);
router.get("/myplan", isUser, getBudgetPlan);
router.post(
  "/update",
  isUser,
  validateReqbody(budgetPlanValidationSchema),
  budgetPlanUpdate
);
router.delete("/delete", isUser, removeBudgetPlan);
export { router as budgetPlanController };
