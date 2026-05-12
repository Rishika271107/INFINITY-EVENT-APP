import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TouristFlow.css";

const HOTELS_BY_PLACE = {
  shimla: [
    { id: "shimla-1", name: "The Grand Shimla", area: "Shimla", type: "Luxury", reviews: 456, rating: 4.9, pricePerNight: 12000 },
    { id: "shimla-2", name: "Shimla Palace Resort", area: "Shimla", type: "Suite", reviews: 312, rating: 4.8, pricePerNight: 18000 },
    { id: "shimla-3", name: "Royal Shimla Inn", area: "Shimla", type: "Deluxe", reviews: 234, rating: 4.7, pricePerNight: 8000 },
    { id: "shimla-4", name: "Shimla Heritage Stay", area: "Shimla", type: "Standard", reviews: 189, rating: 4.6, pricePerNight: 6000 },
    { id: "shimla-5", name: "Taj Shimla", area: "Shimla", type: "Suite", reviews: 534, rating: 4.9, pricePerNight: 25000 },
    { id: "shimla-6", name: "Cedar Peak Hotel", area: "Shimla", type: "Deluxe", reviews: 208, rating: 4.6, pricePerNight: 9000 },
    { id: "shimla-7", name: "Himalayan Crown", area: "Shimla", type: "Luxury", reviews: 275, rating: 4.8, pricePerNight: 14000 },
    { id: "shimla-8", name: "Snowline Residency", area: "Shimla", type: "Standard", reviews: 166, rating: 4.5, pricePerNight: 5500 },
    { id: "shimla-9", name: "Pine Valley Suites", area: "Shimla", type: "Suite", reviews: 193, rating: 4.7, pricePerNight: 10500 },
    { id: "shimla-10", name: "Hilltop Vista", area: "Shimla", type: "Deluxe", reviews: 222, rating: 4.7, pricePerNight: 9800 },
  ],
  goa: [
    { id: "goa-1", name: "Sea Pearl Goa", area: "Goa", type: "Beach", reviews: 402, rating: 4.8, pricePerNight: 14000 },
    { id: "goa-2", name: "Sunset Bay Resort", area: "Goa", type: "Luxury", reviews: 276, rating: 4.7, pricePerNight: 11000 },
    { id: "goa-3", name: "Palm Breeze Inn", area: "Goa", type: "Standard", reviews: 198, rating: 4.6, pricePerNight: 7000 },
    { id: "goa-4", name: "Coral Coast Retreat", area: "Goa", type: "Deluxe", reviews: 187, rating: 4.6, pricePerNight: 8200 },
    { id: "goa-5", name: "Blue Lagoon Suites", area: "Goa", type: "Suite", reviews: 261, rating: 4.7, pricePerNight: 12500 },
    { id: "goa-6", name: "Tropical Dunes", area: "Goa", type: "Beach", reviews: 315, rating: 4.8, pricePerNight: 13800 },
    { id: "goa-7", name: "Ocean Crest", area: "Goa", type: "Luxury", reviews: 233, rating: 4.7, pricePerNight: 11500 },
    { id: "goa-8", name: "Cashew Grove Stay", area: "Goa", type: "Standard", reviews: 174, rating: 4.5, pricePerNight: 6200 },
    { id: "goa-9", name: "Golden Sands Hotel", area: "Goa", type: "Deluxe", reviews: 206, rating: 4.6, pricePerNight: 8900 },
    { id: "goa-10", name: "Beachfront Royale", area: "Goa", type: "Suite", reviews: 298, rating: 4.8, pricePerNight: 15200 },
  ],
  manali: [
    { id: "manali-1", name: "Snow Crown Manali", area: "Manali", type: "Luxury", reviews: 265, rating: 4.8, pricePerNight: 13000 },
    { id: "manali-2", name: "Mountain Mist", area: "Manali", type: "Deluxe", reviews: 184, rating: 4.7, pricePerNight: 9000 },
    { id: "manali-3", name: "Pine Retreat", area: "Manali", type: "Standard", reviews: 141, rating: 4.5, pricePerNight: 6500 },
    { id: "manali-4", name: "Alpine Horizon", area: "Manali", type: "Suite", reviews: 176, rating: 4.6, pricePerNight: 9800 },
    { id: "manali-5", name: "Valley View Inn", area: "Manali", type: "Deluxe", reviews: 207, rating: 4.7, pricePerNight: 8700 },
    { id: "manali-6", name: "Cedar Nest", area: "Manali", type: "Standard", reviews: 118, rating: 4.4, pricePerNight: 5800 },
    { id: "manali-7", name: "Riverstone Resort", area: "Manali", type: "Luxury", reviews: 246, rating: 4.8, pricePerNight: 12400 },
    { id: "manali-8", name: "Orchid Peaks", area: "Manali", type: "Suite", reviews: 153, rating: 4.6, pricePerNight: 9200 },
    { id: "manali-9", name: "Snowfield Stay", area: "Manali", type: "Deluxe", reviews: 165, rating: 4.5, pricePerNight: 7600 },
    { id: "manali-10", name: "Cliffside Manor", area: "Manali", type: "Luxury", reviews: 212, rating: 4.7, pricePerNight: 11800 },
  ],
  jaipur: [
    { id: "jaipur-1", name: "Pink Palace Jaipur", area: "Jaipur", type: "Luxury", reviews: 322, rating: 4.8, pricePerNight: 15000 },
    { id: "jaipur-2", name: "Royal Haveli", area: "Jaipur", type: "Deluxe", reviews: 233, rating: 4.7, pricePerNight: 9500 },
    { id: "jaipur-3", name: "Amber Fort Residency", area: "Jaipur", type: "Suite", reviews: 204, rating: 4.7, pricePerNight: 11600 },
    { id: "jaipur-4", name: "Maharaja Courtyard", area: "Jaipur", type: "Luxury", reviews: 275, rating: 4.8, pricePerNight: 13200 },
    { id: "jaipur-5", name: "City Palace Inn", area: "Jaipur", type: "Standard", reviews: 167, rating: 4.5, pricePerNight: 6200 },
    { id: "jaipur-6", name: "Rajputana Retreat", area: "Jaipur", type: "Deluxe", reviews: 196, rating: 4.6, pricePerNight: 8600 },
    { id: "jaipur-7", name: "Heritage Rose Hotel", area: "Jaipur", type: "Suite", reviews: 188, rating: 4.6, pricePerNight: 9900 },
    { id: "jaipur-8", name: "Pink City Suites", area: "Jaipur", type: "Deluxe", reviews: 214, rating: 4.7, pricePerNight: 9100 },
    { id: "jaipur-9", name: "Saffron Residency", area: "Jaipur", type: "Standard", reviews: 149, rating: 4.4, pricePerNight: 5900 },
    { id: "jaipur-10", name: "Royal Desert Crown", area: "Jaipur", type: "Luxury", reviews: 240, rating: 4.8, pricePerNight: 14500 },
  ],
  ooty: [
    { id: "ooty-1", name: "Nilgiri Grand", area: "Ooty", type: "Luxury", reviews: 201, rating: 4.7, pricePerNight: 10800 },
    { id: "ooty-2", name: "Tea Valley Resort", area: "Ooty", type: "Deluxe", reviews: 183, rating: 4.6, pricePerNight: 8200 },
    { id: "ooty-3", name: "Blue Hills Inn", area: "Ooty", type: "Standard", reviews: 147, rating: 4.5, pricePerNight: 5600 },
    { id: "ooty-4", name: "Emerald View Suites", area: "Ooty", type: "Suite", reviews: 169, rating: 4.6, pricePerNight: 9200 },
    { id: "ooty-5", name: "Crown Fern Stay", area: "Ooty", type: "Deluxe", reviews: 175, rating: 4.6, pricePerNight: 7900 },
    { id: "ooty-6", name: "Misty Peak Residency", area: "Ooty", type: "Standard", reviews: 132, rating: 4.4, pricePerNight: 5200 },
    { id: "ooty-7", name: "Orchid Lake Hotel", area: "Ooty", type: "Luxury", reviews: 190, rating: 4.7, pricePerNight: 10400 },
    { id: "ooty-8", name: "Whispering Pines", area: "Ooty", type: "Suite", reviews: 156, rating: 4.5, pricePerNight: 8800 },
    { id: "ooty-9", name: "Green Meadow Inn", area: "Ooty", type: "Standard", reviews: 128, rating: 4.4, pricePerNight: 5000 },
    { id: "ooty-10", name: "Royal Nilgiri Palace", area: "Ooty", type: "Luxury", reviews: 218, rating: 4.8, pricePerNight: 12100 },
  ],
  kerala: [
    { id: "kerala-1", name: "Backwater Bliss", area: "Kerala", type: "Luxury", reviews: 266, rating: 4.8, pricePerNight: 13200 },
    { id: "kerala-2", name: "Coconut Lagoon Stay", area: "Kerala", type: "Deluxe", reviews: 214, rating: 4.7, pricePerNight: 9400 },
    { id: "kerala-3", name: "Palm Grove Inn", area: "Kerala", type: "Standard", reviews: 172, rating: 4.5, pricePerNight: 6200 },
    { id: "kerala-4", name: "Malabar Crown", area: "Kerala", type: "Suite", reviews: 191, rating: 4.6, pricePerNight: 9900 },
    { id: "kerala-5", name: "Houseboat Retreat", area: "Kerala", type: "Luxury", reviews: 239, rating: 4.8, pricePerNight: 14600 },
    { id: "kerala-6", name: "Spice Garden Residency", area: "Kerala", type: "Deluxe", reviews: 158, rating: 4.5, pricePerNight: 8100 },
    { id: "kerala-7", name: "Rainforest Haven", area: "Kerala", type: "Suite", reviews: 145, rating: 4.5, pricePerNight: 9000 },
    { id: "kerala-8", name: "Bay Breeze Hotel", area: "Kerala", type: "Standard", reviews: 134, rating: 4.4, pricePerNight: 5600 },
    { id: "kerala-9", name: "Travancore Palace", area: "Kerala", type: "Luxury", reviews: 223, rating: 4.7, pricePerNight: 12500 },
    { id: "kerala-10", name: "Gods Own Suites", area: "Kerala", type: "Deluxe", reviews: 184, rating: 4.6, pricePerNight: 8900 },
  ],
  udaipur: [
    { id: "udaipur-1", name: "Lake Palace Udaipur", area: "Udaipur", type: "Luxury", reviews: 311, rating: 4.9, pricePerNight: 18500 },
    { id: "udaipur-2", name: "City Lake Inn", area: "Udaipur", type: "Deluxe", reviews: 201, rating: 4.7, pricePerNight: 9600 },
    { id: "udaipur-3", name: "Aravalli Retreat", area: "Udaipur", type: "Standard", reviews: 154, rating: 4.5, pricePerNight: 6100 },
    { id: "udaipur-4", name: "Royal Ghat Suites", area: "Udaipur", type: "Suite", reviews: 176, rating: 4.6, pricePerNight: 10200 },
    { id: "udaipur-5", name: "Heritage Courtyard", area: "Udaipur", type: "Deluxe", reviews: 189, rating: 4.6, pricePerNight: 8700 },
    { id: "udaipur-6", name: "Sunset Lake View", area: "Udaipur", type: "Luxury", reviews: 228, rating: 4.8, pricePerNight: 13800 },
    { id: "udaipur-7", name: "Mewar Residency", area: "Udaipur", type: "Standard", reviews: 141, rating: 4.4, pricePerNight: 5600 },
    { id: "udaipur-8", name: "White Marble Inn", area: "Udaipur", type: "Suite", reviews: 162, rating: 4.5, pricePerNight: 9100 },
    { id: "udaipur-9", name: "Regal Shores Hotel", area: "Udaipur", type: "Deluxe", reviews: 175, rating: 4.6, pricePerNight: 8400 },
    { id: "udaipur-10", name: "Crown of Lakes", area: "Udaipur", type: "Luxury", reviews: 245, rating: 4.8, pricePerNight: 14900 },
  ],
  darjeeling: [
    { id: "darjeeling-1", name: "Tea Garden Retreat", area: "Darjeeling", type: "Luxury", reviews: 217, rating: 4.7, pricePerNight: 11200 },
    { id: "darjeeling-2", name: "Himalayan Vista Inn", area: "Darjeeling", type: "Deluxe", reviews: 176, rating: 4.6, pricePerNight: 8300 },
    { id: "darjeeling-3", name: "Cloud Mist Stay", area: "Darjeeling", type: "Standard", reviews: 139, rating: 4.4, pricePerNight: 5200 },
    { id: "darjeeling-4", name: "Kanchenjunga Suites", area: "Darjeeling", type: "Suite", reviews: 165, rating: 4.5, pricePerNight: 9300 },
    { id: "darjeeling-5", name: "Tea Leaf Residency", area: "Darjeeling", type: "Deluxe", reviews: 151, rating: 4.5, pricePerNight: 7900 },
    { id: "darjeeling-6", name: "Mountain Crown Hotel", area: "Darjeeling", type: "Luxury", reviews: 203, rating: 4.7, pricePerNight: 11800 },
    { id: "darjeeling-7", name: "Green Valley Inn", area: "Darjeeling", type: "Standard", reviews: 127, rating: 4.3, pricePerNight: 4800 },
    { id: "darjeeling-8", name: "Sunrise Peak Suites", area: "Darjeeling", type: "Suite", reviews: 158, rating: 4.5, pricePerNight: 8700 },
    { id: "darjeeling-9", name: "Colonial Manor", area: "Darjeeling", type: "Deluxe", reviews: 169, rating: 4.6, pricePerNight: 8400 },
    { id: "darjeeling-10", name: "Tea Trail Palace", area: "Darjeeling", type: "Luxury", reviews: 224, rating: 4.8, pricePerNight: 12600 },
  ],
  rishikesh: [
    { id: "rishikesh-1", name: "Ganga View Resort", area: "Rishikesh", type: "Luxury", reviews: 241, rating: 4.8, pricePerNight: 12100 },
    { id: "rishikesh-2", name: "Yoga Bliss Inn", area: "Rishikesh", type: "Deluxe", reviews: 198, rating: 4.6, pricePerNight: 8200 },
    { id: "rishikesh-3", name: "Riverbank Stay", area: "Rishikesh", type: "Standard", reviews: 159, rating: 4.5, pricePerNight: 5600 },
    { id: "rishikesh-4", name: "Tranquil Ashram Suites", area: "Rishikesh", type: "Suite", reviews: 174, rating: 4.6, pricePerNight: 9100 },
    { id: "rishikesh-5", name: "Himalayan Peace Retreat", area: "Rishikesh", type: "Deluxe", reviews: 183, rating: 4.6, pricePerNight: 8600 },
    { id: "rishikesh-6", name: "Aarti Ghat Residency", area: "Rishikesh", type: "Standard", reviews: 146, rating: 4.4, pricePerNight: 5200 },
    { id: "rishikesh-7", name: "Lotus River Palace", area: "Rishikesh", type: "Luxury", reviews: 215, rating: 4.7, pricePerNight: 11500 },
    { id: "rishikesh-8", name: "Zen Valley Hotel", area: "Rishikesh", type: "Suite", reviews: 162, rating: 4.5, pricePerNight: 8900 },
    { id: "rishikesh-9", name: "Cliff Yoga Lodge", area: "Rishikesh", type: "Deluxe", reviews: 171, rating: 4.6, pricePerNight: 8400 },
    { id: "rishikesh-10", name: "Spiritual Sands Inn", area: "Rishikesh", type: "Standard", reviews: 133, rating: 4.4, pricePerNight: 5000 },
  ],
};

export default function TouristHotels() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace;

  const hotels = useMemo(() => {
    if (!selectedPlace) return [];
    return HOTELS_BY_PLACE[selectedPlace.id] || HOTELS_BY_PLACE.shimla;
  }, [selectedPlace]);

  if (!selectedPlace) {
    return (
      <div className="tourist-page">
        <div className="tourist-container">
          <p className="tourist-empty-text">Please select a tourist place first.</p>
          <button className="tourist-gold-btn" onClick={() => navigate("/services/tourist")}>
            Go to Tourist Places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tourist-page">
      <div className="tourist-container">
        <button className="tourist-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <h1 className="tourist-title">Hotels in {selectedPlace.name}</h1>
        <p className="tourist-subtitle">Top-rated luxury stays</p>

        <div className="tourist-hotel-grid">
          {hotels.map((hotel) => (
            <article key={hotel.id} className="tourist-hotel-card">
              <div className="tourist-hotel-top">
                <h3>{hotel.name}</h3>
                <p>☆ {hotel.rating}</p>
              </div>

              <p className="tourist-hotel-meta">◉ {hotel.area} · {hotel.type}</p>
              <p className="tourist-hotel-reviews">{hotel.reviews} reviews</p>

              <div className="tourist-hotel-bottom">
                <strong>
                  ₹{hotel.pricePerNight.toLocaleString()}
                  <span>/night</span>
                </strong>

                <button
                  className="tourist-gold-btn tourist-small-btn"
                  type="button"
                  onClick={() =>
                    navigate("/services/tourist/confirm", {
                      state: { selectedPlace, selectedHotel: hotel },
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