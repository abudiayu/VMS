import './Forms.css';
import './Button.css';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  onClick,
  icon: Icon,
  fullWidth,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : Icon ? (
        <Icon size={16} className="btn__icon" />
      ) : null}
      {children}
    </button>
  );
}
