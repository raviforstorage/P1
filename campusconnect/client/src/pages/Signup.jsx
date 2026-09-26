import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const user = await signup({ name, email, password, role });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Create your account</h2>
        <div className="sub">Join as a student to ask doubts, or as an admin to manage them.</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label>I am a</label>
          <div className="role-toggle">
            <label>
              <input
                type="radio"
                name="role"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
              />
              Admin
            </label>
          </div>
          <div className="err">{err}</div>
          <button className="btn btn-gold" style={{ width: '100%' }} type="submit">
            Sign up
          </button>
        </form>
        <div className="switch-line">
          Already registered? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
