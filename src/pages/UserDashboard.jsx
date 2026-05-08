import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  History,
  Bell,
  UserCircle,
  LogOut,
  UtensilsCrossed,
  Shirt,
  Bot,
  Camera,
  Flower2,
  MapPin,
  Sparkles,
  Building2,
} from "lucide-react";

import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  // Keep ONE source of truth for dashboard path
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

  const services = useMemo(
    () => [
      {
        id: "venue",
        title: "VENUE",
        description: "Explore premium venue options",
        icon: <Building2 size={24} />,
        path: "/venues/details",
      },
      {
        id: "food",
        title: "FOOD SUPPLY",
        description: "Explore premium food supply options",
        icon: <UtensilsCrossed size={24} />,
        path: "/food-supply",
      },
      {
        id: "fashion",
        title: "FASHION DESIGNING",
        description: "Explore premium fashion designing options",
        icon: <Shirt size={24} />,
        path: "/fashion-designing",
      },
      {
        id: "decoration",
        title: "DECORATION",
        description: "Explore premium decoration options",
        icon: <Flower2 size={24} />,
        path: "/decoration-details",
      },
      {
        id: "photography",
        title: "PHOTOGRAPHY",
        description: "Explore premium photography options",
        icon: <Camera size={24} />,
        path: "/photography",
      },
      {
        id: "tourist",
        title: "TOURIST PLACES",
        description: "Explore premium tourist place options",
        icon: <MapPin size={24} />,
        path: "/tourist-places",
      },
      {
        id: "makeup",
        title: "MAKEUP",
        description: "Explore premium makeup options",
        icon: <Sparkles size={24} />,
        path: "/makeup",
      },
      {
        id: "budget-service",
        title: "BUDGET TRACKER",
        description: "Manage your event expenses efficiently",
        icon: <Calculator size={24} />,
        path: "/budget-tracker",
      },
      {
        id: "ai",
        title: "AI HELP",
        description: "Get smart AI assistance for planning",
        icon: <Bot size={24} />,
        path: "/ai-help",
      },
    ],
    []
  );

  const handleNavigate = (path) => navigate(path);

  const handleServiceKeyDown = (event, path) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="dashboard-page">
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
          onClick={() => handleNavigate("/")}
          type="button"
        >
          <span>
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h2>Dashboard</h2>

          <div className="topbar-icons">
            <button className="notification-btn" type="button" aria-label="Notifications">
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

        <section className="dashboard-content">
          <div className="dashboard-heading">
            <h1>Explore Services</h1>
            <p>Choose from our curated premium event management services</p>
          </div>

          <div className="dashboard-services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="dashboard-service-card"
                onClick={() => handleNavigate(service.path)}
                onKeyDown={(e) => handleServiceKeyDown(e, service.path)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${service.title}`}
              >
                <div className="dashboard-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;