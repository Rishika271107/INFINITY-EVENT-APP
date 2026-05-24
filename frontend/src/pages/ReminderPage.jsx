import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Clock, Plus, Trash2, X } from "lucide-react";
import API from "../services/api";
import "./ReminderPage.css";

function ReminderPage() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/reminders");
        if (res.data?.success) {
          setReminders(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
        setError(err.response?.data?.message || err.message || "Failed to load reminders.");
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const formatDateTime = (date, time) => {
    try {
      const dateObj = new Date(`${date}T${time}`);

      return dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return `${date} ${time}`;
    }
  };

  const handleAddReminder = async () => {
    if (!formData.eventName || !formData.date || !formData.time) {
      alert("Please fill all details");
      return;
    }

    try {
      const res = await API.post("/reminders", {
        eventName: formData.eventName,
        date: formData.date,
        time: formData.time
      });

      if (res.data?.success) {
        setReminders((prev) => [...prev, res.data.data]);
        setFormData({
          eventName: "",
          date: "",
          time: "",
        });
        setShowPopup(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to set reminder");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/reminders/${id}`);
      if (res.data?.success) {
        setReminders(reminders.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete reminder");
    }
  };

  return (
    <div className="reminder-page">
      <div className="reminder-container">
        <button className="reminder-back" onClick={() => navigate("/user/dashboard")}>
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="reminder-header">
          <div>
            <h1>Reminders</h1>
            <p>Upcoming event alerts</p>
          </div>

          <button className="add-reminder-btn" onClick={() => setShowPopup(true)}>
            <Plus size={18} />
            Add
          </button>
        </div>

        {loading ? (
          <p className="loading-text" style={{ color: "#f3cf72", textAlign: "center", marginTop: "2rem" }}>Loading reminders...</p>
        ) : error ? (
          <p className="error-text" style={{ color: "#ff5252", textAlign: "center", marginTop: "2rem" }}>{error}</p>
        ) : (
          <div className="reminder-list">
            {reminders.map((reminder) => (
              <div className="reminder-card" key={reminder._id}>
                <div className="reminder-left">
                  <Bell className="bell-icon" size={23} />

                  <div>
                    <h3>{reminder.eventName}</h3>
                    <p>
                      <Clock size={15} />
                      {formatDateTime(reminder.date, reminder.time)}
                    </p>
                  </div>
                </div>

                <button className="delete-btn" onClick={() => handleDelete(reminder._id)}>
                  <Trash2 size={19} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              <X size={20} />
            </button>

            <h2>Add Reminder</h2>
            <p className="popup-subtitle">Enter your event details</p>

            <div className="popup-form">
              <label>Event Name</label>
              <input
                type="text"
                placeholder="Enter event name"
                value={formData.eventName}
                onChange={(e) =>
                  setFormData({ ...formData, eventName: e.target.value })
                }
              />

              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />

              <button className="done-btn" onClick={handleAddReminder}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReminderPage;
