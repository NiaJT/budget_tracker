import express from "express";
import { CategoryTable } from "./category.schema.js";
import { isUser } from "../middleware/authentication.middleware.js";
const router = express.Router();
router.get("/list", isUser, async (req, res) => {
  try {
    const categoryList = await CategoryTable.find();
    let categoryIds = {};
    categoryList.map((item) => {
      categoryIds[item.name] = item._id;
    });
    return res.status(200).send({ message: "Success", categoryIds });
  } catch (error) {
    return res.status(505).send({ message: "Internal Server Error" });
    console.log(error.message);
  }
});
export { router as CategoryController };
