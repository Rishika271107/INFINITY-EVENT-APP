import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import "./PastActivities.css";

function PastActivities() {
  const navigate = useNavigate();

  const activities = [
    {
      service: "Venue",
      place: "The Taj Palace",
      date: "Jan 15, 2026",
      status: "Completed",
      price: "₹75,000",
    },
    {
      service: "Photography",
      place: "Lens Studio",
      date: "Jan 15, 2026",
      status: "Completed",
      price: "₹25,000",
    },
    {
      service: "Decoration",
      place: "Royal Decor",
      date: "Feb 1, 2026",
      status: "Confirmed",
      price: "₹40,000",
    },
    {
      service: "Catering",
      place: "Grand Kitchen",
      date: "Feb 1, 2026",
      status: "Confirmed",
      price: "₹1,20,000",
    },
    {
      service: "Makeup",
      place: "Glamour Studio",
      date: "Mar 5, 2026",
      status: "Completed",
      price: "₹15,000",
    },
  ];

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

        {activities.map((item, index) => (
          <div className="activity-card" key={index}>

            {/* LEFT SIDE */}
            <div className="activity-left">

              {item.status === "Completed" ? (
                <CheckCircle
                  size={22}
                  className="status-icon completed"
                />
              ) : (
                <Clock
                  size={22}
                  className="status-icon pending"
                />
              )}

              <div className="activity-info">
                <h3>{item.service}</h3>
                <p>
                  {item.place} • {item.date}
                </p>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="activity-right">

              <span
                className={
                  item.status === "Completed"
                    ? "status-badge completed"
                    : "status-badge confirmed"
                }
              >
                {item.status}
              </span>

              <h4 className="activity-price">
                {item.price}
              </h4>

              <button className="download-btn">
                <Download size={17} />
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default PastActivities;