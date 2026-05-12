import { useLocation, useNavigate } from "react-router-dom";
import "./VenueFlow.css";

const venueList = [
  { id: 1, name: "THE TAJ PALACE", city: "Mumbai", rating: 4.8, reviews: 428, price: 25000 },
  { id: 2, name: "ITC GRAND CHOLA", city: "Chennai", rating: 4.7, reviews: 312, price: 22000 },
  { id: 3, name: "THE LEELA PALACE", city: "Bangalore", rating: 4.9, reviews: 256, price: 30000 },
  { id: 4, name: "OBEROI UDAIVILAS", city: "Udaipur", rating: 4.9, reviews: 521, price: 45000 },
  { id: 5, name: "JW MARRIOTT", city: "Delhi", rating: 4.6, reviews: 387, price: 18000 },
  { id: 6, name: "RAMBAGH PALACE", city: "Jaipur", rating: 4.8, reviews: 445, price: 35000 },
];

export default function VenueSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const venueRequest = location.state?.venueRequest;

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

        <div className="venues-grid">
          {venueList.map((venue) => (
            <div className="venue-item" key={venue.id}>
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
      </div>
    </div>
  );
}