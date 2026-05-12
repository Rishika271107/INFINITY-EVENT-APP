import { useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

import foodHotels from "../data/foodHotels";

import "./FoodSupplyHotels.css";

function FoodSupplyHotels() {
  const navigate = useNavigate();

  return (
    <div className="food-hotels-page">
      <h1 className="food-title">Luxury Food Supply</h1>

      <div className="hotel-grid">
        {foodHotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>
            <div className="hotel-icon">
              <UtensilsCrossed size={55} />
            </div>

            <div className="hotel-content">
              <h2>{hotel.name}</h2>

              <p className="hotel-city">{hotel.city}</p>

              <p className="hotel-rating">
                ⭐ {hotel.rating}
              </p>

              <p className="hotel-price">{hotel.price}</p>

              <p className="hotel-description">
                {hotel.description}
              </p>

              <button
                onClick={() =>
                  navigate(`/food-supply/menu/${hotel.id}`, {
                    state: { hotel },
                  })
                }
              >
                Proceed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodSupplyHotels;