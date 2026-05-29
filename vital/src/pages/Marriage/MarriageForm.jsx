import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import FormField from '../../components/Forms/FormField';
import Button from '../../components/Forms/Button';
import { marriageService } from '../../services/marriageService';
import '../../components/Forms/Forms.css';
import '../Birth/Birth.css';

const initialState = {
  husband_name: '',
  husband_id_no: '',
  husband_dob: '',
  wife_name: '',
  wife_id_no: '',
  wife_dob: '',
  marriage_date: '',
  place_of_marriage: '',
  marriage_type: '',
  witness1_name: '',
  witness2_name: '',
  witness3_name: '',
  witness4_name: '',
  kebele: '',
  woreda: '',
  notes: '',
};

export default function MarriageForm({ record, onClose, onSuccess }) {
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
    if (!form.husband_name.trim()) errs.husband_name = "Husband's name is required.";
    if (!form.wife_name.trim()) errs.wife_name = "Wife's name is required.";
    if (!form.marriage_date) errs.marriage_date = 'Marriage date is required.';
    if (!form.witness1_name.trim()) errs.witness1_name = 'At least 2 witnesses are required.';
    if (!form.witness2_name.trim()) errs.witness2_name = 'At least 2 witnesses are required.';
    if (!form.kebele.trim()) errs.kebele = 'Kebele is required.';
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
        await marriageService.update(record.id, form);
      } else {
        await marriageService.create(form);
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
          <h3 className="modal__title">{isEdit ? 'Edit Marriage Record' : 'Register Marriage Event'}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>

        {serverError && <div className="form-error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="form-section">
              <h4 className="form-section__title">Husband Information</h4>
              <div className="form-grid">
                <FormField label="Husband's Full Name" name="husband_name" value={form.husband_name} onChange={handleChange} error={errors.husband_name} required placeholder="Enter full name" />
                <FormField label="Husband's ID Number" name="husband_id_no" value={form.husband_id_no} onChange={handleChange} placeholder="Kebele ID number" />
                <FormField label="Husband's Date of Birth" name="husband_dob" type="date" value={form.husband_dob} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Wife Information</h4>
              <div className="form-grid">
                <FormField label="Wife's Full Name" name="wife_name" value={form.wife_name} onChange={handleChange} error={errors.wife_name} required placeholder="Enter full name" />
                <FormField label="Wife's ID Number" name="wife_id_no" value={form.wife_id_no} onChange={handleChange} placeholder="Kebele ID number" />
                <FormField label="Wife's Date of Birth" name="wife_dob" type="date" value={form.wife_dob} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Marriage Details</h4>
              <div className="form-grid">
                <FormField label="Marriage Date" name="marriage_date" type="date" value={form.marriage_date} onChange={handleChange} error={errors.marriage_date} required />
                <FormField label="Place of Marriage" name="place_of_marriage" value={form.place_of_marriage} onChange={handleChange} placeholder="Church / Court / etc." />
                <FormField label="Marriage Type" name="marriage_type" type="select" value={form.marriage_type} onChange={handleChange} options={[{ value: 'civil', label: 'Civil' }, { value: 'religious', label: 'Religious' }, { value: 'customary', label: 'Customary' }]} />
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-section__title">Witnesses (Minimum 4 required)</h4>
              <div className="form-grid">
                <FormField label="Witness 1 (Husband's side)" name="witness1_name" value={form.witness1_name} onChange={handleChange} error={errors.witness1_name} required placeholder="Full name" />
                <FormField label="Witness 2 (Husband's side)" name="witness2_name" value={form.witness2_name} onChange={handleChange} error={errors.witness2_name} required placeholder="Full name" />
                <FormField label="Witness 3 (Wife's side)" name="witness3_name" value={form.witness3_name} onChange={handleChange} placeholder="Full name" />
                <FormField label="Witness 4 (Wife's side)" name="witness4_name" value={form.witness4_name} onChange={handleChange} placeholder="Full name" />
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
            <Button type="submit" loading={loading}>{isEdit ? 'Update Record' : 'Register Marriage'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
