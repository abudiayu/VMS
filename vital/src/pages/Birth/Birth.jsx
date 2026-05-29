import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPrinter, FiEye } from 'react-icons/fi';
import DataTable from '../../components/Tables/DataTable';
import Button from '../../components/Forms/Button';
import BirthForm from './BirthForm';
import { birthService } from '../../services/birthService';
import { useFetch } from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/usePageTitle';
import './Birth.css';

export default function Birth() {
  usePageTitle('Birth Records');

  const { data, loading, refetch } = useFetch(() => birthService.getAll());
  const [showForm, setShowForm]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await birthService.delete(deleteId);
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
      const res = await birthService.generateCertificate(id);
      window.open(res.certificate_url, '_blank');
    } catch {
      alert('Failed to generate certificate.');
    }
  };

  const columns = [
    { header: 'Reg. No.',       accessor: 'registration_no' },
    { header: "Child's Name",   accessor: 'child_name' },
    { header: 'Date of Birth',  accessor: 'date_of_birth' },
    { header: "Father's Name",  accessor: 'father_name' },
    { header: "Mother's Name",  accessor: 'mother_name' },
    { header: 'Place of Birth', accessor: 'place_of_birth' },
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
          <button className="table-action-btn table-action-btn--view" title="View"
            onClick={() => { setEditRecord(row); setShowForm(true); }}>
            <FiEye size={15} />
          </button>
          <button className="table-action-btn table-action-btn--edit" title="Edit"
            onClick={() => { setEditRecord(row); setShowForm(true); }}>
            <FiEdit2 size={15} />
          </button>
          <button className="table-action-btn table-action-btn--print" title="Print Certificate"
            onClick={() => handlePrint(row.id)}>
            <FiPrinter size={15} />
          </button>
          <button className="table-action-btn table-action-btn--delete" title="Delete"
            onClick={() => setDeleteId(row.id)}>
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
          <h1 className="page__title">Birth Records</h1>
          <p className="page__subtitle">Manage and view all birth registrations</p>
        </div>
        <Button icon={FiPlus} onClick={() => { setEditRecord(null); setShowForm(true); }}>
          Register Birth
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.records || []}
        loading={loading}
        searchable
        searchPlaceholder="Search birth records..."
        emptyMessage="No birth records found."
      />

      {showForm && (
        <BirthForm
          record={editRecord}
          onClose={() => { setShowForm(false); setEditRecord(null); }}
          onSuccess={() => { setShowForm(false); setEditRecord(null); refetch(); }}
        />
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal modal--sm">
            <h3 className="modal__title" style={{ padding: '20px 24px 0' }}>Confirm Delete</h3>
            <p className="modal__text">Are you sure you want to delete this birth record?</p>
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
