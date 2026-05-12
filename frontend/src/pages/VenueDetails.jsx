import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VenueFlow.css";

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Goa", "Udaipur", "Jaipur"];
const eventTypes = ["Wedding", "Engagement", "Reception", "Birthday", "Corporate Event"];

export default function VenueDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventType: "",
    city: "",
    date: "",
    time: "",
    guests: "",
    decorationRequired: "Yes",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContinue = (e) => {
    e.preventDefault();
    if (!form.eventType || !form.city || !form.date || !form.time || !form.guests) {
      alert("Please fill all required fields.");
      return;
    }
    navigate("/venues/select", { state: { venueRequest: form } });
  };

  return (
    <div className="venue-flow-page">
      <div className="venue-flow-container">
        <div className="stepper">
          <div className="step active">1</div>
          <div className="line" />
          <div className="step">2</div>
          <div className="line" />
          <div className="step">3</div>
        </div>

        <h1 className="venue-title">Venue Details</h1>

        <form className="venue-card form-grid" onSubmit={onContinue}>
          <div className="field">
            <label>Event Type</label>
            <select name="eventType" value={form.eventType} onChange={onChange}>
              <option value="">Select type</option>
              {eventTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>City</label>
            <select name="city" value={form.city} onChange={onChange}>
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={onChange} />
          </div>

          <div className="field">
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={onChange} />
          </div>

          <div className="field full">
            <label>Number of Guests</label>
            <input
              type="number"
              name="guests"
              placeholder="e.g., 200"
              min="1"
              value={form.guests}
              onChange={onChange}
            />
          </div>

          <div className="field full">
            <label>Decoration Required?</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${form.decorationRequired === "Yes" ? "selected" : ""}`}
                onClick={() => setForm((p) => ({ ...p, decorationRequired: "Yes" }))}
              >
                Yes
              </button>
              <button
                type="button"
                className={`chip ${form.decorationRequired === "No" ? "selected" : ""}`}
                onClick={() => setForm((p) => ({ ...p, decorationRequired: "No" }))}
              >
                No
              </button>
            </div>
          </div>

          <button className="gold-btn" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}