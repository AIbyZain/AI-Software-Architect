import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EmptyState from './EmptyState';
import './DocumentSection.css';

export default function DocumentSection({ sheet, content, projectName }) {
  const hasContent = typeof content === 'string' && content.trim().length > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="doc-sheet" aria-labelledby={`sheet-${sheet.key}`}>
      <div className="doc-sheet__header">
        <div>
          <div className="sheet-number doc-sheet__eyebrow">
            {sheet.code}&middot;{sheet.number} &mdash; {projectName}
          </div>
          <h2 id={`sheet-${sheet.key}`} className="doc-sheet__title">
            {sheet.label}
          </h2>
        </div>
        {hasContent && (
          <button type="button" className="doc-sheet__print" onClick={handlePrint}>
            Print / Save as PDF
          </button>
        )}
      </div>

      <div className="doc-sheet__paper">
        {hasContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <EmptyState
            title={`No ${sheet.label.toLowerCase()} generated`}
            body="This sheet came back empty from the last run. Re-generate the project, or check the backend logs if this happens consistently."
          />
        )}
      </div>
    </section>
  );
}
