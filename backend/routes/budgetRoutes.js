const express = require("express");
const router = express.Router();
const {
  getBudget,
  updateBudgetLimit,
  getExpenses,
  createExpense,
  deleteExpense
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

// All budget routes require authentication
router.use(protect);

router.route("/")
  .get(getBudget)
  .post(updateBudgetLimit);

router.route("/expenses")
  .get(getExpenses)
  .post(createExpense);

router.route("/expenses/:id")
  .delete(deleteExpense);

module.exports = router;
