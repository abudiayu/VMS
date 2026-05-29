import './Cards.css';

export default function StatCard({ title, value, icon: Icon, color, trend, trendLabel }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__body">
        <div className="stat-card__info">
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value ?? '—'}</p>
          {trend !== undefined && (
            <p className={`stat-card__trend ${trend >= 0 ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
        <div className="stat-card__icon">
          {Icon && <Icon size={28} />}
        </div>
      </div>
    </div>
  );
}
