import React from "react";
import Confetti from "react-confetti";

import "./FoodSuccessModal.css";

function FoodSuccessModal({ onClose }) {
  return (
    <div className="success-overlay">
      <Confetti
        recycle={false}
        numberOfPieces={350}
      />

      <div className="success-modal">
        <div className="success-icon">✓</div>

        <h1>Booking Successful!</h1>

        <p>
          Your food supply booking has been
          confirmed successfully.
        </p>

        <button onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default FoodSuccessModal;