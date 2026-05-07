import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserDashboard from "./pages/UserDashboard";

import BudgetTracker from "./pages/BudgetTracker";
import PastActivities from "./pages/PastActivities";

import ProfilePage from "./pages/ProfilePage";
import ReminderPage from "./pages/ReminderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />

        {/* Dashboard */}
        <Route path="/user/home" element={<UserDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* Features */}
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/past-activities" element={<PastActivities />} />

        {/* Profile */}
        <Route path="/user/profile" element={<ProfilePage />} />

        {/* Reminder */}
        <Route path="/user/reminder" element={<ReminderPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;