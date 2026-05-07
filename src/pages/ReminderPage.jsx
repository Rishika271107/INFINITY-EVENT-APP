import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Clock, Plus, Trash2, X } from "lucide-react";
import "./ReminderPage.css";

function ReminderPage() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const [reminders, setReminders] = useState([
    {
      id: 1,
      eventName: "Wedding Venue Visit",
      date: "2026-03-10",
      time: "10:00",
    },
    {
      id: 2,
      eventName: "Caterer Tasting",
      date: "2026-03-12",
      time: "14:00",
    },
    {
      id: 3,
      eventName: "Photographer Meeting",
      date: "2026-03-15",
      time: "11:00",
    },
    {
      id: 4,
      eventName: "Decoration Finalization",
      date: "2026-03-18",
      time: "16:00",
    },
  ]);

  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
  });

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);

    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddReminder = () => {
    if (!formData.eventName || !formData.date || !formData.time) {
      alert("Please fill all details");
      return;
    }

    const newReminder = {
      id: Date.now(),
      eventName: formData.eventName,
      date: formData.date,
      time: formData.time,
    };

    setReminders([...reminders, newReminder]);

    setFormData({
      eventName: "",
      date: "",
      time: "",
    });

    setShowPopup(false);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter((item) => item.id !== id));
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

        <div className="reminder-list">
          {reminders.map((reminder) => (
            <div className="reminder-card" key={reminder.id}>
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

              <button className="delete-btn" onClick={() => handleDelete(reminder.id)}>
                <Trash2 size={19} />
              </button>
            </div>
          ))}
        </div>
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