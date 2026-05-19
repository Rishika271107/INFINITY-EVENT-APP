import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import "./UserAuth.css";

function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure login
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      
      if (response.data.success) {
        // Direct Login Success
        const { user, token } = response.data;
        login(user, token);
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header login-header">
        <p className="auth-subtitle">User Login</p>
        <h1 className="auth-title">Welcome Back</h1>
        <div className="auth-line"></div>
      </div>

      <form className="auth-card login-card" onSubmit={handleLogin}>
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            placeholder="your@email.com" 
            value={formData.email}
            onChange={handleChange}
            required
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
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="forgot-password-link" style={{ textAlign: "right", marginTop: "10px" }}>
            <button 
              type="button" 
              className="switch-text" 
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: "#d4af37", textDecoration: "underline" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Confirm Details"}
        </button>

        <p className="switch-text">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={() => navigate("/user/signup")}>
            Sign Up
          </button>
        </p>
      </form>

      <button
        className="auth-back-btn"
        onClick={() => navigate("/role-selection")}
      >
        ← Back To Role Selection
      </button>
    </div>
  );
}

export default UserLogin;