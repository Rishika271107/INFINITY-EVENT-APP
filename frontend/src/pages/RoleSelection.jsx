
import { useNavigate } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";
import "./RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <div className="role-content">
        <p className="role-subtitle">Choose Your Role</p>

        <h1 className="role-title">Welcome Back</h1>

        <div className="role-line"></div>

        <div className="role-cards">
         <div className="role-card" onClick={() => navigate("/user/login")}>
            <div className="role-icon">
                <User size={34} strokeWidth={2.2} />
            </div>

            <h2>User</h2>
            <p>
             Plan and book your dream
                <br />
                events with ease
            </p>
        </div>

          <div className="role-card" onClick={() => navigate("/admin-login")}>
            <div className="role-icon">
              <ShieldCheck size={34} strokeWidth={2.2} />
            </div>

            <h2>Admin</h2>
            <p>
              Manage your services and
              <br />
              grow your business
            </p>
          </div>
        </div>

        <button className="back-home-btn" onClick={() => navigate("/")}>
          ← Back To Home
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;