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
        $project: {
          _id: 0,
          title: 1,
          currentBalance: 1,
          savingPlan: 1,
          currentSavings: 1,
          period: 1,
          description: 1,
        },
      },
    ]);
    if (!budgetPlan) {
      return res
        .status(200)
        .send({ message: "Budget Plan doesn't exist. Try creating one" });
    }
    return res
      .status(200)
      .send({ message: "Loaded Budget Plan Successfully", budgetPlan });
  } catch (error) {}
};
