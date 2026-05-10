import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DecorationDetails.css";

function DecorationDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    decorationType: "",
    city: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    navigate("/services/decoration/vendors");
  };

  return (
    <div className="decoration-page">
      <div className="decoration-container">

        {/* BACK BUTTON */}

        <div
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← BACK TO DASHBOARD
        </div>

        {/* STEPPER */}

        <div className="stepper">

          <div className="step active">1</div>

          <div className="line active-line"></div>

          <div className="step">2</div>

          <div className="line"></div>

          <div className="step">3</div>

        </div>

        {/* TITLE */}

        <h1 className="page-title">
          DECORATION DETAILS
        </h1>

        {/* FORM CARD */}

        <div className="form-card">

          <div className="form-grid">

            {/* DECORATION TYPE */}

            <div className="form-group">

              <label>DECORATION TYPE</label>

              <select
                name="decorationType"
                value={formData.decorationType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option>Floral Decoration</option>
                <option>LED Decoration</option>
                <option>Traditional Decoration</option>
                <option>Royal Theme Decoration</option>
                <option>Luxury Wedding Setup</option>
              </select>

            </div>

            {/* CITY */}

            <div className="form-group">

              <label>CITY</label>

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                <option>Chennai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>

            </div>

            {/* DATE */}

            <div className="form-group">

              <label>DATE</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

            </div>

            {/* TIME */}

            <div className="form-group">

              <label>TIME</label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            className="continue-btn"
            onClick={handleContinue}
          >
            CONTINUE
          </button>

        </div>

      </div>
    </div>
  );
}

export default DecorationDetails;