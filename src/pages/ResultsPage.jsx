import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentSection from '../components/DocumentSection';
import ReviewSection from '../components/ReviewSection';
import EmptyState from '../components/EmptyState';
import { SHEETS } from '../utils/sheets';
import { readResultFromSession } from '../hooks/useGenerateArchitecture';
import './ResultsPage.css';

export default function ResultsPage() {
  const location = useLocation();

  const result = useMemo(() => {
    return location.state?.result ?? readResultFromSession();
  }, [location.state]);

  const [activeKey, setActiveKey] = useState(SHEETS[0].key);

  useEffect(() => {
    if (!result) return;
    setActiveKey(SHEETS[0].key);
  }, [result]);

  if (!result) {
    return (
      <div className="results results--empty">
        <EmptyState
          title="No architecture loaded"
          body="There's no generated project in this session yet. Start a new one from the home page."
          action={
            <Link to="/" className="results__empty-cta">
              Go to project form
            </Link>
          }
        />
      </div>
    );
  }

  const architecture = result.architecture ?? {};
  const activeSheet = SHEETS.find((s) => s.key === activeKey);

  return (
    <div className="results">
      <Sidebar
        architecture={architecture}
        activeKey={activeKey}
        onSelect={setActiveKey}
      />
      <div className="results__content scroll-thin">
        {activeSheet.kind === 'score' ? (
          <ReviewSection
            sheet={activeSheet}
            architecture={architecture}
            projectName={result.project_name}
          />
        ) : (
          <DocumentSection
            sheet={activeSheet}
            content={architecture[activeSheet.key]}
            projectName={result.project_name}
          />
        )}
      </div>
    </div>
  );
}
