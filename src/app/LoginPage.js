import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '../auth/AuthContext';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const dashboardFor = (role) => {
  if (role === 'merchant') return '/merchant/dashboard';
  if (role === 'transporter') return '/transporter/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
};

function LoginPage() {
  const { login } = useAuth0();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(dashboardFor(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex" style={{ minHeight: '100vh', background: '#f8faf9' }}>
      {/* Left Banner for large screens */}
      <div className="d-none d-lg-block position-relative" style={{ flex: '1.1', overflow: 'hidden' }}>
        <img
          src={`${process.env.PUBLIC_URL}/Images/Registerpage.jpg`}
          alt="Farm to Market"
          style={{
            height: '100vh',
            width: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.92)'
          }}
        />
        <div
          className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column justify-content-between p-5 text-white"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 108, 67, 0.45) 0%, rgba(10, 40, 25, 0.85) 100%)'
          }}
        >
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', width: 'fit-content' }}>
            <Leaf size={20} color="#74c69d" />
            <span className="fw-semibold small tracking-wide">Harvest System Platform</span>
          </div>

          <div>
            <h1 className="fw-bold display-6 mb-3">Connecting Farmers, Merchants & Transporters</h1>
            <p className="text-light lead mb-0" style={{ maxWidth: '480px', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Access transparent market pricing, streamline daily fresh harvests, and manage transport bookings seamlessly in one unified platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Card Container */}
      <div className="d-flex align-items-center justify-content-center p-3 p-sm-4" style={{ flex: '1' }}>
        <div
          className="w-100 bg-white p-4 p-sm-5 shadow-sm rounded-4"
          style={{
            maxWidth: '440px',
            border: '1px solid #e9ecef',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
          }}
        >
          {/* Brand & Heading */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
              style={{ width: '56px', height: '56px', background: '#e8f5e9', color: '#198754' }}
            >
              <Leaf size={30} />
            </div>
            <h3 className="fw-bold mb-1" style={{ color: '#2d3748', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h3>
            <p className="text-muted small mb-0">Sign in to continue to your dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2"
              role="alert"
            >
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem', height: '46px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary mb-1">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: '10px 0 0 10px' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control bg-light border-start-0 border-end-0 px-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ fontSize: '0.95rem', height: '46px' }}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted border"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderRadius: '0 10px 10px 0', cursor: 'pointer' }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 fw-semibold text-white py-2 mb-3 shadow-sm login-btn"
              disabled={loading}
              style={{
                height: '46px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #198754, #146c43)',
                border: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Prompt */}
          <div className="text-center pt-2 pb-1 border-top mt-3">
            <span className="text-secondary small">Don't have an account? </span>
            <Link
              to="/register"
              className="fw-semibold text-decoration-none small"
              style={{ color: '#198754' }}
            >
              Register here
            </Link>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-3">
            <Link
              to="/home"
              className="d-inline-flex align-items-center gap-2 text-decoration-none px-3 py-1 rounded-pill small text-secondary back-home-link"
              style={{
                background: '#f1f5f3',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Button & Link Hover Styles */}
      <style>{`
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(25, 135, 84, 0.35) !important;
          filter: brightness(1.05);
        }
        .back-home-link:hover {
          background: #e2ede7 !important;
          color: #198754 !important;
        }
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.15) !important;
          border-color: #198754 !important;
          background-color: #fff !important;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
