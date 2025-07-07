import express from "express";
import { validateReqbody } from "../middleware/validate.reqbody.js";
import { budgetPlanValidationSchema } from "./budget.validation.js";
import { budgetPlanAdder, getBudgetPlan } from "./budget.service.js";
import { isUser } from "../middleware/authentication.middleware.js";
const router = express.Router();
router.post(
  "/add",
  isUser,
  validateReqbody(budgetPlanValidationSchema),
  budgetPlanAdder
);
router.get("/myplan", isUser, getBudgetPlan);
export { router as budgetPlanController };
