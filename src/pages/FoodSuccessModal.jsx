import React from "react";
import Confetti from "react-confetti";

import "./FoodSuccessModal.css";

function FoodSuccessModal({ onClose }) {
  return (
    <div className="popup-overlay">
      <Confetti
        recycle={false}
        numberOfPieces={350}
      />

      <div className="success-popup">
        <div className="popup-icon">✓</div>

        <h1>Booking Successful!</h1>

        <p>
          Your food supply booking has been
          confirmed successfully.
        </p>

        <button className="popup-btn" onClick={onClose}>
          Thank You!
        </button>
      </div>
    </div>
  );
}

export default FoodSuccessModal;