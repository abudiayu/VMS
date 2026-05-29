import { useState } from 'react';
import { FiBarChart2, FiDownload, FiFilter } from 'react-icons/fi';
import Button from '../../components/Forms/Button';
import FormField from '../../components/Forms/FormField';
import DataTable from '../../components/Tables/DataTable';
import { reportService } from '../../services/reportService';
import { usePageTitle } from '../../hooks/usePageTitle';
import './Reports.css';
import '../Birth/Birth.css';

const EVENT_TYPES = [
  { value: 'birth', label: 'Birth' },
  { value: 'death', label: 'Death' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'divorce', label: 'Divorce' },
  { value: 'all', label: 'All Events' },
];

export default function Reports() {
  usePageTitle('Reports');

  const [filters, setFilters] = useState({
    event_type: 'all',
    date_from: '',
    date_to: '',
    kebele: '',
    woreda: '',
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await reportService.generate(filters);
      setReportData(data);
      setGenerated(true);
    } catch {
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!reportData) return;
    const rows = [
      ['Registration No.', 'Event Type', 'Name', 'Date', 'Kebele', 'Status'],
      ...(reportData.records || []).map((r) => [
        r.registration_no,
        r.event_type,
        r.name,
        r.date,
        r.kebele,
        r.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vems-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { header: 'Reg. No.', accessor: 'registration_no' },
    {
      header: 'Event Type',
      key: 'event_type',
      render: (row) => (
        <span className={`badge badge--${row.event_type?.toLowerCase()}`}>
          {row.event_type}
        </span>
      ),
    },
    { header: 'Name', accessor: 'name' },
    { header: 'Date', accessor: 'date' },
    { header: 'Kebele', accessor: 'kebele' },
    { header: 'Woreda', accessor: 'woreda' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`badge badge--${row.status === 'registered' ? 'green' : 'orange'}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Reports</h1>
          <p className="page__subtitle">Generate and export vital event reports</p>
        </div>
        {generated && reportData && (
          <Button icon={FiDownload} variant="secondary" onClick={handleExport}>
            Export CSV
          </Button>
        )}
      </div>

      <div className="reports__filter-card">
        <div className="reports__filter-header">
          <FiFilter size={16} />
          <span>Filter Options</span>
        </div>
        <form onSubmit={handleGenerate} noValidate>
          <div className="form-grid form-grid--3">
            <FormField
              label="Event Type"
              name="event_type"
              type="select"
              value={filters.event_type}
              onChange={handleChange}
              options={EVENT_TYPES}
            />
            <FormField
              label="Date From"
              name="date_from"
              type="date"
              value={filters.date_from}
              onChange={handleChange}
            />
            <FormField
              label="Date To"
              name="date_to"
              type="date"
              value={filters.date_to}
              onChange={handleChange}
            />
            <FormField
              label="Kebele"
              name="kebele"
              value={filters.kebele}
              onChange={handleChange}
              placeholder="Filter by kebele"
            />
            <FormField
              label="Woreda"
              name="woreda"
              value={filters.woreda}
              onChange={handleChange}
              placeholder="Filter by woreda"
            />
          </div>
          <div className="reports__filter-actions">
            <Button type="submit" icon={FiBarChart2} loading={loading}>
              Generate Report
            </Button>
          </div>
        </form>
      </div>

      {generated && reportData && (
        <>
          <div className="reports__summary">
            <div className="reports__summary-item">
              <span className="reports__summary-label">Total Records</span>
              <span className="reports__summary-value">{reportData.total || 0}</span>
            </div>
            <div className="reports__summary-item">
              <span className="reports__summary-label">Births</span>
              <span className="reports__summary-value reports__summary-value--blue">{reportData.births || 0}</span>
            </div>
            <div className="reports__summary-item">
              <span className="reports__summary-label">Deaths</span>
              <span className="reports__summary-value reports__summary-value--red">{reportData.deaths || 0}</span>
            </div>
            <div className="reports__summary-item">
              <span className="reports__summary-label">Marriages</span>
              <span className="reports__summary-value reports__summary-value--green">{reportData.marriages || 0}</span>
            </div>
            <div className="reports__summary-item">
              <span className="reports__summary-label">Divorces</span>
              <span className="reports__summary-value reports__summary-value--orange">{reportData.divorces || 0}</span>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={reportData.records || []}
            loading={false}
            searchable
            searchPlaceholder="Search report results..."
            emptyMessage="No records match the selected filters."
          />
        </>
      )}
    </div>
  );
}
