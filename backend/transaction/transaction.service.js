import TransactionTable from "./transaction.model.js";

export const addTransactionHandler = async (req, res) => {
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
};
export const listTransactionHandler = async (req, res) => {
  const limit = req.body.limit ? req.body.limit : 10;
  try {
    const transactions = await TransactionTable.aggregate([
      {
        $match: {
          userId: req.loggedInUser,
        },
      },
      { $limit: limit },
      {
        $lookup: {
          from: "categories", // name of the Category collection in MongoDB (usually plural)
          localField: "category",
          foreignField: "name",
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
};
