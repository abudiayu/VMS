import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import './Tables.css';

export default function DataTable({
  columns,
  data,
  loading,
  searchable,
  searchPlaceholder,
  actions,
  emptyMessage,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filtered = searchable
    ? (data || []).filter((row) =>
        columns.some((col) => {
          const val = col.accessor ? row[col.accessor] : '';
          return String(val || '').toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data || [];

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="data-table-wrapper">
      {searchable && (
        <div className="data-table__toolbar">
          <div className="data-table__search">
            <FiSearch size={16} className="data-table__search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={searchTerm}
              onChange={handleSearch}
              className="data-table__search-input"
            />
          </div>
          {actions && <div className="data-table__actions">{actions}</div>}
        </div>
      )}

      <div className="data-table__scroll">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.accessor} className="data-table__th">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table__body">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  <div className="data-table__loading">
                    <div className="spinner" />
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  {emptyMessage || 'No records found.'}
                </td>
              </tr>
            ) : (
              paginated.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="data-table__row">
                  {columns.map((col) => (
                    <td key={col.key || col.accessor} className="data-table__td">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > rowsPerPage && (
        <div className="data-table__pagination">
          <span className="data-table__pagination-info">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="data-table__pagination-controls">
            <button
              className="data-table__page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="data-table__ellipsis">…</span>
                  )}
                  <button
                    className={`data-table__page-btn ${currentPage === p ? 'data-table__page-btn--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              className="data-table__page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
