import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'chef' ? '/chef-dashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🍳 Recipe<span>Nest</span>
        </div>
        <div className="navbar-links">
          <button className={isActive('/recipes')} onClick={() => navigate('/recipes')}>Recipes</button>
          <button className={isActive('/chefs')} onClick={() => navigate('/chefs')}>Chefs</button>
          {user ? (
            <>
              <button className="nav-link" onClick={() => navigate(dashboardPath)}>
                {user.role === 'admin' ? '⚙️ Admin' : user.role === 'chef' ? '👨‍🍳 My Portal' : '🏠 Dashboard'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Join Us</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
