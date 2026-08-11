import './LoadingState.css';

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LoadingState({ elapsedMs, projectName }) {
  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="loading-card__scan" aria-hidden="true">
        <svg viewBox="0 0 240 160" className="loading-card__blueprint">
          <rect x="20" y="20" width="200" height="120" rx="2" className="lc-frame" />
          <line x1="20" y1="60" x2="220" y2="60" className="lc-line" />
          <line x1="90" y1="20" x2="90" y2="140" className="lc-line" />
          <line x1="150" y1="60" x2="150" y2="140" className="lc-line" />
          <circle cx="55" cy="40" r="10" className="lc-node" />
          <circle cx="120" cy="40" r="10" className="lc-node" />
          <circle cx="120" cy="100" r="10" className="lc-node" />
          <circle cx="185" cy="100" r="10" className="lc-node" />
          <rect x="20" y="20" width="200" height="6" className="lc-sweep" />
        </svg>
      </div>

      <h2 className="loading-card__title">Drafting architecture</h2>
      <p className="loading-card__body">
        Multiple AI agents are working through <strong>{projectName}</strong> in
        sequence — requirements, database, backend, frontend, API, AI design,
        deployment, timeline, and cost. This runs as a single pass on the
        server, so there isn't a per-stage progress signal yet — just sit tight.
      </p>
      <p className="loading-card__timer sheet-number">
        ELAPSED&nbsp;&nbsp;{formatElapsed(elapsedMs)}
      </p>
    </div>
  );
}
