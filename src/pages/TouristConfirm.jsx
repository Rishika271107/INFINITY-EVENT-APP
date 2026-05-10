import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TouristFlow.css";

function ConfettiBurst() {
  const pieces = Array.from({ length: 75 });

  return (
    <div className="tourist-confetti-wrap" aria-hidden="true">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="tourist-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.2}s`,
            animationDuration: `${2.7 + Math.random() * 2.1}s`,
            background: ["#f7d365", "#d7a924", "#f0c649", "#ffffff"][i % 4],
          }}
        />
      ))}
    </div>
  );
}

export default function TouristConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedHotel = location.state?.selectedHotel;
  const selectedPlace = location.state?.selectedPlace;

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    roomType: selectedHotel?.type || "Deluxe",
  });

  const [success, setSuccess] = useState(false);

  const total = useMemo(() => {
    const nights = 1;
    const roomCount = Number(form.rooms || 1);
    return Number(selectedHotel?.pricePerNight || 0) * nights * roomCount;
  }, [selectedHotel, form.rooms]);

  if (!selectedHotel || !selectedPlace) {
    return (
      <div className="tourist-page">
        <div className="tourist-container">
          <p className="tourist-empty-text">Please select a hotel first.</p>
          <button className="tourist-gold-btn" onClick={() => navigate("/services/tourist")}>
            Go to Tourist Places
          </button>
        </div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onConfirm = (e) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut || !form.guests || !form.rooms || !form.roomType) {
      alert("Please fill all booking details.");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="tourist-page">
      <div className="tourist-container">
        <button className="tourist-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <h1 className="tourist-title">Confirm Booking</h1>
        <p className="tourist-subtitle">
          {selectedHotel.name.toUpperCase()} — {selectedPlace.name}
        </p>

        <div className="tourist-confirm-layout">
          <form id="tourist-confirm-form" className="tourist-form-card tourist-form-grid" onSubmit={onConfirm}>
            <div className="tourist-field">
              <label>Check-in Date</label>
              <input type="date" name="checkIn" value={form.checkIn} onChange={onChange} />
            </div>

            <div className="tourist-field">
              <label>Check-out Date</label>
              <input type="date" name="checkOut" value={form.checkOut} onChange={onChange} />
            </div>

            <div className="tourist-field">
              <label>Guests</label>
              <input type="number" min="1" name="guests" value={form.guests} onChange={onChange} />
            </div>

            <div className="tourist-field">
              <label>Rooms</label>
              <input type="number" min="1" name="rooms" value={form.rooms} onChange={onChange} />
            </div>

            <div className="tourist-field tourist-field-full">
              <label>Room Type</label>
              <select name="roomType" value={form.roomType} onChange={onChange}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </form>

          <aside className="tourist-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="tourist-summary-row">
              <span>Price per Night</span>
              <strong>₹{selectedHotel.pricePerNight.toLocaleString()}</strong>
            </div>
            <div className="tourist-summary-row">
              <span>Nights</span>
              <strong>1</strong>
            </div>
            <div className="tourist-summary-row">
              <span>Rooms</span>
              <strong>{form.rooms}</strong>
            </div>
            <div className="tourist-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

            <button className="tourist-gold-btn tourist-full-btn" type="submit" form="tourist-confirm-form">
              CONFIRM BOOKING
            </button>
          </aside>
        </div>
      </div>

      {success && (
        <div className="tourist-modal-backdrop">
          <ConfettiBurst />
          <div className="tourist-success-modal">
            <div className="tourist-popup-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your hotel booking has been confirmed successfully.</p>
            <button className="tourist-gold-btn tourist-modal-btn" onClick={() => navigate("/user/dashboard")}>
              Thank You!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}