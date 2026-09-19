export default function Header() {
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="26" height="26" stroke="#1B5FA8" strokeWidth="1.4" />
            <path d="M7 21V10L14 5L21 10V21" stroke="#1B5FA8" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M11 21V14H17V21" stroke="#1B5FA8" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <div>
            <h1 className="font-display text-lg font-semibold leading-none tracking-tight text-ink">
              AI Software Architect
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              AI-powered software architecture generation
            </p>
          </div>
        </div>
        <span className="hidden font-mono text-xs text-ink-muted sm:block">
          v1.0.0
        </span>
      </div>
    </header>
  );
}
