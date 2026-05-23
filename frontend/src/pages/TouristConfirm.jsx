import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingButton from "../components/async/LoadingButton";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { touristSchema } from "../utils/validationSchemas";
import "./TouristFlow.css";

const DASHBOARD_PATH = "/user/dashboard";

function ConfettiBurst() {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1.2}s`,
      animationDuration: `${2.8 + Math.random() * 2.2}s`,
      background: ["#f7d365", "#d7a924", "#f0c649", "#ffffff"][i % 4],
    }))
  );
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span key={i} className="confetti" style={piece} />
      ))}
    </div>
  );
}

export default function TouristConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedHotel = location.state?.selectedHotel;
  const selectedPlace = location.state?.selectedPlace;

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState(1);
  const { user } = useAuth();

  const total = useMemo(() => {
    const pricePerNight = Number(selectedHotel?.pricePerNight || 0);
    return pricePerNight * Number(rooms || 1);
  }, [selectedHotel, rooms]);

  if (!selectedHotel || !selectedPlace) {
    return (
      <div className="tourist-page">
        <div className="tourist-container">
          <p className="tourist-empty-text">Please select a hotel first.</p>
          <button
            className="tourist-gold-btn"
            type="button"
            onClick={() => navigate("/services/tourist")}
          >
            Go to Tourist Places
          </button>
        </div>
      </div>
    );
  }

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const nights = calculateNights(data.checkIn, data.checkOut);
      const res = await API.post("/bookings/create", {
        eventDate: data.checkIn,
        serviceName: selectedHotel?.name,
        serviceType: "Tourism",
        totalAmount: total,
        bookingDetails: {
          location: selectedPlace?.name,
          hotelName: selectedHotel?.name,
          rooms: Number(data.rooms),
          nights,
          travelers: Number(data.guests),
          specialRequests: data.specialRequests || "",
        },
      });
      if (res.data?.success) {
        const bookingData = res.data.data.booking;
        navigate("/booking-success", { state: { booking: bookingData } });
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to book tourism service.");
    } finally {
      setLoading(false);
    }
  };

  const goDashboard = () => {
    navigate(DASHBOARD_PATH, { replace: true });
  };

  return (
    <div className="tourist-page">
      <div className="tourist-container">
        <button className="tourist-back-btn" type="button" onClick={() => navigate(-1)}>
          ← BACK
        </button>
        <h1 className="tourist-title">Confirm Booking</h1>
        <p className="tourist-subtitle">
          {selectedHotel?.name?.toUpperCase()} — {selectedPlace?.name}
        </p>
        <div className="tourist-confirm-layout">
          <FormProvider
            schema={touristSchema}
            onSubmit={onSubmit}
            defaultValues={{
              checkIn: "",
              checkOut: "",
              guests: 2,
              rooms: 1,
              roomType: selectedHotel?.type || "Deluxe",
              specialRequests: "",
            }}
          >
            <div className="tourist-form-card tourist-form-grid">
              <InputField name="checkIn" label="Check-in Date" type="date" />
              <InputField name="checkOut" label="Check-out Date" type="date" />
              <InputField name="guests" label="Guests" type="number" min={1} />
              <InputField
                name="rooms"
                label="Rooms"
                type="number"
                min={1}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
              <InputField
                name="roomType"
                label="Room Type"
                type="select"
                options={[
                  { value: "Standard", label: "Standard" },
                  { value: "Deluxe", label: "Deluxe" },
                  { value: "Suite", label: "Suite" },
                  { value: "Luxury", label: "Luxury" },
                ]}
              />
              <InputField
                name="specialRequests"
                label="Special Requests"
                type="text"
                placeholder="Any special requirements"
              />
              <LoadingButton
                className="tourist-gold-btn tourist-full-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "BOOKING..." : "CONFIRM BOOKING"}
              </LoadingButton>
            </div>
          </FormProvider>
          <aside className="tourist-summary-card">
            <h3>PRICE SUMMARY</h3>
            <div className="tourist-summary-row">
              <span>Price per Night</span>
              <strong>₹{selectedHotel?.pricePerNight?.toLocaleString()}</strong>
            </div>
            <div className="tourist-summary-row">
              <span>Nights</span>
              <strong>{/* Nights will be calculated after dates are selected */}</strong>
            </div>
            <div className="tourist-summary-row">
              <span>Rooms</span>
              <strong>{rooms}</strong>
            </div>
            <div className="tourist-summary-row total">
              <span>TOTAL</span>
              <strong>₹{total.toLocaleString()}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}