import './ErrorState.css';

const STATUS_HINTS = {
  0: 'Check that the backend is running and reachable.',
  422: 'Fix the fields below and submit again.',
  500: 'This is a server-side failure — try again in a moment.',
  503: 'The backend could not reach an external AI service — try again shortly.',
  504: 'The workflow exceeded the time limit — try again, or simplify the prompt.'
};

export default function ErrorState({ error, onRetry }) {
  if (!error) return null;
  const hint = STATUS_HINTS[error.status] ?? 'Try again, or check the backend logs.';

  return (
    <div className="error-card" role="alert">
      <div className="error-card__badge sheet-number">
        ERROR {error.status || '—'}
      </div>
      <h3 className="error-card__title">{error.title}</h3>
      <p className="error-card__message">{error.message}</p>
      <p className="error-card__hint">{hint}</p>

      {Array.isArray(error.details) && error.details.length > 0 && (
        <ul className="error-card__details">
          {error.details.map((d, i) => (
            <li key={i}>
              <span className="sheet-number">
                {Array.isArray(d.loc) ? d.loc.join('.') : 'field'}
              </span>
              {' — '}
              {d.msg}
            </li>
          ))}
        </ul>
      )}

      {onRetry && (
        <button type="button" className="error-card__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
