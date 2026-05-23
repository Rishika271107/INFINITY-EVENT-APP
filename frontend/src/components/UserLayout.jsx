import React, { useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calculator,
  History,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import "../pages/UserDashboard.css"; // Reuse the same CSS for now

function UserLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const DASHBOARD_PATH = "/user/dashboard";

  const sidebarItems = useMemo(
    () => [
      {
        id: "budget",
        title: "Budget Tracker",
        icon: <Calculator size={18} />,
        path: "/budget-tracker",
      },
      {
        id: "history",
        title: "Past Activities",
        icon: <History size={18} />,
        path: "/past-activities",
      },
      {
        id: "reminder",
        title: "Reminder",
        icon: <Bell size={18} />,
        path: "/user/reminder",
      },
      {
        id: "profile",
        title: "Profile",
        icon: <UserCircle size={18} />,
        path: "/user/profile",
      },
    ],
    []
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleServiceKeyDown = (event, path) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div
          className="sidebar-brand"
          role="button"
          tabIndex={0}
          onClick={() => handleNavigate(DASHBOARD_PATH)}
          onKeyDown={(e) => handleServiceKeyDown(e, DASHBOARD_PATH)}
          aria-label="Go to dashboard"
        >
          <h1>Infinity</h1>
          <p>Event Management</p>
        </div>

        <nav className="sidebar-menu" aria-label="Sidebar menu">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className="sidebar-link"
              onClick={() => handleNavigate(item.path)}
              type="button"
            >
              <span>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>

        <button
          className="sidebar-link logout-link"
          onClick={handleLogout}
          type="button"
        >
          <span>
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        {/* TOPBAR */}
        <header className="dashboard-topbar">
          <h2>Dashboard</h2>
          <div className="topbar-icons">
            <button
              className="notification-btn"
              type="button"
              aria-label="Notifications"
              onClick={() => handleNavigate("/user/reminder")}
            >
              <Bell size={22} />
              <span />
            </button>

            <button
              className="profile-btn"
              type="button"
              aria-label="Profile"
              onClick={() => handleNavigate("/user/profile")}
            >
              <UserCircle size={26} />
            </button>
          </div>
        </header>

        {/* OUTLET FOR NESTED ROUTES */}
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default UserLayout;
