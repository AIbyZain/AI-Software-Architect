import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
  "Analyzing project requirements…",
  "Designing system architecture…",
  "Generating technical specifications…",
  "Preparing architecture reports…",
];

export default function GenerationLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="sheet-corner flex flex-col items-center justify-center border border-line bg-panel px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <svg width="64" height="52" viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <path
          d="M4 48V26L32 4L60 26V48"
          stroke="#1B5FA8"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeDasharray="240"
          className="animate-draw"
        />
        <path d="M16 48V30H48V48" stroke="#DCDFE3" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>

      <p className="mt-6 font-mono text-sm text-ink-soft">
        {STATUS_MESSAGES[index]}
      </p>

      <div className="mt-5 flex gap-1.5" aria-hidden="true">
        {STATUS_MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-6 ${i === index ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </div>

      <p className="mt-6 max-w-sm text-xs text-ink-muted">
        The architecture workflow is running. This can take a moment depending
        on project complexity.
      </p>
    </div>
  );
}
