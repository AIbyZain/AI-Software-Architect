export default function SectionNav({ sections, activeKey, onSelect }) {
  return (
    <nav
      aria-label="Architecture sections"
      className="flex gap-1 overflow-x-auto border-b border-line bg-panel px-2 sm:px-4"
    >
      {sections.map((section) => {
        const isActive = section.key === activeKey;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelect(section.key)}
            aria-current={isActive ? "page" : undefined}
            className={`focus-ring shrink-0 whitespace-nowrap border-b-2 px-3.5 py-3 font-mono text-xs uppercase tracking-wide transition-colors ${
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-ink-muted hover:text-ink-soft"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
