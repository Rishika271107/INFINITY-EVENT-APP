import { useBookingSubmission } from "../hooks/useBookingSubmission";

const DASHBOARD_PATH = "/user/dashboard";

function DecorationBooking() {
  const navigate = useNavigate();

// Removed local loading state; using hook
  const { submitBooking, loading, error } = useBookingSubmission();
  // Razorpay removed
  // const { initiatePayment, loading: paymentLoading, renderToast } = useRazorpay();

  const pricePerDay = 15000;
  const total = pricePerDay * Number(days || 1);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onConfirm = async () => {
    if (!form.date || !form.venue) {
      alert("Please fill in the date and venue fields.");
      return;
    }
    try {
      const payload = {
        serviceName: "Royal Floral Studio",
        serviceType: "Decoration",
        totalAmount: total,
        eventDate: form.date,
        bookingDetails: {
          theme: form.theme,
          decorationStyle: form.decorationStyle,
          venue: form.venue,
          durationHours: Number(days),
          time: form.time,
          flowerType: form.flowerType,
          specialRequests: form.specialRequests,
        },
      };
      await submitBooking(payload);
      navigate(DASHBOARD_PATH);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to book decoration service.");
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="back-btn" role="button" tabIndex={0} onClick={() => navigate(-1)}>
          ← BACK
        </div>

        <div className="stepper">
          <div className="step active">1</div>
          <div className="line active-line"></div>
          <div className="step active">2</div>
          <div className="line active-line"></div>
          <div className="step active">3</div>
        </div>

        <h1 className="booking-title">CONFIRM BOOKING</h1>
        <p className="booking-subtitle">ROYAL FLORAL STUDIO — MUMBAI</p>

        <div className="booking-layout">
          <div className="booking-form-card">
            <div className="booking-grid">
              <div className="form-group">
                <label>DATE</label>
                <input type="date" name="date" value={form.date} onChange={onChange} />
              </div>

              <div className="form-group">
                <label>TIME</label>
                <input type="time" name="time" value={form.time} onChange={onChange} />
              </div>

              <div className="form-group">
                <label>VENUE</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="Enter venue"
                  value={form.venue}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label>THEME</label>
                <input
                  type="text"
                  name="theme"
                  placeholder="e.g., Royal Gold"
                  value={form.theme}
                  onChange={onChange}
                />
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
              disabled={loading || paymentLoading}
              onClick={onConfirm}
            >
              {loading || paymentLoading ? "PROCESSING..." : "CONFIRM BOOKING"}
            </button>
          </div>
        </div>
      </div>
      {renderToast()}
    </div>
  );
}

export default DecorationBooking;