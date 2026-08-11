import { SHEETS, isSheetEmpty } from '../utils/sheets';
import './Sidebar.css';

export default function Sidebar({ architecture, activeKey, onSelect }) {
  return (
    <nav className="sidebar" aria-label="Architecture sheet index">
      <div className="sidebar__label sheet-number">SHEET INDEX</div>
      <ul className="sidebar__list">
        {SHEETS.map((sheet) => {
          const empty = isSheetEmpty(sheet, architecture);
          const active = sheet.key === activeKey;
          return (
            <li key={sheet.key}>
              <button
                type="button"
                className={`sidebar__item ${active ? 'is-active' : ''} ${
                  empty ? 'is-empty' : ''
                }`}
                onClick={() => onSelect(sheet.key)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="sidebar__code sheet-number">
                  {sheet.code}&middot;{sheet.number}
                </span>
                <span className="sidebar__text">{sheet.label}</span>
                {empty && <span className="sidebar__dot" aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
