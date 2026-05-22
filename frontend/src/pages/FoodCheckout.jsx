import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FoodSuccessModal from "./FoodSuccessModal";

import "./FoodCheckout.css";
import API from "../services/api";

function FoodCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hotel,
    subtotal = 0,
    gst = 0,
    finalTotal = 0,
  } = location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [guests, setGuests] = useState(1);

  const grandTotal =
    guests > 0 ? finalTotal * guests : finalTotal;

  return (
    <div className="checkout-page">
      {/* LEFT FORM */}
      <div className="checkout-form">
        <h1>Checkout Details</h1>

        <input
          type="number"
          placeholder="Number Of Guests"
          value={guests}
          min="1"
          onChange={(e) =>
            setGuests(Number(e.target.value))
          }
        />

        <input type="date" />

        <input type="time" />

        <textarea placeholder="Event Address"></textarea>

        <textarea placeholder="Special Requests"></textarea>
      </div>

      {/* RIGHT SUMMARY CARD */}
      <div className="summary-card">
        <h2>{hotel?.name}</h2>

        <div className="summary-details">
          <div className="summary-row">
            <p>Food Total</p>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <p>GST (5%)</p>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <p>Total Per Guest</p>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <p>Guests</p>
            <span>{guests}</span>
          </div>

          <hr />

          <div className="summary-row total-row">
            <p>Grand Total</p>

            <span>
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button
           disabled={loading}
           onClick={async () => {
             if (guests < 1) {
               alert("Please specify number of guests.");
               return;
             }
             setLoading(true);
             try {
               const res = await API.post("/bookings/create", {
                 eventDate: new Date().toISOString(),
                 durationHours: guests,
                 serviceName: hotel?.name || "Food Service",
                 serviceType: "Food",
                 totalAmount: grandTotal,
               });
               if (res.data?.success) {
                 setShowModal(true);
               } else {
                 alert(res.data?.message || "Booking failed");
               }
             } catch (err) {
               alert(err.response?.data?.message || err.message || "Failed to book food service.");
             } finally {
               setLoading(false);
             }
           }}
        >
          Book Now
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <FoodSuccessModal
          onClose={() => {
            setShowModal(false);
            navigate("/user/dashboard");
          }}
        />
      )}
    </div>
  );
}

export default FoodCheckout;