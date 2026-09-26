import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardHeader({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="dash-header">
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div className="who">
          {user.name} · {user.email}
        </div>
      </div>
      <button className="btn btn-outline" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
