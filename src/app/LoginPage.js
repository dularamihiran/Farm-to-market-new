import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '../auth/AuthContext';

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
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', display: 'flex' }}>
      <div className="d-none d-lg-block" style={{ flex: 1 }}>
        <img
          src={`${process.env.PUBLIC_URL}/Images/Registerpage.jpg`}
          alt="Harvest"
          style={{ height: '100vh', width: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center" style={{ flex: 1, background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: 16 }}>
          <h2 className="fw-bold mb-4 text-center" style={{ color: '#198754' }}>Sign In</h2>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p className="text-center mt-2"><Link to="/home">Back to home</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
