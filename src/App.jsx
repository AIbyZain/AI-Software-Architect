import { useState } from "react";
import Header from "./components/Header";
import ProjectForm from "./components/ProjectForm";
import GenerationLoader from "./components/GenerationLoader";
import EmptyState from "./components/EmptyState";
import ErrorBanner from "./components/ErrorBanner";
import ArchitectureResults from "./components/ArchitectureResults";
import ReportsPanel from "./components/ReportsPanel";
import { useArchitectureGenerator } from "./hooks/useArchitectureGenerator";

export default function App() {
  const { status, result, error, generate, reset } = useArchitectureGenerator();
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [lastSubmission, setLastSubmission] = useState(null);

  async function handleSubmit(payload) {
    setLastSubmission(payload);
    const data = await generate(payload);
    if (data) setReportsRefreshKey((k) => k + 1);
  }

  function handleRetry() {
    if (lastSubmission) handleSubmit(lastSubmission);
    else reset();
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <ProjectForm onSubmit={handleSubmit} disabled={status === "loading"} />
          </div>

          <div className="space-y-6">
            {status === "error" && (
              <ErrorBanner message={error} onRetry={handleRetry} />
            )}

            {status === "loading" && <GenerationLoader />}

            {status === "idle" && <EmptyState />}

            {status === "success" && result && (
              <ArchitectureResults
                projectName={result.project_name}
                architecture={result.architecture}
              />
            )}
          </div>
        </div>

        <div className="mt-10">
          <ReportsPanel refreshKey={reportsRefreshKey} />
        </div>
      </main>

      <footer className="border-t border-line py-6">
        <p className="mx-auto max-w-6xl px-6 font-mono text-[11px] text-ink-muted sm:px-8">
          AI Software Architect — internal engineering tool.
        </p>
      </footer>
    </div>
  );
}
