import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakeupFlow.css";

function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: 75 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1.2}s`,
      animationDuration: `${2.7 + Math.random() * 2.1}s`,
      background: ["#f7d365", "#d7a924", "#f0c649", "#ffffff"][i % 4],
    }))
  );

  return (
    <div className="makeup-confetti-wrap" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="makeup-confetti"
          style={piece}
        />
      ))}
    </div>
  );
}

export default function MakeupConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProvider = location.state?.selectedProvider;

  const [form, setForm] = useState({
    date: "",
    time: "",
    gender: "Female",
    occasion: "",
    venueAddress: "",
    duration: 2,
  });
  const [success, setSuccess] = useState(false);

  const total = useMemo(() => {
    if (!selectedProvider) return 0;
    return Number(selectedProvider.pricePerHr) * Number(form.duration || 0);
  }, [selectedProvider, form.duration]);

  if (!selectedProvider) {
    return (
      <div className="makeup-page">
        <div className="makeup-container">
          <p className="makeup-empty-text">Please select a makeup provider first.</p>
          <button className="makeup-gold-btn" type="button" onClick={() => navigate("/services/makeup")}>
            Go to Makeup Services
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
    if (!form.date || !form.time || !form.gender || !form.occasion || !form.venueAddress || !form.duration) {
      alert("Please fill all booking details.");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="makeup-page">
      <div className="makeup-container">
        <button className="makeup-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <h1 className="makeup-title">Confirm Booking</h1>
        <p className="makeup-subtitle">
          {selectedProvider.name.toUpperCase()} — {selectedProvider.city}
        </p>

        <div className="makeup-confirm-layout">
          <form id="makeup-confirm-form" className="makeup-form-card makeup-form-grid" onSubmit={onConfirm}>
            <div className="makeup-field">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={onChange} />
            </div>

            <div className="makeup-field">
              <label>Time</label>
              <input type="time" name="time" value={form.time} onChange={onChange} />
            </div>

            <div className="makeup-field">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={onChange}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="makeup-field">
              <label>Occasion</label>
              <select name="occasion" value={form.occasion} onChange={onChange}>
                <option value="">Select occasion</option>
                <option value="Wedding">Wedding</option>
                <option value="Reception">Reception</option>
                <option value="Engagement">Engagement</option>
                <option value="Party">Party</option>
                <option value="Photoshoot">Photoshoot</option>
              </select>
            </div>

            <div className="makeup-field">
              <label>Venue Address</label>
              <input
                type="text"
                name="venueAddress"
                placeholder="Enter address"
                value={form.venueAddress}
                onChange={onChange}
              />
            </div>

            <div className="makeup-field">
              <label>Duration (Hours)</label>
              <input type="number" name="duration" min="1" value={form.duration} onChange={onChange} />
            </div>
          </form>

          <aside className="makeup-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="makeup-summary-row">
              <span>Price per Hour</span>
              <strong>₹{selectedProvider.pricePerHr.toLocaleString()}</strong>
            </div>
            <div className="makeup-summary-row">
              <span>Hours</span>
              <strong>{form.duration}</strong>
            </div>
            <div className="makeup-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

            <button className="makeup-gold-btn makeup-full-btn" type="submit" form="makeup-confirm-form">
              CONFIRM BOOKING
            </button>
          </aside>
        </div>
      </div>

      {success && (
        <div className="makeup-modal-backdrop">
          <ConfettiBurst />
          <div className="makeup-success-modal">
            <div className="makeup-popup-icon">✓</div>
            <h2>Congratulations!</h2>
            <p>Your makeup booking has been confirmed successfully.</p>
            <button className="makeup-gold-btn makeup-modal-btn" type="button" onClick={() => navigate("/user/dashboard")}>
              OKAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
