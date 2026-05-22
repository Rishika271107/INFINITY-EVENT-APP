import { useState, useCallback } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

/**
 * Enterprise-grade custom React Hook for managing the complete Razorpay checkout lifecycle.
 * Handles dynamic script injection, state tracking, secure callbacks, and premium toasts.
 */
export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Custom glassmorphic toast notification state
  const [activeToast, setActiveToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setActiveToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  /**
   * Helper function to dynamically load Razorpay's external checkout script.
   */
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  /**
   * Triggers the full Razorpay payment and backend verification flow.
   * 
   * @param {string} bookingId - The ID of the pending Booking to pay for.
   * @param {Object} user - The authenticated User object for checkout prefill.
   * @param {Function} onSuccess - Callback invoked on successful payment and signature verification.
   */
  const initiatePayment = useCallback(async (bookingId, user, onSuccess) => {
    if (!bookingId) {
      showToast("Invalid booking selection.", "error");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Inject the external Razorpay Checkout SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to load Razorpay payment servers. Please check your internet connection.");
      }

      // 2. Request a secure Razorpay Order from the Backend
      const orderResponse = await API.post("/payment/create-order", { bookingId });
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to initialize payment order.");
      }

      const { order_id, amount, currency, key_id, booking } = orderResponse.data;

      // 3. Define local options matching Razorpay parameters
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Infinity Grand Events",
        description: `Premium reservation: ${booking.serviceName} (${booking.serviceType})`,
        order_id: order_id,
        image: "https://res.cloudinary.com/dgmoarh1c/image/upload/v1714578129/infinity_gold_logo.png", // Golden luxury placeholder icon
        handler: async function (response) {
          setLoading(true);
          try {
            showToast("Verifying payment transaction...", "info");

            // 4. Submit payload details to backend for SHA256 verification and database status commits
            const verifyResponse = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });

            if (verifyResponse.data.success) {
              showToast("Payment verified! Booking confirmed.", "success");
              if (onSuccess) {
                // Return verified payload
                onSuccess(verifyResponse.data);
              }
            } else {
              throw new Error(verifyResponse.data.message || "Verification failed.");
            }
          } catch (verifyErr) {
            console.error("Payment Verification Fail:", verifyErr);
            setError(verifyErr.response?.data?.message || verifyErr.message || "Payment signature invalid.");
            showToast("Payment verification failed! Please contact support.", "error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#d4af37" // Luxury Gold accents
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            showToast("Payment window closed. Checkout incomplete.", "warning");
          }
        }
      };

      // 5. Instanciate and open Razorpay overlay modal
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

    } catch (err) {
      console.error("Payment Initialization Fail:", err);
      const errMsg = err.response?.data?.message || err.message || "Checkout failed to initialize.";
      setError(errMsg);
      showToast(errMsg, "error");
      setLoading(false);
    }
  }, [loadRazorpayScript, showToast]);

  /**
   * Triggers checkout retry for a previously failed/pending booking.
   */
  const initiatePaymentRetry = useCallback(async (bookingId, user, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to contact payment servers.");
      }

      // Invoke payment retry order creation
      const orderResponse = await API.post("/payment/retry", { bookingId });
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to recreate payment order.");
      }

      const { order_id, amount, currency, key_id, booking } = orderResponse.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Infinity Grand Events",
        description: `Retry: ${booking.serviceName}`,
        order_id: order_id,
        handler: async function (response) {
          setLoading(true);
          try {
            showToast("Verifying payment...", "info");
            const verifyResponse = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });

            if (verifyResponse.data.success) {
              showToast("Payment verified! Booking confirmed.", "success");
              if (onSuccess) onSuccess(verifyResponse.data);
            } else {
              throw new Error("Verification failed.");
            }
          } catch (vErr) {
            setError(vErr.message);
            showToast("Signature mismatch in retry.", "error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#d4af37"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            showToast("Payment dismissed.", "warning");
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();

    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  }, [loadRazorpayScript, showToast]);

  /**
   * Helper component generator to render self-contained glassmorphic notifications.
   */
  const renderToast = () => {
    if (!activeToast) return null;
    return (
      <Toast
        message={activeToast.message}
        type={activeToast.type}
        onClose={closeToast}
      />
    );
  };

  return {
    initiatePayment,
    initiatePaymentRetry,
    loading,
    error,
    renderToast,
    showToast
  };
}
