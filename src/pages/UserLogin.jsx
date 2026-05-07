import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./UserAuth.css";

function UserLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/user/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-header login-header">
        <p className="auth-subtitle">User Login</p>
        <h1 className="auth-title">Welcome Back</h1>
        <div className="auth-line"></div>
      </div>

      <form className="auth-card login-card" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="auth-submit-btn">
          Confirm Details
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