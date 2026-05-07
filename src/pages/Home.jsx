
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Flower2,
  Bot,
  Camera,
  UtensilsCrossed,
  Shirt,
  MapPin,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const services = [
    {
      title: "Budget Tracker",
      description: "Smart expense management for your perfect event",
      icon: <Calculator size={34} />,
    },
    {
      title: "Decoration",
      description: "Exquisite themes from floral to royal grandeur",
      icon: <Flower2 size={34} />,
    },
    {
      title: "AI Help",
      description: "Intelligent planning assistant at your service",
      icon: <Bot size={34} />,
    },
    {
      title: "Photography",
      description: "Capture every precious moment beautifully",
      icon: <Camera size={34} />,
    },
    {
      title: "Food Supply",
      description: "Curated culinary experiences for every palate",
      icon: <UtensilsCrossed size={34} />,
    },
    {
      title: "Fashion Designing",
      description: "Bespoke styling for your special occasion",
      icon: <Shirt size={34} />,
    },
    {
      title: "Tourist Places",
      description: "Discover India's most enchanting destinations",
      icon: <MapPin size={34} />,
    },
    {
      title: "Makeup",
      description: "Transform with top beauty artists & studios",
      icon: <Sparkles size={34} />,
    },
  ];

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-subtitle">Premier Event Management</p>

          <h1 className="hero-title">
            Welcome To
            <br />
            Infinity
          </h1>

          <div className="gold-line"></div>

          <p className="hero-description">
            Where every celebration becomes an unforgettable
            <br />
            masterpiece
          </p>

          <button className="explore-btn" onClick={() => navigate("/role-selection")}>
            Let’s Explore
          </button>
        </div>

        <button className="scroll-down-btn" onClick={scrollToServices}>
          <ChevronDown size={34} />
        </button>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="services-header">
          <h2>Our Services</h2>
          <div className="services-line"></div>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        © 2026 <span>Infinity</span> — Luxury Event Management
      </footer>
    </div>
  );
}

export default Home;