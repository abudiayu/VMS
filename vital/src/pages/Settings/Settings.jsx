import { useState } from 'react';
import { FiLock, FiUser, FiSave } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import '../Birth/Birth.css';
import './Settings.css';

export default function Settings() {
  usePageTitle('Settings');
  const { user } = useAuth();

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    setPasswordSuccess('');
    setPasswordError('');
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordForm.current_password) errs.current_password = 'Current password is required.';
    if (!passwordForm.new_password) errs.new_password = 'New password is required.';
    else if (passwordForm.new_password.length < 6) errs.new_password = 'Password must be at least 6 characters.';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      errs.confirm_password = 'Passwords do not match.';
    }
    return errs;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) { setPasswordErrors(errs); return; }
    setPasswordLoading(true);
    setPasswordError('');
    try {
      await authService.changePassword(passwordForm.current_password, passwordForm.new_password);
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Settings</h1>
          <p className="page__subtitle">Manage your account preferences</p>
        </div>
      </div>

      <div className="settings__grid">
        <div className="settings__card">
          <div className="settings__card-header">
            <FiUser size={18} />
            <h2 className="settings__card-title">Account Information</h2>
          </div>
          <div className="settings__card-body">
            <div className="settings__info-row">
              <span className="settings__info-label">Username</span>
              <span className="settings__info-value">{user?.username}</span>
            </div>
            <div className="settings__info-row">
              <span className="settings__info-label">Role</span>
              <span className="settings__info-value settings__role-badge">
                {user?.role === 'admin' && 'System Administrator'}
                {user?.role === 'employee' && 'Employee'}
                {user?.role === 'customer' && 'Customer'}
              </span>
            </div>
            <div className="settings__info-row">
              <span className="settings__info-label">Email</span>
              <span className="settings__info-value">{user?.email || '—'}</span>
            </div>
            <div className="settings__info-row">
              <span className="settings__info-label">Full Name</span>
              <span className="settings__info-value">{user?.full_name || '—'}</span>
            </div>
          </div>
        </div>

        <div className="settings__card">
          <div className="settings__card-header">
            <FiLock size={18} />
            <h2 className="settings__card-title">Change Password</h2>
          </div>
          <div className="settings__card-body">
            {passwordSuccess && (
              <div className="settings__alert settings__alert--success">{passwordSuccess}</div>
            )}
            {passwordError && (
              <div className="settings__alert settings__alert--error">{passwordError}</div>
            )}
            <form onSubmit={handlePasswordSubmit} noValidate>
              <div className="settings__form-fields">
                <FormField
                  label="Current Password"
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  error={passwordErrors.current_password}
                  required
                  placeholder="Enter current password"
                />
                <FormField
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  error={passwordErrors.new_password}
                  required
                  placeholder="Enter new password"
                  hint="Minimum 6 characters"
                />
                <FormField
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirm_password}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <div className="settings__form-actions">
                <Button type="submit" icon={FiSave} loading={passwordLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="settings__card settings__card--full">
          <div className="settings__card-header">
            <h2 className="settings__card-title">System Information</h2>
          </div>
          <div className="settings__card-body">
            <div className="settings__sys-grid">
              <div className="settings__sys-item">
                <span className="settings__info-label">System Name</span>
                <span className="settings__info-value">Vital Events Management System</span>
              </div>
              <div className="settings__sys-item">
                <span className="settings__info-label">Version</span>
                <span className="settings__info-value">1.0.0</span>
              </div>
              <div className="settings__sys-item">
                <span className="settings__info-label">Institution</span>
                <span className="settings__info-value">Wollo University — KIoT</span>
              </div>
              <div className="settings__sys-item">
                <span className="settings__info-label">Department</span>
                <span className="settings__info-value">Computer Science</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
