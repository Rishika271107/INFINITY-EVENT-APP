import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VenueFlow.css";

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Goa", "Udaipur", "Jaipur"];
const eventTypes = ["Wedding", "Engagement", "Reception", "Birthday", "Corporate Event"];

function DatePicker({ value, onChange, error }) {
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="field">
      <label htmlFor="venue-date">Date</label>
      <input
        id="venue-date"
        type="date"
        name="date"
        value={value}
        min={minDate}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "field-error" : ""}
        aria-invalid={!!error}
        aria-describedby={error ? "venue-date-error" : undefined}
      />
      {error ? (
        <p id="venue-date-error" className="field-error-message">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TimePicker({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() => {
    if (!value) return { hour: "12", minute: "00", period: "AM" };
    const [hourRaw, minuteRaw] = value.split(":");
    const hour24 = Number(hourRaw);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return {
      hour: String(hour12).padStart(2, "0"),
      minute: minuteRaw || "00",
      period
    };
  });

  const displayValue = value || "--:-- --";

  const commitTime = () => {
    const hour = Number(draft.hour);
    const minute = draft.minute;
    const normalizedHour =
      draft.period === "PM" ? (hour % 12) + 12 : hour % 12;
    const timeValue = `${String(normalizedHour).padStart(2, "0")}:${minute}`;
    onChange(timeValue);
    setIsOpen(false);
  };

  return (
    <div className="field">
      <label htmlFor="venue-time">Time</label>
      <button
        id="venue-time"
        type="button"
        className={`time-trigger ${error ? "field-error" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{displayValue}</span>
      </button>
      {isOpen ? (
        <div className="time-popover" role="dialog" aria-label="Select time">
          <div className="time-controls">
            <label>
              Hour
              <input
                type="number"
                min="1"
                max="12"
                value={draft.hour}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, hour: e.target.value }))
                }
              />
            </label>
            <label>
              Minute
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                value={draft.minute}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    minute: String(e.target.value).padStart(2, "0").slice(-2)
                  }))
                }
              />
            </label>
            <label>
              Period
              <select
                value={draft.period}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, period: e.target.value }))
                }
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </label>
          </div>
          <div className="time-actions">
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="button" onClick={commitTime}>
              Apply
            </button>
          </div>
        </div>
      ) : null}
      <div className={`time-preview ${error ? "field-error" : ""}`}>
        {displayValue}
      </div>
      {error ? <p className="field-error-message">{error}</p> : null}
    </div>
  );
}

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
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onContinue = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.eventType) nextErrors.eventType = "Please select an event type";
    if (!form.city) nextErrors.city = "Please select a city";
    if (!form.date) nextErrors.date = "Please select event date";
    if (!form.time) nextErrors.time = "Please select event time";
    if (!form.guests || Number(form.guests) < 1) nextErrors.guests = "Please enter guest count";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
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
            <select
              name="eventType"
              value={form.eventType}
              onChange={(e) => setField("eventType", e.target.value)}
              className={errors.eventType ? "field-error" : ""}
              aria-invalid={!!errors.eventType}
            >
              <option value="">Select type</option>
              {eventTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.eventType ? <p className="field-error-message">{errors.eventType}</p> : null}
          </div>

          <div className="field">
            <label>City</label>
            <select
              name="city"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              className={errors.city ? "field-error" : ""}
              aria-invalid={!!errors.city}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city ? <p className="field-error-message">{errors.city}</p> : null}
          </div>

          <DatePicker value={form.date} onChange={(value) => setField("date", value)} error={errors.date} />
          <TimePicker value={form.time} onChange={(value) => setField("time", value)} error={errors.time} />

          <div className="field full">
            <label>Number of Guests</label>
            <input
              type="number"
              name="guests"
              placeholder="e.g., 200"
              min="1"
              value={form.guests}
              onChange={(e) => setField("guests", e.target.value)}
              className={errors.guests ? "field-error" : ""}
              aria-invalid={!!errors.guests}
            />
            {errors.guests ? <p className="field-error-message">{errors.guests}</p> : null}
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
