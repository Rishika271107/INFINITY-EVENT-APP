import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useBookingSubmission } from "../hooks/useBookingSubmission";

import { FormProvider } from "../components/forms/FormProvider";
import { useCustomForm } from "../components/forms/FormProvider";
import { useWatch } from "react-hook-form";
import { InputField } from "../components/forms/InputField";
import LoadingButton from "../components/async/LoadingButton";
import ErrorState from "../components/async/ErrorState";
import { foodCheckoutSchema } from "../utils/validationSchemas";

/* ── Inner component rendered INSIDE <FormProvider> so useCustomForm() works ── */
function CheckoutFormContent({ hotel, subtotal, gst, finalTotal, error, loading }) {
  const { register, formState: { errors } } = useCustomForm();
  const [localGuests, setLocalGuests] = useState(1); // Default to 1 so math isn't 0 initially

  const numFinalTotal = Number(finalTotal) || 0;
  const numSubtotal = Number(subtotal) || 0;
  const numGst = Number(gst) || 0;
  const grandTotal = numFinalTotal * localGuests;

  return (
    <>
      {/* LEFT FORM */}
      <div className="checkout-form">
        <h1>Checkout Details</h1>
        {error && <ErrorState message={error} />}
        
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="guests">Number of Guests</label>
          <input 
            id="guests"
            type="number" 
            placeholder="Enter number of guests" 
            min={1} 
            defaultValue={1}
            required 
            {...register("guests", {
              onChange: (e) => setLocalGuests(Number(e.target.value) || 0)
            })}
          />
          {errors?.guests && <p style={{ color: 'red', marginTop: '4px', fontSize: '14px' }}>{errors.guests.message}</p>}
        </div>
        <InputField name="eventDate" label="Event Date" type="date" required />
        <InputField name="eventTime" label="Event Time" type="time" required />
        <InputField name="address" label="Event Address" type="text" placeholder="Enter address" required />
        <textarea
          name="specialRequests"
          placeholder="Special Requests (optional)"
          className="input-field"
          {...register("specialRequests")}
        />
        <LoadingButton loading={loading}>Confirm Booking</LoadingButton>
      </div>

      {/* RIGHT SUMMARY CARD */}
      <div className="summary-card">
        <h2>{hotel?.name}</h2>
        <div className="summary-details">
          <div className="summary-row">
            <p>Food Total</p>
            <span>₹{numSubtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <p>GST (5%)</p>
            <span>₹{numGst.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <p>Total Per Guest</p>
            <span>₹{numFinalTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <p>Guests</p>
            <span>{localGuests}</span>
          </div>
          <hr />
          <div className="summary-row total-row">
            <p>Grand Total</p>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main page component ── */
function FoodCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { hotel, subtotal = 0, gst = 0, finalTotal = 0 } = location.state || {};

  const { submitBooking, loading, error } = useBookingSubmission();

  const onSubmit = async (data) => {
    const { guests, eventDate, eventTime, address, specialRequests } = data;
    const numGuests = Number(guests) || 0;
    
    const numFinalTotal = Number(finalTotal) || 0;
    const total = numFinalTotal * numGuests;
    // Build payload according to standardized bookingDetails
    const payload = {
      serviceName: hotel?.name || "Food Service",
      serviceType: "Food",
      totalAmount: total,
      eventDate: `${eventDate}T${eventTime}`,
      bookingDetails: {
        guestCount: numGuests,
        address,
        specialRequests,
        selectedItems: [], // TODO: populate with actual selected items
        cateringType: "",
      },
    };
    await submitBooking(payload);
    // No payment integration; navigate handled in hook's success flow
  };

  return (
    <div className="checkout-page">
      <FormProvider schema={foodCheckoutSchema} onSubmit={onSubmit}>
        <CheckoutFormContent
          hotel={hotel}
          subtotal={subtotal}
          gst={gst}
          finalTotal={finalTotal}
          error={error}
          loading={loading}
        />
      </FormProvider>
      {/* renderToast removed as Razorpay is not used */}
    </div>
  );
}

export default FoodCheckout;