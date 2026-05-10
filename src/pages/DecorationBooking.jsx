import React, { useState } from "react";
import "./DecorationBooking.css";
import { useNavigate } from "react-router-dom";

function DecorationBooking() {

  const navigate = useNavigate();

  const [days, setDays] = useState(1);

  const pricePerDay = 15000;

  const total = pricePerDay * days;

  return (
    <div className="booking-page">

      <div className="booking-container">

        <div
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← BACK
        </div>

        <div className="stepper">

          <div className="step active">1</div>

          <div className="line active-line"></div>

          <div className="step active">2</div>

          <div className="line active-line"></div>

          <div className="step active">3</div>

        </div>

        <h1 className="booking-title">
          CONFIRM BOOKING
        </h1>

        <p className="booking-subtitle">
          ROYAL FLORAL STUDIO — MUMBAI
        </p>

        <div className="booking-layout">

          <div className="booking-form-card">

            <div className="booking-grid">

              <div className="form-group">
                <label>DATE</label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>TIME</label>
                <input type="time" />
              </div>

              <div className="form-group">
                <label>VENUE</label>
                <input type="text" placeholder="Enter venue" />
              </div>

              <div className="form-group">
                <label>THEME</label>
                <input type="text" placeholder="e.g., Royal Gold" />
              </div>

              <div className="form-group full-width">
                <label>DURATION (DAYS)</label>

                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>

            </div>

          </div>

          <div className="summary-card">

            <h2>PRICE SUMMARY</h2>

            <div className="summary-row">
              <span>Price per Day</span>
              <span>₹15,000</span>
            </div>

            <div className="summary-row">
              <span>Duration</span>
              <span>{days} day(s)</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>TOTAL</span>
              <h1>₹{total.toLocaleString()}</h1>
            </div>

            <button
              className="confirm-btn"
              onClick={() => navigate("/booking-success")}
            >
              CONFIRM BOOKING
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DecorationBooking;