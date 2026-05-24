import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      if (response.data.success) {
        const { user, token } = response.data;
        login(user, token);
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

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
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@infinity.com"
            value={formData.email}
            onChange={handleChange}
            required
            id="admin-email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
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
