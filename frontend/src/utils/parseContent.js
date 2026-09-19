// Transforms a raw string field from the architecture response (e.g.
// `database`, `backend`, `deployment`) into an ordered list of typed
// blocks so the UI can render code, lists, tables and prose distinctly
// instead of dumping raw text on screen.
//
// Block shapes:
//   { type: "heading", level: 2|3, text }
//   { type: "code", language, text }
//   { type: "list", ordered: boolean, items: string[] }
//   { type: "table", headers: string[], rows: string[][] }
//   { type: "paragraph", text }

export function parseContent(raw) {
  if (!raw || typeof raw !== "string" || raw.trim() === "") return [];

  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  const isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line);
  const isTableDivider = (line) =>
    /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes("-");
  const isOrderedItem = (line) => /^\s*\d+[.)]\s+/.test(line);
  const isBulletItem = (line) => /^\s*[-*•]\s+/.test(line);
  const isHeading = (line) => /^\s{0,3}#{1,4}\s+/.test(line);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (/^\s*```/.test(line)) {
      const language = line.trim().replace(/^```/, "").trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", language, text: codeLines.join("\n") });
      continue;
    }

    // Heading
    if (isHeading(line)) {
      const match = line.match(/^\s{0,3}(#{1,4})\s+(.*)$/);
      blocks.push({
        type: "heading",
        level: Math.min(match[1].length + 1, 4),
        text: match[2].trim(),
      });
      i++;
      continue;
    }

    // Table
    if (isTableRow(line) && lines[i + 1] && isTableDivider(lines[i + 1])) {
      const headers = line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(
          lines[i]
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim())
        );
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // Bulleted / ordered list
    if (isBulletItem(line) || isOrderedItem(line)) {
      const ordered = isOrderedItem(line);
      const items = [];
      while (
        i < lines.length &&
        (isBulletItem(lines[i]) || isOrderedItem(lines[i]))
      ) {
        items.push(
          lines[i].replace(/^\s*(\d+[.)]|[-*•])\s+/, "").trim()
        );
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // Indented block that looks like code (4+ leading spaces or tabs,
    // or a high density of code-like symbols) without an explicit fence.
    if (/^(\s{4,}|\t)/.test(line) || /[{};]\s*$/.test(line)) {
      const codeLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        (/^(\s{4,}|\t)/.test(lines[i]) || /[{};=]/.test(lines[i]))
      ) {
        codeLines.push(lines[i]);
        i++;
      }
      if (codeLines.length >= 2) {
        blocks.push({ type: "code", language: "", text: codeLines.join("\n") });
        continue;
      }
      // Fall through to paragraph handling for single ambiguous lines.
    }

    // Paragraph — accumulate until a blank line or a new block starts
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !isHeading(lines[i]) &&
      !/^\s*```/.test(lines[i]) &&
      !isBulletItem(lines[i]) &&
      !isOrderedItem(lines[i]) &&
      !(isTableRow(lines[i]) && lines[i + 1] && isTableDivider(lines[i + 1]))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: paraLines.join(" ").trim() });
  }

  return blocks;
}

// Human-readable labels + display order for known architecture fields.
// Any additional fields the API returns are appended automatically at
// the end using a title-cased version of their key.
export const SECTION_LABELS = {
  requirements: "Requirements",
  database: "Database Architecture",
  backend: "Backend Architecture",
  frontend: "Frontend Architecture",
  api: "API Architecture",
  ai_design: "AI Design",
  deployment: "Deployment",
  timeline: "Timeline",
  cost: "Cost",
};

export const SECTION_ORDER = [
  "requirements",
  "database",
  "backend",
  "frontend",
  "api",
  "ai_design",
  "deployment",
  "timeline",
  "cost",
];

export function titleCase(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
