import './ReviewSection.css';

function stringifyMessage(msg) {
  if (typeof msg === 'string') return msg;
  if (msg && typeof msg === 'object') {
    if ('content' in msg) return `${msg.role ? `${msg.role}: ` : ''}${msg.content}`;
    return JSON.stringify(msg);
  }
  return String(msg);
}

export default function ReviewSection({ sheet, architecture, projectName }) {
  const score = architecture?.review_score;
  const hasScore = score !== null && score !== undefined && score !== '';
  const messages = Array.isArray(architecture?.messages) ? architecture.messages : [];

  return (
    <section className="review-sheet" aria-labelledby={`sheet-${sheet.key}`}>
      <div className="review-sheet__header">
        <div className="sheet-number doc-sheet__eyebrow">
          {sheet.code}&middot;{sheet.number} &mdash; {projectName}
        </div>
        <h2 id={`sheet-${sheet.key}`} className="doc-sheet__title">
          {sheet.label}
        </h2>
      </div>

      {hasScore ? (
        <div className="review-score-card">
          <div className="review-score-card__value">{score}</div>
          <div className="review-score-card__label sheet-number">REVIEW SCORE</div>
        </div>
      ) : (
        <div className="review-score-card review-score-card--empty">
          <div className="review-score-card__label sheet-number">
            NO SCORE RETURNED FOR THIS RUN
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="agent-log">
          <div className="agent-log__label sheet-number">AGENT LOG</div>
          <ul className="agent-log__list scroll-thin">
            {messages.map((m, i) => (
              <li key={i}>{stringifyMessage(m)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
