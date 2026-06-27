import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './UserAuth.css';

const OTPVerification = () => {
    const { login } = useAuth();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailFailed, setEmailFailed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('signupEmail');
        if (!savedEmail) {
            navigate('/user/signup');
        } else {
            setEmail(savedEmail);
        }
        // Show warning if email delivery failed during signup
        if (localStorage.getItem('otpEmailFailed') === 'true') {
            setEmailFailed(true);
            localStorage.removeItem('otpEmailFailed');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await API.post('/auth/verify-otp', { email, otp });
            
            if (response.data.success) {
                const { token, user } = response.data;
                
                // Login immediately
                login(user, token);
                localStorage.removeItem('signupEmail');

                // Role based redirect
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setEmailFailed(false);
        try {
            const response = await API.post('/auth/resend-otp', { email });
            if (response.data.success) {
                if (response.data.emailSent === false) {
                    setEmailFailed(true);
                } else {
                    setSuccess('✅ A new OTP has been sent to your email. Check your inbox and spam folder.');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="auth-page signup-page">
            <div className="auth-header signup-header">
                <p className="auth-subtitle">Verify Your Email</p>
                <h1 className="auth-title">OTP Verification</h1>
                <div className="auth-line"></div>
            </div>

            <form className="auth-card signup-card" onSubmit={handleSubmit}>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    We've sent a 6-digit code to <br />
                    <strong style={{ color: '#000' }}>{email}</strong>
                </p>
                
                {emailFailed && (
                    <p className="error-message" style={{ color: '#b8860b', background: '#fff8e1', border: '1px solid #f0c040', borderRadius: '8px', padding: '10px', marginBottom: '10px', textAlign: 'center' }}>
                        ⚠️ Email delivery failed. Please click <strong>Resend OTP</strong> below to get your code.
                    </p>
                )}
                {success && <p style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</p>}
                {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

                <div className="form-group">
                    <label>Enter 6-Digit OTP</label>
                    <input 
                        type="text" 
                        placeholder="123456" 
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                    />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <p className="switch-text">
                    Didn't receive code? <button type="button" onClick={handleResend}>Resend OTP</button>
                </p>
            </form>
        </div>
    );
};

export default OTPVerification;
