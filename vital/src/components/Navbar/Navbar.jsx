import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'System Administrator',
      employee: 'Employee',
      customer: 'Customer',
    };
    return labels[role] || role;
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <FiMenu size={20} />
        </button>
        <div className="navbar__brand">
          <span className="navbar__brand-text">VEMS</span>
          <span className="navbar__brand-sub">Vital Events Management System</span>
        </div>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="navbar__badge">3</span>
        </button>

        <div className="navbar__user" ref={dropdownRef}>
          <button
            className="navbar__user-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
          >
            <div className="navbar__avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{user?.username || 'User'}</span>
              <span className="navbar__user-role">{getRoleLabel(user?.role)}</span>
            </div>
            <FiChevronDown size={16} className={`navbar__chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <div className="navbar__avatar navbar__avatar--lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="navbar__dropdown-name">{user?.username}</p>
                  <p className="navbar__dropdown-role">{getRoleLabel(user?.role)}</p>
                </div>
              </div>
              <div className="navbar__dropdown-divider" />
              <button
                className="navbar__dropdown-item"
                onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
              >
                <FiSettings size={16} />
                <span>Settings</span>
              </button>
              <button
                className="navbar__dropdown-item navbar__dropdown-item--danger"
                onClick={handleLogout}
              >
                <FiLogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
