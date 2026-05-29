import { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { birthService } from '../../services/birthService';
import '../../components/Forms/Forms.css';
import './Birth.css';

const initialState = {
  child_name: '',
  date_of_birth: '',
  place_of_birth: '',
  gender: '',
  father_name: '',
  father_id_no: '',
  mother_name: '',
  mother_id_no: '',
  kebele: '',
  woreda: '',
  notes: '',
};

export default function BirthForm({ record, onClose, onSuccess }) {
  const isEdit = !!record;
  const [form, setForm] = useState(record ? { ...record } : initialState);
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
    if (!form.child_name.trim())  errs.child_name   = 'Child name is required.';
    if (!form.date_of_birth)      errs.date_of_birth = 'Date of birth is required.';
    if (!form.gender)             errs.gender        = 'Gender is required.';
    if (!form.father_name.trim()) errs.father_name   = "Father's name is required.";
    if (!form.mother_name.trim()) errs.mother_name   = "Mother's name is required.";
    if (!form.kebele.trim())      errs.kebele        = 'Kebele is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      if (isEdit) {
        await birthService.update(record.id, form);
      } else {
        await birthService.create(form);
      }
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--lg">

        <div className="modal__header">
          <h3 className="modal__title">
            {isEdit ? 'Edit Birth Record' : 'Register Birth Event'}
          </h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal__form">

          {serverError && (
            <div className="form-error-banner">{serverError}</div>
          )}

          <div className="modal__body">
            <div className="form-section">
              <h4 className="form-section__title">Child Information</h4>
              <div className="form-grid">
                <FormField label="Child's Full Name" name="child_name" value={form.child_name} onChange={handleChange} error={errors.child_name} required placeholder="Enter child's full name" />
                <FormField label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} error={errors.date_of_birth} required />
                <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} error={errors.gender} required options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
                <FormField label="Place of Birth" name="place_of_birth" value={form.place_of_birth} onChange={handleChange} placeholder="Hospital / Home / etc." />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Parent Information</h4>
              <div className="form-grid">
                <FormField label="Father's Full Name" name="father_name" value={form.father_name} onChange={handleChange} error={errors.father_name} required placeholder="Enter father's full name" />
                <FormField label="Father's ID Number" name="father_id_no" value={form.father_id_no} onChange={handleChange} placeholder="Kebele ID number" />
                <FormField label="Mother's Full Name" name="mother_name" value={form.mother_name} onChange={handleChange} error={errors.mother_name} required placeholder="Enter mother's full name" />
                <FormField label="Mother's ID Number" name="mother_id_no" value={form.mother_id_no} onChange={handleChange} placeholder="Kebele ID number" />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Location</h4>
              <div className="form-grid">
                <FormField label="Kebele" name="kebele" value={form.kebele} onChange={handleChange} error={errors.kebele} required placeholder="Enter kebele" />
                <FormField label="Woreda" name="woreda" value={form.woreda} onChange={handleChange} placeholder="Enter woreda" />
                <div className="form-grid__full">
                  <FormField label="Additional Notes" name="notes" type="textarea" value={form.notes} onChange={handleChange} placeholder="Any additional information..." />
                </div>
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" icon={FiSave} loading={loading}>
              {isEdit ? 'Save Changes' : 'Save & Register'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
