import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { usePageTitle } from '../../hooks/usePageTitle';
import './Login.css';

export default function Login() {
  usePageTitle('Sign In');

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(form.username, form.password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__left">
        <div className="login-page__brand">
          <div className="login-page__brand-icon">
            <FiUser size={32} />
          </div>
          <h1 className="login-page__brand-title">VEMS</h1>
          <p className="login-page__brand-sub">Vital Events Management System</p>
        </div>
        <div className="login-page__info">
          <h2 className="login-page__info-title">Manage Vital Events Efficiently</h2>
          <p className="login-page__info-desc">
            A centralized platform for registering and managing birth, death, marriage,
            and divorce records across Ethiopia.
          </p>
          <ul className="login-page__features">
            <li>Birth & Death Registration</li>
            <li>Marriage & Divorce Records</li>
            <li>Certificate Generation</li>
            <li>Statistical Reports</li>
          </ul>
        </div>
        <p className="login-page__credit">Wollo University — Kombolcha Institute of Technology</p>
      </div>

      <div className="login-page__right">
        <div className="login-card">
          <div className="login-card__header">
            <h2 className="login-card__title">Welcome back</h2>
            <p className="login-card__subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="login-card__alert" role="alert">
              {error}
            </div>
          )}

          <form className="login-card__form" onSubmit={handleSubmit} noValidate>
            <div className="login-card__field">
              <label className="login-card__label" htmlFor="username">
                Username
              </label>
              <div className="login-card__input-wrap">
                <FiUser size={16} className="login-card__input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="login-card__input"
                />
              </div>
            </div>

            <div className="login-card__field">
              <label className="login-card__label" htmlFor="password">
                Password
              </label>
              <div className="login-card__input-wrap">
                <FiLock size={16} className="login-card__input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="login-card__input"
                />
                <button
                  type="button"
                  className="login-card__toggle-pass"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-card__submit"
              disabled={loading}
            >
              {loading ? <span className="login-card__spinner" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="login-card__footer">
            Vital Events Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
