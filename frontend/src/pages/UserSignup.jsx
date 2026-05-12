import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./UserAuth.css";

function UserSignup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("/user/home");
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-header signup-header">
        <p className="auth-subtitle">User Sign Up</p>
        <h1 className="auth-title">Create Account</h1>
        <div className="auth-line"></div>
      </div>

      <form className="auth-card signup-card" onSubmit={handleSignup}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter username" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="9876543210" />
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

        <div className="form-group">
          <label>Confirm Password</label>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="auth-submit-btn">
          Confirm Details
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/user/login")}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default UserSignup;