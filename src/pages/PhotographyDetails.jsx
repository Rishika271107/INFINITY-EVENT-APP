import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhotographyFlow.css";

const CITY_OPTIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Jaipur",
  "Hyderabad",
  "Pune",
  "Goa",
  "Udaipur",
];

const EVENT_OPTIONS = [
  "Wedding",
  "Engagement",
  "Birthday",
  "Corporate",
  "Pre-wedding",
  "Reception",
];

export default function PhotographyDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventType: "",
    city: "",
    date: "",
    time: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContinue = (e) => {
    e.preventDefault();
    if (!form.eventType || !form.city || !form.date || !form.time) {
      alert("Please fill all details.");
      return;
    }

    navigate("/services/photography/select", {
      state: { photographyRequest: form },
    });
  };

  return (
    <div className="photo-flow-page">
      <div className="photo-flow-container">
        <button className="photo-back-btn" type="button" onClick={() => navigate("/user/dashboard")}>
          ← BACK TO DASHBOARD
        </button>

        <div className="photo-stepper">
          <div className="photo-step active">1</div>
          <div className="photo-line" />
          <div className="photo-step">2</div>
          <div className="photo-line" />
          <div className="photo-step">3</div>
        </div>

        <h1 className="photo-title">Photography Details</h1>

        <form className="photo-details-card photo-details-grid" onSubmit={onContinue}>
          <div className="photo-field">
            <label>Event Type</label>
            <select name="eventType" value={form.eventType} onChange={onChange}>
              <option value="">Select type</option>
              {EVENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="photo-field">
            <label>City</label>
            <select name="city" value={form.city} onChange={onChange}>
              <option value="">Select city</option>
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="photo-field">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} />
          </div>

          <div className="photo-field">
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={onChange} />
          </div>

          <div className="photo-actions">
            <button className="photo-gold-btn" type="submit">
              CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
