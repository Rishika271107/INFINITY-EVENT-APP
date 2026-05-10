import { useNavigate } from "react-router-dom";
import "./TouristFlow.css";

const TOURIST_PLACES = [
  { id: "goa", name: "GOA", subtitle: "Sun, sand and vibrant nightlife", emoji: "🏖️" },
  { id: "shimla", name: "SHIMLA", subtitle: "Queen of the Hills", emoji: "⛰️" },
  { id: "manali", name: "MANALI", subtitle: "Adventure paradise in the mountains", emoji: "⛰️" },
  { id: "ooty", name: "OOTY", subtitle: "The Nilgiris' crown jewel", emoji: "🌿" },
  { id: "kerala", name: "KERALA", subtitle: "God's Own Country", emoji: "🌴" },
  { id: "jaipur", name: "JAIPUR", subtitle: "The Pink City of Royals", emoji: "🏰" },
  { id: "udaipur", name: "UDAIPUR", subtitle: "City of Lakes & Romance", emoji: "🏛️" },
  { id: "darjeeling", name: "DARJEELING", subtitle: "Tea gardens & Himalayan views", emoji: "🍵" },
  { id: "rishikesh", name: "RISHIKESH", subtitle: "Yoga capital by the Ganges", emoji: "🧘" },
];

export default function TouristPlaces() {
  const navigate = useNavigate();

  return (
    <div className="tourist-page">
      <div className="tourist-container">
        <button className="tourist-back-btn" type="button" onClick={() => navigate("/user/dashboard")}>
          ← BACK TO DASHBOARD
        </button>

        <h1 className="tourist-title">Tourist Places</h1>
        <p className="tourist-subtitle">Discover India's most enchanting destinations</p>

        <div className="tourist-grid">
          {TOURIST_PLACES.map((place) => (
            <article
              key={place.id}
              className="tourist-place-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/services/tourist/hotels", {
                  state: { selectedPlace: place },
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/services/tourist/hotels", { state: { selectedPlace: place } });
                }
              }}
            >
              <div className="tourist-emoji">{place.emoji}</div>
              <h3>{place.name}</h3>
              <p>{place.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}