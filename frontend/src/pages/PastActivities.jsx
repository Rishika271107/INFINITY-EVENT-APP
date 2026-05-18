import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  AlertCircle
} from "lucide-react";
import API from "../services/api";
import "./PastActivities.css";

function PastActivities() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await API.get("/bookings/my-bookings");
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (err) {
        setError("Failed to load your booking history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="past-page">

      {/* HEADER */}
      <div className="past-header">

        <button
          className="back-btn"
          onClick={() => navigate("/user/home")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <h1>PAST ACTIVITIES</h1>
        <p>Your booking history & invoices</p>

      </div>

      {/* ACTIVITY LIST */}
      <div className="activities-container">

        {loading ? (
          <div className="loading-state">
            <p>Loading your activities...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <AlertCircle size={40} color="#d4af37" />
            <p>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>You haven't made any bookings yet.</p>
            <button className="gold-btn" onClick={() => navigate("/user/home")}>Explore Services</button>
          </div>
        ) : (
          bookings.map((item) => (
            <div className="activity-card" key={item._id}>

              {/* LEFT SIDE */}
              <div className="activity-left">

                {item.bookingStatus === "confirmed" ? (
                  <CheckCircle
                    size={22}
                    className="status-icon completed"
                  />
                ) : item.bookingStatus === "cancelled" ? (
                  <AlertCircle
                    size={22}
                    className="status-icon cancelled"
                    style={{ color: '#ff4d4d' }}
                  />
                ) : (
                  <Clock
                    size={22}
                    className="status-icon pending"
                  />
                )}

                <div className="activity-info">
                  <h3>{item.serviceName}</h3>
                  <p>
                    {item.serviceType.toUpperCase()} • {formatDate(item.eventDate)}
                  </p>
                  {item.area && <p className="area-info">Location: {item.area}</p>}
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="activity-right">

                <span
                  className={`status-badge ${item.bookingStatus}`}
                >
                  {item.bookingStatus.toUpperCase()}
                </span>

                <h4 className="activity-price">
                  ₹{item.totalAmount.toLocaleString()}
                </h4>

                <button className="download-btn" title="Download Invoice">
                  <Download size={17} />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default PastActivities;