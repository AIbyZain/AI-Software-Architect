import './EmptyState.css';

export default function EmptyState({ title, body, action }) {
  return (
    <div className="empty-card">
      <svg viewBox="0 0 64 64" className="empty-card__icon" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="2" className="ec-frame" />
        <path d="M8 8 L56 56 M56 8 L8 56" className="ec-x" />
      </svg>
      <h3 className="empty-card__title">{title}</h3>
      {body && <p className="empty-card__body">{body}</p>}
      {action}
    </div>
  );
}
