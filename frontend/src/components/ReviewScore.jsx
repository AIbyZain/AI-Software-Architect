export default function ReviewScore({ score }) {
  if (score === null || score === undefined) return null;

  const numeric = Number(score);
  const clamped = Math.max(0, Math.min(100, isNaN(numeric) ? 0 : numeric));
  const tone =
    clamped >= 80 ? "success" : clamped >= 50 ? "warning" : "danger";

  const toneClasses = {
    success: "text-success bg-success",
    warning: "text-warning bg-warning",
    danger: "text-danger bg-danger",
  };

  return (
    <div className="sheet-corner border border-line bg-panel p-6">
      <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
        <h3 className="font-display text-sm font-semibold text-ink">
          Architecture Review Score
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
          Sheet A-10
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className={`font-display text-4xl font-semibold ${toneClasses[tone].split(" ")[0]}`}>
          {clamped.toFixed(1)}
        </span>
        <span className="pb-1 font-mono text-sm text-ink-muted">/ 100</span>
      </div>

      <div className="mt-4 h-1.5 w-full bg-paper">
        <div
          className={`h-1.5 ${toneClasses[tone].split(" ")[1]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        Score returned by the architecture review workflow.
      </p>
    </div>
  );
}
