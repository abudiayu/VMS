import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiSettings, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
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
          >
            <div className="navbar__avatar">A</div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">Admin</span>
              <span className="navbar__user-role">System Administrator</span>
            </div>
            <FiChevronDown
              size={15}
              className={`navbar__chevron ${dropdownOpen ? 'open' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <div className="navbar__avatar navbar__avatar--lg">A</div>
                <div>
                  <p className="navbar__dropdown-name">Admin</p>
                  <p className="navbar__dropdown-role">System Administrator</p>
                </div>
              </div>
              <div className="navbar__dropdown-divider" />
              <button
                className="navbar__dropdown-item"
                onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
              >
                <FiSettings size={15} />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
