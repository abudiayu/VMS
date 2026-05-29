import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import DataTable from '../../components/Tables/DataTable';
import Button from '../../components/Forms/Button';
import UserForm from './UserForm';
import { userService } from '../../services/userService';
import { useFetch } from '../../hooks/useFetch';
import { usePageTitle } from '../../hooks/usePageTitle';
import '../Birth/Birth.css';
import './Users.css';

export default function Users() {
  usePageTitle('User Management');

  const { data, loading, refetch } = useFetch(() => userService.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await userService.delete(deleteId);
      setDeleteId(null);
      refetch();
    } catch {
      alert('Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await userService.toggleStatus(id, newStatus);
      refetch();
    } catch {
      alert('Failed to update user status.');
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      admin: 'badge--purple',
      employee: 'badge--blue',
      customer: 'badge--green',
    };
    return `badge ${map[role] || 'badge--gray'}`;
  };

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (row) => (
        <span className={getRoleBadge(row.role)}>{row.role}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`badge badge--${row.status === 'active' ? 'green' : 'red'}`}>
          {row.status}
        </span>
      ),
    },
    { header: 'Created', accessor: 'created_at' },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--edit"
            title="Edit"
            onClick={() => { setEditRecord(row); setShowForm(true); }}
          >
            <FiEdit2 size={15} />
          </button>
          <button
            className={`table-action-btn ${row.status === 'active' ? 'table-action-btn--print' : 'table-action-btn--view'}`}
            title={row.status === 'active' ? 'Disable Account' : 'Enable Account'}
            onClick={() => handleToggleStatus(row.id, row.status)}
          >
            {row.status === 'active' ? <FiToggleRight size={15} /> : <FiToggleLeft size={15} />}
          </button>
          <button
            className="table-action-btn table-action-btn--delete"
            title="Delete"
            onClick={() => setDeleteId(row.id)}
          >
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
          <h1 className="page__title">User Management</h1>
          <p className="page__subtitle">Manage system accounts and access privileges</p>
        </div>
        <Button icon={FiPlus} onClick={() => { setEditRecord(null); setShowForm(true); }}>
          Create Account
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.users || []}
        loading={loading}
        searchable
        searchPlaceholder="Search users..."
        emptyMessage="No users found."
      />

      {showForm && (
        <UserForm
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
              Are you sure you want to delete this user account? This action cannot be undone.
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
