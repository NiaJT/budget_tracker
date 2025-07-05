import express from "express";
import { loginController, registerController } from "./user.service.js";
import { validateReqbody } from "../middleware/validate.reqbody.js";
import { registerUserSchema } from "./user.validation.js";
const router = express.Router();
router.post("/login", loginController);
router.post(
  "/register",
  validateReqbody(registerUserSchema),
  registerController
);
export { router as UserController };
