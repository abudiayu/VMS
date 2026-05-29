import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPrinter, FiEye } from 'react-icons/fi';
import DataTable from '../../components/Tables/DataTable';
import Button from '../../components/Forms/Button';
import DivorceForm from './DivorceForm';
import { divorceService } from '../../services/divorceService';
import { useFetch } from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import '../Birth/Birth.css';
import './Divorce.css';

export default function Divorce() {
  usePageTitle('Divorce Records');
  const { user } = useAuth();

  const { data, loading, refetch } = useFetch(() => divorceService.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'employee';

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await divorceService.delete(deleteId);
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
      const res = await divorceService.generateCertificate(id);
      window.open(res.certificate_url, '_blank');
    } catch {
      alert('Failed to generate certificate.');
    }
  };

  const columns = [
    { header: 'Reg. No.', accessor: 'registration_no' },
    { header: "Husband's Name", accessor: 'husband_name' },
    { header: "Wife's Name", accessor: 'wife_name' },
    { header: 'Divorce Date', accessor: 'divorce_date' },
    { header: 'Court Order No.', accessor: 'court_order_no' },
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
          {canEdit && (
            <>
              <button className="table-action-btn table-action-btn--edit" title="Edit" onClick={() => { setEditRecord(row); setShowForm(true); }}>
                <FiEdit2 size={15} />
              </button>
              <button className="table-action-btn table-action-btn--print" title="Print Certificate" onClick={() => handlePrint(row.id)}>
                <FiPrinter size={15} />
              </button>
              <button className="table-action-btn table-action-btn--delete" title="Delete" onClick={() => setDeleteId(row.id)}>
                <FiTrash2 size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Divorce Records</h1>
          <p className="page__subtitle">Manage and view all divorce registrations</p>
        </div>
        {canEdit && (
          <Button icon={FiPlus} onClick={() => { setEditRecord(null); setShowForm(true); }}>
            Register Divorce
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.records || []}
        loading={loading}
        searchable
        searchPlaceholder="Search divorce records..."
        emptyMessage="No divorce records found."
      />

      {showForm && (
        <DivorceForm
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
              Are you sure you want to delete this divorce record? This action cannot be undone.
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
