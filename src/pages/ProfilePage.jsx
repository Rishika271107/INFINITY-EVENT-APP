import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserCircle2,
  Mail,
  Phone,
  MapPin,
  Pencil,
} from "lucide-react";

import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-container">

        <button
          className="profile-back-btn"
          onClick={() => navigate("/user/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="profile-title-section">
          <h1>My Profile</h1>
          <div className="title-line"></div>
        </div>

        <div className="profile-card">

          <div className="profile-top">

            <div className="profile-icon-wrapper">
              <UserCircle2 size={72} />
            </div>

            <h2>Arjun Patel</h2>
            <p>Premium Member</p>

          </div>

          <div className="profile-info-section">

            <div className="profile-info-card">
              <div className="profile-info-icon">
                <Mail size={23} />
              </div>

              <div>
                <span>Email</span>
                <h3>arjun@example.com</h3>
              </div>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-icon">
                <Phone size={23} />
              </div>

              <div>
                <span>Phone</span>
                <h3>+91 98765 43210</h3>
              </div>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-icon">
                <MapPin size={23} />
              </div>

              <div>
                <span>City</span>
                <h3>Mumbai, India</h3>
              </div>
            </div>

          </div>

          <button className="edit-profile-btn">
            <Pencil size={18} />
            Edit Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;