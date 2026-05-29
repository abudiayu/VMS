import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPrinter, FiEye } from 'react-icons/fi';
import DataTable from '../../components/Tables/DataTable';
import Button from '../../components/Forms/Button';
import MarriageForm from './MarriageForm';
import { marriageService } from '../../services/marriageService';
import { useFetch } from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/usePageTitle';
import '../Birth/Birth.css';
import './Marriage.css';

export default function Marriage() {
  usePageTitle('Marriage Records');

  const { data, loading, refetch } = useFetch(() => marriageService.getAll());
  const [showForm, setShowForm]     = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await marriageService.delete(deleteId);
      setDeleteId(null);
      refetch();
    } catch {
      alert('Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = async (id) => {
    try {
      const res = await marriageService.generateCertificate(id);
      window.open(res.certificate_url, '_blank');
    } catch {
      alert('Failed to generate certificate.');
    }
  };

  const columns = [
    { header: 'Reg. No.', accessor: 'registration_no' },
    { header: "Husband's Name", accessor: 'husband_name' },
    { header: "Wife's Name", accessor: 'wife_name' },
    { header: 'Marriage Date', accessor: 'marriage_date' },
    { header: 'Place', accessor: 'place_of_marriage' },
    { header: 'Kebele', accessor: 'kebele' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`badge badge--${row.status === 'registered' ? 'green' : 'orange'}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn table-action-btn--view" title="View" onClick={() => { setEditRecord(row); setShowForm(true); }}>
            <FiEye size={15} />
          </button>
          <button className="table-action-btn table-action-btn--edit" title="Edit" onClick={() => { setEditRecord(row); setShowForm(true); }}>
                <FiEdit2 size={15} />
              </button>
              <button className="table-action-btn table-action-btn--print" title="Print Certificate" onClick={() => handlePrint(row.id)}>
                <FiPrinter size={15} />
              </button>
              <button className="table-action-btn table-action-btn--delete" title="Delete" onClick={() => setDeleteId(row.id)}>
                <FiTrash2 size={15} />
              </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Marriage Records</h1>
          <p className="page__subtitle">Manage and view all marriage registrations</p>
        </div>
        <Button icon={FiPlus} onClick={() => { setEditRecord(null); setShowForm(true); }}>
            Register Marriage
          </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.records || []}
        loading={loading}
        searchable
        searchPlaceholder="Search marriage records..."
        emptyMessage="No marriage records found."
      />

      {showForm && (
        <MarriageForm
          record={editRecord}
          onClose={() => { setShowForm(false); setEditRecord(null); }}
          onSuccess={() => { setShowForm(false); setEditRecord(null); refetch(); }}
        />
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal modal--sm">
            <h3 className="modal__title" style={{ padding: '20px 24px 0' }}>Confirm Delete</h3>
            <p className="modal__text">
              Are you sure you want to delete this marriage record? This action cannot be undone.
            </p>
            <div className="modal__actions">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
