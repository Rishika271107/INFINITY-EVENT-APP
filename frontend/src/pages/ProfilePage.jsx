import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calculator,
  History,
  Calendar,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Star,
  Diamond,
  ShieldCheck,
  Ticket,
  Download,
  CreditCard
} from "lucide-react";

import "./ProfilePage.css";
import API from "../services/api";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [locationName, setLocationName] = useState("Fetching location...");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || ""
  });

  const handleSaveProfile = async () => {
    try {
      const response = await API.put("/auth/profile", editFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.data.success) {
        alert("Profile updated successfully!");
        login(response.data.user, localStorage.getItem("token"));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.state;
            const country = data.address.country;
            if (city && country) {
              setLocationName(`${city}, ${country}`);
            } else {
              setLocationName("Location found");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocationName("Location disabled");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationName("Location disabled");
        }
      );
    } else {
      setLocationName("Location not supported");
    }
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/user/dashboard" },
    { id: "budget", label: "Budget Tracker", icon: <Calculator size={20} />, path: "/budget-tracker" },
    { id: "history", label: "Past Activities", icon: <History size={20} />, path: "/past-activities" },
    { id: "reminder", label: "Reminder", icon: <Bell size={20} />, path: "/user/reminder" },
    { id: "profile", label: "Profile", icon: <User size={20} />, path: "/user/profile", active: true },
  ];

  const stats = [
    { id: 1, label: "Events Attended", value: "24", icon: <Calendar size={22} /> },
    { id: 2, label: "Years With Us", value: "8", icon: <Star size={22} /> },
    { id: 3, label: "Profile Completed", value: "100%", icon: <ShieldCheck size={22} /> },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Booking Confirmed",
      description: "Sunburn Arena 2025",
      time: "2h ago",
      icon: <Ticket size={20} />,
      color: "#d4af37"
    },
    {
      id: 2,
      title: "Payment Successful",
      description: "Paid ₹ 8,999 via Razorpay",
      time: "5h ago",
      icon: <CreditCard size={20} />,
      color: "#d4af37"
    },

    {
      id: 3,
      title: "Reminder Set",
      description: "Sunburn Arena 2025",
      time: "2d ago",
      icon: <Bell size={20} />,
      color: "#d4af37"
    }
  ];

  const handleLogout = () => {
    // Assuming a logout function exists in context, or just navigate to home
    navigate("/");
  };

  return (
    <div className="profile-dashboard">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">∞</div>
          <div className="logo-text">
            <h1>INFINITY</h1>
            <span>GRAND EVENTS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${item.active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-main">
        <header className="main-header">
          <h1 className="page-title">DASHBOARD</h1>
          <div className="header-actions">
            <div 
              className="notification-trigger" 
              onClick={() => navigate("/user/reminder")}
              style={{ cursor: "pointer" }}
            >
              <Bell size={22} />
              <span className="trigger-badge"></span>
            </div>
            <div className="user-avatar-small">
              <User size={24} />
            </div>
          </div>
        </header>

        <section className="main-content-scrollable">
          {/* User Profile Card */}
          <div className="user-profile-card">
            <div className="profile-avatar-large">
              <div className="avatar-placeholder">
                <User size={64} />
              </div>
            </div>
            <div className="profile-details">
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', padding: '4px 8px', marginBottom: '8px', fontSize: '1.2rem' }}
                />
              ) : (
                <h2>{user?.username || "ARJUN PATEL"}</h2>
              )}
              

              <div className="contact-info">
                <div className="info-item">
                  <Mail size={16} />
                  <span>{user?.email || "arjun@example.com"}</span>
                </div>
                <div className="info-item">
                  <Phone size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #d4af37', color: '#fff', borderRadius: '4px', padding: '2px 4px', fontSize: '0.9rem' }}
                    />
                  ) : (
                    <span>{user?.phone || "+91 98765 43210"}</span>
                  )}
                </div>
                <div className="info-item">
                  <MapPin size={16} />
                  <span>{locationName}</span>
                </div>
              </div>
            </div>
            {isEditing ? (
              <div className="edit-actions" style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="save-btn" onClick={handleSaveProfile} style={{ background: '#d4af37', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <span>Save</span>
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button className="edit-btn" onClick={() => {
                setEditFormData({ username: user?.username || "", phone: user?.phone || "" });
                setIsEditing(true);
              }}>
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-card">
                <div className="stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h3>RECENT ACTIVITY</h3>
              <button className="view-all-btn">
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon-container">
                    {activity.icon}
                  </div>
                  <div className="activity-text">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                  </div>
                  <div className="activity-time">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
