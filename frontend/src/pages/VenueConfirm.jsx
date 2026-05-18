import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./VenueFlow.css";

const DASHBOARD_PATH = "/user/dashboard"; // keep this same as your Route path

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
        <span
          key={i}
          className="confetti"
          style={piece}
        />
      ))}
    </div>
  );
}

export default function VenueConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const venueRequest = location.state?.venueRequest || {};
  const selectedVenue = location.state?.selectedVenue;

  const [form, setForm] = useState({
    area: "",
    eventDate: venueRequest.date || "",
    time: venueRequest.time || "",
    duration: 1,
    guestCount: venueRequest.guests || "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => {
      if (!selectedVenue) return 0;
      return Number(selectedVenue.price) * Number(form.duration || 1);
    },
    [selectedVenue, form.duration]
  );

  if (!selectedVenue) {
    return (
      <div className="venue-flow-page">
        <div className="venue-flow-container">
          <p className="empty-state">No venue selected. Go back and choose a venue.</p>
          <button
            className="gold-btn"
            type="button"
            onClick={() => navigate("/venues/select")}
          >
            Back to Venue Selection
          </button>
        </div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.area || !form.eventDate || !form.time || !form.duration || !form.guestCount) {
      alert("Please fill all booking details.");
      return false;
    }
    return true;
  };

  const onConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Create Order in Backend
      const orderResponse = await API.post("/payment/create-order", { amount: total });
      
      if (orderResponse.data.success) {
        const { order } = orderResponse.data;
        
        // Step 2: Open Razorpay Modal
        const options = {
          key: "rzp_test_placeholder", // Replace with real key or fetch from backend
          amount: order.amount,
          currency: order.currency,
          name: "Infinity Grand Events",
          description: `Booking for ${selectedVenue.name}`,
          order_id: order.id,
          handler: async function (response) {
            // Step 3: Verify Payment
            try {
              const verifyResponse = await API.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.data.success) {
                // Step 4: Create Booking on Success
                const bookingResponse = await API.post("/bookings/create", {
                  serviceName: selectedVenue.name,
                  serviceType: "venue",
                  area: form.area,
                  eventDate: form.eventDate,
                  time: form.time,
                  duration: form.duration,
                  guests: form.guestCount,
                  totalAmount: total,
                  paymentStatus: "paid"
                });

                if (bookingResponse.data.success) {
                  setSuccess(true);
                }
              }
            } catch (err) {
              alert("Payment verification failed!");
            }
          },
          prefill: {
            name: user?.username || "",
            email: user?.email || "",
            contact: user?.phone || ""
          },
          theme: {
            color: "#d4af37"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    setSuccess(false);
    navigate(DASHBOARD_PATH, { replace: true });
  };

  return (
    <div className="venue-flow-page">
      <div className="venue-flow-container">
        <button className="back-link" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>

        <div className="stepper">
          <div className="step done">1</div>
          <div className="line active" />
          <div className="step done">2</div>
          <div className="line active" />
          <div className="step active">3</div>
        </div>

        <h1 className="venue-title">Confirm Booking</h1>
        <p className="sub-title">{selectedVenue.name}</p>

        <div className="confirm-layout">
          <form id="venue-confirm-form" className="venue-card form-grid" onSubmit={onConfirmSubmit}>
            <div className="field">
              <label>Residential Area</label>
              <input name="area" placeholder="Enter area" value={form.area} onChange={onChange} />
            </div>

            <div className="field">
              <label>Event Date</label>
              <input type="date" name="eventDate" value={form.eventDate} onChange={onChange} />
            </div>

            <div className="field">
              <label>Time</label>
              <input type="time" name="time" value={form.time} onChange={onChange} />
            </div>

            <div className="field">
              <label>Duration (Days)</label>
              <input type="number" name="duration" min="1" value={form.duration} onChange={onChange} />
            </div>

            <div className="field full">
              <label>Guest Count</label>
              <input
                type="number"
                name="guestCount"
                min="1"
                placeholder="e.g., 200"
                value={form.guestCount}
                onChange={onChange}
              />
            </div>
          </form>

          <div className="summary-card">
            <h3>Price Summary</h3>
            <div className="summary-row">
              <span>Price per Day</span>
              <strong>₹{selectedVenue.price.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>{form.duration} day(s)</strong>
            </div>
            <div className="summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>

            <button className="gold-btn full-btn" type="submit" form="venue-confirm-form" disabled={loading}>
              {loading ? "PROCESSING..." : "CONFIRM BOOKING"}
            </button>
          </div>
        </div>
      </div>

  {success && (
  <div className="modal-backdrop">
    <ConfettiBurst />
    <div className="success-modal" role="dialog" aria-modal="true" aria-label="Booking confirmed">
      <div className="popup-icon" aria-hidden="true">✓</div>
      <h2>Booking Confirmed!</h2>
      <p>Your venue has been booked successfully.</p>
      <button className="gold-btn modal-btn" type="button" onClick={goToDashboard}>
        Thank You!
      </button>
    </div>
  </div>
)}
    </div>
  );
}