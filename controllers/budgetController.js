const Budget = require("../models/Budget");

// @desc    Get user's budgets
// @route   GET /api/budget
// @access  Private
const getMyBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new budget
// @route   POST /api/budget
// @access  Private
const createBudget = async (req, res) => {
  try {
    const { totalBudget, eventType } = req.body;

    if (!totalBudget || !eventType) {
      return res.status(400).json({ message: "Please provide total budget and event type" });
    }

    const budget = new Budget({
      user: req.user._id,
      totalBudget,
      remainingAmount: totalBudget,
      eventType,
    });

    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget (add expense)
// @route   PUT /api/budget/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const { spentAmount } = req.body;
    const budget = await Budget.findById(req.params.id);

    if (budget) {
      if (budget.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this budget" });
      }

      budget.spentAmount += Number(spentAmount);
      budget.remainingAmount = budget.totalBudget - budget.spentAmount;

      const updatedBudget = await budget.save();
      res.json(updatedBudget);
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budget/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (budget) {
      if (budget.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this budget" });
      }

      await Budget.deleteOne({ _id: budget._id });
      res.json({ message: "Budget removed" });
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};