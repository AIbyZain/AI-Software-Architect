import { useState } from "react";
import { parseContent } from "../utils/parseContent";

function CodeBlock({ language, text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — fail silently, no destructive fallback.
    }
  }

  return (
    <div className="relative border border-line bg-ink">
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-white/50">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="focus-ring font-mono text-[11px] text-white/60 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3.5 py-3 text-[12.5px] leading-relaxed text-white/90">
        <code className="font-mono">{text}</code>
      </pre>
    </div>
  );
}

function TableBlock({ headers, rows }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-paper">
            {headers.map((h, i) => (
              <th
                key={i}
                className="border-b border-line px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? "bg-paper/50" : ""}>
              {row.map((cell, ci) => (
                <td key={ci} className="border-b border-line px-3.5 py-2 align-top text-ink-soft">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListBlock({ ordered, items }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`space-y-1.5 pl-5 text-sm text-ink-soft ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}

export default function SectionPanel({ label, sheetCode, content }) {
  const blocks = parseContent(content);

  return (
    <div className="sheet-corner border border-line bg-panel p-6 sm:p-8">
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-4">
        <h3 className="font-display text-base font-semibold text-ink">{label}</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
          {sheetCode}
        </span>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm italic text-ink-muted">
          No content was returned for this section.
        </p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, i) => {
            switch (block.type) {
              case "heading": {
                const sizes = { 2: "text-sm", 3: "text-sm", 4: "text-xs" };
                return (
                  <h4
                    key={i}
                    className={`${sizes[block.level] || "text-sm"} font-display font-semibold text-ink`}
                  >
                    {block.text}
                  </h4>
                );
              }
              case "code":
                return <CodeBlock key={i} language={block.language} text={block.text} />;
              case "table":
                return <TableBlock key={i} headers={block.headers} rows={block.rows} />;
              case "list":
                return <ListBlock key={i} ordered={block.ordered} items={block.items} />;
              case "paragraph":
              default:
                return (
                  <p key={i} className="text-sm leading-relaxed text-ink-soft">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>
      )}
    </div>
  );
}
