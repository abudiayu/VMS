import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiHeart,
  FiAlertCircle,
  FiBookOpen,
  FiScissors,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard',        path: '/dashboard', icon: FiHome },
  { label: 'Birth Records',    path: '/birth',     icon: FiBookOpen },
  { label: 'Death Records',    path: '/death',     icon: FiAlertCircle },
  { label: 'Marriage Records', path: '/marriage',  icon: FiHeart },
  { label: 'Divorce Records',  path: '/divorce',   icon: FiScissors },
  { label: 'Reports',          path: '/reports',   icon: FiBarChart2 },
  { label: 'User Management',  path: '/users',     icon: FiUsers },
  { label: 'Settings',         path: '/settings',  icon: FiSettings },
];

const quickActions = [
  { label: 'Register Birth',    path: '/birth',    icon: FiBookOpen,   color: 'blue' },
  { label: 'Register Death',    path: '/death',    icon: FiAlertCircle, color: 'red' },
  { label: 'Register Marriage', path: '/marriage', icon: FiHeart,      color: 'green' },
  { label: 'Register Divorce',  path: '/divorce',  icon: FiScissors,   color: 'orange' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <FiFileText size={20} />
            </div>
            {isOpen && (
              <div className="sidebar__logo-text">
                <span className="sidebar__logo-title">VEMS</span>
                <span className="sidebar__logo-sub">Ethiopia</span>
              </div>
            )}
          </div>
          <button className="sidebar__close-btn" onClick={onToggle} aria-label="Toggle sidebar">
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        <div className="sidebar__scroll">
          <nav className="sidebar__nav">
            {isOpen && <p className="sidebar__section-label">Navigation</p>}
            <ul className="sidebar__list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                      }
                      title={!isOpen ? item.label : undefined}
                    >
                      <span className="sidebar__icon"><Icon size={19} /></span>
                      {isOpen && <span className="sidebar__label">{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {isOpen && (
            <div className="sidebar__quick">
              <div className="sidebar__quick-header">
                <p className="sidebar__section-label">Quick Actions</p>
              </div>
              <div className="sidebar__quick-list">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.path}
                      className={`sidebar__quick-btn sidebar__quick-btn--${action.color}`}
                      onClick={() => navigate(action.path)}
                    >
                      <Icon size={20} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="sidebar__footer">
            <p className="sidebar__footer-text">VEMS v1.0.0 — Wollo University</p>
          </div>
        )}

        <div className="sidebar__logout-wrap">
          <button
            className={`sidebar__logout-btn ${isOpen ? 'sidebar__logout-btn--open' : ''}`}
            onClick={() => navigate('/login')}
            title="Logout"
          >
            <FiLogOut size={19} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

      </aside>
    </>
  );
}
