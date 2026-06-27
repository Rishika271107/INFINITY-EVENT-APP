import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./UserAuth.css";
import { FormProvider } from "../components/forms/FormProvider";
import { InputField } from "../components/forms/InputField";
import { signupSchema } from "../utils/validationSchemas";

function UserSignup() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await API.post("/auth/register", {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (response.data?.success) {
        localStorage.setItem("signupEmail", data.email);
        if (response.data?.otpSent === false) {
          // OTP saved in DB but email failed — still go to verify page so user can resend
          localStorage.setItem("otpEmailFailed", "true");
        } else {
          localStorage.removeItem("otpEmailFailed");
        }
        navigate("/verify-otp");
      } else {
        setErrorMsg(response.data?.message || "Signup failed.");
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg("Connection to server failed. Please ensure the backend server is running on the correct port.");
      } else {
        const errorData = err.response.data;
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          // Extract specific Zod validation errors from the backend
          const detailedErrors = errorData.errors.map(e => `${e.path}: ${e.message}`).join(', ');
          setErrorMsg(`Validation failed: ${detailedErrors}`);
        } else {
          setErrorMsg(errorData?.message || "Signup failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider schema={signupSchema} onSubmit={onSubmit}>
      <div className="auth-page signup-page">
        <div className="auth-header signup-header">
          <p className="auth-subtitle">User Sign Up</p>
          <h1 className="auth-title">Create Account</h1>
          <div className="auth-line" />
        </div>
        {errorMsg && (
          <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            {errorMsg}
          </p>
        )}
        <div className="auth-card signup-card">
          <InputField name="username" label="Username" placeholder="Enter username" required />
          <InputField name="email" label="Email" type="email" placeholder="your@email.com" required />
          <InputField name="phone" label="Phone Number" type="tel" placeholder="9876543210" required />
          <InputField name="password" label="Password" type="password" placeholder="••••••••" required />
          <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" required />
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Confirm Details"}
          </button>
          <p className="switch-text">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate("/user/login")}>Login</button>
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

export default UserSignup;
