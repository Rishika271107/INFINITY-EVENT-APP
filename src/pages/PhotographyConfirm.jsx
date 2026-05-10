import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PhotographyFlow.css";

const DASHBOARD_PATH = "/user/dashboard";

function ConfettiBurst() {
  const pieces = Array.from({ length: 80 });

  return (
    <div className="photo-confetti-wrap" aria-hidden="true">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="photo-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.2}s`,
            animationDuration: `${2.8 + Math.random() * 2.1}s`,
            background: ["#f7d365", "#d7a924", "#f0c649", "#ffffff"][i % 4],
          }}
        />
      ))}
    </div>
  );
}

export default function PhotographyConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPhotographer = location.state?.selectedPhotographer;
  const photographyRequest = location.state?.photographyRequest || {};

  const [form, setForm] = useState({
    hours: 2,
    date: photographyRequest.date || "",
    locationName: "",
    shootType: photographyRequest.eventType || "",
  });
  const [success, setSuccess] = useState(false);

  if (!selectedPhotographer) {
    return (
      <div className="photo-flow-page">
        <div className="photo-flow-container">
          <p className="photo-empty-text">No photographer selected. Please select one first.</p>
          <button className="photo-gold-btn" type="button" onClick={() => navigate("/services/photography/select")}>
            Go to Photographer List
          </button>
        </div>
      </div>
    );
  }

  const total = useMemo(
    () => Number(selectedPhotographer.pricePerHr) * Number(form.hours || 0),
    [selectedPhotographer.pricePerHr, form.hours]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onConfirm = (e) => {
    e.preventDefault();
    if (!form.hours || !form.date || !form.locationName || !form.shootType) {
      alert("Please fill all booking details.");
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="photo-flow-page">
      <div className="photo-flow-container">
        <button className="photo-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <div className="photo-stepper">
          <div className="photo-step done">1</div>
          <div className="photo-line active" />
          <div className="photo-step done">2</div>
          <div className="photo-line active" />
          <div className="photo-step active">3</div>
        </div>

        <h1 className="photo-title">Confirm Booking</h1>
        <p className="photo-subtitle">
          {selectedPhotographer.name} - {selectedPhotographer.city}
        </p>

        <div className="photo-confirm-layout">
          <form id="photo-confirm-form" className="photo-details-card photo-details-grid" onSubmit={onConfirm}>
            <div className="photo-field">
              <label>Number of Hours</label>
              <input type="number" min="1" name="hours" value={form.hours} onChange={onChange} />
            </div>

            <div className="photo-field">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={onChange} />
            </div>

            <div className="photo-field">
              <label>Location</label>
              <input
                type="text"
                name="locationName"
                placeholder="Enter location"
                value={form.locationName}
                onChange={onChange}
              />
            </div>

            <div className="photo-field">
              <label>Shoot Type</label>
              <select name="shootType" value={form.shootType} onChange={onChange}>
                <option value="">Select type</option>
                <option value="Wedding">Wedding</option>
                <option value="Pre-wedding">Pre-wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
          </form>

          <aside className="photo-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="photo-summary-row">
              <span>Price per Hour</span>
              <strong>₹{selectedPhotographer.pricePerHr.toLocaleString()}</strong>
            </div>
            <div className="photo-summary-row">
              <span>Hours</span>
              <strong>{form.hours || 0}</strong>
            </div>
            <div className="photo-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

            <button className="photo-gold-btn photo-full-btn" type="submit" form="photo-confirm-form">
              CONFIRM BOOKING
            </button>
          </aside>
        </div>
      </div>

      {success && (
        <div className="photo-modal-backdrop">
          <ConfettiBurst />
          <div className="photo-success-modal">
            <div className="photo-popup-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your photography booking has been confirmed successfully.</p>
            <button className="photo-gold-btn photo-modal-btn" type="button" onClick={() => navigate(DASHBOARD_PATH)}>
              OKAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
