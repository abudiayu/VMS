import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { userService } from '../../services/userService';
import '../../components/Forms/Forms.css';
import '../Birth/Birth.css';

const initialState = {
  username: '',
  full_name: '',
  email: '',
  role: '',
  password: '',
  confirm_password: '',
  status: 'active',
};

export default function UserForm({ record, onClose, onSuccess }) {
  const isEdit = !!record;
  const [form, setForm] = useState(
    record
      ? { ...record, password: '', confirm_password: '' }
      : initialState
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required.';
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.role) errs.role = 'Role is required.';
    if (!isEdit) {
      if (!form.password) errs.password = 'Password is required.';
      else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
      if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match.';
    } else if (form.password && form.password !== form.confirm_password) {
      errs.confirm_password = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    const payload = { ...form };
    delete payload.confirm_password;
    if (isEdit && !payload.password) delete payload.password;
    try {
      if (isEdit) {
        await userService.update(record.id, payload);
      } else {
        await userService.create(payload);
      }
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--md">
        <div className="modal__header">
          <h3 className="modal__title">{isEdit ? 'Edit User Account' : 'Create User Account'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>

        {serverError && <div className="form-error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="form-section">
              <h4 className="form-section__title">Account Information</h4>
              <div className="form-grid">
                <FormField label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} required placeholder="Enter username" disabled={isEdit} />
                <FormField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} required placeholder="Enter full name" />
                <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="Enter email address" />
                <FormField label="Role" name="role" type="select" value={form.role} onChange={handleChange} error={errors.role} required options={[{ value: 'admin', label: 'System Administrator' }, { value: 'employee', label: 'Employee' }, { value: 'customer', label: 'Customer' }]} />
                <FormField label="Account Status" name="status" type="select" value={form.status} onChange={handleChange} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">{isEdit ? 'Change Password (leave blank to keep current)' : 'Password'}</h4>
              <div className="form-grid">
                <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required={!isEdit} placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'} />
                <FormField label="Confirm Password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} error={errors.confirm_password} required={!isEdit} placeholder="Confirm password" />
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>{isEdit ? 'Update Account' : 'Create Account'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
