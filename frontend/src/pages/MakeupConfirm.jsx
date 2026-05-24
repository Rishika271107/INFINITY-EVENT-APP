import { useMemo, useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRazorpay } from "../hooks/useRazorpay";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { makeupConfirmSchema } from "../utils/validationSchemas";
import "./MakeupFlow.css";

const DASHBOARD_PATH = "/user/dashboard";

function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1.2}s`,
      animationDuration: `${2.8 + Math.random() * 2.2}s`,
      background: ["#f7d365", "#d7a924", "#f0c649", "#ffffff"][i % 4],
    }))
  );

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span key={i} className="confetti" style={piece} />
      ))}
    </div>
  );
}

export default function MakeupConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProvider = location.state?.selectedProvider;

  const [duration, setDuration] = useState(2);
  const { user } = useAuth();
  const { initiatePayment, renderToast } = useRazorpay();

  const total = useMemo(() => {
    if (!selectedProvider) return 0;
    return Number(selectedProvider.pricePerHr) * Number(duration || 0);
  }, [selectedProvider, duration]);

  if (!selectedProvider) {
    return (
      <div className="makeup-page">
        <div className="makeup-container">
          <p className="makeup-empty-text">Please select a makeup provider first.</p>
          <button className="makeup-gold-btn" type="button" onClick={() => navigate("/services/makeup")}>Go to Makeup Services</button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const totalAmount = Number(selectedProvider.pricePerHr) * Number(data.duration);
    try {
      const res = await API.post("/bookings", {
        eventDate: data.date,
        serviceName: selectedProvider.name,
        serviceType: "Makeup",
        totalAmount,
        bookingDetails: {
          durationHours: Number(data.duration),
          time: data.time,
          venueAddress: data.venueAddress
        }
      });
      if (res.data?.success) {
        const bookingData = res.data.data.booking;
        await initiatePayment(bookingData._id, user, (verifyRes) => {
          navigate("/booking-success", { state: { booking: verifyRes.booking || bookingData } });
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to book makeup service.");
    }
  };

  const goDashboard = () => {
    setSuccess(false);
    navigate(DASHBOARD_PATH, { replace: true });
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
          <FormProvider schema={makeupConfirmSchema} onSubmit={onSubmit} defaultValues={{ date: "", time: "", venueAddress: "", duration: 2 }}>
            <div className="makeup-form-card makeup-form-grid">
              <InputField name="date" label="Date" type="date" />
              <InputField name="time" label="Time" type="time" />
              <InputField name="venueAddress" label="Venue Address" type="text" placeholder="Enter address" />
              <InputField name="duration" label="Duration (Hours)" type="number" min={1} onChange={(e) => setDuration(e.target.value)} />
              <button className="makeup-gold-btn makeup-full-btn" type="submit">
                CONFIRM BOOKING
              </button>
            </div>
          </FormProvider>
          <aside className="makeup-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="makeup-summary-row">
              <span>Price per Hour</span>
              <strong>₹{selectedProvider.pricePerHr.toLocaleString()}</strong>
            </div>
            <div className="makeup-summary-row">
              <span>Hours</span>
              <strong>{duration}</strong>
            </div>
            <div className="makeup-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </aside>
        </div>
      </div>
      {renderToast()}
    </div>
  );
}
