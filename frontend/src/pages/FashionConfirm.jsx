import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRazorpay } from "../hooks/useRazorpay";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { fashionConfirmSchema } from "../utils/validationSchemas";
import API from "../services/api";
import "./FashionFlow.css";

const DASHBOARD_PATH = "/user/dashboard";

function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: 70 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1.2}s`,
      animationDuration: `${2.7 + Math.random() * 2.1}s`,
      background: ["#f3cf72", "#d8ab2f", "#ffffff", "#f0c649"][i % 4],
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

export default function FashionConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDesigner = location.state?.selectedDesigner;

  const { user } = useAuth();
  const { initiatePayment, renderToast } = useRazorpay();

  const total = useMemo(() => {
    if (!selectedDesigner) return 0;
    // form data will be accessed via FormProvider context, placeholder for hours
    // We'll compute total after submission based on submitted data
    return 0; // placeholder, actual total displayed after form submission
  }, [selectedDesigner]);

  if (!selectedDesigner) {
    return (
      <div className="fashion-page">
        <div className="fashion-container">
          <p className="empty-text">No designer selected. Please go back and select one.</p>
          <button className="gold-btn" type="button" onClick={() => navigate("/fashion-designing")}>Back</button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    // compute total based on selected designer price and hours
    const computedTotal = Number(selectedDesigner.pricePerHr) * Number(data.hours);
    try {
      const res = await API.post("/bookings", {
        eventDate: data.date,
        serviceName: selectedDesigner.name,
        serviceType: "Fashion Designing",
        totalAmount: computedTotal,
        bookingDetails: {
          durationHours: Number(data.hours),
          notes: data.notes,
        }
      });
      if (res.data?.success) {
        const bookingData = res.data.data.booking;
        await initiatePayment(bookingData._id, user, (verifyRes) => {
          navigate("/booking-success", { state: { booking: verifyRes.booking || bookingData } });
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to book fashion service.");
    }
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
          <FormProvider schema={fashionConfirmSchema} onSubmit={onSubmit}>
            <form id="fashion-booking-form" className="confirm-card">
              <div className="field-grid">
                <InputField name="hours" label="Hours Needed" type="number" min="1" placeholder="Hours" />
                <InputField name="date" label="Date" type="date" />
                <InputField name="notes" label="Special Notes" type="textarea" placeholder="Describe your requirements..." rows="4" />
              </div>
              <button className="gold-btn full-btn" type="submit" form="fashion-booking-form">
                Confirm Booking
              </button>
            </form>
            <aside className="summary-card">
              <h3>PRICE SUMMARY</h3>
              <div className="summary-row">
                <span>Price per Hour</span>
                <strong>₹{selectedDesigner.pricePerHr.toLocaleString()}</strong>
              </div>
              <div className="summary-row">
                <span>Hours</span>
                <strong>{/* Hours will be reflected via form state after submission */}</strong>
              </div>
              <div className="summary-row total">
                <span>TOTAL</span>
                <strong>₹{/* total will be calculated after form submission */}</strong>
              </div>
            </aside>
          </FormProvider>
        </div>
      </div>
      {renderToast()}
    </div>
  );
}
