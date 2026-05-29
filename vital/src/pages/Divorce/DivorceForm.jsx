import { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { divorceService } from '../../services/divorceService';
import '../../components/Forms/Forms.css';
import '../Birth/Birth.css';

const initialState = {
  husband_name: '',
  husband_id_no: '',
  wife_name: '',
  wife_id_no: '',
  divorce_date: '',
  court_order_no: '',
  court_name: '',
  reason: '',
  kebele: '',
  woreda: '',
  notes: '',
};

export default function DivorceForm({ record, onClose, onSuccess }) {
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
    if (!form.husband_name.trim())  errs.husband_name  = "Husband's name is required.";
    if (!form.wife_name.trim())     errs.wife_name     = "Wife's name is required.";
    if (!form.divorce_date)         errs.divorce_date  = 'Divorce date is required.';
    if (!form.court_order_no.trim()) errs.court_order_no = 'Court order number is required.';
    if (!form.kebele.trim())        errs.kebele        = 'Kebele is required.';
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
        await divorceService.update(record.id, form);
      } else {
        await divorceService.create(form);
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
          <h3 className="modal__title">{isEdit ? 'Edit Divorce Record' : 'Register Divorce Event'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal__form">

          {serverError && <div className="form-error-banner">{serverError}</div>}

          <div className="modal__body">
            <div className="form-section">
              <h4 className="form-section__title">Parties Information</h4>
              <div className="form-grid">
                <FormField label="Husband's Full Name" name="husband_name" value={form.husband_name} onChange={handleChange} error={errors.husband_name} required placeholder="Enter full name" />
                <FormField label="Husband's ID Number" name="husband_id_no" value={form.husband_id_no} onChange={handleChange} placeholder="Kebele ID number" />
                <FormField label="Wife's Full Name" name="wife_name" value={form.wife_name} onChange={handleChange} error={errors.wife_name} required placeholder="Enter full name" />
                <FormField label="Wife's ID Number" name="wife_id_no" value={form.wife_id_no} onChange={handleChange} placeholder="Kebele ID number" />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Divorce Details</h4>
              <div className="form-grid">
                <FormField label="Divorce Date" name="divorce_date" type="date" value={form.divorce_date} onChange={handleChange} error={errors.divorce_date} required />
                <FormField label="Court Order Number" name="court_order_no" value={form.court_order_no} onChange={handleChange} error={errors.court_order_no} required placeholder="Enter court order number" />
                <FormField label="Court Name" name="court_name" value={form.court_name} onChange={handleChange} placeholder="Name of the court" />
                <FormField label="Reason for Divorce" name="reason" type="select" value={form.reason} onChange={handleChange} options={[{ value: 'mutual_consent', label: 'Mutual Consent' }, { value: 'abandonment', label: 'Abandonment' }, { value: 'adultery', label: 'Adultery' }, { value: 'cruelty', label: 'Cruelty' }, { value: 'other', label: 'Other' }]} />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Location</h4>
              <div className="form-grid">
                <FormField label="Kebele" name="kebele" value={form.kebele} onChange={handleChange} error={errors.kebele} required placeholder="Enter kebele" />
                <FormField label="Woreda" name="woreda" value={form.woreda} onChange={handleChange} placeholder="Enter woreda" />
                <div className="form-grid__full">
                  <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={handleChange} placeholder="Any additional information..." />
                </div>
              </div>
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
