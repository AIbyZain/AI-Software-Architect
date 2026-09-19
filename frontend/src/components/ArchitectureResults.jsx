import { useMemo, useState } from "react";
import SectionNav from "./SectionNav";
import SectionPanel from "./SectionPanel";
import ReviewScore from "./ReviewScore";
import { SECTION_LABELS, SECTION_ORDER, titleCase } from "../utils/parseContent";

function hasContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export default function ArchitectureResults({ projectName, architecture }) {
  const { review_score, messages, ...fields } = architecture || {};

  const sections = useMemo(() => {
    const known = SECTION_ORDER.filter((key) => hasContent(fields[key])).map(
      (key, i) => ({
        key,
        label: SECTION_LABELS[key],
        sheetCode: `Sheet A-${String(i + 2).padStart(2, "0")}`,
        content: fields[key],
      })
    );
    const extraKeys = Object.keys(fields).filter(
      (key) =>
        !SECTION_ORDER.includes(key) &&
        key !== "project_name" &&
        key !== "user_prompt" &&
        hasContent(fields[key])
    );
    const extras = extraKeys.map((key, i) => ({
      key,
      label: titleCase(key),
      sheetCode: `Sheet A-${String(known.length + i + 2).padStart(2, "0")}`,
      content:
        typeof fields[key] === "string" ? fields[key] : JSON.stringify(fields[key], null, 2),
    }));
    return [...known, ...extras];
  }, [fields]);

  const [activeKey, setActiveKey] = useState(sections[0]?.key || null);
  const activeSection = sections.find((s) => s.key === activeKey) || sections[0];

  return (
    <div className="space-y-6">
      <div className="sheet-corner border border-line bg-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
              Architecture
            </span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              {projectName}
            </h2>
          </div>
          <span className="border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {sections.length} section{sections.length === 1 ? "" : "s"} generated
          </span>
        </div>
      </div>

      {review_score !== undefined && review_score !== null ? (
        <ReviewScore score={review_score} />
      ) : null}

      {sections.length > 0 ? (
        <div className="border border-line bg-panel">
          <SectionNav sections={sections} activeKey={activeSection?.key} onSelect={setActiveKey} />
          <div className="p-0">
            {activeSection ? (
              <div className="border-t-0 p-0">
                <div className="p-0">
                  <SectionPanelWrapper section={activeSection} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="sheet-corner border border-line bg-panel p-8 text-center text-sm text-ink-muted">
          The workflow completed but returned no populated sections.
        </div>
      )}

      {Array.isArray(messages) && messages.length > 0 ? (
        <div className="sheet-corner border border-line bg-panel p-6 sm:p-8">
          <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
            <h3 className="font-display text-sm font-semibold text-ink">
              Workflow Messages
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              Log
            </span>
          </div>
          <ul className="space-y-2 font-mono text-xs text-ink-muted">
            {messages.map((msg, i) => (
              <li key={i} className="border-l-2 border-line pl-3">
                {typeof msg === "string" ? msg : JSON.stringify(msg)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// Kept as a thin wrapper so section switches don't need to re-derive the
// sheet border/padding wrapper that SectionPanel already applies.
function SectionPanelWrapper({ section }) {
  return (
    <div className="border-t border-line">
      <SectionPanel label={section.label} sheetCode={section.sheetCode} content={section.content} />
    </div>
  );
}
