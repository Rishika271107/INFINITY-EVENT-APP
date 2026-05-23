import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBooking,
  normalizeBookingPayload,
  handleBookingSuccess,
  handleBookingError,
} from "../services/bookingService";

/**
 * Reusable hook to handle booking submissions.
 * It centralizes loading state, error handling, payload normalization,
 * API call, and navigation to the success page.
 */
export const useBookingSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submitBooking = async ({
    serviceName,
    serviceType,
    eventDate,
    totalAmount,
    bookingDetails,
  }) => {
    if (loading) return; // prevent duplicate submissions
    setLoading(true);
    setError(null);
    try {
      const payload = normalizeBookingPayload({
        serviceName,
        serviceType,
        totalAmount,
        eventDate,
        bookingDetails,
      });
      const res = await createBooking(payload);
      if (res.data?.success) {
        handleBookingSuccess(navigate, res.data.data.booking);
      } else {
        // If API indicates failure without throwing
        const msg = res.data?.message || "Booking failed";
        throw new Error(msg);
      }
    } catch (err) {
      handleBookingError(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { submitBooking, loading, error };
};
