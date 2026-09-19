export default function EmptyState() {
  return (
    <div className="sheet-corner flex h-full flex-col items-center justify-center border border-dashed border-line bg-panel/60 px-6 py-16 text-center">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" stroke="#DCDFE3" strokeWidth="1.4" />
        <path d="M12 32V22L24 13L36 22V32" stroke="#1B5FA8" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M18 32V25H30V32" stroke="#DCDFE3" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <h3 className="mt-5 font-display text-base font-semibold text-ink">
        Generate a Technical Architecture
      </h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        Provide your project requirements and let the architecture workflow
        produce the technical design.
      </p>
    </div>
  );
}
