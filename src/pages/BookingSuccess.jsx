import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./BookingSuccess.css";

function BookingSuccess() {
  const navigate = useNavigate();

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="booking-page">
      <div className="popup-overlay">
        <div className="success-popup" role="dialog" aria-modal="true" aria-label="Booking confirmed">
          <div className="popup-icon" aria-hidden="true">
            ✓
          </div>

          <h1>Booking Confirmed!</h1>

          <p>Congratulations! Your booking has been successfully completed.</p>

          <button className="popup-btn" onClick={() => navigate("/user/dashboard")}>
            Thank You! 
          </button>
        </div>
      </div>

      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={350}
        recycle={true}
        gravity={0.18}
        initialVelocityY={12}
        style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
/>
    </div>
  );
}

export default BookingSuccess;