import API from "./api";

/**
 * Normalize the booking payload to match backend expectations.
 * @param {Object} params – Contains serviceName, serviceType, totalAmount, eventDate and bookingDetails.
 * @returns {Object} Normalized payload.
 */
export const normalizeBookingPayload = ({
  serviceName,
  serviceType,
  totalAmount,
  eventDate,
  bookingDetails,
}) => ({
  serviceName,
  serviceType,
  totalAmount,
  eventDate,
  bookingDetails,
});

/** Create a new booking */
export const createBooking = async (payload) => {
  const response = await API.post("/bookings", payload);
  return response;
};

/** Update an existing booking */
export const updateBooking = async (bookingId, updates) => {
  const response = await API.put(`/bookings/${bookingId}`, updates);
  return response;
};

/** Fetch all bookings for a user */
export const fetchUserBookings = async (userId) => {
  const response = await API.get(`/bookings/user/${userId}`);
  return response;
};

/** Fetch a single booking by its ID */
export const fetchBookingById = async (bookingId) => {
  const response = await API.get(`/bookings/${bookingId}`);
  return response;
};

/** Navigate to success page after a successful booking */
export const handleBookingSuccess = (navigate, bookingData) => {
  navigate("/booking-success", { state: { booking: bookingData } });
};

/** Centralized error handling */
export const handleBookingError = (error) => {
  const msg =
    error.response?.data?.message ||
    error.message ||
    "An error occurred while processing the booking.";
  alert(msg);
};
