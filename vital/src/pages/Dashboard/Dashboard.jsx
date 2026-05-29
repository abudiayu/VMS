import { useState, useEffect } from 'react';
import {
  FiBookOpen,
  FiAlertCircle,
  FiHeart,
  FiScissors,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi';
import StatCard from '../../components/Cards/StatCard';
import { usePageTitle } from '../../hooks/usePageTitle';
import './Dashboard.css';

const RECENT_COLUMNS = ['Registration No.', 'Type', 'Name', 'Date', 'Status'];

const MOCK_STATS = {
  births: 124,
  deaths: 48,
  marriages: 87,
  divorces: 23,
  total_users: 12,
  total_events: 282,
};

const MOCK_EVENTS = [
  { id: 1, registration_no: 'BR-2026-A1B2C3', type: 'Birth',    name: 'Abebe Kebede',          date: '2026-05-20', status: 'registered' },
  { id: 2, registration_no: 'DR-2026-D4E5F6', type: 'Death',    name: 'Tigist Haile',           date: '2026-05-18', status: 'registered' },
  { id: 3, registration_no: 'MR-2026-G7H8I9', type: 'Marriage', name: 'Dawit & Sara',           date: '2026-05-15', status: 'registered' },
  { id: 4, registration_no: 'DV-2026-J1K2L3', type: 'Divorce',  name: 'Yonas & Meron',         date: '2026-05-12', status: 'registered' },
  { id: 5, registration_no: 'BR-2026-M4N5O6', type: 'Birth',    name: 'Hana Tesfaye',           date: '2026-05-10', status: 'registered' },
];

export default function Dashboard() {
  usePageTitle('Dashboard');

  const [stats] = useState(MOCK_STATS);
  const [recentEvents] = useState(MOCK_EVENTS);
  const [loading] = useState(false);

  const getStatusClass = (status) => {
    const map = {
      registered: 'badge badge--green',
      pending:    'badge badge--orange',
      updated:    'badge badge--blue',
    };
    return map[status?.toLowerCase()] || 'badge badge--gray';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">
            Welcome back, <strong>Admin</strong>. Here is today's overview.
          </p>
        </div>
        <div className="dashboard__date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="dashboard__stats">
        <StatCard title="Birth Records"     value={stats.births}       icon={FiBookOpen}   color="blue"   trend={4}  trendLabel="this month" />
        <StatCard title="Death Records"     value={stats.deaths}       icon={FiAlertCircle} color="red"   trend={-2} trendLabel="this month" />
        <StatCard title="Marriage Records"  value={stats.marriages}    icon={FiHeart}      color="green"  trend={6}  trendLabel="this month" />
        <StatCard title="Divorce Records"   value={stats.divorces}     icon={FiScissors}   color="orange" trend={1}  trendLabel="this month" />
        <StatCard title="Total Events"      value={stats.total_events} icon={FiTrendingUp} color="purple" />
        <StatCard title="Registered Users"  value={stats.total_users}  icon={FiUsers}      color="blue" />
      </div>

      <div className="dashboard__recent">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">Recent Events</h2>
        </div>
        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                {RECENT_COLUMNS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="dashboard__table-empty">
                    <div className="dashboard__loading">
                      <div className="spinner" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="dashboard__table-empty">
                    No recent events found.
                  </td>
                </tr>
              ) : (
                recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.registration_no}</td>
                    <td>
                      <span className={`badge badge--${event.type?.toLowerCase()}`}>
                        {event.type}
                      </span>
                    </td>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>
                      <span className={getStatusClass(event.status)}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
