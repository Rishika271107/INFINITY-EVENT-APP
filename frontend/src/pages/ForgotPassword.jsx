import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import "./UserAuth.css"; // Reuse existing auth styling

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/forgot-password", { email });
      if (response.data.success) {
        alert(response.data.message || "OTP sent to your email.");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        alert("Password reset successfully. You can now login.");
        navigate("/user/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header login-header">
        <p className="auth-subtitle">Account Recovery</p>
        <h1 className="auth-title">Forgot Password</h1>
        <div className="auth-line"></div>
      </div>

      <form 
        className="auth-card login-card" 
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
      >
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

        {step === 1 && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label>Enter OTP</label>
              <input 
                type="text" 
                placeholder="6-digit OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="switch-text">
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/user/login")}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
