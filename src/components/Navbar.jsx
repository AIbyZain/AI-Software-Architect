import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ projectName, backendStatus }) {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <svg viewBox="0 0 24 24" className="navbar__mark" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="1.5" className="mark-frame" />
          <path d="M8 16 L8 8 L16 8" className="mark-path" />
          <circle cx="16" cy="16" r="1.6" className="mark-dot" />
        </svg>
        <span className="navbar__wordmark">
          ARCHITECT<span className="navbar__wordmark-sub">.AI</span>
        </span>
      </Link>

      <div className="navbar__meta">
        {projectName && (
          <span className="navbar__project sheet-number">{projectName}</span>
        )}
        <span
          className={`navbar__status navbar__status--${backendStatus}`}
          title={
            backendStatus === 'online'
              ? 'Backend reachable'
              : backendStatus === 'offline'
              ? 'Backend unreachable'
              : 'Checking backend…'
          }
        >
          <span className="navbar__status-dot" />
          {backendStatus === 'online' && 'API online'}
          {backendStatus === 'offline' && 'API offline'}
          {backendStatus === 'checking' && 'Checking API…'}
        </span>
      </div>
    </header>
  );
}
