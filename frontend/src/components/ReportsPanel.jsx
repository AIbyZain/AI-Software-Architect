import { useEffect, useState } from "react";
import { useReports } from "../hooks/useReports";

function reportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4.5 1.5h6l3 3v10.5a1.5 1.5 0 0 1-1.5 1.5h-7.5A1.5 1.5 0 0 1 3 15V3a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="#1B5FA8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M10.5 1.5V4.5h3" stroke="#1B5FA8" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReportsPanel({ refreshKey }) {
  const {
    reports,
    listStatus,
    listError,
    loadReports,
    downloadStatus,
    downloadError,
    downloadAll,
  } = useReports();

  const [downloadFeedback, setDownloadFeedback] = useState(null);

  useEffect(() => {
    loadReports();
  }, [loadReports, refreshKey]);

  useEffect(() => {
    if (downloadStatus === "success") {
      setDownloadFeedback("Reports downloaded successfully.");
      const t = setTimeout(() => setDownloadFeedback(null), 3500);
      return () => clearTimeout(t);
    }
  }, [downloadStatus]);

  return (
    <div className="sheet-corner border border-line bg-panel p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Reports</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Technical documents produced by the architecture workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadAll}
          disabled={downloadStatus === "loading" || reports.length === 0}
          className="focus-ring inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-muted"
        >
          {downloadStatus === "loading" ? "Preparing ZIP…" : "Download All Reports"}
        </button>
      </div>

      {listStatus === "loading" && (
        <p className="font-mono text-xs text-ink-muted">Loading reports…</p>
      )}

      {listStatus === "error" && (
        <p className="text-sm text-danger">{listError}</p>
      )}

      {listStatus === "success" && reports.length === 0 && (
        <p className="text-sm text-ink-muted">
          No reports are available yet. Generate an architecture to produce
          reports.
        </p>
      )}

      {listStatus === "success" && reports.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {reports.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2.5 border border-line bg-paper px-3.5 py-2.5"
            >
              {reportIcon()}
              <span className="truncate font-mono text-xs text-ink-soft">{name}</span>
            </li>
          ))}
        </ul>
      )}

      {downloadStatus === "error" && (
        <p className="mt-4 text-sm text-danger">{downloadError}</p>
      )}
      {downloadFeedback && (
        <p className="mt-4 text-sm text-success" role="status">
          {downloadFeedback}
        </p>
      )}
    </div>
  );
}
