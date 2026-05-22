const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Helper function to recalculate and update a user's budget
const syncBudget = async (userId) => {
  const expenses = await Expense.find({ user: userId });
  const spentAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  let budget = await Budget.findOne({ user: userId });
  if (!budget) {
    budget = new Budget({
      user: userId,
      budgetLimit: 1000000, // Default 10 Lakhs
    });
  }

  budget.spentAmount = spentAmount;
  budget.remainingAmount = budget.budgetLimit - spentAmount;
  await budget.save();
  return budget;
};

/**
 * @desc    Get user's budget limit and details
 * @route   GET /api/budgets
 * @access  Private
 */
exports.getBudget = asyncHandler(async (req, res, next) => {
  const budget = await syncBudget(req.user._id);

  res.status(200).json(
    new ApiResponse({
      message: "Budget fetched successfully",
      data: budget
    })
  );
});

/**
 * @desc    Set/update user's budget limit
 * @route   POST /api/budgets
 * @access  Private
 */
exports.updateBudgetLimit = asyncHandler(async (req, res, next) => {
  const { budgetLimit } = req.body;

  if (budgetLimit === undefined || isNaN(budgetLimit) || Number(budgetLimit) < 0) {
    return next(new ApiError(400, "Please provide a valid budget limit."));
  }

  let budget = await Budget.findOne({ user: req.user._id });
  if (!budget) {
    budget = new Budget({
      user: req.user._id,
    });
  }

  budget.budgetLimit = Number(budgetLimit);
  await budget.save();

  const updatedBudget = await syncBudget(req.user._id);

  res.status(200).json(
    new ApiResponse({
      message: "Budget limit updated successfully",
      data: updatedBudget
    })
  );
});

/**
 * @desc    Get all expenses for the user
 * @route   GET /api/budgets/expenses
 * @access  Private
 */
exports.getExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

  res.status(200).json(
    new ApiResponse({
      message: "Expenses fetched successfully",
      data: expenses
    })
  );
});

/**
 * @desc    Add a new expense record
 * @route   POST /api/budgets/expenses
 * @access  Private
 */
exports.createExpense = asyncHandler(async (req, res, next) => {
  const { category, amount, note, date } = req.body;

  if (!category || amount === undefined || isNaN(amount) || Number(amount) <= 0) {
    return next(new ApiError(400, "Category and a valid positive amount are required."));
  }

  const expense = await Expense.create({
    user: req.user._id,
    category,
    amount: Number(amount),
    note: note || "",
    date: date || new Date()
  });

  // Sync the budget
  await syncBudget(req.user._id);

  res.status(201).json(
    new ApiResponse({
      message: "Expense recorded successfully",
      data: expense
    })
  );
});

/**
 * @desc    Delete an expense record
 * @route   DELETE /api/budgets/expenses/:id
 * @access  Private
 */
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(new ApiError(404, "Expense record not found"));
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, "Not authorized to delete this expense"));
  }

  await expense.deleteOne();

  // Sync the budget
  await syncBudget(req.user._id);

  res.status(200).json(
    new ApiResponse({
      message: "Expense deleted successfully",
      data: null
    })
  );
});
