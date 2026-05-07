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

  const sidebarItems = [
    {
      title: "Budget Tracker",
      icon: <Calculator size={18} />,
      path: "/budget-tracker",
    },
    {
      title: "Past Activities",
      icon: <History size={18} />,
      path: "/past-activities",
    },
    {
      title: "Reminder",
      icon: <Bell size={18} />,
      path: "/user/reminder",
    },
    {
      title: "Profile",
      icon: <UserCircle size={18} />,
      path: "/user/profile",
    },
  ];

  const services = [
    {
      title: "VENUE",
      description: "Explore premium venue options",
      icon: <Building2 size={24} />,
      path: "/venue-details",
    },
    {
      title: "FOOD SUPPLY",
      description: "Explore premium food supply options",
      icon: <UtensilsCrossed size={24} />,
      path: "/food-supply-details",
    },
    {
      title: "FASHION DESIGNING",
      description: "Explore premium fashion designing options",
      icon: <Shirt size={24} />,
      path: "/fashion-designing",
    },
    {
      title: "DECORATION",
      description: "Explore premium decoration options",
      icon: <Flower2 size={24} />,
      path: "/decoration-details",
    },
    {
      title: "PHOTOGRAPHY",
      description: "Explore premium photography options",
      icon: <Camera size={24} />,
      path: "/photography",
    },
    {
      title: "TOURIST PLACES",
      description: "Explore premium tourist places options",
      icon: <MapPin size={24} />,
      path: "/tourist-places",
    },
    {
      title: "MAKEUP",
      description: "Explore premium makeup options",
      icon: <Sparkles size={24} />,
      path: "/makeup",
    },
    {
      title: "BUDGET TRACKER",
      description: "Explore premium budget tracker options",
      icon: <Calculator size={24} />,
      path: "/budget-tracker",
    },
    {
      title: "AI HELP",
      description: "Explore premium ai help options",
      icon: <Bot size={24} />,
      path: "/ai-help",
    },
  ];

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h1>Infinity</h1>
          <p>Event Management</p>
        </div>

        <nav className="sidebar-menu">
          {sidebarItems.map((item, index) => (
            <button
              className="sidebar-link"
              key={index}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>

        <button
          className="sidebar-link logout-link"
          onClick={() => navigate("/")}
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
            <button className="notification-btn">
              <Bell size={22} />
              <span></span>
            </button>

            <button className="profile-btn">
              <UserCircle size={26} />
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-heading">
            <h1>Explore Services</h1>
            <p>Choose from our curated luxury event services</p>
          </div>

          <div className="dashboard-services-grid">
            {services.map((service, index) => (
              <div
                className="dashboard-service-card"
                key={index}
                onClick={() => navigate(service.path)}
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