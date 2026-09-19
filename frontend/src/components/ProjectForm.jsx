import { useState } from "react";

const NAME_MIN = 4;
const DESC_MIN = 15;

export default function ProjectForm({ onSubmit, disabled }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const nameValid = projectName.trim().length >= NAME_MIN;
  const descValid = description.trim().length >= DESC_MIN;
  const formValid = nameValid && descValid;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!formValid || disabled) return;
    onSubmit({ projectName: projectName.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="sheet-corner border border-line bg-panel p-6 sm:p-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="font-display text-base font-semibold text-ink">
            Project Input
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            Sheet A-01
          </span>
        </div>

        <div className="mb-6">
          <label
            htmlFor="project-name"
            className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Project Name
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. AI Fitness Coach"
            disabled={disabled}
            aria-invalid={touched && !nameValid}
            aria-describedby="project-name-hint"
            className="focus-ring w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p
            id="project-name-hint"
            className={`mt-1.5 font-mono text-[11px] ${
              touched && !nameValid ? "text-danger" : "text-ink-muted"
            }`}
          >
            {touched && !nameValid
              ? `Minimum ${NAME_MIN} characters required.`
              : `Minimum ${NAME_MIN} characters.`}
          </p>
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            Describe Your Project
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Describe the application's functionality, users, technical requirements, integrations, AI components, database requirements, APIs, authentication, deployment requirements, etc."
            disabled={disabled}
            rows={8}
            aria-invalid={touched && !descValid}
            aria-describedby="project-description-hint"
            className="focus-ring w-full resize-y border border-line bg-paper px-3.5 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div
            id="project-description-hint"
            className="mt-1.5 flex items-center justify-between font-mono text-[11px]"
          >
            <span className={touched && !descValid ? "text-danger" : "text-ink-muted"}>
              {touched && !descValid
                ? `Minimum ${DESC_MIN} characters required.`
                : `Minimum ${DESC_MIN} characters.`}
            </span>
            <span className="text-ink-muted">
              {description.trim().length} chars
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!formValid || disabled}
          className="focus-ring mt-7 flex w-full items-center justify-center gap-2 bg-accent px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-ink-muted/40 disabled:text-ink-muted"
        >
          Generate Architecture
        </button>
      </div>
    </form>
  );
}
