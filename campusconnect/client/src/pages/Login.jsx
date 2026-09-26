import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const user = await login({ email, password });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <div className="sub">Log in to your CampusConnect account.</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="err">{err}</div>
          <button className="btn btn-gold" style={{ width: '100%' }} type="submit">
            Log in
          </button>
        </form>
        <div className="switch-line">
          New here? <Link to="/signup">Create an account</Link> · <Link to="/">Back home</Link>
        </div>
        <div className="switch-line" style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
          Demo admin: admin@campus.edu / admin123 (run <code>npm run seed</code> in /server first)
        </div>
      </div>
    </div>
  );
}
