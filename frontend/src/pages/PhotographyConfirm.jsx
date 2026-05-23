import { useMemo, useState } from "react";
import { useBookingSubmission } from "../hooks/useBookingSubmission";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingButton from "../components/async/LoadingButton";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { photographySchema } from "../utils/validationSchemas";
import "./PhotographyFlow.css";

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

export default function PhotographyConfirm() {
  const { submitBooking, loading, error } = useBookingSubmission();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPhotographer = location.state?.selectedPhotographer;
  const photographyRequest = location.state?.photographyRequest || {};

  const [hours, setHours] = useState(2);
  const { user } = useAuth();
  // Loading handled by useBookingSubmission
  

  const total = useMemo(() => {
    if (!selectedPhotographer) return 0;
    return Number(selectedPhotographer.pricePerHr) * Number(hours || 0);
  }, [selectedPhotographer, hours]);

  if (!selectedPhotographer) {
    return (
      <div className="photo-flow-page">
        <div className="photo-flow-container">
          <p className="photo-empty-text">No photographer selected. Please select one first.</p>
          <button className="photo-gold-btn" type="button" onClick={() => navigate("/services/photography/select")}>Go to Photographer List</button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const totalAmount = Number(selectedPhotographer.pricePerHr) * Number(data.hours);
    const payload = {
      serviceName: selectedPhotographer.name,
      serviceType: "Photography",
      eventDate: data.date,
      totalAmount,
      bookingDetails: {
        shootType: data.shootType,
        hours: Number(data.hours),
        locationName: data.locationName,
        notes: data.notes || "",
      },
    };
    await submitBooking(payload);
  };

  const goDashboard = () => {
    navigate(DASHBOARD_PATH, { replace: true });
  };

  return (
    <div className="photo-flow-page">
      <div className="photo-flow-container">
        <button className="photo-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>
        <h1 className="photo-title">Confirm Booking</h1>
        <p className="photo-subtitle">
          {selectedPhotographer.name} — {selectedPhotographer.city}
        </p>
        <div className="photo-confirm-layout">
          <FormProvider
            schema={photographySchema}
            onSubmit={onSubmit}
            defaultValues={{
              hours: 2,
              date: photographyRequest.date || "",
              locationName: "",
              shootType: photographyRequest.eventType || "",
            }}
          >
            <div className="photo-details-card photo-details-grid">
              <InputField
                name="hours"
                label="Number of Hours"
                type="number"
                min={1}
                onChange={(e) => setHours(Number(e.target.value))}
              />
              <InputField name="date" label="Date" type="date" />
              <InputField name="locationName" label="Location" type="text" placeholder="Enter location" />
              <InputField
                name="shootType"
                label="Shoot Type"
                type="select"
                options={[
                  { value: "", label: "Select type" },
                  { value: "Wedding", label: "Wedding" },
                  { value: "Pre-wedding", label: "Pre-wedding" },
                  { value: "Engagement", label: "Engagement" },
                  { value: "Birthday", label: "Birthday" },
                  { value: "Corporate", label: "Corporate" },
                ]}
              />
              <LoadingButton className="photo-gold-btn photo-full-btn" type="submit" disabled={loading}>
                CONFIRM BOOKING
              </LoadingButton>
            </div>
          </FormProvider>
          <aside className="photo-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="photo-summary-row">
              <span>Price per Hour</span>
              <strong>₹{selectedPhotographer.pricePerHr.toLocaleString()}</strong>
            </div>
            <div className="photo-summary-row">
              <span>Hours</span>
              <strong>{hours}</strong>
            </div>
            <div className="photo-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </aside>
        </div>
      </div>
      
    </div>
  );
}
