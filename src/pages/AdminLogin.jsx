import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // ─── SUBMIT ───────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  // ─── JSX ──────────────────────────────────────────────────
  return (
    <div className="admin-auth-page">

      {/* ── HEADER ── */}
      <div className="admin-auth-header">
        <p className="admin-auth-subtitle">Admin Portal</p>
        <h1 className="admin-auth-title">Secure Access</h1>
        <div className="admin-auth-line" />
      </div>

      {/* ── FORM CARD ── */}
      <form className="admin-auth-card" onSubmit={handleLogin}>

        {/* Badge */}
        <div className="admin-shield-badge">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Administrator Only</span>
        </div>

        <div className="form-group">
          <label>Admin ID</label>
          <input
            type="text"
            placeholder="Enter your admin ID"
            required
            id="admin-id"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@infinity.com"
            required
            id="admin-email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              id="admin-password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((p) => !p)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="admin-submit-btn" id="admin-login-btn">
          Access Dashboard
        </button>

        <p className="admin-back-note">
          Not an admin?{" "}
          <button
            type="button"
            id="go-to-user-login-btn"
            onClick={() => navigate("/user/login")}
          >
            User Login
          </button>
        </p>
      </form>

      {/* ── BACK BUTTON ── */}
      <button
        className="admin-auth-back-btn"
        id="admin-back-role-btn"
        onClick={() => navigate("/role-selection")}
      >
        ← Back To Role Selection
      </button>
    </div>
  );
}

export default AdminLogin;
