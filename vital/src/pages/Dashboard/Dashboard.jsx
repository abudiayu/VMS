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
import { reportService } from '../../services/reportService';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const RECENT_COLUMNS = ['Registration No.', 'Type', 'Name', 'Date', 'Status'];

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await reportService.getDashboardStats();
        setStats(data.stats);
        setRecentEvents(data.recent_events || []);
      } catch {
        setStats({
          births: 0,
          deaths: 0,
          marriages: 0,
          divorces: 0,
          total_users: 0,
          total_events: 0,
        });
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    const map = {
      registered: 'badge badge--green',
      pending: 'badge badge--orange',
      updated: 'badge badge--blue',
    };
    return map[status?.toLowerCase()] || 'badge badge--gray';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">
            Welcome back, <strong>{user?.username}</strong>. Here is today's overview.
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
        <StatCard
          title="Birth Records"
          value={loading ? '...' : stats?.births ?? 0}
          icon={FiBookOpen}
          color="blue"
          trend={4}
          trendLabel="this month"
        />
        <StatCard
          title="Death Records"
          value={loading ? '...' : stats?.deaths ?? 0}
          icon={FiAlertCircle}
          color="red"
          trend={-2}
          trendLabel="this month"
        />
        <StatCard
          title="Marriage Records"
          value={loading ? '...' : stats?.marriages ?? 0}
          icon={FiHeart}
          color="green"
          trend={6}
          trendLabel="this month"
        />
        <StatCard
          title="Divorce Records"
          value={loading ? '...' : stats?.divorces ?? 0}
          icon={FiScissors}
          color="orange"
          trend={1}
          trendLabel="this month"
        />
        <StatCard
          title="Total Events"
          value={loading ? '...' : stats?.total_events ?? 0}
          icon={FiTrendingUp}
          color="purple"
        />
        <StatCard
          title="Registered Users"
          value={loading ? '...' : stats?.total_users ?? 0}
          icon={FiUsers}
          color="blue"
        />
      </div>

      <div className="dashboard__bottom">
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
                  recentEvents.map((event, i) => (
                    <tr key={event.id || i}>
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

        <div className="dashboard__summary">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Quick Actions</h2>
          </div>
          <div className="dashboard__quick-actions">
            <a href="/birth" className="quick-action quick-action--blue">
              <FiBookOpen size={22} />
              <span>Register Birth</span>
            </a>
            <a href="/death" className="quick-action quick-action--red">
              <FiAlertCircle size={22} />
              <span>Register Death</span>
            </a>
            <a href="/marriage" className="quick-action quick-action--green">
              <FiHeart size={22} />
              <span>Register Marriage</span>
            </a>
            <a href="/divorce" className="quick-action quick-action--orange">
              <FiScissors size={22} />
              <span>Register Divorce</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
