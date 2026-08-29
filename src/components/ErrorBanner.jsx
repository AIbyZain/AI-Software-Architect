export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-4 border border-danger/30 bg-danger-soft px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="8.5" stroke="#B23A2E" strokeWidth="1.4" />
          <path d="M10 6V10.5" stroke="#B23A2E" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="10" cy="13.4" r="0.9" fill="#B23A2E" />
        </svg>
        <p className="text-sm text-danger">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring shrink-0 whitespace-nowrap font-mono text-xs font-medium uppercase tracking-wide text-danger underline underline-offset-2 hover:text-danger/80"
        >
          Try again
        </button>
      )}
    </div>
  );
}
