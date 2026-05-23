import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserDashboard.css";

import {
  Calculator,
  UtensilsCrossed,
  Shirt,
  Bot,
  Camera,
  Flower2,
  MapPin,
  Sparkles,
  Building2,
} from "lucide-react";

import EmptyState from "../components/async/EmptyState";

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // =========================
  // SERVICES
  // =========================

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
        path: "/services/decoration",
      },
      {
        id: "photography",
        title: "PHOTOGRAPHY",
        description: "Explore premium photography options",
        icon: <Camera size={24} />,
        path: "/services/photography",
      },
      {
        id: "tourist",
        title: "TOURIST PLACES",
        description: "Explore premium tourist place options",
        icon: <MapPin size={24} />,
        path: "/services/tourist",
      },
      {
        id: "makeup",
        title: "MAKEUP",
        description: "Explore premium makeup options",
        icon: <Sparkles size={24} />,
        path: "/services/makeup",
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

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleServiceKeyDown = (event, path) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(path);
    }
  };

  return (
    <>
      <div className="dashboard-heading">
        <h1>Welcome, {user?.username || "Guest"}</h1>
        <p>
          Signed in as: <span style={{ color: '#d4af37' }}>{user?.email}</span>
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="dashboard-services-grid">
        {services.length ? (
          services.map((service) => (
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
          ))
        ) : (
          <EmptyState title="No Services" description="There are currently no services available." />
        )}
      </div>
    </>
  );
}

export default UserDashboard;