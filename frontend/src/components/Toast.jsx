import React, { useEffect } from "react";
import { Info, CheckCircle2, AlertTriangle, X, ShieldAlert } from "lucide-react";
import "./Toast.css";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="toast-icon success-icon" size={20} />,
    error: <ShieldAlert className="toast-icon error-icon" size={20} />,
    warning: <AlertTriangle className="toast-icon warning-icon" size={20} />,
    info: <Info className="toast-icon info-icon" size={20} />
  };

  return (
    <div className={`premium-toast toast-${type}`} role="alert">
      <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }} />
      <div className="toast-content-wrapper">
        <div className="toast-icon-wrap">{icons[type]}</div>
        <div className="toast-text-wrap">
          <p className="toast-title">{type.toUpperCase()}</p>
          <p className="toast-message">{message}</p>
        </div>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}
