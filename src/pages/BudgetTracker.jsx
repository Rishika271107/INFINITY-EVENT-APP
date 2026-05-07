import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Trash2, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BudgetTracker.css";

const CATEGORY_OPTIONS = [
  "Venue",
  "Catering",
  "Decoration",
  "Photography",
  "Makeup",
  "Fashion Designing",
  "Tourist Places",
  "Other",
];

const COLORS = [
  "#c7a12c",
  "#25a856",
  "#cf3d3d",
  "#3b7ddd",
  "#d27a35",
  "#9b5de5",
  "#24b6a6",
  "#b8b8b8",
];

function BudgetTracker() {
  const navigate = useNavigate();

  const [totalBudget, setTotalBudget] = useState(() => {
    const savedBudget = localStorage.getItem("eventTotalBudget");
    if (savedBudget !== null) {
      const parsedBudget = Number(savedBudget);
      if (!Number.isNaN(parsedBudget) && parsedBudget > 0) {
        return parsedBudget;
      }
    }
    return 1000000;
  });
  
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  
  const [budgetInput, setBudgetInput] = useState(() => {
    const savedBudget = localStorage.getItem("eventTotalBudget");
    if (savedBudget !== null) {
      const parsedBudget = Number(savedBudget);
      if (!Number.isNaN(parsedBudget) && parsedBudget > 0) {
        return parsedBudget.toString();
      }
    }
    return "1000000";
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const defaultExpenses = [
    { id: 1, category: "Venue", amount: 250000, note: "The Taj Palace" },
    { id: 2, category: "Catering", amount: 150000, note: "Grand Kitchen" },
    { id: 3, category: "Decoration", amount: 80000, note: "Royal Floral Studio" },
    { id: 4, category: "Photography", amount: 50000, note: "Premium Shoot Team" },
  ];

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("eventExpenses");
    if (savedExpenses) {
      try {
        return JSON.parse(savedExpenses);
      } catch {
        console.log("Invalid saved expenses data");
        return defaultExpenses;
      }
    }
    return defaultExpenses;
  });

  useEffect(() => {
    localStorage.setItem("eventExpenses", JSON.stringify(expenses));
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const remainingBudget = totalBudget - totalSpent;

  const usedPercentage =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const chartData = useMemo(() => {
    const grouped = {};

    expenses.forEach((item) => {
      grouped[item.category] =
        (grouped[item.category] || 0) + Number(item.amount);
    });

    return Object.keys(grouped).map((category, index) => ({
      name: category,
      value: grouped[category],
      color: COLORS[index % COLORS.length],
    }));
  }, [expenses]);

  const pieBackground = useMemo(() => {
    if (chartData.length === 0 || totalSpent === 0) {
      return "#252525";
    }

    let current = 0;

    const segments = chartData.map((item) => {
      const start = current;
      const percent = (item.value / totalSpent) * 100;
      current += percent;

      return `${item.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${segments.join(", ")})`;
  }, [chartData, totalSpent]);

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);

    if (!newBudget || newBudget <= 0) {
      alert("Please enter a valid total budget.");
      return;
    }

    setTotalBudget(newBudget);
    localStorage.setItem("eventTotalBudget", newBudget.toString());
    setIsEditingBudget(false);
  };

  const handleAddExpense = () => {
    const amount = Number(amountInput);

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: selectedCategory,
      amount,
      note: noteInput.trim() || "No note",
    };

    setExpenses((prev) => [...prev, newExpense]);
    setSelectedCategory("");
    setAmountInput("");
    setNoteInput("");
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="budget-page">
      <button className="budget-back" onClick={() => navigate("/user/home")}>
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      <h1 className="budget-title">Budget Tracker</h1>

      <div className="budget-layout">
        <div className="budget-left">
          <div className="budget-stat-card">
            <div className="budget-card-top">
              <p>Total Budget</p>
              <button onClick={() => setIsEditingBudget(!isEditingBudget)}>
                {isEditingBudget ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditingBudget ? (
              <div className="budget-input-row">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter total budget"
                />
                <button onClick={handleSaveBudget}>Save</button>
              </div>
            ) : (
              <h2 className="gold-text">
                ₹{totalBudget.toLocaleString("en-IN")}
              </h2>
            )}
          </div>

          <div className="budget-stat-card">
            <p>Total Spent</p>
            <h2 className="red-text">₹{totalSpent.toLocaleString("en-IN")}</h2>
          </div>

          <div className="budget-stat-card">
            <p>Remaining</p>
            <h2 className={remainingBudget >= 0 ? "green-text" : "red-text"}>
              ₹{remainingBudget.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="budget-stat-card small-card">
            <div className="budget-used-row">
              <p>Budget Used</p>
              <span>{usedPercentage.toFixed(0)}%</span>
            </div>

            <div className="budget-progress">
              <div
                className="budget-progress-fill"
                style={{ width: `${usedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="budget-center-card">
          <h2>
            <PieChart size={22} />
            Spending Breakdown
          </h2>

          <div className="pie-chart" style={{ background: pieBackground }}></div>

          <div className="pie-legend">
            {chartData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                ></span>
                <p>
                  {item.name}: ₹{item.value.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="budget-right">
          <div className="budget-form-card">
            <h2>Add Expense</h2>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount (₹)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />

            <input
              type="text"
              placeholder="Note (optional)"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />

            <button onClick={handleAddExpense}>+ Add</button>
          </div>

          <div className="budget-expenses-card">
            <h2>Expenses</h2>

            <div className="expenses-list">
              {expenses.map((item) => (
                <div className="expense-item" key={item.id}>
                  <div>
                    <h3>{item.category}</h3>
                    <p>{item.note}</p>
                  </div>

                  <div className="expense-price">
                    <span>₹{Number(item.amount).toLocaleString("en-IN")}</span>
                    <button onClick={() => handleDeleteExpense(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetTracker;