import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useGenerateArchitecture } from '../hooks/useGenerateArchitecture';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { status, error, elapsedMs, run, reset } = useGenerateArchitecture();
  const [pendingName, setPendingName] = useState('');

  const handleSubmit = async ({ projectName, userPrompt }) => {
    setPendingName(projectName);
    try {
      const data = await run({ projectName, userPrompt });
      navigate('/architecture', { state: { result: data } });
    } catch {
      // error state is already set by the hook; stay on this page
    }
  };

  return (
    <div className="home">
      <div className="home__hero">
        <div className="sheet-number home__eyebrow">SHEET SET GENERATOR</div>
        <h1 className="home__title">
          Describe the system.
          <br />
          Get the full drawing set.
        </h1>
        <p className="home__subtitle">
          One prompt in. A ten-sheet architecture set out — requirements,
          database, backend, frontend, API, AI design, deployment, timeline,
          cost, and review — drafted by a multi-agent pipeline behind this API.
        </p>
      </div>

      <div className="home__panel">
        {status === 'loading' ? (
          <LoadingState elapsedMs={elapsedMs} projectName={pendingName || 'your project'} />
        ) : (
          <>
            {status === 'error' && (
              <ErrorState error={error} onRetry={reset} />
            )}
            {status !== 'error' && (
              <ProjectForm onSubmit={handleSubmit} disabled={status === 'loading'} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
