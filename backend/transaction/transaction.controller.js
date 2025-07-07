import express from "express";
import { isUser } from "../middleware/authentication.middleware.js";
import { validateReqbody } from "../middleware/validate.reqbody.js";
import { transactionValidationSchema } from "./transaction.validation.js";
import TransactionTable from "./transaction.model.js";
import { CategoryTable } from "../category/category.schema.js";
const router = express.Router();
router.post(
  "/add",
  validateReqbody(transactionValidationSchema),
  isUser,
  async (req, res) => {
    try {
      const transactionDetail = req.body;
      transactionDetail.userId = req.loggedInUser;
      await TransactionTable.create(transactionDetail);
      return res.status(200).send({
        message: "Successfully added transaction detail",
        transactionDetail,
      });
    } catch (error) {
      return res
        .status(505)
        .send({ message: "Couldn't add transaction. Internal Server Error" });
      console.log(error.message);
    }
  }
);

router.get("/list", isUser, async (req, res) => {
  try {
    const transactions = await TransactionTable.aggregate([
      {
        $match: {
          userId: req.loggedInUser,
        },
      },
      {
        $lookup: {
          from: "categories", // name of the Category collection in MongoDB (usually plural)
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          title: 1,
          type: 1,
          amount: 1,
          "category.name": "$categoryDetails.name",
          "category.icon": "$categoryDetails.icon",
          "category.type": "$categoryDetails.type",
        },
      },
    ]);

    if (transactions.length === 0) {
      return res.status(200).send({
        message: "You do not have any transactions yet",
        transactions: [],
      });
    }

    res.status(200).send({
      message: "Loaded transactions successfully",
      transactions,
    });
  } catch (error) {
    console.error("Aggregation error:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;

export { router as TransactionController };
