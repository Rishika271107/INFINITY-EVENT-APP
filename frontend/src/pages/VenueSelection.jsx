import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./VenueFlow.css";

export default function VenueSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const venueRequest = location.state?.venueRequest;

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await API.get("/venues");
        if (res.data?.success) {
          setVenues(res.data.data);
        } else {
          setError("Failed to fetch venues.");
        }
      } catch (err) {
        setError("Error fetching venues list.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const onBookNow = (venue) => {
    navigate("/venues/confirm", {
      state: { venueRequest, selectedVenue: venue },
    });
  };

  return (
    <div className="venue-flow-page">
      <div className="venue-flow-container">
        <div className="stepper">
          <div className="step done">1</div>
          <div className="line active" />
          <div className="step active">2</div>
          <div className="line" />
          <div className="step">3</div>
        </div>

        <h1 className="venue-title">Select a Venue</h1>

        {loading && <p className="loading-text" style={{ color: "#f3cf72", textAlign: "center" }}>Loading premium venues...</p>}
        {error && <p className="error-text" style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {!loading && !error && (
          <div className="venues-grid">
            {venues.map((venue) => (
              <div className="venue-item" key={venue._id}>
                <div className="hotel-icon">🏨</div>

                <div className="venue-meta">
                  <h3>{venue.name}</h3>
                  <p>{venue.city}</p>
                  <p className="rating">★ {venue.rating} &nbsp; ({venue.reviews} reviews)</p>
                  <p className="price">₹{venue.price.toLocaleString()}<span>/day</span></p>
                </div>

                <button className="gold-outline-btn" onClick={() => onBookNow(venue)}>
                  BOOK NOW
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}