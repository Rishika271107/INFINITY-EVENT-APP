import { useNavigate } from "react-router-dom";
import "./MakeupFlow.css";

const MAKEUP_PROVIDERS = [
  { id: 1, name: "Glamour Studio", city: "Mumbai", type: "Makeup Studio", reviews: 456, rating: 4.9, pricePerHr: 3000 },
  { id: 2, name: "Beauty Bliss Parlour", city: "Delhi", type: "Beauty Parlour", reviews: 312, rating: 4.8, pricePerHr: 2000 },
  { id: 3, name: "Artistry by Priya", city: "Bangalore", type: "Makeup Artist", reviews: 534, rating: 4.9, pricePerHr: 5000 },
  { id: 4, name: "Royal Beauty Lounge", city: "Jaipur", type: "Beauty Parlour", reviews: 267, rating: 4.7, pricePerHr: 2500 },
  { id: 5, name: "Studio Luxe", city: "Hyderabad", type: "Makeup Studio", reviews: 389, rating: 4.8, pricePerHr: 4000 },
  { id: 6, name: "Glow & Grace", city: "Chennai", type: "Beauty Parlour", reviews: 198, rating: 4.6, pricePerHr: 1800 },
  { id: 7, name: "Bridal Aura", city: "Pune", type: "Makeup Artist", reviews: 225, rating: 4.7, pricePerHr: 3200 },
  { id: 8, name: "Velvet Vanity", city: "Kolkata", type: "Makeup Studio", reviews: 287, rating: 4.8, pricePerHr: 3600 },
];

export default function MakeupServices() {
  const navigate = useNavigate();

  return (
    <div className="makeup-page">
      <div className="makeup-container">
        <button className="makeup-back-btn" type="button" onClick={() => navigate("/user/dashboard")}>
          ← BACK TO DASHBOARD
        </button>

        <h1 className="makeup-title">Makeup Services</h1>
        <p className="makeup-subtitle">Beauty parlours, studios & artists</p>

        <div className="makeup-services-grid">
          {MAKEUP_PROVIDERS.map((provider) => (
            <article key={provider.id} className="makeup-service-card">
              <div className="makeup-service-top">
                <h3>{provider.name}</h3>
                <p>★ {provider.rating}</p>
              </div>

              <p className="makeup-service-meta">
                {provider.city} · {provider.type}
              </p>
              <p className="makeup-service-reviews">{provider.reviews} reviews</p>

              <div className="makeup-service-bottom">
                <strong>
                  ₹{provider.pricePerHr.toLocaleString()}
                  <span>/hr</span>
                </strong>

                <button
                  className="makeup-gold-btn makeup-small-btn"
                  type="button"
                  onClick={() =>
                    navigate("/services/makeup/confirm", {
                      state: { selectedProvider: provider },
                    })
                  }
                >
                  BOOK NOW
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
