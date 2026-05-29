import { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { deathService } from '../../services/deathService';
import '../../components/Forms/Forms.css';
import '../Birth/Birth.css';

const initialState = {
  deceased_name: '',
  date_of_death: '',
  place_of_death: '',
  cause_of_death: '',
  age_at_death: '',
  gender: '',
  reported_by: '',
  reporter_id_no: '',
  kebele: '',
  woreda: '',
  notes: '',
};

export default function DeathForm({ record, onClose, onSuccess }) {
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
    if (!form.deceased_name.trim())  errs.deceased_name  = 'Deceased name is required.';
    if (!form.date_of_death)         errs.date_of_death  = 'Date of death is required.';
    if (!form.cause_of_death.trim()) errs.cause_of_death = 'Cause of death is required.';
    if (!form.reported_by.trim())    errs.reported_by    = 'Reporter name is required.';
    if (!form.kebele.trim())         errs.kebele         = 'Kebele is required.';
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
        await deathService.update(record.id, form);
      } else {
        await deathService.create(form);
      }
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--lg">

        <div className="modal__header">
          <h3 className="modal__title">{isEdit ? 'Edit Death Record' : 'Register Death Event'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal__form">

          {serverError && <div className="form-error-banner">{serverError}</div>}

          <div className="modal__body">
            <div className="form-section">
              <h4 className="form-section__title">Deceased Information</h4>
              <div className="form-grid">
                <FormField label="Deceased Full Name" name="deceased_name" value={form.deceased_name} onChange={handleChange} error={errors.deceased_name} required placeholder="Enter full name" />
                <FormField label="Date of Death" name="date_of_death" type="date" value={form.date_of_death} onChange={handleChange} error={errors.date_of_death} required />
                <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
                <FormField label="Age at Death" name="age_at_death" type="number" value={form.age_at_death} onChange={handleChange} placeholder="Age in years" />
                <FormField label="Place of Death" name="place_of_death" value={form.place_of_death} onChange={handleChange} placeholder="Hospital / Home / etc." />
                <FormField label="Cause of Death" name="cause_of_death" value={form.cause_of_death} onChange={handleChange} error={errors.cause_of_death} required placeholder="Enter cause of death" />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Reporter Information</h4>
              <div className="form-grid">
                <FormField label="Reported By" name="reported_by" value={form.reported_by} onChange={handleChange} error={errors.reported_by} required placeholder="Name of person reporting" />
                <FormField label="Reporter ID Number" name="reporter_id_no" value={form.reporter_id_no} onChange={handleChange} placeholder="Kebele ID number" />
                <FormField label="Kebele" name="kebele" value={form.kebele} onChange={handleChange} error={errors.kebele} required placeholder="Enter kebele" />
                <FormField label="Woreda" name="woreda" value={form.woreda} onChange={handleChange} placeholder="Enter woreda" />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Additional Notes</h4>
              <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={handleChange} placeholder="Any additional information..." />
            </div>
          </div>

          <div className="modal__footer">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" icon={FiSave} loading={loading}>
              {isEdit ? 'Save Changes' : 'Save & Register'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
