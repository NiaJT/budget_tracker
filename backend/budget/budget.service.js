import { BudgetTrackerTable } from "./budget.model.js";

export const budgetPlanAdder = async (req, res) => {
  try {
    let budgetPlan = req.body;
    budgetPlan.userId = req.loggedInUser;
    const plan = await BudgetTrackerTable.findOne({ userId: req.loggedInUser });
    if (plan) {
      return res.status(404).send({ message: "Budget Plan already exists" });
    }
    await BudgetTrackerTable.create(budgetPlan);

    res.status(200).send({ message: "Successfully added budget plan" });
  } catch (error) {
    res.status(505).send({ message: "Internal Server Error" });
    console.log(error.message);
  }
};
export const getBudgetPlan = async (req, res) => {
  try {
    const budgetPlan = await BudgetTrackerTable.aggregate([
      {
        $match: {
          userId: req.loggedInUser,
        },
      },
      {
        $lookup: {
          from: "users", // name of the Category collection in MongoDB (usually plural)
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          currentBalance: 1,
          savingPlan: 1,
          currentSavings: 1,
          period: 1,
          description: 1,
          userInfo: {
            firstName: "$userDetails.firstName",
            lastName: "$userDetails.lastName",
            userId: "$userDetails._id",
          },
        },
      },
    ]);
    if (budgetPlan.length === 0) {
      return res
        .status(200)
        .send({ message: "Budget Plan doesn't exist. Try creating one" });
    }
    return res
      .status(200)
      .send({ message: "Loaded Budget Plan Successfully", budgetPlan });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
export const budgetPlanUpdate = async (req, res) => {
  try {
    const updates = req.body;

    // Attach userId from auth middleware
    const userId = req.loggedInUser;

    // Find the plan first
    const plan = await BudgetTrackerTable.findOne({ userId });
    if (!plan) {
      return res.status(404).send({ message: "Budget Plan doesn't exist" });
    }

    // Update by plan._id
    await BudgetTrackerTable.findByIdAndUpdate(plan._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({ message: "Successfully updated budget plan" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
export const removeBudgetPlan = async (req, res) => {
  try {
    const userId = req.loggedInUser;

    const plan = await BudgetTrackerTable.findOne({ userId });
    if (!plan) {
      return res.status(404).send({ message: "Budget Plan doesn't exist" });
    }

    await BudgetTrackerTable.findByIdAndDelete(plan._id);

    res.status(200).send({ message: "Successfully removed budget plan" });
  } catch (error) {
    console.error("Error removing budget plan:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
