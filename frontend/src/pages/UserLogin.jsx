import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./UserAuth.css";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { loginSchema } from "../utils/validationSchemas";

function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const response = await API.post("/auth/login", data);
      if (response.data.success) {
        const { user, token } = response.data;
        login(user, token);
        navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
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
      <FormProvider schema={loginSchema} onSubmit={handleSubmit}>
        <div className="auth-card login-card">
          {error && (
            <p className="error-message" style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</p>
          )}
          <InputField name="email" label="Email" type="email" placeholder="your@email.com" required />
          <div className="form-group">
            <label>Password</label>
            <div className="password-box">
              <InputField name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Confirm Details"}
          </button>
          <p className="switch-text">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate("/user/signup")}>Sign Up</button>
          </p>
          <button type="button" className="auth-back-btn" onClick={() => navigate("/role-selection")}>← Back To Role Selection</button>
        </div>
      </FormProvider>
    </div>
  );
}

export default UserLogin;