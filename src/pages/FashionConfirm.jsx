import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FashionFlow.css";

const DASHBOARD_PATH = "/user/dashboard";

function ConfettiBurst() {
  const pieces = Array.from({ length: 70 });
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.2}s`,
            animationDuration: `${2.7 + Math.random() * 2.1}s`,
            background: ["#f3cf72", "#d8ab2f", "#ffffff", "#f0c649"][i % 4],
          }}
        />
      ))}
    </div>
  );
}

export default function FashionConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDesigner = location.state?.selectedDesigner;

  const [form, setForm] = useState({
    hours: 3,
    date: "",
    notes: "",
  });

  const [success, setSuccess] = useState(false);

  if (!selectedDesigner) {
    return (
      <div className="fashion-page">
        <div className="fashion-container">
          <p className="empty-text">No designer selected. Please go back and select one.</p>
          <button className="gold-btn" type="button" onClick={() => navigate("/fashion-designing")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const total = useMemo(
    () => Number(selectedDesigner.pricePerHr) * Number(form.hours || 0),
    [selectedDesigner.pricePerHr, form.hours]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.hours || !form.date) {
      alert("Please fill hours and date.");
      return;
    }
    setSuccess(true);
  };

  const goDashboard = () => {
    setSuccess(false);
    navigate(DASHBOARD_PATH, { replace: true });
  };

  return (
    <div className="fashion-page">
      <div className="fashion-container">
        <button className="fashion-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <h1 className="fashion-title">CONFIRM BOOKING</h1>
        <p className="designer-sub">{selectedDesigner.name} — {selectedDesigner.city}</p>

        <div className="confirm-layout">
          <form id="fashion-booking-form" className="confirm-card" onSubmit={onSubmit}>
            <div className="field-grid">
              <div className="field">
                <label>Hours Needed</label>
                <input
                  type="number"
                  name="hours"
                  min="1"
                  value={form.hours}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label>Date</label>
                <input type="date" name="date" value={form.date} onChange={onChange} />
              </div>
            </div>

            <div className="field full">
              <label>Special Notes</label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Describe your requirements..."
                value={form.notes}
                onChange={onChange}
              />
            </div>
          </form>

          <aside className="summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="summary-row">
              <span>Price per Hour</span>
              <strong>₹{selectedDesigner.pricePerHr.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Hours</span>
              <strong>{form.hours || 0}</strong>
            </div>
            <div className="summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

            <button className="gold-btn full-btn" type="submit" form="fashion-booking-form">
              CONFIRM BOOKING
            </button>
          </aside>
        </div>
      </div>

      {success && (
        <div className="modal-backdrop">
          <ConfettiBurst />
          <div className="success-modal">
            <h2>Congratulations!</h2>
            <p>Your fashion booking is confirmed successfully.</p>
            <button className="gold-btn modal-btn" type="button" onClick={goDashboard}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}